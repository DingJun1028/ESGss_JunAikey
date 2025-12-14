
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { 
    Users, BookOpen, GraduationCap, Video, Calendar, FileText, 
    MessageSquare, Settings, Award, Plus, Layout, UserPlus, 
    Briefcase, Activity, CheckCircle, ExternalLink, RefreshCw,
    PlayCircle, Upload, PenTool, BarChart, DollarSign, Handshake, 
    Megaphone, Wand2, Image as ImageIcon, Type, Move, Save, 
    LayoutTemplate, MousePointer2, X, ChevronRight, Zap, History, Clock, Infinity, User, Shield
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalPageHeader } from './UniversalPageHeader';
import { streamChat } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

interface AlumniZoneProps {
  language: Language;
}

type UserRole = 'Admin' | 'Agent' | 'Consultant' | 'Student' | 'Parent' | 'Partner';

// Simulated Data
const MOCK_COURSES = [
    { id: 'c1', title: 'Corporate Carbon Management (ISO 14064)', instructor: 'Dr. Yang', status: 'Live', progress: 45, nextSession: 'Tomorrow, 14:00', students: 32, platform: 'Google' },
    { id: 'c2', title: 'ESG Strategic Leadership', instructor: 'Prof. Lee', status: 'Pre', progress: 0, nextSession: 'June 15, 09:00', students: 18, platform: 'Custom' },
    { id: 'c3', title: 'Supply Chain Auditing Workshop', instructor: 'Consultant Sarah', status: 'Post', progress: 100, nextSession: '-', students: 25, platform: 'Zoom' },
];

// --- AI CANVAS TYPES & COMPONENT ---
interface CanvasElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style?: any;
}

interface CanvasHistoryState {
    timestamp: number;
    elements: CanvasElement[];
}

const PartnerCanvas: React.FC<{ isZh: boolean, onClose: () => void }> = ({ isZh, onClose }) => {
    const { addToast } = useToast();
    const { addNote } = useCompany(); // Integration with Universal Notes
    
    // Default positioning adjusted to x: 280 to avoid overlap with left sidebar (w-64 = 256px)
    const [elements, setElements] = useState<CanvasElement[]>([
        { id: 'el-1', type: 'text', content: isZh ? '在此輸入您的品牌標語...' : 'Insert Brand Slogan Here...', x: 280, y: 150, width: 400, height: 60, style: { fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' } }
    ]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    
    // Time Machine State
    const [history, setHistory] = useState<CanvasHistoryState[]>([{ timestamp: Date.now(), elements: elements }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const saveHistory = (newEls: CanvasElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ timestamp: Date.now(), elements: JSON.parse(JSON.stringify(newEls)) });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleTimeTravel = (index: number) => {
        setHistoryIndex(index);
        setElements(JSON.parse(JSON.stringify(history[index].elements)));
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("id", id);
    };

    const handleDrop = (e: React.DragEvent) => {
        const id = e.dataTransfer.getData("id");
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Ensure drop doesn't put element completely off screen or under sidebar
        const safeX = Math.max(0, x);
        const safeY = Math.max(0, y);

        const newEls = elements.map(el => el.id === id ? { ...el, x: safeX - el.width / 2, y: safeY - el.height / 2 } : el);
        setElements(newEls);
        saveHistory(newEls);
    };

    const handleAiGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        addToast('info', isZh ? 'AI 正在設計您的畫布內容...' : 'AI designing your canvas content...', 'AI Designer');

        // Simulate AI Generation with safe layout
        setTimeout(() => {
            const newElements: CanvasElement[] = [
                { id: `gen-title-${Date.now()}`, type: 'text', content: prompt.toUpperCase(), x: 280, y: 100, width: 400, height: 50, style: { fontSize: '32px', fontWeight: 'bold', color: '#ffffff' } },
                { id: `gen-sub-${Date.now()}`, type: 'text', content: "Sustainable Innovation Partner", x: 280, y: 160, width: 300, height: 30, style: { fontSize: '16px', color: '#10b981' } },
                { id: `gen-img-${Date.now()}`, type: 'image', content: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', x: 280, y: 220, width: 300, height: 200, style: { borderRadius: '12px' } },
                { id: `gen-badge-${Date.now()}`, type: 'shape', content: 'Verified Partner', x: 600, y: 220, width: 120, height: 40, style: { backgroundColor: '#8b5cf6', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' } }
            ];
            const updated = [...elements, ...newElements];
            setElements(updated);
            saveHistory(updated);
            setIsGenerating(false);
            addToast('success', isZh ? '內容生成完畢' : 'Content Generated', 'AI Canvas');
        }, 2000);
    };

    // Save to Universal Notes Logic
    const handleSaveDesign = () => {
        const title = `Brand Canvas Design - ${new Date().toLocaleDateString()}`;
        
        // Convert canvas state to Markdown representation for the note
        let noteContent = `### ${title}\n\n**Generated via Partner AI Brand Canvas**\n\n`;
        noteContent += `| Element Type | Content | Position |\n|---|---|---|\n`;
        
        elements.forEach(el => {
            noteContent += `| ${el.type} | ${el.content.substring(0, 30)}... | (${Math.round(el.x)}, ${Math.round(el.y)}) |\n`;
        });

        noteContent += `\n**JSON Data:**\n\`\`\`json\n${JSON.stringify(elements, null, 2)}\n\`\`\``;

        addNote(noteContent, ['Design', 'Brand', 'Canvas'], title);
        addToast('success', isZh ? '設計已儲存至萬能筆記' : 'Design saved to Universal Notes', 'System');
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="h-16 border-b border-white/10 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-celestial-purple/20 rounded-lg text-celestial-purple">
                        <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{isZh ? '合作夥伴 AI 品牌畫布' : 'Partner AI Brand Canvas'}</h3>
                        <p className="text-[10px] text-gray-400">{isZh ? '打造符合 ESGss 風格的行銷素材' : 'Create ESGss-aligned marketing assets'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Infinite Power Indicator */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-celestial-gold/10 border border-celestial-gold/30 text-celestial-gold text-xs font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)] animate-pulse">
                        <Zap className="w-3 h-3 fill-current" />
                        <Infinity className="w-4 h-4" />
                        <span>POWER</span>
                    </div>

                    <button onClick={handleSaveDesign} className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                        <Save className="w-4 h-4" /> {isZh ? '保存至筆記' : 'Save to Notes'}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Tools Sidebar */}
                <div className="w-64 bg-slate-900 border-r border-white/10 p-4 flex flex-col gap-6 shrink-0 z-20">
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{isZh ? 'AI 生成器' : 'AI Generator'}</h4>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={isZh ? "描述您的品牌與需求..." : "Describe your brand..."}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-xs text-white mb-3 h-24 focus:outline-none focus:border-celestial-purple/50"
                        />
                        <button 
                            onClick={handleAiGenerate}
                            disabled={isGenerating}
                            className="w-full py-2 bg-gradient-to-r from-celestial-purple to-blue-500 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                            {isZh ? '一鍵生成素材' : 'Generate Assets'}
                        </button>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{isZh ? '工具箱' : 'Toolbox'}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                                <Type className="w-5 h-5" />
                                <span className="text-[10px]">Text</span>
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-[10px]">Image</span>
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                                <Layout className="w-5 h-5" />
                                <span className="text-[10px]">Layout</span>
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                                <MousePointer2 className="w-5 h-5" />
                                <span className="text-[10px]">Select</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    <div 
                        className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-950 relative"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
                        
                        {elements.map(el => (
                            <div
                                key={el.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, el.id)}
                                onClick={() => setSelectedId(el.id)}
                                className={`absolute cursor-move group ${selectedId === el.id ? 'ring-1 ring-celestial-purple' : ''}`}
                                style={{ 
                                    left: el.x, 
                                    top: el.y, 
                                    width: el.width, 
                                    height: el.height,
                                    ...el.style 
                                }}
                            >
                                {el.type === 'text' && (
                                    <div className="w-full h-full flex items-center">{el.content}</div>
                                )}
                                {el.type === 'image' && (
                                    <img src={el.content} alt="" className="w-full h-full object-cover" />
                                )}
                                {el.type === 'shape' && (
                                    <div className="w-full h-full flex items-center justify-center font-bold">
                                        {el.content}
                                    </div>
                                )}
                                {/* Resize Handles (Visual Only for Demo) */}
                                {selectedId === el.id && (
                                    <>
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full" />
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full" />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Version Time Machine Bar */}
                    <div className="h-12 bg-slate-900 border-t border-white/10 flex items-center px-4 gap-4 z-20">
                        <div className="flex items-center gap-2 text-celestial-gold text-xs font-bold uppercase tracking-wider">
                            <Clock className="w-4 h-4" />
                            {isZh ? '版本時光機' : 'Time Machine'}
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={history.length - 1} 
                            value={historyIndex} 
                            onChange={(e) => handleTimeTravel(parseInt(e.target.value))}
                            className="flex-1 accent-celestial-gold h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 font-mono w-16 text-right">
                            {historyIndex === history.length - 1 ? 'Current' : `v.${historyIndex}`}
                        </span>
                    </div>
                </div>

                {/* Properties Panel */}
                <div className="w-64 bg-slate-900 border-l border-white/10 p-4 z-20">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{isZh ? '屬性' : 'Properties'}</h4>
                    {selectedId ? (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Position X</label>
                                <input type="number" className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Position Y</label>
                                <input type="number" className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Opacity</label>
                                <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-600 text-center mt-10">Select an element to edit</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AlumniZone: React.FC<AlumniZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { setUserName } = useCompany();
  
  // State for Role Switching
  const [currentRole, setCurrentRole] = useState<UserRole>('Student');
  const [collabForm, setCollabForm] = useState({ 
      company: '', 
      website: '',
      email: '',
      project: '',
      reason: ''
  });
  const [showCanvas, setShowCanvas] = useState(false);

  const pageData = {
      title: { zh: '校友專區 & LMS', en: 'Alumni & LMS Zone' },
      desc: { zh: '全方位學習管理與異業合作生態系', en: 'Comprehensive LMS & Cross-Industry Ecosystem' },
      tag: { zh: '生態核心', en: 'Eco Core' }
  };

  const handleApplyCollab = (e: React.FormEvent) => {
      e.preventDefault();
      addToast('success', isZh ? '申請已提交！請等待審核。' : 'Application submitted! Pending review.', 'Collaboration');
      setCollabForm({ company: '', website: '', email: '', project: '', reason: '' });
  };

  // --- ROLE-SPECIFIC VIEWS ---

  // 1. Admin View (行政管理)
  const AdminView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <OmniEsgCell mode="card" label={isZh ? "總營收 (Monthly)" : "Total Revenue"} value="$42,500" color="gold" icon={DollarSign} traits={['performance']} />
              <OmniEsgCell mode="card" label={isZh ? "活躍學員" : "Active Students"} value="1,245" color="blue" icon={Users} subValue="+12% vs last month" />
              <OmniEsgCell mode="card" label={isZh ? "待審核申請" : "Pending Approvals"} value="8" color="purple" icon={FileText} traits={['gap-filling']} />
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 min-h-0 overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">{isZh ? '系統管理面板' : 'Admin Panel'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Course Mgmt', 'User Roles', 'Financials', 'System Logs'].map(item => (
                      <button key={item} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex flex-col items-center gap-2 transition-all">
                          <Settings className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-200">{item}</span>
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );

  // 2. Agent View (代理/業務)
  const AgentView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 bg-emerald-900/10 shrink-0">
              <div className="flex justify-between items-center">
                  <div>
                      <h3 className="text-xl font-bold text-white">{isZh ? '推廣中心' : 'Promotion Center'}</h3>
                      <p className="text-sm text-gray-400">{isZh ? '您的專屬推廣連結與成效' : 'Your referral links and performance'}</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> {isZh ? '複製連結' : 'Copy Link'}
                  </button>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto">
              <OmniEsgCell mode="list" label={isZh ? "本月佣金" : "Commission"} value="$3,200" color="gold" icon={DollarSign} />
              <OmniEsgCell mode="list" label={isZh ? "轉化率" : "Conversion Rate"} value="4.8%" color="emerald" icon={Activity} />
          </div>
      </div>
  );

  // 3. Consultant View (顧問/講師)
  const ConsultantView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 min-h-0 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 shrink-0">
                  <Calendar className="w-5 h-5 text-celestial-purple" />
                  {isZh ? '授課日程' : 'Teaching Schedule'}
              </h3>
              <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
                  {MOCK_COURSES.map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                              <div className="w-2 h-10 bg-celestial-purple rounded-full" />
                              <div>
                                  <div className="font-bold text-white">{c.title}</div>
                                  <div className="text-xs text-gray-400">{c.nextSession} • {c.students} Students</div>
                              </div>
                          </div>
                          <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
                              {isZh ? '進入教室' : 'Enter Class'}
                          </button>
                      </div>
                  ))}
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">{isZh ? '作業批改' : 'Grading'}</h4>
                  <div className="text-3xl font-bold text-celestial-blue">12 <span className="text-sm text-gray-500 font-normal">Pending</span></div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">{isZh ? '學員提問' : 'Q&A'}</h4>
                  <div className="text-3xl font-bold text-amber-400">5 <span className="text-sm text-gray-500 font-normal">Unread</span></div>
              </div>
          </div>
      </div>
  );

  // 4. Student View (學員) - Default Logic
  const StudentView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 shrink-0">
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-blue-500 bg-blue-900/10">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-white text-lg">{isZh ? '課前準備' : 'Pre-Class'}</h4>
                      <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> {isZh ? '註冊確認' : 'Registration'}</li>
                      <li className="flex gap-2 items-center"><Activity className="w-4 h-4 text-amber-400 animate-pulse" /> {isZh ? '預習教材' : 'Materials'}</li>
                  </ul>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-gold bg-amber-900/10">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-white text-lg">{isZh ? '課中互動' : 'In-Class'}</h4>
                      <Video className="w-5 h-5 text-celestial-gold" />
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex gap-2 items-center"><PlayCircle className="w-4 h-4 text-celestial-gold" /> {isZh ? '直播教室' : 'Live Room'}</li>
                  </ul>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-purple bg-purple-900/10">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-white text-lg">{isZh ? '課後延伸' : 'Post-Class'}</h4>
                      <Award className="w-5 h-5 text-celestial-purple" />
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex gap-2 items-center"><Users className="w-4 h-4 text-celestial-purple" /> {isZh ? '校友網絡' : 'Alumni'}</li>
                  </ul>
              </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 min-h-0 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 shrink-0">
                  <BookOpen className="w-5 h-5 text-celestial-blue" />
                  {isZh ? '我的課程' : 'My Courses'}
              </h3>
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
                  {MOCK_COURSES.map(course => (
                      <div key={course.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:border-celestial-blue/30 transition-all group">
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${course.status === 'Live' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-gray-400'}`}>
                                  {course.status === 'Live' ? <Video className="w-5 h-5 animate-pulse" /> : <BookOpen className="w-5 h-5" />}
                              </div>
                              <div>
                                  <h4 className="font-bold text-white">{course.title}</h4>
                                  <div className="text-xs text-gray-400 flex gap-2 mt-1">
                                      <span>{course.instructor}</span>
                                      <span>•</span>
                                      <span>Next: {course.nextSession}</span>
                                  </div>
                              </div>
                          </div>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">
                              {isZh ? '進入' : 'Enter'}
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  // 5. Parent View (家長)
  const ParentView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50 flex items-center gap-6 shrink-0">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <User className="w-10 h-10" />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-white">Alex Chen</h3>
                  <p className="text-sm text-gray-400">Class 3-A • Student ID: #8821</p>
                  <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Attendance: 98%</span>
                      <span className="text-xs bg-celestial-gold/20 text-celestial-gold px-2 py-0.5 rounded border border-celestial-gold/30">GPA: 3.8</span>
                  </div>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
                  <h4 className="font-bold text-white mb-4">{isZh ? '近期表現' : 'Recent Performance'}</h4>
                  <div className="space-y-3">
                      <OmniEsgCell mode="list" label="Carbon Project" value="A+" color="emerald" icon={Award} />
                      <OmniEsgCell mode="list" label="Midterm Exam" value="92" color="blue" icon={FileText} />
                  </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
                  <h4 className="font-bold text-white mb-4">{isZh ? '聯絡事項' : 'Messages'}</h4>
                  <div className="p-3 bg-white/5 rounded-xl text-sm text-gray-300">
                      <div className="font-bold text-white mb-1">Teacher Lin</div>
                      <p>"Alex has shown great leadership in the group project this week!"</p>
                  </div>
                  <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">
                      {isZh ? '聯絡導師' : 'Contact Teacher'}
                  </button>
              </div>
          </div>
      </div>
  );

  // 6. Partner View (合作夥伴 - Existing)
  const PartnerView = () => (
      <div className="space-y-8 animate-fade-in flex flex-col h-full overflow-hidden">
          {/* Partner Zone Header */}
          <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                  {isZh ? '生態系夥伴專區' : 'Ecosystem Partners'}
              </h3>
              <button 
                  onClick={() => setShowCanvas(true)}
                  className="px-4 py-2 bg-gradient-to-r from-celestial-purple to-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
              >
                  <LayoutTemplate className="w-4 h-4" />
                  {isZh ? '開啟品牌 AI 畫布' : 'Open Brand AI Canvas'}
              </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto">
              {/* Left Column: Flow & Rules */}
              <div className="space-y-6">
                  {/* Collaboration Flow */}
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-gold bg-gradient-to-b from-amber-900/10 to-transparent">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Handshake className="w-5 h-5 text-celestial-gold" />
                          {isZh ? '異業合作申請流程' : 'Application Process'}
                      </h3>
                      <div className="space-y-4">
                          {[
                              { step: 1, title: isZh ? '提交申請' : 'Submit Application', desc: isZh ? '填寫企業資料與提案' : 'Fill details & proposal' },
                              { step: 2, title: isZh ? 'AI 初審' : 'AI Review', desc: isZh ? '系統自動評估適配度' : 'Auto-match compatibility' },
                              { step: 3, title: isZh ? '官方審核' : 'Official Review', desc: isZh ? '專人對接與簽約' : 'Contract & Onboarding' },
                              { step: 4, title: isZh ? '上架專區' : 'Launch', desc: isZh ? '解鎖 AI 畫布與專區展示' : 'Unlock Canvas & Exposure' },
                          ].map((s, i) => (
                              <div key={i} className="flex gap-4 items-start">
                                  <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-celestial-gold/20 text-celestial-gold flex items-center justify-center font-bold border border-celestial-gold/30 shrink-0">
                                          {s.step}
                                      </div>
                                      {i < 3 && <div className="w-0.5 h-full bg-white/10 my-1" />}
                                  </div>
                                  <div className="pt-1">
                                      <h4 className="font-bold text-white text-sm">{s.title}</h4>
                                      <p className="text-xs text-gray-400">{s.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Rules */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-celestial-blue" />
                          {isZh ? '合作規範' : 'Collaboration Norms'}
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-300">
                          <li className="flex gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{isZh ? '企業需具備基本的 ESG 承諾或永續相關業務。' : 'Must demonstrate ESG commitment.'}</span>
                          </li>
                          <li className="flex gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{isZh ? '同意使用 ESGss 平台工具進行數據交換。' : 'Agree to use ESGss tools for data.'}</span>
                          </li>
                      </ul>
                  </div>
              </div>

              {/* Right Column: Application Form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 h-fit">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-celestial-purple" />
                      {isZh ? '我要申請' : 'Apply Now'}
                  </h4>
                  <form onSubmit={handleApplyCollab} className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs text-gray-400 ml-1">{isZh ? '企業名稱' : 'Company Name'}</label>
                          <input 
                              type="text" 
                              value={collabForm.company}
                              onChange={e => setCollabForm({...collabForm, company: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                              required
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-gray-400 ml-1">{isZh ? '企業官網' : 'Website'}</label>
                          <input 
                              type="text" 
                              value={collabForm.website}
                              onChange={e => setCollabForm({...collabForm, website: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                              required
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-gray-400 ml-1">{isZh ? 'Email' : 'Email'}</label>
                          <input 
                              type="email" 
                              value={collabForm.email}
                              onChange={e => setCollabForm({...collabForm, email: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                              required
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-gray-400 ml-1">{isZh ? '欲申請的合作專案' : 'Project Type'}</label>
                          <select 
                              value={collabForm.project}
                              onChange={e => setCollabForm({...collabForm, project: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                              required
                          >
                              <option value="" disabled>{isZh ? '請選擇...' : 'Select...'}</option>
                              <option value="marketing">{isZh ? '共同行銷 (Co-Marketing)' : 'Co-Marketing'}</option>
                              <option value="data">{isZh ? '數據串接 (Data Integration)' : 'Data Integration'}</option>
                              <option value="reselling">{isZh ? '經銷代理 (Reselling)' : 'Reselling'}</option>
                              <option value="other">{isZh ? '其他 (Other)' : 'Other'}</option>
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-gray-400 ml-1">{isZh ? '申請理由' : 'Reason'}</label>
                          <textarea 
                              value={collabForm.reason}
                              onChange={e => setCollabForm({...collabForm, reason: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50 h-24 resize-none"
                              placeholder={isZh ? "請簡述您的合作構想..." : "Briefly describe your proposal..."}
                              required
                          />
                      </div>
                      <button type="submit" className="w-full py-3 bg-celestial-gold text-black font-bold rounded-lg hover:bg-amber-400 transition-colors shadow-lg mt-2">
                          {isZh ? '提交申請' : 'Submit Application'}
                      </button>
                  </form>
              </div>
          </div>
      </div>
  );

  return (
    <>
        {showCanvas && <PartnerCanvas isZh={isZh} onClose={() => setShowCanvas(false)} />}
        
        <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in overflow-hidden">
            <div className="shrink-0">
                <UniversalPageHeader 
                    icon={Users}
                    title={pageData.title}
                    description={pageData.desc}
                    language={language}
                    tag={pageData.tag}
                />
            </div>

            {/* Role Selector */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 mb-2 overflow-x-auto no-scrollbar shrink-0 w-fit max-w-full">
                {(['Admin', 'Agent', 'Consultant', 'Student', 'Parent', 'Partner'] as UserRole[]).map(role => (
                    <button
                        key={role}
                        onClick={() => {
                            setCurrentRole(role);
                            addToast('info', isZh ? `切換視角至：${role}` : `Switched view to: ${role}`, 'Role Manager');
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                            ${currentRole === role 
                                ? 'bg-celestial-purple text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        {isZh ? 
                          (role === 'Admin' ? '行政管理' : role === 'Agent' ? '代理/業務' : role === 'Consultant' ? '顧問/講師' : role === 'Student' ? '學員' : role === 'Parent' ? '家長' : '合作夥伴') 
                          : role}
                    </button>
                ))}
            </div>
            
            <div className="px-1 text-xs text-gray-500 mb-4 font-mono shrink-0">Current Context: {currentRole} View</div>
            
            {/* Conditional Rendering based on Role */}
            <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-1">
                    {currentRole === 'Admin' && <AdminView />}
                    {currentRole === 'Agent' && <AgentView />}
                    {currentRole === 'Consultant' && <ConsultantView />}
                    {currentRole === 'Student' && <StudentView />}
                    {currentRole === 'Parent' && <ParentView />}
                    {currentRole === 'Partner' && <PartnerView />}
                </div>
            </div>
        </div>
    </>
  );
};
