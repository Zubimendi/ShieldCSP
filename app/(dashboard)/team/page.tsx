'use client';

import { UserPlus, Users, TrendingUp, Hourglass, Search, Filter, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight, Shield, Sparkles } from 'lucide-react';

export default function TeamManagementPage() {
  return (
    <div className="flex h-full min-h-screen bg-[#0f2023] text-slate-100">
      {/* Main content (sidebar is provided by the dashboard layout) */}
      <main className="flex-1 p-8 flex flex-col gap-8">
        {/* Breadcrumbs & Heading */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-[#8fc3cc]">
            <span className="hover:text-[#07b6d5] transition-colors cursor-default">
              Dashboard
            </span>
            <span className="text-xs">›</span>
            <span className="hover:text-[#07b6d5] transition-colors cursor-default">
              Settings
            </span>
            <span className="text-xs">›</span>
            <span className="text-white">Team Management</span>
          </div>

          <div className="flex justify-between items-end gap-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Team Management
              </h2>
              <p className="text-[#8fc3cc] mt-2 text-sm">
                Scale your security operations. Manage member access, roles, and global
                authentication policies across your organization.
              </p>
            </div>
            <button className="bg-[#07b6d5] hover:bg-[#08c4e7] text-[#0f2023] font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#07b6d5]/30 text-sm">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </button>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Members */}
          <div className="rounded-2xl p-6 flex flex-col gap-4 bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-[#8fc3cc] text-sm font-medium">Total Members</p>
              <div className="text-[#07b6d5] bg-[#07b6d5]/10 p-2 rounded-lg">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24 / 50</p>
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2% from last month
              </p>
            </div>
          </div>

          {/* Pending Invites */}
          <div className="rounded-2xl p-6 flex flex-col gap-4 bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-[#8fc3cc] text-sm font-medium">Pending Invites</p>
              <div className="text-amber-400 bg-amber-400/10 p-2 rounded-lg">
                <Hourglass className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-[#8fc3cc] text-xs mt-1">Awaiting confirmation</p>
            </div>
          </div>

          {/* Seat Usage */}
          <div className="rounded-2xl p-6 flex flex-col gap-3 bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-[#8fc3cc] text-sm font-medium">Seat Usage</p>
              <p className="text-[#07b6d5] text-sm font-bold uppercase">48%</p>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#07b6d5] rounded-full shadow-[0_0_12px_rgba(7,182,213,0.5)]" style={{ width: '48%' }} />
            </div>
            <p className="text-[#8fc3cc] text-xs">
              26 seats remaining in Enterprise plan
            </p>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Member Directory Table */}
          <div className="col-span-12 xl:col-span-8 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-lg text-white">Member Directory</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fc3cc]" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="bg-[#0f2023]/70 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#07b6d5] w-64 placeholder:text-[#8fc3cc]"
                  />
                </div>
                <button className="flex items-center gap-2 text-sm text-[#8fc3cc] border border-white/10 px-3 py-2 rounded-lg hover:bg-white/5">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-[#8fc3cc] text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="px-6 py-4 font-semibold">Name / Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Active</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Row 1 */}
                <tr className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Jordan Dalton</p>
                        <p className="text-xs text-[#8fc3cc]">jordan.d@shieldcsp.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-48">
                      <button className="flex items-center justify-between w-full bg-[#0f2023]/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white">
                        Admin
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#8fc3cc]">2 hours ago</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                        SM
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Sarah Miller</p>
                        <p className="text-xs text-[#8fc3cc]">s.miller@corp.net</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-48">
                      <button className="flex items-center justify-between w-full bg-[#0f2023]/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white">
                        Editor
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      INVITED
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#8fc3cc]">N/A</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        RK
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Ray Kim</p>
                        <p className="text-xs text-[#8fc3cc]">ray.k@security.dev</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-48">
                      <button className="flex items-center justify-between w-full bg-[#0f2023]/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white">
                        Viewer
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#8fc3cc]">4 days ago</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
              <p className="text-xs text-[#8fc3cc]">Showing 3 of 24 members</p>
              <div className="flex gap-2">
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-[#8fc3cc] hover:bg-white/10">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 bg-[#07b6d5]/20 text-[#07b6d5] text-xs font-semibold">
                  1
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-[#8fc3cc] hover:bg-white/10 text-xs">
                  2
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-[#8fc3cc] hover:bg-white/10">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right-side panels */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
            {/* Global Permissions */}
            <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-[#07b6d5]" />
                <h3 className="font-bold text-lg text-white">Global Permissions</h3>
              </div>

              <div className="flex flex-col gap-6">
                {/* Require 2FA */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white">Require 2FA</p>
                    <p className="text-xs text-[#8fc3cc]">
                      Enforce two-factor auth for all team members.
                    </p>
                  </div>
                  <button className="relative w-12 h-6 bg-[#07b6d5] rounded-full flex items-center px-1">
                    <div className="h-4 w-4 bg-white rounded-full translate-x-6" />
                  </button>
                </div>

                {/* IP Whitelisting */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white">IP Whitelisting</p>
                    <p className="text-xs text-[#8fc3cc]">
                      Restrict access to specific corporate IP ranges.
                    </p>
                  </div>
                  <button className="relative w-12 h-6 bg-white/10 rounded-full flex items-center px-1">
                    <div className="h-4 w-4 bg-white/40 rounded-full" />
                  </button>
                </div>

                {/* Session Timeout */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white">Session Timeout</p>
                    <p className="text-xs text-[#8fc3cc]">
                      Force logout after 12 hours of inactivity.
                    </p>
                  </div>
                  <button className="relative w-12 h-6 bg-[#07b6d5] rounded-full flex items-center px-1">
                    <div className="h-4 w-4 bg-white rounded-full translate-x-6" />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 text-white">
                  View Security Logs
                </button>
              </div>
            </div>

            {/* Enterprise Plan Perks */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-[#07b6d5]/30 bg-gradient-to-br from-[#07b6d5]/20 to-transparent">
              <div className="relative z-10">
                <h4 className="text-white font-bold mb-2">Enterprise Plan Perks</h4>
                <p className="text-xs text-[#8fc3cc] mb-4 leading-relaxed">
                  Unlock advanced features like SAML SSO, Custom Role definitions, and Audit Exports.
                </p>
                <button className="bg-[#07b6d5]/20 hover:bg-[#07b6d5]/30 text-[#07b6d5] border border-[#07b6d5]/40 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                  Upgrade Workspace
                </button>
              </div>
              <Sparkles className="absolute -right-4 -bottom-4 h-[120px] w-[120px] text-[#07b6d5]/10 rotate-12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

