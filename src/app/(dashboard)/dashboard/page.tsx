'use client';

import React from 'react';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    Briefcase, 
    Calendar, 
    Bell, 
    TrendingUp, 
    Clock, 
    ExternalLink, 
    User,
    ChevronRight,
    ArrowUpRight,
    Video,
    BarChart3
} from 'lucide-react';
import { useApplications, useApplicationSummary } from '@/features/applications/hooks/use-applications';
import { useInterviewSummary, useNextInterview } from '@/features/interviews/hooks/use-interviews';
import { useReminderDashboardSummary } from '@/features/reminders/hooks/use-reminders';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { enUS } from 'date-fns/locale';

/* ── Local Minimal UI Components ─────────────────────────── */

const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'outline' | 'purple' }) => (
    <div className={cn(
        "inline-flex items-center rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors",
        variant === 'default' ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900" : "",
        variant === 'outline' ? "border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" : "",
        variant === 'purple' ? "bg-[#A600FF]/20 text-[#A600FF] border border-[#A600FF]/20" : "",
        className
    )}>
        {children}
    </div>
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'primary'; size?: 'default' | 'sm' | 'icon'; asChild?: boolean }>(
    ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
        const Comp = asChild ? 'span' : 'button';
        return (
            //@ts-ignore
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-sm font-black transition-all focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 tracking-tighter uppercase",
                    variant === 'default' && "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
                    variant === 'primary' && "bg-[#A600FF] text-white hover:bg-[#8B00D6] shadow-sm",
                    variant === 'ghost' && "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                    variant === 'outline' && "border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    size === 'default' && "h-11 px-5 py-2",
                    size === 'sm' && "h-8 rounded-lg px-3 text-[10px]",
                    size === 'icon' && "h-10 w-10",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

const Progress = ({ value = 0, className, barClassName }: { value?: number; className?: string; barClassName?: string }) => (
    <div className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800", className)}>
        <div
            className={cn("h-full w-full flex-1 bg-[#A600FF] transition-all duration-1000 ease-out", barClassName)}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
);

/* ── Main Page Implementation ───────────────────────────── */

export default function DashboardPage() {
    // 1. Data Fetching
    const { data: appsData, isLoading: appsLoading } = useApplications({ limit: 6 });
    const { data: appSummary, isLoading: summaryLoading } = useApplicationSummary();
    const { data: interviewSummary, isLoading: intSummaryLoading } = useInterviewSummary();
    const { data: reminderSummary, isLoading: remSummaryLoading } = useReminderDashboardSummary();
    const { data: nextInterview, isLoading: nextIntLoading } = useNextInterview();

    const isLoading = appsLoading || summaryLoading || intSummaryLoading || remSummaryLoading || nextIntLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A600FF]"></div>
            </div>
        );
    }

    const recentApplications = appsData?.data || [];
    
    // KPI Data (English)
    const kpis = [
        {
            title: 'Applications',
            value: appSummary?.totalApplications || 0,
            icon: Briefcase,
            color: 'text-zinc-900 dark:text-zinc-100',
            bg: 'bg-zinc-100 dark:bg-zinc-800',
            desc: `${appSummary?.appliedThisMonth || 0} this month`
        },
        {
            title: 'Next Interviews',
            value: appSummary?.upcomingInterviewsCount || interviewSummary?.upcomingInterviewsCount || 0,
            icon: Calendar,
            color: 'text-zinc-900 dark:text-zinc-100',
            bg: 'bg-zinc-100 dark:bg-zinc-800',
            desc: 'Tracker active'
        },
        {
            title: 'Active Reminders',
            value: reminderSummary?.upcomingCount || 0,
            icon: Bell,
            color: 'text-zinc-900 dark:text-zinc-100',
            bg: 'bg-zinc-100 dark:bg-zinc-800',
            desc: `${reminderSummary?.completedCount || 0} completed`
        },
        {
            title: 'Weekly Tempo',
            value: appSummary?.appliedThisWeek || 0,
            icon: TrendingUp,
            color: 'text-zinc-900 dark:text-zinc-100',
            bg: 'bg-zinc-100 dark:bg-zinc-800',
            desc: 'Current week'
        }
    ];

    // Status Progress Bars (English)
    const statusStats = [
        { label: 'Applied', value: appSummary?.byStatus?.APPLIED || 0, color: 'bg-zinc-400 dark:bg-zinc-500' },
        { label: 'Interviewing', value: appSummary?.byStatus?.INTERVIEWING || 0, color: 'bg-[#A600FF]' },
        { label: 'Offers', value: (appSummary?.byStatus?.OFFER_RECEIVED || appSummary?.byStatus?.OFFER) || 0, color: 'bg-zinc-900 dark:bg-zinc-100' },
    ];

    const maxStat = Math.max(...statusStats.map(s => s.value), 1);

    return (
        <div className="min-h-screen md:h-screen w-full bg-background overflow-y-auto md:overflow-hidden flex flex-col font-sans select-none animate-in fade-in duration-700">
            {/* Header */}
            <header className="px-4 md:px-8 pt-6 pb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#A600FF] shadow-lg shadow-[#A600FF]/20 rounded-xl">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none italic">
                        Dashboard
                    </h1>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col gap-6 px-4 md:px-8 pb-10 min-h-0 md:overflow-hidden">
                
                {/* 1. KPI Row (Responsive Grid) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                    {kpis.map((kpi) => (
                        <div key={kpi.title} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all border-b-2 border-b-transparent hover:border-b-[#A600FF] group/kpi">
                            <div className="flex justify-between items-start mb-2">
                                <div className={cn("p-2 rounded-lg transition-colors group-hover/kpi:bg-[#A600FF]/10", kpi.bg)}>
                                    <kpi.icon size={16} className={cn(kpi.color, "group-hover/kpi:text-[#A600FF]")} />
                                </div>
                                <span className="text-xl md:text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-none group-hover/kpi:text-[#A600FF] transition-colors">{kpi.value}</span>
                            </div>
                            <h4 className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-tight group-hover/kpi:text-zinc-500 transition-colors">{kpi.title}</h4>
                            <p className="text-[8px] md:text-[9px] text-zinc-500 mt-1 font-bold uppercase tracking-wider opacity-60 leading-tight">{kpi.desc}</p>
                        </div>
                    ))}
                </div>

                {/* 2. Main Grid Row */}
                <div className="grid grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Recent Activity */}
                    <div className="col-span-12 lg:col-span-7 xl:col-span-8 bg-[#18181B] dark:bg-[#111113] rounded-[1.5rem] h-auto md:h-[600px] flex flex-col overflow-hidden border border-zinc-800/50 shadow-xl relative">
                        <div className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-lg font-black tracking-tighter italic flex items-center gap-2">
                                    Recent Activity
                                    <span className="text-[9px] font-black not-italic bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-widest">Live</span>
                                </h3>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="hover:text-[#A600FF] h-7">
                                <Link href="/applications" className="flex items-center gap-1 font-black uppercase text-[9px] tracking-widest">
                                    View All <ChevronRight size={12} />
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            {recentApplications?.slice(0, 6).map((app) => (
                                <div 
                                    key={app.id} 
                                    className="px-6 py-[15px] border-b last:border-0 border-zinc-50 dark:border-zinc-800/50 flex items-center gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-700/50 group-hover:border-[#A600FF]/30 transition-all">
                                        <span className="text-xl font-black text-zinc-500 dark:text-zinc-400 group-hover:text-[#A600FF] uppercase">
                                            {(app.company || "?").trim().charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-[17px] truncate text-zinc-900 dark:text-zinc-100 group-hover:text-[#A600FF] transition-colors tracking-tight">{app.title}</h4>
                                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2 mt-1 truncate">
                                            {app.company}
                                            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <span className="opacity-60">{format(new Date(app.createdAt), "MMMM d")}</span>
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="h-6 px-3 bg-white dark:bg-black group-hover:border-[#A600FF]/50 transition-colors text-[10px] font-black">
                                        {(app.status || '').replace(/_/g, ' ')}
                                    </Badge>
                                    <ArrowUpRight size={18} className="text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:text-[#A600FF] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            ))}
                            {recentApplications.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-300 py-8">
                                    <BarChart3 size={32} className="mb-2 opacity-10" />
                                    <p className="font-black uppercase tracking-[0.2em] text-[10px] opacity-30">No Data Stream</p>
                                </div>
                            )}
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto flex justify-end items-center shrink-0">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#A600FF] italic">
                                Sync active <div className="w-2 h-2 rounded-full bg-[#A600FF] animate-pulse shadow-[0_0_8px_rgba(166,0,255,0.5)]" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Next Interview & Stats */}
                    <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-4 h-auto md:h-[600px]">
                        {/* NEXT INTERVIEW CARD */}
                        <div className="bg-[#18181B] dark:bg-[#111113] text-white rounded-[1.5rem] p-6 shadow-xl flex flex-col relative overflow-hidden border border-zinc-800/50 shrink-0 min-h-[300px] md:min-h-0">
                            
                            {/* Ambient Flare */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A600FF]/10 blur-[50px] rounded-full" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4 shrink-0">
                                    <h3 className="text-sm font-bold text-zinc-100">Next Interview</h3>
                                    {nextInterview && (
                                        <div className="px-2 py-0.5 bg-zinc-800/80 rounded-md border border-zinc-700/50">
                                            <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">{nextInterview.type || 'TECHNICAL'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px w-full bg-zinc-800 mb-5 shrink-0" />

                                {nextInterview ? (
                                    <div className="flex flex-col flex-1">
                                        <div className="mb-4">
                                            <h2 className="text-[20px] font-black tracking-tighter leading-tight mb-1 text-white">
                                                {nextInterview.jobApplication?.title}
                                            </h2>
                                            <p className="text-zinc-500 font-bold text-xs">
                                                {nextInterview.jobApplication?.company}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 mb-5 shrink-0">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Calendar className="w-3.5 h-3.5 text-[#A600FF]" />
                                                <span className="text-[11px] font-bold">
                                                    {format(new Date(nextInterview.scheduledAt), "EEEE, MMM dd", { locale: enUS })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Clock className="w-3.5 h-3.5 text-[#A600FF]" />
                                                <span className="text-[11px] font-bold">
                                                    {format(new Date(nextInterview.scheduledAt), "hh:mm a")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-[#1C1C1F] border border-zinc-800/50 rounded-xl p-4 mb-5 flex items-center gap-3 shrink-0">
                                            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/30">
                                                <User size={16} className="text-zinc-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">Interviewer</p>
                                                <p className="text-[12px] font-black text-zinc-100 truncate">{nextInterview.interviewerName || 'TBD'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <Button 
                                                variant="primary" 
                                                className="w-full bg-[#A600FF] hover:bg-[#8B00D6] text-white font-black h-11 rounded-xl shadow-none gap-3"
                                                onClick={() => nextInterview.meetingUrl && window.open(nextInterview.meetingUrl, '_blank')}
                                                disabled={!nextInterview.meetingUrl}
                                            >
                                                <Video size={16} />
                                                <span className="text-[12px] tracking-tight">Join meeting</span>
                                                <ExternalLink size={14} className="opacity-70 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 italic py-10">
                                        <Clock size={32} className="mb-3 text-zinc-600" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No scheduled interviews</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PROCESS FUNNEL CARD */}
                        <div className="bg-[#18181B] dark:bg-[#111113] text-white rounded-[2rem] p-5 shadow-xl flex flex-col relative overflow-hidden h-auto md:flex-1 border border-zinc-800/50 min-h-[300px] md:min-h-0">
                            
                            {/* Ambient Flare */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#A600FF]/5 blur-[60px] rounded-full" />

                            <div className="relative z-10 shrink-0">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 italic mb-1 leading-none">Process Funnel</h4>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider opacity-60 leading-none">Success indicators</p>
                            </div>
                            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-1 mt-3">
                                {statusStats.map((stat) => (
                                    <div key={stat.label} className="group/stat">
                                        <div className="flex justify-between items-end mb-2 pr-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover/stat:text-[#A600FF] transition-colors">{stat.label}</span>
                                            <span className="text-[16px] font-black text-zinc-900 dark:text-zinc-100 italic tracking-tighter">{stat.value}</span>
                                        </div>
                                        <Progress 
                                            value={(stat.value / maxStat) * 100} 
                                            className="h-2"
                                            barClassName={cn(stat.color, "min-w-[5px]")} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global no-scroll enforcement (Only on Desktop) */}
            <style jsx global>{`
                @media (min-width: 768px) {
                    html, body {
                        overflow: hidden !important;
                        height: 100vh;
                        margin: 0;
                        padding: 0;
                    }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
