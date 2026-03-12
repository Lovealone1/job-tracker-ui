'use client';

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-md font-medium">
                        Overview of your job search progress and activity.
                    </p>
                </div>

                {/* Placeholder cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Total Applications', value: '—', desc: 'All time' },
                        { title: 'Interviews Scheduled', value: '—', desc: 'Upcoming' },
                        { title: 'Active Reminders', value: '—', desc: 'Pending' },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                            <p className="mt-2 text-3xl font-black tracking-tight">{card.value}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
