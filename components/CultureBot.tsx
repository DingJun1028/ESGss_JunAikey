
import React, { useState } from 'react';
import { Language } from '../types';
import { Bot, MessageSquare, CheckSquare, Heart, Coffee, Send, ChevronRight, Smile, Zap } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { UniversalPageHeader } from './UniversalPageHeader';

interface CultureBotProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Agent: Culture Spirit (The Empath)
// ----------------------------------------------------------------------
interface CultureSpiritProps extends InjectedProxyProps {
    xp: number;
}

const CultureSpiritBase: React.FC<CultureSpiritProps> = ({ xp, adaptiveTraits, isAgentActive, trackInteraction }) => {
    // Agent Visuals
    const isHappy = adaptiveTraits?.includes('bridging') || xp > 2000;
    const isThinking = isAgentActive;

    return (
        <div 
            onClick={() => trackInteraction?.('click')}
            className={`w-24 h-24 rounded-full flex items-center justify-center relative cursor-pointer group transition-all duration-500
                ${isHappy ? 'bg-gradient-to-tr from-celestial-purple to-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'bg-gradient-to-tr from-gray-700 to-slate-600'}
            `}
        >
            {isThinking && (
                <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
            )}
            
            {/* Spirit Aura */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${isHappy ? 'bg-pink-500 animate-pulse' : 'bg-gray-500'}`} />

            <div className="relative z-10 text-white">
                {isHappy ? <Smile className="w-10 h-10 animate-bounce" /> : <Bot className="w-10 h-10" />}
            </div>

            {/* Status Bubble */}
            <div className="absolute -bottom-2 px-2 py-0.5 bg-black/80 rounded-full border border-white/20 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {isHappy ? "Spirit: Joyful" : "Spirit: Neutral"}
            </div>
        </div>
    );
};

const CultureSpiritAgent = withUniversalProxy(CultureSpiritBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const CultureBot: React.FC<CultureBotProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { quests, completeQuest, awardXp, xp } = useCompany();
  const { addToast } = useToast();
  
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
      { id: 1, role: 'bot', text: isZh ? "早安！今天的減碳小撇步：隨手關閉不必要的電源，可以減少約 5% 的辦公室能耗喔！" : "Good morning! Tip of the day: Turning off idle electronics can save up to 5% of office energy!" }
  ]);

  const pageData = {
      title: { zh: '文化推廣機器人', en: 'Culture Bot' },
      desc: { zh: '每日微學習與 ESG 參與', en: 'Daily Micro-learning & ESG Engagement' },
      tag: { zh: '文化核心', en: 'Culture Core' }
  };

  const activeQuests = quests.filter(q => q.status !== 'completed');

  const handleQuestClick = (quest: any) => {
      if (quest.status === 'completed') return;
      // Simulate completion in the Culture Bot view
      completeQuest(quest.id, quest.xp);
      addToast('reward', isZh ? `完成任務！+${quest.xp} XP` : `Quest Complete! +${quest.xp} XP`, 'Culture Bot');
  };

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      
      const userMsg = { id: Date.now(), role: 'user', text: chatInput };
      setChatHistory(prev => [...prev, userMsg]);
      setChatInput('');

      // Simple echo bot for culture interaction
      setTimeout(() => {
          const botMsg = { 
              id: Date.now() + 1, 
              role: 'bot', 
              text: isZh 
                ? "收到！我會將此反饋記錄到 ESG 文化儀表板。" 
                : "Noted! I'll log this feedback to the ESG Culture Dashboard." 
          };
          setChatHistory(prev => [...prev, botMsg]);
      }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex items-center gap-6 border-b border-white/5 pb-6 mb-2">
            {/* The Agent Avatar */}
            <div className="shrink-0">
                <CultureSpiritAgent 
                    id="CultureSpirit" 
                    label="Culture Spirit" 
                    xp={xp} 
                />
            </div>
            <div className="flex-1">
                <UniversalPageHeader 
                    icon={Bot}
                    title={pageData.title}
                    description={pageData.desc}
                    language={language}
                    tag={pageData.tag}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Daily Feed (Real Quests) */}
            <div className="md:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-celestial-purple/5 to-transparent">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Coffee className="w-5 h-5 text-celestial-gold" />
                            {isZh ? '今日任務 (Daily Quests)' : 'Daily Quests'}
                        </h3>
                        <span className="text-xs text-celestial-purple bg-celestial-purple/10 px-2 py-1 rounded-full border border-celestial-purple/20">
                            {activeQuests.length} Active
                        </span>
                    </div>
                    
                    <div className="space-y-3">
                        {activeQuests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                                {isZh ? '今日任務皆已完成！' : 'All daily quests completed!'}
                            </div>
                        ) : (
                            activeQuests.slice(0, 3).map(quest => (
                                <div key={quest.id} onClick={() => handleQuestClick(quest)} className="cursor-pointer">
                                    <OmniEsgCell 
                                        mode="list" 
                                        label={quest.title} 
                                        subValue={quest.desc}
                                        value={`+${quest.xp} pts`} 
                                        color={quest.rarity === 'Legendary' ? 'gold' : quest.rarity === 'Epic' ? 'purple' : 'emerald'} 
                                        icon={quest.type === 'Challenge' ? Heart : CheckSquare} 
                                        verified={false}
                                        className="hover:border-celestial-purple/50 transition-all"
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '組織氛圍 (Vibe Check)' : 'Vibe Check'}</h3>
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-center flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-2xl font-bold text-emerald-400">88%</div>
                            <div className="text-xs text-gray-400 mt-1">Engagement</div>
                        </div>
                        <div className="text-center flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-2xl font-bold text-celestial-gold">High</div>
                            <div className="text-xs text-gray-400 mt-1">Sentiment</div>
                        </div>
                        <div className="text-center flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-2xl font-bold text-celestial-purple">{Math.floor(xp / 100)}</div>
                            <div className="text-xs text-gray-400 mt-1">Lifetime Actions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat/Bot Interface */}
            <div className="glass-panel p-0 rounded-2xl flex flex-col h-[500px] overflow-hidden border border-white/10">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-white">Culture Assistant</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar bg-slate-900/30">
                    {chatHistory.map((msg, idx) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-700 text-xs' : 'bg-celestial-purple/20'}`}>
                                {msg.role === 'user' ? 'Me' : <Bot className="w-4 h-4 text-celestial-purple"/>}
                            </div>
                            <div className={`rounded-2xl p-3 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-celestial-emerald/20 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 border-t border-white/10 bg-white/5 relative">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isZh ? "輸入訊息..." : "Type a message..."}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-purple outline-none"
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
