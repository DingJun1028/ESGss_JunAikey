
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Zap, Cpu, CheckCircle, Globe, Lock, GitCommit, ArrowRight, X } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { SYSTEM_CHANGELOG } from '../constants';

export const OnboardingSystem: React.FC = () => {
  const [viewState, setViewState] = useState<'idle' | 'whats_new' | 'boot' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const { userName } = useCompany();

  // Initialization Logic
  useEffect(() => {
      // 1. Check for "What's New" (Version Check)
      const currentVersion = SYSTEM_CHANGELOG[0].version; // e.g. "v15.0"
      const seenVersion = localStorage.getItem('esgss_seen_version');
      
      // 2. Check for Boot Sequence (Session Check)
      const hasBooted = sessionStorage.getItem('esgss_boot_sequence');

      if (seenVersion !== currentVersion) {
          setViewState('whats_new');
      } else if (!hasBooted) {
          setViewState('boot');
      } else {
          setViewState('complete');
      }
  }, []);

  // --- Boot Animation Loop ---
  useEffect(() => {
      if (viewState !== 'boot') return;

      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setTimeout(() => finishBoot(), 800);
                  return 100;
              }
              const increment = Math.random() * 15;
              return Math.min(prev + increment, 100);
          });
      }, 300);

      return () => clearInterval(interval);
  }, [viewState]);

  // Update text steps for boot animation
  useEffect(() => {
      if (progress < 30) setStep(0);
      else if (progress < 60) setStep(1);
      else if (progress < 90) setStep(2);
      else setStep(3);
  }, [progress]);

  const handleDismissWhatsNew = () => {
      const currentVersion = SYSTEM_CHANGELOG[0].version;
      localStorage.setItem('esgss_seen_version', currentVersion);
      
      // Check if boot is needed
      const hasBooted = sessionStorage.getItem('esgss_boot_sequence');
      if (!hasBooted) {
          setViewState('boot');
      } else {
          setViewState('complete');
      }
  };

  const finishBoot = () => {
      setViewState('complete');
      sessionStorage.setItem('esgss_boot_sequence', 'true');
  };

  if (viewState === 'complete' || viewState === 'idle') return null;

  // --- RENDER: WHAT'S NEW MODAL ---
  if (viewState === 'whats_new') {
      const latestLog = SYSTEM_CHANGELOG[0];
      return (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-celestial-emerald/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
                
                {/* Header */}
                <div className="p-8 pb-4 bg-gradient-to-r from-celestial-emerald/10 to-transparent border-b border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-celestial-emerald text-black text-xs font-bold rounded">NEW UPDATE</span>
                                <span className="text-emerald-400 font-mono text-sm">{latestLog.version}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">{latestLog.title}</h2>
                            <p className="text-gray-400 mt-1 text-sm">{latestLog.date}</p>
                        </div>
                        <GitCommit className="w-12 h-12 text-celestial-emerald opacity-20" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[60vh]">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Changelog Highlights</h3>
                    <ul className="space-y-4">
                        {latestLog.changes.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="mt-1 w-2 h-2 rounded-full bg-celestial-emerald shrink-0" />
                                <span className="text-gray-200 text-sm leading-relaxed">{change}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="p-6 bg-black/20 border-t border-white/5 flex justify-end">
                    <button 
                        onClick={handleDismissWhatsNew}
                        className="flex items-center gap-2 px-8 py-3 bg-celestial-emerald hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20"
                    >
                        <span>Initialize Update</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER: BOOT SEQUENCE ---
  const stepsData = [
      { text: "INITIALIZING KERNEL...", sub: "Loading Omni-Components", icon: Cpu },
      { text: "ESTABLISHING PROTOCOL v1.1...", sub: "Syncing with StarGate (NCB)", icon: Globe },
      { text: "INJECTING GENESIS SEEDS...", sub: "Simple. Fast. Perfect.", icon: Zap },
      { text: `WELCOME, ${userName?.toUpperCase() || 'COMMANDER'}`, sub: "System Ready", icon: CheckCircle },
  ];

  const CurrentIcon = stepsData[step].icon;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center cursor-wait animate-fade-in">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
        
        {/* Central HUD */}
        <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
            
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-celestial-emerald/20 blur-2xl rounded-full animate-pulse" />
                <div className="w-32 h-32 rounded-full border-4 border-celestial-emerald/30 border-t-celestial-emerald animate-spin flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-celestial-purple/30 border-b-celestial-purple animate-[spin_3s_linear_infinite_reverse]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <CurrentIcon className="w-10 h-10 text-white animate-pulse" />
                </div>
            </div>

            <div className="w-full space-y-2 mb-8">
                <div className="flex justify-between text-xs font-mono text-celestial-emerald">
                    <span>JUN_AIKEY_GENESIS_v1.1</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-celestial-emerald to-celestial-purple transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="text-center space-y-2 h-16">
                <h2 className="text-xl font-bold text-white tracking-widest animate-fade-in">
                    {stepsData[step].text}
                </h2>
                <p className="text-sm text-gray-500 font-mono animate-pulse">
                    {stepsData[step].sub}
                </p>
            </div>

            {/* Simulated Console Log */}
            <div className="mt-12 w-full h-32 overflow-hidden text-[10px] font-mono text-gray-600 border-t border-white/5 pt-4 text-left opacity-50">
                <p>> Mount: OmniEsgCell... OK</p>
                {progress > 20 && <p>> Link: Gemini 3 Pro... CONNECTED (23ms)</p>}
                {progress > 40 && <p>> Verify: Genesis Seeds... 12 WORDS INJECTED</p>}
                {progress > 60 && <p>> Optimize: React Fiber Tree... DONE</p>}
                {progress > 80 && <p>> Inject: Context Providers... SUCCESS</p>}
                {progress > 95 && <p>> Access Granted.</p>}
            </div>
        </div>
    </div>
  );
};
