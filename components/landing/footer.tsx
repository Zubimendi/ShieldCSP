import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0F1E]/50 pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-[#07b6d5] rounded flex items-center justify-center text-[#0A0F1E]">
                <Shield className="text-sm font-bold" />
              </div>
              <h2 className="text-white text-lg font-black tracking-tight">ShieldCSP</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Elite cybersecurity platform protecting modern web apps from XSS and injection attacks.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Product</h4>
            <Link href="/scanner" className="text-sm text-slate-500 hover:text-[#07b6d5] transition-colors">
              Analyzer
            </Link>
            <Link href="/violations" className="text-sm text-slate-500 hover:text-[#07b6d5] transition-colors">
              Monitoring
            </Link>
            <Link href="/codegen" className="text-sm text-slate-500 hover:text-[#07b6d5] transition-colors">
              AI Generator
            </Link>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Company</h4>
            <Link href="#about" className="text-sm text-slate-500 hover:text-[#07b6d5] transition-colors">
              About Us
            </Link>
            <Link href="#security" className="text-sm text-slate-500 hover:text-[#07b6d5] transition-colors">
              Security
            </Link>
            <Link href="#privacy" className="text-sm text-slate-500 hover:text-[#07b6d5] transition-colors">
              Privacy
            </Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Connect</h4>
            <div className="flex gap-4">
              <Link
                href="mailto:hello@shieldcsp.io"
                className="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </Link>
              <Link
                href="https://github.com/yourusername/shieldcsp"
                className="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">hub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-slate-600">© 2024 ShieldCSP Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#terms" className="text-xs text-slate-600 hover:text-slate-400">
              Terms
            </Link>
            <Link href="#privacy" className="text-xs text-slate-600 hover:text-slate-400">
              Privacy
            </Link>
            <Link href="#cookies" className="text-xs text-slate-600 hover:text-slate-400">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
