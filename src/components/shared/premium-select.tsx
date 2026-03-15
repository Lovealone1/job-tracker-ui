'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
    flag?: string;
}

interface PremiumSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    maxItems?: number;
    searchable?: boolean;
}

export function PremiumSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = 'Select option', 
    icon,
    className,
    maxItems,
    searchable = false
}: PremiumSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Each item is approx 44px (py-3 = 12px + 12px + 20px text)
    const dropdownStyle = maxItems 
        ? { maxHeight: `${maxItems * 44 + 8}px` } // +8 for padding
        : undefined;

    // Reset search when opening/closing
    useEffect(() => {
        if (!isOpen) setSearchQuery('');
        if (isOpen && searchable) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, searchable]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full bg-black/50 border rounded-2xl pl-12 pr-5 py-4 text-sm font-bold transition-all flex items-center justify-between outline-none group",
                    isOpen 
                        ? "border-[#A600FF] ring-2 ring-[#A600FF]/20 shadow-[0_0_20px_rgba(166,0,255,0.1)]" 
                        : "border-white/5 hover:border-white/20"
                )}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className={cn(
                            "absolute left-5 top-1/2 -translate-y-1/2 transition-colors",
                            isOpen ? "text-[#A600FF]" : "text-zinc-600"
                        )}>
                            {icon}
                        </div>
                    )}
                    <span className={cn(
                        "truncate flex items-center gap-2",
                        !selectedOption && "text-zinc-600 font-medium"
                    )}>
                        {selectedOption?.flag && <span>{selectedOption.flag}</span>}
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown 
                    size={16} 
                    className={cn(
                        "text-zinc-600 transition-transform duration-300 group-hover:text-zinc-400",
                        isOpen && "rotate-180 text-[#A600FF]"
                    )} 
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 py-2 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
                    {searchable && (
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search country..."
                                    className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none focus:border-[#A600FF]/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div 
                        className="overflow-y-auto custom-scrollbar"
                        style={dropdownStyle}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-5 py-3 text-left text-sm font-bold flex items-center justify-between transition-colors",
                                        option.value === value 
                                            ? "bg-[#A600FF]/10 text-[#A600FF]" 
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {option.flag && <span>{option.flag}</span>}
                                        {option.label}
                                    </div>
                                    {option.value === value && <Check size={14} className="animate-in zoom-in duration-300" />}
                                </button>
                            ))
                        ) : (
                            <div className="px-5 py-4 text-xs font-bold text-zinc-600 italic text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
