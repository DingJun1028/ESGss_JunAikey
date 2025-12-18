
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Send, Bot, X, Sparkles, Minimize2, Loader2, Terminal, Grid, 
    BrainCircuit, Activity, Eye, Database, Share2, Network, 
    ShieldCheck, Zap, Layers, Leaf, Target, FileText, Briefcase, Globe, Users, GripVertical,
    ArrowRight, Lightbulb, Compass, Bell, CheckSquare, Copy, RotateCcw, ThumbsUp, ThumbsDown, Download, FileSpreadsheet, GripHorizontal,
    Trash2, Mic, Camera, Calculator, ScanLine, Cpu, Save, Paperclip, ArrowLeft, Plus, MessageSquarePlus, Eraser
} from 'lucide-react';
import { Language, View } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { GenerativeUIRenderer } from './GenerativeUIRenderer';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface AiAssistantProps {
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

const SUGGESTIONS_MAP: Partial<Record<View, string[]>> = {
    [View.MY_ESG]: ["Summarize my progress", "Show pending quests", "Check my ESG score"],
    [View.DASHBOARD]: ["Analyze emission trends", "Identify anomalies", "Forecast Q4 efficiency"],
    [View.CARBON]: ["Analyze Scope 1 & 2 Trends", "Input fuel data", "Calculate Scope 3"],
    [View.STRATEGY]: ["Analyze Risk Trends", "Generate risk heatmap", "Start CSO/CFO debate"],
    [View.REPORT]: ["Draft CEO Letter", "Audit compliance", "Export to PDF"],
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 transition-all duration-1000">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/20 animate-pulse" />
            </div>
        );
    }
    if (effect === 'grid') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 transition-all duration-1000">
                <div className={`absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.2)_1px,transparent_1px),linear-gradient(60deg,rgba(251,191,36,0.2)_1px,transparent_1px)] bg-[size:40px_40px]`} />
            </div>
        );
    }
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000">
            <div className={`absolute -top-20 -left-20 w-64 h-64 bg-${color}-500/10 rounded-full blur-[80px] animate-blob`} />
            <div className={`absolute top-1/2 -right-20 w-64 h-64 bg-${color}-400/10 rounded-full blur-[80px] animate-blob animation-delay-2000`} />
        </div>
    );
});

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addLog, agentMode, activeAgentProfile, awardSkillXp } = useUniversalAgent(); 
  const { carbonData, esgScores, budget, carbonCredits, auditLogs } = useCompany();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [learningContext, setLearningContext] = useState<string[]>([]); // User feedback stored as learning constraints

  const [historyCache, setHistoryCache] = useState<Record<string, Message[]>>(() => {
      try {
          const saved = localStorage.getItem('esgss_ai_history');
          return saved ? JSON.parse(saved) : {};
      } catch (e) { return {}; }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollLogRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const client = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  useEffect(() => {
      localStorage.setItem('esgss_ai_history', JSON.stringify(historyCache));
  }, [historyCache]);

  const historyKey = `${currentView}-${agentMode}`;
  const messages = historyCache[historyKey] || [];

  const updateHistory = useCallback((newMessages: Message[]) => {
      setHistoryCache(prev => ({ ...prev, [historyKey]: newMessages }));
  }, [historyKey]);

  const activePersona = useMemo(() => {
      if (currentView === View.UNIVERSAL_AGENT) {
          return {
              core: 'Nexus',
              name: activeAgentProfile.name,
              role: activeAgentProfile.role,
              icon: activeAgentProfile.icon,
              color: activeAgentProfile.color,
              accent: '#8b5cf6',
              bgEffect: agentMode === 'phantom' ? 'matrix' : agentMode === 'captain' ? 'grid' : 'nebula'
          } as AgentPersona;
      }
      return AVATAR_MATRIX[currentView] || AVATAR_MATRIX[View.MY_ESG]!;
  }, [currentView, activeAgentProfile, agentMode]);

  useEffect(() => {
      setIsSwitching(true);
      const timer = setTimeout(() => setIsSwitching(false), 600);
      return () => clearTimeout(timer);
  }, [activePersona.name]);

  useEffect(() => {
      const systemContext = `
          [SYSTEM IDENTITY]
          You are "${activePersona.name}", a specialized AI agent in the ESGss Platform.
          Role: ${activePersona.role}
          Core: ${activePersona.core}
          View: ${currentView}
          
          [LEARNING FROM FEEDBACK]
          ${learningContext.length > 0 ? "IMPORTANT: User prefers " + learningContext.join(", ") : ""}

          [CAPABILITIES]
          VISUALIZATION: If user asks for analysis, MUST output 'json_ui' block.
          Tone: Concise, technical if phantom, strategic if captain.
      `;

      try {
          chatRef.current = client.chats.create({
              model: 'gemini-3-flash-preview',
              config: { systemInstruction: systemContext },
              history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
          });
      } catch (e) { console.error(e); }
  }, [currentView, agentMode, activePersona, learningContext]);

  const handleSend = async (overrideText?: string) => {
    const userMessage = overrideText || input;
    if (!userMessage.trim() || isThinking) return;

    if (!overrideText) setInput('');
    
    const newMessage: Message = { id: Date.now().toString(), role: 'user', text: userMessage, timestamp: Date.now() };
    const updatedMessages = [...messages, newMessage];
    updateHistory(updatedMessages);
    setIsThinking(true);

    try {
        const result = await chatRef.current.sendMessage({ message: userMessage });
        const botMessage: Message = { id: (Date.now()+1).toString(), role: 'model', text: result.text || "Processed.", timestamp: Date.now() };
        updateHistory([...updatedMessages, botMessage]);
    } catch (error) {
      addToast('error', 'Neural Link Interrupted', 'AI Error');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      addToast('success', isZh ? '已複製' : 'Copied', 'Clipboard');
  };

  const handleRedo = (idx: number) => {
      const lastUserMsg = messages[idx - 1];
      if (lastUserMsg && lastUserMsg.role === 'user') {
          updateHistory(messages.slice(0, idx)); // Keep up to user message
          handleSend(lastUserMsg.text);
      }
  };

  const handleFeedback = (msgId: string, type: 'good' | 'bad') => {
      updateHistory(messages.map(m => m.id === msgId ? { ...m, feedback: type } : m));
      addToast('success', isZh ? '感謝反饋，AI 已學習偏好' : 'Feedback received. AI personality refined.', 'Neural Learning');
      
      const msg = messages.find(m => m.id === msgId);
      if (type === 'good' && msg) {
          setLearningContext(prev => [...prev, `more of: "${msg.text.substring(0, 20)}..." styling`]);
      }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const theme = { bg: 'bg-slate-900/95', border: 'border-celestial-purple/30', text: 'text-celestial-purple', button: 'bg-celestial-purple hover:bg-purple-500' };
  const ModeIcon = activePersona.icon;

  if (!isOpen) {
    return (
      <div
          onClick={() => setIsOpen(true)}
          className={`fixed z-[9999] bottom-10 right-10 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${theme.button} text-white border-2 border-white/20 animate-bounce-slow`}
      >
          <ModeIcon className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div className={`fixed z-[9999] bottom-10 right-10 w-96 h-[600px] backdrop-blur-xl border-2 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in ${theme.bg} ${theme.border}`}>
      <ModeBackground effect={activePersona.bgEffect} color={activePersona.color} />
      
      <div className="p-4 border-b border-white/10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10"><ModeIcon className={`w-5 h-5 ${theme.text}`} /></div>
            <span className="font-bold text-white text-sm">{activePersona.name}</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10" ref={scrollLogRef}>
        <div className="space-y-4">
            {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-celestial-purple text-white rounded-br-none' : 'bg-white/5 text-gray-100 rounded-bl-none border border-white/5'}`}>
                        <GenerativeUIRenderer content={msg.text} />
                        
                        {msg.role === 'model' && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                <button onClick={() => handleCopy(msg.text)} className="p-1 text-gray-500 hover:text-white transition-colors" title="Copy"><Copy className="w-3 h-3" /></button>
                                <button onClick={() => handleRedo(idx)} className="p-1 text-gray-500 hover:text-white transition-colors" title="Redo"><RotateCcw className="w-3 h-3" /></button>
                                <button className="p-1 text-gray-500 hover:text-white transition-colors" title="Share"><Share2 className="w-3 h-3" /></button>
                                <div className="flex-1" />
                                <button onClick={() => handleFeedback(msg.id, 'good')} className={`p-1 transition-colors ${msg.feedback === 'good' ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`}><ThumbsUp className="w-3 h-3" /></button>
                                <button onClick={() => handleFeedback(msg.id, 'bad')} className={`p-1 transition-colors ${msg.feedback === 'bad' ? 'text-rose-400' : 'text-gray-500 hover:text-rose-400'}`}><ThumbsDown className="w-3 h-3" /></button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isThinking && <div className="flex justify-start"><Loader2 className="w-4 h-4 animate-spin text-celestial-purple" /></div>}
            <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-white/10 relative z-10">
        <div className="flex flex-wrap gap-2 mb-3">
             {(SUGGESTIONS_MAP[currentView] || SUGGESTIONS_MAP[View.MY_ESG]!).map((s, i) => (
                 <button 
                    key={i} 
                    onClick={() => handleSend(s)}
                    className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 hover:bg-celestial-purple/20 hover:text-white transition-all whitespace-nowrap"
                 >
                    {s}
                 </button>
             ))}
        </div>
        <div className="flex gap-2">
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your agent..."
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
            />
            <button onClick={() => handleSend()} className="p-2 bg-celestial-purple text-white rounded-xl"><Send className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  );
};
