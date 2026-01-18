import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    label: 'ACTIVE INSTALLS',
    value: '2.5M+',
    change: '+12%',
    changeColor: 'text-green-400',
  },
  {
    label: 'XSS BLOCKED',
    value: '480k',
    change: '+24%',
    changeColor: 'text-green-400',
  },
  {
    label: 'GITHUB STARS',
    value: '12.4k',
    change: '+1.2k',
    changeColor: 'text-green-400',
  },
  {
    label: 'GLOBAL CDN',
    value: '140+',
    subtext: 'Nodes',
    change: null,
  },
];

export function Stats() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#1a1f3a] border-white/10">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  {stat.change && (
                    <span className={`text-sm font-medium ${stat.changeColor} flex items-center gap-1`}>
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  )}
                </div>
                {stat.subtext && (
                  <p className="text-sm text-gray-400">{stat.subtext}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
