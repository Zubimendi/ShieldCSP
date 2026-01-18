import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShieldCSP - Stop XSS Attacks Before They Start',
  description: 'Automated Content Security Policy (CSP) management for modern web applications. Scan, monitor, and fix vulnerabilities in real-time with enterprise-grade precision.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
