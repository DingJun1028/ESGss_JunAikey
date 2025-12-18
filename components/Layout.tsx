
import React, { useState, useMemo } from 'react';
import { Menu, Search, Sun, Moon, Bell, Languages, ChevronRight, User } from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS, VIEW_ACCESS_MAP, VIEW_METADATA } from '../constants';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { CommandPalette } from './CommandPalette';
import { UniversalAgent } from './UniversalAgent';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
}

export const LogoIcon = React.memo(({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white/10 ${className}`}>
    <img 
      src="https://thumbs4.imagebam.com/1e/a5/d9/ME18R4D1_t.png" 
      alt="ESG Sunshine Logo" 
      className="w-full h-full object-contain p-0.5"
      loading="lazy"
    />
  </div>
));

const NavItem: React.FC<{
  id: View;
  active: boolean;
  onClick: () => void;
  label: string;
  collapsed?: boolean;
  themeMode: string;
}> = React.memo(({ id, active, onClick, label, collapsed, themeMode }) => {
    const isLight = themeMode === 'light';
    const { icon: Icon, color: colorKey } = VIEW_METADATA[id] || { icon: Menu, color: 'slate' };
    
    // 映射對應色值
    const colorClasses: Record<string, { text: string; border: string; bg: string }> = {
        gold: { text: 'text-amber-500', border: 'border-amber-500', bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10' },
        emerald: { text: 'text-emerald-500', border: 'border-emerald-500', bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10' },
        blue: { text: 'text-blue-500', border: 'border-blue-500', bg: isLight ? 'bg-blue-50' : 'bg-blue-500/10' },
        rose: { text: 'text-rose-500', border: 'border-rose-500', bg: isLight ? 'bg-rose-50' : 'bg-rose-500/10' },
        slate: { text: 'text-slate-500', border: 'border-slate-500', bg: isLight ? 'bg-slate-100' : 'bg-slate-500/10' }
    };
    
    const colors = colorClasses[colorKey] || colorClasses.slate;
    const parts = label.split(' (');
    const zh = parts[0];
    const en = parts.length > 1 ? parts[1].replace(')', '') : '';

    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group w-full mb-1 border-l-[3px]
          ${active 
            ? `${colors.bg} ${colors.border} font-bold` 
            : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}
          ${collapsed ? 'justify-center px-0' : ''}
        `}
      >
        <div className={`transition-all duration-300 z-10 ${active ? colors.text + ' scale-110' : (isLight ? 'text-slate-400' : 'text-gray-500') + ' group-hover:scale-110'}`}>
          <Icon className="w-5 h-5" />
        </div>
        {!collapsed && (
            <div className="flex flex-col items-start leading-tight z-10 overflow-hidden text-left">
               <span className={`text-[13px] truncate ${active ? (isLight ? 'text-slate-900' : 'text-white') : (isLight ? 'text-slate-500' : 'text-gray-400')}`}>{zh}</span>
               {en && <span className={`text-[9px] font-medium opacity-50 tracking-wide uppercase truncate ${active ? colors.text : ''}`}>{en}</span>}
            </div>
        )}
      </button>
    );
});

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];
  const { userName, level, hasPermission } = useCompany();
  const { notifications } = useToast();
  const { themeMode, toggleThemeMode } = useUniversalAgent();
  const isLight = themeMode === 'light';
  
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navGroups = useMemo(() => [
      {
          title: language === 'zh-TW' ? '核心成長' : 'Core Growth',
          items: [View.MY_ESG, View.YANG_BO, View.RESTORATION, View.USER_JOURNAL]
      },
      {
          title: language === 'zh-TW' ? '永續運營' : 'Sustainability Ops',
          items: [View.DASHBOARD, View.CARBON, View.STRATEGY, View.REPORT, View.FINANCE, View.AUDIT]
      },
      {
          title: language === 'zh-TW' ? '智慧情報' : 'Intelligence',
          items: [View.BUSINESS_INTEL, View.RESEARCH_HUB, View.ACADEMY, View.LIBRARY]
      },
      {
          title: language === 'zh-TW' ? '社會生態' : 'Ecosystem',
          items: [View.GOODWILL, View.CARD_GAME_ARENA, View.FUNDRAISING, View.TALENT]
      },
      {
          title: language === 'zh-TW' ? '系統核心' : 'System Core',
          items: [View.SETTINGS, View.DIAGNOSTICS]
      }
  ], [language]);

  const navLabels: Record<View, string> = useMemo(() => ({
      [View.MY_ESG]: language === 'zh-TW' ? '我的 ESG (My ESG)' : 'My ESG',
      [View.YANG_BO]: t.nav.yangBo,
      [View.RESTORATION]: t.nav.restoration,
      [View.USER_JOURNAL]: t.nav.userJournal,
      [View.DASHBOARD]: t.nav.dashboard,
      [View.CARBON]: t.nav.carbon,
      [View.STRATEGY]: t.nav.strategy,
      [View.REPORT]: t.nav.report,
      [View.FINANCE]: t.nav.finance,
      [View.AUDIT]: t.nav.audit,
      [View.BUSINESS_INTEL]: t.nav.businessIntel,
      [View.RESEARCH_HUB]: t.nav.researchHub,
      [View.ACADEMY]: t.nav.academy,
      [View.LIBRARY]: t.nav.library,
      [View.GOODWILL]: t.nav.goodwill,
      [View.CARD_GAME_ARENA]: t.nav.cardGameArena,
      [View.FUNDRAISING]: t.nav.fundraising,
      [View.TALENT]: t.nav.talent,
      [View.SETTINGS]: t.nav.settings,
      [View.DIAGNOSTICS]: t.nav.diagnostics,
      [View.API_ZONE]: t.nav.apiZone,
      [View.UNIVERSAL_TOOLS]: t.nav.universalTools,
      [View.HEALTH_CHECK]: t.nav.healthCheck,
      [View.INTEGRATION]: t.nav.integration,
      [View.CULTURE]: t.nav.culture,
      [View.ABOUT_US]: t.nav.aboutUs,
      [View.CONTACT_US]: t.nav.contactUs,
      [View.UNIVERSAL_BACKEND]: t.nav.universalBackend,
      [View.ALUMNI_ZONE]: t.nav.alumniZone,
      [View.UNIVERSAL_AGENT]: 'Universal Agent',
      [View.CARD_GAME]: 'Card Game'
  }), [language, t.nav]);

  return (
    <div className={`min-h-screen relative flex h-screen overflow-hidden transition-colors duration-500`}>
      <aside className={`
          hidden md:flex flex-col border-r shrink-0 transition-all duration-300 z-50
          ${isLight ? 'bg-white/95 border-slate-200 shadow-xl' : 'bg-slate-900/95 border-white/5'}
          backdrop-blur-2xl
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
      `}>
          <div className="h-20 flex items-center px-6 border-b border-inherit gap-3 cursor-pointer shrink-0" onClick={() => onNavigate(View.MY_ESG)}>
              <LogoIcon className="w-10 h-10 shadow-lg" />
              {!isSidebarCollapsed && (
                  <div className="flex flex-col">
                      <span className={`font-black text-xl leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>ESGss</span>
                      <span className="text-[9px] text-celestial-blue font-black tracking-widest uppercase">JunAiKey AIOS</span>
                  </div>
              )}
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
            {navGroups.map((group, idx) => {
                const visibleItems = group.items.filter(id => hasPermission(VIEW_ACCESS_MAP[id]));
                if (visibleItems.length === 0) return null;
                
                return (
                    <div key={idx} className="mb-6 last:mb-0">
                        {!isSidebarCollapsed && (
                            <div className={`text-[10px] uppercase px-3 mb-2 font-black tracking-[0.15em] ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>
                                {group.title}
                            </div>
                        )}
                        {visibleItems.map(viewId => (
                            <NavItem 
                                key={viewId} 
                                id={viewId}
                                active={currentView === viewId} 
                                onClick={() => onNavigate(viewId)} 
                                label={navLabels[viewId]} 
                                collapsed={isSidebarCollapsed}
                                themeMode={themeMode} 
                            />
                        ))}
                    </div>
                );
            })}
          </nav>

          <div className="p-4 border-t border-inherit shrink-0">
              <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${isLight ? 'bg-slate-100 hover:bg-slate-200' : 'bg-black/20 hover:bg-black/40'} cursor-pointer`} onClick={() => onNavigate(View.SETTINGS)}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-celestial-blue to-celestial-purple p-0.5 shadow-lg">
                      <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}`} className="w-full h-full rounded-full bg-slate-100" alt="Avatar" />
                  </div>
                  {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                          <div className={`text-xs font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{userName}</div>
                          <div className="text-[10px] opacity-60 font-mono font-bold">Lv.{level} COMMANDER</div>
                      </div>
                  )}
              </div>
          </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className={`
              h-20 flex items-center justify-between px-6 shrink-0 z-30 transition-all border-b
              ${isLight ? 'bg-white/70 border-slate-200' : 'bg-slate-900/40 border-white/5'}
              backdrop-blur-xl
          `}>
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 rounded-xl hover:bg-black/5 text-slate-500 transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-slate-300/30" />
                <button onClick={() => setIsCommandOpen(true)} className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all w-64 group ${isLight ? 'bg-slate-100 border-slate-200 hover:border-slate-300 shadow-sm' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">Search command...</span>
                    <span className="ml-auto text-[10px] opacity-30 font-mono">⌘K</span>
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={toggleThemeMode} className={`p-2.5 rounded-xl hover:bg-black/5 transition-colors ${isLight ? 'text-amber-500' : 'text-blue-400'}`}>
                    {isLight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={onToggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-black/5 text-xs font-black text-slate-500 transition-colors">
                  <Languages className="w-4 h-4" />
                  <span>{language === 'zh-TW' ? 'EN' : '中'}</span>
                </button>
                <div className="relative">
                    <button className="p-2.5 rounded-xl hover:bg-black/5 text-slate-500 relative transition-colors">
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />}
                    </button>
                </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-[1400px] mx-auto">
                {children}
            </div>
          </main>
      </div>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onNavigate={onNavigate} language={language} toggleLanguage={onToggleLanguage} />
      <UniversalAgent language={language} onNavigate={onNavigate} currentView={currentView} />
    </div>
  );
};
