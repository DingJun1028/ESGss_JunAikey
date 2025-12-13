
import React from 'react';
import { Language } from '../types';
import { LucideIcon } from 'lucide-react';

interface UniversalPageHeaderProps {
    icon: LucideIcon;
    title: { zh: string; en: string };
    description: { zh: string; en: string };
    language: Language;
    tag?: { zh: string; en: string }; // The "Universal Tag" content
}

export const UniversalPageHeader: React.FC<UniversalPageHeaderProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    language,
    tag 
}) => {
    const isZh = language === 'zh-TW';
    
    // Logic: Main Title + (50% Thin Alt Title)
    const mainTitle = isZh ? title.zh : title.en;
    const altTitle = isZh ? title.en : title.zh;

    // Logic: Universal Tag (Show EN tag if ZH mode, ZH tag if EN mode)
    // If no specific tag provided, fallback to title logic or generic
    const tagLabel = tag 
        ? (isZh ? tag.en : tag.zh) 
        : (isZh ? title.en : title.zh);

    return (
        <div className="flex flex-col gap-4 mb-8 animate-fade-in border-b border-white/5 pb-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-white/10 to-transparent rounded-xl border border-white/20 shadow-lg backdrop-blur-sm">
                        <Icon className="w-8 h-8 text-celestial-gold" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-3 flex-wrap">
                            {mainTitle}
                            <span className="text-lg font-light text-gray-500 font-sans opacity-80" style={{ fontWeight: 300 }}>
                                {altTitle}
                            </span>
                        </h2>
                        <p className="text-gray-400 mt-1 text-sm font-light tracking-wide">
                            {isZh ? description.zh : description.en}
                        </p>
                    </div>
                </div>

                {/* Universal Tag Badge */}
                <div className="hidden md:flex items-center">
                    <div className="px-3 py-1 rounded-full border border-celestial-purple/30 bg-celestial-purple/10 text-celestial-purple text-[10px] font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                        {tagLabel}
                    </div>
                </div>
            </div>
        </div>
    );
};
