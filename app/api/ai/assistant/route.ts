import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { askSecurityAssistant } from "@/lib/ai/assistant"
import { createAuditLogFromNextRequest } from "@/lib/audit"
import { requirePermission } from "@/lib/teams/permissions"

const assistantSchema = z.object({
  question: z.string().min(1),
  teamId: z.string().uuid().optional(),
  domainId: z.string().uuid().optional(),
  includeContext: z.boolean().optional().default(true),
})

// POST /api/ai/assistant
// Ask the ShieldCSP AI assistant for CSP explanations and remediation advice
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const data = assistantSchema.parse(json)

    let cspPolicy: string | undefined
    let headers: Record<string, string> | undefined
    let violationsSummary: string | undefined
    let teamIdForAudit: string | undefined

    // Resolve domain and team context
    if (data.domainId && data.includeContext) {
      const domain = await prisma.domain.findUnique({
        where: { id: data.domainId },
        include: {
          team: true,
        },
      })

      if (domain) {
        teamIdForAudit = domain.teamId

        // Permission check: user must be able to read this team
        await requirePermission(session.user.id, domain.teamId, "team:read")

        // Get latest scan for CSP and headers
        const latestScan = await prisma.scan.findFirst({
          where: {
            domainId: domain.id,
            status: "completed",
          },
          orderBy: {
            scannedAt: "desc",
          },
        })

        if (latestScan) {
          cspPolicy = latestScan.cspPolicy || undefined
          headers = (latestScan.rawHeaders as any) || undefined
        }

        // Get recent violations summary
        const recentViolations = await prisma.violation.findMany({
          where: {
            domainId: domain.id,
          },
          orderBy: {
            lastSeenAt: "desc",
          },
          take: 10,
          select: {
            violatedDirective: true,
            blockedUri: true,
            severity: true,
            lastSeenAt: true,
          },
        })

        if (recentViolations.length > 0) {
          violationsSummary = recentViolations
            .map(
              (v) =>
                `Directive=${v.violatedDirective || "unknown"}, blocked=${v.blockedUri || "N/A"}, severity=${v.severity || "unknown"}, lastSeen=${v.lastSeenAt.toISOString()}`,
            )
            .join("\n")
        }
      }
    }

    // If only teamId provided, ensure user has access
    if (!teamIdForAudit && data.teamId) {
      await requirePermission(session.user.id, data.teamId, "team:read")
      teamIdForAudit = data.teamId
    }

    const answer = await askSecurityAssistant({
      question: data.question,
      context: data.includeContext
        ? {
            cspPolicy,
            headers,
            violationsSummary,
          }
        : undefined,
    })

    // Audit log AI usage
    if (teamIdForAudit) {
      await createAuditLogFromNextRequest(req, {
        teamId: teamIdForAudit,
        userId: session.user.id,
        action: "config:generate",
        resourceType: "config",
        metadata: {
          source: "ai-assistant",
          domainId: data.domainId,
          question: data.question,
        },
      })
    }

    return NextResponse.json({ answer: answer.answer }, { status: 200 })
  } catch (error) {
    console.error("[POST /api/ai/assistant]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: "Failed to process AI assistant request" },
      { status: 500 },
    )
  }
}

