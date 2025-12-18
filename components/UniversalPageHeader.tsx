
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { LucideIcon, Link2, Hash, ShieldCheck, Activity } from 'lucide-react';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';

interface UniversalPageHeaderProps {
    icon: LucideIcon;
    title: { zh: string; en: string };
    description: { zh: string; en: string };
    language: Language;
    tag?: { zh: string; en: string }; 
    accentColor?: string; 
}

export const UniversalPageHeader: React.FC<UniversalPageHeaderProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    language,
    tag,
    accentColor = "text-celestial-gold" 
}) => {
    const isZh = language === 'zh-TW';
    const [vitals, setVitals] = useState<SystemVital | null>(null);

    useEffect(() => {
        const sub = universalIntelligence.vitals$.subscribe(setVitals);
        return () => sub.unsubscribe();
    }, []);

    const mainTitle = isZh ? title.zh : title.en;
    const tagText = tag ? (isZh ? tag.zh : tag.en) : (isZh ? title.zh : title.en);

    return (
        <div className="flex flex-col gap-4 mb-8 animate-fade-in border-b border-white/5 pb-8 relative group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                    <div className={`p-4 bg-gradient-to-br from-white/10 to-transparent rounded-[1.5rem] border border-white/20 shadow-2xl backdrop-blur-xl shrink-0 transition-all duration-500 group-hover:rotate-2 group-hover:scale-105`}>
                        <Icon className={`w-10 h-10 ${accentColor} transition-transform duration-700`} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-baseline gap-x-4 gap-y-1">
                            <h2 className="text-3xl md:text-4xl font-black font-sans tracking-tighter text-white drop-shadow-sm">
                                {mainTitle}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    Logic Node Alpha
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                        
                        <p className="text-gray-400 mt-2 text-[15px] font-medium tracking-wide leading-relaxed max-w-2xl opacity-80">
                            {isZh ? description.zh : description.en}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="w-48 space-y-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500"/> {isZh ? '系統相干度' : 'Coherence'}</div>
                            <span className="text-emerald-500 font-mono">{vitals?.systemCoherence || 0}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${vitals?.systemCoherence || 0}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 shadow-inner hover:border-celestial-gold/50 transition-all group/tag cursor-help">
                        <Hash className="w-4 h-4 text-celestial-gold/80 group-hover/tag:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {tagText}
                        </span>
                        <Link2 className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};
