import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b1416]">
      <div className="bg-grid">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07b6d5]/10 border border-[#07b6d5]/20 text-[#07b6d5] text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="size-1.5 bg-[#07b6d5] rounded-full animate-pulse"></span>
              V2.4 Platform Release
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Platform Features & Capabilities
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              The industry-leading cybersecurity platform for automated CSP monitoring and XSS prevention, designed for elite technical teams who demand high-fidelity security posture.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {/* Feature 1: Automated CSP Generation */}
            <div className="feature-card gradient-border p-8 rounded-2xl transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="size-14 rounded-xl bg-[#07b6d5]/10 border border-[#07b6d5]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#07b6d5] text-3xl glow-accent">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-white">Automated CSP Generation</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Leverage our proprietary scanning engine to automatically construct robust Content Security Policies. Our system analyzes site behavior and dependency trees to eliminate <code className="text-rose-400 font-mono text-xs">unsafe-inline</code> and <code className="text-rose-400 font-mono text-xs">unsafe-eval</code> vulnerabilities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Heuristic Analysis</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Asset Discovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Real-time Violation Monitoring */}
            <div className="feature-card gradient-border p-8 rounded-2xl transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="size-14 rounded-xl bg-[#07b6d5]/10 border border-[#07b6d5]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#07b6d5] text-3xl glow-accent">analytics</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-white">Real-time Violation Monitoring</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Capture and aggregate <code className="text-sky-400 font-mono text-xs">report-to</code> beacons with sub-second latency. High-fidelity telemetry provides full execution context, including script stack traces and originating line numbers for immediate triage.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Live Telemetry</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Stack Trace Mapping</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: AI-Powered Fix Recommendations */}
            <div className="feature-card gradient-border p-8 rounded-2xl transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="size-14 rounded-xl bg-[#07b6d5]/10 border border-[#07b6d5]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#07b6d5] text-3xl glow-accent">psychology</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Fix Recommendations</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Instantly resolve complex policy violations. Our LLM-trained security models suggest the precise directive adjustments required to block threats while ensuring legitimate 3rd-party integrations remain functional.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">LLM Remediation</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">False-Positive Filter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: XSS Vulnerability Lab */}
            <div className="feature-card gradient-border p-8 rounded-2xl transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="size-14 rounded-xl bg-[#07b6d5]/10 border border-[#07b6d5]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#07b6d5] text-3xl glow-accent">science</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-white">XSS Vulnerability Lab</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    A secure sandboxed environment to stress-test your CSP. Simulate XSS payloads and script-injection scenarios against your actual policy before deploying to production. Validate nonce-based and hash-based protections.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Payload Simulation</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Sandbox Environment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative bg-gradient-to-r from-[#07b6d5]/20 to-transparent border border-white/10 rounded-3xl p-12 overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20 from-[#07b6d5]"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 text-white">Ready to fortify your perimeter?</h3>
              <p className="text-slate-300 mb-10 max-w-xl mx-auto font-medium">
                Join the world's leading security teams and get a technical walkthrough of how ShieldCSP can automate your security header management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-4 bg-[#07b6d5] text-[#0b1416] font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_25px_rgba(7,182,213,0.3)]"
                >
                  Request Demo
                </a>
                <a
                  href="/docs"
                  className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 font-black rounded-xl hover:bg-white/10 transition-all text-white"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
