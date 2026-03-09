'use client';

import React, { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import dynamic from 'next/dynamic';
import { MapPin, Search, Filter, Loader2 } from 'lucide-react';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-medium">Initializing Map Layers...</p>
            </div>
        </div>
    )
});

export default function MapPage() {
    const { data: directors, loading, error } = useDashboardData();

    const propertyLeads = useMemo(() => {
        return directors.filter(d => d.property_owned);
    }, [directors]);

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Error loading map data</h2>
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
                        <h1 className="text-2xl font-bold text-white mb-1">Property Map</h1>
                        <p className="text-slate-400 text-sm">Geospatial distribution of leads with identified property assets</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Find a region..."
                                className="bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all w-48"
                            />
                        </div>
                        <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/50">
                            <Filter size={18} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Map Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white tracking-tight">{loading ? '...' : propertyLeads.length}</div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Property Pins</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white tracking-tight">{loading ? '...' : propertyLeads.filter(l => l.phone || l.email).length}</div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Contact Available</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white tracking-tight">{loading ? '...' : new Set(propertyLeads.map(l => l.region)).size}</div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Regions</p>
                        </div>
                    </div>
                </div>

                {/* Main Map Component */}
                <div className="animate-in fade-in zoom-in-95 duration-1000 delay-200">
                    <PropertyMap directors={propertyLeads} />
                </div>
            </div>
        </DashboardLayout>
    );
}
