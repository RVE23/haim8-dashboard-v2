'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
