
import React, { useState } from 'react';
import { Language, View } from '../types';
import { 
    PenTool, Database, Grid, Copy, Save, Sparkles, BrainCircuit, 
    Search, Command, FileText, ChevronRight, Server, Table, Zap, Bot, Layout, Terminal,
    Calendar as CalendarIcon, CheckSquare, Book, Hexagon, Play, Maximize2, Minimize2, Wand2,
    Link2, ExternalLink, RefreshCw
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import UniversalBackend from './UniversalBackend';
import { UniversalAgentZone } from './UniversalAgentZone';
import { UniversalRestoration } from './Gamification';

interface UniversalToolsProps {
  language: Language;
}

// AI Smart Editor Toolbar Component
const SmartEditToolbar: React.FC<{ 
    onAction: (action: string) => void, 
    disabled: boolean,
    isZh: boolean 
}> = ({ onAction, disabled, isZh }) => {
    const tools = [
        { id: 'continue', icon: Play, label: isZh ? '續寫' : 'Continue', color: 'text-emerald-400' },
        { id: 'summarize', icon: FileText, label: isZh ? '摘要' : 'Summarize', color: 'text-blue-400' },
        { id: 'expand', icon: Maximize2, label: isZh ? '擴寫' : 'Expand', color: 'text-purple-400' },
        { id: 'shorten', icon: Minimize2, label: isZh ? '縮短' : 'Shorten', color: 'text-rose-400' },
        { id: 'action', icon: CheckSquare, label: isZh ? '行動事項' : 'To Action', color: 'text-amber-400' },
        { id: 'table', icon: Table, label: isZh ? '轉表格' : 'To Table', color: 'text-cyan-400' },
        { id: 'beautify', icon: Wand2, label: isZh ? '美化' : 'Beautify', color: 'text-celestial-gold' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2 border-b border-white/5 p-1">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => onAction(tool.id)}
                    disabled={disabled}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50 ${tool.color}`}
                    title={tool.label}
                >
                    <tool.icon className="w-3.5 h-3.5" />
                    {tool.label}
                </button>
            ))}
        </div>
    );
};

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { universalNotes, addNote, deleteNote, todos, addTodo, toggleTodo, deleteTodo, journal } = useCompany();
  
  // Expanded Tabs
  const [activeTab, setActiveTab] = useState<'agent' | 'notes' | 'journal' | 'calendar' | 'todo' | 'crystal' | 'thinktank' | 'matrix'>('agent');
  const [noteInput, setNoteInput] = useState('');
  const [isProcessingNote, setIsProcessingNote] = useState(false);
  
  // Think Tank Filter
  const [sdrFilter, setSdrFilter] = useState<'all' | 'boost'>('all');

  // --- Note Logic ---
  const handleSaveNote = () => {
      if(!noteInput.trim()) return;
      
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
      const firstLine = noteInput.split('\n')[0].substring(0, 20);
      const autoTitle = `${dateStr} - ${firstLine}...`;
      
      const keywords = ['Strategy', 'Carbon', 'Budget', 'Team', 'Meeting', 'Idea', 'Urgent'];
      const autoTags = keywords.filter(k => noteInput.toLowerCase().includes(k.toLowerCase()));
      if (autoTags.length === 0) autoTags.push('QuickNote');

      addNote(noteInput, autoTags, autoTitle);
      setNoteInput('');
      addToast('success', isZh ? '筆記已儲存 (自動標籤+雙向連結)' : 'Note saved (Auto-tag + Bi-link)', 'Universal Notes');
  };

  const handleSmartEdit = (action: string) => {
      if (!noteInput.trim()) return;
      setIsProcessingNote(true);
      addToast('info', isZh ? 'AI 正在處理您的筆記...' : 'AI processing your note...', 'Smart Edit');

      setTimeout(() => {
          let newText = noteInput;
          switch (action) {
              case 'continue':
                  newText += `\n\n[AI Continued]: Additionally, we should consider the long-term impact on our Scope 3 emissions targets...`;
                  break;
              case 'summarize':
                  newText = `**Summary:**\nThe user discussed key points regarding: ${noteInput.substring(0, 50)}...`;
                  break;
              case 'expand':
                  newText += `\n\n**Detailed Analysis:**\n1. Market Impact: High\n2. Feasibility: Moderate\n3. ROI Estimate: 15%`;
                  break;
              case 'shorten':
                  newText = noteInput.split('\n')[0] + " (Truncated for brevity)";
                  break;
              case 'action':
                  newText = noteInput.split('\n').map(line => line.trim() ? `- [ ] ${line}` : line).join('\n');
                  break;
              case 'table':
                  newText = `| Key Point | Priority | Owner |\n|---|---|---|\n| ${noteInput.substring(0, 10)}... | High | PM |\n| Analysis | Med | Analyst |`;
                  break;
              case 'beautify':
                  newText = `✨ **Enhanced Note** ✨\n\n${noteInput}\n\n🚀 *Generated by JunAiKey*`;
                  break;
          }
          setNoteInput(newText);
          setIsProcessingNote(false);
          addToast('success', isZh ? '處理完成' : 'Processing Complete', 'Smart Edit');
      }, 1500);
  };

  // --- Todo Logic ---
  const [todoInput, setTodoInput] = useState('');
  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!todoInput.trim()) return;
      addTodo(todoInput);
      setTodoInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -mt-4 -mx-4 md:-mx-6 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] bg-[#020617] relative animate-fade-in">
        
        {/* 1. Universal Command Bar (Header) */}
        <div className="shrink-0 h-14 bg-slate-900/80 border-b border-white/10 backdrop-blur-xl flex items-center px-4 md:px-6 gap-4 z-20 shadow-lg">
            <div className="flex items-center gap-2 text-celestial-purple shrink-0">
                <Command className="w-5 h-5" />
                <span className="font-bold tracking-wider hidden sm:block text-sm">{isZh ? '萬能工具' : 'TOOLS'}</span>
            </div>
            
            <div className="h-6 w-px bg-white/10 shrink-0 hidden sm:block" />

            {/* Scrollable Tabs */}
            <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar items-center mask-linear-fade pr-4">
                {[
                    { id: 'agent', label: isZh ? '代理' : 'Agent', icon: Bot },
                    { id: 'notes', label: isZh ? '筆記' : 'Notes', icon: PenTool },
                    { id: 'journal', label: isZh ? '日誌' : 'Log', icon: Book },
                    { id: 'calendar', label: isZh ? '日曆' : 'Cal', icon: CalendarIcon },
                    { id: 'todo', label: isZh ? '待辦' : 'Todo', icon: CheckSquare },
                    { id: 'crystal', label: isZh ? '水晶' : 'Crystal', icon: Hexagon },
                    { id: 'thinktank', label: isZh ? '智庫' : 'SDR', icon: Database },
                    { id: 'matrix', label: isZh ? '矩陣' : 'Matrix', icon: Grid },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border
                            ${activeTab === tab.id 
                                ? 'bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-transparent'}
                        `}
                    >
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-celestial-purple' : ''}`} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* 2. Main Content Area (Full Height) */}
        <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-24">
                
                {/* === UNIVERSAL AGENT ZONE === */}
                {activeTab === 'agent' && (
                    <div className="h-full">
                        <UniversalAgentZone language={language} />
                    </div>
                )}

                {/* === UNIVERSAL NOTES === */}
                {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[600px]">
                        {/* Input Area */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <PenTool className="w-5 h-5 text-celestial-purple" />
                                {isZh ? '萬能筆記編輯器' : 'Universal Note Editor'}
                            </h3>
                            
                            <SmartEditToolbar onAction={handleSmartEdit} disabled={isProcessingNote} isZh={isZh} />

                            <textarea 
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder={isZh ? "輸入想法、數據，或使用上方 AI 工具進行續寫、摘要、美化..." : "Capture thoughts, or use AI tools above to expand, summarize..."}
                                className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-celestial-purple/50 mb-4 font-mono text-sm leading-relaxed"
                                disabled={isProcessingNote}
                            />
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{isZh ? '支援 Markdown & 雙向連結 [[ ]]' : 'Markdown & Bi-link [[ ]] Supported'}</span>
                                <button 
                                    onClick={handleSaveNote}
                                    disabled={isProcessingNote}
                                    className="px-6 py-2 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessingNote ? <Sparkles className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} 
                                    {isZh ? '儲存' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-400" />
                                {isZh ? '最近筆記' : 'Recent Notes'}
                            </h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {universalNotes.length === 0 && (
                                    <div className="text-center text-gray-500 mt-10">
                                        {isZh ? '尚無筆記' : 'No notes yet.'}
                                    </div>
                                )}
                                {universalNotes.map(note => (
                                    <div key={note.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group relative">
                                        <div className="text-sm font-bold text-white mb-1 truncate">{note.title}</div>
                                        <div className="text-xs text-gray-400 line-clamp-2 font-mono">{note.content}</div>
                                        <div className="mt-2 flex gap-2">
                                            {note.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/30 rounded text-gray-400 border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => deleteNote(note.id)}
                                            className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === UNIVERSAL JOURNAL === */}
                {activeTab === 'journal' && (
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col bg-slate-900/50">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Book className="w-5 h-5 text-celestial-gold" />
                            {isZh ? '萬能日誌 (System Logs)' : 'Universal Journal'}
                        </h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                            {journal.map(entry => (
                                <div key={entry.id} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full mb-1 ${entry.type === 'milestone' ? 'bg-celestial-gold' : 'bg-emerald-500'}`} />
                                        <div className="w-0.5 h-full bg-white/10" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">{new Date(entry.timestamp).toLocaleString()}</div>
                                        <h4 className="font-bold text-white text-sm">{entry.title}</h4>
                                        <p className="text-xs text-gray-300 mt-1">{entry.impact}</p>
                                        <div className="flex gap-2 mt-2">
                                            {entry.tags.map(t => <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/5">{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* === UNIVERSAL CALENDAR === */}
                {activeTab === 'calendar' && (
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center text-gray-500 bg-slate-900/50">
                        <CalendarIcon className="w-16 h-16 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">{isZh ? '萬能日曆' : 'Universal Calendar'}</h3>
                        <p className="text-sm">{isZh ? '整合 Google/Outlook/Apple 行事曆的統一視圖 (即將推出)' : 'Unified view for Google/Outlook/Apple Calendars (Coming Soon)'}</p>
                    </div>
                )}

                {/* === UNIVERSAL TODO === */}
                {activeTab === 'todo' && (
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col max-w-2xl mx-auto w-full bg-slate-900/50">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                            {isZh ? '萬能待辦 (Tasks)' : 'Universal Tasks'}
                        </h3>
                        
                        <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                value={todoInput}
                                onChange={(e) => setTodoInput(e.target.value)}
                                placeholder={isZh ? "新增待辦事項..." : "Add a new task..."}
                                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                            <button type="submit" className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 font-bold hover:bg-emerald-500/30 transition-all">
                                {isZh ? '新增' : 'Add'}
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {todos.map(todo => (
                                <div key={todo.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => toggleTodo(todo.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${todo.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 hover:border-white'}`}>
                                            {todo.done && <CheckSquare className="w-3.5 h-3.5 text-black" />}
                                        </button>
                                        <span className={`${todo.done ? 'text-gray-500 line-through' : 'text-white'}`}>{todo.text}</span>
                                    </div>
                                    <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* === UNIVERSAL CRYSTAL === */}
                {activeTab === 'crystal' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <UniversalRestoration language={language} />
                    </div>
                )}

                {/* === UNIVERSAL THINK TANK === */}
                {activeTab === 'thinktank' && (
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900/50 flex flex-col h-full">
                        <div className="text-center mb-8 shrink-0">
                            <div className="w-16 h-16 rounded-full bg-celestial-gold/10 flex items-center justify-center mx-auto mb-4 border border-celestial-gold/30">
                                <Database className="w-8 h-8 text-celestial-gold" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{isZh ? '萬能智庫 (SDR Engine)' : 'Universal Think Tank'}</h3>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {isZh 
                                    ? '連接全球 ESG 數據庫、AITable 知識表與 NoCodeBackend。' 
                                    : 'Connects global ESG databases, AITable, and NoCodeBackend.'}
                            </p>
                            
                            <div className="flex justify-center gap-4 mt-6 flex-wrap">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                                    <Table className="w-3 h-3" /> AITable Linked
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                                    <Server className="w-3 h-3" /> NCB Active
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs cursor-pointer transition-all ${sdrFilter === 'boost' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-rose-500/10 text-rose-400/70 border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-400'}`} onClick={() => setSdrFilter(prev => prev === 'boost' ? 'all' : 'boost')}>
                                    <Zap className="w-3 h-3" /> Boost.Space {sdrFilter === 'boost' && '(Active)'}
                                </div>
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto w-full">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder={isZh ? "輸入問題..." : "Ask a question..."}
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-celestial-gold outline-none shadow-xl"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-celestial-gold text-black font-bold rounded-xl hover:bg-amber-400 transition-colors">
                                    <Sparkles className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['SBTi Targets', 'Scope 3', 'TCFD Risks'].map(tag => (
                                    <button key={tag} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 text-sm text-gray-300 transition-all text-left flex justify-between items-center group">
                                        {tag}
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === UNIVERSAL MATRIX === */}
                {activeTab === 'matrix' && (
                    <div className="h-full flex flex-col">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-sm flex items-center gap-2 shrink-0 mb-4">
                            <BrainCircuit className="w-5 h-5" />
                            {isZh ? '此矩陣直接連接至 AIOS Kernel，請謹慎操作。' : 'This Matrix links directly to AIOS Kernel. Operate with caution.'}
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                            <UniversalBackend />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
