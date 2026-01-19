/**
 * Code Generator Engine
 * Generates security header middleware code for various frameworks
 */

import type { Framework, CspType, CodeGenOptions, GeneratedCode } from '@/lib/types';

interface GeneratorOptions {
  framework: Framework;
  cspType: CspType;
  enableHsts: boolean;
  hstsMaxAge: number;
  enableFrameOptions: boolean;
  frameOptions: 'DENY' | 'SAMEORIGIN';
  enableContentTypeOptions?: boolean;
  enableReferrerPolicy?: boolean;
  referrerPolicy?: string;
  enablePermissionsPolicy?: boolean;
}

export function generateCode(options: GeneratorOptions): GeneratedCode {
  const {
    framework,
    cspType,
    enableHsts,
    hstsMaxAge,
    enableFrameOptions,
    frameOptions,
    enableContentTypeOptions = true,
    enableReferrerPolicy = true,
    referrerPolicy = 'strict-origin-when-cross-origin',
    enablePermissionsPolicy = true,
  } = options;

  let code = '';
  let filename = '';
  const instructions: string[] = [];
  const headers: Record<string, string> = {};

  // Generate CSP policy based on strategy
  const cspPolicy = generateCspPolicy(cspType);

  // Build headers object for preview
  headers['Content-Security-Policy'] = cspPolicy;
  if (enableHsts) {
    headers['Strict-Transport-Security'] = `max-age=${hstsMaxAge}; includeSubDomains; preload`;
  }
  if (enableFrameOptions) {
    headers['X-Frame-Options'] = frameOptions;
  }
  if (enableContentTypeOptions) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }
  if (enableReferrerPolicy) {
    headers['Referrer-Policy'] = referrerPolicy;
  }
  if (enablePermissionsPolicy) {
    headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()';
  }

  // Generate framework-specific code
  switch (framework) {
    case 'nextjs-app':
      code = generateNextJsAppRouterCode(options, cspPolicy);
      filename = 'middleware.ts';
      instructions.push(
        'Save this file as `middleware.ts` in your project root',
        'Make sure your Next.js version is 13+ (App Router)',
        'Use the nonce in your components: `<script nonce={nonce}>...</script>`',
        'Test your CSP policy using the Scanner tool',
        'Monitor violations using the Violations dashboard'
      );
      break;

    case 'nextjs-pages':
      code = generateNextJsPagesRouterCode(options, cspPolicy);
      filename = 'middleware.ts';
      instructions.push(
        'Save this file as `middleware.ts` in your project root',
        'Import and use in your API routes or pages',
        'Use the nonce in your components: `<script nonce={nonce}>...</script>`',
        'Test your CSP policy using the Scanner tool',
        'Monitor violations using the Violations dashboard'
      );
      break;

    case 'express':
      code = generateExpressCode(options, cspPolicy);
      filename = 'security-headers.js';
      instructions.push(
        'Save this file in your Express project',
        'Import and use as middleware: `app.use(require("./security-headers"))`',
        'Use the nonce from `req.nonce` in your templates',
        'Test your CSP policy using the Scanner tool',
        'Monitor violations using the Violations dashboard'
      );
      break;

    case 'generic':
      code = generateGenericNodeCode(options, cspPolicy);
      filename = 'security-headers.js';
      instructions.push(
        'Save this file in your Node.js project',
        'Import and use as middleware in your HTTP server',
        'Use the nonce from the request object in your templates',
        'Test your CSP policy using the Scanner tool',
        'Monitor violations using the Violations dashboard'
      );
      break;
  }

  return {
    code,
    filename,
    instructions,
    preview: { headers },
  };
}

function generateCspPolicy(cspType: CspType): string {
  const baseDirectives = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
    'block-all-mixed-content',
  ];

  switch (cspType) {
    case 'nonce':
      return [
        ...baseDirectives,
        "script-src 'self' 'nonce-${nonce}' 'strict-dynamic'",
        "style-src 'self' 'nonce-${nonce}'",
      ].join('; ');

    case 'hash':
      return [
        ...baseDirectives,
        "script-src 'self' 'sha256-...' 'strict-dynamic'",
        "style-src 'self' 'sha256-...'",
      ].join('; ');

    case 'strict-dynamic':
      return [
        ...baseDirectives,
        "script-src 'self' 'strict-dynamic'",
        "style-src 'self' 'unsafe-inline'",
      ].join('; ');

    default:
      return baseDirectives.join('; ');
  }
}

function generateNextJsAppRouterCode(options: GeneratorOptions, cspPolicy: string): string {
  const { cspType, enableHsts, hstsMaxAge, enableFrameOptions, frameOptions } = options;

  const nonceGeneration = cspType === 'nonce'
    ? "const nonce = Buffer.from(crypto.randomUUID()).toString('base64');"
    : '';

  const cspHeader = cspType === 'nonce'
    ? cspPolicy.replace(/\$\{nonce\}/g, '${nonce}')
    : cspPolicy;

  return `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  ${nonceGeneration}
  const cspHeader = \`${cspHeader}\`.replace(/\\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  ${cspType === 'nonce' ? "requestHeaders.set('x-nonce', nonce);" : ''}
  requestHeaders.set('Content-Security-Policy', cspHeader);
  ${enableHsts ? `requestHeaders.set(
    'Strict-Transport-Security',
    'max-age=${hstsMaxAge}; includeSubDomains; preload'
  );` : ''}
  ${enableFrameOptions ? `requestHeaders.set('X-Frame-Options', '${frameOptions}');` : ''}
  requestHeaders.set('X-Content-Type-Options', 'nosniff');
  requestHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  requestHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};`;
}

function generateNextJsPagesRouterCode(options: GeneratorOptions, cspPolicy: string): string {
  const { cspType, enableHsts, hstsMaxAge, enableFrameOptions, frameOptions } = options;

  const nonceGeneration = cspType === 'nonce'
    ? "const nonce = Buffer.from(crypto.randomUUID()).toString('base64');"
    : '';

  const cspHeader = cspType === 'nonce'
    ? cspPolicy.replace(/\$\{nonce\}/g, '${nonce}')
    : cspPolicy;

  return `import { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';

export function securityHeaders(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  ${nonceGeneration}
  const cspHeader = \`${cspHeader}\`.replace(/\\s{2,}/g, ' ').trim();

  res.setHeader('Content-Security-Policy', cspHeader);
  ${cspType === 'nonce' ? "res.setHeader('x-nonce', nonce);" : ''}
  ${enableHsts ? `res.setHeader('Strict-Transport-Security', 'max-age=${hstsMaxAge}; includeSubDomains; preload');` : ''}
  ${enableFrameOptions ? `res.setHeader('X-Frame-Options', '${frameOptions}');` : ''}
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  ${cspType === 'nonce' ? '(req as any).nonce = nonce;' : ''}
  next();
}

// Usage in pages/_app.ts or API routes:
// import { securityHeaders } from './middleware';
// securityHeaders(req, res, () => { /* your handler */ });`;
}

function generateExpressCode(options: GeneratorOptions, cspPolicy: string): string {
  const { cspType, enableHsts, hstsMaxAge, enableFrameOptions, frameOptions } = options;

  const nonceGeneration = cspType === 'nonce'
    ? "const nonce = Buffer.from(crypto.randomUUID()).toString('base64');"
    : '';

  const cspHeader = cspType === 'nonce'
    ? cspPolicy.replace(/\$\{nonce\}/g, '${nonce}')
    : cspPolicy;

  return `const express = require('express');

function securityHeaders(req, res, next) {
  ${nonceGeneration}
  const cspHeader = \`${cspHeader}\`.replace(/\\s{2,}/g, ' ').trim();

  res.setHeader('Content-Security-Policy', cspHeader);
  ${cspType === 'nonce' ? "res.setHeader('x-nonce', nonce);" : ''}
  ${enableHsts ? `res.setHeader('Strict-Transport-Security', 'max-age=${hstsMaxAge}; includeSubDomains; preload');` : ''}
  ${enableFrameOptions ? `res.setHeader('X-Frame-Options', '${frameOptions}');` : ''}
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  ${cspType === 'nonce' ? 'req.nonce = nonce;' : ''}
  next();
}

module.exports = securityHeaders;

// Usage:
// const securityHeaders = require('./security-headers');
// app.use(securityHeaders);`;
}

function generateGenericNodeCode(options: GeneratorOptions, cspPolicy: string): string {
  const { cspType, enableHsts, hstsMaxAge, enableFrameOptions, frameOptions } = options;

  const nonceGeneration = cspType === 'nonce'
    ? "const nonce = Buffer.from(crypto.randomUUID()).toString('base64');"
    : '';

  const cspHeader = cspType === 'nonce'
    ? cspPolicy.replace(/\$\{nonce\}/g, '${nonce}')
    : cspPolicy;

  return `const http = require('http');
const https = require('https');

function securityHeaders(req, res, next) {
  ${nonceGeneration}
  const cspHeader = \`${cspHeader}\`.replace(/\\s{2,}/g, ' ').trim();

  res.setHeader('Content-Security-Policy', cspHeader);
  ${cspType === 'nonce' ? "res.setHeader('x-nonce', nonce);" : ''}
  ${enableHsts ? `res.setHeader('Strict-Transport-Security', 'max-age=${hstsMaxAge}; includeSubDomains; preload');` : ''}
  ${enableFrameOptions ? `res.setHeader('X-Frame-Options', '${frameOptions}');` : ''}
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  ${cspType === 'nonce' ? 'req.nonce = nonce;' : ''}
  if (next) next();
}

module.exports = securityHeaders;

// Usage example:
// const securityHeaders = require('./security-headers');
// const server = http.createServer((req, res) => {
//   securityHeaders(req, res, () => {
//     // Your request handler
//   });
// });`;
}
