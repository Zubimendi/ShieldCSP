import Link from 'next/link';
import { Shield, Mail, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#14b8a6] flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">ShieldCSP</span>
            </Link>
            <p className="text-sm text-gray-400">
              Elite cybersecurity platform protecting modern web apps from XSS and injection attacks.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/scanner" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                  Analyzer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/violations" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                  Monitoring
                </Link>
              </li>
              <li>
                <Link href="/dashboard/codegen" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                  AI Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#security" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Github className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2024 ShieldCSP Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#terms" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
              Terms
            </Link>
            <Link href="#privacy" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
              Privacy
            </Link>
            <Link href="#cookies" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
