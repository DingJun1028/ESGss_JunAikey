
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, View, UniversalTag } from '../types';
import { 
    PenTool, Database, Grid, Copy, Save, Sparkles, BrainCircuit, 
    Search, Command, FileText, ChevronRight, Server, Table, Zap, Bot, Layout, Terminal,
    Calendar as CalendarIcon, CheckSquare, Book, Hexagon, Play, Maximize2, Minimize2, Wand2,
    Link2, ExternalLink, RefreshCw, UploadCloud, MessageCircle, Hash, Trash2, Plus, X, Tag,
    Scissors, Link as LinkIcon, Lock, Unlock, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import UniversalBackend from './UniversalBackend';
import { UniversalAgentZone } from './UniversalAgentZone';
import { UniversalRestoration } from './Gamification';
import { marked } from 'marked';

interface UniversalToolsProps {
  language: Language;
}

// Helper: Highlight Text
const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight || !highlight.trim()) return <>{text}</>;
    // Escape special regex characters
    const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${safeHighlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) => 
                part.toLowerCase() === highlight.toLowerCase() 
                    ? <span key={i} className="bg-celestial-gold/40 text-white rounded px-0.5 font-medium shadow-[0_0_5px_rgba(251,191,36,0.3)]">{part}</span> 
                    : part
            )}
        </>
    );
};

// --- Universal Tag Components ---

const TagPill: React.FC<{ tag: UniversalTag, active?: boolean, language: Language, onClick?: () => void, onDelete?: () => void }> = ({ tag, active, language, onClick, onDelete }) => {
    const isZh = language === 'zh-TW';
    // Logic: Chinese version shows English labels, English version shows Chinese labels
    const displayLabel = isZh ? tag.labelEn : tag.labelZh;

    const colors = {
        gold: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    };
    
    return (
        <div 
            className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none group
                ${colors[tag.theme]}
                ${active ? 'ring-2 ring-white/30 scale-105 shadow-lg' : 'hover:bg-opacity-30'}
            `}
            onClick={onClick}
            title={`${isZh ? '隱藏提示' : 'Hidden Prompt'}: ${tag.hiddenPrompt.substring(0, 50)}...`}
        >
            <Hash className="w-3 h-3" />
            <span>{displayLabel}</span>
            {tag.hiddenPrompt && <Sparkles className="w-2.5 h-2.5 opacity-50" />}
            {onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="ml-1 p-0.5 rounded-full hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-2.5 h-2.5" />
                </button>
            )}
        </div>
    );
};

const TagFabricator: React.FC<{ isOpen: boolean, onClose: () => void, isZh: boolean }> = ({ isOpen, onClose, isZh }) => {
    const { addUniversalTag } = useCompany();
    const { addToast } = useToast();
    const [labelZh, setLabelZh] = useState('');
    const [labelEn, setLabelEn] = useState('');
    const [prompt, setPrompt] = useState('');
    const [theme, setTheme] = useState<'gold' | 'purple' | 'emerald' | 'blue' | 'rose' | 'slate'>('purple');
    const [isGenerating, setIsGenerating] = useState(false);

    const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (!isOpen) return null;

    const handleAutoGenerateOther = async () => {
        const source = labelZh || labelEn;
        if (!source) return;
        setIsGenerating(true);
        try {
            const promptStr = `Translate this tag label. If source is Chinese, return English. If source is English, return Traditional Chinese. Return strictly JSON: {"translated": "string"}. Label: "${source}"`;
            const response = await client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: promptStr }] }],
                config: { responseMimeType: 'application/json' }
            });
            const result = JSON.parse(response.text || '{}');
            if (labelZh) setLabelEn(result.translated);
            else setLabelZh(result.translated);
        } catch (e) {
            addToast('error', 'Translation failed', 'AI Fabricator');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreate = () => {
        if (!labelZh.trim() && !labelEn.trim()) return;
        addUniversalTag({
            label: labelEn || labelZh, // Primary ref
            labelZh: labelZh || labelEn,
            labelEn: labelEn || labelZh,
            hiddenPrompt: prompt,
            theme,
            description: 'User Created'
        });
        addToast('success', isZh ? '萬能標籤已鑄造' : 'Universal Tag Fabricated', 'Tag Engine');
        setLabelZh('');
        setLabelEn('');
        setPrompt('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-celestial-purple/30 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-celestial-purple" />
                        {isZh ? '萬能標籤鑄造廠' : 'Universal Tag Fabricator'}
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">{isZh ? '繁體中文標籤' : 'Chinese Label'}</label>
                            <input 
                                type="text" 
                                value={labelZh}
                                onChange={e => setLabelZh(e.target.value)}
                                placeholder="如：執行長視角"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-purple/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">{isZh ? '英文標籤' : 'English Label'}</label>
                            <input 
                                type="text" 
                                value={labelEn}
                                onChange={e => setLabelEn(e.target.value)}
                                placeholder="e.g. CEO Persona"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-purple/50"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAutoGenerateOther}
                        disabled={isGenerating || (!labelZh && !labelEn)}
                        className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-400 rounded-lg flex items-center justify-center gap-2 border border-white/5 transition-all"
                    >
                        {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                        {isZh ? 'AI 自動對齊雙語標籤' : 'AI Sync Bilingual Labels'}
                    </button>

                    <div>
                        <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block flex justify-between">
                            {isZh ? '隱藏屬性 (Prompt)' : 'Hidden Attribute (Prompt)'}
                            <span className="text-celestial-purple flex items-center gap-1"><Lock className="w-3 h-3"/> Private</span>
                        </label>
                        <textarea 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder={isZh ? "輸入此標籤代表的指令或人格..." : "Enter the instruction or persona this tag carries..."}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-purple/50 h-24 resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">{isZh ? '主題色' : 'Theme Color'}</label>
                        <div className="flex gap-2">
                            {['gold', 'purple', 'emerald', 'blue', 'rose', 'slate'].map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setTheme(c as any)}
                                    className={`w-6 h-6 rounded-full border-2 ${theme === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                                    style={{ backgroundColor: c === 'gold' ? '#f59e0b' : c === 'purple' ? '#8b5cf6' : c === 'emerald' ? '#10b981' : c === 'blue' ? '#3b82f6' : c === 'rose' ? '#f43f5e' : '#64748b' }}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCreate}
                        disabled={!labelZh && !labelEn}
                        className="w-full py-3 bg-celestial-purple text-white font-bold rounded-xl mt-4 hover:bg-purple-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Zap className="w-4 h-4" />
                        {isZh ? '鑄造標籤' : 'Fabricate Tag'}
                    </button>
                </div>
            </div>
        </div>
    );
};

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
  const { 
      universalNotes, addNote, deleteNote, 
      todos, addTodo, toggleTodo, deleteTodo, 
      journal, saveIntelligence,
      universalTags, deleteUniversalTag
  } = useCompany();
  
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

  // Active Universal Tags for Note Editing
  const [activeNoteTags, setActiveNoteTags] = useState<string[]>([]); // IDs
  const [isTagFabricatorOpen, setIsTagFabricatorOpen] = useState(false);

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
          // Inject Active Tag Prompts
          const activeTagPrompts = activeNoteTags
              .map(id => universalTags.find(t => t.id === id))
              .filter(t => t && t.hiddenPrompt)
              .map(t => `[DIRECTIVE from Tag '${t?.labelEn}']: ${t?.hiddenPrompt}`)
              .join('\n');

          let systemInstruction = `You are an expert editor. Output ONLY the processed text in clean Markdown format. Do not add conversational filler.
          ${activeTagPrompts ? '\n\nAdditional Directives:\n' + activeTagPrompts : ''}`;

          switch (action) {
              case 'format':
                  prompt = `
                    Analyze the structure and content of the following text to apply the most appropriate formatting.
                    Reformat it into a professional, highly readable Markdown document.

                    **Formatting Rules:**
                    1. **Headings:** Use ### for main sections to establish a clear hierarchy.
                    2. **Lists:** Convert enumerations, steps, or feature lists into bullet points (-) or numbered lists (1.).
                    3. **Tables:** If the content contains comparative data or structured fields, organize them into a Markdown table.
                    4. **Emphasis:** Bold (**text**) key entities, important metrics, deadlines, or actionable items. Italicize (*text*) for definitions or emphasis.
                    5. **Code:** Use inline code (\`text\`) for technical terms, file names, or short snippets. Use code blocks (\`\`\`) for longer code or logs.
                    6. **Links:** CRITICAL: Preserve all [[WikiLinks]] exactly as they appear. Do not modify them.
                    7. **Clarity:** Ensure spacing between sections is consistent. Remove excessive newlines.
                    
                    Text to format:
                  `;
                  break;
              case 'expand': 
                  prompt = "Expand upon the following text, adding relevant details, depth, and context to make it more comprehensive. Use Markdown structure:"; 
                  break;
              case 'summarize': 
                  prompt = "Summarize the following text into key bullet points (Markdown):"; 
                  break;
              case 'condense':
                  prompt = "Condense the following text to be as concise and direct as possible, removing unnecessary words without losing the core meaning:";
                  break;
              case 'refine': 
                  prompt = "Refine the writing style of the following text to be more professional, polished, and clear:"; 
                  break;
              case 'action': 
                  prompt = "Analyze the text and extract a list of clear, actionable tasks/items (Markdown Checkbox list [ ]):"; 
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

  const handleToggleNoteTag = (tagId: string) => {
      setActiveNoteTags(prev => 
          prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
      );
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
      addNote(noteInput, generatedTags, generatedTitle, activeNoteTags);
      setNoteInput('');
      setGeneratedTitle('');
      setGeneratedTags([]);
      setActiveNoteTags([]);
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
      const query = searchQuery.toLowerCase().trim();
      if (!query) return universalNotes;

      return universalNotes.filter(n => {
          // 1. Content Match
          if (n.content.toLowerCase().includes(query)) return true;
          
          // 2. Title Match
          if (n.title.toLowerCase().includes(query)) return true;
          
          // 3. Regular Tags Match
          if (n.tags.some(t => t.toLowerCase().includes(query))) return true;

          // 4. Universal Tags Match (Label & Description)
          if (n.universalTags && n.universalTags.length > 0) {
              return n.universalTags.some(tagId => {
                  const tagDef = universalTags.find(ut => ut.id === tagId);
                  return tagDef && (
                      tagDef.labelZh.toLowerCase().includes(query) || 
                      tagDef.labelEn.toLowerCase().includes(query) ||
                      (tagDef.description && tagDef.description.toLowerCase().includes(query))
                  );
              });
          }
          
          return false;
      });
  }, [universalNotes, searchQuery, universalTags]);

  // --- Todo Logic ---
  const [todoInput, setTodoInput] = useState('');
  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!todoInput.trim()) return;
      addTodo(todoInput);
      setTodoInput('');
  };

  // Improved Note Content Renderer using 'marked' and preserving clickability
  const renderNoteContent = (content: string) => {
      // 1. Parse Markdown using marked
      let html = marked.parse(content) as string;

      // 2. Post-process HTML to inject interactive link buttons
      html = html.replace(
          /\[\[(.*?)\]\]/g, 
          '<span class="text-celestial-purple font-bold cursor-pointer hover:underline note-link" data-link="$1">[[ $1 ]]</span>'
      );

      // 3. Render HTML safely with advanced styling
      return (
          <div 
            className="
                markdown-content text-xs text-gray-300 leading-relaxed font-sans
                [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
                [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-2
                [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-3
                [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ul]:mb-3
                [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_ol]:mb-3
                [&_p]:mb-2 [&_p:last-child]:mb-0
                [&_strong]:text-gray-200 [&_strong]:font-semibold
                [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_blockquote]:my-2
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:border [&_table]:border-white/10 [&_table]:text-[11px]
                [&_th]:text-left [&_th]:p-2 [&_th]:bg-white/5 [&_th]:text-white [&_th]:border-b [&_th]:border-white/10
                [&_td]:p-2 [&_td]:border-b [&_td]:border-white/5
                [&_code]:bg-black/30 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-celestial-gold [&_code]:text-[10px]
                [&_pre]:bg-black/30 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-300
            "
            dangerouslySetInnerHTML={{ __html: html }}
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('note-link')) {
                    e.stopPropagation();
                    const link = target.getAttribute('data-link');
                    if (link) handleLinkClick(link);
                }
            }}
          />
      );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full bg-[#020617] rounded-3xl border border-white/10 relative overflow-hidden animate-fade-in shadow-2xl">
        
        <TagFabricator isOpen={isTagFabricatorOpen} onClose={() => setIsTagFabricatorOpen(false)} isZh={isZh} />

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

                            {/* Universal Tag Selector Bar */}
                            <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar py-1">
                                <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">
                                    {isZh ? '萬能標籤 (隱藏屬性)' : 'Universal Tags'}
                                </span>
                                {universalTags.map(tag => (
                                    <TagPill 
                                        key={tag.id} 
                                        tag={tag} 
                                        language={language}
                                        active={activeNoteTags.includes(tag.id)} 
                                        onClick={() => handleToggleNoteTag(tag.id)}
                                        onDelete={() => deleteUniversalTag(tag.id)}
                                    />
                                ))}
                                <button 
                                    onClick={() => setIsTagFabricatorOpen(true)}
                                    className="p-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-gray-400 shrink-0"
                                    title="Create New Tag"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>

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
                                            <div className="text-sm font-bold text-white truncate max-w-[80%]">
                                                <HighlightedText text={note.title} highlight={searchQuery} />
                                            </div>
                                            <div className="flex gap-1">
                                                {note.universalTags && note.universalTags.map(tagId => {
                                                    const tag = universalTags.find(t => t.id === tagId);
                                                    return tag ? (
                                                        <div key={tagId} className={`w-2 h-2 rounded-full bg-${tag.theme === 'gold' ? 'amber' : tag.theme}-500`} title={isZh ? tag.labelEn : tag.labelZh} />
                                                    ) : null;
                                                })}
                                                <button 
                                                    onClick={() => handlePushToHub(note)}
                                                    className="text-gray-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    title={isZh ? "上傳至知識中樞" : "Upload to Knowledge Hub"}
                                                >
                                                    <UploadCloud className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        {renderNoteContent(note.content)}
                                        <div className="flex flex-wrap gap-2 mb-2 mt-3">
                                            {note.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/30 rounded text-gray-400 border border-white/5">
                                                    #<HighlightedText text={tag} highlight={searchQuery} />
                                                </span>
                                            ))}
                                        </div>
                                        
                                        {/* Backlinks Section */}
                                        {note.backlinks && note.backlinks.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-500 flex flex-wrap gap-1 items-center">
                                                <Link2 className="w-3 h-3 text-celestial-purple" />
                                                <span>Linked from:</span>
                                                {note.backlinks.map(bid => {
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
