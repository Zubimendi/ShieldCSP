# ShieldCSP - Advanced XSS Prevention & Security Headers Dashboard

**Enterprise XSS prevention platform with real-time CSP violation monitoring, automated security scanning, and Next.js code generation.**

![ShieldCSP](https://img.shields.io/badge/ShieldCSP-Enterprise-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

ShieldCSP is an all-in-one platform that combines intelligent security scanning, real-time CSP violation monitoring, AI-powered remediation suggestions, and Next.js-specific code generation to help developers implement production-grade XSS protection in minutes.

### Key Features

- 🔍 **Intelligent Security Scanner** - Analyzes 15+ security headers with A-F grading
- 🚨 **Real-Time CSP Violation Monitoring** - Track and analyze violation reports from browsers
- 🛠️ **Next.js Code Generator** - Generate production-ready middleware with nonces/hashes
- 🧪 **XSS Testing Laboratory** - Test payloads against different CSP policies
- 📊 **Multi-Domain Dashboard** - Track unlimited domains with historical analytics
- 🤖 **AI-Powered Assistant** - Get natural language explanations and fix suggestions

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
- **Framework**: Next.js 15.1.6 (App Router)
- **Language**: TypeScript 5.7+ (strict mode)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS 4.0
- **Charts**: Recharts 2.x
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 20.x + Edge Runtime
- **API**: Next.js App Router API routes
- **ORM**: Prisma 6.x with PostgreSQL
- **Authentication**: NextAuth.js v5 (GitHub OAuth)
- **Validation**: Zod schemas

### Security & Analysis
- **HTML Sanitization**: DOMPurify 3.x
- **CSP Parsing**: Custom engine + Google CSP Evaluator
- **XSS Detection**: Pattern matching + DOM analysis

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
- `POST /api/scan` - Trigger manual scan
- `GET /api/scans/[id]` - Get scan results

### CSP Violation Reporting
- `POST /api/csp-report` - Receive violation reports (public endpoint)

### Code Generation
- `POST /api/generate/middleware` - Generate middleware code

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
