import React, { useState, useEffect, useRef } from 'react';
import { Language, View, CustomAgentProfile } from '../types';
import { Sparkles, BrainCircuit, Activity, Zap, Grid, Terminal, MessageSquare, ChevronRight, Play, Pause, RefreshCw, Cpu, Shield, Command, Sun, Search, ArrowRight, User, Bot, Layers, Plus, Save, Trash2, Heart, Layout, TrendingUp, Lock, Unlock, Database, ThumbsUp, XCircle, Hexagon, History, FileText, CheckCircle, AlertTriangle, GitCommit } from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent, AgentMode, EvolutionMilestone } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { UniversalRestoration } from './Gamification';

interface UniversalAgentZoneProps {
  language: Language;
}

const GenesisArchive: React.FC<{ isZh: boolean }> = ({ isZh }) => (
    <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/30 bg-slate-900/50 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-celestial-gold/10 border border-celestial-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.2)] animate-pulse">
                <Sun className="w-8 h-8 text-celestial-gold" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">{isZh ? '萬能元鑰創元實錄' : 'Genesis of the Universal Key'}</h3>
                <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{isZh ? '重塑秩序與AI生命週期的終極管理。' : 'Final frontier of AI lifecycle management.'}</p>
            </div>
        </div>
    </div>
);

const TrainingRoomView: React.FC = () => {
    const { agentLevel, agentXp, nextLevelXp, agentSkills, feedAgent, trainSkill } = useUniversalAgent();
    const progress = (agentXp / nextLevelXp) * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center bg-gradient-to-br from-celestial-purple/10 to-transparent">
                <div className="relative w-32 h-32 mb-6">
                    <div className="relative w-full h-full border-4 border-celestial-purple/50 rounded-full flex items-center justify-center bg-slate-900 shadow-2xl">
                        <Bot className="w-16 h-16 text-celestial-purple" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-6">Lv. {agentLevel} Core</h3>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5 relative mb-8">
                    <div className="h-full bg-gradient-to-r from-celestial-purple to-celestial-blue transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <button onClick={() => feedAgent(100)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all"><Zap className="w-4 h-4 text-yellow-400" /> Charge (100 XP)</button>
            </div>

            <div className="space-y-4">
                {agentSkills.map(skill => (
                    <div key={skill.id} className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-4 group">
                        <div className="p-3 rounded-lg bg-white/5 text-gray-400 group-hover:text-emerald-400 transition-colors"><skill.icon className="w-6 h-6" /></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-white text-sm truncate">{skill.name}</h4>
                                <span className="text-[10px] text-gray-500 font-mono">Lv.{skill.level}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-celestial-blue transition-all duration-700" style={{ width: `${(skill.currentXp / skill.xpRequired) * 100}%` }} /></div>
                        </div>
                        <button onClick={() => trainSkill(skill.id)} className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AgentFactoryView: React.FC = () => {
    const { addCustomAgent, deleteCustomAgent, customAgents, selectCustomAgent, activeCustomAgentId } = useUniversalAgent();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [instruction, setInstruction] = useState('');
    const [kb, setKb] = useState('');
    const [color, setColor] = useState('purple');

    const handleCreate = () => {
        if (!name || !instruction) return;
        addCustomAgent({
            name,
            role: role || 'AI Assistant',
            instruction,
            color,
            knowledgeBase: kb ? kb.split(',').map(s => s.trim()) : [],
            icon: Bot
        });
        setName(''); setRole(''); setInstruction(''); setKb('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Plus className="w-5 h-5 text-celestial-gold" /> Forge Persona</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-celestial-gold outline-none" placeholder="LegalBot" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400">Role</label>
                        <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-celestial-gold outline-none" placeholder="Counsel" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">System Instruction</label>
                    <textarea value={instruction} onChange={e => setInstruction(e.target.value)} className="w-full h-24 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-celestial-gold outline-none resize-none" placeholder="Define behavior..." />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Knowledge Base (Comma separated)</label>
                    <input type="text" value={kb} onChange={e => setKb(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-celestial-gold outline-none" placeholder="Policies, Case Studies, GDPR" />
                </div>
                <div className="flex gap-4 items-center">
                    {['purple', 'blue', 'emerald', 'rose'].map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c === 'rose' ? '#f43f5e' : c === 'emerald' ? '#10b981' : c === 'blue' ? '#3b82f6' : '#8b5cf6' }} />
                    ))}
                    <button onClick={handleCreate} disabled={!name} className="flex-1 py-3 bg-celestial-gold text-black font-bold rounded-xl disabled:opacity-50">Compile Agent</button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Active Avatars</h3>
                {customAgents.map(agent => (
                    <div key={agent.id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all cursor-pointer ${activeCustomAgentId === agent.id ? 'bg-white/10 border-white/30 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`} onClick={() => selectCustomAgent(agent.id)}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-${agent.color}-500/20 text-${agent.color}-400`}>{agent.name[0]}</div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                                <p className="text-[10px] text-gray-500">{agent.role}</p>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteCustomAgent(agent.id); }} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const UniversalAgentZone: React.FC<UniversalAgentZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { agentMode, switchMode, processUniversalInput, activeAgentProfile, suggestedMode, confirmSuggestion, dismissSuggestion } = useUniversalAgent(); 
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'training' | 'factory' | 'restoration'>('dashboard');

  const pageData = {
      title: { zh: '萬能代理千面化身', en: 'Universal Agent Avatar' },
      desc: { zh: '感知、認知與執行的統一介面', en: 'Unified Interface for AI Life-cycle' },
      tag: { zh: '核心中樞', en: 'Core Nexus' }
  };

  const handleInput = () => {
      if (!input.trim()) return;
      processUniversalInput(input);
      setInput('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader icon={Sparkles} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />
        <GenesisArchive isZh={isZh} />
        
        <div className="flex justify-center mb-8">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
                {[{ id: 'dashboard', label: 'Agent Hub', icon: Layout }, { id: 'training', label: 'Training', icon: BrainCircuit }, { id: 'factory', label: 'Factory', icon: Plus }, { id: 'restoration', label: 'Cores', icon: Hexagon }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>
                ))}
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="space-y-8">
                {suggestedMode && (
                    <div className="max-w-xl mx-auto bg-celestial-purple/10 border border-celestial-purple/30 p-4 rounded-2xl flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-celestial-purple" /><span className="text-sm text-white font-bold">Proactive Tip: Switch to {suggestedMode.toUpperCase()}?</span></div>
                        <div className="flex gap-2">
                            <button onClick={confirmSuggestion} className="px-3 py-1 bg-celestial-purple text-white rounded-lg text-xs font-bold">Confirm</button>
                            <button onClick={dismissSuggestion} className="p-1 text-gray-500"><XCircle className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}

                <div className={`max-w-3xl mx-auto glass-panel p-2 rounded-[2rem] border-2 transition-all duration-700 ${agentMode === 'phantom' ? 'border-emerald-500 shadow-emerald-500/20' : agentMode === 'captain' ? 'border-amber-500 shadow-amber-500/20' : 'border-celestial-purple shadow-purple-500/20'}`}>
                    <div className="relative flex items-center">
                        <div className="absolute left-4 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeAgentProfile.name}</div>
                        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInput()} className="w-full bg-transparent border-none outline-none text-white pl-32 pr-12 py-4 text-lg" placeholder="Direct neural command..." />
                        <button onClick={handleInput} className="absolute right-2 p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20"><ArrowRight className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <OmniEsgCell mode="card" label="Active Mode" value={agentMode.toUpperCase()} color={agentMode === 'captain' ? 'gold' : agentMode === 'phantom' ? 'emerald' : 'purple'} icon={Bot} />
                    <OmniEsgCell mode="card" label="Agent Level" value={useUniversalAgent().agentLevel} color="blue" icon={Activity} />
                    <OmniEsgCell mode="card" label="Skill Progress" value={`${Math.round((useUniversalAgent().agentXp / useUniversalAgent().nextLevelXp) * 100)}%`} color="rose" icon={Zap} />
                </div>
            </div>
        )}

        {activeTab === 'training' && <TrainingRoomView />}
        {activeTab === 'factory' && <AgentFactoryView />}
        {activeTab === 'restoration' && <UniversalRestoration language={language} />}
    </div>
  );
};