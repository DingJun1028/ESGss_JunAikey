
import React, { useState, useEffect } from 'react';
import { getMockHealth, TRANSLATIONS } from '../constants';
import { ShieldCheck, Activity, Server, AlertTriangle, Zap, Skull, TrendingUp, Search, Layers, Database, CheckCircle, XCircle } from 'lucide-react';
import { Language, View } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface DiagnosticsProps {
  language: Language;
}

export const Diagnostics: React.FC<DiagnosticsProps> = ({ language }) => {
  const t = TRANSLATIONS[language].diagnostics;
  const isZh = language === 'zh-TW';
  const healthData = getMockHealth(language);
  const { addToast } = useToast();
  const { triggerSystemCrash, systemStatus, feedbacks } = useUniversalAgent();
  const [isLoading, setIsLoading] = useState(true);

  const pageData = {
      title: { zh: '系統診斷 & 對齊矩陣', en: 'Diagnostics & Alignment Matrix' },
      desc: { zh: '監測平台健康度與 AI 人格對齊狀態', en: 'Platform health & AI personality alignment monitor' },
      tag: { zh: '系統核心', en: 'System Core' }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFixAttempt = (module: string) => {
      addToast('warning', `Attempting self-healing protocol for ${module}...`, 'System Diagnostics');
      setTimeout(() => {
          addToast('success', `${module} optimized and running efficiently.`, 'Self-Healing Complete');
      }, 2000);
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Activity}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="flex justify-end -mt-16 mb-6 relative z-10">
            <button 
                onClick={triggerSystemCrash}
                disabled={systemStatus !== 'STABLE'}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50 group"
            >
                <Skull className="w-4 h-4 group-hover:animate-bounce" />
                {isZh ? '模擬系統崩潰' : 'Chaos Test'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Module Health */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-celestial-emerald" />
                    {t.moduleHealth}
                </h3>
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <OmniEsgCell key={i} mode="list" loading={true} />)
                    ) : (
                        healthData.map((item, idx) => (
                            <OmniEsgCell 
                                key={idx}
                                mode="list"
                                label={item.module}
                                value={item.status}
                                subValue={`${item.latency}ms latency`}
                                icon={Server}
                                color={item.status === 'Healthy' ? 'emerald' : 'gold'}
                                traits={item.status === 'Healthy' ? ['optimization'] : ['gap-filling']}
                                dataLink="live"
                                onAiAnalyze={() => handleFixAttempt(item.module)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* AI Optimization Matrix (New Feedback Form/Spread) */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-celestial-purple" />
                    Neural Alignment Matrix
                </h3>
                
                <div className="flex-1 min-h-[300px] overflow-hidden flex flex-col">
                    <div className="bg-black/30 rounded-xl border border-white/5 overflow-hidden flex-1 flex flex-col">
                        <div className="grid grid-cols-12 gap-2 p-3 border-b border-white/10 bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            <div className="col-span-3">Module Context</div>
                            <div className="col-span-6">Alignment Signal</div>
                            <div className="col-span-3 text-right">Status</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            {feedbacks.length === 0 ? (
                                <div className="h-40 flex items-center justify-center text-gray-600 text-xs italic">
                                    No alignment data captured yet. Provide feedback in chat.
                                </div>
                            ) : (
                                feedbacks.map(fb => (
                                    <div key={fb.id} className="grid grid-cols-12 gap-2 p-3 hover:bg-white/5 transition-all border-b border-white/5 items-center">
                                        <div className="col-span-3">
                                            <span className="text-[10px] font-bold text-celestial-blue uppercase">{fb.view}</span>
                                        </div>
                                        <div className="col-span-6 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${fb.type === 'good' ? 'bg-emerald-500' : 'bg-rose-500'} transition-all`} style={{ width: fb.type === 'good' ? '100%' : '10%' }} />
                                            </div>
                                            <span className={`text-[10px] font-mono ${fb.type === 'good' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {fb.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-gray-500">
                                                {new Date(fb.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 bg-white/5 border-t border-white/10 flex justify-between items-center shrink-0">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[9px] text-gray-400">Aligned: {feedbacks.filter(f => f.type === 'good').length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <XCircle className="w-3 h-3 text-rose-400" />
                                    <span className="text-[9px] text-gray-400">Gaps: {feedbacks.filter(f => f.type === 'bad').length}</span>
                                </div>
                            </div>
                            <button className="text-[9px] font-black text-celestial-purple hover:underline uppercase">Sync with Kernel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
