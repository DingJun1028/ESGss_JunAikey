
import React, { useState, useEffect, useRef } from 'react';
import { Language, View } from '../types';
import { Sparkles, BrainCircuit, Activity, Zap, Grid, Terminal, MessageSquare, ChevronRight, Play, Pause, RefreshCw, Cpu, Shield, Command, Sun, Search, ArrowRight } from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent, AgentMode } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { AiAssistant } from './AiAssistant'; // Reusing chat logic for Companion Mode
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';

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
            </div>
        </div>
    </div>
);

// --- Mode I: Companion View (Wrapper around AiAssistant logic for fullscreen) ---
const CompanionView: React.FC<{ language: Language }> = ({ language }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-celestial-purple/10 via-transparent to-transparent animate-pulse" />
            
            {/* Audio Waveform Simulation */}
            <div className="flex items-center justify-center gap-1 h-32 mb-8">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1.5 bg-celestial-purple/60 rounded-full animate-[bounce_1s_infinite]" 
                        style={{ 
                            height: `${Math.random() * 40 + 20}%`, 
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: `${0.8 + Math.random() * 0.5}s`
                        }} 
                    />
                ))}
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 text-center">
                {language === 'zh-TW' ? '我正在聆聽。' : 'I am listening.'}
            </h3>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl animate-fade-in max-w-lg w-full text-center relative z-10">
                <p className="text-xs text-celestial-purple font-mono mb-2">ACTIVE CONTEXT</p>
                <p className="text-sm text-gray-300">"Analyzing user sentiment... Empathy protocols engaged."</p>
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
            {/* Command Center Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <OmniEsgCell mode="cell" label="Active Agents" value="12" color="emerald" icon={BrainCircuit} />
                <OmniEsgCell mode="cell" label="System Load" value="42%" color="blue" icon={Activity} />
                <OmniEsgCell mode="cell" label="Tasks Pending" value="5" color="gold" icon={Grid} />
                <OmniEsgCell mode="cell" label="Neural Latency" value="12ms" color="purple" icon={Zap} />
            </div>

            {/* Active Universal Components Grid */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-celestial-gold" />
                    {isZh ? '萬能元件矩陣 (Component Matrix)' : 'Universal Component Matrix'}
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
                            {agent.status === 'Active' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Prediction/Insight Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-celestial-purple" />
                    {isZh ? '戰略預測' : 'Strategic Forecast'}
                </h3>
                <div className="flex-1 bg-black/20 rounded-xl p-4 text-xs text-gray-300 font-mono leading-relaxed overflow-y-auto custom-scrollbar">
                    <p className="mb-2">> Analyzing market trends...</p>
                    <p className="mb-2 text-emerald-400">> OPPORTUNITY DETECTED: Green hydrogen sector subsidy increased by 15%.</p>
                    <p className="mb-2">> Simulating impact on Portfolio B...</p>
                    <p className="mb-2">> Result: Projected ROI +2.4%.</p>
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
        <div className="h-[400px] glass-panel rounded-2xl border border-emerald-500/20 bg-black overflow-hidden flex flex-col font-mono text-xs">
            <div className="p-3 border-b border-white/10 bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-500">
                    <Terminal className="w-4 h-4" />
                    <span className="font-bold">PHANTOM_PROCESS_V15.0</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-gray-300 custom-scrollbar" ref={scrollRef}>
                {systemLogs.length === 0 && <div className="opacity-50">Initializing daemon services...</div>}
                {systemLogs.map((log) => (
                    <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded">
                        <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`font-bold shrink-0 w-20 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                            [{log.type.toUpperCase()}]
                        </span>
                        <span className="text-gray-400 shrink-0 w-24">@{log.source}:</span>
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
  // USE GLOBAL CONTEXT
  const { agentMode, isProcessing, processUniversalInput } = useUniversalAgent(); 
  const [input, setInput] = useState('');

  const pageData = {
      title: { zh: '萬能代理千面化身', en: 'Universal Agent Avatar' },
      desc: { zh: '感知、認知與執行的統一介面 (Tri-Mode Architecture)', en: 'Unified Interface for Perception, Cognition & Execution' },
      tag: { zh: '核心中樞', en: 'Core Nexus' }
  };

  const handleProcessInput = async () => {
      if (!input.trim()) return;
      await processUniversalInput(input);
      // Optional: clear input after processing or keep for reference
      // setInput(''); 
  };

  const getActiveColor = () => {
      switch(agentMode) {
          case 'captain': return 'border-celestial-gold shadow-celestial-gold/20';
          case 'phantom': return 'border-emerald-500 shadow-emerald-500/20';
          default: return 'border-celestial-purple shadow-celestial-purple/20';
      }
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

        {/* Universal Omni-Input Node */}
        <div className="flex justify-center mb-8 relative z-20">
            <div className={`w-full max-w-3xl bg-slate-900/80 backdrop-blur-xl p-2 rounded-3xl border-2 transition-all duration-700 shadow-2xl ${getActiveColor()} ${isProcessing ? 'animate-pulse' : ''}`}>
                <div className="relative flex items-center">
                    <div className="absolute left-4 text-gray-500">
                        {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Command className="w-6 h-6" />}
                    </div>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleProcessInput()}
                        disabled={isProcessing}
                        placeholder={isZh ? "輸入指令或對話，系統將自動切換型態..." : "Enter command or chat. System will auto-switch mode..."}
                        className="w-full bg-transparent border-none outline-none text-lg text-white pl-14 pr-16 py-4 placeholder-gray-500 font-medium"
                    />
                    <button 
                        onClick={handleProcessInput}
                        disabled={isProcessing || !input.trim()}
                        className="absolute right-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all disabled:opacity-50"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Active Mode Indicator */}
                <div className="flex justify-center mt-2 pb-1 gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                    <span className={agentMode === 'companion' ? 'text-celestial-purple' : 'opacity-30'}>Companion</span>
                    <span className="opacity-20">•</span>
                    <span className={agentMode === 'captain' ? 'text-celestial-gold' : 'opacity-30'}>Captain</span>
                    <span className="opacity-20">•</span>
                    <span className={agentMode === 'phantom' ? 'text-emerald-500' : 'opacity-30'}>Phantom</span>
                </div>
            </div>
        </div>

        {/* Content Area with Transition */}
        <div className={`transition-all duration-700 ${isProcessing ? 'opacity-50 scale-98 blur-[2px]' : 'opacity-100 scale-100 blur-0'}`}>
            {agentMode === 'companion' && <CompanionView language={language} />}
            {agentMode === 'captain' && <CaptainView language={language} />}
            {agentMode === 'phantom' && <PhantomView language={language} />}
        </div>
    </div>
  );
};
