import React, { useState, useRef, useEffect } from 'react';
import { Language, View } from '../types';
import { 
    Users, BookOpen, GraduationCap, Video, Calendar, FileText, 
    MessageSquare, Settings, Award, Plus, Layout, UserPlus, 
    Briefcase, Activity, CheckCircle, ExternalLink, RefreshCw,
    PlayCircle, Upload, PenTool, BarChart, DollarSign, Handshake, 
    Megaphone, Wand2, Image as ImageIcon, Type, Move, Save, 
    LayoutTemplate, MousePointer2, X, ChevronRight, Zap, History, Clock, Infinity, User, Shield, Palette, Download, Layers,
    Hexagon, Trash2, Maximize2, MousePointer
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
    { id: 'c1', title: 'Corporate Carbon Management (ISO 14064)', instructor: 'Dr. Yang', status: 'Live', progress: 45, nextSession: 'Tomorrow, 14:00', students: 32, platform: 'Google' },
    { id: 'c2', title: 'ESG Strategic Leadership', instructor: 'Prof. Lee', status: 'Pre', progress: 0, nextSession: 'June 15, 09:00', students: 18, platform: 'Custom' },
    { id: 'c3', title: 'Supply Chain Auditing Workshop', instructor: 'Consultant Sarah', status: 'Post', progress: 100, nextSession: '-', students: 25, platform: 'Zoom' },
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

const PartnerCanvas: React.FC<{ isZh: boolean, onClose: () => void }> = ({ isZh, onClose }) => {
    const { addToast } = useToast();
    const logoInputRef = useRef<HTMLInputElement>(null);
    
    // Brand Context
    const [brandLogo, setBrandLogo] = useState<string | null>(null);
    const [primaryColor, setPrimaryColor] = useState('#8b5cf6'); // Default Purple
    const [theme, setTheme] = useState<DesignTheme>('Strategic');

    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    
    const [history, setHistory] = useState<CanvasHistoryState[]>([{ timestamp: Date.now(), elements: [] }]);
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

    // --- LOGO UPLOAD & COLOR EXTRACTION ---
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setBrandLogo(url);
                
                // Extraction Simulation Logic: Deterministic colors for demo feel
                const colors = ['#0ABAB5', '#4CAF50', '#0056B3', '#D4AF37', '#FF4B2B'];
                const extractedColor = colors[Math.floor(Math.random() * colors.length)];
                setPrimaryColor(extractedColor);
                
                // Add Logo to Canvas automatically at top left anchor
                const logoEl: CanvasElement = {
                    id: `logo-${Date.now()}`,
                    type: 'logo',
                    content: url,
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 50,
                    style: { objectFit: 'contain' },
                    zIndex: 100
                };
                const updated = [...elements, logoEl];
                setElements(updated);
                saveHistory(updated);
                addToast('success', isZh ? '品牌識別載入成功，AI 已自動提取企業色。' : 'Brand identity loaded, AI extracted corporate color.', 'Branding');
            };
            reader.readAsDataURL(file);
        }
    };

    // --- HIGH-USABILITY GENERATION ENGINE (95%+) ---
    const handleAiGenerate = async () => {
        setIsGenerating(true);
        addToast('info', isZh ? '正在進行高維度佈局運算 (Grid Anchor Alignment)...' : 'Running high-dimensional layout computation...', 'AI Designer 2.0');

        setTimeout(() => {
            const newElements: CanvasElement[] = [];
            const canvasW = 800;
            const canvasH = 500;

            if (theme === 'Strategic') {
                newElements.push(
                    // Background & Gradient Mesh
                    { id: 'bg', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { backgroundColor: '#020617' }, zIndex: 0 },
                    { id: 'mesh', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { background: `radial-gradient(circle at 10% 10%, ${primaryColor}20 0%, transparent 50%)` }, zIndex: 1 },
                    // Main Title (Anchor: Top Center-Left)
                    { id: 'title', type: 'text', content: prompt || (isZh ? '2025 永續發展願景' : '2025 Sustainability Vision'), x: 50, y: 120, width: 600, height: 80, style: { fontSize: '42px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em' }, zIndex: 10 },
                    { id: 'subtitle', type: 'text', content: isZh ? '以科技驅動價值，共建綠色生態' : 'Tech-driven values for a green ecosystem', x: 50, y: 200, width: 500, height: 30, style: { fontSize: '18px', color: primaryColor, fontWeight: '500', opacity: 0.8 }, zIndex: 11 },
                    // Metrics (Anchor: Bottom Right Cluster)
                    { id: 'm1', type: 'metric', content: '85% RE', x: 50, y: 320, width: 140, height: 90, style: { background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${primaryColor}`, padding: '16px', borderRadius: '12px' }, zIndex: 20 },
                    { id: 'm2', type: 'metric', content: '-15% CO2', x: 210, y: 320, width: 140, height: 90, style: { background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${primaryColor}`, padding: '16px', borderRadius: '12px' }, zIndex: 21 },
                    // Decorative Line
                    { id: 'dec1', type: 'decoration', content: '', x: 50, y: 100, width: 40, height: 4, style: { backgroundColor: primaryColor, borderRadius: '2px' }, zIndex: 5 }
                );
            } else if (theme === 'Minimalist') {
                newElements.push(
                    { id: 'bg', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { backgroundColor: '#ffffff' }, zIndex: 0 },
                    { id: 'title', type: 'text', content: prompt || 'PURE IMPACT', x: 0, y: 220, width: canvasW, height: 60, style: { fontSize: '32px', fontWeight: '200', color: '#111827', textAlign: 'center', letterSpacing: '0.4em' }, zIndex: 10 },
                    { id: 'line', type: 'shape', content: '', x: 350, y: 290, width: 100, height: 1, style: { backgroundColor: primaryColor }, zIndex: 11 }
                );
            } else {
                // Vibrant (Center-Out Explosion)
                newElements.push(
                    { id: 'bg', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { backgroundColor: primaryColor }, zIndex: 0 },
                    { id: 'overlay', type: 'shape', content: '', x: 0, y: 0, width: canvasW, height: canvasH, style: { background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))' }, zIndex: 1 },
                    { id: 'title', type: 'text', content: prompt || 'GO GREEN', x: 50, y: 50, width: 700, height: 300, style: { fontSize: '120px', fontWeight: '900', color: '#ffffff', opacity: 0.2, fontStyle: 'italic' }, zIndex: 2 },
                    { id: 'front-text', type: 'text', content: isZh ? '引領未來' : 'Lead Future', x: 100, y: 200, width: 500, height: 60, style: { fontSize: '48px', fontWeight: 'bold', color: '#ffffff' }, zIndex: 10 }
                );
            }

            // Keep the logo if it was already there
            if (brandLogo) {
                newElements.push({
                    id: `logo-${Date.now()}`,
                    type: 'logo',
                    content: brandLogo,
                    x: theme === 'Minimalist' ? 350 : 40,
                    y: 40,
                    width: 100,
                    height: 50,
                    style: { objectFit: 'contain' },
                    zIndex: 100
                });
            }

            setElements(newElements);
            saveHistory(newElements);
            setIsGenerating(false);
            addToast('success', isZh ? '高可用度佈局已生成 (Usability: 98%)' : 'High-usability layout generated.', 'AI Architect');
        }, 1800);
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("id", id);
        // Add ghost image offset logic here if needed
    };

    const handleDrop = (e: React.DragEvent) => {
        const id = e.dataTransfer.getData("id");
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newEls = elements.map(el => el.id === id ? { ...el, x: x - el.width / 2, y: y - el.height / 2 } : el);
        setElements(newEls);
        saveHistory(newEls);
    };

    const selectedElement = elements.find(el => el.id === selectedId);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-fade-in font-sans">
            {/* Top Toolbar (Figma Style) */}
            <div className="h-16 border-b border-white/10 bg-slate-900/90 backdrop-blur-2xl flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                            <LayoutTemplate className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">{isZh ? '合作夥伴 AI 品牌畫布 2.0' : 'Partner AI Brand Canvas 2.0'}</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Synced with Neural Design System</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* View Controls */}
                    <div className="h-8 w-px bg-white/5 mx-2" />
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                        {(['Strategic', 'Minimalist', 'Vibrant'] as DesignTheme[]).map(t => (
                            <button 
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${theme === t ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all border border-white/10">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full text-gray-500 hover:text-red-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Tool Bar (Layer & Assets) */}
                <div className="w-72 bg-slate-900 border-r border-white/10 p-5 flex flex-col gap-8 shrink-0 overflow-y-auto custom-scrollbar z-40">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? '品牌 DNA' : 'Brand DNA'}</h4>
                        <div 
                            onClick={() => logoInputRef.current?.click()}
                            className="w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-white/30 transition-all bg-white/5 cursor-pointer group relative overflow-hidden"
                        >
                            {brandLogo ? (
                                <>
                                    <img src={brandLogo} className="h-16 object-contain z-10" alt="Logo" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                                    <span className="text-xs text-gray-500 group-hover:text-white transition-colors">{isZh ? '上傳品牌 Logo' : 'Upload Brand Logo'}</span>
                                </>
                            )}
                            <input type="file" ref={logoInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*" />
                        </div>
                        
                        {brandLogo && (
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-md shadow-lg" style={{ backgroundColor: primaryColor }} />
                                    <span className="text-[10px] font-mono text-white/70 uppercase">{primaryColor}</span>
                                </div>
                                <Palette className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? 'AI 智能提示詞' : 'AI Generation Prompt'}</h4>
                        <div className="relative">
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={isZh ? "描述您想要傳達的品牌永續核心訊息..." : "Describe the core sustainability message..."}
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 resize-none leading-relaxed transition-all"
                            />
                        </div>
                        <button 
                            onClick={handleAiGenerate}
                            disabled={isGenerating}
                            style={{ backgroundColor: isGenerating ? '#1e293b' : primaryColor }}
                            className="w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl disabled:cursor-wait"
                        >
                            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                            {isZh ? 'AI 一鍵智能生成' : 'AI Magic Generation'}
                        </button>
                        <p className="text-[9px] text-gray-600 text-center uppercase tracking-tighter">Powered by JunAiKey Vision-Grid Engine</p>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{isZh ? '基礎工具' : 'Static Components'}</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'txt', icon: Type, label: 'Text' },
                                { id: 'img', icon: ImageIcon, label: 'Image' },
                                { id: 'lay', icon: Layers, label: 'Layers' },
                                { id: 'shp', icon: Hexagon, label: 'Shape' }
                            ].map(tool => (
                                <button key={tool.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center gap-2 transition-all border border-transparent hover:border-white/10">
                                    <tool.icon className="w-5 h-5 text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-500">{tool.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Workspace (Canvas) */}
                <div className="flex-1 flex flex-col relative bg-[#020617] overflow-hidden">
                    {/* Ruler / Background Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                    
                    {/* The Visual Canvas */}
                    <div 
                        className="flex-1 relative m-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 bg-slate-900 overflow-hidden rounded-sm select-none"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => setSelectedId(null)}
                    >
                        {elements.map(el => (
                            <div
                                key={el.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, el.id)}
                                onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                                className={`absolute cursor-move transition-all ${selectedId === el.id ? 'ring-2 ring-white ring-offset-4 ring-offset-slate-900 z-50' : 'hover:ring-1 hover:ring-white/20'}`}
                                style={{ 
                                    left: el.x, 
                                    top: el.y, 
                                    width: el.width, 
                                    height: el.height,
                                    zIndex: el.zIndex,
                                    ...el.style 
                                }}
                            >
                                {el.type === 'text' && <div className="w-full h-full flex items-center">{el.content}</div>}
                                {el.type === 'image' && <img src={el.content} className="w-full h-full object-cover" alt="" />}
                                {el.type === 'logo' && <img src={el.content} className="w-full h-full object-contain" alt="Brand Logo" />}
                                {el.type === 'shape' && <div className="w-full h-full" style={el.style} />}
                                {el.type === 'metric' && (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Impact Metric</div>
                                        <div className="text-3xl font-black text-white leading-none">{el.content}</div>
                                    </div>
                                )}
                                {el.type === 'decoration' && <div className="w-full h-full" style={el.style} />}
                            </div>
                        ))}

                        {elements.length === 0 && !isGenerating && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 animate-pulse">
                                <MousePointer className="w-12 h-12 mb-4 opacity-10" />
                                <p className="text-xs uppercase tracking-[0.4em] font-bold">{isZh ? '等待 AI 生成佈局' : 'Waiting for AI Manifestation'}</p>
                            </div>
                        )}
                    </div>

                    {/* Version History Toolbar (Time Machine) */}
                    <div className="h-14 bg-slate-900/95 border-t border-white/10 backdrop-blur-xl flex items-center px-8 gap-10 z-50">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-2 h-2 rounded-full bg-celestial-gold animate-pulse" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{isZh ? '版本時光機' : 'Time Machine'}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-6">
                            <input 
                                type="range" 
                                min={0} 
                                max={history.length - 1} 
                                value={historyIndex} 
                                onChange={(e) => handleTimeTravel(parseInt(e.target.value))}
                                className="flex-1 h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-celestial-gold"
                            />
                            <div className="text-[10px] font-mono text-gray-600 w-24 text-right">
                                {historyIndex === history.length - 1 ? 'LATEST' : `v.${historyIndex}`}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => addToast('info', 'Snapshot saved to Palace Archive.', 'Time Machine')} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors" title="Save Snapshot">
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Inspect Panel (Properties) */}
                <div className="w-72 bg-slate-900 border-l border-white/10 p-5 shrink-0 z-50 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? '元素屬性' : 'Inspect'}</h4>
                        <Settings className="w-4 h-4 text-gray-600" />
                    </div>

                    {selectedElement ? (
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-4">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Geometry</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase">X Axis</label>
                                        <input type="number" value={Math.round(selectedElement.x)} readOnly className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase">Y Axis</label>
                                        <input type="number" value={Math.round(selectedElement.y)} readOnly className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Dimensions</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase">Width</label>
                                        <input type="number" value={Math.round(selectedElement.width)} readOnly className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase">Height</label>
                                        <input type="number" value={Math.round(selectedElement.height)} readOnly className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                                    </div>
                                </div>
                            </div>

                            {selectedElement.type === 'text' && (
                                <div className="space-y-4">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Typography</div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">Size</span>
                                            <span className="text-xs text-white font-mono">{selectedElement.style?.fontSize}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">Weight</span>
                                            <span className="text-xs text-white font-mono">{selectedElement.style?.fontWeight}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="pt-8 mt-8 border-t border-white/5">
                                <button 
                                    onClick={() => {
                                        const updated = elements.filter(el => el.id !== selectedId);
                                        setElements(updated);
                                        saveHistory(updated);
                                        setSelectedId(null);
                                        addToast('info', 'Layer removed.', 'Editor');
                                    }}
                                    className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> {isZh ? '刪除選取圖層' : 'Delete Selected Layer'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-gray-600 text-center">
                            <MousePointer2 className="w-10 h-10 mb-6 opacity-10" />
                            <p className="text-[10px] uppercase font-bold tracking-widest px-10">{isZh ? '在畫布上選取元件\n以開始編輯' : 'Select an element on canvas to edit'}</p>
                        </div>
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

  const AdminView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <OmniEsgCell mode="card" label={isZh ? "總營收 (Monthly)" : "Total Revenue"} value="$42,500" color="gold" icon={DollarSign} traits={['performance']} />
              <OmniEsgCell mode="card" label={isZh ? "活躍學員" : "Active Students"} value="1,245" color="blue" icon={Users} subValue="+12% vs last month" />
              <OmniEsgCell mode="card" label={isZh ? "待審核申請" : "Pending Approvals"} value="8" color="purple" icon={FileText} traits={['gap-filling']} />
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 min-0 overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-0 overflow-y-auto">
              <OmniEsgCell mode="list" label={isZh ? "本月佣金" : "Commission"} value="$3,200" color="gold" icon={DollarSign} />
              <OmniEsgCell mode="list" label={isZh ? "轉化率" : "Conversion Rate"} value="4.8%" color="emerald" icon={Activity} />
          </div>
      </div>
  );

  const ConsultantView = () => (
      <div className="space-y-6 animate-fade-in flex flex-col h-full overflow-hidden">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 min-0 flex flex-col">
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

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 min-0 flex flex-col">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-0 overflow-y-auto">
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

  const PartnerView = () => (
      <div className="space-y-8 animate-fade-in flex flex-col h-full overflow-hidden">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-0 overflow-y-auto">
              <div className="space-y-6">
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
            
            <div className="flex-1 min-0 relative">
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
