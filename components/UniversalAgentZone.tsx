
import React, { useState, useEffect, useRef } from 'react';
import { Language, View, CustomAgentProfile } from '../types';
import { Sparkles, BrainCircuit, Activity, Zap, Grid, Terminal, MessageSquare, ChevronRight, Play, Pause, RefreshCw, Cpu, Shield, Command, Sun, Search, ArrowRight, User, Bot, Layers, Plus, Save, Trash2, Heart, Layout, TrendingUp, Lock, Unlock, Database, ThumbsUp, XCircle, Hexagon } from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent, AgentMode } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { UniversalRestoration } from './Gamification';

interface UniversalAgentZoneProps {
  language: Language;
}

// --- Lore Component: Genesis Archive ---
const GenesisArchive: React.FC<{ isZh: boolean }> = ({ isZh }) => (
    <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/30 bg-slate-900/50 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-celestial-gold/10 border border-celestial-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.2)] animate-pulse">
                <Sun className="w-8 h-8 text-celestial-gold" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    {isZh ? '萬能元鑰創元實錄' : 'Genesis of the Universal Key'}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-celestial-gold/20 text-celestial-gold border border-celestial-gold/30 uppercase tracking-wider">Lore</span>
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
                    {isZh 
                        ? '第一建築師為了阻止宇宙混屯，犧牲自我化作「萬能代理千面化身」，將宇宙奧義打散為無數記憶結晶。您作為「萬能元鑰召喚神使」，將在此指引下收集碎片，重塑秩序。'
                        : 'The First Architect sacrificed themselves to stop cosmic chaos, becoming the "Universal Agent Avatar of a Thousand Faces" and scattering wisdom as memory crystals. As the Summoner Envoy, you gather these fragments to restore order.'}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-celestial-gold">
                    <Shield className="w-4 h-4" />
                    <span className="font-mono font-bold uppercase tracking-wider">{isZh ? '零幻覺標配：已啟用' : 'Zero Hallucination: STANDARD'}</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400">{isZh ? 'AI 內容源自您的專屬萬能智庫 (Personal Think Tank)' : 'AI output grounded in your Personal Universal Think Tank.'}</span>
                </div>
            </div>
        </div>
    </div>
);

// --- Agent Nursery View (Leveling System) ---
const AgentSkillsView: React.FC = () => {
    const { agentLevel, agentXp, nextLevelXp, agentSkills, feedAgent, trainSkill } = useUniversalAgent();
    const progress = (agentXp / nextLevelXp) * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {/* Core Stats */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-celestial-purple/10 to-transparent">
                <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-celestial-purple/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-full h-full border-4 border-celestial-purple/50 rounded-full flex items-center justify-center bg-slate-900 shadow-2xl">
                        <Bot className="w-16 h-16 text-celestial-purple" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-celestial-gold text-black text-xs font-bold px-3 py-1 rounded-full border border-white whitespace-nowrap">
                        Lv. {agentLevel} | Universal Agent
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">Neural Core Status</h3>
                <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    Sentient & Evolving
                </p>

                <div className="w-full space-y-2 mb-6">
                    <div className="flex justify-between text-xs text-gray-300">
                        <span>Global XP Progress</span>
                        <span>{agentXp} / {nextLevelXp}</span>
                    </div>
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                            className="h-full bg-gradient-to-r from-celestial-purple to-celestial-blue transition-all duration-1000 relative" 
                            style={{ width: `${progress}%` }} 
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_linear_infinite]" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => feedAgent(100)}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Quick Charge (100 XP)
                    </button>
                </div>
            </div>

            {/* Skill Tree */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-emerald-400" />
                        Neural Skill Tree
                    </h3>
                    <span className="text-xs text-gray-500">Train skills to unlock perks</span>
                </div>
                
                {agentSkills.map(skill => {
                    const skillProgress = (skill.currentXp / skill.xpRequired) * 100;
                    const isMaxed = skill.level >= skill.maxLevel;
                    const isPerkUnlock = (skill.level + 1) % 3 === 0;

                    return (
                        <div key={skill.id} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-3 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                            {/* Skill Header */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-3 rounded-lg ${isMaxed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>
                                    <skill.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-white">{skill.name}</h4>
                                        <span className={`text-xs ${isMaxed ? 'text-emerald-400' : 'text-celestial-purple'} font-mono`}>
                                            Lv. {skill.level}/{skill.maxLevel}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">{skill.description}</p>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                                        <div 
                                            className={`h-full transition-all duration-700 ease-out ${isMaxed ? 'bg-emerald-500' : 'bg-celestial-blue'}`} 
                                            style={{ width: `${isMaxed ? 100 : skillProgress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500">
                                        <span>{isMaxed ? 'MAXED' : `${skill.currentXp} / ${skill.xpRequired} XP`}</span>
                                        {isPerkUnlock && !isMaxed && <span className="text-amber-400 font-bold animate-pulse">Next Level: Perk Unlock!</span>}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => trainSkill(skill.id)}
                                    disabled={isMaxed || agentXp < 50} // Assume minimal cost
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10 flex flex-col items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Train</span>
                                </button>
                            </div>

                            {/* Unlocks / Perks Strip */}
                            <div className="flex gap-2 mt-1 relative z-10 border-t border-white/5 pt-2">
                                {[3, 6, 9].map(lvl => {
                                    const isUnlocked = skill.level >= lvl;
                                    return (
                                        <div key={lvl} className={`flex items-center gap-1 text-[9px] px-2 py-1 rounded border ${isUnlocked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-black/30 text-gray-600 border-white/5'}`}>
                                            {isUnlocked ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                                            <span>Lv.{lvl} Perk</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                
                {/* Knowledge Base Connectors */}
                <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                        <Database className="w-3 h-3 text-celestial-blue" />
                        Universal Think Tank Sources (Zero Hallucination)
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                        {['Notion', 'Google Drive', 'Capacities', 'InfoFlow', 'UpNote', 'OneDrive'].map(src => (
                            <span key={src} className="text-[10px] px-2 py-1 rounded-full bg-black/40 border border-white/10 text-gray-400 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {src}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Agent Factory View (Custom Creator) ---
const AgentFactoryView: React.FC = () => {
    const { addCustomAgent, customAgents, selectCustomAgent, activeCustomAgentId } = useUniversalAgent();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [instruction, setInstruction] = useState('');
    const [color, setColor] = useState('pink');

    const handleCreate = () => {
        if (!name || !instruction) return;
        addCustomAgent({
            name,
            role: role || 'Assistant',
            instruction,
            color,
            knowledgeBase: [],
            icon: Bot // Default icon
        });
        setName('');
        setRole('');
        setInstruction('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Create Form */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-celestial-gold" />
                    Forge New Agent
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Name</label>
                            <input 
                                type="text" value={name} onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-celestial-gold outline-none"
                                placeholder="e.g. Legal Bot"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Role</label>
                            <input 
                                type="text" value={role} onChange={e => setRole(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-celestial-gold outline-none"
                                placeholder="e.g. Compliance Advisor"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 ml-1">System Instruction (Prompt)</label>
                        <textarea 
                            value={instruction} onChange={e => setInstruction(e.target.value)}
                            className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-celestial-gold outline-none resize-none"
                            placeholder="Define the agent's personality, constraints, and expertise..."
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        {['pink', 'blue', 'green', 'orange'].map(c => (
                            <button 
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: c === 'pink' ? '#ec4899' : c === 'blue' ? '#3b82f6' : c === 'green' ? '#10b981' : '#f97316' }}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleCreate}
                        disabled={!name || !instruction}
                        className="w-full py-3 bg-celestial-gold text-black font-bold rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50 mt-4"
                    >
                        Initialize Agent
                    </button>
                </div>
            </div>

            {/* Agent List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Your Agents</h3>
                {customAgents.length === 0 && <div className="text-gray-500 text-sm italic">No custom agents yet.</div>}
                {customAgents.map(agent => (
                    <div 
                        key={agent.id} 
                        onClick={() => selectCustomAgent(agent.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group
                            ${activeCustomAgentId === agent.id 
                                ? 'bg-white/10 border-white/30 ring-1 ring-white/20' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10'}
                        `}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-${agent.color}-500/20 text-${agent.color}-400 border border-${agent.color}-500/30`}>
                            {agent.name.substring(0,2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                            <p className="text-xs text-gray-400">{agent.role}</p>
                        </div>
                        {activeCustomAgentId === agent.id && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Mode I: Companion View (Chat Interface) ---
const CompanionView: React.FC<{ language: Language }> = ({ language }) => {
    const { chatHistory } = useUniversalAgent();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="flex flex-col h-[400px] relative overflow-hidden rounded-2xl border border-celestial-purple/30 bg-slate-900/30 transition-all duration-500 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-celestial-purple/10 via-transparent to-transparent pointer-events-none" />
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-celestial-purple" />
                    {language === 'zh-TW' ? '萬能對話日誌' : 'Universal Chat Log'}
                </h3>
                <span className="text-[10px] text-celestial-purple bg-celestial-purple/10 px-2 py-0.5 rounded border border-celestial-purple/20">Companion Mode Active</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10" ref={scrollRef}>
                {chatHistory.map(log => (
                    <div key={log.id} className={`flex gap-3 ${log.source === 'Chat' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        {log.source !== 'Chat' && (
                            <div className="w-8 h-8 rounded-full bg-celestial-purple/20 flex items-center justify-center shrink-0 border border-celestial-purple/30">
                                <Bot className="w-4 h-4 text-celestial-purple" />
                            </div>
                        )}
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                            log.source === 'Chat' 
                                ? 'bg-celestial-purple text-white rounded-br-none' 
                                : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                        }`}>
                            {log.message}
                        </div>
                        {log.source === 'Chat' && (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-white/10">
                                <User className="w-4 h-4 text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Mode II: Captain View (Strategic Grid) ---
const CaptainView: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const agents = [
        { id: 'strategy_oracle', name: 'Strategy Oracle', role: 'Cognition', status: 'Active', load: 45 },
        { id: 'carbon_calc', name: 'Carbon Calculator', role: 'Computation', status: 'Idle', load: 12 },
        { id: 'spectral_scanner', name: 'Spectral Scanner', role: 'Perception', status: 'Active', load: 78 },
        { id: 'roi_sim', name: 'ROI Simulator', role: 'Prediction', status: 'Thinking', load: 60 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <OmniEsgCell mode="cell" label="Active Agents" value="12" color="emerald" icon={BrainCircuit} />
                <OmniEsgCell mode="cell" label="System Load" value="42%" color="blue" icon={Activity} />
                <OmniEsgCell mode="cell" label="Tasks Pending" value="5" color="gold" icon={Grid} />
                <OmniEsgCell mode="cell" label="Neural Latency" value="12ms" color="purple" icon={Zap} />
            </div>
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-celestial-gold/30 bg-slate-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-celestial-gold/10 px-3 py-1 rounded-bl-xl border-b border-l border-celestial-gold/20 text-[10px] text-celestial-gold font-bold uppercase">Captain Mode Active</div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-celestial-gold" />
                    {isZh ? '萬能元件矩陣' : 'Component Matrix'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {agents.map(agent => (
                        <div key={agent.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-gold/30 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className="text-sm font-bold text-white">{agent.name}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${agent.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}`}>
                                    {agent.status}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mb-3 relative z-10">{agent.role} Core</div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden relative z-10">
                                <div className={`h-full transition-all duration-1000 ${agent.load > 70 ? 'bg-amber-500' : 'bg-celestial-blue'}`} style={{ width: `${agent.load}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-celestial-purple" />
                    {isZh ? '戰略預測' : 'Strategic Forecast'}
                </h3>
                <div className="flex-1 bg-black/20 rounded-xl p-4 text-xs text-gray-300 font-mono leading-relaxed overflow-y-auto custom-scrollbar">
                    <p className="mb-2">> Analyzing market trends...</p>
                    <p className="mb-2 text-emerald-400">> OPPORTUNITY: Green hydrogen sector subsidy +15%.</p>
                    <p className="mb-2">> Simulating ROI...</p>
                    <p className="animate-pulse">_ Waiting for command.</p>
                </div>
            </div>
        </div>
    );
};

// --- Mode III: Phantom View (Log Stream) ---
const PhantomView: React.FC<{ language: Language }> = ({ language }) => {
    const { systemLogs } = useUniversalAgent();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [systemLogs]);

    return (
        <div className="h-[400px] glass-panel rounded-2xl border border-emerald-500/30 bg-black overflow-hidden flex flex-col font-mono text-xs shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="p-3 border-b border-emerald-500/20 bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-500">
                    <Terminal className="w-4 h-4" />
                    <span className="font-bold">PHANTOM_PROCESS_V15.0</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider animate-pulse">Phantom Mode Active</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-gray-300 custom-scrollbar" ref={scrollRef}>
                {systemLogs.map((log) => (
                    <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded animate-fade-in">
                        <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`font-bold shrink-0 w-20 ${log.type === 'error' ? 'text-red-500' : 'text-emerald-400'}`}>
                            [{log.type.toUpperCase()}]
                        </span>
                        <span className="break-all">{log.message}</span>
                    </div>
                ))}
                <div className="animate-pulse text-emerald-500">_</div>
            </div>
        </div>
    );
};

export const UniversalAgentZone: React.FC<UniversalAgentZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { agentMode, switchMode, isProcessing, processUniversalInput, activeAgentProfile, suggestedMode, confirmSuggestion, dismissSuggestion } = useUniversalAgent(); 
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'skills' | 'factory' | 'restoration'>('dashboard');

  const pageData = {
      title: { zh: '萬能代理千面化身', en: 'Universal Agent Avatar' },
      desc: { zh: '感知、認知與執行的統一介面 (Tri-Mode Architecture)', en: 'Unified Interface for Perception, Cognition & Execution' },
      tag: { zh: '核心中樞', en: 'Core Nexus' }
  };

  const handleProcessInput = async () => {
      if (!input.trim()) return;
      await processUniversalInput(input);
      setInput(''); 
  };

  const getActiveColor = () => {
      if (agentMode === 'custom') return 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-gradient-to-r from-slate-900 via-pink-900/10 to-slate-900';
      switch(agentMode) {
          case 'captain': return 'border-celestial-gold shadow-[0_0_30px_rgba(251,191,36,0.3)] bg-gradient-to-r from-slate-900 via-amber-900/10 to-slate-900';
          case 'phantom': return 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-gradient-to-r from-slate-900 via-emerald-900/10 to-slate-900';
          default: return 'border-celestial-purple shadow-[0_0_30px_rgba(139,92,246,0.3)] bg-gradient-to-r from-slate-900 via-purple-900/10 to-slate-900';
      }
  };

  const getModeIcon = () => {
      if (activeAgentProfile && activeAgentProfile.icon) {
          const Icon = activeAgentProfile.icon;
          return <Icon className={`w-5 h-5 text-${activeAgentProfile.color}-400`} />;
      }
      return <Bot className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Sparkles}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <GenesisArchive isZh={isZh} />

        {/* Tab Nav */}
        <div className="flex justify-center mb-6">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                {[
                    { id: 'dashboard', label: isZh ? '代理儀表板' : 'Agent Dashboard', icon: Layout },
                    { id: 'skills', label: isZh ? 'AI 技能樹' : 'Agent Skills', icon: BrainCircuit },
                    { id: 'factory', label: isZh ? '自訂代理' : 'Agent Factory', icon: Plus },
                    { id: 'restoration', label: isZh ? '核心修復' : 'Core Restoration', icon: Hexagon },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <>
                {/* Universal Omni-Input Node */}
                <div className="flex justify-center mb-8 relative z-20 flex-col items-center gap-4">
                    
                    {/* Mode Suggestion Pill */}
                    {suggestedMode && (
                        <div className="animate-bounce-slow flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg mb-[-1rem] z-30">
                            <Sparkles className="w-4 h-4 text-celestial-gold animate-pulse" />
                            <span className="text-xs text-white">
                                {isZh ? `建議切換至 ${suggestedMode.toUpperCase()} 模式以獲得更佳體驗` : `Suggest switching to ${suggestedMode.toUpperCase()} mode`}
                            </span>
                            <div className="h-4 w-px bg-white/20 mx-1" />
                            <button onClick={confirmSuggestion} className="p-1 hover:bg-emerald-500/20 rounded-full text-emerald-400 transition-colors" title="Accept">
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button onClick={dismissSuggestion} className="p-1 hover:bg-red-500/20 rounded-full text-red-400 transition-colors" title="Dismiss">
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className={`w-full max-w-3xl backdrop-blur-xl p-2 rounded-3xl border-2 transition-all duration-700 ${getActiveColor()} ${isProcessing ? 'animate-pulse scale-[0.99]' : ''}`}>
                        <div className="relative flex items-center">
                            <div className="absolute left-4">
                                {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin text-gray-400" /> : getModeIcon()}
                            </div>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleProcessInput()}
                                disabled={isProcessing}
                                placeholder={isZh ? `正在與 [${activeAgentProfile.name}] 對話...` : `Chatting with [${activeAgentProfile.name}]...`}
                                className="w-full bg-transparent border-none outline-none text-lg text-white pl-14 pr-16 py-4 placeholder-gray-500 font-medium"
                            />
                            <button 
                                onClick={handleProcessInput}
                                disabled={isProcessing || !input.trim()}
                                className="absolute right-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all disabled:opacity-50 group"
                            >
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        
                        {/* Mode Indicator & Switcher */}
                        <div className="flex justify-center mt-2 pb-1 gap-6 text-[10px] uppercase font-bold tracking-widest text-gray-500 relative">
                            {[
                                { id: 'companion', color: 'celestial-purple', label: 'Companion' },
                                { id: 'captain', color: 'celestial-gold', label: 'Captain' },
                                { id: 'phantom', color: 'emerald-500', label: 'Phantom' }
                            ].map(m => (
                                <button 
                                    key={m.id}
                                    onClick={() => switchMode(m.id as any)}
                                    className={`flex items-center gap-1 transition-all duration-500 hover:scale-110 ${agentMode === m.id ? `text-${m.color} scale-110` : 'opacity-30 hover:opacity-100'}`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${agentMode === m.id ? `bg-${m.color} animate-pulse` : 'bg-gray-700'}`} />
                                    {m.label}
                                </button>
                            ))}
                            {agentMode === 'custom' && (
                                <div className="flex items-center gap-1 text-pink-400 scale-110">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                                    CUSTOM
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area with Transition - Using Key for Animation Reset */}
                <div key={agentMode} className="animate-fade-in transition-all duration-500">
                    {(agentMode === 'companion' || agentMode === 'custom') && <CompanionView language={language} />}
                    {agentMode === 'captain' && <CaptainView language={language} />}
                    {agentMode === 'phantom' && <PhantomView language={language} />}
                </div>
            </>
        )}

        {activeTab === 'skills' && <AgentSkillsView />}
        {activeTab === 'factory' && <AgentFactoryView />}
        {activeTab === 'restoration' && <UniversalRestoration language={language} />}
    </div>
  );
};
