import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/dashboard/summary
// Aggregated metrics for the main dashboard (security posture)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const teamId = searchParams.get("teamId") || undefined

    // Filter by team if provided (via domains)
    const domainWhere = teamId ? { teamId } : {}

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

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("[GET /api/dashboard/summary]", error)
    return NextResponse.json(
      { error: "Failed to load dashboard summary" },
      { status: 500 },
    )
  }
}

