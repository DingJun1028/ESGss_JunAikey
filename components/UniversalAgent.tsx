
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Send, Bot, X, Sparkles, Loader2, Terminal, Grid, 
    BrainCircuit, Activity, Eye, Database, Share2, Network, 
    ShieldCheck, Zap, Layers, Leaf, Target, FileText, Globe, Users,
    ArrowRight, Lightbulb, Compass, CheckSquare, Copy, RotateCcw, ThumbsUp, ThumbsDown, Download,
    Mic, Cpu, Paperclip, ArrowLeft, MessageSquarePlus, Command, Search,
    ChevronRight, ChevronLeft, Shield, TrendingUp, Info, GripVertical, RotateCw,
    // Fix: Added missing icon import 'Settings'
    User, CheckCircle, Waves, BarChart, Binary, ZapOff, Fingerprint, Gauge, Settings
} from 'lucide-react';
import { Language, View } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent, AgentMode } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { GenerativeUIRenderer } from './GenerativeUIRenderer';

interface UniversalAgentProps {
  language: Language;
  onNavigate: (view: View) => void;
  currentView: View;
}

const MODE_METADATA: Record<AgentMode, { name: string; icon: any; color: string; desc: string; accent: string; dimension: string }> = {
    companion: { name: 'Steward', icon: Bot, color: 'purple', desc: '您的永續日常管家，協助處理行政與學習進度。', accent: '#8b5cf6', dimension: 'Operational' },
    captain: { name: 'Captain', icon: Shield, color: 'gold', desc: '戰略指揮官，專注於深度 ROI 分析與轉型風險控管。', accent: '#fbbf24', dimension: 'Strategic' },
    phantom: { name: 'Phantom', icon: Terminal, color: 'emerald', desc: '技術稽核幽靈，負責數據底層驗證與法規合規自動化。', accent: '#10b981', dimension: 'Compliance' },
    orchestrator: { name: 'Orchestrator', icon: Network, color: 'blue', desc: '多代理協調中樞，管理複雜的 Agentic Flow 流程。', accent: '#3b82f6', dimension: 'Nexus' },
    custom: { name: 'Custom', icon: User, color: 'rose', desc: '用戶定義的專屬特殊人格。', accent: '#f43f5e', dimension: 'Specialized' }
};

const DIMENSION_ICONS: Record<string, any> = {
    'Operational': Activity,
    'Strategic': TrendingUp,
    'Compliance': ShieldCheck,
    'Nexus': Network,
    'Specialized': Sparkles
};

const NEURAL_SPARKS_CONTEXT: Record<string, string[]> = {
    [View.MY_ESG]: ["分析我目前的成長進度", "尋找下一個關鍵任務", "如何獲取更多善向幣？", "顯示成就獎章清單"],
    [View.DASHBOARD]: ["偵測異常數據節點", "分析範疇 2 排放趨勢", "預測下季度減碳潛力", "優化資源配置權重"],
    [View.STRATEGY]: ["啟動高維度情境模擬", "發起 CFO 與 CSO 戰略辯論", "識別潛在的轉型風險", "對齊科學減碳目標 (SBTi)"],
    [View.CARBON]: ["計算範疇 3 供應鏈足跡", "基準化我的排放數據", "審計電力與能源帳單", "推薦減碳路徑優化"],
    [View.ACADEMY]: ["推薦適合我的進階課程", "分析團隊技能缺口", "預約專家 Office Hour", "查看證照對齊進度"],
    [View.UNIVERSAL_AGENT]: ["自定義代理人格提示詞", "檢查核心穩定度 (Integrity)", "啟動零幻覺協議 (ZHP)", "同步全域知識圖譜"]
};

export const UniversalAgent: React.FC<UniversalAgentProps> = ({ language, onNavigate, currentView }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { agentMode, switchMode, suggestedMode, confirmSuggestion, dismissSuggestion, activeAgentProfile, addFeedback, agentLevel, agentXp, nextLevelXp } = useUniversalAgent(); 
  const { universalNotes, files, totalScore, companyName } = useCompany();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingDimension, setThinkingDimension] = useState<string>('Neural Core');
  const [showModeMenu, setShowModeMenu] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('agent_pos');
    return saved ? JSON.parse(saved) : { x: 32, y: 32 }; 
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const [historyCache, setHistoryCache] = useState<Record<string, any[]>>({});
  const historyKey = `${currentView}-${agentMode}`;
  const messages = historyCache[historyKey] || [];

  const updateHistory = useCallback((newMessages: any[]) => {
      setHistoryCache(prev => ({ ...prev, [historyKey]: newMessages }));
  }, [historyKey]);

  const currentSparks = useMemo(() => {
      return NEURAL_SPARKS_CONTEXT[currentView] || ["分析目前進度", "查看系統狀態", "獲取 AI 指導"];
  }, [currentView]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isZh ? 'zh-TW' : 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
        setInput(transcript);
        if (event.results[0].isFinal) {
          setTimeout(() => handleSend(transcript), 600);
        }
      };
      recognitionRef.current = recognition;
    }
  }, [isZh]);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else {
      setInput('');
      try { recognitionRef.current?.start(); } 
      catch (e) { addToast('error', '語音辨識啟動失敗。', 'Voice Error'); }
    }
  };

  useEffect(() => {
    let anchoredKnowledge = "";
    if (activeAgentProfile.knowledgeBase && activeAgentProfile.knowledgeBase.length > 0) {
        const selectedNotes = universalNotes.filter(n => activeAgentProfile.knowledgeBase.includes(n.id));
        const selectedFiles = files.filter(f => activeAgentProfile.knowledgeBase.includes(f.id));
        anchoredKnowledge = `\n<anchored_knowledge>\n${selectedNotes.map(n => `Note [${n.title}]: ${n.content}`).join('\n')}\n${selectedFiles.map(f => `File [${f.name}]: AI Summary - ${f.aiSummary}`).join('\n')}\n</anchored_knowledge>`;
    }

    const systemContext = `
[IDENTITY] ${activeAgentProfile.name}
[ROLE] ${activeAgentProfile.role}
[MODE] ${agentMode.toUpperCase()}
[VIEW] ${currentView}
[SYSTEM_GOAL] 協助 ${companyName} 實現永續價值最大化
[MASTERY] Level ${agentLevel}

[DIRECTIVE]
您是 ESGss 系統的萬能代理。
1. 根據視圖 "${currentView}" 提供多維度決策支援。
2. 保持專業、數據驅動且具備前瞻性。
3. 輸出包含邏輯推理與具體行動方案。
4. 若需視覺化，務必使用 json_ui 格式。
${anchoredKnowledge}`;
    
    const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = client.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: systemContext, temperature: 0.9 },
        history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
    });
  }, [currentView, agentMode, activeAgentProfile, universalNotes, files, agentLevel, companyName]);

  const handleSend = async (overrideText?: string) => {
    const userMessage = overrideText || input;
    if (!userMessage.trim() || isThinking) return;

    if (!overrideText) setInput('');
    const newMessage = { id: `u-${Date.now()}`, role: 'user', text: userMessage, timestamp: Date.now() };
    const updatedMessages = [...messages, newMessage];
    updateHistory(updatedMessages);
    setIsThinking(true);
    setThinkingDimension(MODE_METADATA[agentMode].dimension);

    try {
        const result = await chatRef.current.sendMessage({ message: userMessage });
        const botMessage = { id: `m-${Date.now()}`, role: 'model', text: result.text || "處理完成。", timestamp: Date.now() };
        updateHistory([...updatedMessages, botMessage]);
    } catch (error) {
      addToast('error', '神經鏈路中斷。', 'AI Error');
    } finally {
      setIsThinking(false);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: position.x, startPosY: position.y };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = dragRef.current.startX - e.clientX;
      const dy = dragRef.current.startY - e.clientY;
      const newX = Math.max(8, Math.min(window.innerWidth - 64, dragRef.current.startPosX + dx));
      const newY = Math.max(8, Math.min(window.innerHeight - 64, dragRef.current.startPosY + dy));
      setPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem('agent_pos', JSON.stringify(position));
      }
    };
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeModeMeta = MODE_METADATA[agentMode];
  const DimensionIcon = DIMENSION_ICONS[activeModeMeta.dimension] || Sparkles;

  if (!isOpen) {
    return (
      <div
          onMouseDown={onMouseDown}
          onClick={(e) => !isDragging && setIsOpen(true)}
          style={{ bottom: position.y, right: position.x, borderColor: activeModeMeta.accent }}
          className={`fixed z-[9999] w-16 h-16 rounded-full ios-pill flex items-center justify-center transition-all cursor-move border-2 bg-slate-900 ${isDragging ? 'scale-110 opacity-80' : 'animate-float hover:scale-110 shadow-[0_0_35px_rgba(0,0,0,0.5)]'}`}
      >
          <div className="absolute inset-0 rounded-full animate-ping opacity-15" style={{ backgroundColor: activeModeMeta.accent }} />
          <img src="https://thumbs4.imagebam.com/1f/73/e7/ME18U9GT_t.png" alt="Logo" className="w-8 h-8 relative z-10" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-black shadow-lg border border-slate-900">
             {agentLevel}
          </div>
      </div>
    );
  }

  return (
    <div style={{ bottom: position.y, right: position.x }} className="fixed z-[9999] w-[420px] h-[750px] max-h-[92vh] liquid-glass rounded-[2.8rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-white/10">
      
      {/* HUD Header: Multi-Dimensional Cockpit Style */}
      <div onMouseDown={onMouseDown} className="p-6 border-b border-white/10 bg-slate-950/40 shrink-0 cursor-move relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
                <div className="relative cursor-pointer group" onClick={() => setShowModeMenu(!showModeMenu)}>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110`} style={{ backgroundColor: `${activeModeMeta.accent}15`, borderColor: `${activeModeMeta.accent}45`, color: activeModeMeta.accent }}>
                        <activeModeMeta.icon className="w-7 h-7" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-white text-base tracking-tighter uppercase leading-none mb-1.5 flex items-center gap-2">
                        {activeAgentProfile.name}
                        <span className="px-1.5 py-0.5 bg-white/10 rounded text-[8px] font-bold text-gray-400">LV.{agentLevel}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                            <DimensionIcon className="w-3 h-3 text-gray-400" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{activeModeMeta.dimension}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase animate-pulse">Neural Linked</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => setShowModeMenu(!showModeMenu)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500 transition-colors"><Settings className="w-5 h-5" /></button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500 transition-colors"><X className="w-6 h-6" /></button>
            </div>
        </div>

        {/* Goal & Level Progress Bar */}
        <div className="mt-5 space-y-2">
            <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Target className="w-2.5 h-2.5" /> {isZh ? '全系統對齊度' : 'System Alignment'}</div>
                <span>{Math.round((agentXp/nextLevelXp)*100)}% to LV.{agentLevel + 1}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-celestial-purple via-white to-celestial-gold transition-all duration-1000" style={{ width: `${(agentXp/nextLevelXp)*100}%` }} />
            </div>
        </div>
      </div>

      {/* Mode Switch Overlay */}
      {showModeMenu && (
          <div className="absolute inset-x-0 top-[136px] bottom-0 bg-slate-950/95 backdrop-blur-3xl z-[100] p-6 animate-fade-in flex flex-col gap-6 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">切換維度核心 (Dimension Core)</h4>
                <button onClick={() => setShowModeMenu(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                  {(Object.keys(MODE_METADATA) as AgentMode[]).map(m => {
                      const meta = MODE_METADATA[m];
                      return (
                          <button 
                            key={m}
                            onClick={() => { switchMode(m); setShowModeMenu(false); }}
                            className={`group w-full p-4 rounded-3xl border text-left transition-all flex items-center gap-5 ${agentMode === m ? 'bg-white/10 border-white/20 ring-1 ring-white/10 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                          >
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: `${meta.accent}15`, color: meta.accent, border: `1px solid ${meta.accent}25` }}>
                                  <meta.icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                      <span className={`text-xs font-black uppercase tracking-tight ${agentMode === m ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{meta.name}</span>
                                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{meta.dimension}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{meta.desc}</p>
                              </div>
                              {agentMode === m && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                          </button>
                      );
                  })}
              </div>
              <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 text-celestial-gold mb-2">
                      <BarChart className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">系統概況</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <div className="text-[9px] text-gray-500 uppercase">ESG 總分</div>
                          <div className="text-sm font-bold text-white">{totalScore}</div>
                      </div>
                      <div>
                          <div className="text-[9px] text-gray-500 uppercase">決策置信度</div>
                          <div className="text-sm font-bold text-emerald-400">98.4%</div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Logic Stream Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/20 relative">
        <div className="space-y-6">
            {messages.length === 0 && (
                <div className="text-center py-24 animate-pulse">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 bg-celestial-purple/10 blur-2xl rounded-full scale-150" />
                        <img src="https://thumbs4.imagebam.com/1f/73/e7/ME18U9GT_t.png" alt="Logo" className="w-full h-full object-contain grayscale opacity-50" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-600">Cognitive Hub Standby</p>
                    <div className="flex items-center justify-center gap-4 mt-4 opacity-40">
                         <div className="flex flex-col items-center">
                            <Binary className="w-4 h-4 text-gray-700" />
                            <span className="text-[7px] mt-1">LATTICE</span>
                         </div>
                         <div className="w-px h-6 bg-gray-800" />
                         <div className="flex flex-col items-center">
                            <Globe className="w-4 h-4 text-gray-700" />
                            <span className="text-[7px] mt-1">GLOBAL</span>
                         </div>
                         <div className="w-px h-6 bg-gray-800" />
                         <div className="flex flex-col items-center">
                            <Fingerprint className="w-4 h-4 text-gray-700" />
                            <span className="text-[7px] mt-1">PERSONAL</span>
                         </div>
                    </div>
                </div>
            )}
            
            {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                    <div className={`max-w-[92%] rounded-[2rem] p-5 text-[13px] leading-relaxed shadow-2xl border transition-all hover:scale-[1.01] ${msg.role === 'user' ? 'bg-celestial-purple border-celestial-purple/30 text-white rounded-br-none' : 'bg-slate-900/80 border-white/10 text-gray-100 rounded-bl-none backdrop-blur-xl'}`}>
                        <GenerativeUIRenderer content={msg.text} />
                        {msg.role === 'model' && !isThinking && (
                            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(msg.text); addToast('success', '已複製至剪貼簿', 'System'); }} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleSend(messages[idx-1]?.text)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all" title="Retry"><RotateCw className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => { addFeedback(msg.id, 'good', currentView); addToast('success', '感謝回饋，神經元已強化對齊。', 'Neural Alignment'); }} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/30 rounded-xl text-emerald-500 transition-all border border-emerald-500/20"><ThumbsUp className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => { addFeedback(msg.id, 'bad', currentView); addToast('warning', '已標記邏輯落差，將進行權重校準。', 'Recalibration'); }} className="p-2 bg-rose-500/10 hover:bg-rose-500/30 rounded-xl text-rose-500 transition-all border border-rose-500/20"><ThumbsDown className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                    {msg.role === 'model' && (
                        <div className="mt-1 ml-4 text-[8px] font-black text-gray-700 uppercase tracking-widest">
                            Response Dimension: {MODE_METADATA[agentMode].dimension} • ZHP VERIFIED
                        </div>
                    )}
                </div>
            ))}

            {isThinking && (
              <div className="flex justify-start animate-fade-in">
                  <div className="bg-slate-900 border border-white/10 rounded-2xl rounded-bl-none p-5 flex items-center gap-4 shadow-2xl backdrop-blur-xl">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full border-2 border-celestial-purple/20 border-t-celestial-purple animate-spin" />
                        <div className="absolute inset-0 bg-celestial-purple/10 blur-md rounded-full animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">{thinkingDimension} 深度推理中...</span>
                          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-1">Cross-Referencing Knowledge Base</span>
                      </div>
                  </div>
              </div>
            )}

            {isListening && (
                <div className="flex justify-end animate-fade-in">
                    <div className="bg-celestial-purple/10 rounded-2xl rounded-br-none p-5 border border-celestial-purple/40 flex items-center gap-4 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
                        <Waves className="w-5 h-5 text-celestial-purple animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">正在聆聽語音指令...</span>
                            <span className="text-[8px] font-mono text-celestial-purple/60 uppercase tracking-widest mt-1">Neural Audio Sampling active</span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer Area: HUD Control Center */}
      <div className="shrink-0 ios-pill border-t border-white/10 p-6 space-y-5 bg-slate-950/60 relative overflow-hidden">
          
          {/* Neural Sparks - Multi-dimensional Contextual Suggestions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1 relative z-10">
             {currentSparks.map((spark, idx) => (
                 <button 
                    key={idx} 
                    onClick={() => handleSend(spark)} 
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black text-gray-400 hover:text-white rounded-2xl transition-all whitespace-nowrap uppercase tracking-widest flex items-center gap-2.5 group/spark shadow-xl"
                 >
                    <div className="p-1 bg-white/5 rounded-lg group-hover/spark:bg-celestial-gold/20 transition-colors">
                        <Sparkles className="w-3 h-3 text-celestial-gold opacity-50 group-hover/spark:opacity-100 transition-opacity" />
                    </div>
                    {spark}
                 </button>
             ))}
          </div>

          <div className="relative group/input z-10">
            <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isListening ? "聽取中..." : "下達神經指令..."}
                className={`w-full bg-black/60 border rounded-[2rem] px-6 py-6 pb-16 text-[13px] text-white outline-none transition-all resize-none font-sans leading-relaxed shadow-inner placeholder:text-gray-800 ${isListening ? 'border-celestial-purple ring-1 ring-celestial-purple/30' : 'border-white/10 focus:border-celestial-purple/50'}`}
                rows={1}
            />
            
            <div className="absolute left-6 bottom-5 flex items-center gap-5 text-gray-600">
                <button className="hover:text-white transition-all transform hover:scale-110 active:scale-90" title="上傳上下文檔案"><Paperclip className="w-5 h-5" /></button>
                <div className="w-px h-4 bg-white/10" />
                <button 
                  onClick={toggleListening}
                  className={`transition-all transform active:scale-90 ${isListening ? 'text-celestial-purple scale-125' : 'hover:text-white hover:scale-110'}`} 
                  title={isZh ? "語音模式" : "Voice Mode"}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 opacity-30" />}
                </button>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-gray-700" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Engine v15</span>
                </div>
            </div>

            <button 
                onClick={() => handleSend()} 
                className={`absolute right-3.5 bottom-3.5 p-4 rounded-[1.4rem] shadow-2xl transition-all transform active:scale-95 ${input.trim() ? 'bg-gradient-to-tr from-celestial-purple to-indigo-600 text-white scale-105 shadow-purple-500/20' : 'bg-white/5 text-gray-700'}`}
            >
                <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
              <span className="text-[7px] font-black text-gray-700 uppercase tracking-[0.5em] opacity-50">JunAiKey Neural-OS Interface • Zero Hallucination Mode</span>
          </div>
      </div>
    </div>
  );
};

const MicOff = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
        <path d="M5 10v2a7 7 0 0 0 12 5" />
        <path d="M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
);
