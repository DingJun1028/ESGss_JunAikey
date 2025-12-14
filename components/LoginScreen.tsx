
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight, GitCommit, Calendar, Activity, Triangle, Cpu, BrainCircuit, Target, Building, Mail, Chrome, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { LogoIcon } from './Layout';
import { LOGIN_README } from '../constants';

interface LoginScreenProps {
  onLogin: () => void;
  language: 'zh-TW' | 'en-US';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [email, setEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const isZh = language === 'zh-TW';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Supabase Auth Delay
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
      
      {/* === LEFT SIDE: LOGIN FORM (Top on mobile) === */}
      <div className="w-full lg:w-[40%] relative z-20 flex flex-col justify-center p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-900/90 backdrop-blur-xl shadow-2xl shrink-0 lg:h-screen min-h-[50vh]">
          
          {/* Background Ambience Left */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-celestial-purple/10 rounded-full blur-[120px] animate-blob" />
             <div className="absolute top-[20%] right-0 w-[50%] h-[50%] bg-celestial-emerald/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-center h-full max-h-[800px]">
            <div className="flex flex-col items-center mb-8">
                {/* Logo */}
                <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-celestial-gold/20 blur-[40px] rounded-full opacity-60" />
                    <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight text-center">
                    ESGss <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald to-celestial-gold">JunAiKey</span>
                </h1>
                
                <h2 className="text-lg text-gray-200 mt-1 font-bold tracking-wide text-center">
                    善向永續 萬能系統
                </h2>
                
                <p className="text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-[0.2em]">
                    ENTERPRISE OMNI-OS V15.0
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {!isDevMode && (
                <>
                    <div className="relative group">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-celestial-gold transition-colors" />
                    <input 
                        type="text" 
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        placeholder={isZh ? "企業代碼 (Company ID)" : "Company ID"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-celestial-gold/50 focus:ring-1 focus:ring-celestial-gold/50 transition-all hover:bg-black/60"
                    />
                    </div>
                    <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-celestial-emerald transition-colors" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isZh ? "企業信箱 (Enterprise Email)" : "Enterprise Email"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-celestial-emerald/50 focus:ring-1 focus:ring-celestial-emerald/50 transition-all hover:bg-black/60"
                        required={!personalEmail} // Requirement logic could be complex, keeping simple for UI
                    />
                    </div>
                    <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-celestial-blue transition-colors" />
                    <input 
                        type="email" 
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        placeholder={isZh ? "個人信箱 (Personal Email)" : "Personal Email"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-celestial-blue/50 focus:ring-1 focus:ring-celestial-blue/50 transition-all hover:bg-black/60"
                    />
                    </div>
                    <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-celestial-purple transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isZh ? "密碼" : "Password"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 transition-all hover:bg-black/60"
                        required
                    />
                    </div>
                </>
                )}

                {isDevMode && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                    <h4 className="text-xs font-bold text-amber-400 mb-0.5">{isZh ? "開發者模式已啟用" : "Developer Mode Enabled"}</h4>
                    <p className="text-[10px] text-gray-400">
                        {isZh 
                        ? "Auth 驗證已繞過。將以「CSO 管理員」權限登入系統。" 
                        : "Auth bypassed. Logging in with 'CSO Admin' privileges."}
                    </p>
                    </div>
                </div>
                )}

                <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-celestial-emerald to-celestial-purple text-white text-sm font-bold tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                    {isZh ? "進入系統" : "Initialize System"}
                    <ArrowRight className="w-4 h-4" />
                    </>
                )}
                </button>

                {!isDevMode && (
                    <>
                        <div className="flex items-center gap-4 my-4 opacity-50">
                            <div className="h-px bg-white/20 flex-1" />
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{isZh ? '或使用 Google' : 'OR CONTINUE WITH'}</span>
                            <div className="h-px bg-white/20 flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                type="button"
                                onClick={() => handleGoogleAuth('signin')}
                                disabled={loading}
                                className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs font-bold text-gray-300 hover:text-white"
                            >
                                <Chrome className="w-4 h-4" />
                                {isZh ? 'Google 登入' : 'Sign In'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleGoogleAuth('signup')}
                                disabled={loading}
                                className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs font-bold text-gray-300 hover:text-white"
                            >
                                <UserPlus className="w-4 h-4" />
                                {isZh ? 'Google 註冊' : 'Sign Up'}
                            </button>
                        </div>
                    </>
                )}
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"/>
                        SYSTEM ONLINE
                    </div>
                    <span className="text-celestial-gold/80 font-medium">
                        [以終為始 。善向永續]
                    </span>
                </span>
                
                <button 
                onClick={toggleDevMode}
                className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors group shrink-0"
                >
                {isDevMode ? <ToggleRight className="w-6 h-6 text-celestial-emerald" /> : <ToggleLeft className="w-6 h-6 group-hover:text-gray-300" />}
                <span className="group-hover:underline hidden sm:inline">DevMode</span>
                </button>
            </div>
          </div>
      </div>

      {/* === RIGHT SIDE: SYSTEM README (Static Content) === */}
      <div className="flex-1 relative bg-[#020617] overflow-hidden flex flex-col h-auto lg:h-screen">
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-12 flex flex-col h-full">
              
              {/* Header */}
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                  <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                          <Activity className="w-6 h-6 md:w-8 md:h-8 text-celestial-gold animate-pulse" />
                          System Manifesto
                      </h2>
                      <p className="text-gray-400 mt-2 text-xs md:text-sm">
                          {isZh ? '萬能核心架構與設計哲學' : 'Universal Core Architecture & Philosophy'}
                      </p>
                  </div>
                  <div className="text-right">
                      <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald to-celestial-blue">v15.0</div>
                      <div className="text-[10px] md:text-xs text-emerald-400 font-mono mt-1">THE AIOS AWAKENING</div>
                  </div>
              </div>

              {/* Scrollable README Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
                  {LOGIN_README.map((section, idx) => {
                      const Icon = getIcon(section.icon);
                      return (
                        <div key={idx} className="relative pl-8 group">
                            {/* Timeline Line */}
                            {idx !== LOGIN_README.length - 1 && (
                                <div className="absolute left-[7px] top-6 bottom-[-32px] w-[2px] bg-white/5 group-hover:bg-white/10 transition-colors" />
                            )}
                            
                            {/* Timeline Dot */}
                            <div className={`
                                absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10
                                ${idx === 0 ? 'bg-celestial-emerald border-celestial-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-900 border-gray-600'}
                            `} />
                            
                            <div className="mb-2 flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${idx === 0 ? 'text-celestial-emerald' : 'text-celestial-purple'}`} />
                                <h4 className="text-lg font-bold text-white group-hover:text-celestial-gold transition-colors">{section.title}</h4>
                            </div>
                            
                            <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-xl border border-white/5">
                                {section.content}
                            </div>
                        </div>
                      );
                  })}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-mono">
                  <div>© 2025 ESGss Corp. All rights reserved.</div>
                  <div className="flex items-center gap-2">
                      <GitCommit className="w-3 h-3" />
                      <span>Last Commit: {new Date().toLocaleDateString()}</span>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};
