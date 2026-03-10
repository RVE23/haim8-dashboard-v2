'use client';

import React from 'react';
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
import { TrendingUp, Users, Home, CheckCircle } from 'lucide-react';

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

interface AnalyticsChartsProps {
    stats: any;
}

export default function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
    const pipelineData = {
        labels: stats?.pipelineHistory?.map((h: any) => h.date) || [],
        datasets: [
            {
                label: 'Success (Enriched)',
                data: stats?.pipelineHistory?.map((h: any) => h.success) || [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Total Found',
                data: stats?.pipelineHistory?.map((h: any) => h.total) || [],
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
            legend: { display: false },
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                        <div className="text-2xl font-bold text-white">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Pipeline Velocity (14 Days)</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <Line data={pipelineData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Regional Performance</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <Bar data={regionData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Enrichment Composition</h3>
                    <div className="grid grid-cols-2 items-center gap-8">
                        <div className="h-48">
                            <Doughnut data={enrichmentData} options={{ ...chartOptions, cutout: '70%' }} />
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

                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Avg Lead Quality Trend</h3>
                    <div className="h-[200px] flex items-center justify-center">
                        <Line
                            data={{
                                labels: stats?.leadQualityTrend?.map((t: any) => t.date) || [],
                                datasets: [{
                                    label: 'Quality Score',
                                    data: stats?.leadQualityTrend?.map((t: any) => t.avgScore) || [],
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
                    </div>
                </div>
            </div>
        </div>
    );
}
