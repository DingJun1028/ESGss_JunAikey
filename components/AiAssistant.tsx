
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Send, Bot, X, Sparkles, Minimize2, Loader2, Terminal, Grid, 
    BrainCircuit, Activity, Eye, Database, Share2, Network, 
    ShieldCheck, Zap, Layers, Leaf, Target, FileText, Briefcase, Globe, Users
} from 'lucide-react';
import { Language, View } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import GenerativeUIRenderer from './GenerativeUIRenderer';

interface AiAssistantProps {
  language: Language;
  onNavigate: (view: View) => void;
  currentView: View;
}

// --- The Thousand Faces Matrix (Whitepaper Implementation) ---
interface AgentPersona {
    core: 'Perception' | 'Cognition' | 'Memory' | 'Expression' | 'Nexus';
    name: string; // The Avatar Name
    role: string; // Internal Role Description
    icon: any;
    color: string; // Tailwind color class fragment (e.g. 'emerald')
    accent: string; // Hex for UI borders/glows
}

const AVATAR_MATRIX: Partial<Record<View, AgentPersona>> = {
    // I. Perception Core (The Eye)
    [View.RESEARCH_HUB]: { core: 'Perception', name: 'Spectral Scanner', role: 'Data Ingestion & OCR Specialist', icon: Eye, color: 'purple', accent: '#a855f7' },
    [View.INTEGRATION]: { core: 'Perception', name: 'Data Lake Sensor', role: 'IoT & ERP Signal Processor', icon: Network, color: 'blue', accent: '#3b82f6' },
    [View.BUSINESS_INTEL]: { core: 'Perception', name: 'Global Crawler', role: 'Competitive Intelligence Scout', icon: Globe, color: 'indigo', accent: '#6366f1' },

    // II. Cognition Core (The Brain)
    [View.STRATEGY]: { core: 'Cognition', name: 'Strategy Oracle', role: 'Game Theory & Risk Analyst', icon: BrainCircuit, color: 'gold', accent: '#fbbf24' },
    [View.CARBON]: { core: 'Cognition', name: 'Carbon Calculator', role: 'GHG Protocol Auditor', icon: Leaf, color: 'emerald', accent: '#10b981' },
    [View.FINANCE]: { core: 'Cognition', name: 'ROI Simulator', role: 'Financial Projection Engine', icon: Activity, color: 'gold', accent: '#fbbf24' },
    [View.HEALTH_CHECK]: { core: 'Cognition', name: 'Health Diagnostician', role: 'Corporate Vitality Analyst', icon: Activity, color: 'rose', accent: '#f43f5e' },

    // III. Memory Core (The Vault)
    [View.RESTORATION]: { core: 'Memory', name: 'Asset Vault', role: 'Knowledge Archivist', icon: Database, color: 'cyan', accent: '#06b6d4' },
    [View.CARD_GAME_ARENA]: { core: 'Memory', name: 'Asset Vault', role: 'Gamification Master', icon: Layers, color: 'cyan', accent: '#06b6d4' },
    [View.TALENT]: { core: 'Memory', name: 'Skill Galaxy', role: 'Talent Vector Mapper', icon: Sparkles, color: 'pink', accent: '#ec4899' },

    // IV. Expression Core (The Voice)
    [View.REPORT]: { core: 'Expression', name: 'The Scribe', role: 'GRI/SASB Report Generator', icon: FileText, color: 'blue', accent: '#3b82f6' },
    [View.DASHBOARD]: { core: 'Expression', name: 'Omni-Cell', role: 'Data Visualization Specialist', icon: Grid, color: 'indigo', accent: '#818cf8' },
    [View.UNIVERSAL_BACKEND]: { core: 'Expression', name: 'GenUI Canvas', role: 'System Architect', icon: Terminal, color: 'slate', accent: '#94a3b8' },

    // V. Nexus Core (The Link)
    [View.UNIVERSAL_AGENT]: { core: 'Nexus', name: 'Universal Synapse', role: 'Orchestrator', icon: Sparkles, color: 'purple', accent: '#8b5cf6' },
    [View.API_ZONE]: { core: 'Nexus', name: 'API Gateway', role: 'Connectivity Manager', icon: Network, color: 'slate', accent: '#64748b' },
    [View.AUDIT]: { core: 'Nexus', name: 'Audit Chain', role: 'Immutable Ledger Keeper', icon: ShieldCheck, color: 'emerald', accent: '#10b981' },
    [View.ALUMNI_ZONE]: { core: 'Nexus', name: 'Role Switcher', role: 'Context Manager', icon: Users, color: 'orange', accent: '#f97316' },
    
    // Default Fallback
    [View.MY_ESG]: { core: 'Nexus', name: 'Personal Steward', role: 'Assistant', icon: Bot, color: 'purple', accent: '#8b5cf6' },
};

// Suggestions Matrix
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

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addLog, agentMode, systemLogs } = useUniversalAgent(); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollLogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Interactions API State
  const [interactionId, setInteractionId] = useState<string | undefined>(undefined);

  const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Determine Current Avatar Persona
  const activePersona = useMemo(() => {
      // If we are in the Universal Agent Zone, we respect the Tri-Mode (Companion/Captain/Phantom)
      if (currentView === View.UNIVERSAL_AGENT) {
          if (agentMode === 'phantom') return { core: 'Nexus', name: 'Phantom Process', role: 'System Daemon', icon: Terminal, color: 'emerald', accent: '#10b981' };
          if (agentMode === 'captain') return { core: 'Nexus', name: 'Captain Deck', role: 'Strategic Commander', icon: Grid, color: 'gold', accent: '#fbbf24' };
          return AVATAR_MATRIX[View.UNIVERSAL_AGENT]!;
      }
      // Otherwise, use the Page-Specific Avatar
      return AVATAR_MATRIX[currentView] || AVATAR_MATRIX[View.MY_ESG]!;
  }, [currentView, agentMode]);

  // 2. Generate Context-Aware Suggestions
  const activeSuggestions = useMemo(() => {
      // Mode overrides
      if (currentView === View.UNIVERSAL_AGENT) {
          if (agentMode === 'phantom') return ["tail -f system.log", "status report", "optimize kernel", "clear cache"];
          if (agentMode === 'captain') return ["Strategic Overview", "Risk Assessment", "Resource Allocation", "Market Scan"];
      }
      // View specific defaults
      return SUGGESTIONS_MAP[currentView] || ["What can you do?", "Help me get started", "System status"];
  }, [currentView, agentMode]);

  // Scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
      // Auto-scroll for Phantom Mode logs
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
    
    // Phantom Mode Logic (CLI) - Only active in Universal Agent Zone + Phantom Mode
    if (currentView === View.UNIVERSAL_AGENT && agentMode === 'phantom') {
        addLog(`COMMAND > ${userMessage}`, 'info', 'Phantom');
        setTimeout(() => {
            addLog(`Executing: ${userMessage}...`, 'thinking', 'Kernel');
            setTimeout(() => addLog(`Process '${userMessage}' completed.`, 'success', 'System'), 800);
        }, 200);
        return;
    }

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsThinking(true);

    try {
      let inputPayload: any = userMessage;
      
      if (!interactionId) {
          // Construct Dynamic System Context based on Active Persona
          const systemContext = `
            [SYSTEM IDENTITY]
            You are the "${activePersona.name}", a specialized AI agent within the ESGss Platform.
            Your Core Function: ${activePersona.role} (${activePersona.core} Core).
            
            [CURRENT CONTEXT]
            User is currently viewing: ${currentView}.
            Language: ${language}.
            
            [BEHAVIOR GUIDELINES]
            - Stay in character as the ${activePersona.name}.
            - Focus on topics related to ${activePersona.role}.
            - Be professional, data-driven, yet helpful.
            - If user asks for data visualization, use \`\`\`json_ui ... \`\`\`.
            
            [TRI-MODE OVERRIDE (Only if applicable)]
            ${currentView === View.UNIVERSAL_AGENT ? `Current Interaction Mode: ${agentMode.toUpperCase()}. Adjust tone accordingly.` : ''}
          `;
            
          inputPayload = `${systemContext}\n\nUser Query: ${userMessage}`;
      }

      const interaction = await client.interactions.create({
        model: 'gemini-3-pro-preview',
        input: inputPayload,
        previous_interaction_id: interactionId, 
      });

      const lastOutput = interaction.outputs && interaction.outputs.length > 0 
        ? interaction.outputs[interaction.outputs.length - 1] 
        : null;
        
      const text = (lastOutput && lastOutput.type === 'text') ? lastOutput.text : "Processing...";

      setInteractionId(interaction.id); 
      
      setMessages(prev => [...prev, { role: 'model', text: text || "Response generated." }]);
      
      // Log interaction to system logs
      addLog(`[${activePersona.name}] Interaction processed.`, 'info', 'Assistant');

    } catch (error) {
      console.error("Interaction Error:", error);
      addToast('error', 'Neural Link Interrupted', 'AI Error');
      setMessages(prev => [...prev, { role: 'model', text: "I encountered a disturbance in the neural core." }]);
    } finally {
      setIsThinking(false);
    }
  };

  // --- Theme Generators ---
  const getThemeClasses = () => {
      const c = activePersona.color;
      // Map 'color name' to Tailwind classes dynamically
      switch(c) {
          case 'emerald': return { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400', button: 'bg-emerald-500 hover:bg-emerald-400' };
          case 'gold': return { bg: 'bg-amber-900/20', border: 'border-amber-500/30', text: 'text-amber-400', button: 'bg-amber-500 hover:bg-amber-400' };
          case 'blue': return { bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-400', button: 'bg-blue-500 hover:bg-blue-400' };
          case 'purple': return { bg: 'bg-purple-900/20', border: 'border-purple-500/30', text: 'text-purple-400', button: 'bg-celestial-purple hover:bg-purple-400' };
          case 'rose': return { bg: 'bg-rose-900/20', border: 'border-rose-500/30', text: 'text-rose-400', button: 'bg-rose-500 hover:bg-rose-400' };
          case 'cyan': return { bg: 'bg-cyan-900/20', border: 'border-cyan-500/30', text: 'text-cyan-400', button: 'bg-cyan-500 hover:bg-cyan-400' };
          case 'orange': return { bg: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-400', button: 'bg-orange-500 hover:bg-orange-400' };
          case 'indigo': return { bg: 'bg-indigo-900/20', border: 'border-indigo-500/30', text: 'text-indigo-400', button: 'bg-indigo-500 hover:bg-indigo-400' };
          default: return { bg: 'bg-slate-900/20', border: 'border-white/10', text: 'text-gray-200', button: 'bg-white/10 hover:bg-white/20' };
      }
  };

  const theme = getThemeClasses();
  const ModeIcon = activePersona.icon;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 animate-bounce-slow
            ${theme.button} text-white border border-white/20 shadow-lg`}
        style={{ boxShadow: `0 0 20px ${activePersona.accent}40` }}
      >
        <ModeIcon className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] backdrop-blur-xl border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-in ring-1 ring-white/10 transition-all duration-500 bg-slate-900/95 ${theme.border}`}>
      
      {/* Header */}
      <div className={`p-4 border-b ${theme.border} bg-white/5 flex justify-between items-center`}>
        <div className="flex items-center gap-3">
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
        <div className="flex gap-2">
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
                    <div className="text-center text-gray-500 mt-20 text-sm px-4">
                        <ModeIcon className={`w-12 h-12 mx-auto mb-4 opacity-20 ${theme.text}`} />
                        <p className="font-bold text-gray-300 mb-1">{isZh ? '我是您的專屬智能代理。' : `I am your ${activePersona.name}.`}</p>
                        <p className="text-xs">{activePersona.role}</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
          <div className="px-4 pb-2 pt-2 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade border-t border-white/5 bg-white/5 backdrop-blur-sm">
              {activeSuggestions.map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] border transition-all 
                        ${theme.border} bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white
                    `}
                  >
                      {suggestion}
                  </button>
              ))}
          </div>
      )}

      {/* Input Area */}
      <div className={`p-4 border-t bg-white/5 ${theme.border}`}>
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
