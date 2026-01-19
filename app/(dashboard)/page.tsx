interface ScanWithDomain {
  id: string
  domainId: string
  overallScore: number | null
  overallGrade: string | null
  status: string
  scannedAt: Date | string | null
  domain: {
    id: string
    url: string
    name: string | null
  } | null
}

async function getDashboardData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const summaryRes = await fetch(`${baseUrl}/api/dashboard/summary`, {
      cache: 'no-store',
    })
    const scansRes = await fetch(`${baseUrl}/api/scans?limit=10`, {
      cache: 'no-store',
    })

    if (!summaryRes.ok || !scansRes.ok) {
      throw new Error('Failed to fetch dashboard data')
    }

    const summary = await summaryRes.json()
    const scansData = await scansRes.json()

    return {
      summary,
      recentScans: scansData.scans || [],
    }
  } catch (error) {
    console.error('[Dashboard] Error fetching data:', error)
    return {
      summary: {
        domains: { total: 0 },
        violations: { last24h: 0 },
        scans: { today: 0 },
        grades: { distribution: [], latestScore: null },
        trend: { securityScore: [] },
      },
      recentScans: [],
    }
  }
}

function calculateAverageGrade(distribution: Array<{ grade: string | null; count: number }>): string {
  if (distribution.length === 0) return 'N/A'
  
  const gradeValues: Record<string, number> = {
    'A+': 6, 'A': 5, 'B+': 4, 'B': 4, 'C': 3, 'D': 2, 'F': 1
  }
  
  let totalWeight = 0
  let totalCount = 0
  
  distribution.forEach(({ grade, count }) => {
    if (grade && gradeValues[grade]) {
      totalWeight += gradeValues[grade] * count
      totalCount += count
    }
  })
  
  if (totalCount === 0) return 'N/A'
  
  const avgValue = totalWeight / totalCount
  if (avgValue >= 5.5) return 'A+'
  if (avgValue >= 5) return 'A'
  if (avgValue >= 4) return 'B+'
  if (avgValue >= 3.5) return 'B'
  if (avgValue >= 3) return 'C'
  if (avgValue >= 2) return 'D'
  return 'F'
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Healthy' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Critical' },
    running: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Scanning...' },
    pending: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Pending' },
  }
  
  const style = statusMap[status] || statusMap.pending
  return (
    <span className={`px-2 py-1 rounded-full ${style.bg} ${style.text} text-[10px] font-black uppercase tracking-tight`}>
      {style.label}
    </span>
  )
}

function getGradeBadge(grade: string | null) {
  if (!grade || grade === 'N/A') {
    return (
      <span className="h-8 w-8 inline-flex items-center justify-center rounded bg-slate-100/10 text-slate-400 font-bold border border-[#224349] text-xs italic">
        ?
      </span>
    )
  }
  
  const isGood = ['A+', 'A', 'B+', 'B'].includes(grade)
  const bgColor = isGood ? 'bg-[#07b6d5]/10' : 'bg-red-500/10'
  const textColor = isGood ? 'text-[#07b6d5]' : 'text-red-500'
  const borderColor = isGood ? 'border-[#07b6d5]/20' : 'border-red-500/20'
  
  return (
    <span className={`h-8 w-8 inline-flex items-center justify-center rounded ${bgColor} ${textColor} font-bold border ${borderColor} text-xs`}>
      {grade}
    </span>
  )
}

export default async function DashboardPage() {
  const { summary, recentScans } = await getDashboardData()
  
  const totalDomains = summary.domains?.total || 0
  const activeViolations = summary.violations?.last24h || 0
  const scansToday = summary.scans?.today || 0
  const gradeDistribution = summary.grades?.distribution || []
  const latestScore = summary.grades?.latestScore || null
  const averageGrade = calculateAverageGrade(gradeDistribution)
  const trend = summary.trend?.securityScore || []

  // Calculate grade distribution for chart
  const gradeCounts: Record<string, number> = {
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
  }
  
  gradeDistribution.forEach(({ grade, count }: { grade: string | null; count: number }) => {
    if (grade && gradeCounts.hasOwnProperty(grade)) {
      gradeCounts[grade] = count
    }
  })
  
  const totalSites = Object.values(gradeCounts).reduce((a, b) => a + b, 0)
  
  // Calculate donut chart segments
  const circumference = 2 * Math.PI * 40 // radius = 40
  const aPlusPercent = totalSites > 0 ? (gradeCounts['A+'] / totalSites) * 100 : 0
  const aPercent = totalSites > 0 ? (gradeCounts['A'] / totalSites) * 100 : 0
  const bPercent = totalSites > 0 ? (gradeCounts['B'] / totalSites) * 100 : 0
  const cPercent = totalSites > 0 ? (gradeCounts['C'] / totalSites) * 100 : 0
  const fPercent = totalSites > 0 ? (gradeCounts['F'] / totalSites) * 100 : 0
  
  const aPlusOffset = 0
  const aOffset = -((aPlusPercent / 100) * circumference)
  const bOffset = -((aPlusPercent + aPercent) / 100) * circumference
  const cOffset = -((aPlusPercent + aPercent + bPercent) / 100) * circumference
  const fOffset = -((aPlusPercent + aPercent + bPercent + cPercent) / 100) * circumference

  // Format trend data for line chart (simplified - using last 4 weeks)
  const trendPoints: Array<{ date: Date | string; score: number }> = trend.slice(-4) || []
  const trendScores = trendPoints.map((p) => p.score || 0)
  const trendMax = trendScores.length > 0 ? Math.max(...trendScores, 100) : 100
  const trendMin = trendScores.length > 0 ? Math.min(...trendScores, 0) : 0

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
                <h3 className="text-3xl font-bold mt-1">{totalDomains}</h3>
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
                <span className="text-2xl font-black text-[#07b6d5] italic">{averageGrade}</span>
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Average Grade</p>
                <p className="text-xs text-[#7b8f97] mt-1 italic leading-tight">
                  {latestScore ? `Score: ${Math.round(latestScore)}/100` : 'No scans yet'}
                </p>
              </div>
            </div>

            {/* Active Violations */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex flex-col justify-between group hover:border-red-500/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">warning</span>
                </div>
                {activeViolations > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase animate-pulse">
                    Critical
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Active Violations</p>
                <h3 className="text-3xl font-bold mt-1">{activeViolations}</h3>
              </div>
            </div>

            {/* Scans Today */}
            <div className="bg-[#162a2e] border border-[#224349] p-6 rounded-xl flex flex-col justify-between group hover:border-[#07b6d5]/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-slate-500/10 text-slate-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </div>
                <span className="text-xs font-bold text-slate-400">Today</span>
              </div>
              <div>
                <p className="text-sm text-[#8ca7af] font-medium">Scans Today</p>
                <h3 className="text-3xl font-bold mt-1">{scansToday.toLocaleString()}</h3>
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
                    {totalSites > 0 && (
                      <>
                        {gradeCounts['A+'] > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#07b6d5"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${(aPlusPercent / 100) * circumference} ${circumference}`}
                            strokeDashoffset={aPlusOffset}
                          />
                        )}
                        {gradeCounts['A'] > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#00d2ff"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${(aPercent / 100) * circumference} ${circumference}`}
                            strokeDashoffset={aOffset}
                          />
                        )}
                        {gradeCounts['B'] > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#224349"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${(bPercent / 100) * circumference} ${circumference}`}
                            strokeDashoffset={bOffset}
                          />
                        )}
                        {gradeCounts['C'] > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#fbbf24"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${(cPercent / 100) * circumference} ${circumference}`}
                            strokeDashoffset={cOffset}
                          />
                        )}
                        {gradeCounts['F'] > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#f43f5e"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${(fPercent / 100) * circumference} ${circumference}`}
                            strokeDashoffset={fOffset}
                          />
                        )}
                      </>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{totalSites}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.16em]">
                      Sites
                    </span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#07b6d5]" />
                    <span className="text-sm text-slate-300">A+ - Excellent</span>
                    <span className="ml-auto font-bold text-xs">{gradeCounts['A+']}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00d2ff]" />
                    <span className="text-sm text-slate-300">A - Good</span>
                    <span className="ml-auto font-bold text-xs">{gradeCounts['A']}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#224349]" />
                    <span className="text-sm text-slate-300">B - Fair</span>
                    <span className="ml-auto font-bold text-xs">{gradeCounts['B']}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#f43f5e]" />
                    <span className="text-sm text-slate-300">F - Critical</span>
                    <span className="ml-auto font-bold text-xs">{gradeCounts['F']}</span>
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
                  <span className="text-2xl font-black text-[#07b6d5]">
                    {latestScore ? `${Math.round(latestScore)}/100` : 'N/A'}
                  </span>
                  {trendPoints.length >= 2 && (
                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 rounded-lg">
                      {trendPoints[trendPoints.length - 1].score > trendPoints[0].score ? '+' : ''}
                      {Math.round(((trendPoints[trendPoints.length - 1].score - trendPoints[0].score) / (trendPoints[0].score || 1)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-h-[250px] relative mt-4">
                {trendPoints.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#07b6d5" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#07b6d5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M${trendPoints.map((p, i) => {
                        const x = trendPoints.length > 1 ? (i / (trendPoints.length - 1)) * 800 : 0
                        const y = 200 - ((p.score - trendMin) / (trendMax - trendMin || 1)) * 180
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')} V200 H0 Z`}
                      fill="url(#chartGradient)"
                    />
                    <path
                      d={`M${trendPoints.map((p, i) => {
                        const x = trendPoints.length > 1 ? (i / (trendPoints.length - 1)) * 800 : 0
                        const y = 200 - ((p.score - trendMin) / (trendMax - trendMin || 1)) * 180
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}`}
                      fill="none"
                      stroke="#07b6d5"
                      strokeWidth="3"
                    />
                    {trendPoints.map((p, i) => {
                      const x = trendPoints.length > 1 ? (i / (trendPoints.length - 1)) * 800 : 0
                      const y = 200 - ((p.score - trendMin) / (trendMax - trendMin || 1)) * 180
                      return <circle key={i} cx={x} cy={y} r="4" fill="#07b6d5" />
                    })}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No trend data available
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-10">
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                </div>
              </div>
              <div className="flex justify-between mt-4 px-2">
                {trendPoints.length >= 4 ? (
                  <>
                    <span className="text-[10px] font-bold text-slate-500">WEEK 1</span>
                    <span className="text-[10px] font-bold text-slate-500">WEEK 2</span>
                    <span className="text-[10px] font-bold text-slate-500">WEEK 3</span>
                    <span className="text-[10px] font-bold text-slate-500">WEEK 4</span>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500">Last {trendPoints.length} weeks</span>
                )}
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
                  {recentScans.length > 0 ? (
                    recentScans.map((scan: ScanWithDomain) => {
                      const domain = scan.domain
                      const score = scan.overallScore || 0
                      const grade = scan.overallGrade || null
                      const status = scan.status || 'pending'
                      const isRunning = status === 'running' || status === 'pending'
                      
                      return (
                        <tr key={scan.id} className="hover:bg-[#183034] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{domain?.url || 'Unknown'}</span>
                              <span className="text-xs text-slate-400">{domain?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {scan.scannedAt ? formatTimeAgo(scan.scannedAt) : 'Never'}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(status)}
                          </td>
                          <td className="px-6 py-4">
                            {getGradeBadge(grade)}
                          </td>
                          <td className="px-6 py-4">
                            {isRunning ? (
                              <>
                                <div className="w-24 bg-[#224349] rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-[#07b6d5] h-full rounded-full animate-[pulse_2s_infinite]"
                                    style={{ width: '65%' }}
                                  />
                                </div>
                                <span className="text-[10px] mt-1 block font-bold">In Progress</span>
                              </>
                            ) : (
                              <>
                                <div className="w-24 bg-[#224349] rounded-full h-1.5">
                                  <div
                                    className={`h-full rounded-full ${score >= 80 ? 'bg-[#07b6d5]' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                                  />
                                </div>
                                <span className="text-[10px] mt-1 block font-bold">{Math.round(score)}/100</span>
                              </>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base">
                                refresh
                              </button>
                              <a
                                href={`/domains/${domain?.id || ''}`}
                                className="cursor-pointer material-symbols-outlined text-slate-400 hover:text-[#07b6d5] transition-colors text-base"
                              >
                                visibility
                              </a>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No scans yet. Start scanning your domains to see results here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
