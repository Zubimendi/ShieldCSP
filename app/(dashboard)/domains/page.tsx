import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Globe,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { AddDomainDialog } from '@/components/dashboard/add-domain-dialog';

interface DomainWithScan {
  id: string
  teamId: string
  url: string
  name: string | null
  isActive: boolean
  scanFrequency: string
  notifyOnViolations: boolean
  createdAt: Date | string
  lastScannedAt: Date | string | null
  latestScan: {
    id: string
    overallGrade: string | null
    overallScore: number | null
    scannedAt: Date | string | null
    status: string
  } | null
}

async function getDomains(): Promise<DomainWithScan[]> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return []
    }

    // Get user's teams
    const userTeams = await prisma.teamMember.findMany({
      where: { userId: session.user.id },
      select: { teamId: true },
    })

    const teamIds = userTeams.map(t => t.teamId)

    if (teamIds.length === 0) {
      return []
    }

    const domains = await prisma.domain.findMany({
      where: { teamId: { in: teamIds } },
      orderBy: { createdAt: "desc" },
      include: {
        scans: {
          orderBy: { scannedAt: "desc" },
          take: 1,
          select: {
            id: true,
            overallGrade: true,
            overallScore: true,
            scannedAt: true,
            status: true,
          },
        },
      },
    })

    // Transform to include latestScan
    return domains.map((domain) => ({
      ...domain,
      latestScan: domain.scans[0] || null,
      scans: undefined, // Remove scans array
    })) as DomainWithScan[]
  } catch (error) {
    console.error('[Domains] Error fetching data:', error)
    return []
  }
}

const gradeColors: Record<string, string> = {
  'A+': 'bg-green-500 text-white',
  'A': 'bg-green-400 text-white',
  'B': 'bg-yellow-400 text-white',
  'C': 'bg-orange-400 text-white',
  'D': 'bg-red-400 text-white',
  'F': 'bg-red-600 text-white',
};

export default async function DomainsPage() {
  const domainsWithScans: DomainWithScan[] = await getDomains()
  
  return (
    <div className="min-h-screen bg-[#0f2023] p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Domains</h1>
          <p className="text-gray-400 mt-1">
            Manage and monitor your domain security posture
          </p>
        </div>
        <AddDomainDialog />
      </div>

      {/* Search and Filters */}
      <Card className="bg-[#162a2e] border-[#224349]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search domains..."
                className="w-full bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc] pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domains Table */}
      <Card className="bg-[#162a2e] border-[#224349]">
        <CardHeader>
          <CardTitle className="text-white">All Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#224349]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-400">DOMAIN</TableHead>
                  <TableHead className="text-gray-400">STATUS</TableHead>
                  <TableHead className="text-gray-400">LAST SCAN</TableHead>
                  <TableHead className="text-gray-400">GRADE</TableHead>
                  <TableHead className="text-gray-400">SCORE</TableHead>
                  <TableHead className="text-gray-400">FREQUENCY</TableHead>
                  <TableHead className="text-gray-400">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domainsWithScans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      No domains yet. Click &quot;Add Domain&quot; to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  domainsWithScans.map((domain) => (
                    <TableRow 
                    key={domain.id} 
                    className="border-[#224349] hover:bg-white/5/10 cursor-pointer"
                  >
                    <TableCell>
                      <Link 
                        href={`/domains/${domain.id}`}
                        className="flex items-center gap-2 hover:text-[#07b6d5] transition-colors"
                      >
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-white font-medium">{domain.url}</p>
                          <p className="text-sm text-gray-400">{domain.name || 'N/A'}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {domain.isActive ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {domain.lastScannedAt 
                        ? format(new Date(domain.lastScannedAt), 'MMM d, HH:mm')
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge className={gradeColors[domain.latestScan?.overallGrade || 'F']}>
                        {domain.latestScan?.overallGrade || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {domain.latestScan?.overallScore || 0}/100
                          </span>
                        </div>
                        <Progress 
                          value={domain.latestScan?.overallScore || 0} 
                          className="h-2 w-24"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 capitalize">
                      {domain.scanFrequency}
                    </TableCell>
                    <TableCell>
                      <Link href={`/domains/${domain.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Domains</p>
                <p className="text-3xl font-bold text-white">{domainsWithScans.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-white">
                  {domainsWithScans.filter(d => d.isActive).length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Grade</p>
                <p className="text-3xl font-bold text-white">
                  {(() => {
                    const grades = domainsWithScans
                      .map(d => d.latestScan?.overallGrade)
                      .filter(Boolean) as string[];
                    if (grades.length === 0) return 'N/A';
                    // Simple average grade calculation
                    const gradeValues: Record<string, number> = {
                      'A+': 5, 'A': 4, 'B+': 3.5, 'B': 3, 'C': 2, 'D': 1, 'F': 0
                    };
                    const avg = grades.reduce((sum, g) => sum + (gradeValues[g] || 0), 0) / grades.length;
                    const gradeMap = ['F', 'D', 'C', 'B', 'A', 'A+'];
                    return gradeMap[Math.round(avg)] || 'N/A';
                  })()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Score</p>
                <p className="text-3xl font-bold text-white">
                  {domainsWithScans.length === 0 
                    ? 'N/A'
                    : Math.round(
                        domainsWithScans.reduce((sum, d) => sum + (d.latestScan?.overallScore || 0), 0) /
                        domainsWithScans.length
                      )
                  }
                </p>
              </div>
              <Globe className="h-8 w-8 text-[#14b8a6] opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
