
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Send, Bot, X, Sparkles, Minimize2, Loader2, Terminal, Grid, 
    BrainCircuit, Activity, Eye, Database, Share2, Network, 
    ShieldCheck, Zap, Layers, Leaf, Target, FileText, Briefcase, Globe, Users, GripVertical,
    ArrowRight, Lightbulb, Compass, Bell, CheckSquare, Copy, RotateCcw, ThumbsUp, ThumbsDown, Download, FileSpreadsheet, GripHorizontal,
    Trash2
} from 'lucide-react';
import { Language, View } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import GenerativeUIRenderer from './GenerativeUIRenderer';

interface AiAssistantProps {
  language: Language;
  onNavigate: (view: View) => void;
  currentView: View;
}

// ... (AVATAR_MATRIX and SUGGESTIONS_MAP remain defined locally as fallbacks or supplements) ...
// Re-declare for context
interface AgentPersona {
    core: 'Perception' | 'Cognition' | 'Memory' | 'Expression' | 'Nexus';
    name: string; 
    role: string; 
    icon: any;
    color: string; 
    accent: string; 
}

const AVATAR_MATRIX: Partial<Record<View, AgentPersona>> = {
    [View.RESEARCH_HUB]: { core: 'Perception', name: 'Spectral Scanner', role: 'Data Ingestion & OCR Specialist', icon: Eye, color: 'purple', accent: '#a855f7' },
    [View.INTEGRATION]: { core: 'Perception', name: 'Data Lake Sensor', role: 'IoT & ERP Signal Processor', icon: Network, color: 'blue', accent: '#3b82f6' },
    [View.BUSINESS_INTEL]: { core: 'Perception', name: 'Global Crawler', role: 'Competitive Intelligence Scout', icon: Globe, color: 'indigo', accent: '#6366f1' },
    [View.STRATEGY]: { core: 'Cognition', name: 'Strategy Oracle', role: 'Game Theory & Risk Analyst', icon: BrainCircuit, color: 'gold', accent: '#fbbf24' },
    [View.CARBON]: { core: 'Cognition', name: 'Carbon Calculator', role: 'GHG Protocol Auditor', icon: Leaf, color: 'emerald', accent: '#10b981' },
    [View.FINANCE]: { core: 'Cognition', name: 'ROI Simulator', role: 'Financial Projection Engine', icon: Activity, color: 'gold', accent: '#fbbf24' },
    [View.HEALTH_CHECK]: { core: 'Cognition', name: 'Health Diagnostician', role: 'Corporate Vitality Analyst', icon: Activity, color: 'rose', accent: '#f43f5e' },
    [View.RESTORATION]: { core: 'Memory', name: 'Asset Vault', role: 'Knowledge Archivist', icon: Database, color: 'cyan', accent: '#06b6d4' },
    [View.CARD_GAME_ARENA]: { core: 'Memory', name: 'Asset Vault', role: 'Gamification Master', icon: Layers, color: 'cyan', accent: '#06b6d4' },
    [View.TALENT]: { core: 'Memory', name: 'Skill Galaxy', role: 'Talent Vector Mapper', icon: Sparkles, color: 'pink', accent: '#ec4899' },
    [View.REPORT]: { core: 'Expression', name: 'The Scribe', role: 'GRI/SASB Report Generator', icon: FileText, color: 'blue', accent: '#3b82f6' },
    [View.DASHBOARD]: { core: 'Expression', name: 'Omni-Cell', role: 'Data Visualization Specialist', icon: Grid, color: 'indigo', accent: '#818cf8' },
    [View.UNIVERSAL_BACKEND]: { core: 'Expression', name: 'GenUI Canvas', role: 'System Architect', icon: Terminal, color: 'slate', accent: '#94a3b8' },
    // UNIVERSAL_AGENT view logic is overridden by global context
    [View.API_ZONE]: { core: 'Nexus', name: 'API Gateway', role: 'Connectivity Manager', icon: Network, color: 'slate', accent: '#64748b' },
    [View.AUDIT]: { core: 'Nexus', name: 'Audit Chain', role: 'Immutable Ledger Keeper', icon: ShieldCheck, color: 'emerald', accent: '#10b981' },
    [View.ALUMNI_ZONE]: { core: 'Nexus', name: 'Role Switcher', role: 'Context Manager', icon: Users, color: 'orange', accent: '#f97316' },
    [View.MY_ESG]: { core: 'Nexus', name: 'Personal Steward', role: 'Assistant', icon: Bot, color: 'purple', accent: '#8b5cf6' },
};

const SUGGESTIONS_MAP: Partial<Record<View, string[]>> = {
    [View.MY_ESG]: ["Summarize my progress", "Show pending quests", "Check my ESG score"],
    [View.DASHBOARD]: ["Analyze emission trends", "Identify anomalies", "Forecast Q4 efficiency"],
    [View.CARBON]: ["Input fuel data", "Calculate Scope 3", "Simulate carbon price"],
    [View.STRATEGY]: ["Generate risk heatmap", "Start CSO/CFO debate", "Suggest climate strategy"],
    [View.REPORT]: ["Draft CEO Letter", "Audit compliance", "Export to PDF"],
    [View.INTEGRATION]: ["Check connection health", "Sync IoT data", "View API logs"],
    [View.RESEARCH_HUB]: ["Search regulations", "Explain CBAM", "Find competitor data"],
    [View.ACADEMY]: ["Recommend a course", "Start a quiz", "View my certificates"],
    [View.UNIVERSAL_AGENT]: ["System Status", "Run Diagnostics", "Show Evolution Plan"],
    [View.FINANCE]: ["ROI Analysis", "Budget Forecast", "Green Bond Info"],
    [View.TALENT]: ["Skill Gap Analysis", "Recommend Training", "Verify Certificates"],
    [View.AUDIT]: ["Verify latest hash", "Show audit trail", "Export logs"],
    [View.GOODWILL]: ["Check balance", "Buy card pack", "View history"],
    [View.YANG_BO]: ["Start simulation", "Read weekly report", "Listen to podcast"],
    [View.HEALTH_CHECK]: ["Run Full Check", "Compare with Industry", "Identify Gaps"],
    [View.BUSINESS_INTEL]: ["Scan Competitor", "Analyze Market Trend", "Generate Report"],
};

interface Message {
    role: 'user' | 'model';
    text: string;
    timestamp?: number;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const isZh = language === 'zh-TW';
  const { addToast, notifications } = useToast();
  // Get active profile from context
  const { addLog, agentMode, systemLogs, activeAgentProfile } = useUniversalAgent(); 
  const { quests, tier } = useCompany();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // History State
  const [historyCache, setHistoryCache] = useState<Record<string, Message[]>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollLogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatRef = useRef<any>(null); // Holds the ChatSession
  const client = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  // --- DRAG LOGIC ---
  const initialX = typeof window !== 'undefined' ? window.innerWidth - 80 : 0;
  const initialY = typeof window !== 'undefined' ? window.innerHeight - 160 : 0;
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'button' | 'window'>('button');
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startElPos = useRef({ x: 0, y: 0 });
  const dragThreshold = 5;

  useEffect(() => {
      if (typeof window !== 'undefined') {
          setWindowPosition({ 
              x: window.innerWidth - 400, 
              y: 80 
          });
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
      const minY = dragTarget === 'window' ? 80 : 0; 
      newY = Math.max(minY, Math.min(window.innerHeight - height, newY));
      
      if (dragTarget === 'button') {
          setPosition({ x: newX, y: newY });
      } else {
          setWindowPosition({ x: newX, y: newY });
      }
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      
      if (dragTarget === 'button') {
          const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
          const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
          const dist = Math.sqrt(Math.pow(clientX - dragStartPos.current.x, 2) + Math.pow(clientY - dragStartPos.current.y, 2));
          if (dist < dragThreshold && !isOpen) {
              setIsOpen(true);
          }
      }
  };

  // 1. Determine Current Avatar Persona (Prioritize Global Context Mode)
  const activePersona = useMemo(() => {
      // If we are in the Universal Agent Zone, strictly follow the Global Mode
      if (currentView === View.UNIVERSAL_AGENT) {
          return {
              core: 'Nexus',
              name: activeAgentProfile.name,
              role: activeAgentProfile.role,
              icon: activeAgentProfile.icon,
              color: activeAgentProfile.color,
              accent: '#8b5cf6' // Generic fallback, visual theme handles rest
          };
      }
      // Otherwise, use view-specific personas
      return AVATAR_MATRIX[currentView] || AVATAR_MATRIX[View.MY_ESG]!;
  }, [currentView, activeAgentProfile]);

  // 2. Generate Context-Aware Suggestions
  const activeSuggestions = useMemo(() => {
      let suggestions = [];
      
      if (currentView === View.UNIVERSAL_AGENT) {
          if (agentMode === 'phantom') suggestions = ["tail -f system.log", "status report", "optimize kernel"];
          else if (agentMode === 'captain') suggestions = ["Strategic Overview", "Risk Assessment", "Market Scan"];
          else suggestions = ["System Status", "Run Diagnostics", "Show Evolution Plan"];
      } else {
          suggestions = SUGGESTIONS_MAP[currentView] || ["What can you do?", "Help me get started", "System status"];
      }

      if (messages.length > 2) {
          suggestions = ["Summarize discussion", "Create action items", ...suggestions];
      }

      const unreadAlerts = notifications.length;
      if (unreadAlerts > 0 && !suggestions.some(s => s.includes('Alerts'))) {
          suggestions.unshift(`Check ${unreadAlerts} Alerts`);
      }

      const activeQuests = quests.filter(q => q.status === 'active').slice(0, 1);
      if (activeQuests.length > 0 && currentView === View.MY_ESG) {
          suggestions.push(`Quest: ${activeQuests[0].title}`);
      }

      return Array.from(new Set(suggestions)).slice(0, 5);
  }, [currentView, agentMode, messages.length, activePersona, notifications.length, quests]);

  // 3. Load History & Initialize Chat Session on Persona Change
  useEffect(() => {
      const historyKey = `${currentView}-${agentMode}`; // Distinct history per mode/view combination
      const savedMessages = historyCache[historyKey] || [];
      
      setMessages(savedMessages);

      const systemContext = `
          [SYSTEM IDENTITY]
          You are "${activePersona.name}", a specialized AI agent within the ESGss Platform.
          Role: ${activePersona.role}
          [CURRENT CONTEXT] User View: ${currentView}. Language: ${language}.
          [INSTRUCTION] ${activeAgentProfile?.instruction || 'Be helpful.'}
          ${currentView === View.UNIVERSAL_AGENT ? `Current Interaction Mode: ${agentMode.toUpperCase()}.` : ''}
      `;

      const historyContent = savedMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));

      try {
          chatRef.current = client.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction: systemContext },
              history: historyContent
          });
      } catch (e) {
          console.error("Failed to restore chat history context:", e);
          chatRef.current = null;
      }

  }, [currentView, agentMode, activeAgentProfile]); // Re-init when mode changes

  // Scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
      if (currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' && scrollLogRef.current) {
          scrollLogRef.current.scrollTop = scrollLogRef.current.scrollHeight;
      }
  }, [systemLogs, agentMode, currentView]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const handleSend = async (overrideText?: string) => {
    const userMessage = overrideText || input;
    if (!userMessage.trim() || isThinking) return;

    if (!overrideText) {
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto'; 
    }
    
    // Special Mode: Phantom Command Line logic (Visual only here, real logic in context)
    if (currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom') {
        addLog(`COMMAND > ${userMessage}`, 'info', 'Phantom');
        // Let normal chat process proceed for response generation too
    }

    const newMessage: Message = { role: 'user', text: userMessage, timestamp: Date.now() };
    const updatedMessages = [...messages, newMessage];
    
    setMessages(updatedMessages);
    const historyKey = `${currentView}-${agentMode}`;
    setHistoryCache(prev => ({ ...prev, [historyKey]: updatedMessages }));

    setIsThinking(true);

    try {
        if (!chatRef.current) {
             const systemContext = `You are ${activePersona.name}. Context: ${currentView}.`;
             chatRef.current = client.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: systemContext }
            });
        }

        const result = await chatRef.current.sendMessage({ message: userMessage });
        const responseText = result.text || "I have acknowledged your request.";
        
        const botMessage: Message = { role: 'model', text: responseText, timestamp: Date.now() };
        const finalMessages = [...updatedMessages, botMessage];
        
        setMessages(finalMessages);
        setHistoryCache(prev => ({ ...prev, [historyKey]: finalMessages }));
        
        addLog(`[${activePersona.name}] Response generated.`, 'info', 'Assistant');

    } catch (error) {
      console.error("Chat Error:", error);
      addToast('error', 'Neural Link Interrupted', 'AI Error');
      const errorMessage: Message = { role: 'model', text: "I encountered a disturbance in the neural core. Please try again.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMessage]);
      chatRef.current = null;
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearHistory = () => {
      const historyKey = `${currentView}-${agentMode}`;
      setMessages([]);
      setHistoryCache(prev => {
          const next = { ...prev };
          delete next[historyKey];
          return next;
      });
      chatRef.current = null;
      addToast('info', isZh ? '對話紀錄已清除' : 'Conversation cleared', 'Memory Purge');
  };

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      addToast('success', 'Copied to clipboard', 'System');
  };

  const handleRegenerate = () => {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) handleSend(lastUserMsg.text);
  };

  const handleExportChat = () => {
      const chatText = messages.map(m => `[${m.role.toUpperCase()}] ${new Date(m.timestamp || Date.now()).toLocaleTimeString()}: ${m.text}`).join('\n\n');
      const blob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat_export_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('success', 'Chat exported', 'System');
  };

  const getThemeClasses = () => {
      const c = activePersona.color;
      // Handle Custom color mapping (simplistic)
      if (c === 'pink') return { bg: 'bg-pink-900/20', border: 'border-pink-500/30', text: 'text-pink-400', button: 'bg-pink-500 hover:bg-pink-400' };
      if (c === 'emerald') return { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400', button: 'bg-emerald-500 hover:bg-emerald-400' };
      if (c === 'gold') return { bg: 'bg-amber-900/20', border: 'border-amber-500/30', text: 'text-amber-400', button: 'bg-amber-500 hover:bg-amber-400' };
      if (c === 'blue') return { bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-400', button: 'bg-blue-500 hover:bg-blue-400' };
      if (c === 'purple') return { bg: 'bg-purple-900/20', border: 'border-purple-500/30', text: 'text-purple-400', button: 'bg-celestial-purple hover:bg-purple-400' };
      if (c === 'rose') return { bg: 'bg-rose-900/20', border: 'border-rose-500/30', text: 'text-rose-400', button: 'bg-rose-500 hover:bg-rose-400' };
      if (c === 'cyan') return { bg: 'bg-cyan-900/20', border: 'border-cyan-500/30', text: 'text-cyan-400', button: 'bg-cyan-500 hover:bg-cyan-400' };
      if (c === 'orange') return { bg: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-400', button: 'bg-orange-500 hover:bg-orange-400' };
      if (c === 'indigo') return { bg: 'bg-indigo-900/20', border: 'border-indigo-500/30', text: 'text-indigo-400', button: 'bg-indigo-500 hover:bg-indigo-400' };
      return { bg: 'bg-slate-900/20', border: 'border-white/10', text: 'text-gray-200', button: 'bg-white/10 hover:bg-white/20' };
  };

  const theme = getThemeClasses();
  const ModeIcon = activePersona.icon;

  if (!isOpen) {
    return (
      <div
        onMouseDown={(e) => handleDragStart(e, 'button')}
        onTouchStart={(e) => handleDragStart(e, 'button')}
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        style={{ left: position.x, top: position.y }}
        className={`fixed z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 cursor-move animate-bounce-slow
            ${theme.button} text-white border border-white/20 shadow-lg touch-none select-none`}
      >
        <ModeIcon className="w-7 h-7 pointer-events-none" />
      </div>
    );
  }

  return (
    <div 
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        className={`fixed z-[9999] w-full md:w-96 h-full md:h-[600px] md:max-h-[calc(100vh-100px)] backdrop-blur-xl border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in ring-1 ring-white/10 transition-all duration-300 bg-slate-900/95 ${theme.border}
            ${typeof window !== 'undefined' && window.innerWidth >= 768 ? '' : 'bottom-0 right-0 rounded-b-none'}
        `}
        style={
            typeof window !== 'undefined' && window.innerWidth >= 768 
            ? { left: windowPosition.x, top: windowPosition.y } 
            : {}
        }
    >
      
      {/* Header */}
      <div 
        onMouseDown={(e) => handleDragStart(e, 'window')}
        onTouchStart={(e) => handleDragStart(e, 'window')}
        className={`p-4 border-b ${theme.border} bg-white/5 flex justify-between items-center shrink-0 cursor-move touch-none select-none`}
      >
        <div className="flex items-center gap-3 pointer-events-none">
            <div className={`p-2 rounded-lg bg-white/5 ${theme.text} border border-white/10`}>
                <ModeIcon className="w-5 h-5" />
            </div>
            <div>
                <span className="font-bold text-white text-sm block tracking-tight">{activePersona.name}</span>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.button}`} />
                    <span className={`text-[10px] uppercase tracking-wider font-bold opacity-70 ${theme.text}`}>
                        {activePersona.core} Core
                    </span>
                </div>
            </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
            <div className="md:hidden flex items-center mr-2 text-gray-500">
                <GripHorizontal className="w-4 h-4 opacity-50" />
            </div>
            <button onClick={handleClearHistory} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors" title={isZh ? "清除對話" : "Clear Conversation"}>
                <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={handleExportChat} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" title="Export Chat">
                <Download className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/20 ${currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? 'font-mono text-xs' : ''}`} ref={scrollLogRef}>
        
        {/* Special Case: Phantom Mode in Universal Agent Zone */}
        {currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? (
            <div className="space-y-1">
                {systemLogs.slice(-20).map((log) => (
                    <div key={log.id} className="flex gap-2 text-gray-300 break-all">
                        <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`${log.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>{log.source}:</span>
                        <span>{log.message}</span>
                    </div>
                ))}
                <div className="animate-pulse text-emerald-500">_</div>
            </div>
        ) : (
            /* Standard Chat for All Other Personas */
            <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-12 text-sm px-4">
                        <ModeIcon className={`w-12 h-12 mx-auto mb-4 opacity-20 ${theme.text}`} />
                        <p className="font-bold text-gray-300 mb-1">{isZh ? '我是您的專屬智能代理。' : `I am ${activePersona.name}.`}</p>
                        <p className="text-xs">{activePersona.role}</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? `${theme.button} text-white rounded-br-none shadow-md` 
                                : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                            }`}>
                                {msg.role === 'model' ? (
                                    <GenerativeUIRenderer content={msg.text} />
                                ) : (
                                    msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)
                                )}
                            </div>
                        </div>
                        {msg.role === 'model' && (
                            <div className="flex items-center gap-1 ml-2 opacity-50 hover:opacity-100 transition-opacity">
                                <button onClick={() => handleCopy(msg.text)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Copy">
                                    <Copy className="w-3 h-3" />
                                </button>
                                <button onClick={handleRegenerate} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Regenerate">
                                    <RotateCcw className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl rounded-bl-none p-3 border border-white/5 flex items-center gap-2">
                            <Loader2 className={`w-4 h-4 animate-spin ${theme.text}`} />
                            <span className="text-xs text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        )}
      </div>

      {/* Suggestions Area */}
      {!(currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom') && (
          <div className="flex flex-col shrink-0 bg-slate-950/50 backdrop-blur-md border-t border-white/5 transition-all duration-300">
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className={`p-1 rounded bg-white/5`}>
                          <Compass className={`w-3 h-3 ${theme.text}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} opacity-90`}>
                          {isZh ? 'AI 預知建議' : 'AI Precognition'}
                      </span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                      CTX: {currentView}
                  </span>
              </div>

              <div className="px-4 pb-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade">
                  {activeSuggestions.map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className={`
                            whitespace-nowrap px-3 py-2 rounded-xl text-xs border transition-all flex items-center gap-2 group relative overflow-hidden
                            ${theme.border} bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white
                        `}
                      >
                          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-white/10 to-transparent transition-opacity`} />
                          <span className="relative z-10">{suggestion}</span>
                          <ArrowRight className={`w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ${theme.text} relative z-10`} />
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* Input Area */}
      <div className={`p-4 border-t bg-white/5 ${theme.border} shrink-0`}>
         <div className="flex gap-2 items-end">
            <textarea 
                ref={textareaRef}
                value={input} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                    currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? "Enter system command..." : 
                    isZh ? `詢問 ${activePersona.name}...` : `Ask ${activePersona.name}...`
                }
                className={`flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none transition-colors resize-none max-h-32 custom-scrollbar focus:border-opacity-50 focus:border-white
                    ${currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? 'font-mono text-emerald-400' : ''}
                `}
                rows={1}
            />
            <button 
                onClick={() => handleSend()} 
                disabled={isThinking || !input.trim()}
                className={`p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 ${theme.button} text-white shadow-lg`}
            >
                {currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? <Terminal className="w-5 h-5"/> : <Send className="w-5 h-5"/>}
            </button>
        </div>
      </div>
    </div>
  );
};
