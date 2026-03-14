"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, LayoutDashboard, Zap, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Local Minimal UI Components ─────────────────────────── */

const Button = ({ 
  children, 
  className, 
  variant = 'default', 
  size = 'default',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'primary'; 
  size?: 'default' | 'sm' | 'icon' 
}) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-xl text-sm font-black transition-all focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 tracking-tighter uppercase px-4 h-10",
      variant === 'default' && "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
      variant === 'primary' && "bg-[#A600FF] text-white hover:bg-[#8B00D6] shadow-sm",
      variant === 'ghost' && "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest",
      size === 'sm' && "h-8 px-3 text-[10px]",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#A600FF]/30 font-sans selection:text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#A600FF] flex items-center justify-center shadow-[0_0_15px_rgba(166,0,255,0.4)] group-hover:scale-110 transition-transform">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter italic uppercase text-white">JobTracker</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                Login
              </Button>
            </Link>
            <Button className="bg-white text-black hover:bg-zinc-200 font-black text-xs uppercase tracking-widest px-6 h-9 rounded-full transition-all">
              Register
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 relative">
        {/* BACKGROUND FLARES */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A600FF]/25 blur-[120px] rounded-full" />
          <div className="absolute top-48 -right-24 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
        </div>

        {/* HERO SECTION */}
        <section className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-[#A600FF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">System Live v1.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 text-white max-w-4xl">
            OWN YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-500">CAREER PATH</span> WITHOUT THE CHAOS.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mb-12 leading-relaxed">
            Stop losing track of your applications. Automate your job search, visualize your progress, and manage your versions with a professional cockpit.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login">
              <Button className="bg-[#A600FF] hover:bg-[#8B00D6] text-white font-black h-14 px-10 rounded-2xl shadow-[0_10px_30px_rgba(166,0,255,0.3)] transition-all flex items-center gap-3 text-base">
                Get Started
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="container mx-auto px-6 mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-[#A600FF]/30 transition-all group overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#A600FF]/5 blur-3xl group-hover:bg-[#A600FF]/10 transition-all rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[#A600FF]/10 group-hover:border-[#A600FF]/30 transition-all">
              <LayoutDashboard size={24} className="text-[#A600FF]" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-3">Live Dashboard</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Experience the "Search Cockpit". One view for your status stats, next interviews, and recent movement.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-[#A600FF]/30 transition-all group overflow-hidden relative border-t-[#A600FF]/20">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#A600FF]/10 blur-3xl group-hover:bg-[#A600FF]/20 transition-all rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[#A600FF]/10 group-hover:border-[#A600FF]/30 transition-all shadow-[0_0_20px_rgba(166,0,255,0.1)]">
              <Sparkles size={24} className="text-[#A600FF]" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-3 text-[#A600FF]">Smart CV Manager</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Our core differentiator. Generate perfect PDF variants tailored for each specific job application in seconds.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-[#A600FF]/30 transition-all group overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#A600FF]/5 blur-3xl group-hover:bg-[#A600FF]/10 transition-all rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[#A600FF]/10 group-hover:border-[#A600FF]/30 transition-all">
              <Shield size={24} className="text-[#A600FF]" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-3">Military Grade</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Your professional data is encrypted and secure. Built for high-performance job seeking at leading tech companies.
            </p>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="container mx-auto px-6 mt-40">
          <div className="bg-gradient-to-br from-zinc-900/50 to-black p-12 md:p-20 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A600FF]/5 blur-[100px] rounded-full transform translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                THE SPREADSHEET ERA <br /><span className="text-zinc-500">IS OVER.</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium mb-10 leading-relaxed max-w-xl">
                Tracking 50+ applications with complex interview cycles across different CV versions is a job in itself. JobTracker transforms that chaos into a high-performance workflow.
              </p>
              
              <div className="space-y-4">
                {[
                  "Automated Status Tracking",
                  "CV Version Management per Application",
                  "Interview Reminders & Links",
                  "Success Metrics Visualization"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle2 size={18} className="text-[#A600FF]" />
                    <span className="text-sm font-bold tracking-tight text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-zinc-800/20 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A600FF]/10 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-8 w-full">
                <div className="h-6 w-32 bg-zinc-800 rounded-full mb-6" />
                <div className="space-y-4">
                  <div className="h-12 w-full bg-zinc-900/80 border border-white/5 rounded-2xl flex items-center px-4">
                    <div className="h-2 w-24 bg-zinc-700 rounded-full" />
                  </div>
                  <div className="h-12 w-full bg-[#A600FF]/10 border border-[#A600FF]/20 rounded-2xl flex items-center px-4">
                    <div className="h-2 w-40 bg-[#A600FF]/60 rounded-full" />
                  </div>
                  <div className="h-12 w-full bg-zinc-900/80 border border-white/5 rounded-2xl flex items-center px-4">
                    <div className="h-2 w-32 bg-zinc-700 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-zinc-950/50 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#A600FF] fill-[#A600FF]" />
            <span className="font-black tracking-tighter italic uppercase text-sm text-white">JobTracker</span>
          </div>
          
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">
            © 2026 HIGH-STAKES CAREER TOOLS. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Login</Link>
            <span className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-not-allowed opacity-50">API Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
