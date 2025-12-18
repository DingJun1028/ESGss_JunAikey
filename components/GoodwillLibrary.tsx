
import React, { useState, useMemo } from 'react';
import { Language, View } from '../types';
import { 
    BookOpen, Calendar, Users, Database, Search, ArrowRight, Heart, 
    Share2, Star, Download, ExternalLink, Library, FileText, BarChart2, 
    Lightbulb, GraduationCap, X, ShieldCheck, Globe, Filter, Zap,
    BookCheck, Newspaper, Award, FileSearch, Sparkles, BrainCircuit,
    /* Added missing imports for icon components used in analysis results */
    Layers, RefreshCw
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { marked } from 'marked';

interface GoodwillLibraryProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

interface ReportMetadata {
    id: string;
    company: string;
    year: string;
    sector: string;
    score: string;
    highlight: string;
    color: string;
    description: string;
    isYearbook?: boolean;
}

export const GoodwillLibrary: React.FC<GoodwillLibraryProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'reports' | 'books' | 'repo'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  
  // AI Interactive State
  const [activeAnalysis, setActiveAnalysis] = useState<{ report: ReportMetadata, type: 'analyze' | 'highlight' | 'education' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pageData = {
      title: { zh: '善向圖書館 (Goodwill Library)', en: 'Goodwill Library' },
      desc: { zh: '知識共享與標竿企業永續實踐中心：整合歷年永續報告書、企業年鑑與 AI 深度解析。', en: 'Hub for Knowledge Sharing and Enterprise ESG Practice: Sustainability reports, yearbooks, and AI insights.' },
      tag: { zh: '知識核心', en: 'Knowledge Core' }
  };

  const enterpriseReports: ReportMetadata[] = [
      { id: 'ctbc-2023', company: 'CTBC 中國信託', year: '2023', sector: 'Finance', score: 'AA', highlight: 'Green Finance & Digital Inclusion', color: 'bg-emerald-700', description: '亞洲領先的金融永續轉型標竿，深入探討綠色融資路徑。' },
      { id: 'tsmc-2023', company: 'TSMC 台積電', year: '2023', sector: 'Semiconductor', score: 'AA', highlight: 'Water Stewardship', color: 'bg-emerald-600', description: '全球半導體水資源循環利用率第一，具備極高數據透明度。' },
      { id: 'delta-2023', company: 'Delta 台達電', year: '2023', sector: 'Electronics', score: 'AAA', highlight: 'Internal Carbon Pricing', color: 'bg-blue-600', description: '首家將內部碳定價 (ICP) 導入全球廠區的先驅者。' },
      { id: 'esun-2023', company: 'E.SUN 玉山金控', year: '2023', sector: 'Finance', score: 'AA', highlight: 'Biodiversity Finance', color: 'bg-emerald-500', description: '針對生物多樣性揭露 (TNFD) 提供早期實踐框架。' },
      { id: 'fubon-2023', company: 'Fubon 富邦金控', year: '2023', sector: 'Finance', score: 'A', highlight: 'Responsible Investment', color: 'bg-sky-700', description: '聚焦責任投資與保險影響力。' },
      { id: 'yb-2024', company: 'ESG Sunshine', year: '2024', sector: 'Consulting', score: 'PIONEER', highlight: 'JunAiKey OS Ecosystem', color: 'bg-indigo-600', description: '善向永續 2024 企業年鑑：定義 AI 驅動的永續未來。', isYearbook: true },
  ];

  const handleReportAction = (type: 'analyze' | 'highlight' | 'education', report: ReportMetadata) => {
      setIsProcessing(true);
      setActiveAnalysis({ report, type });
      
      const actionName = type === 'analyze' ? (isZh ? '深度分析' : 'Analysis') : 
                         type === 'highlight' ? (isZh ? '核心亮點' : 'Highlights') : 
                         (isZh ? '合規教學' : 'Education');

      addToast('info', isZh ? `正在執行 ${report.company} 的 ${actionName}...` : `Running ${actionName} for ${report.company}...`, 'JunAiKey Agent');
      
      setTimeout(() => {
          setIsProcessing(false);
          addToast('success', isZh ? '分析結果已生成' : 'Analysis generated', 'AI Intelligence');
      }, 2000);
  };

  const sectors = ['All', ...Array.from(new Set(enterpriseReports.map(r => r.sector)))];

  const filteredReports = useMemo(() => {
    return enterpriseReports.filter(r => {
        const matchesSearch = r.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             r.highlight.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = selectedSector === 'All' || r.sector === selectedSector;
        return matchesSearch && matchesSector;
    });
  }, [searchQuery, selectedSector]);

  return (
    <div className="space-y-8 animate-fade-in pb-24">
        <UniversalPageHeader 
            icon={Library}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* --- Library Controls --- */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-40 bg-[#020617]/80 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 shrink-0">
                {[
                    { id: 'reports', label: isZh ? '永續報告與年鑑' : 'Reports & Yearbooks', icon: FileText },
                    { id: 'books', label: isZh ? '必讀書單' : 'Curated Books', icon: BookOpen },
                    { id: 'repo', label: isZh ? '法規資料庫' : 'Reg Repo', icon: Database },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 w-full max-w-2xl flex gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500 group-focus-within:text-celestial-gold transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isZh ? "搜尋企業標竿、報告內容或影響力關鍵字..." : "Search benchmarks, content, or impact keywords..."}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-gold/50 outline-none transition-all placeholder:text-gray-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select 
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                    >
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* --- Tab Content --- */}
        {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredReports.map(report => (
                    <div key={report.id} className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/10 group hover:border-celestial-gold/30 hover:shadow-2xl hover:shadow-celestial-gold/5 transition-all duration-500 flex flex-col relative">
                        {report.isYearbook && (
                            <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-celestial-gold text-black text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                <Star className="w-3 h-3 fill-current" /> YEARBOOK
                            </div>
                        )}
                        
                        <div className={`h-40 ${report.color} relative p-8 flex flex-col justify-between overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                            {/* Animated Background Decoration */}
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white font-mono text-xs font-bold shadow-lg">
                                    {report.year}
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-2xl font-black text-white tracking-tighter flex items-center gap-1.5 drop-shadow-xl">
                                        <ShieldCheck className="w-5 h-5 text-celestial-gold" />
                                        {report.score}
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">GRI-SASB Verified</span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-celestial-gold transition-colors">{report.company}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                                    <Globe className="w-3 h-3 text-sky-400" />
                                    {report.sector}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8 flex-1 flex flex-col gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                    <Sparkles className="w-3.5 h-3.5 text-celestial-gold" />
                                    Core Strategic Focus
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-celestial-gold/20 transition-all">
                                    <div className="text-sm text-gray-100 font-bold leading-tight">
                                        {report.highlight}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic font-medium leading-relaxed">
                                        "{report.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    onClick={() => handleReportAction('analyze', report)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-white/5 hover:border-celestial-blue/40 rounded-2xl transition-all group/btn hover:bg-celestial-blue/5"
                                >
                                    <BarChart2 className="w-5 h-5 text-blue-400 group-hover/btn:scale-125 transition-transform" />
                                    <span className="text-[9px] font-black text-gray-500 group-hover/btn:text-white uppercase tracking-widest">{isZh ? '數據分析' : 'Analyze'}</span>
                                </button>
                                <button 
                                    onClick={() => handleReportAction('highlight', report)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-white/5 hover:border-celestial-gold/40 rounded-2xl transition-all group/btn hover:bg-celestial-gold/5"
                                >
                                    <Lightbulb className="w-5 h-5 text-celestial-gold group-hover/btn:scale-125 transition-transform" />
                                    <span className="text-[9px] font-black text-gray-500 group-hover/btn:text-white uppercase tracking-widest">{isZh ? '亮點提示' : 'Highlight'}</span>
                                </button>
                                <button 
                                    onClick={() => handleReportAction('education', report)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-white/5 hover:border-celestial-emerald/40 rounded-2xl transition-all group/btn hover:bg-celestial-emerald/5"
                                >
                                    <GraduationCap className="w-5 h-5 text-emerald-400 group-hover/btn:scale-125 transition-transform" />
                                    <span className="text-[9px] font-black text-gray-500 group-hover/btn:text-white uppercase tracking-widest">{isZh ? '合規教學' : 'Tutorial'}</span>
                                </button>
                            </div>

                            <button className="w-full py-4 mt-2 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black text-white border border-white/10 flex items-center justify-center gap-2 transition-all group/dl shadow-xl">
                                <Download className="w-4 h-4 text-gray-400 group-hover/dl:text-white" />
                                {isZh ? '下載完整報告書 (PDF)' : 'Download Full PDF'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'books' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {[1,2,3,4].map(i => (
                    <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-white/5 transition-all">
                        <div className="w-32 aspect-[2/3] bg-slate-800 rounded-lg shadow-2xl mb-6 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent" />
                             <BookCheck className="w-12 h-12 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
                        </div>
                        <h4 className="font-bold text-white mb-2">ESG 策略大局觀 #{i}</h4>
                        <p className="text-xs text-gray-500 mb-4">深入剖析永續經濟轉型邏輯</p>
                        <button className="text-xs font-black text-celestial-gold uppercase tracking-widest flex items-center gap-2 hover:underline">
                            Read Summary <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'repo' && (
            <div className="glass-panel p-20 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center opacity-40">
                <Database className="w-16 h-16 text-gray-500 mb-6" />
                <p className="text-gray-400 font-bold uppercase tracking-[0.4em]">正在同步全域法規數據庫...</p>
            </div>
        )}

        {/* --- AI Analysis Modal --- */}
        {activeAnalysis && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
                <div className="max-w-4xl w-full bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] relative">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-celestial-gold via-celestial-purple to-celestial-emerald" />
                        
                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-3xl text-white shadow-2xl ${activeAnalysis.report.color}`}>
                                {activeAnalysis.type === 'analyze' ? <BarChart2 className="w-8 h-8" /> : 
                                 activeAnalysis.type === 'highlight' ? <Lightbulb className="w-8 h-8" /> : 
                                 <GraduationCap className="w-8 h-8" />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
                                    {activeAnalysis.type === 'analyze' ? (isZh ? 'AI 數據深度解析' : 'AI Data Analytics') : 
                                     activeAnalysis.type === 'highlight' ? (isZh ? '核心戰略亮點' : 'Strategic Highlights') : 
                                     (isZh ? '合規撰寫教學' : 'Compliance Tutorial')}
                                </h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[11px] font-black text-celestial-gold uppercase tracking-widest">{activeAnalysis.report.company}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">{activeAnalysis.report.year} Report Asset</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setActiveAnalysis(null)} className="p-3 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all"><X className="w-7 h-7" /></button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-slate-900/50">
                        {isProcessing ? (
                            <div className="h-full flex flex-col items-center justify-center gap-6 animate-pulse">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-celestial-gold/20 border-t-celestial-gold animate-spin" />
                                    <BrainCircuit className="w-10 h-10 text-celestial-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-white uppercase tracking-[0.4em] mb-2">JunAiKey Neural Processing</p>
                                    <p className="text-xs text-gray-500 font-mono italic">"Extracting logic anchors from PDF semantic stream..."</p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="prose prose-invert prose-sm max-w-none">
                                    {/* Simulated AI Content based on type */}
                                    {activeAnalysis.type === 'analyze' && (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Emissions Intensity</div>
                                                    <div className="text-3xl font-black text-white tracking-tighter">0.42 <span className="text-sm text-gray-600">t/USDm</span></div>
                                                    <div className="mt-2 text-[10px] text-gray-500 font-bold">12% Lower than Sector Average</div>
                                                </div>
                                                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">RE Transformation</div>
                                                    <div className="text-3xl font-black text-white tracking-tighter">45%</div>
                                                    <div className="mt-2 text-[10px] text-gray-500 font-bold">Target: 100% by 2030 (RE100)</div>
                                                </div>
                                                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                                    <div className="text-[10px] font-black text-celestial-purple uppercase tracking-widest mb-2">ICP Logic</div>
                                                    <div className="text-3xl font-black text-white tracking-tighter">$125 <span className="text-sm text-gray-600">Shadow Price</span></div>
                                                    <div className="mt-2 text-[10px] text-gray-500 font-bold">Incentivizing Low Carbon CAPEX</div>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 leading-relaxed">
                                                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-celestial-gold" /> AI 趨勢分析總結 (Executive Summary)</h4>
                                                <p className="text-gray-300">該企業在供應鏈減碳（Scope 3）的透明度顯著優於同業。特別是在「供應鏈金融」與「ESG 表現掛鉤」的機制設計上，具備高度的創價潛力。建議使用者參考其供應鏈激勵邏輯。</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeAnalysis.type === 'highlight' && (
                                        <div className="space-y-6">
                                            {[
                                                { title: '北極星願景對齊', desc: '報告書中明確定義了「數位減碳」作為核心戰略，不僅是合規，更是新產品線。', icon: Star },
                                                { title: '雙重重大性 (Double Materiality)', desc: '精確計算了氣候風險對財務損益的潛在衝擊（TCFD 對位）。', icon: Layers },
                                                { title: '循環經濟商模', desc: '廢棄物轉能回收率達 95%，將傳統處置成本轉化為次級原料收益。', icon: RefreshCw },
                                            ].map((h, i) => (
                                                <div key={i} className="flex gap-6 p-6 bg-white/[0.02] hover:bg-white/[0.05] rounded-3xl border border-white/5 transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-celestial-gold/10 border border-celestial-gold/20 flex items-center justify-center shrink-0">
                                                        <h.icon className="w-6 h-6 text-celestial-gold" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white mb-2">{h.title}</h4>
                                                        <p className="text-sm text-gray-400 leading-relaxed">{h.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeAnalysis.type === 'education' && (
                                        <div className="space-y-8">
                                            <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10"><GraduationCap className="w-20 h-20 text-indigo-400" /></div>
                                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2 underline underline-offset-8 decoration-indigo-500">本報告書的 GRI 撰寫教學</h4>
                                                <div className="space-y-4 font-mono text-[13px] text-indigo-200">
                                                    <p className="flex gap-3"><span className="text-white font-black">[STEP 1]</span> 識別關鍵指標：該企業優先揭露 GRI 305 (排放) 與 GRI 302 (能源)。</p>
                                                    <p className="flex gap-3"><span className="text-white font-black">[STEP 2]</span> 數據敘事化：觀察其如何將「能耗降低」與「成本節約」進行邏輯關聯。</p>
                                                    <p className="flex gap-3"><span className="text-white font-black">[STEP 3]</span> 驗證協議：參考其數據收集系統（ERP/IoT）的說明，提升報告置信度。</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5">
                                                <h5 className="text-white font-bold mb-4 flex items-center gap-2"><Newspaper className="w-4 h-4 text-emerald-400" /> 相關練習題 (Quick Quiz)</h5>
                                                <p className="text-sm text-gray-400 mb-6">根據此報告的邏輯，以下哪項是該企業降低 Scope 2 排放的核心手段？</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {['採購綠電憑證 (REC)', '改善辦公室照明', '更換高效率馬達'].map((opt, i) => (
                                                        <button key={i} className="p-4 rounded-xl border border-white/10 hover:border-celestial-gold/50 hover:bg-white/5 text-left text-sm text-gray-300 transition-all">
                                                            {String.fromCharCode(65 + i)}. {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-white/5 bg-slate-950/50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Security Context: Local Sandbox Access
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Share Analytics
                            </button>
                            <button className="px-10 py-3 bg-celestial-purple text-white rounded-2xl text-xs font-bold shadow-2xl hover:scale-105 transition-all">
                                Download Synthesis Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
