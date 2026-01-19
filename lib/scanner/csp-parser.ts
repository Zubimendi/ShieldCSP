/**
 * CSP Parser and Evaluator
 * Parses Content-Security-Policy headers and evaluates their security
 */

export interface CSPDirective {
  name: string;
  values: string[];
  raw: string;
}

export interface CSPPolicy {
  directives: CSPDirective[];
  raw: string;
  hasUnsafeInline: boolean;
  hasUnsafeEval: boolean;
  hasStrictDynamic: boolean;
  missingDirectives: string[];
  issues: string[];
  recommendations: string[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
}

/**
 * Parses a CSP header string into structured directives
 */
export function parseCSP(cspHeader: string): CSPPolicy {
  const policy: CSPPolicy = {
    directives: [],
    raw: cspHeader,
    hasUnsafeInline: false,
    hasUnsafeEval: false,
    hasStrictDynamic: false,
    missingDirectives: [],
    issues: [],
    recommendations: [],
    grade: 'F',
    score: 0,
  };

  if (!cspHeader || !cspHeader.trim()) {
    policy.issues.push('Empty CSP header');
    policy.recommendations.push('Add a Content-Security-Policy header');
    return policy;
  }

  // Split by semicolon and parse each directive
  const directiveStrings = cspHeader.split(';').map(s => s.trim()).filter(s => s.length > 0);

  for (const directiveStr of directiveStrings) {
    const colonIndex = directiveStr.indexOf(' ');
    if (colonIndex === -1) {
      // Directive with no values (e.g., "upgrade-insecure-requests")
      const name = directiveStr.toLowerCase();
      policy.directives.push({
        name,
        values: [],
        raw: directiveStr,
      });
    } else {
      const name = directiveStr.substring(0, colonIndex).toLowerCase();
      const valuesStr = directiveStr.substring(colonIndex + 1).trim();
      const values = valuesStr.split(/\s+/).filter(v => v.length > 0);

      policy.directives.push({
        name,
        values,
        raw: directiveStr,
      });
    }
  }

  // Analyze the policy
  analyzeCSPPolicy(policy);

  return policy;
}

/**
 * Analyzes a parsed CSP policy for security issues
 */
function analyzeCSPPolicy(policy: CSPPolicy): void {
  let score = 100;
  const directiveMap = new Map<string, CSPDirective>();
  
  for (const directive of policy.directives) {
    directiveMap.set(directive.name, directive);
  }

  // Check for unsafe-inline
  for (const directive of policy.directives) {
    if (directive.values.includes("'unsafe-inline'")) {
      policy.hasUnsafeInline = true;
      score -= 30;
      policy.issues.push(`'unsafe-inline' found in ${directive.name}`);
      policy.recommendations.push(`Remove 'unsafe-inline' from ${directive.name} and use nonces or hashes`);
    }

    if (directive.values.includes("'unsafe-eval'")) {
      policy.hasUnsafeEval = true;
      score -= 20;
      policy.issues.push(`'unsafe-eval' found in ${directive.name}`);
      policy.recommendations.push(`Remove 'unsafe-eval' from ${directive.name}`);
    }

    if (directive.values.includes("'strict-dynamic'")) {
      policy.hasStrictDynamic = true;
      score += 5; // Bonus for strict-dynamic
    }
  }

  // Check for critical missing directives
  const criticalDirectives = [
    'default-src',
    'script-src',
    'object-src',
    'base-uri',
    'frame-ancestors',
  ];

  for (const critical of criticalDirectives) {
    if (!directiveMap.has(critical)) {
      policy.missingDirectives.push(critical);
      score -= 10;
      policy.issues.push(`Missing ${critical} directive`);
      
      if (critical === 'object-src') {
        policy.recommendations.push(`Add object-src 'none' to prevent plugins`);
      } else if (critical === 'base-uri') {
        policy.recommendations.push(`Add base-uri 'self' to prevent base tag injection`);
      } else if (critical === 'frame-ancestors') {
        policy.recommendations.push(`Add frame-ancestors 'none' to prevent clickjacking`);
      } else {
        policy.recommendations.push(`Add ${critical} directive`);
      }
    }
  }

  // Check for upgrade-insecure-requests
  if (!directiveMap.has('upgrade-insecure-requests')) {
    policy.recommendations.push('Add upgrade-insecure-requests to force HTTPS');
  } else {
    score += 5; // Bonus
  }

  // Check for violation reporting
  if (!directiveMap.has('report-uri') && !directiveMap.has('report-to')) {
    score -= 5;
    policy.issues.push('Missing violation reporting');
    policy.recommendations.push('Add report-uri or report-to for violation monitoring');
  }

  // Check for wildcard usage
  for (const directive of policy.directives) {
    if (directive.values.includes('*') && directive.name !== 'img-src') {
      score -= 10;
      policy.issues.push(`Wildcard (*) found in ${directive.name} - too permissive`);
      policy.recommendations.push(`Restrict ${directive.name} to specific sources instead of *`);
    }
  }

  // Calculate grade
  policy.score = Math.max(0, Math.min(100, score));
  policy.grade = scoreToGrade(policy.score);
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

/**
 * Validates if a CSP policy would block a given source
 */
export function wouldBlockSource(
  policy: CSPPolicy,
  directive: string,
  source: string
): boolean {
  const directiveObj = policy.directives.find(d => d.name === directive);
  if (!directiveObj) {
    // Fallback to default-src
    const defaultSrc = policy.directives.find(d => d.name === 'default-src');
    if (!defaultSrc) {
      return false; // No policy, won't block
    }
    return !isSourceAllowed(defaultSrc.values, source);
  }

  return !isSourceAllowed(directiveObj.values, source);
}

/**
 * Checks if a source is allowed by CSP values
 */
function isSourceAllowed(values: string[], source: string): boolean {
  // Check for 'none' - blocks everything
  if (values.includes("'none'")) {
    return false;
  }

  // Check for wildcard
  if (values.includes('*')) {
    return true;
  }

  // Check for exact match
  if (values.includes(source)) {
    return true;
  }

  // Check for scheme match (https:, http:, data:, etc.)
  const sourceScheme = source.split(':')[0];
  if (values.includes(`${sourceScheme}:`)) {
    return true;
  }

  // Check for 'self'
  if (values.includes("'self'")) {
    // Would need to compare against current origin - simplified here
    return true; // Simplified
  }

  // Check for domain match
  for (const value of values) {
    if (source.startsWith(value) || value.includes(source)) {
      return true;
    }
  }

  return false;
}
