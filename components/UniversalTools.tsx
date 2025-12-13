
import React, { useState } from 'react';
import { Language, View } from '../types';
import { 
    PenTool, Database, Grid, Copy, Save, Sparkles, BrainCircuit, 
    Search, Command, FileText, ChevronRight, Server, Table, Zap
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import UniversalBackend from './UniversalBackend';

interface UniversalToolsProps {
  language: Language;
}

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { universalNotes, addNote, updateNote, deleteNote } = useCompany();
  
  const [activeTab, setActiveTab] = useState<'notes' | 'thinktank' | 'matrix'>('notes');
  const [noteInput, setNoteInput] = useState('');
  
  const pageData = {
      title: { zh: '萬能工具 (Universal Tools)', en: 'Universal Tools' },
      desc: { zh: '集結筆記、智庫與核心矩陣的萬能工作站', en: 'The All-in-One Workstation: Notes, Think Tank & Matrix' },
      tag: { zh: '萬能系列', en: 'Universal Series' }
  };

  const handleAddNote = () => {
      if(!noteInput.trim()) return;
      addNote(noteInput, ['QuickNote']);
      setNoteInput('');
      addToast('success', isZh ? '筆記已儲存至萬能記憶' : 'Note saved to Universal Memory', 'Universal Notes');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 h-[calc(100vh-140px)] flex flex-col">
        <div className="shrink-0">
            <UniversalPageHeader 
                icon={Command}
                title={pageData.title}
                description={pageData.desc}
                language={language}
                tag={pageData.tag}
            />
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit shrink-0">
            {[
                { id: 'notes', label: isZh ? '萬能筆記' : 'Universal Notes', icon: PenTool },
                { id: 'thinktank', label: isZh ? '萬能智庫' : 'Think Tank', icon: Database },
                { id: 'matrix', label: isZh ? '萬能矩陣 (Backend)' : 'The Matrix (Backend)', icon: Grid },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* === UNIVERSAL NOTES === */}
        {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Input Area */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-celestial-purple" />
                        {isZh ? '快速紀錄' : 'Quick Capture'}
                    </h3>
                    <textarea 
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder={isZh ? "輸入想法、數據或 AI 指令..." : "Capture thoughts, data, or AI prompts..."}
                        className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-celestial-purple/50 mb-4"
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{isZh ? '支援 Markdown 語法' : 'Markdown Supported'}</span>
                        <button 
                            onClick={handleAddNote}
                            className="px-6 py-2 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> {isZh ? '儲存' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* List Area */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col">
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
                                <div className="text-sm font-bold text-white mb-1">{note.title}</div>
                                <div className="text-xs text-gray-400 line-clamp-2">{note.content}</div>
                                <div className="mt-2 flex gap-2">
                                    {note.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/30 rounded text-gray-400">{tag}</span>
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

        {/* === UNIVERSAL THINK TANK === */}
        {activeTab === 'thinktank' && (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900/50 flex flex-col flex-1 min-h-0">
                <div className="text-center mb-8 shrink-0">
                    <div className="w-16 h-16 rounded-full bg-celestial-gold/10 flex items-center justify-center mx-auto mb-4 border border-celestial-gold/30">
                        <Database className="w-8 h-8 text-celestial-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{isZh ? '萬能智庫 (SDR Engine)' : 'Universal Think Tank'}</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {isZh 
                            ? '連接全球 ESG 數據庫、AITable 知識表與 NoCodeBackend。向 AI 提問，獲得經過驗證的精準答案。' 
                            : 'Connects global ESG databases, AITable, and NoCodeBackend. Ask AI for verified, precise answers.'}
                    </p>
                    
                    {/* Integration Indicators */}
                    <div className="flex justify-center gap-4 mt-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                            <Table className="w-3 h-3" /> AITable Linked
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                            <Server className="w-3 h-3" /> NoCodeBackend Active
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto w-full">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder={isZh ? "輸入問題 (例如：歐盟 CBAM 鋼鐵業申報規範...)" : "Ask a question (e.g., EU CBAM reporting for steel...)"}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-celestial-gold outline-none shadow-xl"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-celestial-gold text-black font-bold rounded-xl hover:bg-amber-400 transition-colors">
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['SBTi Targets', 'Scope 3 Calculation', 'TCFD Risks'].map(tag => (
                            <button key={tag} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 text-sm text-gray-300 transition-all text-left flex justify-between items-center group">
                                {tag}
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* === UNIVERSAL MATRIX (Merged Backend) === */}
        {activeTab === 'matrix' && (
            <div className="space-y-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-sm flex items-center gap-2 shrink-0">
                    <BrainCircuit className="w-5 h-5" />
                    {isZh ? '此矩陣直接連接至 AIOS Kernel，請謹慎操作。' : 'This Matrix links directly to AIOS Kernel. Operate with caution.'}
                </div>
                <div className="flex-1">
                    <UniversalBackend />
                </div>
            </div>
        )}
    </div>
  );
};
