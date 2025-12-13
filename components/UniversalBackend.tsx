
import React, { useEffect, useState } from 'react';
import { universalIntelligence, SystemVital, MCPRegistryItem } from '../services/evolutionEngine';
import { Activity, Database, Cpu, Network, Zap, Server, BrainCircuit, MemoryStick, HardDrive, Box, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';

// ... (CoreNodeBase and MetricCard components remain the same) ...
// Re-declaring for context completeness in the replace block
interface CoreNodeProps extends InjectedProxyProps {
    evolutionStage: number;
}

const CoreNodeBase: React.FC<CoreNodeProps> = ({ 
    evolutionStage, adaptiveTraits, isAgentActive, trackInteraction 
}) => {
    const isLearning = isAgentActive || adaptiveTraits?.includes('learning');
    const isEvolved = adaptiveTraits?.includes('evolution');

    return (
        <div 
            className="relative w-[400px] h-[400px] mb-16 flex items-center justify-center cursor-pointer group"
            onClick={() => trackInteraction?.('click')}
        >
            <div className={`absolute inset-0 rounded-full border border-cyan-900/50 border-dashed animate-[spin_60s_linear_infinite_reverse] ${isLearning ? 'border-cyan-500/30' : ''}`} />
            <div className={`absolute inset-8 rounded-full border-2 border-transparent border-t-cyan-500/30 border-b-cyan-500/30 animate-[spin_20s_linear_infinite] ${isEvolved ? 'border-t-celestial-gold/30 border-b-celestial-gold/30' : ''}`} />
            <div className={`absolute inset-0 animate-[spin_3s_linear_infinite] ${isLearning ? 'opacity-100' : 'opacity-30'}`}>
                <div className="absolute top-0 left-1/2 w-1 h-20 bg-gradient-to-b from-cyan-400 to-transparent blur-[1px]" />
            </div>
            <div className={`absolute inset-32 rounded-full bg-slate-950 border transition-all duration-500 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] z-20 backdrop-blur-md group-hover:scale-105
                ${isLearning ? 'border-celestial-gold/50 shadow-[0_0_50px_rgba(251,191,36,0.2)]' : 'border-cyan-500/20'}
            `}>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-600 mb-1 group-hover:text-celestial-gold transition-colors">
                    {isLearning ? 'Optimizing' : 'System Stage'}
                </div>
                <div className={`text-6xl font-bold tracking-tighter drop-shadow-lg transition-colors ${isLearning ? 'text-celestial-gold' : 'text-white'}`}>
                    v{evolutionStage}
                </div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    ONLINE
                </div>
            </div>
        </div>
    );
};

const CoreNode = withUniversalProxy(CoreNodeBase);

const MetricCard = React.memo(({ icon, label, value, subtext, color, progress }: any) => {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500',
    purple: 'text-purple-400 border-purple-500/20 bg-purple-500',
    rose: 'text-rose-400 border-rose-500/20 bg-rose-500',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500',
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/40 border ${colorMap[color].split(' ')[1]} p-6 rounded-2xl hover:bg-slate-800/40 transition-all duration-500 group`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-slate-950 ${colorMap[color].split(' ')[0]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1 font-sans">{value}</div>
      <div className="text-xs text-slate-500">{subtext}</div>
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${colorMap[color].split(' ')[2]}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
    </div>
  );
});

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const UniversalBackend: React.FC = () => {
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [registry, setRegistry] = useState<MCPRegistryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'monitor' | 'registry' | 'evolution'>('monitor');
  const { evolutionPlan } = useUniversalAgent();

  useEffect(() => {
    const sub1 = universalIntelligence.vitals$.subscribe(setVitals);
    const sub2 = universalIntelligence.mcpRegistry$.subscribe(setRegistry);
    return () => { sub1.unsubscribe(); sub2.unsubscribe(); };
  }, []);

  if (!vitals) return <div className="flex h-screen items-center justify-center text-cyan-500 font-mono animate-pulse">AIOS Kernel Initializing...</div>;

  return (
    <div className="relative w-full min-h-screen bg-[#020617] overflow-hidden font-mono text-cyan-400 selection:bg-cyan-500/30 flex flex-col">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4 p-8 pb-0 z-10 shrink-0">
          <div className="p-3 bg-celestial-gold/10 rounded-xl border border-celestial-gold/20">
              <BrainCircuit className="w-8 h-8 text-celestial-gold" />
          </div>
          <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  AIOS Nexus Core
                  <span className="text-xs px-2 py-1 bg-celestial-emerald/20 text-celestial-emerald border border-celestial-emerald/30 rounded-full font-mono">KERNEL V3.0</span>
              </h2>
              <p className="text-gray-400">System Orchestration & MCP Protocol Management</p>
          </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 border-b border-white/10 px-8 py-4 z-10 shrink-0">
          <button 
              onClick={() => setActiveTab('monitor')}
              className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'monitor' ? 'text-celestial-gold border-b-2 border-celestial-gold' : 'text-gray-500 hover:text-white'}`}
          >
              <Activity className="w-4 h-4" /> Kernel Monitor
          </button>
          <button 
              onClick={() => setActiveTab('registry')}
              className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'registry' ? 'text-celestial-purple border-b-2 border-celestial-purple' : 'text-gray-500 hover:text-white'}`}
          >
              <Database className="w-4 h-4" /> MCP Registry
          </button>
          <button 
              onClick={() => setActiveTab('evolution')}
              className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'evolution' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-white'}`}
          >
              <FileText className="w-4 h-4" /> Evolution Report
          </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
        
        {activeTab === 'monitor' && (
            <div className="flex flex-col items-center">
                <CoreNode 
                    id="AIOS_Core_Monitor"
                    label="Nexus Core"
                    evolutionStage={vitals.evolutionStage} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mb-12">
                    <MetricCard 
                        icon={<Cpu className="w-5 h-5" />}
                        label="Context Window"
                        value={`${vitals.contextLoad.toFixed(1)}%`}
                        subtext="Token Usage"
                        color="cyan"
                        progress={vitals.contextLoad}
                    />
                    <MetricCard 
                        icon={<Activity className="w-5 h-5" />}
                        label="Active Threads"
                        value={vitals.activeThreads.toString()}
                        subtext="Concurrent Agents"
                        color="emerald"
                    />
                    <MetricCard 
                        icon={<MemoryStick className="w-5 h-5" />}
                        label="Memory Paging"
                        value={vitals.memoryNodes.toLocaleString()}
                        subtext="Knowledge Nodes"
                        color="purple"
                    />
                    <MetricCard 
                        icon={<Zap className="w-5 h-5" />}
                        label="System Entropy"
                        value={vitals.entropy.toFixed(3)}
                        subtext="Optimization Index"
                        color={vitals.entropy > 0.8 ? "rose" : "blue"}
                    />
                </div>
            </div>
        )}

        {activeTab === 'registry' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in w-full max-w-7xl mx-auto">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-fit">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Box className="w-5 h-5 text-celestial-purple" />
                        Registered Tools
                    </h3>
                    <div className="space-y-3">
                        {registry.filter(i => i.type === 'tool').map((tool, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-purple/30 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-mono text-sm font-bold text-celestial-purple">{tool.name}</div>
                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded border border-amber-500/30 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> HITL
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 mb-3">{tool.description}</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                    <Server className="w-3 h-3" /> {tool.latency}ms latency
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-fit">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-emerald-400" />
                        Mounted Resources
                    </h3>
                    <div className="space-y-3">
                        {registry.filter(i => i.type === 'resource').map((res, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group flex items-center gap-4">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <Database className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm text-white truncate">{res.name}</div>
                                    <div className="text-xs text-gray-500 font-mono truncate">{res.id}</div>
                                </div>
                                <div className="text-[10px] text-gray-400 bg-white/10 px-2 py-1 rounded">
                                    {res.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Evolution Report Tab */}
        {activeTab === 'evolution' && (
            <div className="w-full max-w-7xl mx-auto animate-fade-in">
                <div className="glass-panel p-8 rounded-2xl border border-emerald-500/20 bg-slate-900/50">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-emerald-400" />
                        AI Self-Evolution Roadmap
                    </h3>
                    <p className="text-gray-400 mb-8 max-w-3xl">
                        This report details the projected upgrade path for the JunAiKey Kernel.
                        Based on current entropy levels ({vitals.entropy.toFixed(3)}) and interaction density.
                    </p>

                    <div className="space-y-6">
                        {evolutionPlan.map((milestone, idx) => (
                            <div key={idx} className={`p-6 rounded-xl border flex flex-col md:flex-row gap-6 transition-all ${
                                milestone.status === 'current' 
                                    ? 'bg-emerald-900/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                                    : milestone.status === 'completed'
                                    ? 'bg-white/5 border-white/10 opacity-70'
                                    : 'bg-black/40 border-white/5 opacity-50'
                            }`}>
                                <div className="md:w-48 shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        {milestone.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                        <span className={`text-sm font-bold font-mono ${milestone.status === 'current' ? 'text-emerald-400' : 'text-gray-400'}`}>
                                            {milestone.version}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-1">{milestone.codename}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                                        milestone.status === 'current' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400'
                                    }`}>
                                        {milestone.status}
                                    </span>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Core Focus</div>
                                        <div className="text-sm text-gray-200">{milestone.focus}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Technical Improvements</div>
                                        <ul className="text-sm text-gray-300 list-disc list-inside">
                                            {milestone.improvements.map((imp, i) => (
                                                <li key={i}>{imp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="md:w-32 shrink-0 flex flex-col justify-center border-l border-white/10 pl-6">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Impact</div>
                                    <div className="text-emerald-400 font-bold">{milestone.estimatedImpact}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default UniversalBackend;
