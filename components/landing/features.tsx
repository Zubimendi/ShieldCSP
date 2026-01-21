export function Features() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-24">
      <div className="flex flex-col gap-4 mb-16 items-center text-center">
        <h2 className="text-white text-4xl lg:text-5xl font-black tracking-tight">Enterprise-Grade Protection</h2>
        <p className="text-slate-400 text-lg max-w-[600px]">
          Deploy robust security headers and monitor violations with deep CSP analysis. AI assistant and automated
          policy suggestions are planned for the next major version.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="glass-card p-8 rounded-2xl flex flex-col gap-6 group hover:border-[#07b6d5]/50 transition-all">
          <div className="size-14 rounded-xl bg-[#07b6d5]/10 flex items-center justify-center text-[#07b6d5] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">radar</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-xl font-bold">Real-Time Scanning</h3>
            <p className="text-slate-400 leading-relaxed">Continuous monitoring of script injections and unauthorized resource loading across your entire domain fleet.</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="glass-card p-8 rounded-2xl flex flex-col gap-6 group hover:border-[#07b6d5]/50 transition-all">
          <div className="size-14 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">analytics</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-xl font-bold">Violation Monitor</h3>
            <p className="text-slate-400 leading-relaxed">Visual dashboard of blocked resources and policy violation reports with detailed forensic context.</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="glass-card p-8 rounded-2xl flex flex-col gap-6 group hover:border-[#07b6d5]/50 transition-all">
          <div className="size-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-white text-xl font-bold">AI Fixes</h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#facc15] bg-[#facc15]/10 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Planned AI-powered policy suggestions based on live site behavior and global threat intelligence feeds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
