# ShieldCSP - Advanced XSS Prevention & Security Headers Dashboard

**Enterprise XSS prevention platform with real-time CSP violation monitoring, automated security scanning, and Next.js code generation.**

![ShieldCSP](https://img.shields.io/badge/ShieldCSP-Enterprise-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

ShieldCSP is an all-in-one platform that combines intelligent security scanning, real-time CSP violation monitoring, AI-powered remediation suggestions, and Next.js-specific code generation to help developers implement production-grade XSS protection in minutes.

### Key Features

- 🔍 **Intelligent Security Scanner** – Server-side header analysis for 15+ security headers with A–F grading
- 🚨 **Real-Time CSP Violation Monitoring** – Ingest and explore browser `report-uri` / `report-to` violation data
- 🛠️ **Security Headers Code Generator** – Generate server-side middleware (Next.js / Node.js) that applies strong CSP + security headers to your own apps
- 🧪 **XSS Testing Laboratory** – An interactive, *simulated* lab to explore how XSS payloads behave under different CSP strategies
- 📊 **Multi-Domain Dashboard** – Track multiple domains and historical scan/violation data across teams
- 🤖 **AI-Powered Assistant** – Natural-language explanations and remediation suggestions for misconfigurations

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Neon, Railway, or local)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shield-csp.git
cd shield-csp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and other config

# Set up database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
shield-csp/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Dashboard route group
│   │   ├── dashboard/        # Main dashboard
│   │   ├── scanner/          # Security scanner
│   │   ├── violations/       # CSP violations monitoring
│   │   ├── codegen/          # Code generator
│   │   └── xss-lab/          # XSS testing lab
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── dashboard/            # Dashboard-specific components
│   ├── scanner/              # Scanner components
│   ├── violations/           # Violations components
│   ├── codegen/              # Code generator components
│   ├── xss-lab/              # XSS lab components
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── data/                 # Dummy data generators
│   ├── types/                # TypeScript type definitions
│   └── utils.ts              # Utility functions
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript 5.7+ (strict mode)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS 4.0
- **Charts**: Recharts 2.x
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 20.x (Node.js runtime + App Router)
- **API**: Next.js App Router API routes (`app/api/**/route.ts`)
- **ORM**: Prisma 6.x with PostgreSQL
- **Authentication**: NextAuth.js v4 (JWT sessions + GitHub OAuth)
- **Session Model**: JWT strategy with 12‑hour `maxAge` and 1‑hour `updateAge` (users are periodically forced to re‑authenticate)
- **Validation**: Zod schemas

### Security & Analysis
- **HTML Sanitization**: DOMPurify 3.x
- **CSP Parsing**: Custom parser + heuristics inspired by Google CSP Evaluator
- **Header Grading**: Weighted scoring per header (CSP/HSTS/XFO/etc.) with A–F and 0–100 scores
- **XSS Testing**: Simulated payload evaluation via `lib/xss/engine` and the XSS Lab UI

## 🧩 How ShieldCSP Fits Into Your Stack

ShieldCSP is designed as a companion security service that runs **alongside** your applications, not inside them:

1. **Dashboard & APIs (this repo)**  
   A Next.js App Router app you deploy (e.g. to Vercel). It hosts:
   - `/dashboard`, `/scanner`, `/violations`, `/codegen`, `/xss-lab`, `/team`, `/audit-logs`
   - API routes under `/api/**` for scans, codegen, teams, XSS tests, violations, etc.

2. **Server-Side Scanning**  
   The scanner (`/api/scans`) runs entirely on the server:
   - `executeScan` (`lib/scanner/scan-executor.ts`) uses `fetchSecurityHeaders` to call the target domain from the server.
   - `analyzeSecurityHeaders` and `parseCSP` compute per-header scores and an overall grade.
   - Results are stored in `prisma.scan` + `security_scores` and exposed back to the UI via `/api/scans` and `/api/domains/[id]`.

3. **Security Middleware for Your Apps**  
   The **Code Generator** (`/codegen` + `/api/codegen`) produces *server-side middleware* you paste into your own apps:
   - For **Next.js App Router**, you generate a `middleware.ts` file that wraps `NextRequest`/`NextResponse` and sets CSP/HSTS/XFO/Referrer-Policy/Permissions-Policy headers on every request.
   - For **Pages Router / Express / generic Node.js**, you generate an Express-style middleware (`(req, res, next)`) that sets the same headers on responses.
   - This is how ShieldCSP actually protects traffic: the generated code runs in your app’s process and enforces headers on every request.

4. **CSP Violation Ingestion**  
   - Browsers send CSP reports to your deployment’s `/api/csp-report` endpoint.
   - The handler normalizes and stores `violation` + `violation_patterns` records for analysis in the **Violations** and **Audit Logs** views.

5. **Teams & Access Control**  
   - Users authenticate via NextAuth (GitHub OAuth or email/password).
   - A `team` represents a workspace; all `domains`, `scans`, `violations`, `generated_configs`, and `xss_tests` are scoped to a team.
   - The `proxy.ts` middleware uses `getToken` from `next-auth/jwt` to protect dashboard routes (`/dashboard`, `/scanner`, `/codegen`, `/xss-lab`, `/violations`, `/teams`, etc.) and redirect unauthenticated users to `/login`.

### Database & Caching
- **Primary DB**: PostgreSQL 16
- **Cache**: Upstash Redis (Edge-compatible)

## 📚 Features Documentation

### Security Scanner

Analyze any domain's HTTP security headers:

- **15+ Security Headers Analyzed**:
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS)
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
  - Cross-Origin-Embedder-Policy (COEP)
  - Cross-Origin-Opener-Policy (COOP)
  - Cross-Origin-Resource-Policy (CORP)
  - And more...

- **Grading System**: A-F scale based on OWASP guidelines
- **Detailed Scoring**: 0-100 points per header
- **Actionable Recommendations**: Specific fixes for each issue

### CSP Violation Monitoring

Real-time monitoring of CSP violation reports:

- **Violation Dashboard**: Track all violations with severity classification
- **Pattern Detection**: Automatically group similar violations
- **Historical Tracking**: See violation trends over time
- **Export & Reporting**: Generate PDF/CSV reports

### Code Generator

Generate production-ready security headers code:

- **Framework Support**:
  - Next.js App Router
  - Next.js Pages Router
  - Express.js
  - Generic Node.js

- **CSP Strategies**:
  - Nonce-based
  - Hash-based
  - Strict-dynamic

- **Features**:
  - Live preview of generated headers
  - Copy to clipboard
  - Download as file
  - Inline documentation

### XSS Testing Laboratory

Test XSS payloads in a safe environment:

- **Payload Library**: 500+ known XSS vectors
- **Custom Payloads**: Test your own payloads
- **CSP Testing**: See how CSP blocks different payloads
- **DOMPurify Integration**: Test sanitization effectiveness
- **Educational Mode**: Learn why payloads succeed/fail

## 🗄️ Database Schema

The project uses PostgreSQL with Prisma ORM. Key tables:

- `users` - User accounts
- `teams` - Team workspaces
- `domains` - Monitored domains
- `scans` - Security scan results
- `violations` - CSP violation reports
- `violation_patterns` - Aggregated violation patterns
- `generated_configs` - Generated code configurations
- `xss_tests` - XSS test results

See `prisma/schema.prisma` for the complete schema.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/shieldcsp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenAI (for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Redis (for caching)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Railway / Other Platforms

1. Connect your repository
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy

## 🧪 Development

```bash
# Run development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 API Routes

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Domain Management
- `GET /api/domains` - List domains
- `POST /api/domains` - Create domain
- `GET /api/domains/[id]` - Get domain details
- `PATCH /api/domains/[id]` - Update domain
- `DELETE /api/domains/[id]` - Delete domain

### Security Scanning
- `GET /api/scans?domainId=<id>&limit=50` – List recent scans (optionally filtered by domain)
- `POST /api/scans` – Trigger a synchronous scan and create a `scan` record

### CSP Violation Reporting
- `POST /api/csp-report` – Receive CSP violation reports from browsers (public endpoint)

### Code Generation
- `POST /api/codegen` – Generate middleware code for a given framework/strategy (optionally save config)
- `GET /api/codegen` – List previously generated configs for the current user/team

### Teams & Members
- `GET /api/teams` – List teams for the current user (with role and member counts)
- `POST /api/teams` – Create a new team
- `GET /api/teams/[teamId]` – Get team details
- `PATCH /api/teams/[teamId]` – Update team name/plan
- `DELETE /api/teams/[teamId]` – Delete a team (owner only)
- `GET /api/teams/[teamId]/members` – List team members
- `POST /api/teams/[teamId]/members` – Add a member by email and role

### XSS Tests
- `GET /api/xss-tests?teamId=<id>` – List recent XSS tests (optional filter by team)
- `POST /api/xss-tests` – Create a new XSS test via the modeled XSS engine

See the PRD for complete API documentation.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OWASP](https://owasp.org/) for security guidelines
- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/) for CSP analysis

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for the security community**
