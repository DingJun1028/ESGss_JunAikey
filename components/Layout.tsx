
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, GraduationCap, Search, Settings, Activity, Sun, Bell, Languages,
  Target, UserCheck, Leaf, FileText, Network, Bot, Calculator, ShieldCheck, Coins, Trophy, X, Zap, Star, Home, Radio, Command, Briefcase, Stethoscope, Wrench, Crown, BookOpen, Layers, Heart, Info, Megaphone, Calendar, Lock, Code, Database, UserPlus,
  Maximize, Minimize, Menu, ChevronLeft, ChevronRight, Library, Book, Hexagon, Swords, AlertOctagon, Terminal, PenTool, Fingerprint, Map, Sparkles
} from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';
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
}

const NavItem: React.FC<NavItemProps> = React.memo(({ active, onClick, icon, label, highlight, collapsed }) => {
    // Bilingual Splitting logic
    const parts = label.split(' (');
    const zh = parts[0];
    const en = parts.length > 1 ? parts[1].replace(')', '') : '';

    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group w-full
          ${active 
            ? 'bg-gradient-to-r from-celestial-purple/90 to-celestial-purple/70 text-white shadow-lg shadow-purple-500/20' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'}
          ${collapsed ? 'justify-center px-0 w-16 mx-auto' : ''}
        `}
        title={collapsed ? label : undefined}
      >
        <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        
        {!collapsed && (
            <div className={`flex flex-col items-start leading-tight transition-opacity duration-300 ${active ? 'font-bold tracking-wide' : ''}`}>
               <span className="text-lg font-medium">{zh}</span>
               {en && <span className="text-xs font-light opacity-60 font-sans tracking-normal mt-0.5">{en}</span>}
            </div>
        )}
        
        {highlight && !collapsed && (
            <span className="absolute right-4 w-2 h-2 rounded-full bg-celestial-gold animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        )}
        {highlight && collapsed && (
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-celestial-gold animate-pulse" />
        )}
      </button>
    );
});

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];
  const { userName, level, xp, totalScore, tier } = useCompany();
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

  // Better Avatar Seed
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

  // MECE Reorganization - Reorganized per user request
  const navGroups = useMemo(() => [
      {
          title: language === 'zh-TW' ? '核心' : 'Core',
          items: [
              { id: View.MY_ESG, icon: Home, label: t.nav.myEsg }, 
              { id: View.UNIVERSAL_AGENT, icon: Sparkles, label: language === 'zh-TW' ? '萬能代理 (Universal Agent)' : 'Universal Agent', highlight: true },
              { id: View.YANG_BO, icon: Crown, label: t.nav.yangBo }, 
              { id: View.USER_JOURNAL, icon: Book, label: t.nav.userJournal },
              { id: View.RESTORATION, icon: Hexagon, label: t.nav.restoration, highlight: true },
              { id: View.CARD_GAME_ARENA, icon: Swords, label: t.nav.cardGameArena },
          ]
      },
      {
          title: language === 'zh-TW' ? '運營' : 'Ops',
          items: [
              { id: View.DASHBOARD, icon: LayoutDashboard, label: t.nav.dashboard },
              { id: View.CARBON, icon: Leaf, label: t.nav.carbon },
              { id: View.STRATEGY, icon: Target, label: t.nav.strategy },
              { id: View.REPORT, icon: FileText, label: t.nav.report },
              { id: View.INTEGRATION, icon: Network, label: t.nav.integration },
          ]
      },
      {
          title: language === 'zh-TW' ? '洞察' : 'Intel',
          items: [
              { id: View.BUSINESS_INTEL, icon: Briefcase, label: language === 'zh-TW' ? '商情分析 (Market Analysis)' : 'Market Analysis' },
              { id: View.RESEARCH_HUB, icon: Search, label: language === 'zh-TW' ? '研究中心 (Research Center)' : 'Research Center' },
              { id: View.ACADEMY, icon: GraduationCap, label: t.nav.academy },
              { id: View.LIBRARY, icon: Library, label: t.nav.library },
          ]
      },
      {
          title: language === 'zh-TW' ? '生態' : 'Eco',
          items: [
              { id: View.GOODWILL, icon: Coins, label: t.nav.goodwill },
              { id: View.FUNDRAISING, icon: Heart, label: t.nav.fundraising },
              { id: View.ALUMNI_ZONE, icon: UserPlus, label: t.nav.alumniZone },
              { id: View.TALENT, icon: Fingerprint, label: t.nav.talent },
          ]
      },
      {
          title: language === 'zh-TW' ? '系統' : 'Sys',
          items: [
              { id: View.SETTINGS, icon: Settings, label: t.nav.settings },
              { id: View.DIAGNOSTICS, icon: Activity, label: t.nav.diagnostics },
              { id: View.API_ZONE, icon: Code, label: t.nav.apiZone },
              { id: View.UNIVERSAL_BACKEND, icon: Database, label: t.nav.universalBackend },
              { id: View.UNIVERSAL_TOOLS, icon: Command, label: t.nav.universalTools }, // Added Universal Tools
          ]
      }
  ], [language, t.nav]);

  return (
    <div className={`min-h-screen bg-celestial-900 text-gray-200 relative overflow-hidden font-sans selection:bg-celestial-emerald/30 
        ${isCritical ? 'ring-4 ring-inset ring-red-900/50' : ''}
        ${systemStatus !== 'STABLE' ? 'filter hue-rotate-15 contrast-125' : ''}
    `}>
      <SystemCrashOverlay />
      
      {/* Dynamic Background */}
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
        
        {/* Sidebar */}
        <aside 
            className={`
                hidden md:flex flex-col border-r border-white/5 bg-slate-900/60 backdrop-blur-xl shrink-0 transition-all duration-300 ease-in-out
                ${isZenMode ? '-ml-[320px] opacity-0' : ''}
                ${isSidebarCollapsed ? 'w-24' : 'w-80'}
            `}
        >
          {/* Brand */}
          <div className={`h-28 flex flex-col justify-center ${isSidebarCollapsed ? 'items-center' : 'items-start px-6'} border-b border-white/5 relative group cursor-pointer`} onClick={() => onNavigate(View.MY_ESG)}>
            <div className={`flex items-center gap-4 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                   <LogoIcon className="w-14 h-14 shadow-lg shadow-celestial-gold/10" />
                </div>
                
                <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <span className="font-bold text-3xl tracking-tight text-white font-sans whitespace-nowrap">
                      ESGss
                    </span>
                    <span className="text-sm text-celestial-emerald tracking-[0.2em] uppercase font-bold whitespace-nowrap mt-1">
                      JunAiKey
                    </span>
                </div>
            </div>

            <button 
                onClick={(e) => { e.stopPropagation(); setIsSidebarCollapsed(!isSidebarCollapsed); }}
                className={`p-2 mt-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all ${isSidebarCollapsed ? 'hidden' : 'block self-end absolute top-1/2 -translate-y-1/2 right-2'}`}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          
          {isSidebarCollapsed && (
             <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="w-full py-4 flex justify-center text-gray-500 hover:text-white"
             >
                 <ChevronRight className="w-5 h-5" />
             </button>
          )}

          {/* Navigation - Optimized spacing */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar scroll-smooth">
            {navGroups.map((group, idx) => (
                <div key={idx}>
                    {!isSidebarCollapsed && (
                        <div className="text-sm uppercase text-gray-500 px-4 mb-2 font-bold tracking-wider opacity-70">
                            {group.title}
                        </div>
                    )}
                    {isSidebarCollapsed && (
                        <div className="text-xs text-center text-gray-600 mb-2 font-bold">{group.title.substring(0,2)}</div>
                    )}
                    <div className="space-y-1.5">
                        {group.items.map(item => (
                            <NavItem 
                                key={item.id}
                                active={currentView === item.id} 
                                onClick={() => onNavigate(item.id)} 
                                icon={<item.icon className={`w-6 h-6 ${item.highlight ? 'text-celestial-gold animate-pulse' : ''}`} />} 
                                label={item.label} 
                                highlight={item.highlight}
                                collapsed={isSidebarCollapsed}
                            />
                        ))}
                    </div>
                    {isSidebarCollapsed && idx < navGroups.length - 1 && <div className="mx-auto w-8 h-[1px] bg-white/5 my-4" />}
                </div>
            ))}
          </nav>

          {/* User Profile (Compact/Full) */}
          <div className="p-4 border-t border-white/5 bg-black/10">
              <div className={`flex items-center gap-4 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <div className="relative group cursor-pointer" onClick={() => onNavigate(View.RESTORATION)}>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-celestial-purple to-blue-600 p-[2px]">
                          <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full bg-slate-900 object-cover" />
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 bg-slate-900 rounded-full p-1 border border-white/10 ${isCritical ? 'animate-ping' : ''}`}>
                          <div className={`w-3 h-3 rounded-full ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      </div>
                  </div>
                  
                  {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-white truncate">{userName}</div>
                          <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-celestial-purple font-mono bg-celestial-purple/10 px-2 py-0.5 rounded">Lv.{level}</span>
                              <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-celestial-purple w-[60%]" style={{ width: `${xpProgress}%` }} />
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
                h-24 flex items-center justify-between px-8 shrink-0 z-30 transition-all duration-500 border-b border-white/5
                ${isZenMode ? '-mt-24 opacity-0' : 'bg-slate-900/40 backdrop-blur-md'}
            `}
          >
            {/* Left: Mobile Toggle & Breadcrumbs/Status */}
            <div className="flex items-center gap-4">
                <div className="md:hidden">
                     <LogoIcon className="w-10 h-10" />
                </div>
                
                <div className="hidden lg:flex items-center gap-3 text-sm">
                    <button onClick={() => setIsSubModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-celestial-gold/20 to-transparent rounded-full border border-celestial-gold/30 text-celestial-gold hover:bg-celestial-gold/30 transition-all">
                        <Crown className="w-4 h-4" />
                        <span className="font-bold">{tier} Plan</span>
                    </button>
                </div>
            </div>
            
            {/* Center: Search (Optional, prominent) */}
            <button 
                onClick={() => setIsCommandOpen(true)}
                className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all w-80 group"
            >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Search or type command...</span>
                <div className="ml-auto flex gap-1">
                    <span className="text-xs bg-black/30 px-2 py-1 rounded border border-white/5">⌘K</span>
                </div>
            </button>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsNavCenterOpen(true)}
                    className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    title={language === 'zh-TW' ? "導覽中心" : "Tour Center"}
                >
                    <Map className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => onNavigate(View.ABOUT_US)}
                    className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    title={language === 'zh-TW' ? "關於我們" : "About Us"}
                >
                    <Info className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => setIsZenMode(true)}
                    className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    title="Enter Zen Mode (⌘.)"
                >
                    <Maximize className="w-5 h-5" />
                </button>

                <div className="h-8 w-[1px] bg-white/10 mx-1" />

                <button 
                  onClick={onToggleLanguage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-sm font-bold text-gray-300 transition-colors"
                >
                  <Languages className="w-5 h-5" />
                  <span>{language === 'zh-TW' ? 'EN' : '中'}</span>
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`p-3 rounded-xl transition-all ${isNotificationsOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <Bell className="w-6 h-6" />
                        {notifications.length > 0 && (
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-celestial-gold animate-ping" />
                        )}
                        {notifications.length > 0 && (
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-celestial-gold" />
                        )}
                    </button>
                    {/* Notifications Dropdown (Simplified for layout brevity) */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                            <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">Notifications</div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1">
                                {notifications.length === 0 ? <div className="p-4 text-center text-xs text-gray-500">No new alerts</div> : 
                                    notifications.map(n => (
                                        <div key={n.id} className="p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                                            <div className={`text-xs font-bold ${n.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{n.title}</div>
                                            <div className="text-[10px] text-gray-300 mt-1 line-clamp-2">{n.message}</div>
                                        </div>
                                    ))
                                }
                            </div>
                            {notifications.length > 0 && <button onClick={clearNotifications} className="w-full text-center text-[10px] py-2 text-gray-500 hover:text-white border-t border-white/5 mt-2">Clear All</button>}
                        </div>
                    )}
                </div>
            </div>
          </header>

          <main ref={mainRef} className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar scroll-smooth">
            {/* Zen Mode Exit Button */}
            {isZenMode && (
                <button 
                    onClick={() => setIsZenMode(false)}
                    className="fixed top-6 right-6 z-50 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all opacity-20 hover:opacity-100"
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40 safe-pb">
            <div className="flex items-center justify-around h-full px-2">
                {navGroups[0].items.slice(0, 4).map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${currentView === item.id ? 'text-white' : 'text-gray-500'}`}
                    >
                        <div className={`p-1 rounded-lg ${currentView === item.id ? 'bg-white/10' : ''}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] mt-1 font-medium">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
                <button onClick={() => setIsCommandOpen(true)} className="flex flex-col items-center justify-center w-16 text-gray-500">
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] mt-1">Menu</span>
                </button>
            </div>
        </div>

        {/* AI Assistant */}
        <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} />
    </div>
  );
};
