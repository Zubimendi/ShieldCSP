'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, Globe, Scan, AlertTriangle, ShieldCheck, FlaskConical, History, LogOut, GroupIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Audit Logs', href: '/audit-logs', icon: History },
  { name: 'Domains', href: '/domains', icon: Globe },
  { name: 'Scans', href: '/scanner', icon: Scan },
  { name: 'Violations', href: '/violations', icon: AlertTriangle },
  { name: 'Policies', href: '/policies', icon: ShieldCheck },
  { name: 'Team', href: '/team', icon: GroupIcon },
  { name: 'Lab', href: '/xss-lab', icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string>('MEMBER');
  
  const user = session?.user || {
    email: 'user@example.com',
    name: 'User',
    image: null,
  };

  useEffect(() => {
    async function fetchUserRole() {
      if (!session?.user?.id) return;
      
      try {
        const res = await fetch('/api/teams');
        if (res.ok) {
          const data = await res.json();
          const teams = data.teams || [];
          
          // Get the highest role from all teams (owner > admin > member > viewer)
          const rolePriority: Record<string, number> = {
            owner: 4,
            admin: 3,
            member: 2,
            viewer: 1,
          };
          
          let highestRole = 'MEMBER';
          let highestPriority = 0;
          
          for (const team of teams) {
            const role = team.userRole;
            if (role) {
              const priority = rolePriority[role] || 0;
              if (priority > highestPriority) {
                highestPriority = priority;
                highestRole = role.toUpperCase();
              }
            }
          }
          
          setUserRole(highestRole);
        }
      } catch (err) {
        console.error('[Sidebar] Failed to fetch user role:', err);
      }
    }
    
    fetchUserRole();
  }, [session?.user?.id]);

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
            <p className="text-xs text-gray-400">{userRole}</p>
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
