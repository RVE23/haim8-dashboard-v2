'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Map as MapIcon,
    BarChart3,
    Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Daily Records', href: '/daily', icon: Calendar },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) {
    const pathname = usePathname();

    return (
        <>
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold tracking-tight text-white">
                                    H<span className="text-blue-400">AI</span>M8
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                                    Hilway Insolvency
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-400"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <div className="text-[11px] text-slate-500">
                            v2.1.0 • Built with Antigravity
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
