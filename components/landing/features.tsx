import { Scan, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Scan,
    iconColor: 'bg-[#14b8a6]',
    title: 'Real-Time Scanning',
    description: 'Continuous monitoring of script injections and unauthorized resource loading across your entire domain fleet.',
  },
  {
    icon: BarChart3,
    iconColor: 'bg-[#a855f7]',
    title: 'Violation Monitor',
    description: 'Visual dashboard of blocked resources and policy violation reports with detailed forensic context.',
  },
  {
    icon: Settings,
    iconColor: 'bg-[#10b981]',
    title: 'AI Fixes',
    description: 'Automated policy generation based on live site behavior and global threat intelligence feeds.',
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
          Enterprise-Grade Protection
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Deploy robust security headers and monitor violations with AI-driven insights that scale with your infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-[#1a1f3a] border-white/10 hover:border-[#14b8a6]/50 transition-colors">
              <CardHeader>
                <div className={`${feature.iconColor} h-12 w-12 rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
