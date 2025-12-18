
import React, { useState } from 'react';
import { Language, View, EsgCard } from '../types';
import { 
    Swords, Shield, Zap, Sparkles, Trophy, User, 
    Bot, RefreshCw, Layers, BrainCircuit, Activity,
    Trophy as TrophyIcon, Zap as ZapIcon, Target, Search
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { UniversalCard } from './UniversalCard';
import { getEsgCards } from '../constants';

interface CardGameProps {
  language: Language;
}

export const CardGame: React.FC<CardGameProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { collectedCards, esgScores } = useCompany();
  const { addToast } = useToast();
  
  const [gameState, setGameState] = useState<'lobby' | 'battle'>('lobby');
  const [battleStep, setBattleStep] = useState(0);
  
  const allCards = getEsgCards(language);
  const myDeck = allCards.filter(c => collectedCards.includes(c.id));

  const pageData = {
      title: { zh: '永續競技場 (The Arena)', en: 'The Sustainability Arena' },
      desc: { zh: '利用 ESG 知識卡片進行策略對戰，強化轉型邏輯。', en: 'Duel with ESG cards to master transformation logic.' },
      tag: { zh: '遊戲化核心', en: 'Gamification' }
  };

  const startBattle = () => {
      if (myDeck.length === 0) {
          addToast('error', isZh ? '請先前往市集收集卡牌！' : 'Collect cards first!', 'Arena Error');
          return;
      }
      setGameState('battle');
      setBattleStep(0);
      addToast('info', isZh ? '正在匹配對手：CFO 代理人...' : 'Matching opponent: CFO Agent...', 'JunAiKey Battle');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative overflow-hidden h-full flex flex-col">
        <div className="shrink-0">
            <UniversalPageHeader icon={Swords} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />
        </div>

        {gameState === 'lobby' ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
                <div className="lg:col-span-2 glass-panel p-8 rounded-[3rem] border border-white/10 flex flex-col overflow-hidden bg-slate-900/40">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Layers className="w-6 h-6 text-celestial-gold" />
                            {isZh ? '我的戰鬥牌組' : 'My Battle Deck'} ({myDeck.length})
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="text" placeholder="Search..." className="bg-black/30 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none focus:border-celestial-gold/50" />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-4 grid grid-cols-2 md:grid-cols-3 gap-6">
                        {myDeck.map(card => (
                            <div key={card.id} className="transform hover:-translate-y-2 transition-all duration-300">
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
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-celestial-gold/30 bg-gradient-to-br from-amber-900/10 to-transparent flex flex-col justify-between h-80 shadow-2xl">
                        <div>
                            <div className="flex items-center gap-3 text-celestial-gold mb-6">
                                <Activity className="w-8 h-8" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Battle Ready</span>
                            </div>
                            <h4 className="text-3xl font-black text-white tracking-tighter mb-4">{isZh ? '準備開戰' : 'Battle Prep'}</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {isZh ? '環境分數 (E) 將為您的綠色卡牌提供 +15% 屬性加成。' : 'Your Env Score gives +15% buff to Green cards.'}
                            </p>
                        </div>
                        <button 
                            onClick={startBattle}
                            className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            <ZapIcon className="w-5 h-5 fill-current" />
                            {isZh ? '進入競技場' : 'Enter Arena'}
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-white/10">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{isZh ? '賽季成就' : 'Season Rewards'}</h4>
                        <div className="space-y-3">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                <div className="p-2 bg-celestial-gold/10 rounded-lg text-celestial-gold"><TrophyIcon className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-xs font-bold text-white">Season 1: Genesis</div>
                                    <div className="text-[10px] text-gray-500">Rank: #1,245 (Apprentice)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)] pointer-events-none" />
                
                <div className="max-w-4xl w-full flex flex-col items-center gap-12">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-24 rounded-full border-4 border-emerald-500 p-1 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=Player`} className="w-full h-full rounded-full bg-slate-800" alt="Me" />
                            </div>
                            <span className="text-sm font-black text-white uppercase tracking-widest">Architect</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="text-6xl font-black text-white italic tracking-tighter mb-2">VS</div>
                            <div className="px-4 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Critical Decision</div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-24 rounded-full border-4 border-red-500 p-1 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                                    <Bot className="w-12 h-12 text-red-500" />
                                </div>
                            </div>
                            <span className="text-sm font-black text-white uppercase tracking-widest">CFO Agent</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-8">
                        <div className="p-8 liquid-glass rounded-[2rem] border border-white/10 text-center max-w-lg">
                            <h4 className="text-xl font-bold text-white mb-2">{isZh ? '正在進行邏輯模擬...' : 'Running Logic Simulation...'}</h4>
                            <p className="text-sm text-gray-400 leading-relaxed italic">
                                "The CFO Agent argues that upfront costs for solar are too high. Deploy 'Strategic Vision' card to counter with long-term ROI."
                            </p>
                        </div>
                        <button onClick={() => setGameState('lobby')} className="px-10 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-bold transition-all border border-white/10">
                            {isZh ? '退出競技場' : 'Concede Battle'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
