'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isFeaturesPage = pathname === '/features';

  if (isFeaturesPage) {
    return (
      <footer className="mt-20 border-t border-white/5 py-16 bg-[#0b1416]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 bg-gradient-to-br from-[#07b6d5] to-cyan-600 rounded-lg flex items-center justify-center text-[#0b1416] shadow-[0_0_15px_rgba(7,182,213,0.2)]">
                <span className="material-symbols-outlined !text-[20px] font-bold">shield_lock</span>
              </div>
              <div className="flex flex-col -gap-1">
                <span className="text-lg font-black tracking-tight leading-none text-white">ShieldCSP</span>
                <span className="text-[7px] font-bold text-[#07b6d5] uppercase tracking-widest leading-none mt-1">Cybersecurity Platform</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Elite-tier Content Security Policy management and XSS prevention for modern web architectures. Built for security engineers, by security engineers.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/violations" className="hover:text-[#07b6d5] transition-colors">Monitoring</Link></li>
              <li><Link href="/policies" className="hover:text-[#07b6d5] transition-colors">Remediation</Link></li>
              <li><Link href="#" className="hover:text-[#07b6d5] transition-colors">API Keys</Link></li>
              <li><Link href="#" className="hover:text-[#07b6d5] transition-colors">Status</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#privacy" className="hover:text-[#07b6d5] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#terms" className="hover:text-[#07b6d5] transition-colors">Terms of Service</Link></li>
              <li><Link href="/docs" className="hover:text-[#07b6d5] transition-colors">Documentation</Link></li>
              <li><Link href="#support" className="hover:text-[#07b6d5] transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2024 ShieldCSP Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-[#07b6d5] transition-colors">
              <span className="material-symbols-outlined text-lg">public</span>
            </Link>
            <Link href="#" className="text-slate-400 hover:text-[#07b6d5] transition-colors">
              <span className="material-symbols-outlined text-lg">terminal</span>
            </Link>
            <Link href="#" className="text-slate-400 hover:text-[#07b6d5] transition-colors">
              <span className="material-symbols-outlined text-lg">code</span>
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  // Default footer for other pages
  return (
    <footer className="border-t border-white/5 bg-[#0A0F1E]/50 pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-[#07b6d5] rounded flex items-center justify-center text-[#0A0F1E]">
                <span className="material-symbols-outlined !text-[16px] font-bold">shield_lock</span>
              </div>
              <h2 className="text-white text-lg font-black tracking-tight">ShieldCSP</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Elite cybersecurity platform protecting modern web apps from XSS and injection attacks.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Product</h4>
            <Link href="/scanner" className="text-sm text-slate-300 hover:text-[#07b6d5] transition-colors">
              Analyzer
            </Link>
            <Link href="/violations" className="text-sm text-slate-300 hover:text-[#07b6d5] transition-colors">
              Monitoring
            </Link>
            <Link href="/codegen" className="text-sm text-slate-300 hover:text-[#07b6d5] transition-colors">
              AI Generator
            </Link>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Company</h4>
            <Link href="#about" className="text-sm text-slate-300 hover:text-[#07b6d5] transition-colors">
              About Us
            </Link>
            <Link href="#security" className="text-sm text-slate-300 hover:text-[#07b6d5] transition-colors">
              Security
            </Link>
            <Link href="#privacy" className="text-sm text-slate-300 hover:text-[#07b6d5] transition-colors">
              Privacy
            </Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Connect</h4>
            <div className="flex gap-4">
              <Link
                href="mailto:offiongfrancis14@gmail.com"
                className="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </Link>
              <Link
                href="https://github.com/Zubimendi/ShieldCSP"
                className="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">hub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-slate-400">
            © 2024 ShieldCSP. Built by <span className="font-semibold text-slate-100">Offiong Francis (0xkali)</span>. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#terms" className="text-xs text-slate-400 hover:text-slate-200">
              Terms
            </Link>
            <Link href="#privacy" className="text-xs text-slate-400 hover:text-slate-200">
              Privacy
            </Link>
            <Link href="#cookies" className="text-xs text-slate-400 hover:text-slate-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
