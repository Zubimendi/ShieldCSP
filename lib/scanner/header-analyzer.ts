/**
 * Security Header Analyzer
 * Analyzes HTTP security headers and provides A-F grading based on OWASP guidelines
 */

export interface SecurityHeader {
  name: string;
  value: string | null;
  isPresent: boolean;
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: string[];
  recommendations: string[];
}

export interface HeaderAnalysisResult {
  headers: SecurityHeader[];
  overallScore: number; // 0-100
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  totalHeadersAnalyzed: number;
  headersPresent: number;
  criticalIssues: number;
}

/**
 * Analyzes all security headers from raw HTTP headers
 */
export function analyzeSecurityHeaders(rawHeaders: Record<string, string>): HeaderAnalysisResult {
  const headers: SecurityHeader[] = [];
  
  // Normalize header names (case-insensitive)
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawHeaders)) {
    normalizedHeaders[key.toLowerCase()] = value;
  }

  // Analyze each security header
  headers.push(analyzeCSP(normalizedHeaders['content-security-policy']));
  headers.push(analyzeHSTS(normalizedHeaders['strict-transport-security']));
  headers.push(analyzeXFrameOptions(normalizedHeaders['x-frame-options']));
  headers.push(analyzeXContentTypeOptions(normalizedHeaders['x-content-type-options']));
  headers.push(analyzeReferrerPolicy(normalizedHeaders['referrer-policy']));
  headers.push(analyzePermissionsPolicy(normalizedHeaders['permissions-policy']));
  headers.push(analyzeCOEP(normalizedHeaders['cross-origin-embedder-policy']));
  headers.push(analyzeCOOP(normalizedHeaders['cross-origin-opener-policy']));
  headers.push(analyzeCORP(normalizedHeaders['cross-origin-resource-policy']));
  headers.push(analyzeXSSProtection(normalizedHeaders['x-xss-protection']));
  headers.push(analyzeExpectCT(normalizedHeaders['expect-ct']));
  headers.push(analyzeContentTypeOptions(normalizedHeaders['x-content-type-options']));
  headers.push(analyzePublicKeyPins(normalizedHeaders['public-key-pins']));
  headers.push(analyzeFeaturePolicy(normalizedHeaders['feature-policy']));
  headers.push(analyzeReportTo(normalizedHeaders['report-to']));

  // Calculate overall score (weighted average)
  const weights: Record<string, number> = {
    'Content-Security-Policy': 25, // Most important
    'Strict-Transport-Security': 15,
    'X-Frame-Options': 10,
    'X-Content-Type-Options': 8,
    'Referrer-Policy': 8,
    'Permissions-Policy': 8,
    'Cross-Origin-Embedder-Policy': 5,
    'Cross-Origin-Opener-Policy': 5,
    'Cross-Origin-Resource-Policy': 5,
    'X-XSS-Protection': 3,
    'Expect-CT': 2,
    'Public-Key-Pins': 1,
    'Feature-Policy': 2,
    'Report-To': 3,
  };

  let totalWeight = 0;
  let weightedScore = 0;
  let criticalIssues = 0;

  for (const header of headers) {
    const weight = weights[header.name] || 1;
    totalWeight += weight;
    weightedScore += header.score * weight;
    
    if (header.grade === 'F' || header.grade === 'D') {
      criticalIssues++;
    }
  }

  const overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const overallGrade = scoreToGrade(overallScore);
  const headersPresent = headers.filter(h => h.isPresent).length;

  return {
    headers,
    overallScore,
    overallGrade,
    totalHeadersAnalyzed: headers.length,
    headersPresent,
    criticalIssues,
  };
}

/**
 * Analyzes Content-Security-Policy header
 */
function analyzeCSP(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Content-Security-Policy',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.issues.push('CSP header is missing');
    header.recommendations.push('Add Content-Security-Policy header to prevent XSS attacks');
    return header;
  }

  let score = 100;
  const policy = value.toLowerCase();

  // Check for unsafe-inline
  if (policy.includes("'unsafe-inline'")) {
    score -= 30;
    header.issues.push("'unsafe-inline' directive allows inline scripts, increasing XSS risk");
    header.recommendations.push("Remove 'unsafe-inline' and use nonces or hashes instead");
  }

  // Check for unsafe-eval
  if (policy.includes("'unsafe-eval'")) {
    score -= 20;
    header.issues.push("'unsafe-eval' allows eval(), which is dangerous");
    header.recommendations.push("Remove 'unsafe-eval' from script-src");
  }

  // Check for missing default-src
  if (!policy.includes('default-src')) {
    score -= 15;
    header.issues.push('Missing default-src directive');
    header.recommendations.push('Add default-src directive as fallback');
  }

  // Check for missing script-src
  if (!policy.includes('script-src')) {
    score -= 10;
    header.issues.push('Missing script-src directive');
    header.recommendations.push('Add script-src directive to control script execution');
  }

  // Check for object-src
  if (!policy.includes('object-src')) {
    score -= 5;
    header.issues.push('Missing object-src directive');
    header.recommendations.push("Add object-src 'none' to prevent plugins");
  }

  // Check for base-uri
  if (!policy.includes('base-uri')) {
    score -= 5;
    header.issues.push('Missing base-uri directive');
    header.recommendations.push("Add base-uri 'self' to prevent base tag injection");
  }

  // Check for frame-ancestors
  if (!policy.includes('frame-ancestors')) {
    score -= 5;
    header.issues.push('Missing frame-ancestors directive');
    header.recommendations.push("Add frame-ancestors 'none' to prevent clickjacking");
  }

  // Check for upgrade-insecure-requests
  if (policy.includes('upgrade-insecure-requests')) {
    score += 5; // Bonus
  } else {
    header.recommendations.push('Add upgrade-insecure-requests to force HTTPS');
  }

  // Check for report-uri or report-to
  if (!policy.includes('report-uri') && !policy.includes('report-to')) {
    score -= 5;
    header.issues.push('Missing violation reporting');
    header.recommendations.push('Add report-uri or report-to for violation monitoring');
  }

  header.score = Math.max(0, Math.min(100, score));
  header.grade = scoreToGrade(header.score);
  return header;
}

/**
 * Analyzes Strict-Transport-Security (HSTS) header
 */
function analyzeHSTS(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Strict-Transport-Security',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.issues.push('HSTS header is missing');
    header.recommendations.push('Add Strict-Transport-Security header to enforce HTTPS');
    return header;
  }

  let score = 100;
  const policy = value.toLowerCase();

  // Check max-age
  const maxAgeMatch = policy.match(/max-age=(\d+)/);
  if (!maxAgeMatch) {
    score -= 50;
    header.issues.push('Missing max-age parameter');
    header.recommendations.push('Add max-age parameter (recommended: 31536000 for 1 year)');
  } else {
    const maxAge = parseInt(maxAgeMatch[1], 10);
    if (maxAge < 31536000) {
      score -= 20;
      header.issues.push(`max-age is too short (${maxAge} seconds, recommended: 31536000)`);
      header.recommendations.push('Increase max-age to at least 31536000 (1 year)');
    }
  }

  // Check for includeSubDomains
  if (!policy.includes('includesubdomains')) {
    score -= 10;
    header.recommendations.push('Add includeSubDomains to protect all subdomains');
  }

  // Check for preload
  if (!policy.includes('preload')) {
    header.recommendations.push('Consider adding preload for HSTS preload list');
  }

  header.score = Math.max(0, Math.min(100, score));
  header.grade = scoreToGrade(header.score);
  return header;
}

/**
 * Analyzes X-Frame-Options header
 */
function analyzeXFrameOptions(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'X-Frame-Options',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.issues.push('X-Frame-Options header is missing');
    header.recommendations.push("Add X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking");
    return header;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === 'deny') {
    header.score = 100;
    header.grade = 'A';
  } else if (normalized === 'sameorigin') {
    header.score = 80;
    header.grade = 'B';
    header.recommendations.push('Consider using DENY for maximum security');
  } else if (normalized.startsWith('allow-from')) {
    header.score = 60;
    header.grade = 'C';
    header.issues.push('allow-from is deprecated and not widely supported');
    header.recommendations.push('Use DENY or SAMEORIGIN instead');
  } else {
    header.score = 40;
    header.grade = 'D';
    header.issues.push('Invalid X-Frame-Options value');
    header.recommendations.push("Use DENY or SAMEORIGIN");
  }

  return header;
}

/**
 * Analyzes X-Content-Type-Options header
 */
function analyzeXContentTypeOptions(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'X-Content-Type-Options',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.issues.push('X-Content-Type-Options header is missing');
    header.recommendations.push("Add X-Content-Type-Options: nosniff to prevent MIME sniffing");
    return header;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === 'nosniff') {
    header.score = 100;
    header.grade = 'A';
  } else {
    header.score = 50;
    header.grade = 'D';
    header.issues.push('Invalid X-Content-Type-Options value');
    header.recommendations.push("Use nosniff");
  }

  return header;
}

/**
 * Analyzes Referrer-Policy header
 */
function analyzeReferrerPolicy(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Referrer-Policy',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.issues.push('Referrer-Policy header is missing');
    header.recommendations.push("Add Referrer-Policy: strict-origin-when-cross-origin");
    return header;
  }

  const validPolicies = [
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
  ];

  const normalized = value.toLowerCase().trim();
  if (validPolicies.includes(normalized)) {
    if (normalized === 'strict-origin-when-cross-origin' || normalized === 'strict-origin') {
      header.score = 100;
      header.grade = 'A';
    } else if (normalized === 'same-origin' || normalized === 'origin-when-cross-origin') {
      header.score = 85;
      header.grade = 'B';
    } else if (normalized === 'unsafe-url') {
      header.score = 40;
      header.grade = 'D';
      header.issues.push('unsafe-url leaks full URL in referrer');
      header.recommendations.push('Use strict-origin-when-cross-origin for better privacy');
    } else {
      header.score = 70;
      header.grade = 'C';
    }
  } else {
    header.score = 50;
    header.grade = 'D';
    header.issues.push('Invalid Referrer-Policy value');
    header.recommendations.push('Use a valid policy like strict-origin-when-cross-origin');
  }

  return header;
}

/**
 * Analyzes Permissions-Policy header
 */
function analyzePermissionsPolicy(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Permissions-Policy',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.issues.push('Permissions-Policy header is missing');
    header.recommendations.push('Add Permissions-Policy to restrict browser features');
    return header;
  }

  let score = 100;
  const policy = value.toLowerCase();

  // Check for dangerous permissions allowed
  const dangerousPermissions = ['camera', 'microphone', 'geolocation', 'payment'];
  for (const perm of dangerousPermissions) {
    if (policy.includes(`${perm}=*`) || policy.includes(`${perm}=()`)) {
      score -= 20;
      header.issues.push(`${perm} permission is allowed for all origins`);
      header.recommendations.push(`Restrict ${perm} to specific origins or disable it`);
    }
  }

  header.score = Math.max(0, Math.min(100, score));
  header.grade = scoreToGrade(header.score);
  return header;
}

/**
 * Analyzes Cross-Origin-Embedder-Policy header
 */
function analyzeCOEP(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Cross-Origin-Embedder-Policy',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.score = 70; // Not critical, but recommended
    header.grade = 'C';
    header.recommendations.push('Add Cross-Origin-Embedder-Policy: require-corp for enhanced isolation');
    return header;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === 'require-corp' || normalized === 'credentialless') {
    header.score = 100;
    header.grade = 'A';
  } else {
    header.score = 80;
    header.grade = 'B';
    header.issues.push('Invalid COEP value');
  }

  return header;
}

/**
 * Analyzes Cross-Origin-Opener-Policy header
 */
function analyzeCOOP(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Cross-Origin-Opener-Policy',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.score = 70;
    header.grade = 'C';
    header.recommendations.push('Add Cross-Origin-Opener-Policy: same-origin for isolation');
    return header;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === 'same-origin') {
    header.score = 100;
    header.grade = 'A';
  } else if (normalized === 'same-origin-allow-popups') {
    header.score = 90;
    header.grade = 'A';
  } else {
    header.score = 80;
    header.grade = 'B';
  }

  return header;
}

/**
 * Analyzes Cross-Origin-Resource-Policy header
 */
function analyzeCORP(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Cross-Origin-Resource-Policy',
    value: value || null,
    isPresent: !!value,
    score: 0,
    grade: 'F',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.score = 70;
    header.grade = 'C';
    header.recommendations.push('Add Cross-Origin-Resource-Policy: same-origin');
    return header;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === 'same-origin' || normalized === 'same-site') {
    header.score = 100;
    header.grade = 'A';
  } else if (normalized === 'cross-origin') {
    header.score = 50;
    header.grade = 'D';
    header.issues.push('cross-origin allows all origins');
    header.recommendations.push('Use same-origin or same-site for better security');
  } else {
    header.score = 80;
    header.grade = 'B';
  }

  return header;
}

/**
 * Analyzes X-XSS-Protection header (legacy, but still checked)
 */
function analyzeXSSProtection(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'X-XSS-Protection',
    value: value || null,
    isPresent: !!value,
    score: 70, // Default score since it's legacy
    grade: 'C',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.recommendations.push('X-XSS-Protection is legacy; rely on CSP instead');
    return header;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === '1; mode=block') {
    header.score = 80;
    header.grade = 'B';
  } else if (normalized === '0') {
    header.score = 60;
    header.grade = 'C';
    header.issues.push('XSS protection is disabled');
  }

  header.recommendations.push('X-XSS-Protection is deprecated; use CSP instead');
  return header;
}

/**
 * Analyzes Expect-CT header
 */
function analyzeExpectCT(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Expect-CT',
    value: value || null,
    isPresent: !!value,
    score: 70,
    grade: 'C',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.recommendations.push('Expect-CT is deprecated; use Certificate Transparency monitoring instead');
    return header;
  }

  header.score = 80;
  header.grade = 'B';
  header.recommendations.push('Expect-CT is deprecated but still functional');
  return header;
}

/**
 * Analyzes Content-Type-Options (alias check)
 */
function analyzeContentTypeOptions(value: string | undefined): SecurityHeader {
  // This is handled by analyzeXContentTypeOptions, but we check it here too
  return analyzeXContentTypeOptions(value);
}

/**
 * Analyzes Public-Key-Pins header (deprecated)
 */
function analyzePublicKeyPins(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Public-Key-Pins',
    value: value || null,
    isPresent: !!value,
    score: 50,
    grade: 'D',
    issues: [],
    recommendations: [],
  };

  if (value) {
    header.issues.push('Public-Key-Pins is deprecated and should be removed');
    header.recommendations.push('Remove HPKP; use Certificate Transparency instead');
  } else {
    header.score = 100;
    header.grade = 'A';
  }

  return header;
}

/**
 * Analyzes Feature-Policy header (legacy, replaced by Permissions-Policy)
 */
function analyzeFeaturePolicy(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Feature-Policy',
    value: value || null,
    isPresent: !!value,
    score: 70,
    grade: 'C',
    issues: [],
    recommendations: [],
  };

  if (value) {
    header.issues.push('Feature-Policy is deprecated');
    header.recommendations.push('Migrate to Permissions-Policy header');
  }

  return header;
}

/**
 * Analyzes Report-To header
 */
function analyzeReportTo(value: string | undefined): SecurityHeader {
  const header: SecurityHeader = {
    name: 'Report-To',
    value: value || null,
    isPresent: !!value,
    score: 80,
    grade: 'B',
    issues: [],
    recommendations: [],
  };

  if (!value) {
    header.score = 70;
    header.grade = 'C';
    header.recommendations.push('Add Report-To header for violation reporting');
  } else {
    header.score = 100;
    header.grade = 'A';
  }

  return header;
}

/**
 * Converts a score (0-100) to a letter grade
 */
function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
