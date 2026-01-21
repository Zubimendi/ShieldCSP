'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Bot,
  Lock,
  Clock,
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  team: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const res = await fetch('/api/audit-logs?limit=200');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load audit logs');
        }
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const total = logs.length;

  const derivedRows = useMemo(
    () =>
      logs.map((log) => {
        const ts = new Date(log.createdAt).toLocaleString();
        const userLabel = log.user?.email || log.user?.name || 'System';
        const ip = log.ipAddress || '—';
        const meta = log.metadata || {};

        // Derive a short action label
        const actionLabel = (() => {
          if (log.action.startsWith('team:')) return 'Team Event';
          if (log.action.startsWith('api-key:')) return 'API Key';
          if (log.action.startsWith('security:violation')) return 'CSP Violation';
          if (log.action.startsWith('security:scan')) return 'Scan Event';
          if (log.action.startsWith('auth:')) return 'Auth Event';
          return log.action;
        })();

        // Very simple status classification
        const status: 'success' | 'warning' | 'failed' = log.action.includes('delete') || log.action.includes('fail')
          ? 'warning'
          : 'success';

        const location =
          (meta.location as string) ||
          (log.team ? `${log.team.name}` : '') ||
          '—';

        return {
          ...log,
          ts,
          userLabel,
          ip,
          actionLabel,
          status,
          location,
        };
      }),
    [logs],
  );

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

          {/* Filters (visual only for now) */}
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
              {loading
                ? 'Loading events…'
                : `Showing ${derivedRows.length} ${derivedRows.length === 1 ? 'event' : 'events'}`}
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
                {loading && (
                  <tr>
                    <td className="px-6 py-6 text-[#8fc3cc]" colSpan={7}>
                      Loading audit events…
                    </td>
                  </tr>
                )}
                {!loading && derivedRows.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-[#8fc3cc]" colSpan={7}>
                      No audit events found for your teams yet.
                    </td>
                  </tr>
                )}
                {!loading &&
                  derivedRows.map((log) => (
                    <tr key={log.id} className="hover:bg-[#224349]/20 transition-colors group">
                      <td className="px-6 py-4 text-white font-medium">{log.ts}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                          {log.actionLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-700" />
                          <span className="text-white">{log.userLabel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[#8fc3cc]">{log.ip}</td>
                      <td className="px-6 py-4 text-[#8fc3cc]">{log.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              log.status === 'success'
                                ? 'bg-emerald-500'
                                : log.status === 'warning'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              log.status === 'success'
                                ? 'text-emerald-500'
                                : log.status === 'warning'
                                  ? 'text-amber-400'
                                  : 'text-rose-500'
                            }`}
                          >
                            {log.status === 'success' ? 'Info' : 'Warning'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#8fc3cc] hover:text-[#07b6d5] transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
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

