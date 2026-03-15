'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarEditorProps {
    currentAvatarUrl?: string | null;
    onFileSelect: (file: File) => void;
    isUpdating?: boolean;
    firstName?: string;
    lastName?: string;
}

export function AvatarEditor({ 
    currentAvatarUrl, 
    onFileSelect, 
    isUpdating,
    firstName,
    lastName
}: AvatarEditorProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get initials for placeholder
    const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onFileSelect(file);
        }
    };

    const handleClearPreview = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Clean up preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                {/* Avatar Container */}
                <div className={cn(
                    "relative h-32 w-32 rounded-3xl overflow-hidden border-2 transition-all duration-300",
                    "border-white/5 bg-zinc-900 group-hover:border-[#A600FF]/50 shadow-2xl",
                    isUpdating && "opacity-50"
                )}>
                    {previewUrl || currentAvatarUrl ? (
                        <img 
                            src={previewUrl || currentAvatarUrl || ''} 
                            alt="Avatar Preview" 
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-3xl font-black text-white/20">
                            {initials}
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isUpdating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <Loader2 className="h-8 w-8 text-[#A600FF] animate-spin" />
                        </div>
                    )}

                    {/* Hover Overlay */}
                    {!isUpdating && (
                        <div 
                            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="h-8 w-8 text-white mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Logo</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="absolute -bottom-2 -right-2 flex gap-2">
                    {previewUrl ? (
                        <button
                            onClick={handleClearPreview}
                            className="h-8 w-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                            <X size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="h-10 w-10 rounded-xl bg-[#A600FF] text-white flex items-center justify-center shadow-[0_5px_15px_rgba(166,0,255,0.4)] hover:scale-110 transition-transform border border-white/20"
                        >
                            <Upload size={18} />
                        </button>
                    )}
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                JPG, PNG OR WEBP. MAX 2MB.
            </p>
        </div>
    );
}
