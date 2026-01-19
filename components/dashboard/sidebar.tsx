'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Shield, LayoutDashboard, Globe, Scan, AlertTriangle, ShieldCheck, FlaskConical, History, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Audit Logs', href: '/audit-logs', icon: History },
  { name: 'Domains', href: '/domains', icon: Globe },
  { name: 'Scans', href: '/scanner', icon: Scan },
  { name: 'Violations', href: '/violations', icon: AlertTriangle },
  { name: 'Policies', href: '/policies', icon: ShieldCheck },
  { name: 'Team', href: '/team', icon: ShieldCheck },
  { name: 'Lab', href: '/xss-lab', icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  const user = session?.user || {
    email: 'user@example.com',
    name: 'User',
    image: null,
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-[#224349] bg-[#0f2023]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#224349] px-6">
        <div className="h-8 w-8 rounded-full bg-[#07b6d5] flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">ShieldCSP</div>
          <div className="text-xs text-gray-400">ENTERPRISE</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#07b6d5] text-[#102023]'
                  : 'text-[#8fc3cc] hover:bg-[#224349] hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t border-[#224349] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
            <AvatarFallback>
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-400">ADMIN</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#224349] bg-[#0f2023] px-3 py-2 text-xs font-semibold text-[#8fc3cc] hover:bg-[#1b2a30] hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
