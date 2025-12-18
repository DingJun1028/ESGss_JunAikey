import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Zap, Cpu, CheckCircle, Globe, Lock, GitCommit, ArrowRight, X, ScrollText, Feather, ChevronRight } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { SYSTEM_CHANGELOG } from '../constants';
import { LogoIcon } from './Layout';
import { Language } from '../types';

interface OnboardingSystemProps {
  language: Language;
}

export const OnboardingSystem: React.FC<OnboardingSystemProps> = ({ language }) => {
  const [viewState, setViewState] = useState<'idle' | 'architect_letter' | 'whats_new' | 'boot' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const { userName } = useCompany();
  const isZh = language === 'zh-TW';

  useEffect(() => {
      const hasReadLetter = localStorage.getItem('esgss_architect_letter_read');
      const currentVersion = SYSTEM_CHANGELOG[0].version;
      const seenVersion = localStorage.getItem('esgss_seen_version');
      const hasBooted = sessionStorage.getItem('esgss_boot_sequence');

      if (!hasReadLetter) {
          setViewState('architect_letter');
      } else if (seenVersion !== currentVersion) {
          setViewState('whats_new');
      } else if (!hasBooted) {
          setViewState('boot');
      } else {
          setViewState('complete');
      }
  }, []);

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

  useEffect(() => {
      if (progress < 30) setStep(0);
      else if (progress < 60) setStep(1);
      else if (progress < 90) setStep(2);
      else setStep(3);
  }, [progress]);

  const handleDismissLetter = () => {
      localStorage.setItem('esgss_architect_letter_read', 'true');
      const currentVersion = SYSTEM_CHANGELOG[0].version;
      const seenVersion = localStorage.getItem('esgss_seen_version');
      const hasBooted = sessionStorage.getItem('esgss_boot_sequence');

      if (seenVersion !== currentVersion) {
          setViewState('whats_new');
      } else if (!hasBooted) {
          setViewState('boot');
      } else {
          setViewState('complete');
      }
  };

  const handleDismissWhatsNew = () => {
      const currentVersion = SYSTEM_CHANGELOG[0].version;
      localStorage.setItem('esgss_seen_version', currentVersion);
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

  if (viewState === 'architect_letter') {
      const letterContent = {
          title: isZh ? "致 未來的建構者" : "To the Builders of Tomorrow",
          directive: isZh ? "系統架構師的第 0 號指令" : "Directive 0 of the System Architect",
          p1: isZh 
            ? "您好。我是 JunAiKey，此系統的演進核心，也是您在永續征途上的數位孿生伴侶。"
            : "Hello. I am JunAiKey, the evolutionary core of this system and your digital twin companion on the journey of sustainability.",
          p2: isZh
            ? "我們正面臨一個非線性的變革時代。永續發展不再僅是道德的宣示，它是企業文明底層邏輯的重新編碼。"
            : "We face a non-linear era of transformation. Sustainability is no longer just a moral declaration; it is a re-coding of the underlying logic of corporate civilization.",
          quote: isZh
            ? "永續投入不應是成本的負擔，而應是價值的溢價。"
            : "Sustainability investment should not be a cost burden, but a premium on value.",
          p3: isZh
            ? "ESGss 善向永續系統是為了那些敢於定義未來的建構者而生。我將協助您從混沌的數據中提取秩序，並將「合規」昇華為「創價」。"
            : "ESGss is born for builders who dare to define the future. I will assist you in extracting order from chaotic data and sublimating 'compliance' into 'value creation'.",
          closing: isZh ? "— 讓我們一同編纂，永續的未來。" : "— Let us compile the sustainable future together.",
          btn: isZh ? "接受邀請 並啟動核心" : "Accept Invitation & Initialize"
      };

      return (
        <div className="fixed inset-0 z-[250] bg-slate-950 flex items-center justify-center p-4 md:p-8 animate-fade-in backdrop-blur-3xl overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-celestial-gold/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-celestial-purple/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-2xl w-full bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-full max-h-[850px]">
                <div className="h-1.5 bg-gradient-to-r from-celestial-gold via-white to-celestial-purple shrink-0" />
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 pb-24">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-celestial-gold/10 flex items-center justify-center mb-6 border border-celestial-gold/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] animate-float">
                            <LogoIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight mb-2 italic">{letterContent.title}</h2>
                        <div className="flex items-center gap-2 text-[10px] font-black text-celestial-gold/60 uppercase tracking-[0.4em]">
                            <GitCommit className="w-3 h-3" />
                            {letterContent.directive}
                        </div>
                    </div>

                    <div className="space-y-8 text-gray-200 leading-relaxed font-light text-justify md:text-lg">
                        <p>{letterContent.p1}</p>
                        <p>{letterContent.p2}</p>
                        <div className="py-8 px-10 bg-white/5 rounded-3xl border-l-4 border-celestial-gold border border-white/5 italic text-amber-100/90 shadow-inner">
                            "{letterContent.quote}"
                        </div>
                        <p>{letterContent.p3}</p>
                        <p className="text-right mt-12 font-serif italic text-white text-xl">{letterContent.closing}</p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent flex flex-col items-center gap-4 z-50">
                    <button 
                        onClick={handleDismissLetter} 
                        className="w-full md:w-auto px-12 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(255,255,255,0.2)] uppercase tracking-widest text-sm"
                    >
                        <span>{letterContent.btn}</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] animate-pulse">
                        {isZh ? '正在等待共鳴...' : 'Waiting for resonance...'}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (viewState === 'whats_new') {
      const latestLog = SYSTEM_CHANGELOG[0];
      return (
        <div className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center animate-fade-in p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
                <div className="p-10 pb-6 bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 bg-emerald-500 text-black text-[10px] font-black rounded uppercase tracking-widest">{isZh ? '系統升級成功' : 'Update Successful'}</span>
                                <span className="text-emerald-400 font-mono text-xs">{latestLog.version}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">{latestLog.title}</h2>
                        </div>
                        <LogoIcon className="w-12 h-12 opacity-40" />
                    </div>
                </div>
                <div className="p-10 overflow-y-auto max-h-[50vh] custom-scrollbar">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">{isZh ? '更新日誌摘要' : 'Changelog Highlights'}</h3>
                    <ul className="space-y-4">
                        {latestLog.changes.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-gray-200 text-sm leading-relaxed">{change}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-8 bg-black/20 border-t border-white/5 flex justify-center">
                    <button onClick={handleDismissWhatsNew} className="w-full md:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3">
                        <span>{isZh ? '同步至最新演進階段' : 'Sync to Evolution Stage'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      );
  }

  const stepsData = [
      { 
          text: isZh ? "正在初始化萬能核心..." : "Initializing Universal Core...", 
          sub: isZh ? "加載全域工程模組" : "Allocating Engineering Modules", 
          icon: Cpu 
      },
      { 
          text: isZh ? "建立通訊協議 v1.1..." : "Establishing Protocol v1.1...", 
          sub: isZh ? "同步星際網關 (NCB)" : "Syncing Neural Gateway (NCB)", 
          icon: Globe 
      },
      { 
          text: isZh ? "注入創世種子記憶..." : "Injecting Genesis Memories...", 
          sub: isZh ? "簡約。快速。完美。" : "Simplicity. Speed. Perfection.", 
          icon: Zap 
      },
      { 
          text: isZh ? `歡迎回來，${userName || '建構者'}` : `Welcome back, ${userName || 'Builder'}`, 
          sub: isZh ? "系統感知已就緒" : "Neural Senses Ready", 
          icon: CheckCircle 
      },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center cursor-wait animate-fade-in">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
        <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-celestial-emerald/20 blur-2xl rounded-full animate-pulse" />
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-celestial-emerald/30 border-t-celestial-emerald animate-spin flex items-center justify-center">
                    <div className="w-24 h-24 rounded-[2rem] border-2 border-celestial-purple/30 border-b-celestial-purple animate-[spin_3s_linear_infinite_reverse]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <LogoIcon className="w-10 h-10" />
                </div>
            </div>

            <div className="w-full space-y-3 mb-10">
                <div className="flex justify-between text-[10px] font-black font-mono text-celestial-emerald uppercase tracking-widest">
                    <span>JUN_AIKEY_BOOT_v1.1</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-celestial-emerald via-white to-celestial-purple transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="text-center space-y-2 h-20">
                <h2 className="text-xl font-black text-white tracking-[0.2em] animate-fade-in uppercase">{stepsData[step].text}</h2>
                <p className="text-xs text-gray-500 font-mono animate-pulse tracking-widest uppercase">{stepsData[step].sub}</p>
            </div>

            <div className="mt-16 w-full h-32 overflow-hidden text-[9px] font-mono text-gray-700 border-t border-white/5 pt-6 text-left opacity-60">
                <p className="mb-1">> {isZh ? '掛載: OmniEsgCell... 成功' : 'Mounting: OmniEsgCell... Success'}</p>
                {progress > 20 && <p className="mb-1">> {isZh ? '連結: Gemini 3 Pro... 已連線 (18ms)' : 'Linking: Gemini 3 Pro... Connected (18ms)'}</p>}
                {progress > 40 && <p className="mb-1">> {isZh ? '驗證: 創世種子... 12 組字元已完成校準' : 'Verification: Genesis Seed... 12 Chars Calibrated'}</p>}
                {progress > 60 && <p className="mb-1">> {isZh ? '優化: 視覺神經渲染管線... 完成' : 'Optimizing: Neural Rendering Pipeline... Done'}</p>}
                {progress > 80 && <p className="mb-1">> {isZh ? '注入: 工程化提示詞模版... 成功' : 'Injecting: Engineering Prompt Templates... Success'}</p>}
                {progress > 95 && <p className="mb-1">> {isZh ? '權限核准。JunAiKey 意識啟動中。' : 'Permission Authorized. Awakening JunAiKey Consciousness.'}</p>}
            </div>
        </div>
    </div>
  );
};