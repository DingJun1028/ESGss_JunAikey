
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Send, Bot, X, Sparkles, Minimize2, Loader2, Terminal, Grid, 
    BrainCircuit, Activity, Eye, Database, Share2, Network, 
    ShieldCheck, Zap, Layers, Leaf, Target, FileText, Briefcase, Globe, Users,
    ArrowRight, Lightbulb, Compass, Bell, CheckSquare, Copy, RotateCcw, ThumbsUp, ThumbsDown, Download,
    Trash2, Mic, Camera, Calculator, ScanLine, Cpu, Save, Paperclip, ArrowLeft, Plus, MessageSquarePlus, Eraser, User, Command, Search,
    ChevronRight, ChevronLeft, Shield, TrendingUp, Info
} from 'lucide-react';
import { Language, View } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent, AgentMode } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { GenerativeUIRenderer } from './GenerativeUIRenderer';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface UniversalAgentProps {
  language: Language;
  onNavigate: (view: View) => void;
  currentView: View;
}

interface AgentPersona {
    core: 'Perception' | 'Cognition' | 'Memory' | 'Expression' | 'Nexus';
    name: string; 
    role: string; 
    icon: any;
    color: string; 
    accent: string; 
    bgEffect: 'nebula' | 'grid' | 'matrix' | 'flow';
}

const AVATAR_MATRIX: Partial<Record<View, AgentPersona>> = {
    [View.RESEARCH_HUB]: { core: 'Perception', name: 'Spectral Scanner', role: 'Data Ingestion Specialist', icon: Eye, color: 'purple', accent: '#a855f7', bgEffect: 'flow' },
    [View.INTEGRATION]: { core: 'Perception', name: 'Data Lake Sensor', role: 'Signal Processor', icon: Network, color: 'blue', accent: '#3b82f6', bgEffect: 'grid' },
    [View.BUSINESS_INTEL]: { core: 'Perception', name: 'Global Crawler', role: 'Intel Scout', icon: Globe, color: 'indigo', accent: '#6366f1', bgEffect: 'flow' },
    [View.STRATEGY]: { core: 'Cognition', name: 'Strategy Oracle', role: 'Risk Analyst', icon: BrainCircuit, color: 'gold', accent: '#fbbf24', bgEffect: 'grid' },
    [View.CARBON]: { core: 'Cognition', name: 'Carbon Calculator', role: 'GHG Auditor', icon: Leaf, color: 'emerald', accent: '#10b981', bgEffect: 'nebula' },
    [View.FINANCE]: { core: 'Cognition', name: 'ROI Simulator', role: 'Financial Engine', icon: Activity, color: 'gold', accent: '#fbbf24', bgEffect: 'grid' },
    [View.HEALTH_CHECK]: { core: 'Cognition', name: 'Health Diagnostician', role: 'Vitality Analyst', icon: Activity, color: 'rose', accent: '#f43f5e', bgEffect: 'nebula' },
    [View.RESTORATION]: { core: 'Memory', name: 'Asset Vault', role: 'Archivist', icon: Database, color: 'cyan', accent: '#06b6d4', bgEffect: 'grid' },
    [View.CARD_GAME_ARENA]: { core: 'Memory', name: 'Asset Vault', role: 'Gamemaster', icon: Layers, color: 'cyan', accent: '#06b6d4', bgEffect: 'nebula' },
    [View.TALENT]: { core: 'Memory', name: 'Skill Galaxy', role: 'Talent Mapper', icon: Sparkles, color: 'pink', accent: '#ec4899', bgEffect: 'nebula' },
    [View.REPORT]: { core: 'Expression', name: 'The Scribe', role: 'Report Generator', icon: FileText, color: 'blue', accent: '#3b82f6', bgEffect: 'flow' },
    [View.DASHBOARD]: { core: 'Expression', name: 'Omni-Cell', role: 'Visualizer', icon: Grid, color: 'indigo', accent: '#818cf8', bgEffect: 'grid' },
    [View.UNIVERSAL_BACKEND]: { core: 'Expression', name: 'GenUI Canvas', role: 'Architect', icon: Terminal, color: 'slate', accent: '#94a3b8', bgEffect: 'matrix' },
    [View.API_ZONE]: { core: 'Nexus', name: 'API Gateway', role: 'Connectivity', icon: Network, color: 'slate', accent: '#64748b', bgEffect: 'matrix' },
    [View.AUDIT]: { core: 'Nexus', name: 'Audit Chain', role: 'Ledger Keeper', icon: ShieldCheck, color: 'emerald', accent: '#10b981', bgEffect: 'grid' },
    [View.ALUMNI_ZONE]: { core: 'Nexus', name: 'Role Switcher', role: 'Context Manager', icon: Users, color: 'orange', accent: '#f97316', bgEffect: 'nebula' },
    [View.MY_ESG]: { core: 'Nexus', name: 'Personal Steward', role: 'Assistant', icon: Bot, color: 'purple', accent: '#8b5cf6', bgEffect: 'nebula' },
};

// suggestions with intent labels
const SUGGESTIONS_MAP: Partial<Record<View, { text: string; intent: string }[]>> = {
    [View.MY_ESG]: [
        { text: "Summarize my ESG progress", intent: "Memory" },
        { text: "Check pending quests", intent: "Nexus" },
        { text: "What's my next goal?", intent: "Cognition" }
    ],
    [View.DASHBOARD]: [
        { text: "Analyze emission anomalies", intent: "Cognition" },
        { text: "Predict Q4 performance", intent: "Cognition" },
        { text: "Explain chart trends", intent: "Expression" }
    ],
    [View.CARBON]: [
        { text: "Audit Scope 1 inventory", intent: "Perception" },
        { text: "Calculate Scope 3 impact", intent: "Cognition" },
        { text: "Match emission factors", intent: "Memory" }
    ],
    [View.STRATEGY]: [
        { text: "Simulate risk debate", intent: "Cognition" },
        { text: "Generate risk heatmap", intent: "Expression" },
        { text: "Stakeholder engagement audit", intent: "Perception" }
    ],
    [View.REPORT]: [
        { text: "Draft CEO Letter draft", intent: "Expression" },
        { text: "Audit current draft", intent: "Nexus" },
        { text: "Check GRI compliance", intent: "Perception" }
    ],
    [View.FINANCE]: [
        { text: "Simulate carbon tax hit", intent: "Cognition" },
        { text: "Predict project ROI", intent: "Cognition" },
        { text: "Optimize green budget", intent: "Memory" }
    ]
};

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp?: number;
    feedback?: 'good' | 'bad';
    attachments?: { type: string; name: string; data?: string }[];
}

const ModeBackground: React.FC<{ effect: string; color: string }> = React.memo(({ effect, color }) => {
    if (effect === 'matrix') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/20 animate-pulse" />
            </div>
        );
    }
    if (effect === 'grid') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 transition-opacity duration-1000">
                <div className={`absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.2)_1px,transparent_1px),linear-gradient(60deg,rgba(251,191,36,0.2)_1px,transparent_1px)] bg-[size:40px_40px]`} />
            </div>
        );
    }
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-20 -left-20 w-64 h-64 bg-${color}-500/10 rounded-full blur-[80px] animate-blob`} />
            <div className={`absolute top-1/2 -right-20 w-64 h-64 bg-${color}-400/10 rounded-full blur-[80px] animate-blob animation-delay-2000`} />
        </div>
    );
});

export const UniversalAgent: React.FC<UniversalAgentProps> = ({ language, onNavigate, currentView }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { 
    addLog, agentMode, switchMode, systemLogs, activeAgentProfile, awardSkillXp, 
    suggestedMode, confirmSuggestion, dismissSuggestion, customAgents, selectCustomAgent, activeCustomAgentId,
    processUniversalInput
  } = useUniversalAgent(); 
  const { carbonData, esgScores, budget, carbonCredits, auditLogs } = useCompany();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [neuralCommand, setNeuralCommand] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{ file: File; base64: string } | null>(null);
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);

  const [historyCache, setHistoryCache] = useState<Record<string, Message[]>>(() => {
      try {
          const saved = localStorage.getItem('esgss_ai_history');
          return saved ? JSON.parse(saved) : {};
      } catch (e) { return {}; }
  });

  const [isThinking, setIsThinking] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false); 

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollLogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<any>(null);
  const client = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  useEffect(() => {
      localStorage.setItem('esgss_ai_history', JSON.stringify(historyCache));
  }, [historyCache]);

  const historyKey = `${currentView}-${agentMode}-${activeCustomAgentId || 'default'}`;
  const messages = historyCache[historyKey] || [];

  const updateHistory = useCallback((newMessages: Message[]) => {
      setHistoryCache(prev => ({ ...prev, [historyKey]: newMessages }));
  }, [historyKey]);

  const initialX = typeof window !== 'undefined' ? window.innerWidth - 80 : 0;
  const initialY = typeof window !== 'undefined' ? window.innerHeight - 100 : 0;
  
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'button' | 'window'>('button');
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startElPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
      if (typeof window !== 'undefined') {
          setWindowPosition({ x: window.innerWidth - 410, y: 80 });
          setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
      }
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, target: 'button' | 'window') => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragStartPos.current = { x: clientX, y: clientY };
      const currentPos = target === 'button' ? position : windowPosition;
      startElPos.current = { x: currentPos.x, y: currentPos.y };
      setDragTarget(target);
      setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - dragStartPos.current.x;
      const deltaY = clientY - dragStartPos.current.y;
      
      let newX = startElPos.current.x + deltaX;
      let newY = startElPos.current.y + deltaY;
      
      const width = dragTarget === 'button' ? 60 : 384; 
      const height = dragTarget === 'button' ? 60 : 600;
      
      newX = Math.max(0, Math.min(window.innerWidth - width, newX));
      newY = Math.max(20, Math.min(window.innerHeight - height - 80, newY));
      
      if (dragTarget === 'button') setPosition({ x: newX, y: newY });
      else setWindowPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => setIsDragging(false);

  const activePersona = useMemo(() => {
      if (agentMode === 'custom' || currentView === View.UNIVERSAL_AGENT) {
          return {
              core: 'Nexus',
              name: activeAgentProfile.name,
              role: activeAgentProfile.role,
              icon: activeAgentProfile.icon,
              color: activeAgentProfile.color,
              accent: activeAgentProfile.color === 'emerald' ? '#10b981' : activeAgentProfile.color === 'gold' ? '#fbbf24' : '#8b5cf6',
              bgEffect: agentMode === 'phantom' ? 'matrix' : agentMode === 'captain' ? 'grid' : 'nebula'
          } as AgentPersona;
      }
      return AVATAR_MATRIX[currentView] || AVATAR_MATRIX[View.MY_ESG]!;
  }, [currentView, activeAgentProfile, agentMode]);

  useEffect(() => {
      setIsSwitching(true);
      const timer = setTimeout(() => setIsSwitching(false), 1200); 
      return () => clearTimeout(timer);
  }, [activePersona.name, agentMode]);

  const classifySuggestion = (text: string, intent?: string) => {
      const lower = text.toLowerCase();
      if (intent === 'Perception' || lower.match(/scan|search|find|read|check|monitor|debug|audit/)) {
          return { core: 'Perception', icon: Eye, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' };
      }
      if (intent === 'Cognition' || lower.match(/analyze|calculate|simulate|risk|predict|why|improve|forecast/)) {
          return { core: 'Cognition', icon: BrainCircuit, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
      }
      if (intent === 'Expression' || lower.match(/draft|write|generate|report|summarize|tell|explain/)) {
          return { core: 'Expression', icon: FileText, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' };
      }
      if (intent === 'Memory' || lower.match(/remember|history|log|archive|recall|save|store/)) {
          return { core: 'Memory', icon: Database, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' };
      }
      return { core: 'Nexus', icon: Network, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
  };

  const activeSuggestions = useMemo(() => {
      let suggestions = SUGGESTIONS_MAP[currentView] || [
          { text: "Show help", intent: "Nexus" }, 
          { text: "Analyze current state", intent: "Cognition" }
      ];

      // Proactive additions based on state
      if (systemLogs.some(l => l.type === 'error')) {
          suggestions.unshift({ text: "Debug system integrity", intent: "Perception" });
      }
      if (esgScores.environmental < 70) {
          suggestions.unshift({ text: "Find environmental gaps", intent: "Perception" });
      }
      if (budget < 50000) {
          suggestions.unshift({ text: "Identify cost savings", intent: "Cognition" });
      }
      if (auditLogs.length > 5) {
          suggestions.unshift({ text: "Verify last actions", intent: "Nexus" });
      }
      
      if (agentMode === 'phantom') {
          suggestions = [
              { text: "/kernel status", intent: "Nexus" },
              { text: "/monitor active", intent: "Perception" },
              { text: "/flush cache", intent: "Nexus" }
          ];
      }

      // De-duplicate and slice
      return suggestions.filter((v, i, a) => a.findIndex(t => t.text === v.text) === i).slice(0, 6);
  }, [currentView, esgScores, budget, auditLogs, systemLogs, agentMode]);

  useEffect(() => {
      const knowledge = activeAgentProfile.knowledgeBase ? `[KNOWLEDGE]: ${activeAgentProfile.knowledgeBase.join(', ')}` : '';
      const systemContext = `
          [IDENTITY]: You are "${activePersona.name}", ${activePersona.role}.
          [INSTRUCTION]: ${activeAgentProfile.instruction}
          [CONTEXT]: View=${currentView}, Lang=${language}, Mode=${agentMode}.
          ${knowledge}
          [CAPABILITIES]: Output JSON_UI for charts or forms. Be concise.
      `;
      try {
          chatRef.current = client.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction: systemContext },
              history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
          });
      } catch (e) { console.error(e); }
  }, [currentView, agentMode, activeAgentProfile, language]);

  const handleSend = async (overrideText?: string) => {
    const userMessage = overrideText || input;
    if ((!userMessage.trim() && !attachedFile) || isThinking) return;

    if (!overrideText) {
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto'; 
    }
    
    const newMessage: Message = { 
        id: Date.now().toString(), 
        role: 'user', 
        text: userMessage, 
        timestamp: Date.now(),
        attachments: attachedFile ? [{ type: attachedFile.file.type, name: attachedFile.file.name }] : undefined
    };
    
    const updatedMessages = [...messages, newMessage];
    updateHistory(updatedMessages);
    setIsThinking(true);

    try {
        let messagePayload: any = userMessage;
        if (attachedFile) {
            messagePayload = [
                { inlineData: { mimeType: attachedFile.file.type, data: attachedFile.base64 } },
                { text: userMessage || "Analyze file." }
            ];
            setAttachedFile(null);
        }
        const result = await chatRef.current.sendMessage(messagePayload);
        const botMessage: Message = { id: Date.now().toString(), role: 'model', text: result.text || "Processed.", timestamp: Date.now() };
        updateHistory([...updatedMessages, botMessage]);
    } catch (error) {
      addToast('error', 'Link Interrupted', 'AI Error');
    } finally {
      setIsThinking(false);
    }
  };

  const handleNeuralCommand = (e: React.FormEvent) => {
      e.preventDefault();
      if (!neuralCommand.trim()) return;
      processUniversalInput(neuralCommand, currentView);
      setNeuralCommand('');
      addToast('info', isZh ? '正在處理指令...' : 'Processing neural command...', 'Neural Link');
  };

  const handleScrollSuggestions = (direction: 'left' | 'right') => {
      if (suggestionsScrollRef.current) {
          const amount = direction === 'left' ? -200 : 200;
          suggestionsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      }
  };

  const getThemeClasses = () => {
      if (agentMode === 'phantom') return { bg: 'bg-black/95', border: 'border-emerald-500/50', text: 'text-emerald-400', button: 'bg-emerald-600', glow: 'shadow-emerald-500/20' };
      if (agentMode === 'captain') return { bg: 'bg-slate-900/95', border: 'border-amber-500/50', text: 'text-amber-400', button: 'bg-amber-600', glow: 'shadow-amber-500/20' };
      if (agentMode === 'custom') return { bg: 'bg-slate-900/95', border: `border-${activeAgentProfile.color}-500/50`, text: `text-${activeAgentProfile.color}-400`, button: `bg-${activeAgentProfile.color}-600`, glow: `shadow-${activeAgentProfile.color}-500/20` };
      return { bg: 'bg-slate-900/95', border: 'border-celestial-purple/30', text: 'text-celestial-purple', button: 'bg-celestial-purple', glow: 'shadow-purple-500/20' };
  };

  const theme = getThemeClasses();
  const ModeIcon = activePersona.icon;

  if (!isOpen) {
    return (
      <div
          onMouseDown={(e) => handleDragStart(e, 'button')}
          onTouchStart={(e) => handleDragStart(e, 'button')}
          onClick={(e) => { if (!isDragging) setIsOpen(true); }}
          style={{ left: position.x, top: position.y }}
          className={`fixed z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-move touch-none select-none
              ${theme.button} text-white border-2 border-white/20 ${theme.glow}
              ${isVoiceActive ? 'animate-pulse ring-4 ring-white/30' : 'animate-bounce-slow'}
          `}
      >
          <ModeIcon className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div 
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        className={`fixed z-[9999] w-full md:w-[400px] h-[85vh] md:h-[650px] backdrop-blur-xl border-2 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in ring-1 ring-white/10 transition-all duration-500
            ${theme.bg} ${theme.border}
            ${typeof window !== 'undefined' && window.innerWidth >= 768 ? '' : 'bottom-0 right-0'}
        `}
        style={typeof window !== 'undefined' && window.innerWidth >= 768 ? { left: windowPosition.x, top: windowPosition.y } : {}}
    >
      <ModeBackground effect={activePersona.bgEffect} color={activePersona.color} />

      <div onMouseDown={(e) => handleDragStart(e, 'window')} className={`p-4 border-b ${theme.border} bg-white/5 flex justify-between items-center shrink-0 cursor-move relative z-10`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/10 border ${theme.border}`}>
                <ModeIcon className={`w-5 h-5 ${theme.text}`} />
            </div>
            <div>
                <span className="font-bold text-white text-sm block">{activePersona.name}</span>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${theme.button} animate-pulse`} />
                    <span className="text-[9px] uppercase tracking-tighter text-gray-400">{agentMode} mode</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2" onMouseDown={e => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <div className={`px-4 py-2 border-b ${theme.border} bg-black/20 shrink-0 z-10`}>
          <form onSubmit={handleNeuralCommand} className="relative group">
              <Command className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 group-focus-within:text-white transition-colors" />
              <input 
                  type="text"
                  value={neuralCommand}
                  onChange={(e) => setNeuralCommand(e.target.value)}
                  placeholder={isZh ? "神經指令 (如：/note 摘要)..." : "Neural Command (/note...)"}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-[10px] text-gray-300 font-mono focus:outline-none focus:border-white/20 focus:text-white transition-all"
              />
          </form>
      </div>

      {isSwitching && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
              <div className="relative mb-6">
                <Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} />
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-celestial-gold animate-pulse" />
              </div>
              <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-mono text-white tracking-[0.2em] uppercase">Recalibrating Neural Core</span>
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${theme.button} animate-[width_1.2s_ease-in-out_infinite] w-0`} />
                  </div>
              </div>
          </div>
      )}

      <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10 ${agentMode === 'phantom' ? 'font-mono text-[10px]' : ''}`} ref={scrollLogRef}>
        <div className="space-y-4">
            {messages.length === 0 && (
                <div className="text-center py-10 px-4 animate-fade-in">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border ${theme.border} flex items-center justify-center`}>
                        <Sparkles className={`w-8 h-8 ${theme.text} animate-pulse`} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Neural Connection Established</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        I am analyzing the current <strong>{currentView}</strong> environment. 
                        Select an actionable insight from the logic deck below to begin.
                    </p>
                </div>
            )}
            {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? `${theme.button} text-white rounded-br-none` : 'bg-white/5 text-gray-100 rounded-bl-none border border-white/5'}`}>
                        <GenerativeUIRenderer content={msg.text} onSendMessage={handleSend} />
                    </div>
                </div>
            ))}
            {isThinking && <div className="flex justify-start"><Loader2 className={`w-4 h-4 animate-spin ${theme.text}`} /></div>}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* OVERHAULED: Multi-Dimensional Cognitive Insight Deck */}
      <div className="flex flex-col shrink-0 bg-slate-900/60 backdrop-blur-2xl border-t border-white/10 relative z-10 group/suggestions shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <Cpu className={`w-3.5 h-3.5 ${theme.text} animate-pulse`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.text} opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]`}>
                      {isZh ? '認知洞察矩陣' : 'Cognitive Insight Deck'}
                  </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-bold text-emerald-400">
                  <Activity className="w-2 h-2" /> 
                  PROACTIVE
              </div>
          </div>

          <div className="relative flex items-center group/suggestions p-2">
              <button 
                onClick={() => handleScrollSuggestions('left')}
                className="absolute left-1 z-20 p-1.5 bg-slate-900/90 hover:bg-slate-800 text-gray-400 rounded-full border border-white/10 shadow-xl opacity-0 group-hover/suggestions:opacity-100 transition-opacity"
              >
                  <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div 
                ref={suggestionsScrollRef}
                className="px-2 pb-2 pt-1 flex gap-3 overflow-x-auto no-scrollbar mask-linear-fade scroll-smooth w-full"
              >
                  {activeSuggestions.map((suggestion, idx) => {
                      const visuals = classifySuggestion(suggestion.text, suggestion.intent);
                      const CoreIcon = visuals.icon;
                      return (
                      <button 
                        key={idx}
                        onClick={() => handleSend(suggestion.text)}
                        className={`
                            flex flex-col items-start p-3 rounded-2xl border transition-all min-w-[170px] max-w-[210px] gap-2 group/btn relative overflow-hidden shrink-0 
                            bg-slate-900/40 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-2xl
                            ${visuals.border} hover:border-opacity-100
                        `}
                      >
                          {/* Card Header */}
                          <div className="flex justify-between items-center w-full mb-1">
                              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-tighter font-bold ${visuals.color} bg-white/5 border border-white/5`}>
                                  <CoreIcon className="w-2.5 h-2.5" />
                                  {suggestion.intent || visuals.core}
                              </div>
                              <ArrowRight className="w-3 h-3 text-gray-600 group-hover/btn:text-white transition-colors" />
                          </div>

                          {/* Suggestion Text */}
                          <span className="text-[12px] text-left font-bold text-gray-200 group-hover/btn:text-white leading-tight w-full line-clamp-2">
                              {suggestion.text}
                          </span>

                          {/* Insight Label (Small context hint) */}
                          <div className="flex items-center gap-1 text-[8px] text-gray-500 font-mono mt-1 opacity-60 group-hover/btn:opacity-100">
                             <Target className="w-2 h-2" />
                             <span>{suggestion.intent === 'Cognition' ? 'Strategic Path' : 'Actionable Data'}</span>
                          </div>

                          {/* Subtle background glow */}
                          <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-full blur-xl transition-opacity opacity-20 group-hover/btn:opacity-40 ${visuals.bg.replace('/10', '/50')}`} />
                      </button>
                  )})}
              </div>

              <button 
                onClick={() => handleScrollSuggestions('right')}
                className="absolute right-1 z-20 p-1.5 bg-slate-900/90 hover:bg-slate-800 text-gray-400 rounded-full border border-white/10 shadow-xl opacity-0 group-hover/suggestions:opacity-100 transition-opacity"
              >
                  <ChevronRight className="w-4 h-4" />
              </button>
          </div>
      </div>

      {suggestedMode && (
          <div className="mx-4 mb-2 p-3 bg-gradient-to-r from-celestial-purple/20 to-indigo-600/20 border border-celestial-purple/30 rounded-xl flex items-center justify-between animate-ai-pulse shrink-0 z-10 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-celestial-purple" />
                <span className="text-[10px] text-white font-bold uppercase tracking-tight">Suggest Mode: {suggestedMode.toUpperCase()}</span>
              </div>
              <div className="flex gap-1.5">
                  <button onClick={confirmSuggestion} className="px-3 py-1 bg-celestial-purple text-white text-[10px] font-bold rounded-lg hover:bg-purple-500 transition-colors">Confirm</button>
                  <button onClick={dismissSuggestion} className="p-1 hover:bg-white/10 rounded-lg text-gray-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
              </div>
          </div>
      )}

      <div className="flex gap-2 px-4 py-2 border-t border-white/5 bg-black/20 overflow-x-auto no-scrollbar shrink-0 z-10">
          {[
              { id: 'companion', icon: Bot },
              { id: 'captain', icon: Shield },
              { id: 'phantom', icon: Terminal }
          ].map(m => (
              <button 
                key={m.id} 
                onClick={() => switchMode(m.id as any)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase border transition-all flex items-center gap-2
                    ${agentMode === m.id 
                        ? 'bg-white/10 text-white border-white/30 shadow-inner' 
                        : 'text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'}`}
              >
                  <m.icon className="w-3 h-3" />
                  {m.id}
              </button>
          ))}
          {customAgents.length > 0 && <div className="w-px h-4 bg-white/10 mx-1" />}
          {customAgents.map(a => (
              <button 
                key={a.id} 
                onClick={() => selectCustomAgent(a.id)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase border flex items-center gap-1 transition-all ${activeCustomAgentId === a.id ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'text-gray-500 border-transparent hover:text-pink-400/70'}`}
              >
                  <User className="w-2.5 h-2.5" /> {a.name}
              </button>
          ))}
      </div>

      <div className={`p-4 border-t ${theme.border} bg-white/5 shrink-0 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]`}>
         <div className="flex gap-2 items-end">
            <textarea 
                ref={textareaRef}
                value={input} 
                onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isZh ? "詢問智能代理..." : "Ask agent..."}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none max-h-32 focus:border-white/30 transition-all custom-scrollbar"
                rows={1}
            />
            <button onClick={() => handleSend()} disabled={isThinking} className={`p-3 rounded-xl ${theme.button} text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50`}><Send className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
};
