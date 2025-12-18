import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Language, View, NoteItem, IntelligenceItem, UniversalTag } from '../types';
import { 
    PenTool, Database, Grid, Zap, Bot, Terminal, Activity, 
    Search, Layout, Code, ShieldCheck, RefreshCw, AlertTriangle, 
    Link2, GitBranch, Cpu, HardDrive, Network, BrainCircuit, Target,
    Wand2, ChevronRight, Save, Trash2, ListTodo, FileText, Maximize2, Sparkles, Send, Copy, Plus,
    Minimize2, AlignLeft, Brain, Loader2, GitCommit, ScrollText, CheckCircle, Crown, Trophy, HelpCircle,
    Eye, Edit3, Tag, X, Info, Settings, User
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';
import { rewriteNote, generateEngineeringChallenge, suggestUniversalTags } from '../services/ai-service';
import { GenerativeUIRenderer } from './GenerativeUIRenderer';

interface UniversalToolsProps {
  language: Language;
}

interface Challenge {
    reasoning_path: string;
    question: string;
    options: string[];
    correctIndex: number;
    technical_explanation: string;
}

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { 
    universalNotes, addNote, updateNote, awardXp, updateGoodwillBalance, 
    universalTags, addUniversalTag 
  } = useCompany();
  
  const [activeTab, setActiveTab] = useState<'notes' | 'matrix' | 'thinktank' | 'knowledge_king'>('notes');
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  
  // Note State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'editor' | 'preview'>('editor');

  // Tagging State
  const [appliedTagIds, setAppliedTagIds] = useState<string[]>([]);
  const [suggestedTagIds, setSuggestedTagIds] = useState<string[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [isTagging, setIsTagging] = useState(false);
  const [isTagPanelOpen, setIsTagPanelOpen] = useState(false);

  // New Tag Creation Modal State
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagForm, setNewTagForm] = useState({
      label: '',
      hiddenPrompt: '',
      theme: 'slate' as any,
      description: ''
  });

  // Challenge State
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
      const sub = universalIntelligence.vitals$.subscribe(setVitals);
      return () => sub.unsubscribe();
  }, []);

  const handleAiAction = async (mode: 'expand' | 'summarize' | 'condense' | 'actionable' | 'refine' | 'format') => {
      if (!noteContent.trim()) return;
      setIsAiProcessing(true);
      setAiReasoning(null);
      addToast('info', isZh ? `AI 正在進行工程化處理 [${mode.toUpperCase()}] ...` : `AI executing ${mode}...`, 'JunAiKey Engine');
      
      try {
          const result = await rewriteNote(noteContent, mode, language);
          setAiReasoning(result.reasoning);
          setTimeout(() => {
              setNoteContent(result.text);
              setIsAiProcessing(false);
              addToast('success', isZh ? '內容已完成邏輯重構' : 'Content restructured', 'AI Scribe');
          }, 1500);
      } catch (e) {
          addToast('error', isZh ? 'AI 內核同步失敗' : 'AI Sync Failed', 'Error');
          setIsAiProcessing(false);
      }
  };

  const handleAiTagging = async () => {
      if (!noteContent.trim()) return;
      setIsTagging(true);
      addToast('info', isZh ? 'AI 正在分析文本並提取特徵標籤...' : 'AI analyzing text for semantic tags...', 'Tagging Engine');
      
      try {
          const result = await suggestUniversalTags(noteContent, universalTags, language);
          setSuggestedTagIds(result.matchedTagIds.filter(id => !appliedTagIds.includes(id)));
          setSuggestedKeywords(result.suggestedNewTags);
          setIsTagPanelOpen(true);
          addToast('success', isZh ? '標籤建議已就緒' : 'Tag suggestions ready', 'AI Scribe');
      } catch (e) {
          addToast('error', 'Tagging analysis failed', 'Error');
      } finally {
          setIsTagging(false);
      }
  };

  const handleAddSuggestedTag = (id: string) => {
      setAppliedTagIds(prev => [...prev, id]);
      setSuggestedTagIds(prev => prev.filter(tid => tid !== id));
  };

  const handleRemoveTag = (id: string) => {
      setAppliedTagIds(prev => prev.filter(tid => tid !== id));
  };

  const handleCreateTagFromKeyword = (keyword: string) => {
      setNewTagForm({
          label: keyword,
          hiddenPrompt: `Act as a specialist in ${keyword}. Focus on the nuances of this domain.`,
          theme: 'emerald',
          description: `Automatically created tag for ${keyword}`
      });
      setShowTagModal(true);
  };

  const handleCreateNewTag = () => {
      if (!newTagForm.label.trim()) return;
      const id = `ut-${Date.now()}`;
      addUniversalTag({
          label: newTagForm.label,
          labelZh: newTagForm.label,
          labelEn: newTagForm.label,
          hiddenPrompt: newTagForm.hiddenPrompt,
          theme: newTagForm.theme,
          description: newTagForm.description
      });
      setAppliedTagIds(prev => [...prev, id]);
      setShowTagModal(false);
      setSuggestedKeywords(prev => prev.filter(k => k !== newTagForm.label));
      addToast('success', isZh ? '自定義標籤已鑄造' : 'Custom tag forged', 'System');
  };

  const handleGenerateChallenge = async () => {
      setIsGeneratingChallenge(true);
      setCurrentChallenge(null);
      setSelectedAnswer(null);
      setShowExplanation(false);
      
      const context = universalNotes.map(n => n.content).join('\n').substring(0, 2000);
      try {
          const challenge = await generateEngineeringChallenge(context, language);
          setCurrentChallenge(challenge);
      } catch (e) {
          addToast('error', isZh ? '召喚挑戰失敗' : 'Summon Failed', 'Error');
      } finally {
          setIsGeneratingChallenge(false);
      }
  };

  const handleAnswerSubmit = (index: number) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(index);
      setShowExplanation(true);
      
      if (index === currentChallenge?.correctIndex) {
          setScore(s => s + 100);
          awardXp(100);
          updateGoodwillBalance(50);
          addToast('reward', isZh ? '精準決策！已注入 50 善向幣並提升 XP' : 'Strategic Accuracy! +50 GWC', '萬能知識王');
      } else {
          addToast('warning', isZh ? '邏輯路徑偏差，請檢視推理過程' : 'Logic Mismatch', '系統稽核');
      }
  };

  const handleSaveNote = () => {
      if (!noteContent.trim()) return;
      if (editingId) {
          updateNote(editingId, noteContent, noteTitle);
          // TODO: Store appliedTagIds in a more formal link if needed, 
          // though NoteItem's universalTags field handles this.
          addToast('success', isZh ? '筆記資產已同步至雲端' : 'Asset synced', '系統中心');
      } else {
          addNote(noteContent, ['工程化'], noteTitle || undefined, appliedTagIds);
          addToast('success', isZh ? '新筆記已錄入永恆宮殿' : 'New note scribed', '系統中心');
      }
  };

  const handleNoteSelect = (note: NoteItem) => {
    setEditingId(note.id);
    setNoteContent(note.content);
    setNoteTitle(note.title);
    setAppliedTagIds(note.universalTags || []);
    setSuggestedTagIds([]);
    setSuggestedKeywords([]);
    setAiReasoning(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-[#020617] rounded-[2.8rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500">
        {/* Header Tabs */}
        <div className="shrink-0 h-16 bg-slate-900/80 border-b border-white/10 flex items-center px-10 gap-8">
            <Terminal className="w-7 h-7 text-celestial-purple" />
            <div className="flex ios-pill p-1.5 rounded-2xl border border-white/10 bg-black/40">
                {[
                    { id: 'notes', label: isZh ? '工程化筆記' : 'Engineering Notes', icon: PenTool },
                    { id: 'knowledge_king', label: isZh ? '萬能知識王' : 'Knowledge King', icon: Crown },
                    { id: 'matrix', label: isZh ? '調試矩陣' : 'Logic Matrix', icon: Activity },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-6 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === tab.id ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}>
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-hidden">
            {activeTab === 'notes' && (
                <div className="flex h-full animate-fade-in overflow-hidden">
                    <div className="w-80 border-r border-white/10 flex flex-col bg-black/25 shrink-0">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">{isZh ? '我的筆記資產庫' : 'Asset Archives'}</h4>
                            <button onClick={() => { setEditingId(null); setNoteContent(''); setNoteTitle(''); setAppliedTagIds([]); setSuggestedTagIds([]); setSuggestedKeywords([]); setAiReasoning(null); }} className="p-2 hover:bg-celestial-purple/20 rounded-xl text-celestial-purple transition-all"><Plus className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                            {universalNotes.length === 0 ? (
                                <div className="text-center py-10 opacity-20"><FileText className="w-10 h-10 mx-auto mb-2"/><span className="text-[10px] uppercase font-black">庫存為空</span></div>
                            ) : universalNotes.map(note => (
                                <button key={note.id} onClick={() => handleNoteSelect(note)} className={`w-full text-left p-5 rounded-[1.5rem] transition-all border ${editingId === note.id ? 'bg-celestial-purple/10 border-celestial-purple/40 shadow-xl' : 'hover:bg-white/5 border-transparent'}`}>
                                    <div className="text-[13px] font-black text-white truncate mb-1.5">{note.title}</div>
                                    <div className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed opacity-70">{note.content.replace(/#|\[|\]/g, '')}</div>
                                    {note.universalTags && note.universalTags.length > 0 && (
                                        <div className="flex gap-1 mt-3 overflow-hidden">
                                            {note.universalTags.slice(0, 3).map(tid => {
                                                const tag = universalTags.find(t => t.id === tid);
                                                return tag ? <div key={tid} className={`w-1.5 h-1.5 rounded-full bg-${tag.theme}-500`} /> : null;
                                            })}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col relative bg-[#020617]">
                        <div className="h-16 border-b border-white/10 flex items-center px-8 justify-between shrink-0 bg-white/5 backdrop-blur-3xl relative z-10">
                            <div className="flex items-center gap-2">
                                {[
                                    { id: 'expand', label: isZh ? '擴充計畫' : 'Expand', icon: Maximize2, color: 'hover:text-emerald-400' },
                                    { id: 'summarize', label: isZh ? '核心摘要' : 'Summary', icon: FileText, color: 'hover:text-blue-400' },
                                    { id: 'refine', label: isZh ? '專業潤飾' : 'Refine', icon: Wand2, color: 'hover:text-purple-400' },
                                    { id: 'format', label: isZh ? '自動排版' : 'Smart Format', icon: Layout, color: 'hover:text-celestial-gold' },
                                ].map(btn => (
                                    <button key={btn.id} onClick={() => handleAiAction(btn.id as any)} disabled={isAiProcessing || !noteContent.trim()} className={`px-3 py-2 rounded-2xl text-[10px] font-black text-gray-400 ${btn.color} hover:bg-white/10 transition-all flex items-center gap-2 border border-transparent hover:border-white/10`}>
                                        <btn.icon className="w-4 h-4" />
                                        <span className="uppercase tracking-widest hidden sm:inline">{btn.label}</span>
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-white/10 mx-2" />
                                <button onClick={handleAiTagging} disabled={isTagging || !noteContent.trim()} className={`px-3 py-2 rounded-2xl text-[10px] font-black text-gray-400 hover:text-celestial-gold hover:bg-white/10 transition-all flex items-center gap-2 border border-transparent hover:border-white/10`}>
                                    {isTagging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                                    <span className="uppercase tracking-widest hidden sm:inline">{isZh ? 'AI 標籤分析' : 'AI Tagging'}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                    <button onClick={() => setEditMode('editor')} className={`p-2 rounded-lg transition-all ${editMode === 'editor' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`} title="Edit"><Edit3 className="w-4 h-4" /></button>
                                    <button onClick={() => setEditMode('preview')} className={`p-2 rounded-lg transition-all ${editMode === 'preview' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`} title="Preview"><Eye className="w-4 h-4" /></button>
                                </div>
                                <button onClick={handleSaveNote} className="px-6 py-2 bg-gradient-to-r from-celestial-purple to-indigo-600 text-white text-xs font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-purple-500/20 uppercase tracking-widest">{isZh ? '儲存' : 'Save'}</button>
                            </div>
                        </div>

                        {/* Tag Management Bar */}
                        <div className="px-10 py-4 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center gap-3 animate-fade-in">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2 flex items-center gap-2"><Tag className="w-3 h-3" /> {isZh ? '已套用標籤' : 'Applied Tags'}</span>
                            {appliedTagIds.map(tid => {
                                const tag = universalTags.find(t => t.id === tid);
                                if (!tag) return null;
                                return (
                                    <div key={tid} className={`px-3 py-1 rounded-full bg-${tag.theme}-500/10 border border-${tag.theme}-500/30 flex items-center gap-2 group transition-all hover:bg-${tag.theme}-500/20`}>
                                        <div className={`w-1.5 h-1.5 rounded-full bg-${tag.theme}-500 shadow-[0_0_5px_var(--tw-shadow-color)]`} />
                                        <span className="text-[11px] font-bold text-white uppercase tracking-tight">{isZh ? tag.labelZh : tag.labelEn}</span>
                                        <button onClick={() => handleRemoveTag(tid)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3 text-gray-400 hover:text-white" /></button>
                                    </div>
                                );
                            })}
                            {appliedTagIds.length === 0 && <span className="text-[10px] italic text-gray-700">None</span>}
                            
                            <button onClick={() => setIsTagPanelOpen(!isTagPanelOpen)} className="ml-auto text-[10px] font-black text-celestial-gold uppercase tracking-widest hover:underline flex items-center gap-1">
                                {isTagPanelOpen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                                {isZh ? (isTagPanelOpen ? '隱藏建議' : '顯示 AI 建議') : (isTagPanelOpen ? 'Hide Sug' : 'Show Sug')}
                            </button>
                        </div>

                        {/* AI Suggestions Drawer */}
                        {isTagPanelOpen && (
                            <div className="px-10 py-6 bg-slate-900/60 border-b border-white/10 animate-slide-down space-y-4">
                                <div>
                                    <h5 className="text-[10px] font-black text-celestial-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3" /> {isZh ? '現有標籤庫匹配' : 'Library Matches'}</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedTagIds.length === 0 ? <span className="text-[10px] text-gray-600">No matching library tags.</span> : suggestedTagIds.map(tid => {
                                            const tag = universalTags.find(t => t.id === tid);
                                            return tag ? (
                                                <button key={tid} onClick={() => handleAddSuggestedTag(tid)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                                                    <Plus className="w-3 h-3" />
                                                    {isZh ? tag.labelZh : tag.labelEn}
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Brain className="w-3 h-3" /> {isZh ? '發現新關鍵字' : 'Identified Keywords'}</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedKeywords.length === 0 ? <span className="text-[10px] text-gray-600">No new keywords identified.</span> : suggestedKeywords.map(k => (
                                            <button key={k} onClick={() => handleCreateTagFromKeyword(k)} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-2">
                                                <Plus className="w-3 h-3" />
                                                {k}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 flex flex-col p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-celestial-purple/5 via-transparent to-transparent pointer-events-none" />
                            <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder={isZh ? "請輸入標題..." : "Untitled Scribe..."} className="w-full bg-transparent border-none outline-none text-3xl md:text-4xl font-black text-white placeholder-gray-900 tracking-tighter mb-6 focus:placeholder-gray-800 transition-all shrink-0" />
                            
                            <div className="flex-1 overflow-hidden flex flex-col">
                                {editMode === 'editor' ? (
                                    <textarea 
                                        value={noteContent} 
                                        onChange={(e) => setNoteContent(e.target.value)} 
                                        placeholder={isZh ? "在此輸入永續策略想法、會議記錄或行動草案..." : "Type strategic drafts..."} 
                                        className="w-full flex-1 bg-white/[0.01] rounded-[2rem] p-8 text-gray-200 text-lg leading-relaxed outline-none resize-none focus:bg-white/[0.03] transition-all custom-scrollbar border border-white/5" 
                                    />
                                ) : (
                                    <div className="w-full flex-1 bg-white/[0.01] rounded-[2rem] p-8 overflow-y-auto custom-scrollbar border border-white/5 markdown-container">
                                        <GenerativeUIRenderer content={noteContent} />
                                    </div>
                                )}
                            </div>

                            {aiReasoning && (
                                <div className="mt-6 p-6 bg-black/60 border border-white/15 rounded-[1.8rem] animate-slide-up shadow-2xl relative overflow-hidden group shrink-0">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-celestial-gold" />
                                    <div className="flex items-center gap-3 mb-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]"><GitBranch className="w-4 h-4 text-celestial-gold" /> {isZh ? 'JunAiKey 推理軌跡' : 'Neural Reasoning'}</div>
                                    <div className="font-mono text-[11px] text-emerald-500/90 whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto no-scrollbar">{aiReasoning}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'knowledge_king' && (
                <div className="h-full flex flex-col p-12 animate-fade-in bg-[#020617] relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)] pointer-events-none" />
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <div>
                            <h3 className="text-4xl font-black text-white tracking-tighter flex items-center gap-5">
                                <Crown className="w-12 h-12 text-celestial-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                {isZh ? '萬能知識王：永續深度對決' : 'Knowledge King Duel'}
                            </h3>
                            <p className="text-gray-500 text-lg mt-2 font-medium">{isZh ? '基於您的個人智庫與全域 ESG 邏輯的深度推理挑戰。' : 'Reasoning tests grounded in your data.'}</p>
                        </div>
                        <div className="flex items-center gap-10">
                             <div className="text-right">
                                <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">{isZh ? '當前積分' : 'Neural Score'}</div>
                                <div className="text-5xl font-black text-celestial-gold tracking-tighter">{score}</div>
                             </div>
                             <button onClick={handleGenerateChallenge} disabled={isGeneratingChallenge} className="px-10 py-5 bg-celestial-purple text-white font-black rounded-[1.8rem] hover:bg-purple-600 transition-all flex items-center gap-4 shadow-2xl shadow-purple-500/30 disabled:opacity-50 hover:scale-105 active:scale-95">
                                {isGeneratingChallenge ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                                <span className="uppercase tracking-widest">{isZh ? '召喚挑戰' : 'Summon Challenge'}</span>
                             </button>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-0 relative z-10">
                        <div className="liquid-glass p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col border-white/15">
                            {!currentChallenge && !isGeneratingChallenge ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                                    <HelpCircle className="w-32 h-32 text-gray-600 mb-8" />
                                    <p className="text-lg font-black uppercase tracking-[0.5em]">{isZh ? '準備就緒，請開啟挑戰' : 'Proctor ready.'}</p>
                                </div>
                            ) : isGeneratingChallenge ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-celestial-gold border-t-transparent animate-spin" />
                                        <div className="absolute inset-0 bg-celestial-gold/10 blur-2xl rounded-full" />
                                    </div>
                                    <p className="text-sm font-black text-celestial-gold animate-pulse uppercase tracking-[0.4em]">{isZh ? '正在編織邏輯考驗...' : 'Weaving challenge...'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-12">
                                        <div className="px-5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] w-fit mb-8">{isZh ? '難度等級: 戰略長' : 'Level: Strategic Architect'}</div>
                                        <h4 className="text-3xl font-black text-white leading-tight tracking-tight">{currentChallenge.question}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 flex-1 overflow-y-auto pr-4 no-scrollbar">
                                        {currentChallenge.options.map((opt, i) => (
                                            <button key={i} onClick={() => handleAnswerSubmit(i)} disabled={selectedAnswer !== null} className={`group p-8 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between shadow-lg ${selectedAnswer === null ? 'bg-white/5 border-white/10 hover:border-celestial-purple/60 hover:bg-white/10' : i === currentChallenge.correctIndex ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400' : selectedAnswer === i ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 opacity-100' : 'bg-white/5 border-transparent opacity-30'}`}>
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${selectedAnswer === null ? 'bg-slate-800 text-gray-400' : i === currentChallenge.correctIndex ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-gray-500'}`}>{String.fromCharCode(65 + i)}</div>
                                                    <span className="text-lg font-bold">{opt}</span>
                                                </div>
                                                {selectedAnswer !== null && i === currentChallenge.correctIndex && <CheckCircle className="w-8 h-8 animate-bounce" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col gap-10">
                            <div className="glass-panel flex-1 rounded-[3.5rem] border border-white/10 bg-black/40 p-10 flex flex-col shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><GitBranch className="w-40 h-40" /></div>
                                <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-8">
                                    <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400"><GitBranch className="w-7 h-7" /></div>
                                    <h5 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">{isZh ? '系統推理軌跡與解析' : 'AI Reasoning Path'}</h5>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[14px] text-emerald-500/90 leading-relaxed space-y-8">
                                    {currentChallenge ? (
                                        <div className="space-y-8">
                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10"><span className="text-white font-black opacity-40 tracking-widest text-[10px] mb-3 block">>> 初始化檢索 (INIT)</span>{currentChallenge.reasoning_path}</div>
                                            {showExplanation && (
                                                <div className="p-8 bg-celestial-gold/15 rounded-[2.5rem] border border-celestial-gold/30 animate-slide-up shadow-2xl relative">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-16 h-16 text-celestial-gold" /></div>
                                                    <span className="text-celestial-gold font-black tracking-widest text-[10px] mb-3 block">>> 邏輯校驗 (VERIFICATION)</span>
                                                    <div className="text-white font-medium">{currentChallenge.technical_explanation}</div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-700 italic px-10 text-center uppercase tracking-widest text-xs">等待邏輯具現化...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'matrix' && (
                <div className="h-full p-12 animate-fade-in flex flex-col items-center justify-center text-gray-600 opacity-30">
                    <Activity className="w-32 h-32 mb-8" />
                    <p className="text-2xl font-black uppercase tracking-[0.6em]">System Debug Matrix: OFFLINE</p>
                </div>
            )}
        </div>

        {/* Modal for Creating New Universal Tag with AI Attributes */}
        {showTagModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
                <div className="max-w-xl w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Settings className="w-48 h-48 text-white" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-8 shrink-0 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-celestial-gold" />
                                {isZh ? '鑄造萬能標籤' : 'Forge Universal Tag'}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Define hidden attributes and AI behaviors.</p>
                        </div>
                        <button onClick={() => setShowTagModal(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6"/></button>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar relative z-10 pr-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isZh ? '標籤顯示名稱' : 'Label'}</label>
                            <input 
                                value={newTagForm.label}
                                onChange={e => setNewTagForm({...newTagForm, label: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-celestial-purple uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Bot className="w-3 h-3" />
                                {isZh ? '隱藏提示詞 (AI 注入)' : 'Hidden Prompt (AI Injection)'}
                            </label>
                            <textarea 
                                value={newTagForm.hiddenPrompt}
                                onChange={e => setNewTagForm({...newTagForm, hiddenPrompt: e.target.value})}
                                placeholder="Instructions given to the AI whenever this tag is active..."
                                className="w-full h-24 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 focus:border-celestial-purple/50 outline-none resize-none leading-relaxed"
                            />
                            <p className="text-[9px] text-gray-600 italic">This prompt influences the persona when the note is used as a knowledge anchor.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isZh ? '顏色特徵 (Theme)' : 'Theme Color'}</label>
                                <select 
                                    value={newTagForm.theme}
                                    onChange={e => setNewTagForm({...newTagForm, theme: e.target.value as any})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none appearance-none cursor-pointer"
                                >
                                    {['gold', 'purple', 'emerald', 'blue', 'rose', 'slate'].map(t => (
                                        <option key={t} value={t}>{t.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isZh ? '說明描述' : 'Description'}</label>
                                <input 
                                    value={newTagForm.description}
                                    onChange={e => setNewTagForm({...newTagForm, description: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-celestial-gold/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4 shrink-0 relative z-10">
                        <button 
                            onClick={() => setShowTagModal(false)}
                            className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-black text-gray-500 hover:bg-white/5 transition-all uppercase tracking-widest"
                        >
                            {isZh ? '取消' : 'Cancel'}
                        </button>
                        <button 
                            onClick={handleCreateNewTag}
                            className="flex-1 py-4 bg-celestial-gold text-black font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest"
                        >
                            {isZh ? '確認鑄造' : 'Confirm Forge'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
