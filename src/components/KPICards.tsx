import React from 'react';
import { Search, Home, UserCheck, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardStats } from '../lib/data';

interface KPICardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: React.ReactNode;
    subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend, icon, subtitle }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            {change && (
                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' :
                        trend === 'down' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-white/5 text-slate-400'
                    }`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> :
                        trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                    {change}
                </div>
            )}
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>}
        </div>
    </div>
);

interface KPICardsProps {
    stats: DashboardStats | null;
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
    if (!stats) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
            ))}
        </div>
    );

    const timeSavedValue = stats.daysRunning > 0 ? `${stats.daysRunning} Days` : '0 Days';
    const pipelineValueStr = stats.pipelineValue > 0 ? `£${stats.pipelineValue.toLocaleString()} Estimated ROI` : '';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
                title="Companies Identified"
                value={stats.totalCompanies.toLocaleString()}
                change="+12.5%"
                trend="up"
                icon={<Search className="w-6 h-6 text-blue-400" />}
            />
            <KPICard
                title="Assets Discovered"
                value={stats.totalNotices.toLocaleString()}
                change="+8.2%"
                trend="up"
                icon={<Home className="w-6 h-6 text-blue-400" />}
            />
            <KPICard
                title="Enriched Directors"
                value={stats.fullyEnriched.toLocaleString()}
                change="+24.1%"
                trend="up"
                icon={<UserCheck className="w-6 h-6 text-emerald-400" />}
            />
            <KPICard
                title="Estimated Time Saved"
                value={timeSavedValue}
                subtitle={pipelineValueStr}
                icon={<Clock className="w-6 h-6 text-blue-400" />}
            />
        </div>
    );
};

export default KPICards;
