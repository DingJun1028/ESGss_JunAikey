
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { LucideIcon, Database, Link2, Hash, Server, Activity, ShieldCheck, Zap } from 'lucide-react';
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

    const tagZh = tag ? tag.zh : title.zh;
    const tagEn = tag ? tag.en : title.en;
    const mainTitle = isZh ? title.zh : title.en;

    return (
        <div className="flex flex-col gap-4 mb-8 animate-fade-in border-b border-white/5 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                    <div className={`p-4 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/20 shadow-xl backdrop-blur-md shrink-0 group hover:rotate-3 transition-transform`}>
                        <Icon className={`w-10 h-10 ${accentColor} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-baseline gap-x-4 gap-y-1">
                            <h2 className="text-3xl md:text-4xl font-black font-sans tracking-tighter text-white">
                                {mainTitle}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                    Logic Node Alpha
                                </span>
                            </div>
                        </div>
                        
                        <p className="text-gray-400 mt-3 text-sm font-light tracking-wide leading-relaxed max-w-2xl">
                            {isZh ? description.zh : description.en}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {/* System Coherence Indicator (Evolution Visual) */}
                    <div className="w-48 space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-500"/> Coherence</div>
                            <span className="text-emerald-400 font-mono">{vitals?.systemCoherence || 0}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-600 to-celestial-emerald transition-all duration-1000"
                                style={{ width: `${vitals?.systemCoherence || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 shadow-inner group transition-all hover:border-celestial-gold/30">
                        <Hash className="w-3.5 h-3.5 text-celestial-gold/70 group-hover:text-celestial-gold" />
                        <span className="text-[10px] font-mono text-gray-400">
                            <span className="text-white/90 font-bold">{tagZh}</span> 
                            <span className="mx-2 text-gray-700">|</span> 
                            <span className="text-white/90 font-bold">{tagEn}</span>
                        </span>
                        <Link2 className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                    </div>
                </div>
            </div>

            {/* Step 0-1-Infinity Indicator (Evolutionary State) */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar py-1">
                {['Perception', 'Cognition', 'Memory', 'Expression', 'Nexus'].map(core => (
                    <div key={core} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold text-gray-500 whitespace-nowrap">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {core} Core: <span className="text-gray-300">Synchronized</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
