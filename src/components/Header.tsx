'use client';

import React from 'react';
import { Moon, RefreshCw, Menu } from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-400 hover:text-white lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-white">Hilway Insolvency Pipeline</h1>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50">
                    <Moon className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                </button>
            </div>
        </header>
    );
}
