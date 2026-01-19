/**
 * CSP Violation Report Endpoint
 * Public endpoint that receives CSP violation reports from browsers
 * 
 * This endpoint should be added to the report-uri or report-to directive
 * in the CSP header: report-uri /api/csp-report
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendNotification } from "@/lib/notifications/service"
import { logSecurityEvent } from "@/lib/audit"
import crypto from "crypto"

interface CSPViolationReport {
  "csp-report": {
    "document-uri": string
    "referrer"?: string
    "violated-directive"?: string
    "effective-directive"?: string
    "original-policy"?: string
    "disposition"?: "enforce" | "report"
    "blocked-uri"?: string
    "status-code"?: number
    "source-file"?: string
    "line-number"?: number
    "column-number"?: number
    "script-sample"?: string
  }
}

/**
 * POST /api/csp-report
 * Receives CSP violation reports from browsers
 * This is a public endpoint (no auth required) as browsers will POST here
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Handle both Content-Security-Policy-Report-Only and standard format
    const report = body["csp-report"] || body

    if (!report) {
      return NextResponse.json(
        { error: "Invalid report format" },
        { status: 400 }
      )
    }

    const documentUri = report["document-uri"] || report["documentUri"]
    if (!documentUri) {
      return NextResponse.json(
        { error: "Missing document-uri" },
        { status: 400 }
      )
    }

    // Extract domain from document-uri
    let domainUrl: string
    try {
      const url = new URL(documentUri)
      domainUrl = `${url.protocol}//${url.host}`
    } catch {
      return NextResponse.json(
        { error: "Invalid document-uri format" },
        { status: 400 }
      )
    }

    // Find or create domain
    // For now, we'll try to find an existing domain, or create a placeholder
    // In production, you'd want to match this to a team's domain
    let domain = await prisma.domain.findFirst({
      where: {
        url: {
          startsWith: domainUrl,
        },
      },
    })

    // If domain doesn't exist, we still log the violation but mark it as orphaned
    // In production, you might want to auto-create domains or have a different strategy
    if (!domain) {
      // Try to find by hostname only
      const hostname = new URL(domainUrl).hostname
      domain = await prisma.domain.findFirst({
        where: {
          url: {
            contains: hostname,
          },
        },
      })
    }

    // Create violation record
    const violation = await prisma.violation.create({
      data: {
        domainId: domain?.id || "00000000-0000-0000-0000-000000000000", // Placeholder if no domain
        documentUri: documentUri,
        blockedUri: report["blocked-uri"] || report["blockedUri"] || null,
        violatedDirective: report["violated-directive"] || report["violatedDirective"] || null,
        effectiveDirective: report["effective-directive"] || report["effectiveDirective"] || null,
        originalPolicy: report["original-policy"] || report["originalPolicy"] || null,
        disposition: report["disposition"] || "enforce",
        referrer: report["referrer"] || null,
        sourceFile: report["source-file"] || report["sourceFile"] || null,
        lineNumber: report["line-number"] || report["lineNumber"] || null,
        columnNumber: report["column-number"] || report["columnNumber"] || null,
        statusCode: report["status-code"] || report["statusCode"] || null,
        userAgent: req.headers.get("user-agent") || null,
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   null,
        severity: calculateSeverity(
          report["violated-directive"] || report["violatedDirective"],
          report["blocked-uri"] || report["blockedUri"]
        ),
      },
    })

    // Update or create violation pattern
    let isNewPattern = false;
    if (violation.violatedDirective && violation.blockedUri) {
      const patternHash = crypto
        .createHash("sha256")
        .update(`${violation.violatedDirective}:${violation.blockedUri}`)
        .digest("hex")

      const existingPattern = await prisma.violationPattern.findUnique({
        where: { patternHash },
      });

      if (!existingPattern) {
        isNewPattern = true;
      }

      await prisma.violationPattern.upsert({
        where: { patternHash },
        create: {
          domainId: domain?.id || "00000000-0000-0000-0000-000000000000",
          patternHash,
          violatedDirective: violation.violatedDirective,
          blockedUri: violation.blockedUri,
          occurrenceCount: 1,
          firstOccurrence: new Date(),
          lastOccurrence: new Date(),
          severity: violation.severity,
        },
        update: {
          occurrenceCount: { increment: 1 },
          lastOccurrence: new Date(),
          severity: violation.severity || undefined,
        },
      })
    }

    // Send notification and audit log if domain exists and this is a new pattern or first occurrence
    if (domain && (isNewPattern || violation.violationCount === 1)) {
      // Audit log security event
      await logSecurityEvent(domain.teamId, 'violation-detected', {
        violationId: violation.id,
        domainId: domain.id,
        violatedDirective: violation.violatedDirective,
        blockedUri: violation.blockedUri,
        severity: violation.severity,
        documentUri: violation.documentUri,
      });

      try {
        await sendNotification({
          type: 'violation',
          teamId: domain.teamId,
          domainId: domain.id,
          domainName: domain.name || domain.url,
          title: 'New CSP Violation Detected',
          message: `A new CSP violation was detected on ${domain.name || domain.url}.\n\nViolated Directive: ${violation.violatedDirective || 'Unknown'}\nBlocked URI: ${violation.blockedUri || 'N/A'}\nSeverity: ${violation.severity || 'Unknown'}`,
          severity: violation.severity || 'medium',
          metadata: {
            violationId: violation.id,
            documentUri: violation.documentUri,
            sourceFile: violation.sourceFile,
            lineNumber: violation.lineNumber,
            columnNumber: violation.columnNumber,
          },
        });
      } catch (notifError) {
        // Don't fail the request if notification fails
        console.error('[CSP Report] Failed to send notification:', notifError);
      }
    }

    // Return 204 No Content (standard for violation reporting)
    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    console.error("[POST /api/csp-report]", error)
    
    // Still return 204 to prevent browsers from retrying/reporting errors
    // Log the error for debugging
    return new NextResponse(null, { status: 204 })
  }
}

/**
 * Calculates severity based on violated directive and blocked URI
 */
function calculateSeverity(
  violatedDirective: string | null | undefined,
  blockedUri: string | null | undefined
): "low" | "medium" | "high" | "critical" | null {
  if (!violatedDirective) return null

  const directive = violatedDirective.toLowerCase()

  // Critical: script-src violations (XSS risk)
  if (directive.includes("script-src") || directive.includes("script")) {
    return "critical"
  }

  // High: style-src, object-src, base-uri violations
  if (
    directive.includes("style-src") ||
    directive.includes("object-src") ||
    directive.includes("base-uri")
  ) {
    return "high"
  }

  // Medium: img-src, font-src, connect-src violations
  if (
    directive.includes("img-src") ||
    directive.includes("font-src") ||
    directive.includes("connect-src")
  ) {
    return "medium"
  }

  // Low: other directives
  return "low"
}
