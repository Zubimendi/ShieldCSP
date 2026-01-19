const stats = [
  {
    label: 'ACTIVE INSTALLS',
    value: '2.5M+',
    change: '+12%',
  },
  {
    label: 'XSS BLOCKED',
    value: '480k',
    change: '+24%',
  },
  {
    label: 'GITHUB STARS',
    value: '12.4k',
    change: '+1.2k',
  },
  {
    label: 'GLOBAL CDN',
    value: '140+',
    subtext: 'Nodes',
  },
];

export function Stats() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-12 border-y border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col gap-1">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-3xl font-black">{stat.value}</span>
              {stat.change && (
                <span className="text-green-400 text-sm font-medium leading-none">{stat.change}</span>
              )}
              {stat.subtext && (
                <span className="text-slate-500 text-sm font-medium leading-none">{stat.subtext}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
