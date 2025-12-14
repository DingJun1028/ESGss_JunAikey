
import React from 'react';
import { Language } from '../types';
import { LucideIcon, Database, Link2, Hash } from 'lucide-react';

interface UniversalPageHeaderProps {
    icon: LucideIcon;
    title: { zh: string; en: string };
    description: { zh: string; en: string };
    language: Language;
    tag?: { zh: string; en: string }; // The "Universal Tag" content
    accentColor?: string; // Optional accent color class, e.g. "text-emerald-400"
}

export const UniversalPageHeader: React.FC<UniversalPageHeaderProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    language,
    tag,
    accentColor = "text-celestial-gold" // Default
}) => {
    const isZh = language === 'zh-TW';
    
    // Logic: Universal Tag [ Chinese # English ]
    // Used for semantic lookup in AITable, BlueCC, NoCodeBackend
    const tagZh = tag ? tag.zh : title.zh;
    const tagEn = tag ? tag.en : title.en;

    return (
        <div className="flex flex-col gap-4 mb-8 animate-fade-in border-b border-white/5 pb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br from-white/10 to-transparent rounded-xl border border-white/20 shadow-lg backdrop-blur-sm shrink-0`}>
                        <Icon className={`w-8 h-8 ${accentColor}`} />
                    </div>
                    <div>
                        {/* Optimized Typography: Mixed Font Sizes & Weights */}
                        {/* MECE Principle: Distinct visual hierarchy for separate languages */}
                        <h2 className="text-white tracking-tight flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                            <span className="text-2xl md:text-3xl font-bold font-sans tracking-tight">
                                {isZh ? title.zh : title.en}
                            </span>
                            <span className="text-sm md:text-lg font-light text-gray-500 font-sans tracking-wide opacity-80" style={{ fontWeight: 300 }}>
                                {isZh ? title.en.replace(/[()]/g, '') : title.zh.replace(/[()]/g, '')}
                            </span>
                        </h2>
                        
                        <p className="text-gray-400 mt-1 text-sm font-light tracking-wide leading-relaxed max-w-2xl">
                            {isZh ? description.zh : description.en}
                        </p>
                    </div>
                </div>

                {/* Universal Tag Badge - Bidirectional Sync Indicator */}
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 shadow-inner group cursor-help transition-all hover:border-celestial-gold/30 hover:bg-slate-900">
                        <Hash className="w-3 h-3 text-celestial-gold/70 group-hover:text-celestial-gold transition-colors" />
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-300">
                            <span className="text-white/90 font-medium">{tagZh}</span> 
                            <span className="mx-2 text-gray-600">#</span> 
                            <span className="text-white/90 font-medium">{tagEn}</span>
                        </span>
                        <Link2 className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                    </div>
                    
                    {/* Backend Connection Indicators */}
                    <div className="flex gap-2 text-[9px] font-mono uppercase tracking-wider opacity-60">
                        <div className="flex items-center gap-1 text-emerald-500/70" title="Connected to AITable">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> AITable
                        </div>
                        <div className="flex items-center gap-1 text-blue-500/70" title="Connected to BlueCC">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> BlueCC
                        </div>
                        <div className="flex items-center gap-1 text-purple-500/70" title="Connected to NoCodeBackend">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> NCB
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
