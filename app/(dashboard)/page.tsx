export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0f2023] text-white">
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {/* Section Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Security Posture</h2>
            <p className="text-[#8ca7af] mt-1">
              Real-time monitoring across your enterprise ecosystem.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Domains */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex flex-col justify-between group hover:border-[#07b6d5]/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-[#2563eb]/10 text-[#60a5fa] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">language</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">+4%</span>
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Total Domains</p>
                <h3 className="text-3xl font-bold mt-1">124</h3>
              </div>
            </div>

            {/* Average Grade */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex items-center gap-6 group hover:border-[#07b6d5]/60 transition-colors">
              <div className="h-16 w-16 rounded-full border-4 border-[#07b6d5]/20 flex items-center justify-center relative">
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <circle
                    className="text-[#07b6d5]"
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="140 175.9"
                  />
                </svg>
                <span className="text-2xl font-black text-[#07b6d5] italic">B+</span>
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Average Grade</p>
                <p className="text-xs text-[#7b8f97] mt-1 italic leading-tight">
                  Post-remediation target: A-
                </p>
              </div>
            </div>

            {/* Active Violations */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex flex-col justify-between group hover:border-red-500/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">warning</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase animate-pulse">
                  Critical
                </span>
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Active Violations</p>
                <h3 className="text-3xl font-bold mt-1">12</h3>
              </div>
            </div>

            {/* Scans Today */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex flex-col justify-between group hover:border-[#07b6d5]/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-slate-500/10 text-slate-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </div>
                <span className="text-xs font-bold text-slate-400">Target: 2k</span>
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Scans Today</p>
                <h3 className="text-3xl font-bold mt-1">1,402</h3>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Donut Chart */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Grade Distribution</h3>
                <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative h-48 w-48">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#224349"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#07b6d5"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="140 251.2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#00d2ff"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="60 251.2"
                      strokeDashoffset={-140}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f43f5e"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="20 251.2"
                      strokeDashoffset={-200}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">124</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.16em]">
                      Sites
                    </span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#07b6d5]" />
                    <span className="text-sm text-slate-300">A - Excellent</span>
                    <span className="ml-auto font-bold text-xs">42</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00d2ff]" />
                    <span className="text-sm text-slate-300">B - Good</span>
                    <span className="ml-auto font-bold text-xs">56</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#224349]" />
                    <span className="text-sm text-slate-300">C - Fair</span>
                    <span className="ml-auto font-bold text-xs">18</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#f43f5e]" />
                    <span className="text-sm text-slate-300">F - Critical</span>
                    <span className="ml-auto font-bold text-xs">8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="xl:col-span-2 bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg">Security Score Trend</h3>
                  <p className="text-xs text-slate-400">Post-scan analysis for 30-day interval</p>
                </div>
                <div className="flex gap-2 items-baseline">
                  <span className="text-2xl font-black text-[#07b6d5]">88/100</span>
                  <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 rounded-lg">
                    +5%
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] relative mt-4">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#07b6d5" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#07b6d5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 150 Q100 120 200 140 T400 60 T600 80 T800 30 V200 H0 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M0 150 Q100 120 200 140 T400 60 T600 80 T800 30"
                    fill="none"
                    stroke="#07b6d5"
                    strokeWidth="3"
                  />
                  <circle cx="400" cy="60" r="4" fill="#07b6d5" />
                  <circle cx="800" cy="30" r="4" fill="#07b6d5" />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-10">
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                </div>
              </div>
              <div className="flex justify-between mt-4 px-2">
                <span className="text-[10px] font-bold text-slate-500">WEEK 1</span>
                <span className="text-[10px] font-bold text-slate-500">WEEK 2</span>
                <span className="text-[10px] font-bold text-slate-500">WEEK 3</span>
                <span className="text-[10px] font-bold text-slate-500">WEEK 4</span>
              </div>
            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="bg-[#162a2e] border border-[#224349] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#224349] flex items-center justify-between">
              <h3 className="font-bold text-lg">Recent Scans</h3>
              <div className="flex gap-2">
                <button className="cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg bg-[#07b6d5] hover:brightness-110 text-[#102023] transition-all shadow-lg shadow-[#07b6d5]/10">
                  Export CSV
                </button>
                <button className="cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg bg-[#07b6d5] hover:brightness-110 text-[#102023] transition-all shadow-lg shadow-[#07b6d5]/10">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f2023] text-[10px] uppercase font-black text-slate-400 tracking-[0.16em]">
                  <tr>
                    <th className="px-6 py-4">Domain Name</th>
                    <th className="px-6 py-4">Last Scan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#224349]">
                  <tr className="hover:bg-[#183034] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">api.enterprise.shield.com</span>
                        <span className="text-xs text-slate-400">Production</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">2 mins ago</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-tight">
                        Healthy
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="h-8 w-8 inline-flex items-center justify-center rounded bg-[#07b6d5]/10 text-[#07b6d5] font-bold border border-[#07b6d5]/20 text-xs">
                        A+
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-[#224349] rounded-full h-1.5">
                        <div className="bg-[#07b6d5] h-full rounded-full" style={{ width: '98%' }} />
                      </div>
                      <span className="text-[10px] mt-1 block font-bold">98/100</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                          refresh
                        </button>
                        <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                          visibility
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#183034] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">beta.legacy-app.io</span>
                        <span className="text-xs text-slate-400">Staging</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">1 hour ago</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-tight">
                        Critical
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="h-8 w-8 inline-flex items-center justify-center rounded bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-xs">
                        D-
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-[#224349] rounded-full h-1.5">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '32%' }} />
                      </div>
                      <span className="text-[10px] mt-1 block font-bold">32/100</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                          refresh
                        </button>
                        <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                          visibility
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#183034] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">portal.customer.io</span>
                        <span className="text-xs text-slate-400">Internal</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">4 hours ago</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-tight">
                        Scanning...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="h-8 w-8 inline-flex items-center justify-center rounded bg-slate-100/10 text-slate-400 font-bold border border-[#224349] text-xs italic">
                        ?
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-[#224349] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#07b6d5] h-full rounded-full animate-[pulse_2s_infinite]"
                          style={{ width: '65%' }}
                        />
                      </div>
                      <span className="text-[10px] mt-1 block font-bold">In Progress</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                          refresh
                        </button>
                        <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                          visibility
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
