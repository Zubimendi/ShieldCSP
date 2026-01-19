/**
 * Scan Executor
 * Orchestrates the complete security scan process
 */

import { fetchSecurityHeaders } from './fetch-headers';
import { analyzeSecurityHeaders, HeaderAnalysisResult } from './header-analyzer';
import { parseCSP, CSPPolicy } from './csp-parser';
import { prisma } from '@/lib/prisma';
import { sendNotification } from '@/lib/notifications/service';
import { logSecurityEvent } from '@/lib/audit';

export interface ScanResult {
  success: boolean;
  domainId: string;
  scanId?: string;
  headers?: Record<string, string>;
  analysis?: HeaderAnalysisResult;
  cspPolicy?: CSPPolicy;
  error?: string;
  durationMs?: number;
}

/**
 * Executes a security scan for a domain
 */
export async function executeScan(
  domainId: string,
  scanType: 'full' | 'quick' | 'headers-only' = 'full'
): Promise<ScanResult> {
  const startTime = Date.now();

  try {
    // Fetch domain from database
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: { team: true },
    });

    if (!domain) {
      return {
        success: false,
        domainId,
        error: 'Domain not found',
      };
    }

    // Fetch headers
    const fetchResult = await fetchSecurityHeaders(domain.url, {
      timeout: 15000,
      followRedirects: true,
      maxRedirects: 5,
    });

    if (!fetchResult.success) {
      return {
        success: false,
        domainId,
        error: fetchResult.error || 'Failed to fetch headers',
      };
    }

    // Analyze headers
    const analysis = analyzeSecurityHeaders(fetchResult.headers);

    // Parse CSP if present
    let cspPolicy: CSPPolicy | undefined;
    const cspHeader = fetchResult.headers['content-security-policy'] || 
                     fetchResult.headers['Content-Security-Policy'];
    if (cspHeader) {
      cspPolicy = parseCSP(cspHeader);
    }

    // Create scan record in database
    const scan = await prisma.scan.create({
      data: {
        domainId: domain.id,
        scanType,
        status: 'completed',
        overallGrade: analysis.overallGrade,
        overallScore: analysis.overallScore,
        headersDetected: fetchResult.headers as any,
        securityScore: analysis.overallScore,
        cspPolicy: cspPolicy?.raw || null,
        cspGrade: cspPolicy?.grade || null,
        cspIssues: cspPolicy ? {
          issues: cspPolicy.issues,
          recommendations: cspPolicy.recommendations,
          missingDirectives: cspPolicy.missingDirectives,
          hasUnsafeInline: cspPolicy.hasUnsafeInline,
          hasUnsafeEval: cspPolicy.hasUnsafeEval,
        } : null,
        rawHeaders: fetchResult.headers as any,
        scanDurationMs: Date.now() - startTime,
        scannedAt: new Date(),
      },
    });

    // Create SecurityScore records for each header analyzed
    const securityScores = analysis.headers.map(header => ({
      scanId: scan.id,
      headerName: header.name,
      isPresent: header.isPresent,
      headerValue: header.value,
      score: header.score,
      grade: header.grade,
      issues: header.issues,
      recommendations: header.recommendations,
    }));

    await prisma.securityScore.createMany({
      data: securityScores,
    });

    // Get previous scan score for comparison
    const previousScan = await prisma.scan.findFirst({
      where: {
        domainId: domain.id,
        status: 'completed',
        overallScore: { not: null },
        id: { not: scan.id },
      },
      orderBy: { scannedAt: 'desc' },
      select: { overallScore: true },
    });

    // Update domain's lastScannedAt
    await prisma.domain.update({
      where: { id: domain.id },
      data: { lastScannedAt: new Date() },
    });

    // Audit log scan completion
    await logSecurityEvent(domain.teamId, 'score-change', {
      scanId: scan.id,
      domainId: domain.id,
      score: analysis.overallScore,
      grade: analysis.overallGrade,
      durationMs: Date.now() - startTime,
    });

    // Send notification if score changed significantly
    if (previousScan && previousScan.overallScore !== null) {
      const scoreDiff = analysis.overallScore - previousScan.overallScore;
      if (Math.abs(scoreDiff) >= 5) { // Notify if score changed by 5+ points
        try {
          await sendNotification({
            type: 'score-change',
            teamId: domain.teamId,
            domainId: domain.id,
            domainName: domain.name || domain.url,
            title: `Security Score ${scoreDiff > 0 ? 'Improved' : 'Dropped'}`,
            message: `Security score for ${domain.name || domain.url} ${scoreDiff > 0 ? 'improved' : 'dropped'} from ${previousScan.overallScore} to ${analysis.overallScore} (${scoreDiff > 0 ? '+' : ''}${scoreDiff} points).\n\nGrade: ${analysis.overallGrade}`,
            metadata: {
              previousScore: previousScan.overallScore,
              currentScore: analysis.overallScore,
              change: scoreDiff,
              grade: analysis.overallGrade,
              scanId: scan.id,
            },
          });
        } catch (notifError) {
          console.error('[Scan Executor] Failed to send score change notification:', notifError);
        }
      }
    }

    // Send scan completion notification (optional, for first scan)
    if (!previousScan) {
      try {
        await sendNotification({
          type: 'scan-completion',
          teamId: domain.teamId,
          domainId: domain.id,
          domainName: domain.name || domain.url,
          title: 'Security Scan Completed',
          message: `Initial security scan completed for ${domain.name || domain.url}.\n\nScore: ${analysis.overallScore}/100\nGrade: ${analysis.overallGrade}`,
          metadata: {
            score: analysis.overallScore,
            grade: analysis.overallGrade,
            scanId: scan.id,
            durationMs: Date.now() - startTime,
          },
        });
      } catch (notifError) {
        console.error('[Scan Executor] Failed to send completion notification:', notifError);
      }
    }

    const durationMs = Date.now() - startTime;

    return {
      success: true,
      domainId,
      scanId: scan.id,
      headers: fetchResult.headers,
      analysis,
      cspPolicy,
      durationMs,
    };
  } catch (error: any) {
    // Create failed scan record
    let failedScan;
    try {
      failedScan = await prisma.scan.create({
        data: {
          domainId,
          scanType,
          status: 'failed',
          errorMessage: error.message || 'Unknown error',
          scanDurationMs: Date.now() - startTime,
        },
      });

      // Get domain for notification and audit log
      const domain = await prisma.domain.findUnique({
        where: { id: domainId },
        select: { id: true, name: true, url: true, teamId: true },
      });

      // Audit log scan failure
      if (domain) {
        await logSecurityEvent(domain.teamId, 'scan-failed', {
          scanId: failedScan.id,
          domainId: domain.id,
          error: error.message || 'Unknown error',
          scanType,
        });
      }

      // Send scan failure notification
      if (domain) {
        try {
          await sendNotification({
            type: 'scan-failure',
            teamId: domain.teamId,
            domainId: domain.id,
            domainName: domain.name || domain.url,
            title: 'Security Scan Failed',
            message: `Security scan failed for ${domain.name || domain.url}.\n\nError: ${error.message || 'Unknown error'}`,
            severity: 'high',
            metadata: {
              scanId: failedScan.id,
              error: error.message || 'Unknown error',
              scanType,
            },
          });
        } catch (notifError) {
          console.error('[Scan Executor] Failed to send failure notification:', notifError);
        }
      }
    } catch (dbError) {
      // Ignore DB errors if we can't save the failed scan
      console.error('[Scan Executor] Failed to save failed scan:', dbError);
    }

    return {
      success: false,
      domainId,
      error: error.message || 'Unknown error occurred',
      durationMs: Date.now() - startTime,
    };
  }
}
