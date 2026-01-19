import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withCache, cacheKeys, invalidateDashboardCache } from "@/lib/cache"
import { handleApiError } from "@/lib/errors"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/dashboard/summary
// Aggregated metrics for the main dashboard (security posture)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const teamId = searchParams.get("teamId") || undefined

    // Get user's teams if no specific teamId provided
    let teamIds: string[] = []
    if (!teamId) {
      const userTeams = await prisma.teamMember.findMany({
        where: { userId: session.user.id },
        select: { teamId: true },
      })
      teamIds = userTeams.map(t => t.teamId)
      
      if (teamIds.length === 0) {
        // User has no teams, return empty data
        return NextResponse.json({
          domains: { total: 0 },
          violations: { last24h: 0 },
          scans: { today: 0, recent: [] },
          grades: { distribution: [], latestScore: null },
          trend: { securityScore: [] },
        })
      }
    }

    // Use cache with 5-minute TTL for dashboard data
    const cacheKey = cacheKeys.dashboardSummary(teamId || `user:${session.user.id}`)
    const cached = await withCache(
      cacheKey,
      async () => {
        // Filter by team(s) - either specific teamId or user's teams
        const domainWhere = teamId 
          ? { teamId } 
          : teamIds.length > 0 
            ? { teamId: { in: teamIds } }
            : { id: 'never-match' } // Empty result if no teams

        const [domainCount, activeViolationsCount, scansToday, recentScans] =
          await Promise.all([
            prisma.domain.count({ where: { ...domainWhere, isActive: true } }),
            prisma.violation.count({
              where: {
                domain: domainWhere,
                lastSeenAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
              },
            }),
            prisma.scan.count({
              where: {
                domain: domainWhere,
                scannedAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
            }),
            prisma.scan.findMany({
              where: { domain: domainWhere },
              orderBy: { scannedAt: "desc" },
              take: 20,
              include: {
                domain: {
                  select: { id: true, url: true, name: true },
                },
              },
            }),
          ])

        // Grade distribution by overallGrade
        const gradeAggregation = await prisma.scan.groupBy({
          by: ["overallGrade"],
          _count: { _all: true },
          where: {
            domain: domainWhere,
            overallGrade: { not: null },
          },
        })

        const gradeDistribution = gradeAggregation.map((g) => ({
          grade: g.overallGrade,
          count: g._count._all,
        }))

        // Security score trend: average overallScore per week (last 4 weeks)
        const now = new Date()
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)

        const scoreTrendRaw = await prisma.scan.groupBy({
          by: ["scannedAt"],
          _avg: { overallScore: true },
          where: {
            domain: domainWhere,
            scannedAt: { gte: fourWeeksAgo },
            overallScore: { not: null },
          },
          orderBy: { scannedAt: "asc" },
        })

        const scoreTrend = scoreTrendRaw.map((point) => ({
          date: point.scannedAt,
          score: point._avg.overallScore ?? 0,
        }))

        // Overall score: latest scan average
        const latestScore =
          recentScans.length > 0
            ? recentScans[0].overallScore ?? null
            : null

        return {
          domains: {
            total: domainCount,
          },
          violations: {
            last24h: activeViolationsCount,
          },
          scans: {
            today: scansToday,
            recent: recentScans,
          },
          grades: {
            distribution: gradeDistribution,
            latestScore,
          },
          trend: {
            securityScore: scoreTrend,
          },
        }
      },
      300, // 5 minutes TTL
    )

    return NextResponse.json(cached)
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/dashboard/summary',
      method: 'GET',
      req,
    })
  }
}

