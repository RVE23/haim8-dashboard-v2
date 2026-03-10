'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

// Dynamically import charts with SSR disabled
const AnalyticsCharts = dynamic(() => import('@/components/analytics/AnalyticsCharts'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
    )
});

export default function AnalyticsPage() {
    const { stats, loading, error } = useDashboardData();

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

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Pipeline Analytics</h1>
                    <p className="text-slate-400 text-sm">Real-time performance metrics and growth trends</p>
                </div>

                {loading || !stats ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : (
                    <AnalyticsCharts stats={stats} />
                )}
            </div>
        </DashboardLayout>
    );
}
