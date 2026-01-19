# Domain Scanning Guide

## How Domain Scanning Works

### Overview
ShieldCSP performs **security header analysis** on domains. It doesn't detect phishing directly, but analyzes how well-protected a domain is against XSS and other attacks through its security headers.

### What Gets Scanned

1. **HTTP Security Headers** - The scanner fetches headers from the domain and analyzes:
   - `Content-Security-Policy` (CSP) - Most important for XSS prevention
   - `Strict-Transport-Security` (HSTS) - Forces HTTPS
   - `X-Frame-Options` - Prevents clickjacking
   - `X-Content-Type-Options` - Prevents MIME sniffing
   - `Referrer-Policy` - Controls referrer information
   - `Permissions-Policy` - Controls browser features
   - And 9+ more security headers

2. **CSP Analysis** - If a CSP header exists, it's parsed and evaluated for:
   - `unsafe-inline` usage (major security risk)
   - `unsafe-eval` usage (security risk)
   - Missing critical directives
   - Weak or permissive policies

3. **Grading System** - Each header gets a grade (A-F) and score (0-100):
   - **A/A+**: Excellent security (90-100)
   - **B**: Good security (70-89)
   - **C**: Fair security (50-69)
   - **D**: Poor security (30-49)
   - **F**: Critical issues (0-29)

### What to Expect: Legitimate vs Phishing URLs

#### Legitimate Websites (e.g., `google.com`, `github.com`, `stripe.com`)
**Expected Results:**
- **Grade: A or A+** (85-100 score)
- Strong CSP policy (no `unsafe-inline`)
- HSTS header present
- Multiple security headers configured
- Low or zero critical issues

**Example:**
```
Score: 95/100
Grade: A+
Headers Present: 12/15
Critical Issues: 0
```

#### Phishing/Malicious Websites
**Expected Results:**
- **Grade: D or F** (0-49 score)
- Missing CSP header OR weak CSP with `unsafe-inline`
- Missing HSTS (often HTTP only)
- Few or no security headers
- Multiple critical issues

**Example:**
```
Score: 25/100
Grade: F
Headers Present: 2/15
Critical Issues: 8
Issues: 
  - Missing Content-Security-Policy
  - Missing Strict-Transport-Security
  - Missing X-Frame-Options
  - Missing X-Content-Type-Options
```

### Why This Works

**Legitimate sites** invest in security:
- They configure proper CSP policies
- They enable HSTS for HTTPS enforcement
- They set multiple security headers
- They follow OWASP best practices

**Phishing sites** typically:
- Don't configure security headers (or use weak ones)
- Often use `unsafe-inline` in CSP (easier to inject scripts)
- May not use HTTPS properly
- Don't follow security best practices

### How to Test

1. **Add a Domain:**
   - Go to `/domains` page
   - Click "Add Domain"
   - Enter URL (e.g., `google.com` or `example-phishing-site.com`)
   - Domain will be added to your account

2. **Scan the Domain:**
   - Go to `/scanner` page
   - Enter the domain URL
   - Click "RUN SCAN"
   - Wait 3-10 seconds for results

3. **View Results:**
   - See grade and score immediately
   - Check the "Recent Scans" table on dashboard
   - Click domain name to see detailed analysis

### What the Scanner Does (Step-by-Step)

1. **Fetches Headers** (`fetch-headers.ts`):
   - Makes HTTP/HTTPS request to domain
   - Follows redirects (up to 5)
   - Collects all response headers
   - Timeout: 15 seconds

2. **Analyzes Headers** (`header-analyzer.ts`):
   - Checks each security header
   - Grades each header (A-F)
   - Calculates weighted score
   - Identifies missing headers

3. **Parses CSP** (`csp-parser.ts`):
   - Parses CSP policy string
   - Detects `unsafe-inline`, `unsafe-eval`
   - Checks for missing directives
   - Provides recommendations

4. **Calculates Overall Score**:
   - Weighted average of all headers
   - CSP gets 25% weight (most important)
   - HSTS gets 15% weight
   - Other headers weighted accordingly

5. **Saves Results**:
   - Creates scan record in database
   - Stores all headers and analysis
   - Updates domain's `lastScannedAt`
   - Triggers notifications if score changed

### Interpreting Results

**High Score (A/A+):**
- Well-protected against XSS
- Follows security best practices
- Likely legitimate site

**Low Score (D/F):**
- Vulnerable to XSS attacks
- Missing critical security headers
- Could be phishing OR just poorly configured

**Important Note:**
- Low score doesn't **prove** it's phishing
- High score doesn't **prove** it's legitimate
- Use scores as **one indicator** among many

### Testing Phishing Domains

When testing known phishing domains:

1. **Expected Pattern:**
   - Very low scores (0-40)
   - Missing CSP or weak CSP
   - No HSTS
   - Multiple critical issues

2. **What to Look For:**
   - `unsafe-inline` in CSP (red flag)
   - Missing `script-src` directive
   - No security headers at all
   - HTTP instead of HTTPS

3. **Compare Results:**
   - Scan a legitimate site (e.g., `github.com`)
   - Scan a known phishing site
   - Compare scores and issues
   - Notice the difference in header configuration

### Limitations

The scanner:
- ✅ Analyzes security headers (excellent for XSS prevention)
- ✅ Detects weak CSP policies
- ✅ Identifies missing security headers
- ❌ Does NOT detect phishing content
- ❌ Does NOT analyze page content
- ❌ Does NOT check domain reputation
- ❌ Does NOT verify SSL certificates

**For phishing detection**, you'd need:
- Content analysis
- Domain reputation checks
- Machine learning models
- URL pattern analysis

This tool focuses on **security posture** - how well a site protects against XSS and other attacks through headers.
