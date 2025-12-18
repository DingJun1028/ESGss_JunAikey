
import React, { useState, useEffect } from 'react';
import { Language, View, CustomAgentProfile, AgentFlow } from '../types';
import { 
    Sparkles, BrainCircuit, Activity, Zap, Grid, Terminal, MessageSquare, 
    ChevronRight, Play, Pause, RefreshCw, Cpu, Shield, Command, Sun, 
    Search, ArrowRight, User, Bot, Layers, Plus, Save, Trash2, Heart, 
    Layout, TrendingUp, Lock, Unlock, Database, ThumbsUp, XCircle, 
    Hexagon, History, FileText, CheckCircle, AlertTriangle, GitCommit, 
    Infinity, Palette, Users, Network, GitBranch, Split, Monitor, Code, Eye, Globe,
    /* Fix: Added missing icon imports PenTool and Wand2 to resolve "Cannot find name" errors */
    PenTool, Wand2
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent, AgentMode } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';

interface UniversalAgentZoneProps {
  language: Language;
}

const PERSONA_ICONS = [
    { id: 'Bot', icon: Bot },
    { id: 'Shield', icon: Shield },
    { id: 'Terminal', icon: Terminal },
    { id: 'Brain', icon: BrainCircuit },
    { id: 'Database', icon: Database },
    { id: 'Globe', icon: Globe },
    { id: 'Target', icon: Activity },
    { id: 'Eye', icon: Eye },
    { id: 'Monitor', icon: Monitor },
    { id: 'Code', icon: Code },
];

const PERSONA_COLORS = [
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'gold', class: 'bg-amber-500' },
    { id: 'rose', class: 'bg-rose-500' },
    { id: 'cyan', class: 'bg-cyan-500' },
    { id: 'indigo', class: 'bg-indigo-500' },
];

const PersonaForge: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { addCustomAgent, customAgents, activeCustomAgentId } = useUniversalAgent();
    const { universalNotes, files } = useCompany();
    const { addToast } = useToast();

    const [form, setForm] = useState({
        name: '',
        role: '',
        instruction: '',
        prompt: '',
        color: 'purple',
        iconId: 'Bot',
        knowledgeAnchors: [] as string[]
    });

    const handleCreate = () => {
        if (!form.name || !form.role || !form.prompt) {
            addToast('error', 'Please define at least Name, Role, and Prompt.', 'Forge');
            return;
        }

        const icon = PERSONA_ICONS.find(i => i.id === form.iconId)?.icon || Bot;

        addCustomAgent({
            name: form.name,
            role: form.role,
            instruction: form.instruction,
            prompt: form.prompt,
            color: form.color,
            knowledgeBase: form.knowledgeAnchors,
            icon: icon
        });

        setForm({
            name: '',
            role: '',
            instruction: '',
            prompt: '',
            color: 'purple',
            iconId: 'Bot',
            knowledgeAnchors: []
        });
    };

    const toggleAnchor = (id: string) => {
        setForm(prev => ({
            ...prev,
            knowledgeAnchors: prev.knowledgeAnchors.includes(id) 
                ? prev.knowledgeAnchors.filter(a => a !== id) 
                : [...prev.knowledgeAnchors, id]
        }));
    };

    const SelectedIcon = PERSONA_ICONS.find(i => i.id === form.iconId)?.icon || Bot;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/50 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{isZh ? '人格名稱' : 'Persona Name'}</label>
                            <input 
                                value={form.name}
                                onChange={e => setForm({...form, name: e.target.value})}
                                placeholder="e.g. ESG Auditor Pro"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{isZh ? '系統職責' : 'System Role'}</label>
                            <input 
                                value={form.role}
                                onChange={e => setForm({...form, role: e.target.value})}
                                placeholder="e.g. Compliance Specialist"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{isZh ? '核心提示詞 (Deep Prompt)' : 'Deep Personality Prompt'}</label>
                        <textarea 
                            value={form.prompt}
                            onChange={e => setForm({...form, prompt: e.target.value})}
                            placeholder="Detail the logic, tone, and specific constraints for this persona..."
                            className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-celestial-gold/50 outline-none resize-none leading-relaxed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{isZh ? '簡易說明' : 'Short Instruction'}</label>
                        <input 
                            value={form.instruction}
                            onChange={e => setForm({...form, instruction: e.target.value})}
                            placeholder="A concise description for the HUD"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? '視覺辨識 (Icon)' : 'Visual ID'}</label>
                            <div className="grid grid-cols-5 gap-2">
                                {PERSONA_ICONS.map(i => (
                                    <button 
                                        key={i.id}
                                        onClick={() => setForm({...form, iconId: i.id})}
                                        className={`p-3 rounded-xl border transition-all flex items-center justify-center ${form.iconId === i.id ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-transparent text-gray-600 hover:text-gray-400'}`}
                                    >
                                        <i.icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? '能量特徵 (Color)' : 'Energy Signature'}</label>
                            <div className="flex gap-2">
                                {PERSONA_COLORS.map(c => (
                                    <button 
                                        key={c.id}
                                        onClick={() => setForm({...form, color: c.id})}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${c.class} ${form.color === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Knowledge Anchoring */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/50 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Database className="w-6 h-6 text-celestial-purple" />
                        {isZh ? '知識錨定 (Knowledge Anchors)' : 'Knowledge Anchors'}
                    </h3>
                    <p className="text-xs text-gray-500">Selected artifacts will be injected into this persona's context window.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto no-scrollbar pr-2">
                        {universalNotes.map(note => (
                            <button 
                                key={note.id}
                                onClick={() => toggleAnchor(note.id)}
                                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${form.knowledgeAnchors.includes(note.id) ? 'bg-celestial-purple/10 border-celestial-purple text-white' : 'bg-white/5 border-transparent text-gray-500'}`}
                            >
                                <PenTool className="w-4 h-4 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-xs font-bold truncate">{note.title}</div>
                                    <div className="text-[9px] opacity-60">Note Asset</div>
                                </div>
                            </button>
                        ))}
                        {files.map(file => (
                            <button 
                                key={file.id}
                                onClick={() => toggleAnchor(file.id)}
                                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${form.knowledgeAnchors.includes(file.id) ? 'bg-celestial-blue/10 border-celestial-blue text-white' : 'bg-white/5 border-transparent text-gray-500'}`}
                            >
                                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-xs font-bold truncate">{file.name}</div>
                                    <div className="text-[9px] opacity-60">Scanned PDF</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/50 sticky top-24">
                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Wand2 className="w-4 h-4" /> Manifestation Preview
                    </h3>
                    
                    {/* HUD Style Preview */}
                    <div className="w-full aspect-[4/5] rounded-[2.5rem] bg-slate-950 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col p-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-20 pointer-events-none" />
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`p-3 rounded-2xl text-white shadow-lg`} style={{ backgroundColor: PERSONA_COLORS.find(c => c.id === form.color)?.class.replace('bg-', '') || 'purple' }}>
                                <SelectedIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs font-black text-white uppercase tracking-tighter">{form.name || 'Agent Name'}</div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase">{form.role || 'Designated Role'}</div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-4 opacity-30">
                            <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>

                        <div className="mt-8 p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-[8px] font-bold text-gray-600 uppercase mb-2">Neural Anchors</div>
                            <div className="flex gap-1.5 overflow-hidden">
                                {form.knowledgeAnchors.length === 0 ? (
                                    <div className="text-[8px] italic text-gray-700">None attached.</div>
                                ) : form.knowledgeAnchors.map(a => (
                                    <div key={a} className="w-3 h-3 rounded-full bg-celestial-purple/40 shrink-0" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCreate}
                        className="w-full mt-8 py-5 bg-white text-black font-black rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <Infinity className="w-5 h-5" />
                        FORGE PERSONA
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrchestratorView: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { workforces, deployWorkforce, executeFlow, customAgents, activeFlows, isProcessing } = useUniversalAgent();
    const { addToast } = useToast();
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [teamName, setTeamName] = useState('');

    const handleDeploy = () => {
        if (!teamName || selectedAgents.length === 0) {
            addToast('warning', 'Please define team name and select agents.', 'Orchestrator');
            return;
        }
        deployWorkforce(teamName, selectedAgents);
        setTeamName('');
        setSelectedAgents([]);
    };

    const handleRunAutoFlow = () => {
        const mockFlow: AgentFlow = {
            id: `flow-${Date.now()}`,
            title: isZh ? '全系統 ESG 數據自動審計' : 'System-wide ESG Data Audit',
            description: 'Coordinating multi-agent verification pipeline.',
            steps: [
                { id: 's1', agentId: 'Steward', action: 'Scan Data Gaps', status: 'pending' },
                { id: 's2', agentId: 'Captain', action: 'Risk Benchmark', status: 'pending' },
                { id: 's3', agentId: 'Scribe', action: 'Draft Disclosure', status: 'pending' }
            ],
            coherenceScore: 98
        };
        executeFlow(mockFlow);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team Creator */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/50 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Users className="w-6 h-6 text-celestial-gold" />
                        {isZh ? '部署萬能小組 (Workforce)' : 'Deploy Workforce Team'}
                    </h3>
                    <div className="space-y-4">
                        <input 
                            value={teamName} 
                            onChange={e => setTeamName(e.target.value)}
                            placeholder={isZh ? "小組名稱 (例如：Q3 審計小組)" : "Team Name (e.g. Audit Squad)"}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none"
                        />
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Avatars</div>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar pr-2">
                            {customAgents.map(agent => (
                                <button 
                                    key={agent.id}
                                    onClick={() => setSelectedAgents(prev => prev.includes(agent.id) ? prev.filter(i => i !== agent.id) : [...prev, agent.id])}
                                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${selectedAgents.includes(agent.id) ? 'bg-celestial-gold/20 border-celestial-gold text-white' : 'bg-white/5 border-transparent text-gray-500'}`}
                                >
                                    {typeof agent.icon === 'string' ? <Bot className="w-4 h-4" /> : <agent.icon className="w-4 h-4" />}
                                    <span className="text-xs font-bold truncate">{agent.name}</span>
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={handleDeploy}
                            className="w-full py-4 bg-celestial-gold text-black font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            <Plus className="w-5 h-5" />
                            DEPLOY WORKFORCE
                        </button>
                    </div>
                </div>

                {/* Flow Monitor */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-950/50 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Network className="w-6 h-6 text-celestial-blue" />
                            {isZh ? '萬能流程矩陣' : 'Universal Flow Matrix'}
                        </h3>
                        <button 
                            onClick={handleRunAutoFlow}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-celestial-blue/20 text-celestial-blue border border-celestial-blue/30 rounded-xl text-xs font-black flex items-center gap-2"
                        >
                            <Zap className="w-4 h-4" /> RUN AUTO-FLOW
                        </button>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                        {activeFlows.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <Split className="w-16 h-16 mb-4" />
                                <p className="text-xs uppercase tracking-widest">No active flows running</p>
                            </div>
                        ) : (
                            activeFlows.map(flow => (
                                <div key={flow.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm font-bold text-white">{flow.title}</div>
                                        <div className="text-[10px] font-mono text-emerald-400">COHERENCE: {flow.coherenceScore}%</div>
                                    </div>
                                    <div className="space-y-2">
                                        {flow.steps.map(step => (
                                            <div key={step.id} className="flex items-center gap-3 text-[11px]">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-celestial-gold animate-pulse' : 'bg-emerald-500'}`} />
                                                <span className="text-gray-500 font-bold w-16">[{step.agentId}]</span>
                                                <span className="text-gray-300">{step.action}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CompareScanView: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { customAgents, activeAgentProfile } = useUniversalAgent();
    const { addToast } = useToast();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);

    const handleSystemScan = () => {
        setIsScanning(true);
        addToast('info', isZh ? '啟動全系統邏輯與檔案比對掃描...' : 'Initiating system-wide logic & file scan...', 'Scanner');
        
        setTimeout(() => {
            setIsScanning(false);
            setScanResult({
                coherence: 94.2,
                gapIdentified: ['Scope 3 Logistics Data', 'Supplier CSR Certification'],
                bestFitAgent: customAgents[0]?.name || 'Captain Deck',
                optimizationPaths: 12
            });
            addToast('success', 'Scan complete. Universal Agent synchronized with local artifacts.', 'JunAiKey');
        }, 3000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-celestial-purple/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="w-20 h-20 rounded-3xl bg-celestial-purple/10 border border-celestial-purple/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                        {isScanning ? <RefreshCw className="w-10 h-10 text-celestial-purple animate-spin" /> : <GitBranch className="w-10 h-10 text-celestial-purple" />}
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">
                        {isZh ? '系統化全檔比對與優化' : 'Systematic Artifact Benchmarking'}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {isZh 
                            ? '自動掃描當前系統中的所有萬能筆記、報告文件與數據，與「萬能代理」的多個人格化身進行邏輯對位，優化產出路徑。' 
                            : 'Automated cross-referencing between all system artifacts and your Universal Agent personas to optimize decision pathways.'}
                    </p>
                    <button 
                        onClick={handleSystemScan}
                        disabled={isScanning}
                        className="px-10 py-4 bg-white text-black font-black rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                    >
                        {isScanning ? 'SCANNING KERNEL...' : 'LAUNCH NEURAL SCAN'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {scanResult && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10 animate-slide-up">
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-left">
                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">System Coherence</div>
                            <div className="text-3xl font-black text-white">{scanResult.coherence}%</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-left">
                            <div className="text-[10px] font-bold text-celestial-gold uppercase tracking-widest mb-1">Best Fit Personality</div>
                            <div className="text-3xl font-black text-white truncate">{scanResult.bestFitAgent}</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-left">
                            <div className="text-[10px] font-bold text-celestial-blue uppercase tracking-widest mb-1">Optimization Paths</div>
                            <div className="text-3xl font-black text-white">{scanResult.optimizationPaths}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const UniversalAgentZone: React.FC<UniversalAgentZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { agentMode, activeAgentProfile, suggestedMode, confirmSuggestion, dismissSuggestion, customAgents, selectCustomAgent, deleteCustomAgent, activeCustomAgentId } = useUniversalAgent(); 
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orchestrator' | 'scan' | 'factory'>('dashboard');

  const pageData = {
      title: { zh: '萬能代理與 Agentic Flow', en: 'Universal Agent & Agentic Flow' },
      desc: { zh: '將 Agentic Flow 功能模組化改良，實現多化身協作與自動化萬能流程。', en: 'Improved modular Agentic Flow functionality with multi-avatar collaboration.' },
      tag: { zh: '指揮中樞', en: 'Command Center' }
  };

  const getAgentColor = (color: string) => {
      switch(color) {
          case 'gold': return '#fbbf24';
          case 'purple': return '#a855f7';
          case 'emerald': return '#10b981';
          case 'blue': return '#3b82f6';
          case 'rose': return '#f43f5e';
          default: return '#8b5cf6';
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader icon={Sparkles} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />
        
        <div className="flex justify-center mb-8 sticky top-0 z-30 py-2">
            <div className="flex bg-slate-900/80 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
                {[
                    { id: 'dashboard', label: 'Agent Hub', icon: Layout }, 
                    { id: 'factory', label: 'Persona Forge', icon: Plus },
                    { id: 'orchestrator', label: 'Flow Orchestrator', icon: Network }, 
                    { id: 'scan', label: 'Neural Scan', icon: Search },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all flex items-center gap-2 whitespace-nowrap uppercase ${activeTab === tab.id ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 to-transparent relative overflow-hidden flex flex-col justify-between shadow-2xl">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                         <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className={`w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr transition-all duration-700
                                    ${activeAgentProfile.color === 'gold' ? 'from-amber-400 to-yellow-600' :
                                      activeAgentProfile.color === 'emerald' ? 'from-emerald-400 to-teal-600' :
                                      activeAgentProfile.color === 'blue' ? 'from-blue-400 to-indigo-600' :
                                      'from-purple-400 to-indigo-600'}
                                `}>
                                    <div className="w-full h-full bg-slate-900 rounded-[1.2rem] flex items-center justify-center">
                                        <activeAgentProfile.icon className={`w-12 h-12 
                                            ${activeAgentProfile.color === 'gold' ? 'text-amber-400' :
                                              activeAgentProfile.color === 'emerald' ? 'text-emerald-400' :
                                              activeAgentProfile.color === 'blue' ? 'text-blue-400' :
                                              'text-purple-400'}
                                        `} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{activeAgentProfile.name}</h3>
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{activeAgentProfile.role}</div>
                                </div>
                            </div>
                         </div>
                         <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-gray-300 leading-relaxed italic relative z-10">
                             "{activeAgentProfile.instruction}"
                         </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex flex-col justify-between shadow-xl">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <RefreshCw className="w-3 h-3" /> Base Protocols
                        </h4>
                        <div className="space-y-2">
                            {[
                                { id: 'companion', label: 'Steward', icon: Bot },
                                { id: 'captain', label: 'Captain', icon: Shield },
                                { id: 'phantom', label: 'Phantom', icon: Terminal },
                            ].map(protocol => (
                                <button 
                                    key={protocol.id} 
                                    onClick={() => useUniversalAgent().switchMode(protocol.id as any)}
                                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group
                                        ${agentMode === protocol.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <protocol.icon className={`w-5 h-5 ${agentMode === protocol.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                        <span className={`text-xs font-bold ${agentMode === protocol.id ? 'text-white' : 'text-gray-500'}`}>{protocol.label}</span>
                                    </div>
                                    {agentMode === protocol.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-celestial-gold" />
                        Custom Personas (The Thousand Faces)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customAgents.map(agent => (
                            <div key={agent.id} className={`p-4 rounded-2xl border transition-all group flex items-center justify-between
                                ${activeCustomAgentId === agent.id && agentMode === 'custom' ? 'bg-white/10 border-white/30' : 'bg-white/5 border-transparent hover:border-white/10'}
                            `}>
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => selectCustomAgent(agent.id)}>
                                    <div className={`p-3 rounded-xl bg-slate-800 border border-white/10`}>
                                        {typeof agent.icon === 'string' ? <Bot className="w-5 h-5" /> : <agent.icon className="w-5 h-5" style={{ color: getAgentColor(agent.color) }} />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{agent.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{agent.role}</div>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); deleteCustomAgent(agent.id); }} className="p-2 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {customAgents.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl opacity-30">
                                <p className="text-sm uppercase tracking-widest">No custom personas forged.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'factory' && <PersonaForge isZh={isZh} />}
        {activeTab === 'orchestrator' && <OrchestratorView isZh={isZh} />}
        {activeTab === 'scan' && <CompareScanView isZh={isZh} />}
    </div>
  );
};
