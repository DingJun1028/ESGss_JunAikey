
import React, { useState, useEffect } from 'react';
import { getMockHealth, TRANSLATIONS } from '../constants';
import { ShieldCheck, Activity, Server, AlertTriangle, Zap, Skull } from 'lucide-react';
import { Language } from '../types';
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
  const { triggerSystemCrash, systemStatus } = useUniversalAgent();
  const [isLoading, setIsLoading] = useState(true);

  const pageData = {
      title: { zh: '系統診斷', en: 'System Diagnostics' },
      desc: { zh: '平台健康與 JunAiKey 狀態', en: 'Platform health and intelligence verification status' },
      tag: { zh: '系統核心', en: 'System Core' }
  };

  // Simulate Diagnostics Check
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
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

        {/* Action Bar */}
        <div className="flex justify-end -mt-16 mb-6 relative z-10">
            <button 
                onClick={triggerSystemCrash}
                disabled={systemStatus !== 'STABLE'}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Simulate Critical Failure"
            >
                <Skull className="w-4 h-4 group-hover:animate-bounce" />
                {isZh ? '模擬系統崩潰 (Chaos Test)' : 'Simulate System Crash'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Module Health - Refactored to OmniEsgCell */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-celestial-emerald" />
                    {t.moduleHealth}
                </h3>
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <OmniEsgCell key={i} mode="list" loading={true} />
                        ))
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
                                confidence={item.status === 'Healthy' ? 'high' : 'medium'}
                                // Trait: Optimization for healthy modules (breathing glow), Gap-filling for warning modules
                                traits={item.status === 'Healthy' ? ['optimization', 'performance'] : ['gap-filling']}
                                dataLink="live"
                                verified={true}
                                onAiAnalyze={() => handleFixAttempt(item.module)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Security & Stats - Refactored to OmniEsgCell */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col">
                 <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-celestial-purple" />
                    {t.security}
                </h3>
                <div className="grid grid-cols-2 gap-4 flex-1">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                             <OmniEsgCell key={i} mode="cell" loading={true} />
                        ))
                    ) : (
                        <>
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.uptime} 
                                value="99.99%" 
                                color="emerald" 
                                traits={['optimization', 'seamless']} 
                                verified={true}
                            />
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.audit} 
                                value="Passed" 
                                color="purple" 
                                traits={['bridging']}
                                verified={true} 
                            />
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.alerts} 
                                value="0 Active" 
                                color="blue" 
                                traits={['seamless']} 
                            />
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.version} 
                                value="v15.2.0" 
                                color="slate" 
                                subValue="AIOS Active"
                            />
                        </>
                    )}
                </div>
                
                {isLoading ? (
                     <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3 animate-pulse">
                        <div className="w-5 h-5 bg-white/10 rounded shrink-0" />
                        <div className="space-y-2 w-full">
                            <div className="h-4 w-1/3 bg-white/10 rounded" />
                            <div className="h-3 w-3/4 bg-white/10 rounded" />
                        </div>
                     </div>
                ) : (
                    <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                            <div className="text-sm font-medium text-amber-400">{t.maintenance}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Neural Net Re-training scheduled for 03:00 UTC. Zero downtime expected.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
