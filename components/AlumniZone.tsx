
import React, { useState, useRef, useEffect } from 'react';
import { Language, View } from '../types';
import { 
    Users, BookOpen, GraduationCap, Video, Calendar, FileText, 
    MessageSquare, Settings, Award, Plus, Layout, UserPlus, 
    Briefcase, Activity, CheckCircle, ExternalLink, RefreshCw,
    PlayCircle, Upload, PenTool, BarChart, DollarSign, Handshake, 
    Megaphone, Wand2, Image as ImageIcon, Type, Move, Save, 
    LayoutTemplate, MousePointer2, X, ChevronRight, Zap, History, Clock, Infinity, User, Shield, Palette, Download, Layers,
    Hexagon, Trash2, Maximize2, MousePointer, AlertTriangle, Loader2
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useCompany } from './providers/CompanyProvider';

interface AlumniZoneProps {
  language: Language;
}

type UserRole = 'Admin' | 'Agent' | 'Consultant' | 'Student' | 'Parent' | 'Partner';

const MOCK_COURSES = [
    { id: 'c1', title: '企業碳管理實務 (ISO 14064)', instructor: 'Dr. Yang', status: 'Live', progress: 45, nextSession: '明天 14:00', students: 32, platform: 'Google' },
    { id: 'c2', title: 'ESG 戰略領導力特訓', instructor: 'Prof. Lee', status: 'Pre', progress: 0, nextSession: '6月15日 09:00', students: 18, platform: 'Custom' },
    { id: 'c3', title: '供應鏈稽核工作坊', instructor: 'Consultant Sarah', status: 'Post', progress: 100, nextSession: '-', students: 25, platform: 'Zoom' },
];

// --- AI CANVAS TYPES ---
interface CanvasElement {
    id: string;
    type: 'text' | 'image' | 'shape' | 'logo' | 'metric' | 'decoration';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style?: any;
    zIndex: number;
}

interface CanvasHistoryState {
    timestamp: number;
    elements: CanvasElement[];
}

type DesignTheme = 'Strategic' | 'Minimalist' | 'Vibrant';

const DEFAULT_LOGO_URL = 'https://thumbs4.imagebam.com/1f/73/e7/ME18U9GT_t.png';

const PartnerCanvas: React.FC<{ isZh: boolean, onClose: () => void }> = ({ isZh, onClose }) => {
    const { addToast } = useToast();
    const logoInputRef = useRef<HTMLInputElement>(null);
    
    // Initializing with Default Logo
    const [brandLogo, setBrandLogo] = useState<string | null>(DEFAULT_LOGO_URL);
    const [primaryColor, setPrimaryColor] = useState('#10b981'); // Default Emerald for ESGss
    const [theme, setTheme] = useState<DesignTheme>('Strategic');

    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    
    const [history, setHistory] = useState<CanvasHistoryState[]>([{ timestamp: Date.now(), elements: [] }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const saveHistory = (newEls: CanvasElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ timestamp: Date.now(), elements: JSON.parse(JSON.stringify(newEls)) });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Auto-setup initial canvas with logo if it's the first render
    useEffect(() => {
        if (elements.length === 0 && brandLogo) {
            const initialLogo: CanvasElement = {
                id: 'brand-logo-main',
                type: 'logo',
                content: brandLogo,
                x: 40,
                y: 40,
                width: 140,
                height: 70,
                style: { 
                    objectFit: 'contain', 
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
                    transition: 'all 0.5s ease'
                },
                zIndex: 1000 // Ensure logo is on top
            };
            setElements([initialLogo]);
            saveHistory([initialLogo]);
            
            // Extract dominant color simulation
            if (brandLogo === DEFAULT_LOGO_URL) {
                setPrimaryColor('#10b981'); 
                addToast('info', isZh ? '已偵測到 ESGss 官方識別色。' : 'ESGss official identity colors detected.', 'Branding AI');
            }
        }
    }, [brandLogo]);

    const handleTimeTravel = (index: number) => {
        setHistoryIndex(index);
        setElements(JSON.parse(JSON.stringify(history[index].elements)));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setBrandLogo(url);
                
                // Simulate AI dominant color extraction
                const brandingPalettes = ['#0ABAB5', '#4CAF50', '#0056B3', '#D4AF37', '#FF4B2B', '#8b5cf6'];
                const extractedColor = brandingPalettes[Math.floor(Math.random() * brandingPalettes.length)];
                setPrimaryColor(extractedColor);
                
                const logoEl: CanvasElement = {
                    id: `logo-${Date.now()}`,
                    type: 'logo',
                    content: url,
                    x: 40,
                    y: 40,
                    width: 140,
                    height: 70,
                    style: { objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' },
                    zIndex: 1000
                };
                
                const updated = [...elements.filter(el => el.type !== 'logo'), logoEl];
                setElements(updated);
                saveHistory(updated);
                addToast('success', isZh ? '品牌識別載入成功，AI 已自動同步畫布色調。' : 'Brand identity loaded, AI synced canvas palette.', 'Branding');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAiGenerate = async () => {
        setError(null);
        if (!prompt.trim()) {
            setError(isZh ? "請輸入提示詞以引導 AI 設計。" : "Please enter a prompt to guide AI design.");
            return;
        }

        setIsGenerating(true);
        addToast('info', isZh ? '正在分析品牌色彩基因並佈局空間...' : 'Analyzing brand color genes and spatial layout...', 'AI Designer 2.0');

        setTimeout(() => {
            try {
                const newElements: CanvasElement[] = [];
                const canvasW = 800;
                const canvasH = 500;

                // Base Background with branded tint
                newElements.push(
                    { id: 'bg', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { backgroundColor: '#020617' }, zIndex: 0 },
                    { id: 'brand-glow', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { background: `radial-gradient(circle at 10% 10%, ${primaryColor}15 0%, transparent 60%)` }, zIndex: 1 }
                );

                if (theme === 'Strategic') {
                    newElements.push(
                        { id: 'mesh', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { backgroundImage: `radial-gradient(${primaryColor}20 1px, transparent 1px)`, backgroundSize: '32px 32px' }, zIndex: 2 },
                        { id: 'title', type: 'text', content: prompt, x: 50, y: 140, width: 600, height: 80, style: { fontSize: '46px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.04em', lineHeight: '1.1' }, zIndex: 10 },
                        { id: 'accent-line', type: 'shape', content: '', x: 50, y: 230, width: 100, height: 6, style: { backgroundColor: primaryColor, borderRadius: '4px' }, zIndex: 11 },
                        { id: 'subtitle', type: 'text', content: isZh ? '以科技驅動價值，共建綠色生態' : 'Tech-driven values for a green ecosystem', x: 50, y: 260, width: 500, height: 30, style: { fontSize: '18px', color: '#94a3b8', fontWeight: '500' }, zIndex: 12 },
                        { id: 'm1', type: 'metric', content: '94% Logic', x: 50, y: 340, width: 160, height: 100, style: { background: 'rgba(255,255,255,0.03)', border: `1px solid ${primaryColor}30`, borderLeft: `4px solid ${primaryColor}`, padding: '20px', borderRadius: '16px' }, zIndex: 20 },
                        { id: 'm2', type: 'metric', content: '0% Gaps', x: 230, y: 340, width: 160, height: 100, style: { background: 'rgba(255,255,255,0.03)', border: `1px solid ${primaryColor}30`, borderLeft: `4px solid ${primaryColor}`, padding: '20px', borderRadius: '16px' }, zIndex: 21 }
                    );
                } else if (theme === 'Minimalist') {
                    newElements.push(
                        { id: 'white-bg', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { backgroundColor: '#ffffff' }, zIndex: 0 },
                        { id: 'title', type: 'text', content: prompt.toUpperCase(), x: 0, y: 220, width: canvasW, height: 60, style: { fontSize: '36px', fontWeight: '200', color: '#111827', textAlign: 'center', letterSpacing: '0.5em' }, zIndex: 10 },
                        { id: 'brand-dot', type: 'shape', content: '', x: (canvasW / 2) - 4, y: 290, width: 8, height: 8, style: { backgroundColor: primaryColor, borderRadius: '50%' }, zIndex: 11 }
                    );
                } else {
                    // Vibrant
                    newElements.push(
                        { id: 'gradient-bg', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { background: `linear-gradient(135deg, ${primaryColor}20 0%, #020617 100%)` }, zIndex: 0 },
                        { id: 'title', type: 'text', content: prompt, x: 50, y: 180, width: 700, height: 120, style: { fontSize: '54px', fontWeight: '900', color: '#ffffff', textShadow: `0 10px 30px ${primaryColor}30` }, zIndex: 10 }
                    );
                }

                // Keep Logo on Top corner
                if (brandLogo) {
                    newElements.push({
                        id: 'brand-logo-final',
                        type: 'logo',
                        content: brandLogo,
                        x: theme === 'Minimalist' ? (canvasW - 140) / 2 : canvasW - 180,
                        y: 40,
                        width: 140,
                        height: 70,
                        style: { objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' },
                        zIndex: 1000
                    });
                }

                setElements(newElements);
                saveHistory(newElements);
                addToast('success', isZh ? '畫布佈局已根據品牌 DNA 優化完畢。' : 'Canvas layout optimized based on Brand DNA.', 'AI Architect');
            } catch (e) {
                setError(isZh ? "生成失敗：神經網絡連接不穩定。" : "Generation failed: Neural network connection unstable.");
            } finally {
                setIsGenerating(false);
            }
        }, 2200);
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("id", id);
    };

    const handleDrop = (e: React.DragEvent) => {
        const id = e.dataTransfer.getData("id");
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Simple scaling calculation since canvas is fixed size inside container
        const scaleX = 800 / rect.width;
        const scaleY = 500 / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        const newEls = elements.map(el => el.id === id ? { ...el, x: x - el.width / 2, y: y - el.height / 2 } : el);
        setElements(newEls);
        saveHistory(newEls);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-fade-in font-sans">
            <div className="h-16 border-b border-white/10 bg-slate-900/90 backdrop-blur-2xl flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl shadow-lg border border-white/10" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">{isZh ? '合作夥伴 AI 品牌畫布 2.5' : 'Partner AI Brand Canvas 2.5'}</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">
                                    {isZh ? '品牌色調已校準' : 'Palette Calibrated'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 ml-4">
                        {(['Strategic', 'Minimalist', 'Vibrant'] as DesignTheme[]).map(t => (
                            <button key={t} onClick={() => setTheme(t)} className={`px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${theme === t ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>{isZh ? (t==='Strategic'?'戰略型':t==='Minimalist'?'極簡型':'動態型') : t}</button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl text-xs font-bold transition-all border border-white/10">
                        <Download className="w-4 h-4" /> {isZh ? '匯出畫布' : 'Export'}
                    </button>
                    <button onClick={onClose} className="p-2.5 hover:bg-red-500/20 rounded-full text-gray-500 hover:text-red-400 transition-colors"><X className="w-6 h-6" /></button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col gap-10 shrink-0 overflow-y-auto custom-scrollbar z-40">
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" /> {isZh ? '品牌識別 (Branding)' : 'Brand Identity'}
                        </h4>
                        <div onClick={() => logoInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-white/30 transition-all bg-white/5 cursor-pointer group relative overflow-hidden shadow-inner">
                            {brandLogo ? (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <img src={brandLogo} className="h-12 object-contain z-10" alt="Logo" />
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-7 h-7 text-gray-500 group-hover:text-white" />
                                    <span className="text-xs text-gray-500 group-hover:text-white">{isZh ? '更換品牌 Logo' : 'Change Brand Logo'}</span>
                                </>
                            )}
                            <input type="file" ref={logoInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*" />
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-xl" style={{ backgroundColor: primaryColor }} />
                            <div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase">{isZh ? '當前主色調' : 'Current Primary'}</div>
                                <div className="text-xs font-mono text-white uppercase">{primaryColor}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Wand2 className="w-3 h-3" /> {isZh ? 'AI 智能提示詞' : 'AI Prompt'}
                        </h4>
                        <textarea value={prompt} onChange={(e) => { setPrompt(e.target.value); setError(null); }} placeholder={isZh ? "描述您想要傳達的品牌永續核心訊息，AI 將根據品牌色進行配色..." : "Describe your core message, AI will color-match based on branding..."} className="w-full h-36 bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-celestial-gold/50 outline-none resize-none leading-relaxed shadow-inner" />
                        <button onClick={handleAiGenerate} disabled={isGenerating} style={{ backgroundColor: isGenerating ? '#1e293b' : primaryColor }} className="w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl disabled:cursor-wait">
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            {isZh ? (isGenerating ? '正在渲染佈局' : 'AI 品牌渲染') : (isGenerating ? 'Rendering...' : 'AI Brand Render')}
                        </button>
                    </div>
                    
                    <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Trust Link</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            所有生成的設計皆包含數位浮水印，保護合作夥伴智慧財產權與品牌完整性。
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col relative bg-[#020617] overflow-hidden p-12">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
                    
                    <div className="flex-1 relative bg-slate-900 rounded-sm border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden" 
                         style={{ aspectRatio: '16/10' }}
                         onDragOver={(e) => e.preventDefault()} 
                         onDrop={handleDrop} 
                         onClick={() => setSelectedId(null)}
                    >
                        {/* THE CANVAS */}
                        <div className="absolute inset-0" style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
                            {elements.map(el => (
                                <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el.id)} onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }} className={`absolute cursor-move transition-all flex items-center justify-center ${selectedId === el.id ? 'ring-2 ring-white ring-offset-4 ring-offset-slate-900 z-[2000]' : 'hover:ring-1 hover:ring-white/20'}`} style={{ left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex, ...el.style }}>
                                    {el.type === 'text' && <div className="w-full h-full select-none" style={{ color: el.style?.color }}>{el.content}</div>}
                                    {el.type === 'logo' && <img src={el.content} className="w-full h-full object-contain pointer-events-none" alt="Brand Logo" />}
                                    {el.type === 'metric' && <div className="w-full h-full flex flex-col justify-center select-none"><div className="text-[10px] text-gray-500 uppercase font-bold mb-1 opacity-60">Impact Core</div><div className="text-4xl font-black text-white leading-none">{el.content}</div></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-16 mt-8 ios-pill border-t border-white/10 flex items-center px-10 gap-10 shrink-0">
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4" /> {isZh ? '演進歷史' : 'Design History'}
                        </span>
                        <input type="range" min={0} max={history.length - 1} value={historyIndex} onChange={(e) => handleTimeTravel(parseInt(e.target.value))} className="flex-1 h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-celestial-gold" />
                        <div className="text-[10px] font-mono text-gray-600 w-24 text-right">SNAPSHOT_V.{historyIndex}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AlumniZone: React.FC<AlumniZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  const [currentRole, setCurrentRole] = useState<UserRole>('Student');
  const [collabForm, setCollabForm] = useState({ company: '', website: '', email: '', project: '', reason: '' });
  const [showCanvas, setShowCanvas] = useState(false);

  const pageData = {
      title: { zh: '校友與夥伴專區', en: 'Alumni & Partner Zone' },
      desc: { zh: '全方位永續社群學習管理與異業品牌共創系統', en: 'LMS & Cross-Industry Brand Co-Creation System' },
      tag: { zh: '生態核心', en: 'Eco Core' }
  };

  const handleApplyCollab = (e: React.FormEvent) => {
      e.preventDefault();
      addToast('success', isZh ? '申請已提交！JunAiKey 正在評估匹配度。' : 'Application submitted!', 'Collaboration');
      setCollabForm({ company: '', website: '', email: '', project: '', reason: '' });
  };

  const AdminView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <OmniEsgCell mode="card" label={isZh ? "總營收 (月度)" : "Total Revenue"} value="$42,500" color="gold" icon={DollarSign} traits={['performance']} />
              <OmniEsgCell mode="card" label={isZh ? "活躍學員" : "Active Students"} value="1,245" color="blue" icon={Users} subValue={isZh ? "+12% 較上月" : "+12% vs last month"} />
              <OmniEsgCell mode="card" label={isZh ? "待審核合作案" : "Pending Approvals"} value="8" color="purple" icon={FileText} traits={['gap-filling']} />
          </div>
      </div>
  );

  const StudentView = () => (
      <div className="space-y-8 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-blue-500 bg-blue-900/10">
                  <div className="flex justify-between items-center mb-5">
                      <h4 className="font-bold text-white text-lg">{isZh ? '課前準備' : 'Pre-Class'}</h4>
                      <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <ul className="space-y-4 text-sm text-gray-300">
                      <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-emerald-500" /> {isZh ? '註冊身分確認' : 'Registration'}</li>
                      <li className="flex gap-3 items-center"><Activity className="w-5 h-5 text-amber-400 animate-pulse" /> {isZh ? '預習教材下載' : 'Materials'}</li>
                  </ul>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-gold bg-amber-900/10">
                  <div className="flex justify-between items-center mb-5">
                      <h4 className="font-bold text-white text-lg">{isZh ? '課中互動' : 'In-Class'}</h4>
                      <Video className="w-6 h-6 text-celestial-gold" />
                  </div>
                  <ul className="space-y-4 text-sm text-gray-300">
                      <li className="flex gap-3 items-center"><PlayCircle className="w-5 h-5 text-celestial-gold" /> {isZh ? '進入虛擬教室' : 'Live Room'}</li>
                  </ul>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-purple bg-purple-900/10">
                  <div className="flex justify-between items-center mb-5">
                      <h4 className="font-bold text-white text-lg">{isZh ? '課後延伸' : 'Post-Class'}</h4>
                      <Award className="w-6 h-6 text-celestial-purple" />
                  </div>
                  <ul className="space-y-4 text-sm text-gray-300">
                      <li className="flex gap-3 items-center"><Users className="w-5 h-5 text-celestial-purple" /> {isZh ? '校友精英網絡' : 'Alumni'}</li>
                  </ul>
              </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 flex-1 min-0 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-celestial-blue" />
                  {isZh ? '我的學習路徑' : 'My Courses'}
              </h3>
              <div className="space-y-5 overflow-y-auto custom-scrollbar flex-1">
                  {MOCK_COURSES.map(course => (
                      <div key={course.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-celestial-blue/30 transition-all group">
                          <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-xl ${course.status === 'Live' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-gray-400'}`}>
                                  {course.status === 'Live' ? <Video className="w-6 h-6 animate-pulse" /> : <BookOpen className="w-6 h-6" />}
                              </div>
                              <div>
                                  <h4 className="font-bold text-white text-lg">{course.title}</h4>
                                  <div className="text-xs text-gray-400 flex gap-3 mt-1.5">
                                      <span>{course.instructor}</span>
                                      <span>•</span>
                                      <span>{isZh ? '下次課程: ' : 'Next: '} {course.nextSession}</span>
                                  </div>
                              </div>
                          </div>
                          <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors">{isZh ? '進入教室' : 'Enter'}</button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const PartnerView = () => (
      <div className="space-y-8 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-emerald-400" />
                  {isZh ? '生態系夥伴協作專區' : 'Ecosystem Partners'}
              </h3>
              <button 
                  onClick={() => setShowCanvas(true)}
                  className="px-6 py-3 bg-gradient-to-r from-celestial-purple to-indigo-600 text-white font-bold rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 transition-transform"
              >
                  <LayoutTemplate className="w-5 h-5" />
                  {isZh ? '開啟 AI 品牌共創畫布' : 'Open Brand AI Canvas'}
              </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-0 overflow-y-auto">
              <div className="space-y-8">
                  <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-gold bg-gradient-to-b from-amber-900/10 to-transparent">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <Zap className="w-6 h-6 text-celestial-gold" />
                          {isZh ? '異業合作申請流程' : 'Application Process'}
                      </h3>
                      <div className="space-y-6">
                          {[
                              { step: 1, title: isZh ? '提交品牌提案' : 'Submit Proposal', desc: isZh ? '填寫企業 DNA 與合作願景' : 'Fill details & proposal' },
                              { step: 2, title: isZh ? 'JunAiKey 智能初審' : 'AI Review', desc: isZh ? '系統自動評估永續契合度' : 'Auto-match compatibility' },
                              { step: 3, title: isZh ? '官方共識簽約' : 'Official Review', desc: isZh ? '專人對接與權益解鎖' : 'Contract & Onboarding' },
                              { step: 4, title: isZh ? '上架影響力專區' : 'Launch', desc: isZh ? '啟動 AI 畫布與品牌曝光' : 'Unlock Canvas & Exposure' },
                          ].map((s, i) => (
                              <div key={i} className="flex gap-5 items-start">
                                  <div className="w-10 h-10 rounded-full bg-celestial-gold/20 text-celestial-gold flex items-center justify-center font-black border border-celestial-gold/30 shrink-0">{i+1}</div>
                                  <div>
                                      <h4 className="font-bold text-white text-base">{s.title}</h4>
                                      <p className="text-sm text-gray-400 mt-1">{s.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl border border-white/10 h-fit">
                  <h4 className="font-bold text-white mb-6 flex items-center gap-3">
                      <PenTool className="w-6 h-6 text-celestial-purple" />
                      {isZh ? '合作意向申請表' : 'Apply Now'}
                  </h4>
                  <form onSubmit={handleApplyCollab} className="space-y-5">
                      <div className="space-y-2">
                          <label className="text-xs text-gray-400 ml-1 font-bold">{isZh ? '企業名稱' : 'Company Name'}</label>
                          <input type="text" value={collabForm.company} onChange={e => setCollabForm({...collabForm, company: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none" required />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs text-gray-400 ml-1 font-bold">{isZh ? '合作願景描述' : 'Reason'}</label>
                          <textarea value={collabForm.reason} onChange={e => setCollabForm({...collabForm, reason: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:border-celestial-gold/50 outline-none h-32 resize-none" placeholder={isZh ? "請簡述您希望如何與我們共同創造永續價值..." : "Briefly describe your proposal..."} required />
                      </div>
                      <button type="submit" className="w-full py-4 bg-celestial-gold text-black font-black rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">{isZh ? '提交合作提案' : 'Submit Application'}</button>
                  </form>
              </div>
          </div>
      </div>
  );

  return (
    <>
        {showCanvas && <PartnerCanvas isZh={isZh} onClose={() => setShowCanvas(false)} />}
        
        <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in overflow-hidden">
            <UniversalPageHeader icon={Users} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />

            <div className="flex ios-pill p-1.5 rounded-2xl border border-white/10 mb-4 overflow-x-auto no-scrollbar shrink-0 w-fit max-w-full">
                {(['Admin', 'Agent', 'Consultant', 'Student', 'Parent', 'Partner'] as UserRole[]).map(role => (
                    <button key={role} onClick={() => { setCurrentRole(role); addToast('info', isZh ? `切換視角：${role}` : `Role: ${role}`, 'Context'); }} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${currentRole === role ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                        {isZh ? (role === 'Admin' ? '行政管理' : role === 'Agent' ? '代理業務' : role === 'Consultant' ? '顧問講師' : role === 'Student' ? '學員' : role === 'Parent' ? '家長' : '合作夥伴') : role}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 min-0 relative">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-1">
                    {currentRole === 'Admin' && <AdminView />}
                    {currentRole === 'Student' && <StudentView />}
                    {currentRole === 'Partner' && <PartnerView />}
                    {(['Agent', 'Consultant', 'Parent'].includes(currentRole)) && (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500 opacity-50">
                            <Activity className="w-16 h-16 mb-4" />
                            <p className="text-sm font-bold uppercase tracking-[0.2em]">{isZh ? '此視角正在對齊中...' : 'Context Alignment in Progress...'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
  );
};
