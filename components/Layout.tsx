
import React, { useState } from 'react';
import { Menu, Search, Sun, Moon, Bell, ChevronRight, User, LayoutGrid, Terminal, Cpu, Home, Target, Leaf, FileText, Settings, Activity } from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS, VIEW_METADATA } from '../constants';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalAgent } from './UniversalAgent';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
}

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center justify-center ${className}`}>
        <img src="https://thumbs4.imagebam.com/1f/73/e7/ME18U9GT_t.png" alt="ESGss Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
    </div>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const { userName, level } = useCompany();
  const { themeMode, toggleThemeMode } = useUniversalAgent();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isZh = language === 'zh-TW';

  const navGroups = [
    { title: isZh ? '決策核心' : 'Core', items: [View.MY_ESG, View.DASHBOARD, View.INTEGRATION, View.UNIVERSAL_AGENT] },
    { title: isZh ? '運營管理' : 'Ops', items: [View.CARBON, View.STRATEGY, View.REPORT, View.FINANCE] },
    { title: isZh ? '智慧智庫' : 'Intel', items: [View.ACADEMY, View.RESEARCH_HUB, View.TALENT] },
    { title: isZh ? '生態共創' : 'Eco', items: [View.YANG_BO, View.ALUMNI_ZONE, View.BUSINESS_INTEL] },
    { title: isZh ? '控制台' : 'Ctrl', items: [View.SETTINGS, View.DIAGNOSTICS, View.UNIVERSAL_TOOLS] }
  ];

  const getNavLabel = (viewId: View) => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS['zh-TW'];
    return currentDict?.nav?.[viewId] || viewId.split('_').join(' ');
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-celestial-900 selection:bg-celestial-purple/30 selection:text-white">
      
      {/* Mobile Top Indicator */}
      <div className="md:hidden h-14 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 shrink-0 z-50">
           <div className="flex items-center gap-2">
                <LogoIcon className="w-8 h-8" />
                <span className="font-black text-white tracking-tighter uppercase text-xs">ESGss Matrix</span>
           </div>
           <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-slate-800">
                    <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}`} alt="User" />
                </div>
           </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-white/5 transition-all duration-300 ease-in-out liquid-glass z-50 ${isSidebarCollapsed ? 'w-16' : 'w-64'} shrink-0`}>
          <div className="h-20 flex items-center px-5 gap-3 shrink-0 border-b border-white/5">
              <LogoIcon className="w-10 h-10" />
              {!isSidebarCollapsed && (
                  <div className="flex flex-col">
                      <span className="font-black text-xl text-white tracking-tighter leading-none">善向永續</span>
                      <span className="text-[8px] font-black text-celestial-purple uppercase tracking-[0.2em] mt-1">JunAiKey OS v15</span>
                  </div>
              )}
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar py-6 px-4">
              {navGroups.map((group, idx) => (
                  <div key={idx} className="mb-6">
                      {!isSidebarCollapsed && <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] px-3 mb-3">{group.title}</h4>}
                      <div className="space-y-1">
                          {group.items.map(viewId => {
                              const meta = VIEW_METADATA[viewId];
                              const isActive = currentView === viewId;
                              return (
                                  <button 
                                      key={viewId}
                                      onClick={() => onNavigate(viewId)}
                                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}`}
                                  >
                                      <meta.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'}`} />
                                      {!isSidebarCollapsed && <span className="text-[12px] font-bold truncate">{getNavLabel(viewId)}</span>}
                                  </button>
                              )
                          })}
                      </div>
                  </div>
              ))}
          </nav>

          <div className="p-4 border-t border-white/5 shrink-0">
              <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden shrink-0">
                     <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}`} className="w-full h-full" alt="User" />
                  </div>
                  {!isSidebarCollapsed && (
                      <div className="min-w-0">
                          <div className="text-xs font-black text-white truncate">{userName}</div>
                          <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">MASTERY LV.{level}</div>
                      </div>
                  )}
              </div>
          </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
          <header className="hidden md:flex h-16 items-center justify-between px-10 border-b border-white/5 shrink-0 bg-slate-900/20 backdrop-blur-xl z-40">
              <div className="flex items-center gap-6">
                  <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
                      <Menu className="w-5 h-5" />
                  </button>
                  <div className="relative group w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                          type="text" 
                          placeholder={isZh ? "下達神經指令或搜尋..." : "Command ESG Neural Kernel..."}
                          className="w-full bg-slate-950/40 border border-white/5 rounded-full py-2 pl-11 pr-5 text-xs text-white focus:outline-none focus:border-celestial-purple/50 transition-all placeholder:font-sans placeholder:text-gray-700"
                      />
                  </div>
              </div>

              <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 bg-slate-950/60 px-5 py-2 rounded-2xl border border-white/5 font-mono">
                      <div className="flex flex-col items-end">
                          <span className="text-[8px] text-gray-600 font-black tracking-widest">OS STABILITY</span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">100% NOMINAL</span>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <Cpu className="w-5 h-5 text-celestial-gold animate-pulse" />
                  </div>
                  
                  <button onClick={onToggleLanguage} className="px-3 py-1.5 text-[11px] font-black text-gray-500 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-lg">{language === 'zh-TW' ? 'ENGLISH' : '繁體中文'}</button>
                  <div className="h-5 w-px bg-white/10" />
                  <button onClick={toggleThemeMode} className="p-2 text-gray-500 hover:text-white transition-all transform hover:rotate-12">{themeMode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>
                  <div className="relative cursor-pointer group p-2">
                      <Bell className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                  </div>
              </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 scroll-smooth bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.03)_0%,_transparent_50%)]">
              <div className="max-w-6xl mx-auto pb-24 md:pb-0">
                  {children}
              </div>
          </main>
      </div>

      <UniversalAgent language={language} onNavigate={onNavigate} currentView={currentView} />
    </div>
  );
};
