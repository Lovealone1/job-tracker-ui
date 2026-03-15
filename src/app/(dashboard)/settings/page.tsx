'use client';

import React, { useState, useEffect } from 'react';
import { 
    User, 
    Globe, 
    Phone, 
    Clock, 
    Languages, 
    Key, 
    Save, 
    ShieldCheck, 
    Sparkles,
    Loader2
} from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';
import { AvatarEditor } from './avatar-editor';
import { PremiumSelect } from '@/components/shared/premium-select';
import { countries } from 'countries-list';

const getFlagEmoji = (countryCode: string) => {
    return countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt(0))
    );
};

const COUNTRY_OPTIONS = Object.entries(countries).map(([code, country]) => ({
    label: country.name,
    value: country.name,
    flag: getFlagEmoji(code)
})).sort((a, b) => a.label.localeCompare(b.label));

const TIMEZONE_OPTIONS = [
    { label: 'America/Bogotá (GMT-5)', value: 'America/Bogota' },
    { label: 'America/New York (GMT-5)', value: 'America/New_York' },
    { label: 'UTC', value: 'UTC' },
    { label: 'Europe/London (GMT+0)', value: 'Europe/London' },
    { label: 'Europe/Madrid (GMT+1)', value: 'Europe/Madrid' },
];

const LANGUAGE_OPTIONS = [
    { label: 'English (Professional)', value: 'en' },
    { label: 'Español', value: 'es' },
];

export default function SettingsPage() {
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        country: '',
        phone: '',
        timezone: '',
        language: '',
        resend_api_key: ''
    });
    
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Sync form with profile data when loaded
    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                country: profile.country || '',
                phone: profile.phone || '',
                timezone: profile.timezone || '',
                language: profile.language || '',
                resend_api_key: profile.resend_api_key || ''
            });
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            avatar: avatarFile || undefined
        };
        
        await updateProfile.mutateAsync(payload);
        setAvatarFile(null); // Clear pending file after success
    };

    if (isProfileLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#A600FF]" />
            </div>
        );
    }

    return (
        <div className="w-full py-8 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                        <Sparkles className="text-[#A600FF]" />
                        Account <span className="text-zinc-500">Settings</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
                        Customize your professional cockpit and integrations
                    </p>
                </div>
                
                <button
                    onClick={handleSubmit}
                    disabled={updateProfile.isPending}
                    className="flex items-center gap-2 bg-[#A600FF] hover:bg-[#8B00D6] disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-[0_10px_20px_rgba(166,0,255,0.2)] transition-all group active:scale-95"
                >
                    {updateProfile.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Save size={16} className="group-hover:rotate-12 transition-transform" />
                    )}
                    Save Changes
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Identity & Localization */}
                <div className="space-y-8">
                    {/* Identity Section */}
                    <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl h-fit">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <User size={14} className="text-[#A600FF]" /> Identity
                        </h2>
                        
                        <AvatarEditor 
                            currentAvatarUrl={profile?.avatarUrl}
                            onFileSelect={setAvatarFile}
                            isUpdating={updateProfile.isPending}
                            firstName={formData.firstName}
                            lastName={formData.lastName}
                        />
                    </div>

                    {/* Localization Section */}
                    <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl h-fit">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <Clock size={14} className="text-[#A600FF]" /> Localization
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Timezone</label>
                                <PremiumSelect 
                                    options={TIMEZONE_OPTIONS}
                                    value={formData.timezone}
                                    onChange={(val) => setFormData(prev => ({ ...prev, timezone: val }))}
                                    icon={<Clock size={14} />}
                                    placeholder="Select Timezone"
                                    maxItems={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Language</label>
                                <PremiumSelect 
                                    options={LANGUAGE_OPTIONS}
                                    value={formData.language}
                                    onChange={(val) => setFormData(prev => ({ ...prev, language: val }))}
                                    icon={<Languages size={14} />}
                                    placeholder="Select Language"
                                    maxItems={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Personal Info & Integrations (Takes 2 columns) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Information */}
                    <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl relative z-20">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <Globe size={14} className="text-[#A600FF]" /> Personal Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">First Name</label>
                                <input 
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#A600FF]/50 focus:border-[#A600FF] transition-all outline-none"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Last Name</label>
                                <input 
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#A600FF]/50 focus:border-[#A600FF] transition-all outline-none"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Country</label>
                                <PremiumSelect 
                                    options={COUNTRY_OPTIONS}
                                    value={formData.country}
                                    onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                                    icon={<Globe size={14} />}
                                    placeholder="Select Country"
                                    maxItems={5}
                                    searchable
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                                    <input 
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#A600FF]/50 focus:border-[#A600FF] transition-all outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integrations & Security (High-tech focus) */}
                    <div className="bg-gradient-to-br from-[#A600FF]/5 to-transparent border border-[#A600FF]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A600FF]/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-[#A600FF]/10" />
                        
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 rounded-2xl bg-[#A600FF]/10 border border-[#A600FF]/20 flex items-center justify-center text-[#A600FF]">
                                <Key size={24} />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">Integrations & Security</h2>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connect external services & manage API access</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-1 px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resend API Key</label>
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-[#A600FF] bg-[#A600FF]/10 px-2 py-0.5 rounded-full border border-[#A600FF]/20">Active Profile</span>
                                </div>
                                <div className="relative">
                                    <ShieldCheck size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A600FF]/50" />
                                    <input 
                                        type="password"
                                        name="resend_api_key"
                                        value={formData.resend_api_key}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-[#A600FF]/20 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#A600FF]/50 focus:border-[#A600FF] transition-all outline-none text-[#A600FF] placeholder:opacity-30"
                                        placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-zinc-600 px-1 leading-relaxed italic">
                                    Required for automated email reminders and interview notifications.
                                </p>
                            </div>

                            <div className="p-6 rounded-3xl bg-black/30 border border-white/5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-[#A600FF]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Vault Encrypted</span>
                                </div>
                                <p className="text-[9px] font-medium text-zinc-500 leading-relaxed">
                                    Your API keys are stored using industry-standard AES-256 encryption. Our system only decrypts them during active notification cycles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
