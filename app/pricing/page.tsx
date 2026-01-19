'use client';

import Link from 'next/link';
import { Shield, Bell, User, Check, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'Perfect for individual projects and hobbyists.',
    badge: null,
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    buttonColor: 'bg-gray-700 hover:bg-gray-600',
    features: [
      { text: '1 Domain', included: true },
      { text: 'Weekly Scans', included: true },
      { text: 'Basic Violation Reporting', included: true },
      { text: 'AI Remediation Assistant', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For security-focused professionals and small teams.',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-purple-500',
    buttonText: 'Upgrade Now',
    buttonVariant: 'default' as const,
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    features: [
      { text: 'Up to 10 Domains', included: true },
      { text: 'Daily Automated Scans', included: true },
      { text: 'AI Remediation Assistant', included: true },
      { text: 'API Access', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Maximum security and compliance for large organizations.',
    badge: null,
    buttonText: 'Contact Sales',
    buttonVariant: 'default' as const,
    buttonColor: 'bg-[#14b8a6] hover:bg-[#0d9488]',
    features: [
      { text: 'Unlimited Domains', included: true },
      { text: 'Real-time Scanning', included: true },
      { text: 'Advanced AI Forensics', included: true },
      { text: 'Dedicated Account Manager', included: true },
    ],
  },
];

const featureComparison = [
  {
    feature: 'Number of Domains',
    starter: '1 Domain',
    pro: 'Up to 10',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Scan Frequency',
    starter: 'Weekly',
    pro: 'Daily',
    enterprise: 'Real-time / Instant',
  },
  {
    feature: 'AI Assistant Availability',
    starter: '—',
    pro: 'Standard',
    enterprise: 'Advanced',
  },
  {
    feature: 'Violation History',
    starter: '7 Days',
    pro: '90 Days',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Custom Reporting',
    starter: '—',
    pro: '✓',
    enterprise: '✓',
  },
  {
    feature: 'Security Policy Audits',
    starter: 'Basic',
    pro: 'Full',
    enterprise: 'Continuous Compliance',
  },
  {
    feature: 'Team Seats',
    starter: '1',
    pro: '5',
    enterprise: 'Unlimited',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0f2023] text-white">
      {/* Top Navigation Bar */}
      <nav className="border-b border-[#224349] bg-[#0f2023]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#07b6d5] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ShieldCSP</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Inventory
                </Link>
                <Link href="/pricing" className="text-sm text-white border-b-2 border-[#07b6d5] pb-1">
                  Pricing
                </Link>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">ShieldCSP Pricing Plans</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select the tier that matches your security requirements. From solo developers to global enterprises, we protect your assets against modern web vulnerabilities.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-[#162a2e] border-[#224349] ${
                plan.badge ? 'border-purple-500/60 shadow-lg shadow-purple-500/20' : ''
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          plan.name === 'Pro' ? 'text-purple-400' : 'text-green-400'
                        }`} />
                      ) : (
                        <X className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-600" />
                      )}
                      <span className={`${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.buttonColor} text-white`}
                  size="lg"
                >
                  <Link href={plan.name === 'Enterprise' ? '/login' : '/signup'}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Detailed Feature Comparison */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-[#14b8a6]" />
            <h2 className="text-2xl font-bold">Detailed Feature Comparison</h2>
          </div>

          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-400 font-semibold">FEATURES</TableHead>
                      <TableHead className="text-gray-400 font-semibold text-center">Starter</TableHead>
                      <TableHead className="text-gray-400 font-semibold text-center">Pro</TableHead>
                      <TableHead className="text-gray-400 font-semibold text-center">Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureComparison.map((row, index) => (
                      <TableRow key={index} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{row.feature}</TableCell>
                        <TableCell className="text-center text-gray-300">
                          {row.starter === '—' ? (
                            <span className="text-gray-600">—</span>
                          ) : row.starter === '✓' ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            row.starter
                          )}
                        </TableCell>
                        <TableCell className="text-center text-gray-300">
                          {row.pro === '—' ? (
                            <span className="text-gray-600">—</span>
                          ) : row.pro === '✓' ? (
                            <Check className="h-5 w-5 text-purple-400 mx-auto" />
                          ) : (
                            row.pro
                          )}
                        </TableCell>
                        <TableCell className="text-center text-gray-300">
                          {row.enterprise === '—' ? (
                            <span className="text-gray-600">—</span>
                          ) : row.enterprise === '✓' ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            row.enterprise
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#224349] bg-[#0f2023] mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              ShieldCSP Enterprise Edition v2.4
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                Documentation
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                API Keys
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                Support
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 ShieldCSP Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
