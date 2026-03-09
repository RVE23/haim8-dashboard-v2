'use client';

import React, { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ScrollText, Activity, Clock, ArrowUpRight } from 'lucide-react';

export default function DailyRecordsPage() {
    const { data: directors, pipelineLog, loading, error } = useDashboardData();

    // Simple grouping of directors by date found to simulate activity feed
    const activityFeed = useMemo(() => {
        const feed: { date: string, type: string, description: string, name: string, company: string }[] = [];

        directors.slice(0, 50).forEach(d => {
            if (d.dateFound) {
                feed.push({
                    date: d.dateFound,
                    type: d.phone || d.email ? 'Success' : 'Enriched',
                    description: d.phone || d.email ? 'Full contact details retrieved' : 'Director profile identified',
                    name: d.name,
                    company: d.company_name
                });
            }
        });

        return feed.sort((a, b) => b.date.localeCompare(a.date));
    }, [directors]);

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Error loading records</h2>
                        <p className="text-slate-400">{error.message}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Daily Records</h1>
                        <p className="text-slate-400 text-sm">Chronological feed of pipeline activities and new discoveries</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                            <Activity size={16} className="text-blue-400" />
                            <span className="text-sm font-medium text-white">{pipelineLog.length} System Events</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-24 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />
                            ))
                        ) : activityFeed.length > 0 ? (
                            activityFeed.map((item, i) => (
                                <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2.5 rounded-xl ${item.type === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            <ScrollText size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold text-white truncate pr-4">{item.name}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 whitespace-nowrap">
                                                    <Clock size={12} />
                                                    {item.date}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium mb-2">{item.description} for <span className="text-slate-300">{item.company}</span></p>
                                            <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View Details <ArrowUpRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center text-slate-500 font-medium bg-slate-900/40 border border-slate-800 rounded-2xl">
                                No recent activity recorded.
                            </div>
                        )}
                    </div>

                    {/* System Logs */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <Activity size={16} className="text-slate-400" />
                                Pipeline History
                            </h3>
                            <div className="space-y-6">
                                {pipelineLog.map((log, i) => (
                                    <div key={i} className="relative pl-6 border-l border-slate-800 pb-6 last:pb-0">
                                        <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`} />
                                        <div className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{log.status}</div>
                                        <div className="text-[10px] text-slate-500 font-medium">{log.timestamp}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl">
                            <h3 className="font-bold mb-2">Real-time Sync</h3>
                            <p className="text-xs text-indigo-100 leading-relaxed mb-4">Pipeline is currently monitoring the Gazette for new insolvency notices. Latest run was 2 hours ago.</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-full uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live Monitoring
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
