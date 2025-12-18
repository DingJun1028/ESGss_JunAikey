
import React, { useState, useRef, useMemo } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter, auditReportContent } from '../services/ai-service';
import { Language, ReportSection, PastReport } from '../types';
import { REPORT_STRUCTURE } from '../constants';
import { 
    FileText, Sparkles, Download, Loader2, Save, ChevronRight, BookOpen, 
    ShieldCheck, CheckCircle, Info, Crown, X, FileBarChart, FileCheck, 
    Archive, BarChart2, PieChart, TrendingUp, TrendingDown, Layers, History
} from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { LockedFeature } from './LockedFeature';
import { SubscriptionModal } from './SubscriptionModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';

interface ReportGenProps {
  language: Language;
}

// Mock Data for Past Reports
const MOCK_PAST_REPORTS: PastReport[] = [
    { 
        year: 2023, 
        title: '2023 Sustainability Report', 
        version: 'v1.0', 
        publishDate: '2024-06-15', 
        status: 'Published', 
        metrics: { scope1: 420.5, scope2: 380.2, scope3: 1200.0, energyConsumption: 60000, griCoverage: 95 }
    },
    { 
        year: 2022, 
        title: '2022 ESG Highlights', 
        version: 'v1.2', 
        publishDate: '2023-05-20', 
        status: 'Published', 
        metrics: { scope1: 480.0, scope2: 410.5, scope3: 1150.0, energyConsumption: 65000, griCoverage: 88 }
    },
    { 
        year: 2021, 
        title: '2021 CSR Report', 
        version: 'Final', 
        publishDate: '2022-06-30', 
        status: 'Archived', 
        metrics: { scope1: 510.2, scope2: 450.0, scope3: 1000.0, energyConsumption: 70000, griCoverage: 75 }
    }
];

// ----------------------------------------------------------------------
// Agent: Chapter Node (The Scribe)
// ----------------------------------------------------------------------
interface ChapterNodeProps extends InjectedProxyProps {
    section: ReportSection; 
    isActive: boolean;
    hasContent: boolean;
    onClick: () => void;
}

const ChapterNodeBase: React.FC<ChapterNodeProps> = ({ 
    section, isActive, hasContent, onClick, 
    adaptiveTraits, trackInteraction, isAgentActive 
}) => {
    const isOptimized = adaptiveTraits?.includes('optimization');
    const isEvolved = adaptiveTraits?.includes('evolution');
    
    return (
        <button 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 group relative
                ${isActive ? 'bg-celestial-emerald/10 text-celestial-emerald font-medium' : 'text-gray-500 hover:text-gray-300'}
            `}
        >
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 
                ${hasContent ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-gray-700'}
                ${isOptimized ? 'animate-pulse scale-125' : ''}
            `} />
            <span className="truncate flex-1">{section.title}</span>
            {isAgentActive && <Sparkles className="w-3 h-3 text-celestial-gold animate-spin-slow" />}
            {hasContent && isEvolved && <CheckCircle className="w-3 h-3 text-emerald-500 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
    );
};

const ChapterAgent = withUniversalProxy(ChapterNodeBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const ReportGen: React.FC<ReportGenProps> = ({ language }) => {
  const { companyName, esgScores, totalScore, carbonData, tier, files } = useCompany();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'generator' | 'archive'>('generator');
  const [activeSectionId, setActiveSectionId] = useState<string>('1.01');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  
  const [showMasterReport, setShowMasterReport] = useState(false);
  const [masterReportContent, setMasterReportContent] = useState('');
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);
  
  const [selectedReport, setSelectedReport] = useState<PastReport | null>(MOCK_PAST_REPORTS[0]);

  const reportRef = useRef<HTMLDivElement>(null);
  const masterReportRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  const pageData = {
      title: { zh: '報告中心', en: 'Report Center' },
      desc: { zh: 'GRI/SASB 自動撰寫與歷年報告數據管理', en: 'AI Writer & Historical Report Management' },
      tag: { zh: '表達核心', en: 'Expression Core' }
  };

  const complianceFiles = files.filter(f => f.sourceModule === 'Compliance_Filling');

  const activeSection = useMemo(() => {
    for (const chapter of REPORT_STRUCTURE) {
        if (chapter.id === activeSectionId) return chapter;
        if (chapter.subSections) {
            const sub = chapter.subSections.find(s => s.id === activeSectionId);
            if (sub) return sub;
        }
    }
    return undefined;
  }, [activeSectionId]);
  
  const parentChapter = useMemo(() => {
      return REPORT_STRUCTURE.find(c => c.subSections?.some(s => s.id === activeSectionId));
  }, [activeSectionId]);

  const trendData = useMemo(() => {
      return [...MOCK_PAST_REPORTS].reverse().map(r => ({
          year: r.year,
          emissions: r.metrics.scope1 + r.metrics.scope2,
          intensity: ((r.metrics.scope1 + r.metrics.scope2) / (r.metrics.energyConsumption / 1000)).toFixed(2)
      }));
  }, []);

  const handleGenerateSection = async () => {
    if (tier === 'Free') { setShowSubModal(true); return; }
    if (!activeSection) return;
    setIsGenerating(true);
    try {
      const totalEmissions = carbonData.scope1 + carbonData.scope2 + carbonData.scope3;
      const contextData = {
        company: companyName, scores: esgScores, overall_esg_score: totalScore,
        reporting_year: new Date().getFullYear(),
        linked_carbon_data: carbonData,
        compliance_documents: complianceFiles.map(f => f.name),
        derived_metrics: {
            total_emissions: totalEmissions,
            scope3_percentage: totalEmissions > 0 ? ((carbonData.scope3 / totalEmissions) * 100).toFixed(1) + '%' : '0%'
        }
      };
      const content = await generateReportChapter(activeSection.title, activeSection.template || "", activeSection.example || "", contextData, language);
      setGeneratedContent(prev => ({ ...prev, [activeSection.id]: content }));
      addToast('success', isZh ? '草稿生成完成' : 'Draft generated', 'AI Reporter');
    } catch (error) { addToast('error', 'Failed', 'Error'); } finally { setIsGenerating(false); }
  };

  const handleAuditSection = async () => {
      if (tier === 'Free') { setShowSubModal(true); return; }
      const content = generatedContent[activeSectionId];
      if (!content || !activeSection) return;
      setIsAuditing(true);
      setAuditResult(null);
      try {
          const result = await auditReportContent(activeSection.title, content, activeSection.griStandards || 'GRI Universal', { company: companyName, scores: esgScores }, language);
          setAuditResult(result);
      } catch (e) { addToast('error', 'Audit failed', 'Error'); } finally { setIsAuditing(false); }
  };

  const handleGenerateMasterReport = async () => {
      if (tier === 'Free') { setShowSubModal(true); return; }
      setIsGeneratingMaster(true);
      try {
          const content = await generateReportChapter("Master Executive Report", "Full Report", "Professional", { company: companyName, scores: esgScores, carbon: carbonData }, language);
          setMasterReportContent(content);
          setShowMasterReport(true);
          addToast('success', isZh ? '企業總報告生成完畢' : 'Master Report Generated', 'System');
      } catch (e) { addToast('error', 'Generation Failed', 'Error'); } finally { setIsGeneratingMaster(false); }
  };

  // Fix: element was missing in truncated file content
  const handleExportPDF = (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
      if (!elementRef.current) return;
      const element = elementRef.current;
      const opt = {
          margin: 10,
          filename: `${filename}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#0f172a' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      addToast('info', isZh ? '正在匯出 PDF...' : 'Exporting PDF...', 'System');
      html2pdf().set(opt).from(element).save().then(() => {
          addToast('success', isZh ? '匯出完成' : 'Export Complete', 'System');
      });
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
        <SubscriptionModal isOpen={showSubModal} onClose={() => setShowSubModal(false)} language={language} />
        
        <UniversalPageHeader 
            icon={FileText}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Action Header */}
        <div className="flex justify-between items-center -mt-16 mb-2 relative z-10">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                <button onClick={() => setActiveTab('generator')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-celestial-emerald text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <Sparkles className="w-4 h-4" /> {isZh ? '報告生成器' : 'AI Generator'}
                </button>
                <button onClick={() => setActiveTab('archive')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'archive' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <Archive className="w-4 h-4" /> {isZh ? '報告存檔' : 'Past Reports'}
                </button>
            </div>
            
            {activeTab === 'generator' && (
                <button 
                    onClick={handleGenerateMasterReport}
                    disabled={isGeneratingMaster}
                    className="px-6 py-2 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isGeneratingMaster ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileBarChart className="w-4 h-4" />}
                    {isZh ? '生成企業總報告' : 'Full Executive Report'}
                </button>
            )}
        </div>

        {activeTab === 'generator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 h-fit">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-4">{isZh ? '報告章節' : 'Report Chapters'}</h3>
                    <div className="space-y-4">
                        {REPORT_STRUCTURE.map((chapter) => (
                            <div key={chapter.id} className="space-y-1">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Layers className="w-3 h-3" />
                                    {chapter.title}
                                </div>
                                {chapter.subSections?.map((sub) => (
                                    <ChapterAgent 
                                        key={sub.id}
                                        id={`chapter-${sub.id}`}
                                        label={sub.title}
                                        section={sub}
                                        isActive={activeSectionId === sub.id}
                                        hasContent={!!generatedContent[sub.id]}
                                        onClick={() => { setActiveSectionId(sub.id); setAuditResult(null); }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeSection ? (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col min-h-[600px] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-celestial-emerald to-transparent opacity-50" />
                            
                            <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{parentChapter?.title}</div>
                                    <h2 className="text-2xl font-bold text-white">{activeSection.title}</h2>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> {activeSection.griStandards}</span>
                                        <span className={`text-[10px] flex items-center gap-1 ${generatedContent[activeSection.id] ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            <CheckCircle className="w-3 h-3"/> {generatedContent[activeSection.id] ? 'Draft Ready' : 'Pending Generation'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {generatedContent[activeSection.id] && (
                                        <button 
                                            onClick={handleAuditSection}
                                            disabled={isAuditing}
                                            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl border border-indigo-500/30 transition-all flex items-center gap-2 text-xs font-bold"
                                        >
                                            {isAuditing ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                                            {isZh ? 'AI 合規審查' : 'AI Audit'}
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleGenerateSection}
                                        disabled={isGenerating}
                                        className="px-6 py-2 bg-celestial-emerald hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        {generatedContent[activeSection.id] ? (isZh ? '重新生成' : 'Regenerate') : (isZh ? '生成草稿' : 'Generate Draft')}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                {isGenerating ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 animate-pulse">
                                        <div className="relative">
                                            <Loader2 className="w-12 h-12 text-celestial-emerald animate-spin" />
                                            <div className="absolute inset-0 bg-celestial-emerald/10 blur-xl rounded-full" />
                                        </div>
                                        <p className="font-mono text-xs tracking-widest">{isZh ? '正在從數據庫提取數據並撰寫中...' : 'Fetching live data and drafting section...'}</p>
                                    </div>
                                ) : generatedContent[activeSection.id] ? (
                                    <div className="animate-fade-in">
                                        <div id="report-section-content" className="markdown-content text-gray-200 text-sm leading-relaxed bg-black/20 p-6 rounded-xl border border-white/5 shadow-inner" 
                                             dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent[activeSection.id]) as string }} 
                                        />
                                        
                                        <div className="flex justify-end gap-3 mt-8">
                                            <button 
                                                onClick={() => handleExportPDF(reportRef, `Report_${activeSection.title}`)}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all text-xs font-bold"
                                            >
                                                <Download className="w-4 h-4" /> {isZh ? '匯出 PDF' : 'Export PDF'}
                                            </button>
                                            <button className="px-4 py-2 bg-celestial-purple/20 hover:bg-celestial-purple/30 text-celestial-purple rounded-xl border border-celestial-purple/30 transition-all flex items-center gap-2 text-xs font-bold">
                                                <Save className="w-4 h-4" /> {isZh ? '存入草稿箱' : 'Save to Drafts'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                            <FileText className="w-10 h-10 text-gray-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-400 mb-2">{isZh ? '此章節尚無內容' : 'This section is empty'}</h3>
                                        <p className="text-sm text-gray-500 max-w-sm mb-8">{isZh ? '點擊「生成草稿」，JunAiKey 將根據您目前的營運數據與碳資產自動撰寫內容。' : 'Click "Generate Draft" to let AI write based on your current carbon and operational data.'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Audit Result Sidebar-like overlay */}
                            {auditResult && (
                                <div className="mt-8 pt-8 border-t border-indigo-500/30 animate-fade-in">
                                    <div className="flex items-center gap-2 mb-4 text-indigo-300 font-bold">
                                        <ShieldCheck className="w-5 h-5" />
                                        {isZh ? 'AI 合規審查報告' : 'AI Audit Report'}
                                    </div>
                                    <div className="bg-indigo-500/5 rounded-xl p-6 border border-indigo-500/20 text-xs text-indigo-100 leading-relaxed font-mono">
                                        <div dangerouslySetInnerHTML={{ __html: marked.parse(auditResult) as string }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-gray-500">
                             Please select a section from the sidebar.
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="space-y-8 animate-fade-in">
                {/* Archive View Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Historical Trend</span>
                             <TrendingUp className="w-4 h-4 text-emerald-400" />
                         </div>
                         <div className="text-2xl font-bold text-white">-12.5%</div>
                         <div className="text-xs text-emerald-400 mt-1">Average Emission Reduction</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Compliance Score</span>
                             <ShieldCheck className="w-4 h-4 text-blue-400" />
                         </div>
                         <div className="text-2xl font-bold text-white">92.4%</div>
                         <div className="text-xs text-blue-400 mt-1">GRI 2024 Readiness</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Reports</span>
                             <FileText className="w-4 h-4 text-purple-400" />
                         </div>
                         <div className="text-2xl font-bold text-white">{MOCK_PAST_REPORTS.length}</div>
                         <div className="text-xs text-purple-400 mt-1">Verified on Chain</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Report List */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 h-fit">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-gray-400" />
                            {isZh ? '報告歷史' : 'History'}
                        </h3>
                        <div className="space-y-3">
                            {MOCK_PAST_REPORTS.map(report => (
                                <button 
                                    key={report.year}
                                    onClick={() => setSelectedReport(report)}
                                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all group
                                        ${selectedReport?.year === report.year ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                    `}
                                >
                                    <div className="text-left">
                                        <div className={`text-sm font-bold ${selectedReport?.year === report.year ? 'text-blue-300' : 'text-white'}`}>{report.year} {isZh ? '年度報告' : 'Report'}</div>
                                        <div className="text-[10px] text-gray-500">{report.publishDate} • {report.version}</div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-gray-600 group-hover:text-white transition-all ${selectedReport?.year === report.year ? 'rotate-90 text-blue-400' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Report Analysis/Comparison */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedReport && (
                            <div className="glass-panel p-8 rounded-2xl border border-white/10 animate-fade-in">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{selectedReport.title}</h3>
                                        <div className="flex gap-3 mt-2">
                                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20 uppercase tracking-widest">{selectedReport.status}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><FileCheck className="w-3 h-3"/> SHA-256 Verified</span>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase mb-1">Scope 1+2</div>
                                        <div className="text-lg font-bold text-white">{(selectedReport.metrics.scope1 + selectedReport.metrics.scope2).toFixed(1)} <span className="text-[10px] font-normal text-gray-500">t</span></div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase mb-1">Scope 3</div>
                                        <div className="text-lg font-bold text-white">{selectedReport.metrics.scope3} <span className="text-[10px] font-normal text-gray-500">t</span></div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase mb-1">Energy Intensity</div>
                                        <div className="text-lg font-bold text-white">{( (selectedReport.metrics.scope1 + selectedReport.metrics.scope2) / (selectedReport.metrics.energyConsumption / 1000) ).toFixed(2)}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase mb-1">GRI Coverage</div>
                                        <div className="text-lg font-bold text-white">{selectedReport.metrics.griCoverage}%</div>
                                    </div>
                                </div>

                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="year" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                                            <Legend />
                                            <Area type="monotone" dataKey="emissions" name="Total Emissions (tCO2e)" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
                                            <Area type="monotone" dataKey="intensity" name="Emission Intensity" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Master Report Full Screen Overlay */}
        {showMasterReport && (
            <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-fade-in overflow-hidden">
                <div className="h-20 bg-slate-900 border-b border-white/10 flex items-center justify-between px-8 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-celestial-gold/20 rounded-xl text-celestial-gold">
                            <Crown className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{isZh ? '企業永續年度總報告' : 'Full Executive Sustainability Report'}</h2>
                            <p className="text-xs text-gray-400">Generated for {companyName} • {new Date().getFullYear()} Edition</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleExportPDF(masterReportRef, `${companyName}_AnnualReport`)}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" /> {isZh ? '匯出完整報告 PDF' : 'Download PDF'}
                        </button>
                        <button 
                            onClick={() => setShowMasterReport(false)}
                            className="p-3 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-[#020617]">
                    <div ref={masterReportRef} className="max-w-4xl mx-auto bg-slate-900 border border-white/10 p-16 rounded-[2rem] shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-32 h-32 text-celestial-gold" />
                        </div>
                        <div className="mb-12 border-b border-white/5 pb-12">
                             <div className="text-sm font-bold text-celestial-gold uppercase tracking-[0.3em] mb-4">Confidential Executive Summary</div>
                             <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{companyName}<br/>Sustainability Disclosure</h1>
                             <div className="flex gap-8 text-gray-500 font-mono text-sm">
                                 <div>Year: {new Date().getFullYear()}</div>
                                 <div>Reference: ESGss-JAK-v15</div>
                             </div>
                        </div>
                        
                        <div className="markdown-content text-gray-200 leading-loose prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(masterReportContent) as string }} />
                        
                        <div className="mt-20 pt-12 border-t border-white/5 text-center text-gray-500 italic text-sm">
                            End of generated document. This report includes real-time data ingestion and AI compliance auditing.
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
