'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Loader2, TrendingUp, Users, Home, CheckCircle } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AnalyticsPage() {
    const { stats, loading, error } = useDashboardData();

    if (loading || !stats) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Error loading analytics</h2>
                        <p className="text-slate-400">{error.message}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const pipelineData = {
        labels: stats?.pipelineHistory.map(h => h.date) || [],
        datasets: [
            {
                label: 'Success (Enriched)',
                data: stats?.pipelineHistory.map(h => h.success) || [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Total Found',
                data: stats?.pipelineHistory.map(h => h.total) || [],
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
            }
        ]
    };

    const regionData = {
        labels: stats ? Object.keys(stats.regionCounts).slice(0, 8) : [],
        datasets: [
            {
                label: 'Leads per Region',
                data: stats ? Object.values(stats.regionCounts).slice(0, 8) : [],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderRadius: 8,
            }
        ]
    };

    const enrichmentData = {
        labels: ['Fully Enriched', 'LinkedIn Found', 'Asset Only'],
        datasets: [
            {
                data: stats ? [stats.fullyEnriched, stats.linkedInFound, stats.noEnrichment] : [],
                backgroundColor: ['#10b981', '#3b82f6', '#f43f5e'],
                borderWidth: 0,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                padding: 12,
                borderRadius: 8,
                displayColors: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Pipeline Analytics</h1>
                    <p className="text-slate-400 text-sm">Real-time performance metrics and growth trends</p>
                </div>

                {/* Highlight Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Avg lead quality', value: `${stats?.leadQualityTrend?.[stats.leadQualityTrend.length - 1]?.avgScore || 0}%`, icon: TrendingUp, color: 'text-blue-400' },
                        { label: 'Total Directors', value: stats?.totalDirectors.toLocaleString(), icon: Users, color: 'text-emerald-400' },
                        { label: 'Property Assets', value: stats?.propertyOwnedCount.toLocaleString(), icon: Home, color: 'text-purple-400' },
                        { label: 'Enrichment Rate', value: stats ? `${Math.round((stats.fullyEnriched / stats.totalDirectors) * 100)}%` : '0%', icon: CheckCircle, color: 'text-amber-400' },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                                <item.icon size={18} className={item.color} />
                            </div>
                            <div className="text-2xl font-bold text-white">{loading ? '...' : item.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pipeline Velocity */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6">Pipeline Velocity (14 Days)</h3>
                        <div className="h-[300px] flex items-center justify-center">
                            {loading ? <Loader2 className="animate-spin text-blue-500" /> : <Line data={pipelineData} options={chartOptions} />}
                        </div>
                    </div>

                    {/* Regional Distribution */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6">Regional Performance</h3>
                        <div className="h-[300px] flex items-center justify-center">
                            {loading ? <Loader2 className="animate-spin text-blue-500" /> : <Bar data={regionData} options={{ ...chartOptions, indexAxis: 'y' as const }} />}
                        </div>
                    </div>

                    {/* Data Composition */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6">Enrichment Composition</h3>
                        <div className="grid grid-cols-2 items-center gap-8">
                            <div className="h-48">
                                {loading ? <Loader2 className="animate-spin text-blue-500 mx-auto mt-20" /> : <Doughnut data={enrichmentData} options={{ ...chartOptions, cutout: '70%' }} />}
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Fully Enriched', color: 'bg-emerald-500', value: stats?.fullyEnriched },
                                    { label: 'LinkedIn Found', color: 'bg-blue-500', value: stats?.linkedInFound },
                                    { label: 'Asset Only', color: 'bg-rose-500', value: stats?.noEnrichment },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                            <span className="text-sm text-slate-400">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">{item.value || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quality Trend */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6">Avg Lead Quality Trend</h3>
                        <div className="h-[200px] flex items-center justify-center">
                            {loading ? (
                                <Loader2 className="animate-spin text-blue-500" />
                            ) : (
                                <Line
                                    data={{
                                        labels: stats?.leadQualityTrend.map(t => t.date) || [],
                                        datasets: [{
                                            label: 'Quality Score',
                                            data: stats?.leadQualityTrend.map(t => t.avgScore) || [],
                                            borderColor: '#f59e0b',
                                            backgroundColor: 'transparent',
                                            tension: 0.4,
                                            pointRadius: 4,
                                        }]
                                    }}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            ...chartOptions.scales,
                                            y: { ...chartOptions.scales.y, min: 0, max: 100 }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
