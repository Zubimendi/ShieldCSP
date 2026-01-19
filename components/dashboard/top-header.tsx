'use client';

import { useRouter } from 'next/navigation';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TopHeader() {
  const router = useRouter();

  return (
    <div className="flex h-20 items-center justify-between border-b border-[#224349] bg-[#0f2023]/80 backdrop-blur-md px-6">
      {/* Left: Workspace Selector */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-400 uppercase tracking-wider">
            Active Workspace
          </label>
          <Select defaultValue="security-team">
            <SelectTrigger className="w-[220px] border-[#224349] bg-[#0f2023] text-white rounded-lg text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="security-team">Security Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search domains, scans, policies…"
            className="w-full bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc] pl-10"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold"
          onClick={() => router.push('/scanner')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>
    </div>
  );
}
