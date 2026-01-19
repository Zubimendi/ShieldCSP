'use client';

import { Download, FileSpreadsheet, Calendar, Filter, ExternalLink, ChevronLeft, ChevronRight, Bot, Lock, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <div className="min-h-full bg-[#0f2023] text-white px-8 py-8">
      <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-6">
        {/* Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-white">
              Security Audit Logs
            </h2>
            <p className="text-[#8fc3cc] text-sm md:text-base">
              Real-time visibility into all account-level security events and policy
              modifications.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-[#224349] text-white px-4 py-2 text-xs md:text-sm font-bold hover:bg-[#306069] transition-colors">
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-[#07b6d5] text-[#0f2023] px-4 py-2 text-xs md:text-sm font-bold hover:brightness-110 transition-colors">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tabs & Filters + Table container */}
        <div className="bg-[#102023] rounded-xl border border-[#224349] overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-[#224349] px-6 overflow-x-auto">
            <div className="flex gap-8 min-w-max">
              <button className="border-b-2 border-[#07b6d5] text-white py-4 text-sm font-bold">
                All Activities
              </button>
              <button className="border-b-2 border-transparent text-[#8fc3cc] py-4 text-sm font-bold hover:text-white">
                Login Attempts
              </button>
              <button className="border-b-2 border-transparent text-[#8fc3cc] py-4 text-sm font-bold hover:text-white">
                Policy Changes
              </button>
              <button className="border-b-2 border-transparent text-[#8fc3cc] py-4 text-sm font-bold hover:text-white">
                Scan Events
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 flex flex-wrap justify-between items-center gap-4 bg-[#102023]/70">
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-3 py-2 bg-[#224349] text-[#8fc3cc] rounded-lg text-sm border border-transparent hover:border-[#306069]">
                <Calendar className="h-4 w-4" />
                <span>Oct 24, 2023 - Oct 31, 2023</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-[#224349] text-[#8fc3cc] rounded-lg text-sm border border-transparent hover:border-[#306069]">
                <Filter className="h-4 w-4" />
                <span>All Statuses</span>
              </button>
            </div>
            <div className="text-[#8fc3cc] text-xs md:text-sm whitespace-nowrap">
              Showing 1-15 of 1,284 results
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#224349]/30 text-[#8fc3cc] text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">User/Entity</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#224349] text-sm">
                {/* Row 1 */}
                <tr className="hover:bg-[#224349]/20 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">
                    2023-10-31 14:22:01
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                      CSP Policy Modified
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-700" />
                      <span className="text-white">david.chen@shieldcsp.io</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#8fc3cc]">
                    192.168.1.42
                  </td>
                  <td className="px-6 py-4 text-[#8fc3cc]">San Francisco, US</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-500 font-medium">Success</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-[#07b6d5] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-[#224349]/20 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">
                    2023-10-31 14:18:45
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">
                      Failed Login Attempt
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-700" />
                      <span className="text-white">unknown_entity_401</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#8fc3cc]">45.221.12.8</td>
                  <td className="px-6 py-4 text-[#8fc3cc]">Kyiv, UA</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-rose-500 font-medium">Failed</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-[#07b6d5] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-[#224349]/20 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">
                    2023-10-31 13:55:12
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">
                      Vulnerability Scan
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#07b6d5]/20 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-[#07b6d5]" />
                      </div>
                      <span className="text-white">system_worker_04</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#8fc3cc]">10.0.0.125</td>
                  <td className="px-6 py-4 text-[#8fc3cc]">Internal VPC</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-500 font-medium">Success</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-[#07b6d5] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-[#224349]/20 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">
                    2023-10-31 13:40:22
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-500/10 text-slate-300 border border-slate-500/20 text-xs">
                      Report Exported
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-700" />
                      <span className="text-white">sarah.j@shieldcsp.io</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#8fc3cc]">82.145.2.11</td>
                  <td className="px-6 py-4 text-[#8fc3cc]">London, UK</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="text-amber-400 font-medium">Warning</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-[#07b6d5] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-[#224349]/20 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">
                    2023-10-31 13:12:09
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                      Auth Key Created
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-700" />
                      <span className="text-white">david.chen@shieldcsp.io</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#8fc3cc]">
                    192.168.1.42
                  </td>
                  <td className="px-6 py-4 text-[#8fc3cc]">San Francisco, US</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-500 font-medium">Success</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#8fc3cc] hover:text-[#07b6d5] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#224349] flex flex-wrap items-center justify-between gap-4 bg-[#102023]">
            <div className="flex gap-2 items-center">
              <button
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#224349] text-white hover:bg-[#07b6d5] transition-colors disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#07b6d5] text-[#0f2023] font-bold">
                1
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#224349] text-white hover:bg-[#306069] font-bold">
                2
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#224349] text-white hover:bg-[#306069] font-bold">
                3
              </button>
              <span className="px-2 py-2 text-[#8fc3cc]">...</span>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#224349] text-white hover:bg-[#306069] font-bold">
                86
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#224349] text-white hover:bg-[#07b6d5] transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#8fc3cc] text-sm whitespace-nowrap">
                Go to page
              </span>
              <input
                type="number"
                defaultValue={1}
                className="w-16 bg-[#224349] border-none rounded-lg text-white text-sm focus:ring-2 focus:ring-[#07b6d5] focus:outline-none px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Footer compliance line */}
        <div className="flex flex-wrap justify-between items-center text-[#8fc3cc] text-xs px-1 gap-3">
          <div className="flex flex-wrap gap-6">
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              Secure Audit Logging
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Retention: 365 Days
            </span>
          </div>
          <p className="whitespace-nowrap">
            © 2023 ShieldCSP Enterprise Security. All activity is monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

