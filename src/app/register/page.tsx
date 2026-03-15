'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Mail, Lock, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import { useRegister } from '@/hooks/use-register';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const registerMutation = useRegister();
    
    // Form state
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI state
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Simple name splitting logic
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        try {
            await registerMutation.mutateAsync({ 
                email, 
                password, 
                firstName, 
                lastName 
            });
            setIsRegistered(true);
        } catch (err: any) {
            let message = 'An unexpected error occurred. Please try again.';
            
            if (err.response?.status === 429) {
                message = 'Too many attempts. Please wait a few minutes before trying to register again.';
            } else if (err.response?.data?.message) {
                message = err.response.data.message;
            }
            
            setError(message);
        }
    };

    if (isRegistered) {
        return (
            <div className="relative flex min-h-screen items-center justify-center bg-[oklch(0.145_0_0)] overflow-hidden">
                {/* ═══════ FUTURISTIC GLOW EFFECTS ═══════ */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#A600FF]/20 blur-[120px] animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#A600FF]/15 blur-[150px] animate-pulse [animation-delay:1s]" />
                </div>

                <div className="relative z-10 w-full max-w-md mx-auto px-6">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                <CheckCircle2 size={32} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Check your email</h3>
                        <p className="text-zinc-400 mb-8">
                            We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
                            Please confirm your account to start using Job Tracker.
                        </p>
                        <Link 
                            href="/login"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A600FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#A600FF]/25 transition-all hover:bg-[#8B00D6]"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[oklch(0.145_0_0)] overflow-hidden">
            {/* ═══════ FUTURISTIC GLOW EFFECTS ═══════ */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#A600FF]/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#A600FF]/15 blur-[150px] animate-pulse [animation-delay:1s]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(166,0,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(166,0,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative z-10 flex w-full max-w-5xl mx-auto px-6 gap-16 items-center">
                {/* INFO SIDE */}
                <div className="hidden lg:flex flex-1 flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/30">
                            <Briefcase size={24} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Job Tracker</h1>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tight text-white leading-[1.1]">
                            Join the <span className="text-[#A600FF]">community</span>
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                            Create your account and start managing your professional future today.
                        </p>
                    </div>
                </div>

                {/* FORM SIDE */}
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white">Create account</h3>
                            <p className="text-zinc-400 mt-1">Get started with your free account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#A600FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#A600FF]/25 transition-all hover:bg-[#8B00D6] disabled:opacity-60"
                            >
                                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                                {!registerMutation.isPending && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-zinc-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#A600FF] font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
