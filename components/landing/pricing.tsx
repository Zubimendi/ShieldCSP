'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'COMMUNITY',
    price: '$0',
    period: '/mo',
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    popular: false,
    features: [
      '1 Domain Monitoring',
      'Basic CSP Scanning',
      '7 Days Data Retention',
      'AI Policy Generation',
    ],
  },
  {
    name: 'PROFESSIONAL',
    price: '$49',
    period: '/mo',
    buttonText: 'Go Pro',
    buttonVariant: 'default' as const,
    popular: true,
    features: [
      '10 Domains Monitoring',
      'AI Policy Generation',
      '30 Days Data Retention',
      'API & Webhook Access',
    ],
  },
  {
    name: 'ENTERPRISE',
    price: '$199',
    period: '/mo',
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
    features: [
      'Unlimited Domains',
      'Custom Data Retention',
      'SAML SSO Integration',
      'Dedicated Security Engineer',
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
          Simple, Developer-First Pricing
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Choose the plan that fits your security needs, from side projects to enterprise clusters.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative bg-[#1a1f3a] border-white/10 ${
              plan.popular ? 'border-[#14b8a6]/50 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#14b8a6] text-white">
                POPULAR
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant={plan.buttonVariant}
                className={`w-full ${
                  plan.popular
                    ? 'bg-[#14b8a6] hover:bg-[#0d9488] text-white'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                size="lg"
              >
                <Link href={plan.name === 'ENTERPRISE' ? '/login' : '/signup'}>{plan.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
