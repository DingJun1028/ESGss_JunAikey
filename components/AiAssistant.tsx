
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

// Enhanced Matrix with Visual Effects
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
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp?: number;
    feedback?: 'good' | 'bad';
    attachments?: { type: string; name: string; data?: string }[];
}

// Background Effect Component
const ModeBackground: React.FC<{ effect: string; color: string }> = React.memo(({ effect, color }) => {
    if (effect === 'matrix') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/20 animate-pulse" />
            </div>
        );
    }
    if (effect === 'grid') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                <div className={`absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.2)_1px,transparent_1px),linear-gradient(60deg,rgba(251,191,36,0.2)_1px,transparent_1px)] bg-[size:40px_40px]`} />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-900" />
            </div>
        );
    }
    // Nebula / Flow (Default)
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-20 -left-20 w-64 h-64 bg-${color}-500/10 rounded-full blur-[80px] animate-blob`} />
            <div className={`absolute top-1/2 -right-20 w-64 h-64 bg-${color}-400/10 rounded-full blur-[80px] animate-blob animation-delay-2000`} />
        </div>
    );
});

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const isZh = language === 'zh-TW';
  const { addToast, notifications } = useToast();
  const { addLog, agentMode, systemLogs, activeAgentProfile, awardSkillXp } = useUniversalAgent(); 
  const { quests, carbonData, esgScores, budget, carbonCredits, auditLogs } = useCompany();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{ file: File; base64: string } | null>(null);
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);

  // Persistent History Cache
  const [historyCache, setHistoryCache] = useState<Record<string, Message[]>>(() => {
      try {
          const saved = localStorage.getItem('esgss_ai_history');
          return saved ? JSON.parse(saved) : {};
      } catch (e) {
          return {};
      }
  });

  const [isThinking, setIsThinking] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false); // New transition state

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollLogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<any>(null);
  const client = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  // Sync history to localStorage whenever it changes
  useEffect(() => {
      localStorage.setItem('esgss_ai_history', JSON.stringify(historyCache));
  }, [historyCache]);

  // Derive current messages from cache directly to ensure single source of truth
  const historyKey = `${currentView}-${agentMode}`;
  const messages = historyCache[historyKey] || [];

  // Update history helper
  const updateHistory = useCallback((newMessages: Message[]) => {
      setHistoryCache(prev => ({
          ...prev,
          [historyKey]: newMessages
      }));
  }, [historyKey]);

  // --- DRAG LOGIC ---
  const initialX = typeof window !== 'undefined' ? window.innerWidth - 80 : 0;
  // Adjusted Y to ensure it doesn't overlap mobile nav (approx 80px buffer from bottom)
  const initialY = typeof window !== 'undefined' ? window.innerHeight - 100 : 0;
  
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'button' | 'window'>('button');
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startElPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
      if (typeof window !== 'undefined') {
          // Align top with logo line (approx 64px header + padding = ~80px)
          setWindowPosition({ x: window.innerWidth - 400, y: 80 });
          setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
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
      
      // Boundaries
      newX = Math.max(0, Math.min(window.innerWidth - width, newX));
      // Ensure within screen but above mobile nav (approx 80px)
      newY = Math.max(20, Math.min(window.innerHeight - height - 80, newY));
      
      if (dragTarget === 'button') setPosition({ x: newX, y: newY });
      else setWindowPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => setIsDragging(false);

  // --- PERSONA & THEME LOGIC ---

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

  // Transition Effect on Persona Change
  useEffect(() => {
      setIsSwitching(true);
      const timer = setTimeout(() => setIsSwitching(false), 600); // 600ms transition
      return () => clearTimeout(timer);
  }, [activePersona.name]);

  const activeSuggestions = useMemo(() => {
      let suggestions = [];
      if (currentView === View.UNIVERSAL_AGENT) {
          if (agentMode === 'phantom') suggestions = ["tail -f system.log", "status report", "optimize kernel"];
          else if (agentMode === 'captain') suggestions = ["Strategic Overview", "Risk Assessment", "Market Scan"];
          else suggestions = ["System Status", "Run Diagnostics", "Show Evolution Plan"];
      } else {
          suggestions = SUGGESTIONS_MAP[currentView] || ["What can you do?", "Help me get started"];
      }
      
      // --- Deep Context Awareness ---
      
      // 1. Dashboard Context
      if (currentView === View.DASHBOARD) {
          if (esgScores.environmental < 70) suggestions.unshift("Analyze Environmental gaps");
          if (esgScores.social < 70) suggestions.unshift("Improve Social score");
          if (esgScores.governance < 70) suggestions.unshift("Review Governance risks");
          if (carbonData.scope1 + carbonData.scope2 > 1000) suggestions.unshift("Simulate decarbonization paths");
      }

      // 2. Finance Context
      if (currentView === View.FINANCE) {
          if (budget > 100000) suggestions.unshift("Optimize budget allocation");
          if (carbonCredits < 500) suggestions.unshift("Purchase Carbon Credits");
          suggestions.unshift("Predict ROI for solar project");
      }

      // 3. Strategy Context
      if (currentView === View.STRATEGY) {
          suggestions.unshift("Simulate Competitor Move");
          suggestions.unshift("Draft Risk Mitigation Plan");
      }

      // 4. Report Context
      if (currentView === View.REPORT) {
          if (auditLogs.length > 0) suggestions.unshift("Summarize recent audit logs");
          suggestions.unshift("Generate Executive Summary");
      }

      // 5. Universal Context (History)
      if (auditLogs.length > 0 && currentView === View.AUDIT) {
           const lastAction = auditLogs[0].action;
           suggestions.unshift(`Explain "${lastAction}" impact`);
      }
      
      // 6. Generic Alerts
      if (budget < 50000) suggestions.unshift("Find cost savings");

      return Array.from(new Set(suggestions)).slice(0, 6);
  }, [currentView, agentMode, esgScores, carbonData, budget, carbonCredits, auditLogs]);

  const classifySuggestion = (text: string) => {
      const lower = text.toLowerCase();
      // Perception: Seeing, finding, monitoring
      if (lower.match(/scan|search|find|monitor|read|crawl|detect|check/)) {
          return { core: 'Perception', icon: Eye, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' };
      }
      // Cognition: Thinking, analyzing, calculating
      if (lower.match(/analyze|calculate|simulate|risk|predict|forecast|evaluate|compare|why|explain/)) {
          return { core: 'Cognition', icon: BrainCircuit, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
      }
      // Expression: Creating, writing, reporting
      if (lower.match(/draft|write|generate|report|summarize|email|create|compose|help/)) {
          return { core: 'Expression', icon: FileText, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' };
      }
      // Memory: Recalling, storing, history
      if (lower.match(/remember|history|log|archive|recall|save|store|verify/)) {
          return { core: 'Memory', icon: Database, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' };
      }
      // Nexus: Connecting, system, API, switching
      return { core: 'Nexus', icon: Network, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
  };

  useEffect(() => {
      // Chat Context Initialization
      // Inject Live Data Context based on View
      let viewContextData = "";
      if (currentView === View.DASHBOARD || currentView === View.CARBON) {
          // Synthetic History for Chart Generation
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          const history = months.map((m, i) => ({
              month: m,
              s1: carbonData.scope1 * (0.9 + (i * 0.02)), // Simulated trend
              s2: carbonData.scope2 * (1.1 - (i * 0.03)),
              s3: carbonData.scope3
          }));

          viewContextData = `
            Current Carbon Data (tCO2e): Scope 1=${carbonData.scope1}, Scope 2=${carbonData.scope2}, Scope 3=${carbonData.scope3}.
            Historical Data (6 Months): ${JSON.stringify(history)}.
            ESG Scores: ${JSON.stringify(esgScores)}.
          `;
      } else if (currentView === View.FINANCE) {
          viewContextData = `Financial Context: Budget=$${budget}, Carbon Credits=${carbonCredits}. Focus: ROI, Carbon Tax Impact.`;
      } else if (currentView === View.STRATEGY) {
          viewContextData = `Strategic Context: ESG Scores=${JSON.stringify(esgScores)}. Focus on Risk Mitigation and Stakeholder Engagement.`;
      } else if (currentView === View.AUDIT) {
          viewContextData = `Audit Logs Context: ${JSON.stringify(auditLogs.slice(0, 3))}. Focus on Data Integrity and Hash Verification.`;
      }

      const systemContext = `
          [SYSTEM IDENTITY]
          You are "${activePersona.name}", a specialized AI agent within the ESGss Platform.
          Role: ${activePersona.role}
          Core Function: ${activePersona.core}
          Current View: ${currentView}
          Language: ${language}
          
          [LIVE DATA CONTEXT]
          ${viewContextData}

          [CAPABILITIES]
          1. If asked to analyze trends, risks, or data, use the provided [LIVE DATA CONTEXT].
          2. VISUALIZATION: If the user asks for a chart, graph, or trend analysis (e.g. "Analyze ESG trends"), you MUST output a 'json_ui' block.
             Supported chartTypes: 'area', 'bar', 'pie', 'radar'.
             
             Example Chart Response:
             Here is the trend analysis:
             \`\`\`json_ui
             {
               "type": "chart",
               "chartType": "area",
               "title": "Emission Trends (H1)",
               "data": [{"label":"Jan", "value":120}, {"label":"Feb", "value":140}],
               "config": {"xKey":"label", "dataKeys":[{"key":"value", "color":"#10b981", "name":"Metric"}]}
             }
             \`\`\`

          ${agentMode === 'phantom' ? 'Tone: Technical, CLI-style, Concise.' : ''}
          ${agentMode === 'captain' ? 'Tone: Strategic, Executive, Insightful.' : ''}
      `;

      try {
          chatRef.current = client.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction: systemContext },
              history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
          });
      } catch (e) { console.error(e); }
  }, [currentView, agentMode, carbonData, esgScores, budget, carbonCredits, auditLogs]); // Depend on messages length to re-init history if clear? No, messages is managed.

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Expanded Skill Check Logic
  const checkSkills = (text: string) => {
      const lower = text.toLowerCase();
      
      // Data Processing (sk-2)
      if (lower.match(/analyze|data|calc|stats|trend|forecast/)) {
          awardSkillXp('sk-2', 15);
      }
      // Creative Synthesis (sk-3)
      if (lower.match(/write|create|draft|idea|suggest|generate/)) {
          awardSkillXp('sk-3', 15);
      }
      // Context Retention (sk-1)
      if (text.length > 50 || lower.match(/remember|context|history|previous|recall/)) {
          awardSkillXp('sk-1', 10);
      }
      // System Integration (sk-4)
      if (lower.match(/connect|api|sync|link|export|import/)) {
          awardSkillXp('sk-4', 20);
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              setAttachedFile({
                  file: file,
                  base64: (reader.result as string).split(',')[1]
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSend = async (overrideText?: string) => {
    const userMessage = overrideText || input;
    if ((!userMessage.trim() && !attachedFile) || isThinking) return;

    checkSkills(userMessage);
    if (!overrideText) {
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto'; 
    }
    
    // Phantom Mode Visual Log
    if (currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom') {
        addLog(`> ${userMessage}`, 'info', 'Phantom');
    }

    const newMessage: Message = { 
        id: Date.now().toString(), 
        role: 'user', 
        text: userMessage, 
        timestamp: Date.now(),
        attachments: attachedFile ? [{ type: attachedFile.file.type, name: attachedFile.file.name }] : undefined
    };
    
    // Optimistic Update
    const updatedMessages = [...messages, newMessage];
    updateHistory(updatedMessages);

    setIsThinking(true);

    try {
        if (!chatRef.current) {
             // Fallback init
             chatRef.current = client.chats.create({ model: 'gemini-2.5-flash' });
        }

        // Construct message payload with file if present
        let messagePayload: any = userMessage;
        
        if (attachedFile) {
            messagePayload = [
                { inlineData: { mimeType: attachedFile.file.type, data: attachedFile.base64 } },
                { text: userMessage || "Analyze this file." }
            ];
            // Clear attachment after sending
            setAttachedFile(null);
        }

        const result = await chatRef.current.sendMessage(messagePayload);
        const responseText = result.text || "Processed.";
        
        const botMessage: Message = { id: (Date.now()+1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
        
        updateHistory([...updatedMessages, botMessage]);
        
    } catch (error) {
      console.error(error);
      addToast('error', 'Neural Link Interrupted', 'AI Error');
      updateHistory([...updatedMessages, { id: Date.now().toString(), role: 'model', text: "Connection unstable. Retrying neural handshake...", timestamp: Date.now() }]);
      chatRef.current = null;
    } finally {
      setIsThinking(false);
    }
  };

  // --- CONVERSATION TOOLS HANDLERS ---
  const handleCopyMessage = (text: string) => {
      navigator.clipboard.writeText(text);
      addToast('success', isZh ? '已複製' : 'Copied', 'Clipboard');
  };

  const handleRedoMessage = async (index: number) => {
      // Find the last user message before this bot message
      if (index === 0) return;
      
      const lastUserMsg = messages[index - 1];
      if (lastUserMsg.role !== 'user') return;

      // Rewind history to just before the bot response (keeping user msg)
      // Actually, standard Redo keeps the user message and tries again.
      // But handleSend adds a user message.
      // So we should slice up to BEFORE the user message, update history, and then call handleSend with the user text.
      const newMessages = messages.slice(0, index - 1);
      updateHistory(newMessages);
      
      // Allow state update to propagate? handleSend uses 'messages' from closure? 
      // handleSend uses messages from state via messages variable? No, it uses cache if we modify it? 
      // Actually we need to be careful with async state.
      // Easiest way: manually invoke API and append to newMessages.
      
      setIsThinking(true);
      try {
          if (!chatRef.current) {
             chatRef.current = client.chats.create({ model: 'gemini-2.5-flash', history: newMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })) });
          } else {
             // If we rewind, we might need to reset history in Gemini or create new chat.
             // Simpler to create new chat context for reliability.
             chatRef.current = client.chats.create({ model: 'gemini-2.5-flash', history: newMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })) });
          }

          // Re-add user message for UI consistency if we stripped it
          const reUserMsg = lastUserMsg;
          const reHistory = [...newMessages, reUserMsg];
          updateHistory(reHistory);

          const result = await chatRef.current.sendMessage(reUserMsg.text);
          const responseText = result.text || "Processed.";
          
          updateHistory([...reHistory, { id: (Date.now()+1).toString(), role: 'model', text: responseText, timestamp: Date.now() }]);
      } catch (e) {
          console.error(e);
          addToast('error', 'Regeneration Failed', 'Error');
      } finally {
          setIsThinking(false);
      }
  };

  const handleFeedback = (msgId: string, type: 'good' | 'bad') => {
      updateHistory(messages.map(m => m.id === msgId ? { ...m, feedback: type } : m));
      addToast('success', isZh ? '感謝反饋' : 'Thanks for feedback', 'System');
      
      if (type === 'good') {
          // Simulate visual spread creation
          setTimeout(() => {
              addToast('info', isZh ? '已根據反饋優化視覺模型' : 'Visual model optimized based on feedback', 'Generative UI');
          }, 1000);
      }
  };

  const handleShareMessage = (text: string) => {
      // Mock Share
      addToast('success', isZh ? '分享連結已生成' : 'Share link generated', 'Share');
  };

  const handleVoiceInput = () => {
      if (isVoiceActive) {
          // Stop listening
          if (recognitionRef.current) recognitionRef.current.stop();
          setIsVoiceActive(false);
          return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
          addToast('error', isZh ? '您的瀏覽器不支援語音識別' : 'Browser does not support speech recognition', 'System');
          return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language === 'zh-TW' ? 'zh-TW' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
          setIsVoiceActive(true);
          addToast('info', isZh ? '正在聆聽...' : 'Listening...', 'Voice Input');
      };

      recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
              setInput(prev => prev ? `${prev} ${transcript}` : transcript);
          }
      };

      recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsVoiceActive(false);
      };

      recognition.onend = () => {
          setIsVoiceActive(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
  };

  const handleClearConversation = () => {
      updateHistory([]);
      chatRef.current = null; 
      addToast('info', isZh ? '已開啟新對話' : 'New chat started', 'System');
  };

  const handleExportPDF = () => {
      if (!scrollLogRef.current) return;
      const element = scrollLogRef.current;
      const opt = {
          margin: 10,
          filename: `chat_export_${Date.now()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      addToast('info', isZh ? '正在匯出 PDF...' : 'Exporting PDF...', 'System');
      html2pdf().set(opt).from(element).save().then(() => {
          addToast('success', isZh ? '匯出完成' : 'Export Complete', 'System');
      });
  };

  const handleScrollSuggestions = (direction: 'left' | 'right') => {
      if (suggestionsScrollRef.current) {
          const scrollAmount = 200;
          suggestionsScrollRef.current.scrollBy({
              left: direction === 'left' ? -scrollAmount : scrollAmount,
              behavior: 'smooth'
          });
      }
  };

  const getThemeClasses = () => {
      const c = activePersona.color;
      if (c === 'emerald') return { bg: 'bg-emerald-950/90', border: 'border-emerald-500/50', text: 'text-emerald-400', button: 'bg-emerald-600 hover:bg-emerald-500', glow: 'shadow-emerald-500/20' };
      if (c === 'gold') return { bg: 'bg-amber-950/90', border: 'border-amber-500/50', text: 'text-amber-400', button: 'bg-amber-600 hover:bg-amber-500', glow: 'shadow-amber-500/20' };
      // Default / Purple / Blue
      return { bg: 'bg-slate-900/95', border: 'border-celestial-purple/30', text: 'text-celestial-purple', button: 'bg-celestial-purple hover:bg-purple-500', glow: 'shadow-purple-500/20' };
  };

  const theme = getThemeClasses();
  const ModeIcon = activePersona.icon;

  // --- RENDER ---

  if (!isOpen) {
    return (
      <>
        <div
            onMouseDown={(e) => handleDragStart(e, 'button')}
            onTouchStart={(e) => handleDragStart(e, 'button')}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            onClick={(e) => {
                if (!isDragging) {
                    setIsOpen(true);
                }
            }}
            style={{ left: position.x, top: position.y }}
            className={`fixed z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-move touch-none select-none
                ${theme.button} text-white border-2 border-white/20 ${theme.glow} shadow-lg
                ${isVoiceActive ? 'animate-pulse ring-4 ring-white/30' : 'animate-bounce-slow'}
            `}
        >
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse pointer-events-none" />
            {isVoiceActive ? <Mic className="w-7 h-7 relative z-10" /> : <ModeIcon className="w-7 h-7 relative z-10 pointer-events-none" />}
        </div>
      </>
    );
  }

  return (
    <div 
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        className={`fixed z-[9999] w-full md:w-96 
            h-[85vh] md:h-[calc(100vh-6rem)] 
            backdrop-blur-xl border-2 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in ring-1 ring-white/10 transition-all duration-500 touch-none
            ${theme.bg} ${theme.border}
            ${typeof window !== 'undefined' && window.innerWidth >= 768 ? '' : 'bottom-0 right-0'}
        `}
        style={typeof window !== 'undefined' && window.innerWidth >= 768 ? { left: windowPosition.x, top: windowPosition.y } : {}}
    >
      <ModeBackground effect={activePersona.bgEffect} color={activePersona.color} />

      {/* Header */}
      <div 
        onMouseDown={(e) => handleDragStart(e, 'window')}
        onTouchStart={(e) => handleDragStart(e, 'window')}
        className={`p-4 border-b ${theme.border} bg-white/5 flex justify-between items-center shrink-0 cursor-move touch-none select-none relative z-10`}
      >
        <div className="flex items-center gap-3 pointer-events-none">
            <div className={`p-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent ${theme.border} border`}>
                <ModeIcon className={`w-5 h-5 ${theme.text}`} />
            </div>
            <div>
                <span className="font-bold text-white text-sm block tracking-tight shadow-black drop-shadow-sm">{activePersona.name}</span>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.button} animate-pulse`} />
                    <span className={`text-[10px] uppercase tracking-wider font-bold opacity-80 ${theme.text}`}>
                        {activePersona.core} Core
                    </span>
                </div>
            </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
            <button onClick={handleExportPDF} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title={isZh ? "匯出 PDF" : "Export PDF"}>
                <Download className="w-4 h-4" />
            </button>
            <button onClick={handleClearConversation} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title={isZh ? "新對話 (清除)" : "New Chat (Clear)"}>
                <MessageSquarePlus className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Transition Overlay */}
      {isSwitching && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center animate-fade-in">
              <div className="flex flex-col items-center gap-3">
                  <Loader2 className={`w-10 h-10 animate-spin ${theme.text}`} />
                  <span className="text-xs font-mono text-white tracking-widest uppercase">Recalibrating Neural Core...</span>
              </div>
          </div>
      )}

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10 ${agentMode === 'phantom' ? 'font-mono text-xs' : ''}`} ref={scrollLogRef}>
        
        {currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? (
            <div className="space-y-1">
                {systemLogs.slice(-20).map((log) => (
                    <div key={log.id} className="flex gap-2 text-gray-300 break-all animate-fade-in">
                        <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`${log.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>{log.source}:</span>
                        <span>{log.message}</span>
                    </div>
                ))}
                <div className="animate-pulse text-emerald-500">_</div>
            </div>
        ) : (
            <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-12 text-sm px-4">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-white/5 to-transparent border border-white/10 flex items-center justify-center ${theme.text}`}>
                            <ModeIcon className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-bold text-gray-300 mb-1">{isZh ? '我是您的專屬智能代理。' : `I am ${activePersona.name}.`}</p>
                        <p className="text-xs opacity-70">{activePersona.role}</p>
                        <p className="text-[10px] mt-4 text-gray-600">History is saved locally for this view.</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={msg.id} className="flex flex-col gap-1 animate-fade-in">
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] rounded-2xl p-3 text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                                msg.role === 'user' 
                                ? `${theme.button} text-white rounded-br-none` 
                                : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'
                            }`}>
                                {msg.attachments && (
                                    <div className="mb-2 flex flex-col gap-1">
                                        {msg.attachments.map((att, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-black/20 p-2 rounded text-xs">
                                                <FileText className="w-3 h-3 opacity-70" />
                                                <span className="truncate max-w-[150px]">{att.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {msg.role === 'model' ? (
                                    <>
                                        <GenerativeUIRenderer content={msg.text} />
                                        {/* Conversation Tools */}
                                        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/10 text-gray-400">
                                            <button onClick={() => handleCopyMessage(msg.text)} className="p-1 hover:text-white transition-colors" title="Copy">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => handleRedoMessage(idx)} className="p-1 hover:text-white transition-colors" title="Regenerate">
                                                <RotateCcw className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => handleShareMessage(msg.text)} className="p-1 hover:text-white transition-colors" title="Share">
                                                <Share2 className="w-3 h-3" />
                                            </button>
                                            <div className="w-px h-3 bg-white/10 mx-1" />
                                            <button onClick={() => handleFeedback(msg.id, 'good')} className={`p-1 hover:text-green-400 transition-colors ${msg.feedback === 'good' ? 'text-green-400' : ''}`} title="Helpful">
                                                <ThumbsUp className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => handleFeedback(msg.id, 'bad')} className={`p-1 hover:text-red-400 transition-colors ${msg.feedback === 'bad' ? 'text-red-400' : ''}`} title="Not Helpful">
                                                <ThumbsDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start animate-pulse">
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

      {/* Capabilities / Suggestions */}
      {!(currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom') && (
          <div className="flex flex-col shrink-0 bg-black/20 backdrop-blur-md border-t border-white/5 relative z-10 group/suggestions">
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <Sparkles className={`w-3 h-3 ${theme.text}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} opacity-90`}>
                          {isZh ? '多維智能能力' : 'Multi-Dimensional Capabilities'}
                      </span>
                  </div>
              </div>

              <div className="relative flex items-center group/suggestions">
                  <button 
                    onClick={() => handleScrollSuggestions('left')}
                    className="absolute left-0 z-10 p-1 bg-slate-900/80 hover:bg-slate-800 text-gray-400 rounded-r-lg border-y border-r border-white/10 h-full opacity-0 group-hover/suggestions:opacity-100 transition-opacity flex items-center justify-center"
                  >
                      <ArrowLeft className="w-4 h-4" />
                  </button>
                  
                  <div 
                    ref={suggestionsScrollRef}
                    className="px-4 pb-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade scroll-smooth w-full"
                  >
                      {activeSuggestions.map((suggestion, idx) => {
                          const visuals = classifySuggestion(suggestion);
                          const CoreIcon = visuals.icon;
                          return (
                          <button 
                            key={idx}
                            onClick={() => handleSend(suggestion)}
                            className={`
                                flex flex-col items-start p-2 rounded-xl border transition-all min-w-[140px] max-w-[200px] gap-1 group relative overflow-hidden shrink-0 hover:scale-105
                                ${visuals.border} ${visuals.bg} hover:brightness-110 hover:shadow-lg
                            `}
                          >
                              <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-bold mb-1 w-fit ${visuals.color} bg-white/5`}>
                                  <CoreIcon className="w-3 h-3" />
                                  {visuals.core}
                              </div>
                              <span className="text-xs text-left font-medium text-gray-200 group-hover:text-white leading-tight w-full line-clamp-2">
                                  {suggestion}
                              </span>
                          </button>
                      )})}
                  </div>

                  <button 
                    onClick={() => handleScrollSuggestions('right')}
                    className="absolute right-0 z-10 p-1 bg-slate-900/80 hover:bg-slate-800 text-gray-400 rounded-l-lg border-y border-l border-white/10 h-full opacity-0 group-hover/suggestions:opacity-100 transition-opacity flex items-center justify-center"
                  >
                      <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      )}

      {/* Input Area */}
      <div className={`p-4 border-t bg-white/5 ${theme.border} shrink-0 relative z-10`}>
         
         {/* Attachment Preview */}
         {attachedFile && (
             <div className="flex items-center gap-2 mb-2 px-2">
                 <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-white border border-white/10">
                     <FileText className="w-3 h-3" />
                     <span className="truncate max-w-[200px]">{attachedFile.file.name}</span>
                     <button onClick={() => setAttachedFile(null)} className="hover:text-red-400 ml-1">
                         <X className="w-3 h-3" />
                     </button>
                 </div>
             </div>
         )}

         <div className="flex gap-2 items-end">
            <textarea 
                ref={textareaRef}
                value={input} 
                onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder={
                    currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? "Enter system command..." : 
                    isZh ? `詢問 ${activePersona.name}...` : `Ask ${activePersona.name}...`
                }
                className={`flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-none max-h-32 custom-scrollbar focus:border-opacity-50 focus:border-white
                    ${currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? 'font-mono text-emerald-400' : ''}
                `}
                rows={1}
            />
            
            {/* File Upload Button */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
                accept="image/*,application/pdf"
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl transition-all mb-0.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                title={isZh ? "上傳文件/圖片" : "Upload File/Image"}
            >
                <Paperclip className="w-5 h-5" />
            </button>

            {/* Mic Button */}
            <button 
                onClick={handleVoiceInput}
                className={`p-3 rounded-xl transition-all mb-0.5 ${isVoiceActive ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                title={isZh ? "語音輸入" : "Voice Input"}
            >
                <Mic className="w-5 h-5" />
            </button>

            <button 
                onClick={() => handleSend()} 
                disabled={isThinking || (!input.trim() && !attachedFile)}
                className={`p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 ${theme.button} text-white shadow-lg hover:scale-105`}
            >
                {currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom' ? <Terminal className="w-5 h-5"/> : <Send className="w-5 h-5"/>}
            </button>
        </div>
      </div>
    </div>
  );
};