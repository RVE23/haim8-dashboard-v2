'use client';

import DashboardLayout from '@/components/DashboardLayout';
import KPICards from '@/components/KPICards';
import UKMap from '@/components/UKMap';
import { MoreHorizontal, ArrowUpRight, Search, Loader2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function Dashboard() {
  const { data: directors, stats, loading, error } = useDashboardData();

  const recentLeads = directors.slice(0, 5).map(d => ({
    id: d.id,
    name: d.name,
    company: d.company_name,
    location: d.region,
    status: d.directorStatus,
    score: d.linkedin_confidence_score || 0
  }));

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Error loading dashboard</h2>
            <p className="text-slate-400">{error.message}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* KPI Section */}
        <KPICards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Regional Heatmap</h2>
                  <p className="text-sm text-slate-400">Distribution of leads across the UK</p>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors overflow-hidden">
                  <MoreHorizontal size={20} className="text-slate-400" />
                </button>
              </div>
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : (
                <UKMap data={stats?.regionCounts || {}} />
              )}
            </div>

            {/* Recent Leads Table */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Recent Leads</h2>
                  <p className="text-sm text-slate-400">Latest pipeline activities</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative group overflow-hidden">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-slate-950/50 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all w-48 focus:w-64"
                    />
                  </div>
                  <button className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors overflow-hidden">
                    View All <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                      [1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-4 py-4 h-16 bg-white/5" />
                        </tr>
                      ))
                    ) : (
                      recentLeads.map((lead) => (
                        <tr key={lead.id} className="group hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">{lead.name}</span>
                              <span className="text-xs text-slate-500">{lead.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-300">{lead.company}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${lead.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400' :
                              'bg-slate-400/10 text-slate-400'
                              }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-blue-400 font-semibold">{lead.score}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 overflow-hidden">
              <h3 className="text-lg font-bold mb-2">Upgrade Insights</h3>
              <p className="text-blue-100 text-sm mb-4">You&apos;ve generated {stats?.fullyEnriched || 0} enriched leads. View which regions are performing best.</p>
              <button className="w-full bg-white text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg overflow-hidden">
                View Reports
              </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4">Pipeline Status</h3>
              <div className="space-y-4">
                {[
                  { label: 'Enrichment', progress: stats ? Math.round((stats.fullyEnriched / stats.totalDirectors) * 100) : 0, color: 'bg-blue-500' },
                  { label: 'Asset Match', progress: stats ? Math.round((stats.withAddress / stats.totalDirectors) * 100) : 0, color: 'bg-emerald-500' },
                  { label: 'LinkedIn', progress: stats ? Math.round((stats.linkedInFound / stats.totalDirectors) * 100) : 0, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-medium">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
