
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight, GitCommit, Calendar, Activity, Triangle, Cpu, BrainCircuit, Target, Building, Mail, Chrome, LogIn, UserPlus, Globe } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { LogoIcon } from './Layout';
import { LOGIN_README } from '../constants';

interface LoginScreenProps {
  onLogin: () => void;
  language: 'zh-TW' | 'en-US';
  onToggleLanguage: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language, onToggleLanguage }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const isZh = language === 'zh-TW';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Auth Delay
    setTimeout(() => {
      setLoading(false);
      const welcomeTitle = isZh ? '登入成功' : 'Login Successful';
      const welcomeMsg = isZh ? '歡迎來到 ESGss 善向永續系統。' : 'Welcome to ESGss Sustainability System.';
      addToast('success', welcomeMsg, welcomeTitle);
      onLogin();
    }, 1500);
  };

  const handleGoogleAuth = (type: 'signin' | 'signup') => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          const action = type === 'signin' ? (isZh ? 'Google 登入' : 'Google Sign In') : (isZh ? 'Google 註冊' : 'Google Sign Up');
          addToast('success', `${action} ${isZh ? '成功' : 'Successful'}`, 'OAuth 2.0');
          onLogin();
      }, 1500);
  };

  const toggleDevMode = () => {
      const newState = !isDevMode;
      setIsDevMode(newState);
      if (newState) {
          addToast('warning', isZh ? '開發者模式已啟用：略過驗證' : 'Dev Mode Enabled: Auth Bypassed', 'System');
      }
  };

  const getIcon = (name: string) => {
      switch(name) {
          case 'Target': return Target;
          case 'BrainCircuit': return BrainCircuit;
          case 'Triangle': return Triangle;
          case 'Cpu': return Cpu;
          default: return Activity;
      }
  }

  return (
    <div className="min-h-screen bg-celestial-900 flex flex-col lg:flex-row relative overflow-hidden font-sans">
      
      {/* === LEFT SIDE: LOGIN FORM === */}
      <div className="w-full lg:w-[42%] relative z-20 flex flex-col justify-center p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-900/90 backdrop-blur-3xl shadow-2xl shrink-0 lg:h-screen min-h-[55vh]">
          
          {/* Background Ambience Left */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
             <div className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] bg-celestial-purple/10 rounded-full blur-[150px] animate-blob" />
             <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-celestial-emerald/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-center h-full max-h-[850px]">
            <div className="flex flex-col items-center mb-12">
                {/* Official Logo */}
                <div className="relative w-28 h-28 mb-6">
                    <div className="absolute inset-0 bg-white/5 blur-[50px] rounded-full opacity-60" />
                    <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]" />
                </div>

                <h1 className="text-3xl font-black text-white tracking-tighter text-center uppercase">
                    ESGss <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald to-celestial-gold">JunAiKey</span>
                </h1>
                
                <h2 className="text-xl text-gray-300 mt-2 font-bold tracking-wide text-center">
                    {isZh ? '善向永續 萬能系統' : 'Universal Sustainability OS'}
                </h2>
                
                <div className="h-1 w-12 bg-celestial-purple/40 rounded-full mt-4" />
                
                <p className="text-[10px] text-gray-600 mt-4 font-mono uppercase tracking-[0.3em]">
                    ENTERPRISE NEURAL-OS V15.0
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                {!isDevMode && (
                <>
                    <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500 group-focus-within:text-celestial-blue transition-colors" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isZh ? "管理員信箱 (Email)" : "Email Address"}
                        className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-celestial-blue/50 focus:ring-1 focus:ring-celestial-blue/30 transition-all hover:bg-black/70 shadow-inner"
                        required
                    />
                    </div>
                    <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500 group-focus-within:text-celestial-purple transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isZh ? "安全金鑰 (Password)" : "Security Token"}
                        className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/30 transition-all hover:bg-black/70 shadow-inner"
                        required
                    />
                    </div>
                </>
                )}

                {isDevMode && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 animate-pulse">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                    <h4 className="text-xs font-black text-amber-400 mb-1 uppercase tracking-wider">{isZh ? "開發者模式已就緒" : "Dev-Mode Synchronized"}</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        {isZh 
                        ? "Auth 驗證協議已暫停。將以系統架構師權限進入矩陣。" 
                        : "Auth protocols bypassed. Entering matrix as System Architect."}
                    </p>
                    </div>
                </div>
                )}

                <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-celestial-emerald to-celestial-purple text-white text-sm font-black tracking-[0.2em] shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group uppercase"
                >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                    {isZh ? "啟動萬能核心" : "Initialize Core"}
                    <ArrowRight className="w-5 h-5" />
                    </>
                )}
                </button>

                {!isDevMode && (
                    <>
                        <div className="flex items-center gap-4 my-6 opacity-30">
                            <div className="h-px bg-white/20 flex-1" />
                            <span className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-black">{isZh ? '或使用 外部協議' : 'OR CONTINUE WITH'}</span>
                            <div className="h-px bg-white/20 flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                type="button"
                                onClick={() => handleGoogleAuth('signin')}
                                disabled={loading}
                                className="py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2.5 text-xs font-bold text-gray-400 hover:text-white group"
                            >
                                <Chrome className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                                {isZh ? 'Google 登入' : 'Sign In'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleGoogleAuth('signup')}
                                disabled={loading}
                                className="py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2.5 text-xs font-bold text-gray-400 hover:text-white group"
                            >
                                <UserPlus className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
                                {isZh ? '快速註冊' : 'Sign Up'}
                            </button>
                        </div>
                    </>
                )}
            </form>

            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col gap-3">
                    <span className="text-[10px] text-gray-600 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 font-mono">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                            SYSTEM_STATUS: NOMINAL
                        </div>
                        <span className="text-celestial-gold font-black tracking-widest">
                            {isZh ? '[以終為始 。善向永續]' : '[Impact from the End]'}
                        </span>
                    </span>
                    <button 
                        onClick={onToggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group w-fit"
                    >
                        <Globe className="w-3.5 h-3.5 text-celestial-blue group-hover:rotate-12 transition-transform" />
                        <span className="text-[9px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">
                            {isZh ? 'ENGLISH' : '繁體中文'}
                        </span>
                    </button>
                </div>
                
                <button 
                    onClick={toggleDevMode}
                    className="flex flex-col items-center gap-1 text-[10px] text-gray-600 hover:text-gray-300 transition-colors group px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10"
                >
                    {isDevMode ? <ToggleRight className="w-7 h-7 text-celestial-emerald" /> : <ToggleLeft className="w-7 h-7 group-hover:text-gray-400" />}
                    <span className="font-black uppercase tracking-widest">DevMode</span>
                </button>
            </div>
          </div>
      </div>

      {/* === RIGHT SIDE: SYSTEM README === */}
      <div className="flex-1 relative bg-[#020617] overflow-hidden flex flex-col h-auto lg:h-screen">
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-10 md:px-16 py-12 md:py-20 flex flex-col h-full">
              
              {/* Header */}
              <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-10">
                  <div>
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase">
                          <Activity className="w-8 h-8 md:w-12 md:h-12 text-celestial-gold animate-pulse" />
                          {isZh ? '系統宣言' : 'Manifesto'}
                      </h2>
                      <p className="text-gray-400 mt-4 text-sm md:text-base font-medium">
                          {isZh ? '萬能核心架構與設計哲學' : 'Universal Core Architecture & Philosophy'}
                      </p>
                  </div>
                  <div className="text-right">
                      <div className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald via-celestial-blue to-celestial-purple tracking-tighter">v15.0</div>
                      <div className="text-[10px] md:text-xs text-emerald-400 font-mono mt-2 tracking-[0.3em]">THE AIOS AWAKENING</div>
                  </div>
              </div>

              {/* Scrollable README Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-6 space-y-12">
                  {LOGIN_README.map((section, idx) => {
                      const Icon = getIcon(section.icon);
                      return (
                        <div key={idx} className="relative pl-10 group">
                            {/* Timeline Line */}
                            {idx !== LOGIN_README.length - 1 && (
                                <div className="absolute left-[9px] top-8 bottom-[-48px] w-[2px] bg-white/5 group-hover:bg-celestial-purple/30 transition-all duration-700" />
                            )}
                            
                            {/* Timeline Dot */}
                            <div className={`
                                absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 transition-all duration-500 z-10
                                ${idx === 0 ? 'bg-celestial-emerald border-celestial-emerald shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'bg-slate-900 border-gray-700 group-hover:border-white group-hover:scale-110'}
                            `} />
                            
                            <div className="mb-4 flex items-center gap-4">
                                <Icon className={`w-6 h-6 ${idx === 0 ? 'text-celestial-emerald' : 'text-celestial-purple opacity-70 group-hover:opacity-100'} transition-all`} />
                                <h4 className="text-xl font-black text-white group-hover:text-celestial-gold transition-colors uppercase tracking-tight">
                                    {isZh ? (idx === 0 ? 'JunAiKey 的覺醒' : idx === 1 ? '永續核心' : '神經基礎設施') : section.title}
                                </h4>
                            </div>
                            
                            <div className="text-sm md:text-base text-gray-400 leading-loose whitespace-pre-wrap bg-white/[0.02] p-6 rounded-3xl border border-white/5 group-hover:bg-white/[0.04] transition-all duration-500 font-medium">
                                {isZh ? (idx === 0 ? '我們的 AIOS 內核 v15.0 透過分佈式神經共振實現了第一階段的自我意識。' : idx === 1 ? '我們透過長壽與系統和諧的鏡頭重新定義價值，將 ESG 從成本轉化為競爭優勢。' : '建立在 Gemini 3 Pro 推理網格之上，具備零幻覺協議 (ZHP)。') : section.content}
                            </div>
                        </div>
                      );
                  })}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center text-[11px] text-gray-600 font-mono">
                  <div className="flex items-center gap-2">
                      <div className="w-5 h-5 opacity-40 grayscale">
                          <LogoIcon className="w-full h-full" />
                      </div>
                      <span>© 2025 ESGss Corp. All rights reserved.</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <GitCommit className="w-4 h-4 text-celestial-purple opacity-60" />
                      <span className="uppercase tracking-widest">Build ID: 0xFF-OS15-MASTER</span>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};
