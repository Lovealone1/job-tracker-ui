'use client';

import React from 'react';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

export default function RegisterPage() {
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

                {/* OAUTH SIDE — registration is exclusively via Google / GitHub */}
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
                            <h3 className="text-2xl font-bold text-white">Create account</h3>
                            <p className="text-zinc-400 mt-1">
                                Sign up with your identity provider — no passwords, no email verification.
                            </p>
                        </div>

                        <OAuthButtons actionLabel="Sign up" />

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
