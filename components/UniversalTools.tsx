
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, View } from '../types';
import { 
    PenTool, Database, Grid, Copy, Save, Sparkles, BrainCircuit, 
    Search, Command, FileText, ChevronRight, Server, Table, Zap, Bot, Layout, Terminal,
    Calendar as CalendarIcon, CheckSquare, Book, Hexagon, Play, Maximize2, Minimize2, Wand2,
    Link2, ExternalLink, RefreshCw, UploadCloud, MessageCircle, Hash, Trash2, Plus, X, Tag,
    Scissors, Link as LinkIcon
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
    onLink: () => void,
    disabled: boolean,
    isZh: boolean 
}> = ({ onAction, onLink, disabled, isZh }) => {
    const tools = [
        { id: 'format', icon: Layout, label: isZh ? '自動排版' : 'Auto Format', color: 'text-indigo-400' },
        { id: 'expand', icon: Maximize2, label: isZh ? '擴寫' : 'Expand', color: 'text-purple-400' },
        { id: 'summarize', icon: FileText, label: isZh ? '摘要' : 'Summarize', color: 'text-blue-400' },
        { id: 'condense', icon: Minimize2, label: isZh ? '精簡' : 'Condense', color: 'text-orange-400' },
        { id: 'refine', icon: Wand2, label: isZh ? '潤飾' : 'Refine', color: 'text-celestial-gold' },
        { id: 'action', icon: CheckSquare, label: isZh ? '行動事項' : 'Action Items', color: 'text-emerald-400' },
        { id: 'continue', icon: Play, label: isZh ? '續寫' : 'Continue', color: 'text-green-400' },
        { id: 'fix', icon: RefreshCw, label: isZh ? '修正語法' : 'Fix Grammar', color: 'text-cyan-400' },
        { id: 'tone', icon: MessageCircle, label: isZh ? '轉換語氣' : 'Change Tone', color: 'text-rose-400' },
    ];

    return (
        <div className="w-full">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-3 mb-2 border-b border-white/5 p-1 w-full">
                <button
                    onClick={onLink}
                    disabled={disabled}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-celestial-purple/20 hover:bg-celestial-purple/30 border border-celestial-purple/30 transition-all text-xs font-bold text-celestial-purple whitespace-nowrap disabled:opacity-50 shrink-0"
                    title="Insert Link"
                >
                    <LinkIcon className="w-3.5 h-3.5" />
                    {isZh ? '連結' : 'Link'}
                </button>
                <div className="w-px h-6 bg-white/10 shrink-0 mx-1" />
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => onAction(tool.id)}
                        disabled={disabled}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50 shrink-0 ${tool.color}`}
                        title={tool.label}
                    >
                        <tool.icon className="w-3.5 h-3.5" />
                        {tool.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { universalNotes, addNote, deleteNote, todos, addTodo, toggleTodo, deleteTodo, journal, saveIntelligence } = useCompany();
  
  // Expanded Tabs
  const [activeTab, setActiveTab] = useState<'universal_agent' | 'notes' | 'journal' | 'calendar' | 'todo' | 'thinktank' | 'matrix'>('notes');
  const [noteInput, setNoteInput] = useState('');
  const [isProcessingNote, setIsProcessingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  
  // AI Tagging Review State
  const [showMetaReview, setShowMetaReview] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Think Tank Filter
  const [sdrFilter, setSdrFilter] = useState<'all' | 'boost'>('all');

  const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // --- Note Logic ---

  const handleSmartEdit = async (action: string) => {
      if (!noteInput.trim()) return;
      setIsProcessingNote(true);
      addToast('info', isZh ? 'AI 正在處理您的筆記...' : 'AI processing your note...', 'Gemini Engine');

      try {
          let prompt = "";
          let systemInstruction = "You are an expert editor. Output ONLY the processed text without conversational filler.";

          switch (action) {
              case 'format':
                  prompt = "Analyze the structure of the following text and reformat it for maximum readability. Use Markdown features like headers (#, ##), bullet points (-), bold (**text**) for key terms, and code blocks (```) where appropriate. Organize loosely related points into logical sections. Do not change the original meaning:";
                  break;
              case 'expand': 
                  prompt = "Expand upon the following text, adding relevant details, depth, and context to make it more comprehensive:"; 
                  break;
              case 'summarize': 
                  prompt = "Summarize the following text into key bullet points:"; 
                  break;
              case 'condense':
                  prompt = "Condense the following text to be as concise and direct as possible, removing unnecessary words without losing the core meaning:";
                  break;
              case 'refine': 
                  prompt = "Refine the writing style of the following text to be more professional, polished, and clear:"; 
                  break;
              case 'action': 
                  prompt = "Analyze the text and extract a list of clear, actionable tasks/items (Markdown format):"; 
                  break;
              case 'continue': 
                  prompt = "Continue writing the following text naturally, adding 2-3 sentences:"; 
                  break;
              case 'fix':
                  prompt = "Fix grammar and spelling errors in the following text:";
                  break;
              case 'tone':
                  prompt = "Rewrite the following text to be more persuasive and executive-level:";
                  break;
              default: 
                  prompt = "Improve the following text:";
          }

          const response = await client.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [{ role: 'user', parts: [{ text: `${prompt}\n\n"${noteInput}"` }] }],
              config: { systemInstruction }
          });

          if (response.text) {
              setNoteInput(response.text.trim());
              addToast('success', isZh ? '處理完成' : 'Processing Complete', 'AI Editor');
          }
      } catch (e) {
          console.error(e);
          addToast('error', 'AI Service Unavailable', 'Error');
      } finally {
          setIsProcessingNote(false);
      }
  };

  const handleInsertLink = () => {
      setNoteInput(prev => prev + "[[Link]]");
  };

  const handleAnalyzeNote = async () => {
      if(!noteInput.trim()) return;
      setIsProcessingNote(true);
      
      try {
          // AI Analysis for Meta Data
          const analysisPrompt = `
            Act as an intelligent knowledge organizer. Analyze the provided note content.
            The content may contain Traditional Chinese (zh-TW) and English.
            
            Tasks:
            1. Generate a concise, descriptive title (max 10 words).
            2. Extract 3-5 relevant tags based on keywords, entities, and themes. 
               - If the content discusses specific projects, people, or technologies, tag them.
               - Include both Chinese and English tags if the content is bilingual or if the term is commonly known in English (e.g., 'ESG', 'AI').
            
            Return strictly JSON: { "title": "string", "tags": ["string", "string"] }
          `;
          
          const response = await client.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [{ role: 'user', parts: [{ text: analysisPrompt }, { text: noteInput }] }],
              config: { responseMimeType: 'application/json' }
          });

          const result = JSON.parse(response.text || '{}');
          setGeneratedTitle(result.title || `Note ${new Date().toLocaleDateString()}`);
          setGeneratedTags(result.tags || ['QuickNote']);
          setShowMetaReview(true);
          addToast('success', isZh ? 'AI 已生成建議標籤，請確認。' : 'AI tags generated. Please review.', 'Tagging Agent');
      } catch (e) {
          // Fallback if AI fails
          setGeneratedTitle(`Note ${new Date().toLocaleDateString()}`);
          setGeneratedTags(['Manual']);
          setShowMetaReview(true);
          addToast('warning', 'AI Analysis failed, manual review required.', 'Universal Notes');
      } finally {
          setIsProcessingNote(false);
      }
  };

  const handleAddTag = () => {
      if (newTagInput.trim() && !generatedTags.includes(newTagInput.trim())) {
          setGeneratedTags([...generatedTags, newTagInput.trim()]);
          setNewTagInput('');
      }
  };

  const handleRemoveTag = (tagToRemove: string) => {
      setGeneratedTags(generatedTags.filter(t => t !== tagToRemove));
  };

  const handleFinalSave = () => {
      addNote(noteInput, generatedTags, generatedTitle);
      setNoteInput('');
      setGeneratedTitle('');
      setGeneratedTags([]);
      setShowMetaReview(false);
      addToast('success', isZh ? '筆記已儲存至資料庫' : 'Note saved to database', 'Universal Notes');
  };

  const handlePushToHub = (note: any) => {
      saveIntelligence({
          id: `intel-${Date.now()}`,
          type: 'report',
          title: note.title,
          source: 'Universal Notes',
          date: new Date().toISOString(),
          summary: note.content.substring(0, 150) + '...',
          tags: [...note.tags, 'User Note'],
          isRead: true
      });
      addToast('success', isZh ? '已同步至知識中樞' : 'Synced to Knowledge Hub', 'Memory Core');
  };

  const handleAskNotes = async () => {
      if (!searchQuery.trim()) return;
      setIsProcessingNote(true);
      
      // RAG-lite: Contextualize with filtered notes
      const context = filteredNotes.map(n => `Title: ${n.title}\nContent: ${n.content}\nTags: ${n.tags.join(', ')}`).join('\n---\n');
      
      try {
          const response = await client.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [{ role: 'user', parts: [{ text: `
                Context from user notes:
                ${context}
                
                User Question: ${searchQuery}
                
                Answer the question based ONLY on the notes provided. If the answer is not in the notes, say so.
              ` }] }]
          });
          setAiAnswer(response.text || "No insights found.");
      } catch (e) {
          setAiAnswer("AI Service Error.");
      } finally {
          setIsProcessingNote(false);
      }
  };

  const handleLinkClick = (title: string) => {
      setSearchQuery(title);
      addToast('info', isZh ? `已篩選連結筆記：${title}` : `Filtering linked note: ${title}`, 'Knowledge Graph');
  };

  // Filter Notes
  const filteredNotes = useMemo(() => {
      return universalNotes.filter(n => 
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [universalNotes, searchQuery]);

  // --- Todo Logic ---
  const [todoInput, setTodoInput] = useState('');
  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!todoInput.trim()) return;
      addTodo(todoInput);
      setTodoInput('');
  };

  const renderNoteContentWithLinks = (content: string) => {
      // Basic splitting for [[Link]] syntax
      const parts = content.split(/(\[\[.*?\]\])/g);
      return parts.map((part, index) => {
          if (part.startsWith('[[') && part.endsWith(']]')) {
              const linkTarget = part.slice(2, -2);
              return (
                  <button 
                    key={index} 
                    onClick={(e) => { e.stopPropagation(); handleLinkClick(linkTarget); }}
                    className="text-celestial-purple hover:underline font-bold inline-flex items-center gap-0.5 mx-0.5"
                  >
                      <Link2 className="w-3 h-3" />
                      {linkTarget}
                  </button>
              );
          }
          return <span key={index}>{part}</span>;
      });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full bg-[#020617] rounded-3xl border border-white/10 relative overflow-hidden animate-fade-in shadow-2xl">
        
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
                    { id: 'notes', label: isZh ? '筆記' : 'Notes', icon: PenTool },
                    { id: 'universal_agent', label: isZh ? '萬能代理' : 'Universal Agent', icon: Bot },
                    { id: 'journal', label: isZh ? '日誌' : 'Log', icon: Book },
                    { id: 'calendar', label: isZh ? '日曆' : 'Cal', icon: CalendarIcon },
                    { id: 'todo', label: isZh ? '待辦' : 'Todo', icon: CheckSquare },
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
        <div className="flex-1 overflow-hidden relative bg-slate-950/50">
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-24">
                
                {/* === UNIVERSAL NOTES === */}
                {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[600px]">
                        {/* Input Area */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <PenTool className="w-5 h-5 text-celestial-purple" />
                                {isZh ? '萬能筆記編輯器' : 'Universal Note Editor'}
                            </h3>
                            
                            {/* Toolbar with Scrollbar */}
                            <SmartEditToolbar 
                                onAction={handleSmartEdit} 
                                onLink={handleInsertLink}
                                disabled={isProcessingNote || showMetaReview} 
                                isZh={isZh} 
                            />

                            <textarea 
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder={isZh ? "輸入想法，使用 [[ ]] 建立連結，或使用工具列..." : "Capture thoughts, link with [[ ]], or use AI tools..."}
                                className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-celestial-purple/50 mb-4 font-mono text-sm leading-relaxed"
                                disabled={isProcessingNote || showMetaReview}
                            />
                            
                            {/* AI Tagging Review Area */}
                            {showMetaReview ? (
                                <div className="bg-celestial-purple/10 border border-celestial-purple/30 rounded-xl p-4 animate-fade-in mb-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-xs font-bold text-celestial-purple uppercase flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            {isZh ? 'AI 建議標籤與標題' : 'AI Suggested Meta'}
                                        </h4>
                                        <button onClick={() => setShowMetaReview(false)} className="text-gray-400 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-400 uppercase font-bold">{isZh ? '標題' : 'Title'}</label>
                                            <input 
                                                type="text" 
                                                value={generatedTitle}
                                                onChange={(e) => setGeneratedTitle(e.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-celestial-purple/50"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-400 uppercase font-bold">{isZh ? '標籤 (Tags)' : 'Tags'}</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {generatedTags.map((tag, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 bg-celestial-purple/20 text-celestial-purple px-2 py-1 rounded text-xs border border-celestial-purple/30">
                                                        <span>#{tag}</span>
                                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                                <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded text-xs border border-white/10">
                                                    <Plus className="w-3 h-3 text-gray-500" />
                                                    <input 
                                                        type="text" 
                                                        value={newTagInput}
                                                        onChange={(e) => setNewTagInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                        placeholder={isZh ? "新增標籤..." : "Add tag..."}
                                                        className="bg-transparent outline-none text-white w-20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/10">
                                        <button 
                                            onClick={() => setShowMetaReview(false)}
                                            className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                                        >
                                            {isZh ? '取消' : 'Cancel'}
                                        </button>
                                        <button 
                                            onClick={handleFinalSave}
                                            className="px-6 py-2 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2 text-xs shadow-lg"
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            {isZh ? '確認並儲存' : 'Confirm & Save'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 flex items-center gap-2">
                                        <Hash className="w-3 h-3" />
                                        {isZh ? '點擊按鈕進行 AI 智能標註' : 'Click to Auto-Tag with AI'}
                                    </span>
                                    <button 
                                        onClick={handleAnalyzeNote}
                                        disabled={isProcessingNote || !noteInput.trim()}
                                        className="px-6 py-2 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-900/20"
                                    >
                                        {isProcessingNote ? <Sparkles className="w-4 h-4 animate-spin"/> : <Tag className="w-4 h-4" />} 
                                        {isZh ? '分析並儲存' : 'Analyze & Save'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* List Area & AI Search */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-400" />
                                {isZh ? '筆記庫' : 'Knowledge Base'}
                            </h3>
                            
                            {/* AI Search Bar */}
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setAiAnswer(null); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAskNotes()}
                                        placeholder={isZh ? "搜尋筆記或向 AI 提問..." : "Search notes or ask AI..."}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                                    />
                                </div>
                                <button 
                                    onClick={handleAskNotes} 
                                    disabled={isProcessingNote || !searchQuery}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-celestial-gold border border-white/10 disabled:opacity-50"
                                    title="Ask AI"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                            </div>

                            {/* AI Answer Box */}
                            {aiAnswer && (
                                <div className="mb-4 p-3 bg-celestial-gold/10 border border-celestial-gold/20 rounded-lg text-xs text-gray-200">
                                    <div className="flex items-center gap-1 font-bold text-celestial-gold mb-1">
                                        <Sparkles className="w-3 h-3" /> AI Insight:
                                    </div>
                                    {aiAnswer}
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {filteredNotes.length === 0 && (
                                    <div className="text-center text-gray-500 mt-10">
                                        {isZh ? '無相關筆記' : 'No notes found.'}
                                    </div>
                                )}
                                {filteredNotes.map(note => (
                                    <div key={note.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-sm font-bold text-white truncate max-w-[80%]">{note.title}</div>
                                            <button 
                                                onClick={() => handlePushToHub(note)}
                                                className="text-gray-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                title={isZh ? "上傳至知識中樞" : "Upload to Knowledge Hub"}
                                            >
                                                <UploadCloud className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400 line-clamp-3 font-mono mb-2 leading-relaxed">
                                            {renderNoteContentWithLinks(note.content)}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {note.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/30 rounded text-gray-400 border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                        
                                        {/* Backlinks Section */}
                                        {note.backlinks && note.backlinks.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-500 flex flex-wrap gap-1 items-center">
                                                <Link2 className="w-3 h-3 text-celestial-purple" />
                                                <span>Linked from:</span>
                                                {note.backlinks.map(bid => {
                                                    // Lookup backlink title (simplified lookup since we don't have direct access to all notes inside map efficiently without passing state down or complex lookup, but we have filteredNotes or can use a lookup helper. For now, let's assume we can find it in universalNotes)
                                                    const sourceNote = universalNotes.find(n => n.id === bid);
                                                    return sourceNote ? (
                                                        <span 
                                                            key={bid} 
                                                            onClick={(e) => { e.stopPropagation(); handleLinkClick(sourceNote.title); }}
                                                            className="text-celestial-purple hover:underline cursor-pointer bg-celestial-purple/10 px-1 rounded"
                                                        >
                                                            {sourceNote.title}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => deleteNote(note.id)}
                                            className="absolute bottom-3 right-3 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === UNIVERSAL AGENT ZONE (Consolidated) === */}
                {activeTab === 'universal_agent' && (
                    <div className="h-full">
                        <UniversalAgentZone language={language} />
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
