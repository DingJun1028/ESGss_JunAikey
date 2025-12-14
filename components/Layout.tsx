
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, GraduationCap, Search, Settings, Activity, Sun, Bell, Languages,
  Target, UserCheck, Leaf, FileText, Network, Bot, Calculator, ShieldCheck, Coins, Trophy, X, Zap, Star, Home, Radio, Command, Briefcase, Stethoscope, Wrench, Crown, BookOpen, Layers, Heart, Info, Megaphone, Calendar, Lock, Code, Database, UserPlus,
  Maximize, Minimize, Menu, ChevronLeft, ChevronRight, Library, Book, Hexagon, Swords, AlertOctagon, Terminal, PenTool, Fingerprint, Map, Sparkles, LogOut, Grid
} from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS, VIEW_ACCESS_MAP } from '../constants';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { CommandPalette } from './CommandPalette';
import { AiAssistant } from './AiAssistant';
import { SubscriptionModal } from './SubscriptionModal';
import { OnboardingTour } from './OnboardingTour';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { NavigationCenter } from './NavigationCenter';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
}

// Updated Logo: Enhanced Depth
export const LogoIcon = React.memo(({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl shadow-[inset_0_2px_6px_rgba(255,255,255,0.1)] border border-white/10 bg-black/40 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-celestial-gold/20 via-transparent to-celestial-purple/20 opacity-50" />
    <img 
      src="https://thumbs4.imagebam.com/7f/89/20/ME18KXN8_t.png" 
      alt="ESGss Logo" 
      className="w-full h-full object-cover opacity-90 relative z-10"
      loading="lazy"
    />
  </div>
));

// --- Neural Fabric Component ---
const NeuralFabric: React.FC = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number, y: number, vx: number, vy: number, size: number, phase: number }[] = [];
        
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 30 : 60;
        const CONNECT_DISTANCE = 200;

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 1.5 + 0.5,
                    phase: Math.random() * Math.PI * 2
                });
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const draw = () => {
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.phase += 0.01;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                const currentSize = p.size + Math.sin(p.phase) * 0.3;

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.1, currentSize), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + Math.sin(p.phase) * 0.05})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECT_DISTANCE) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.03 * (1 - dist / CONNECT_DISTANCE)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
});

// --- System Crash Overlay ---
const SystemCrashOverlay: React.FC = () => {
    const { systemStatus, logs } = useUniversalAgent();
    
    if (systemStatus === 'STABLE') return null;

    const isCritical = systemStatus === 'CRITICAL';
    const isRebooting = systemStatus === 'REBOOTING';

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center font-mono pointer-events-none transition-all duration-300
            ${isCritical ? 'bg-red-900/40 backdrop-blur-sm' : isRebooting ? 'bg-black' : 'bg-transparent'}
        `}>
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[201] bg-[length:100%_2px,3px_100%] pointer-events-none" />
            
            <div className="relative z-20 w-full max-w-2xl p-8">
                {systemStatus === 'UNSTABLE' && (
                    <div className="text-amber-400 text-center animate-pulse">
                        <AlertOctagon className="w-24 h-24 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-2">SYSTEM INSTABILITY DETECTED</h1>
                        <p>Neural coherence dropping below 40%...</p>
                    </div>
                )}

                {systemStatus === 'CRITICAL' && (
                    <div className="text-red-500 text-center animate-[shake_0.5s_infinite]">
                        <h1 className="text-6xl font-bold mb-4 tracking-tighter">CRITICAL FAILURE</h1>
                        <div className="text-2xl mb-8">MEMORY HEAP OVERFLOW 0x8849F2</div>
                        <div className="space-y-1 text-sm font-mono text-left bg-black/50 p-4 rounded border border-red-500">
                            {Array.from({length: 5}).map((_, i) => (
                                <div key={i} className="truncate">Error: Segmentation fault at core_module_{Math.floor(Math.random()*100)}...</div>
                            ))}
                        </div>
                    </div>
                )}

                {systemStatus === 'REBOOTING' && (
                    <div className="text-emerald-500 w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <Terminal className="w-8 h-8 animate-pulse" />
                            <h2 className="text-2xl font-bold">JunAiKey AIOS KERNEL v15.0 - SAFE MODE</h2>
                        </div>
                        <div className="h-64 overflow-hidden border border-emerald-500/30 rounded-lg p-4 bg-black/90 font-mono text-xs flex flex-col justify-end">
                            {logs.slice(-8).map((log, i) => (
                                <div key={i} className="mb-1">
                                    <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className="text-emerald-400 ml-2">{log.message}</span>
                                </div>
                            ))}
                            <div className="animate-pulse">_</div>
                        </div>
                        <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-[width_8s_ease-in-out_forwards] w-0" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
  collapsed?: boolean;
  colors: {
      text: string;
      activeText: string;
      activeBg: string;
      border: string;
  };
}

const NavItem: React.FC<NavItemProps> = React.memo(({ active, onClick, icon, label, highlight, collapsed, colors }) => {
    // Bilingual Splitting logic
    const parts = label.split(' (');
    const zh = parts[0];
    const en = parts.length > 1 ? parts[1].replace(')', '') : '';

    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group w-full overflow-hidden
          ${active 
            ? `bg-gradient-to-r ${colors.activeBg} to-transparent ${colors.activeText} shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border-l-2 ${colors.border}` 
            : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}
          ${collapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
        `}
        title={collapsed ? label : undefined}
      >
        {active && <div className={`absolute inset-0 opacity-10 animate-pulse pointer-events-none ${colors.activeBg}`} />}
        
        <div className={`transition-transform duration-300 z-10 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-gray-200'}`}>
          {icon}
        </div>
        
        {!collapsed && (
            <div className={`flex flex-col items-start leading-tight transition-opacity duration-300 z-10 ${active ? 'font-bold tracking-wide' : 'font-medium'}`}>
               <span className="text-sm tracking-tight">{zh}</span>
               {en && <span className="text-[9px] font-normal opacity-50 font-mono tracking-normal mt-0.5 uppercase">{en}</span>}
            </div>
        )}
        
        {highlight && !collapsed && (
            <span className={`absolute right-3 w-1.5 h-1.5 rounded-full ${colors.border.replace('border-', 'bg-')} animate-pulse shadow-lg z-10`} />
        )}
        {highlight && collapsed && (
            <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${colors.border.replace('border-', 'bg-')} animate-pulse z-10`} />
        )}
      </button>
    );
});

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];
  const { userName, roleTitle, level, xp, totalScore, tier, companyName, hasPermission } = useCompany();
  const { notifications, clearNotifications } = useToast();
  const { systemStatus } = useUniversalAgent();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isNavCenterOpen, setIsNavCenterOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  
  const mainRef = useRef<HTMLElement>(null);

  const currentLevelBaseXp = (level - 1) * 1000;
  const xpProgress = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / 1000) * 100));
  const isCritical = totalScore < 60 || systemStatus === 'CRITICAL';

  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
          e.preventDefault();
          setIsZenMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // MECE Reorganization: Consolidated "Universal" items into "Universal Tools" top-level entry
  // Removed UNIVERSAL_AGENT, UNIVERSAL_BACKEND, UNIVERSAL_TOOLS from sidebar
  const navGroups = useMemo(() => {
      const allGroups = [
          {
              title: language === 'zh-TW' ? '核心 (CORE)' : 'Core',
              colors: { text: 'text-amber-400', activeText: 'text-amber-300', activeBg: 'from-amber-500/20', border: 'border-amber-400' },
              items: [
                  { id: View.MY_ESG, icon: Home, label: t.nav.myEsg }, 
                  { id: View.YANG_BO, icon: Crown, label: t.nav.yangBo }, 
                  { id: View.USER_JOURNAL, icon: Book, label: t.nav.userJournal },
                  { id: View.RESTORATION, icon: Hexagon, label: t.nav.restoration, highlight: true },
                  { id: View.CARD_GAME_ARENA, icon: Swords, label: t.nav.cardGameArena },
              ]
          },
          {
              title: language === 'zh-TW' ? '運營 (OPS)' : 'Ops',
              colors: { text: 'text-emerald-400', activeText: 'text-emerald-300', activeBg: 'from-emerald-500/20', border: 'border-emerald-400' },
              items: [
                  { id: View.DASHBOARD, icon: LayoutDashboard, label: t.nav.dashboard },
                  { id: View.CARBON, icon: Leaf, label: t.nav.carbon },
                  { id: View.STRATEGY, icon: Target, label: t.nav.strategy },
                  { id: View.REPORT, icon: FileText, label: t.nav.report },
                  { id: View.INTEGRATION, icon: Network, label: t.nav.integration },
              ]
          },
          {
              title: language === 'zh-TW' ? '洞察 (INTEL)' : 'Intel',
              colors: { text: 'text-sky-400', activeText: 'text-sky-300', activeBg: 'from-sky-500/20', border: 'border-sky-400' },
              items: [
                  { id: View.BUSINESS_INTEL, icon: Briefcase, label: language === 'zh-TW' ? '商情分析 (Market Analysis)' : 'Market Analysis' },
                  { id: View.RESEARCH_HUB, icon: Search, label: language === 'zh-TW' ? '研究中心 (Research Center)' : 'Research Center' },
                  { id: View.ACADEMY, icon: GraduationCap, label: t.nav.academy },
                  { id: View.LIBRARY, icon: Library, label: t.nav.library },
              ]
          },
          {
              title: language === 'zh-TW' ? '生態 (ECO)' : 'Eco',
              colors: { text: 'text-rose-400', activeText: 'text-rose-300', activeBg: 'from-rose-500/20', border: 'border-rose-400' },
              items: [
                  { id: View.GOODWILL, icon: Coins, label: t.nav.goodwill },
                  { id: View.FUNDRAISING, icon: Heart, label: t.nav.fundraising },
                  { id: View.ALUMNI_ZONE, icon: UserPlus, label: t.nav.alumniZone },
                  { id: View.TALENT, icon: Fingerprint, label: t.nav.talent },
              ]
          },
          {
              title: language === 'zh-TW' ? '系統 (SYS)' : 'Sys',
              colors: { text: 'text-indigo-400', activeText: 'text-indigo-300', activeBg: 'from-indigo-500/20', border: 'border-indigo-400' },
              items: [
                  { id: View.SETTINGS, icon: Settings, label: t.nav.settings },
                  { id: View.DIAGNOSTICS, icon: Activity, label: t.nav.diagnostics },
                  { id: View.API_ZONE, icon: Code, label: t.nav.apiZone },
                  // Universal Backend/Tools moved to Header
                  { id: View.ABOUT_US, icon: Info, label: t.nav.aboutUs },
              ]
          }
      ];

      // Filter items based on permissions
      return allGroups.map(group => ({
          ...group,
          items: group.items.filter(item => hasPermission(VIEW_ACCESS_MAP[item.id]))
      })).filter(group => group.items.length > 0);

  }, [language, t.nav, hasPermission]);

  const mobileNavItems = useMemo(() => {
      return navGroups.flatMap(group => group.items.map(item => ({...item, colors: group.colors})));
  }, [navGroups]);

  return (
    <div className={`min-h-screen bg-celestial-900 text-gray-200 relative overflow-hidden font-sans selection:bg-celestial-emerald/30 
        ${isCritical ? 'ring-4 ring-inset ring-red-900/50' : ''}
        ${systemStatus !== 'STABLE' ? 'filter hue-rotate-15 contrast-125' : ''}
    `}>
      <SystemCrashOverlay />
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <NeuralFabric />
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-10 animate-blob mix-blend-screen ${isCritical ? 'bg-red-900' : 'bg-celestial-purple'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-10 animate-blob animation-delay-2000 mix-blend-screen ${isCritical ? 'bg-orange-900' : 'bg-celestial-emerald'}`} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onNavigate={onNavigate} 
        language={language}
        toggleLanguage={onToggleLanguage}
      />

      <SubscriptionModal 
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        language={language}
      />

      <NavigationCenter 
        isOpen={isNavCenterOpen}
        onClose={() => setIsNavCenterOpen(false)}
        language={language}
        onNavigate={onNavigate}
      />

      <OnboardingTour language={language} />

      <div className={`relative z-10 flex h-screen transition-all duration-500 ${isZenMode ? 'p-0' : ''}`}>
        
        {/* Sidebar (Desktop) */}
        <aside 
            className={`
                hidden md:flex flex-col border-r border-white/5 bg-slate-900/80 backdrop-blur-2xl shrink-0 transition-all duration-300 ease-in-out relative z-50
                ${isZenMode ? '-ml-[320px] opacity-0' : ''}
                ${isSidebarCollapsed ? 'w-20' : 'w-64'}
            `}
        >
          {/* Brand */}
          <div className={`h-20 flex flex-col justify-center ${isSidebarCollapsed ? 'items-center' : 'items-start px-5'} border-b border-white/5 relative group cursor-pointer`} onClick={() => onNavigate(View.MY_ESG)}>
            <div className={`flex items-center gap-3 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                   <LogoIcon className="w-10 h-10 shadow-lg shadow-celestial-gold/10" />
                </div>
                
                <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <span className="font-bold text-xl tracking-tight text-white font-sans whitespace-nowrap drop-shadow-md">
                      ESGss
                    </span>
                    <span className="text-[10px] text-celestial-emerald tracking-[0.2em] uppercase font-bold whitespace-nowrap mt-0.5 flex items-center gap-1">
                      JunAiKey <span className="w-1 h-1 rounded-full bg-celestial-emerald animate-pulse"/>
                    </span>
                </div>
            </div>

            <button 
                onClick={(e) => { e.stopPropagation(); setIsSidebarCollapsed(!isSidebarCollapsed); }}
                className={`p-1.5 mt-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all ${isSidebarCollapsed ? 'hidden' : 'block self-end absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100'}`}
            >
                <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          
          {isSidebarCollapsed && (
             <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="w-full py-4 flex justify-center text-gray-500 hover:text-white"
             >
                 <ChevronRight className="w-4 h-4" />
             </button>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar scroll-smooth">
            {navGroups.map((group, idx) => (
                <div key={idx} className="relative">
                    {!isSidebarCollapsed && (
                        <div className={`text-[10px] uppercase px-3 mb-2 font-bold tracking-[0.15em] flex items-center gap-2 ${group.colors.text}`}>
                            {group.title}
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                    )}
                    {isSidebarCollapsed && (
                        <div className={`text-[8px] text-center mb-2 font-bold font-mono border-b border-white/5 pb-1 ${group.colors.text}`}>{group.title.substring(0,3)}</div>
                    )}
                    <div className="space-y-0.5">
                        {group.items.map(item => (
                            <NavItem 
                                key={item.id}
                                active={currentView === item.id} 
                                onClick={() => onNavigate(item.id)} 
                                icon={<item.icon className={`w-5 h-5 ${item.highlight ? 'text-celestial-gold animate-pulse' : ''}`} />} 
                                label={item.label} 
                                highlight={item.highlight}
                                collapsed={isSidebarCollapsed}
                                colors={group.colors}
                            />
                        ))}
                    </div>
                </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-3 border-t border-white/5 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-xl">
              <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''} group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors`} onClick={() => onNavigate(View.SETTINGS)}>
                  <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-celestial-purple to-blue-600 p-[1.5px] shadow-lg">
                          <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full bg-slate-900 object-cover" />
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 bg-slate-900 rounded-full p-0.5 border border-white/10 ${isCritical ? 'animate-ping' : ''}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-red-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`} />
                      </div>
                  </div>
                  
                  {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white truncate leading-tight">{userName}</div>
                          <div className="text-[10px] text-gray-400 truncate mb-1">{roleTitle}</div>
                          <div className="flex items-center gap-2">
                              <span className="text-[9px] text-celestial-purple font-mono font-bold bg-celestial-purple/10 px-1 py-0 rounded border border-celestial-purple/20">Lv.{level}</span>
                              <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-celestial-purple w-[60%] shadow-[0_0_10px_#8b5cf6]" style={{ width: `${xpProgress}%` }} />
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Header */}
          <header 
            className={`
                h-20 flex items-center justify-between px-6 shrink-0 z-30 transition-all duration-500 border-b border-white/5
                ${isZenMode ? '-mt-20 opacity-0' : 'bg-slate-900/60 backdrop-blur-xl'}
            `}
          >
            <div className="flex items-center gap-4">
                <div className="md:hidden">
                     <LogoIcon className="w-10 h-10" />
                </div>
                
                {/* UNIVERSAL TOOLKIT BUTTON (Prominent) */}
                <button 
                    onClick={() => onNavigate(View.UNIVERSAL_TOOLS)}
                    className={`
                        hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 group
                        ${currentView === View.UNIVERSAL_TOOLS || currentView === View.UNIVERSAL_AGENT || currentView === View.UNIVERSAL_BACKEND
                            ? 'bg-gradient-to-r from-celestial-purple/20 to-indigo-600/20 text-white border-celestial-purple/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}
                    `}
                >
                    <Command className="w-4 h-4 group-hover:animate-spin-slow" />
                    <span className="text-sm font-bold tracking-wide">
                        {language === 'zh-TW' ? '萬能工具' : 'Universal Tools'}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-celestial-purple animate-pulse ml-1" />
                </button>

                <div className="hidden lg:flex items-center gap-3 text-sm">
                    <button onClick={() => setIsSubModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-celestial-gold/10 to-transparent rounded-full border border-celestial-gold/20 text-celestial-gold hover:bg-celestial-gold/20 transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        <Crown className="w-4 h-4" />
                        <span className="font-bold tracking-wide">{tier} Plan</span>
                    </button>
                </div>
            </div>
            
            {/* Center Search */}
            <button 
                onClick={() => setIsCommandOpen(true)}
                className="hidden xl:flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all w-80 group shadow-inner"
            >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Type command or search...</span>
                <div className="ml-auto flex gap-1">
                    <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded border border-white/5 text-gray-500 group-hover:text-gray-300">⌘K</span>
                </div>
            </button>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsNavCenterOpen(true)}
                    className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    title={language === 'zh-TW' ? "導覽中心" : "Tour Center"}
                >
                    <Map className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => setIsZenMode(true)}
                    className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    title="Enter Zen Mode (⌘.)"
                >
                    <Maximize className="w-5 h-5" />
                </button>

                <div className="h-6 w-[1px] bg-white/10 mx-1" />

                <button 
                  onClick={onToggleLanguage}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-xs font-bold text-gray-300 transition-colors"
                >
                  <Languages className="w-4 h-4" />
                  <span>{language === 'zh-TW' ? 'EN' : '中'}</span>
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-celestial-gold animate-ping" />
                        )}
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-celestial-gold shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-4 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl ring-1 ring-white/10">
                            <div className="text-xs font-bold text-gray-500 px-4 py-3 uppercase tracking-wider border-b border-white/5 flex justify-between items-center">
                                <span>Notifications</span>
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded">{notifications.length} New</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1 p-2">
                                {notifications.length === 0 ? <div className="p-8 text-center text-xs text-gray-500">No new alerts</div> : 
                                    notifications.map(n => (
                                        <div key={n.id} className="p-3 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors border border-transparent hover:border-white/5">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className={`text-xs font-bold ${n.type === 'error' ? 'text-red-400' : n.type === 'success' ? 'text-emerald-400' : 'text-celestial-blue'}`}>{n.title}</div>
                                                <span className="text-[9px] text-gray-600">Just now</span>
                                            </div>
                                            <div className="text-[10px] text-gray-300 line-clamp-2 group-hover:text-white transition-colors">{n.message}</div>
                                        </div>
                                    ))
                                }
                            </div>
                            {notifications.length > 0 && <button onClick={clearNotifications} className="w-full text-center text-[10px] py-2 text-gray-500 hover:text-white border-t border-white/5 mt-1 hover:bg-white/5 transition-colors rounded-b-xl">Clear All</button>}
                        </div>
                    )}
                </div>
            </div>
          </header>

          <main ref={mainRef} className="flex-1 overflow-y-auto p-2 md:p-4 relative custom-scrollbar scroll-smooth">
            {isZenMode && (
                <button 
                    onClick={() => setIsZenMode(false)}
                    className="fixed top-6 right-6 z-50 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all opacity-20 hover:opacity-100 shadow-2xl border border-white/10"
                >
                    <Minimize className="w-6 h-6" />
                </button>
            )}
            
            <div className="max-w-7xl mx-auto pb-24 min-h-full">
                {children}
            </div>
          </main>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40 safe-pb shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center h-full px-4 pb-2 overflow-x-auto no-scrollbar gap-2 snap-x snap-mandatory w-full">
                {mobileNavItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center min-w-[70px] py-2 rounded-2xl transition-all snap-center ${currentView === item.id ? item.colors.activeText : 'text-gray-500'}`}
                    >
                        <div className={`p-2 rounded-xl mb-1 ${currentView === item.id ? `bg-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]` : ''}`}>
                            <item.icon className={`w-6 h-6 ${currentView === item.id ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wide truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
                
                {/* Mobile Universal Tools */}
                <button 
                    onClick={() => onNavigate(View.UNIVERSAL_TOOLS)} 
                    className="flex flex-col items-center justify-center min-w-[70px] py-2 rounded-2xl text-celestial-purple snap-center"
                >
                    <div className="p-2 mb-1 bg-celestial-purple/10 rounded-xl border border-celestial-purple/30">
                        <Command className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-medium">Tools</span>
                </button>
            </div>
        </div>

        {/* AI Assistant - Draggable */}
        <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} />
    </div>
  );
};
