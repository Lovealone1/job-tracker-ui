'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/hooks/use-login';

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await loginMutation.mutateAsync({ email, password });
            router.push('/dashboard');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 401) {
                setError('Invalid email or password.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[oklch(0.145_0_0)] overflow-hidden">
            {/* ═══════ FUTURISTIC GLOW EFFECTS ═══════ */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Purple glow — top right */}
                <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#A600FF]/20 blur-[120px] animate-pulse" />
                {/* Purple glow — bottom left */}
                <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#A600FF]/15 blur-[150px] animate-pulse [animation-delay:1s]" />
                {/* Subtle blue shimmer — center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px] animate-pulse [animation-delay:2s]" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(166,0,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(166,0,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* ═══════ MAIN CONTENT ═══════ */}
            <div className="relative z-10 flex w-full max-w-5xl mx-auto px-6 gap-16 items-center">

                {/* ═══════ LEFT SIDE — INFO ═══════ */}
                <div className="hidden lg:flex flex-1 flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/30">
                            <Briefcase size={24} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white">
                            Job Tracker
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tight text-white leading-[1.1]">
                            Take control of your
                            <span className="text-[#A600FF]"> career journey</span>
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                            Track applications, manage interviews, organize your CVs, and never miss a follow-up. All in one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-500">
                        {['Track Applications', 'Manage Interviews', 'Smart Reminders'].map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#A600FF]" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════ RIGHT SIDE — LOGIN FORM ═══════ */}
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl">
                        {/* Mobile logo */}
                        <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/30">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">Job Tracker</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white">Welcome back</h3>
                            <p className="text-zinc-400 mt-1">Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error message */}
                            {error && (
                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </div>
                            )}

                            {/* Email field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 focus:border-[#A600FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 focus:border-[#A600FF]/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#A600FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#A600FF]/25 transition-all hover:bg-[#8B00D6] hover:shadow-[#A600FF]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-zinc-600">
                            Don&apos;t have an account?{' '}
                            <span className="text-[#A600FF] font-medium cursor-pointer hover:underline">
                                Contact your admin
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
