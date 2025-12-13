
import React, { useState, useEffect } from 'react';
import { Language, View, CrystalType } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalCrystal } from './UniversalCrystal';
import { Sparkles, Activity, Layers, ArrowUpRight, Swords, Dna, Package, Shield, Zap, FlaskConical, Plus, Hexagon, Library, History, Archive, ScrollText, Trophy, Sun } from 'lucide-react';
import { getEsgCards } from '../constants';
import { UniversalCard } from './UniversalCard';
import { UniversalPageHeader } from './UniversalPageHeader';

interface GamificationProps {
  language: Language;
}

// Sub-Component: Eternal Palace
const EternalPalace: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { journal, collectedCards, checkBadges } = useCompany();
    const badges = checkBadges(); // Mock badges
    const cards = getEsgCards(isZh ? 'zh-TW' : 'en-US');
    const myDeck = cards.filter(c => collectedCards.includes(c.id));

    const [activeSection, setActiveSection] = useState<'ark' | 'corridor' | 'epics'>('ark');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Palace Nav */}
            <div className="flex justify-center mb-6">
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                    {[
                        { id: 'ark', label: isZh ? '收藏聖櫃 (Ark)' : 'Ark of Collection', icon: Archive },
                        { id: 'corridor', label: isZh ? '回憶長廊 (Memory)' : 'Memory Corridor', icon: History },
                        { id: 'epics', label: isZh ? '史詩篇章 (Epics)' : 'Epic Chapters', icon: ScrollText },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === tab.id ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ark of Collection (Cards + Light Scripture) */}
            {activeSection === 'ark' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {/* The Light Scripture (Special Item) */}
                    <div className="relative w-64 h-96 rounded-2xl bg-gradient-to-br from-celestial-gold/20 to-transparent border border-celestial-gold/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer group hover:scale-105 transition-transform">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        <div className="w-24 h-24 rounded-full bg-celestial-gold/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-pulse">
                            <Sun className="w-12 h-12 text-celestial-gold" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{isZh ? '光之聖典' : 'Light Scripture'}</h4>
                        <p className="text-xs text-gray-300">{isZh ? 'ESGss 技術規格白皮書與創世智慧。' : 'The Genesis Wisdom & Technical Whitepaper.'}</p>
                        <div className="mt-4 px-3 py-1 bg-celestial-gold text-black text-[10px] font-bold rounded-full uppercase">
                            LEGENDARY ITEM
                        </div>
                    </div>

                    {myDeck.length > 0 ? myDeck.map(card => (
                        <div key={card.id} className="transform hover:scale-105 transition-transform duration-300">
                            <UniversalCard 
                                card={card}
                                isLocked={false}
                                isSealed={false}
                                masteryLevel="Novice"
                                onClick={() => {}}
                                onKnowledgeInteraction={() => {}}
                                onPurifyRequest={() => {}}
                            />
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <Archive className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            {isZh ? '聖櫃空空如也，請前往市集收集卡牌' : 'The Ark is empty. Collect cards in the Marketplace.'}
                        </div>
                    )}
                </div>
            )}

            {/* Memory Corridor (Timeline) */}
            {activeSection === 'corridor' && (
                <div className="relative border-l-2 border-white/10 ml-6 space-y-8 py-4">
                    {journal.map((entry, i) => (
                        <div key={entry.id} className="relative pl-8 group">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all z-10 ${entry.type === 'milestone' ? 'bg-celestial-gold border-celestial-gold' : 'bg-slate-900 border-white/20'}`} />
                            <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                                <div className="text-xs text-gray-500 mb-1">{new Date(entry.timestamp).toLocaleString()}</div>
                                <h4 className={`font-bold ${entry.type === 'milestone' ? 'text-celestial-gold' : 'text-white'}`}>{entry.title}</h4>
                                <p className="text-sm text-gray-400 mt-1">{entry.impact}</p>
                                <div className="mt-2 flex gap-2">
                                    {entry.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/5 text-gray-400">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Epic Chapters (Achievements) */}
            {activeSection === 'epics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/30 bg-celestial-gold/5 flex flex-col items-center text-center">
                        <Trophy className="w-12 h-12 text-celestial-gold mb-4" />
                        <h4 className="text-lg font-bold text-white mb-2">Genesis Pioneer</h4>
                        <p className="text-sm text-gray-400">Joined during the Alpha Launch.</p>
                        <span className="mt-4 text-xs font-mono text-celestial-gold bg-black/30 px-3 py-1 rounded-full">UNLOCKED</span>
                    </div>
                    {/* Mock locked items */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center text-center opacity-50 grayscale">
                        <Shield className="w-12 h-12 text-gray-400 mb-4" />
                        <h4 className="text-lg font-bold text-white mb-2">Carbon Master</h4>
                        <p className="text-sm text-gray-400">Reduce emissions by 50%.</p>
                        <span className="mt-4 text-xs font-mono text-gray-500 bg-black/30 px-3 py-1 rounded-full">LOCKED</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-Component: Card Game Arena (Goodwill Era)
const CardGameArena: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { collectedCards } = useCompany();
    const cards = getEsgCards(isZh ? 'zh-TW' : 'en-US');
    const myDeck = cards.filter(c => collectedCards.includes(c.id));
    const [view, setView] = useState<'arena' | 'palace'>('arena');

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <UniversalPageHeader 
                icon={Swords}
                title={{ zh: '善向紀元 (Goodwill Era)', en: 'Goodwill Era' }}
                description={{ zh: '永續對決與永恆收藏', en: 'Sustainability Duels & Eternal Collection' }}
                language={isZh ? 'zh-TW' : 'en-US'}
                tag={{ zh: '遊戲核心', en: 'Game Core' }}
            />

            {/* Main Tabs */}
            <div className="flex border-b border-white/10 gap-6">
                <button 
                    onClick={() => setView('arena')}
                    className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${view === 'arena' ? 'border-celestial-gold text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    <Swords className="w-4 h-4" /> {isZh ? '競技場 (Arena)' : 'Arena'}
                </button>
                <button 
                    onClick={() => setView('palace')}
                    className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${view === 'palace' ? 'border-celestial-purple text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    <Library className="w-4 h-4" /> {isZh ? '永恆宮殿 (Eternal Palace)' : 'Eternal Palace'}
                </button>
            </div>

            {view === 'arena' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-end -mt-20 mb-4 relative z-10 pointer-events-none">
                       {/* Space for header actions if needed */}
                    </div>
                    
                    <div className="flex justify-end">
                        <button className="px-6 py-2 bg-celestial-gold text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                            <Zap className="w-4 h-4" /> {isZh ? '尋找對手' : 'Find Opponent'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Deck View */}
                        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 min-h-[400px]">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{isZh ? '我的戰鬥牌組' : 'Battle Deck'} ({myDeck.length}/30)</h4>
                            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 p-2">
                                {myDeck.length > 0 ? myDeck.map(card => (
                                    <div key={card.id} className="transform scale-75 origin-top-left -mr-16 hover:mr-0 hover:scale-100 transition-all duration-300 z-0 hover:z-10 hover:-translate-y-4">
                                        <UniversalCard 
                                            card={card}
                                            isLocked={false}
                                            isSealed={false}
                                            masteryLevel="Novice"
                                            onClick={() => {}}
                                            onKnowledgeInteraction={() => {}}
                                            onPurifyRequest={() => {}}
                                        />
                                    </div>
                                )) : (
                                    <div className="w-full text-center py-12 text-gray-500">
                                        {isZh ? '尚無卡牌' : 'No cards.'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats / Meta */}
                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-2xl border border-celestial-purple/30 bg-celestial-purple/10">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-celestial-purple" /> Season 1 Meta
                                </h4>
                                <div className="space-y-3 text-sm text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Global Rank</span>
                                        <span className="font-bold text-white">#4,285</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Win Rate</span>
                                        <span className="font-bold text-emerald-400">58%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Favorite Attr</span>
                                        <span className="font-bold text-blue-400">Environmental</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">{isZh ? '每週贏得 3 場勝利可獲得卡包' : 'Win 3 matches weekly for a pack'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 'palace' && <EternalPalace isZh={isZh} />}
        </div>
    );
};

// ... (RestorationProject and other components remain unchanged) ...
// Re-declaring for context in this file block replacement
const AiNursery: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { crystals, goodwillBalance, updateGoodwillBalance } = useCompany();
    const { addToast } = useToast();
    const [selectedCrystal, setSelectedCrystal] = useState<string | null>(null);

    const handleFeed = (amount: number) => {
        if (!selectedCrystal) return;
        if (goodwillBalance < amount) {
            addToast('error', isZh ? '善向幣不足' : 'Insufficient Goodwill', 'Nursery');
            return;
        }
        updateGoodwillBalance(-amount);
        addToast('reward', isZh ? `注入 ${amount} 能量！核心穩定度提升。` : `Injected ${amount} Energy! Stability increased.`, 'AI Nursery');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-900/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-emerald-400" />
                        {isZh ? '萬能培育室 (AI Nursery)' : 'AI Nursery'}
                    </h3>
                    <div className="px-3 py-1 bg-black/40 rounded-full text-xs text-celestial-gold font-mono border border-celestial-gold/30">
                        {goodwillBalance} GWC Available
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crystals.map(crystal => (
                        <div 
                            key={crystal.id} 
                            onClick={() => setSelectedCrystal(crystal.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group
                                ${selectedCrystal === crystal.id 
                                    ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                                    : 'bg-white/5 border-white/10 hover:border-white/30'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className="text-xs font-bold text-white">{crystal.name}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${crystal.integrity > 80 ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'}`}>
                                    {crystal.integrity}%
                                </span>
                            </div>
                            
                            <div className="h-24 flex items-center justify-center relative my-2">
                                <div className={`absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent bottom-0 transition-all duration-1000`} style={{ height: `${crystal.integrity}%` }} />
                                <Dna className={`w-12 h-12 text-white/50 ${selectedCrystal === crystal.id ? 'animate-pulse text-emerald-200' : ''}`} />
                            </div>

                            {selectedCrystal === crystal.id && (
                                <div className="flex gap-2 mt-2 relative z-10">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleFeed(100); }}
                                        className="flex-1 py-1 bg-emerald-500 text-black text-xs font-bold rounded hover:bg-emerald-400 transition-colors"
                                    >
                                        Feed (100G)
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all cursor-pointer min-h-[180px]">
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="text-xs">{isZh ? '擴充培育槽' : 'Add Slot'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RestorationProject: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { crystals, restoreCrystal, collectCrystalFragment } = useCompany();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'crystals' | 'nursery'>('crystals');

    const totalRestored = crystals.filter(c => c.state === 'Restored' || c.state === 'Perfected').length;
    const systemLevel = Math.floor((totalRestored / crystals.length) * 100);

    useEffect(() => {
        const timer = setTimeout(() => {
            const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
            if (randomCrystal && randomCrystal.state === 'Fragmented') {
                collectCrystalFragment(randomCrystal.id);
                addToast('reward', isZh ? `發現 ${randomCrystal.name} 的記憶碎片！` : `Found fragment for ${randomCrystal.name}!`, 'System Discovery');
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleRestore = (id: string, name: string) => {
        restoreCrystal(id);
        addToast('success', isZh ? `核心 ${name} 修復完成！功能已解鎖。` : `Core ${name} Restored! Features unlocked.`, 'System Restoration');
    };

    return (
        <div className="space-y-8 animate-fade-in relative min-h-screen pb-12">
            <UniversalPageHeader 
                icon={Hexagon}
                title={{ zh: '萬能核心修復計畫', en: 'Universal Core Restoration' }}
                description={{ zh: '收集記憶碎片，重塑 JunAiKey 的完美型態 (Zero Hallucination)。', en: 'Collect fragments to restore JunAiKey to its perfect form.' }}
                language={isZh ? 'zh-TW' : 'en-US'}
                tag={{ zh: '系統修復', en: 'System Restore' }}
            />

            <div className="glass-panel p-6 rounded-2xl border border-white/10 -mt-6 mb-8 flex items-center gap-6">
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            {isZh ? '系統完整度 (System Integrity)' : 'System Integrity'}
                        </span>
                        <span className="text-lg font-mono font-bold text-emerald-400">{systemLevel}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-celestial-gold transition-all duration-1000 ease-out"
                            style={{ width: `${systemLevel}%` }}
                        />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('crystals')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'crystals' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {isZh ? '核心矩陣' : 'Crystal Matrix'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('nursery')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'nursery' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {isZh ? 'AI 培育室' : 'AI Nursery'}
                    </button>
                </div>
            </div>

            {activeTab === 'crystals' && (
                <>
                    <div className="relative py-12">
                        <div className="absolute inset-0 pointer-events-none">
                            <svg className="w-full h-full opacity-20">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="50%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                                <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                                <circle cx="50%" cy="50%" r="150" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" className="animate-[spin_20s_linear_infinite]" />
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center relative z-10">
                            {crystals.map((crystal, idx) => (
                                <div key={crystal.id} className={`transform transition-all duration-700 hover:-translate-y-4`} style={{ animationDelay: `${idx * 200}ms` }}>
                                    <UniversalCrystal 
                                        crystal={crystal}
                                        onRestore={() => handleRestore(crystal.id, crystal.name)}
                                        onClick={() => {}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-transparent">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Dna className="w-5 h-5 text-emerald-400" />
                                {isZh ? '自他覺零幻覺機制' : 'Zero Hallucination Protocol'}
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                {isZh 
                                    ? 'JunAiKey 核心具備自我監控能力。當「核心完整度」低於 70% 時，AI 輸出可能出現幻覺。系統將自動鎖定高風險功能，直到您透過「稽核 (Audit)」或「外部驗證 (Oracle)」修復水晶。' 
                                    : 'JunAiKey monitors integrity. If < 70%, AI might hallucinate. High-risk features lock until crystal stabilization via Audit/Oracle.'}
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> Active Monitoring
                                </span>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-gradient-to-bl from-slate-900 to-transparent">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-celestial-purple" />
                                {isZh ? '如何收集碎片？' : 'How to Collect Fragments?'}
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-celestial-gold/20 flex items-center justify-center text-celestial-gold font-bold">1</div>
                                    <span>{isZh ? '完成每日任務 (My ESG)' : 'Complete Daily Quests'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-celestial-purple/20 flex items-center justify-center text-celestial-purple font-bold">2</div>
                                    <span>{isZh ? '使用報告生成器 (Expression Core)' : 'Use Report Generator'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-celestial-blue/20 flex items-center justify-center text-celestial-blue font-bold">3</div>
                                    <span>{isZh ? '上傳並驗證數據 (Perception Core)' : 'Upload & Verify Data'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'nursery' && <AiNursery isZh={isZh} />}
        </div>
    );
};

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  return <RestorationProject isZh={isZh} />;
};

export const UniversalRestoration: React.FC<{ language: Language }> = ({ language }) => (
    <RestorationProject isZh={language === 'zh-TW'} />
);

export const CardGameArenaView: React.FC<{ language: Language }> = ({ language }) => (
    <CardGameArena isZh={language === 'zh-TW'} />
);
