'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Search, Filter, Download, ExternalLink, Mail, Phone, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeadsPage() {
    const { data: directors, stats, loading, error } = useDashboardData();
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<'all' | 1 | 2 | 3>('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const filteredLeads = useMemo(() => {
        return directors.filter(d => {
            // Tier logic
            const isTier1 = (d.phone || d.email);
            const isTier2 = d.linkedin_found && !isTier1;
            const isTier3 = !d.linkedin_found && !isTier1;

            if (tierFilter !== 'all') {
                if (tierFilter === 1 && !isTier1) return false;
                if (tierFilter === 2 && !isTier2) return false;
                if (tierFilter === 3 && !isTier3) return false;
            }

            // Region logic
            if (regionFilter !== 'all' && d.region !== regionFilter) return false;

            // Search logic
            if (search) {
                const query = search.toLowerCase();
                return (
                    d.name.toLowerCase().includes(query) ||
                    d.company_name.toLowerCase().includes(query) ||
                    d.region.toLowerCase().includes(query) ||
                    d.role.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [directors, tierFilter, regionFilter, search]);

    const paginatedLeads = filteredLeads.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

    const regions = Array.from(new Set(directors.map(d => d.region))).filter(Boolean).sort();

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Error loading leads</h2>
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
                        <h1 className="text-2xl font-bold text-white mb-1">Insolvency Leads</h1>
                        <p className="text-slate-400 text-sm">Manage and filter your pipeline of potential opportunities</p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-lg shadow-blue-900/20">
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>

                {/* Tier Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => setTierFilter(1)}
                        className={`p-6 rounded-2xl border transition-all text-left group ${tierFilter === 1 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                    >
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider">Tier 1</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stats?.fullyEnriched || 0}</div>
                        <p className="text-xs text-slate-500 font-medium">Fully Enriched — Ready to Contact</p>
                    </button>

                    <button
                        onClick={() => setTierFilter(2)}
                        className={`p-6 rounded-2xl border transition-all text-left group ${tierFilter === 2 ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                    >
                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Tier 2</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stats?.linkedInFound || 0}</div>
                        <p className="text-xs text-slate-500 font-medium">LinkedIn Match — Partial Data</p>
                    </button>

                    <button
                        onClick={() => setTierFilter(3)}
                        className={`p-6 rounded-2xl border transition-all text-left group ${tierFilter === 3 ? 'bg-rose-500/10 border-rose-500/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                    >
                        <div className="flex items-center gap-2 text-rose-400 mb-2">
                            <div className="w-2 h-2 rounded-full bg-rose-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Tier 3</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stats?.noEnrichment || 0}</div>
                        <p className="text-xs text-slate-500 font-medium">Asset Only — Needs Enrichment</p>
                    </button>
                </div>

                {/* Filters & Table */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search leads, companies, regions..."
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <select
                                    className="bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none cursor-pointer"
                                    value={regionFilter}
                                    onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="all">All Regions</option>
                                    {regions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => { setTierFilter('all'); setRegionFilter('all'); setSearch(''); setPage(1); }}
                                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 group"
                                    title="Reset filters"
                                >
                                    <Filter size={18} className="group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Director / Company</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Enrichment</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={4} className="px-6 py-8 bg-white/5" />
                                        </tr>
                                    ))
                                ) : paginatedLeads.length > 0 ? (
                                    paginatedLeads.map((lead) => (
                                        <tr key={lead.id} className="group hover:bg-slate-800/30 transition-all border-l-4 border-l-transparent hover:border-l-blue-500">
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white mb-0.5">{lead.name}</span>
                                                    <span className="text-xs text-slate-400 font-medium">{lead.company_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-xs font-semibold text-slate-300 bg-slate-800/50 px-2 py-1 rounded-md">{lead.region}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    {lead.email ? (
                                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400" title={lead.email}>
                                                            <Mail size={16} />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 bg-slate-800/30 rounded-lg text-slate-600">
                                                            <Mail size={16} />
                                                        </div>
                                                    )}
                                                    {lead.phone ? (
                                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400" title={lead.phone}>
                                                            <Phone size={16} />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 bg-slate-800/30 rounded-lg text-slate-600">
                                                            <Phone size={16} />
                                                        </div>
                                                    )}
                                                    {lead.linkedin_url ? (
                                                        <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                                            <Linkedin size={16} />
                                                        </a>
                                                    ) : (
                                                        <div className="p-2 bg-slate-800/30 rounded-lg text-slate-600">
                                                            <Linkedin size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <button className="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-widest flex items-center gap-1 ml-auto group/btn transition-all">
                                                    Details
                                                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-500 font-medium">
                                            No leads found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium tracking-wide">
                                Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all text-white border border-slate-700/50"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all text-white border border-slate-700/50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
