
import React, { useState, useRef } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter, auditReportContent } from '../services/ai-service';
import { Language, ReportSection, PastReport } from '../types';
import { REPORT_STRUCTURE } from '../constants';
import { FileText, Sparkles, Download, Loader2, Save, ChevronRight, BookOpen, ShieldCheck, CheckCircle, Info, Crown, X, FileBarChart, FileCheck, Archive, BarChart2, PieChart } from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { LockedFeature } from './LockedFeature';
import { SubscriptionModal } from './SubscriptionModal';
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
    section: ReportSection; // Actually a sub-section
    isActive: boolean;
    hasContent: boolean;
    onClick: () => void;
}

const ChapterNodeBase: React.FC<ChapterNodeProps> = ({ 
    section, isActive, hasContent, onClick, 
    adaptiveTraits, trackInteraction, isAgentActive 
}) => {
    
    // Agent Traits
    const isOptimized = adaptiveTraits?.includes('optimization'); // AI Content Generated
    const isEvolved = adaptiveTraits?.includes('evolution'); // High Interaction
    
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
            
            {/* Agent Status Icon */}
            {isAgentActive && (
                <Sparkles className="w-3 h-3 text-celestial-gold animate-spin-slow" />
            )}
            
            {/* Completion Check */}
            {hasContent && isEvolved && (
                <CheckCircle className="w-3 h-3 text-emerald-500 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );
};

const ChapterAgent = withUniversalProxy(ChapterNodeBase);


// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const ReportGen: React.FC<ReportGenProps> = ({ language }) => {
  const { companyName, esgScores, totalScore, carbonCredits, budget, tier, carbonData, files } = useCompany();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'generator' | 'archive'>('generator');
  const [activeSectionId, setActiveSectionId] = useState<string>('1.01');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  
  // Master Report State
  const [showMasterReport, setShowMasterReport] = useState(false);
  const [masterReportContent, setMasterReportContent] = useState('');
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);
  
  // Archive State
  const [selectedReport, setSelectedReport] = useState<PastReport | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const masterReportRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  const pageData = {
      title: { zh: '報告中心', en: 'Report Center' },
      desc: { zh: 'GRI/SASB 自動撰寫與歷年報告數據管理', en: 'AI Writer & Historical Report Management' },
      tag: { zh: '表達核心', en: 'Expression Core' }
  };

  // Compliance Data Retrieval
  const complianceFiles = files.filter(f => f.sourceModule === 'Compliance_Filling');
  const hasComplianceData = complianceFiles.length > 0;

  const getActiveSectionData = (): ReportSection | undefined => {
    for (const chapter of REPORT_STRUCTURE) {
        if (chapter.id === activeSectionId) return chapter;
        if (chapter.subSections) {
            const sub = chapter.subSections.find(s => s.id === activeSectionId);
            if (sub) return sub;
        }
    }
    return undefined;
  };
  
  const getParentChapter = (subId: string): ReportSection | undefined => {
      return REPORT_STRUCTURE.find(c => c.subSections?.some(s => s.id === subId));
  };

  const activeSection = getActiveSectionData();
  const parentChapter = activeSectionId ? getParentChapter(activeSectionId) : undefined;

  const handleGenerateSection = async () => {
    if (tier === 'Free') {
        setShowSubModal(true);
        return;
    }
    if (!activeSection) return;
    setIsGenerating(true);
    try {
      const contextData = {
        company: companyName, scores: esgScores, overall_esg_score: totalScore,
        carbon_credits_inventory: carbonCredits, financial_budget_remaining: budget,
        reporting_year: new Date().getFullYear(),
        // INJECTED DATA
        linked_carbon_data: carbonData,
        compliance_documents: complianceFiles.map(f => f.name)
      };
      
      const content = await generateReportChapter(activeSection.title, activeSection.template || "", activeSection.example || "", contextData, language);
      setGeneratedContent(prev => ({ ...prev, [activeSection.id]: content }));
      addToast('success', isZh ? '草稿生成完成' : 'Draft generated', 'AI Reporter');
    } catch (error) { addToast('error', 'Failed', 'Error'); } finally { setIsGenerating(false); }
  };

  const handleAuditSection = async () => {
      if (tier === 'Free') {
          setShowSubModal(true);
          return;
      }
      const content = generatedContent[activeSectionId];
      if (!content || !activeSection) return;
      
      setIsAuditing(true);
      setAuditResult(null);
      addToast('info', isZh ? '正在進行合規性稽核 (GRI Standards)...' : 'Auditing against GRI Standards...', 'AI Auditor');
      
      try {
          const result = await auditReportContent(activeSection.title, content, activeSection.griStandards || 'GRI Universal', language);
          setAuditResult(result);
      } catch (e) {
          addToast('error', 'Audit failed', 'Error');
      } finally {
          setIsAuditing(false);
      }
  };

  const handleGenerateMasterReport = async () => {
      if (tier === 'Free') {
          setShowSubModal(true);
          return;
      }
      setIsGeneratingMaster(true);
      addToast('info', isZh ? '正在彙整全模組數據生成總報告...' : 'Aggregating cross-module data for Master Report...', 'JunAiKey');

      try {
          // Aggregate all system data for the prompt
          const masterContext = {
              company: companyName,
              scores: esgScores,
              carbon: {
                  s1: carbonData.scope1,
                  s2: carbonData.scope2,
                  s3: carbonData.scope3,
                  total: carbonData.scope1 + carbonData.scope2 + carbonData.scope3
              },
              finance: {
                  budget: budget,
                  credits: carbonCredits
              },
              compliance: complianceFiles.length > 0 ? "Verified" : "Pending",
              compliance_docs: complianceFiles.map(f => f.name),
              year: new Date().getFullYear()
          };

          const prompt = `Generate an "ESGss x JunAiKey Enterprise Master Report" (Executive Summary).
          Format: Markdown. 
          Sections: 
          1. Executive Summary (Overall Score & Status)
          2. Environmental Performance (Carbon Data Analysis)
          3. Compliance Status (Based on linked documents)
          4. Strategic Outlook (Based on scores)
          5. CEO Key Message.
          Tone: Professional, Visionary, High-Level.
          Data: ${JSON.stringify(masterContext)}`;

          // Reusing generateReportChapter logic but with master context
          const content = await generateReportChapter("Master Executive Report", "Full Report", "Professional", masterContext, language);
          
          setMasterReportContent(content);
          setShowMasterReport(true);
          addToast('success', isZh ? '企業總報告生成完畢' : 'Master Report Generated', 'System');
      } catch (e) {
          addToast('error', 'Generation Failed', 'Error');
      } finally {
          setIsGeneratingMaster(false);
      }
  };

  const handleExportPDF = (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
      if (!elementRef.current) return;
      setIsExporting(true);
      const element = elementRef.current;
      const opt = { 
          margin: 10, 
          filename: filename, 
          image: { type: 'jpeg' as const, quality: 0.98 }, 
          html2canvas: { scale: 2, useCORS: true }, 
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const } 
      };
      html2pdf().set(opt).from(element).save().then(() => { setIsExporting(false); addToast('success', 'PDF Downloaded.', 'System'); });
  };

  // --- Archive Handlers ---
  const handleAnalyzeReport = (report: PastReport) => {
      setSelectedReport(report);
      addToast('info', isZh ? `正在分析 ${report.year} 年度數據...` : `Analyzing ${report.year} data...`, 'Data Organizer');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in gap-4">
        <SubscriptionModal isOpen={showSubModal} onClose={() => setShowSubModal(false)} language={language} />
        
        {/* Master Report Modal */}
        {showMasterReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
                <div className="w-full max-w-4xl bg-slate-950 border border-celestial-gold/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-celestial-gold/10 to-transparent rounded-t-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-celestial-gold/20 rounded-xl border border-celestial-gold/30">
                                <Crown className="w-6 h-6 text-celestial-gold" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{isZh ? 'ESGss x JunAiKey 企業總報告' : 'ESGss x JunAiKey Enterprise Master Report'}</h3>
                                <p className="text-xs text-celestial-gold font-mono uppercase tracking-wider">{companyName} • {new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowMasterReport(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white text-black" ref={masterReportRef}>
                        {/* Simulated Print Header inside the scroll view */}
                        <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
                            <h1 className="text-3xl font-bold font-serif text-black">Executive Summary</h1>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Generated by</div>
                                <div className="text-sm font-bold text-black">JunAiKey Intelligence Engine</div>
                            </div>
                        </div>
                        <div className="prose prose-slate max-w-none text-black">
                            <div dangerouslySetInnerHTML={{ __html: marked.parse(masterReportContent) as string }} />
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-slate-900 rounded-b-2xl flex justify-end gap-3">
                        <button onClick={() => setShowMasterReport(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">{isZh ? '關閉' : 'Close'}</button>
                        <button 
                            onClick={() => handleExportPDF(masterReportRef, `MasterReport_${companyName}.pdf`)} 
                            disabled={isExporting}
                            className="px-6 py-2 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {isZh ? '下載 PDF' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end shrink-0 gap-4">
            <div className="flex-1">
                <UniversalPageHeader 
                    icon={FileText}
                    title={pageData.title}
                    description={pageData.desc}
                    language={language}
                    tag={pageData.tag}
                />
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 mb-8 self-end">
                <button 
                    onClick={() => setActiveTab('generator')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'generator' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Sparkles className="w-4 h-4" /> {isZh ? 'AI 報告生成' : 'AI Generator'}
                </button>
                <button 
                    onClick={() => setActiveTab('archive')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'archive' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Archive className="w-4 h-4" /> {isZh ? '報告歸檔專區' : 'Report Archive'}
                </button>
            </div>
        </div>

        {/* --- Generator Tab --- */}
        {activeTab === 'generator' && (
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 -mt-6">
                <div className="col-span-12 flex justify-end mb-2">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleGenerateMasterReport}
                            disabled={isGeneratingMaster}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-celestial-gold to-amber-600 text-black font-bold rounded-lg shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 text-xs"
                        >
                            {isGeneratingMaster ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                            <span>{isZh ? '生成企業總報告' : 'Generate Master Report'}</span>
                        </button>
                        <button 
                            onClick={() => handleExportPDF(reportRef, `Report_${new Date().getFullYear()}.pdf`)} 
                            disabled={isExporting} 
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all disabled:opacity-50 text-xs"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>

                <div className="col-span-3 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10">
                    <div className="p-4 border-b border-white/10 bg-white/5"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{isZh ? '目錄' : 'Contents'}</span></div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {REPORT_STRUCTURE.map((chapter) => (
                            <div key={chapter.id} className="mb-2">
                                <button onClick={() => setActiveSectionId(chapter.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSectionId === chapter.id ? 'bg-celestial-purple/20 text-white' : 'text-gray-400 hover:text-white'}`}>
                                    <span className="truncate">{chapter.title}</span>
                                </button>
                                {chapter.subSections && (
                                    <div className="ml-2 mt-1 space-y-1 border-l border-white/10 pl-2">
                                        {chapter.subSections.map(sub => (
                                            <ChapterAgent 
                                                key={sub.id}
                                                id={sub.id} // Agent ID
                                                label={sub.title}
                                                section={sub}
                                                isActive={activeSectionId === sub.id}
                                                hasContent={!!generatedContent[sub.id]}
                                                onClick={() => setActiveSectionId(sub.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-9 flex flex-col gap-6 h-full min-h-0">
                    {/* Guidelines Panel */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60 shrink-0 max-h-[35%] overflow-y-auto custom-scrollbar relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                            {activeSection?.griStandards && <span className="text-[10px] px-2 py-1 bg-celestial-gold/10 text-celestial-gold border border-celestial-gold/20 rounded-full">{activeSection.griStandards}</span>}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{activeSection?.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-gray-300">
                            {parentChapter && (
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold uppercase tracking-wider">
                                        <BookOpen className="w-3 h-3" /> Writing Guidelines
                                    </div>
                                    <p>{parentChapter.guidelines || "No specific guidelines."}</p>
                                </div>
                            )}
                            {parentChapter && (
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-1 text-celestial-purple font-bold uppercase tracking-wider">
                                        <Info className="w-3 h-3" /> Guiding Principles
                                    </div>
                                    <p>{parentChapter.principles || "Follow standard GRI principles."}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 glass-panel rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col min-h-0 relative">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <span className="text-sm font-medium text-white">{isZh ? '內容編輯器' : 'Editor'}</span>
                            <div className="flex gap-2">
                                <button onClick={handleGenerateSection} disabled={isGenerating || !activeSection} className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-celestial-purple to-celestial-blue hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50">
                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} {isZh ? 'AI 撰寫' : 'AI Write'}
                                </button>
                                <button onClick={handleAuditSection} disabled={isAuditing || !generatedContent[activeSectionId]} className="flex items-center gap-2 px-3 py-1.5 bg-celestial-gold/20 hover:bg-celestial-gold/30 text-celestial-gold rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-celestial-gold/30">
                                    {isAuditing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} {isZh ? '合規稽核' : 'Audit'}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/30" ref={reportRef}>
                                <LockedFeature featureName="Smart Report Editor" minTier="Free">
                                    {generatedContent[activeSectionId] ? (
                                        <div className="markdown-content text-gray-300 leading-relaxed space-y-4 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent[activeSectionId]) as string }} />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-60">
                                            <FileText className="w-16 h-16 mb-4" />
                                            <p>{isZh ? '尚無內容' : 'No content'}</p>
                                            <p className="text-xs mt-2">Click AI Write to draft this section.</p>
                                        </div>
                                    )}
                                </LockedFeature>
                            </div>
                            
                            {/* Audit Result Panel */}
                            {auditResult && (
                                <div className="w-80 border-l border-white/10 bg-slate-900/90 overflow-y-auto custom-scrollbar p-4 animate-fade-in">
                                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Audit Report
                                    </h4>
                                    <div className="markdown-content text-xs text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: marked.parse(auditResult) as string }} />
                                    <button onClick={() => setAuditResult(null)} className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-400">Close</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- Archive Tab --- */}
        {activeTab === 'archive' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 min-h-0 -mt-6">
                
                {/* Reports List */}
                <div className="md:col-span-1 space-y-4 overflow-y-auto custom-scrollbar">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Archive className="w-5 h-5 text-celestial-blue" />
                        {isZh ? '歷年報告書庫' : 'Report Repository'}
                    </h3>
                    
                    {MOCK_PAST_REPORTS.map(report => (
                        <div 
                            key={report.year}
                            onClick={() => handleAnalyzeReport(report)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col gap-2 relative overflow-hidden
                                ${selectedReport?.year === report.year 
                                    ? 'bg-celestial-blue/10 border-celestial-blue/50 shadow-lg shadow-celestial-blue/20' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                            `}
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white font-mono">{report.year}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold
                                        ${report.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                          report.status === 'Draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                          'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                    `}>
                                        {report.status}
                                    </span>
                                </div>
                                {selectedReport?.year === report.year && <ChevronRight className="w-5 h-5 text-celestial-blue animate-pulse" />}
                            </div>
                            <div className="text-sm text-gray-300 relative z-10">{report.title}</div>
                            <div className="text-xs text-gray-500 font-mono relative z-10">Ver: {report.version} • {report.publishDate}</div>
                            
                            {/* Decorative Background */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-tl from-white/5 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Analysis Panel */}
                <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden">
                    {selectedReport ? (
                        <div className="flex-1 flex flex-col animate-fade-in relative z-10">
                            <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
                                <div>
                                    <div className="text-xs font-bold text-celestial-blue uppercase tracking-widest mb-2">{isZh ? '數據整理與分析' : 'Data Organization & Analysis'}</div>
                                    <h2 className="text-3xl font-bold text-white">{selectedReport.year} Performance</h2>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white transition-all border border-white/10">
                                    <Download className="w-4 h-4" /> {isZh ? '下載原始檔' : 'Download Report'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <OmniEsgCell 
                                    mode="card" 
                                    label="Total Emissions" 
                                    value={`${(selectedReport.metrics.scope1 + selectedReport.metrics.scope2 + selectedReport.metrics.scope3).toLocaleString()} t`}
                                    subValue={`Scope 1+2: ${(selectedReport.metrics.scope1 + selectedReport.metrics.scope2).toLocaleString()} t`}
                                    color="emerald" 
                                    icon={BarChart2}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <OmniEsgCell mode="cell" label="GRI Coverage" value={`${selectedReport.metrics.griCoverage}%`} color="purple" />
                                    <OmniEsgCell mode="cell" label="Scope 3" value={`${selectedReport.metrics.scope3} t`} color="gold" />
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-xl border border-white/5 bg-slate-900/50 flex-1">
                                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <PieChart className="w-4 h-4 text-gray-400" />
                                    {isZh ? '排放佔比分析' : 'Emission Breakdown'}
                                </h4>
                                <div className="space-y-4">
                                    {['Scope 1', 'Scope 2', 'Scope 3'].map((scope, idx) => {
                                        const val = scope === 'Scope 1' ? selectedReport.metrics.scope1 : scope === 'Scope 2' ? selectedReport.metrics.scope2 : selectedReport.metrics.scope3;
                                        const total = selectedReport.metrics.scope1 + selectedReport.metrics.scope2 + selectedReport.metrics.scope3;
                                        const pct = (val / total) * 100;
                                        const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500'];
                                        
                                        return (
                                            <div key={scope}>
                                                <div className="flex justify-between text-xs mb-1 text-gray-300">
                                                    <span>{scope}</span>
                                                    <span className="font-mono">{val} t ({pct.toFixed(1)}%)</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${colors[idx]} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                            <FileBarChart className="w-24 h-24 mb-4" />
                            <p className="text-lg">{isZh ? '請選擇一份報告以查看分析' : 'Select a report to view analysis'}</p>
                        </div>
                    )}
                    
                    {/* Background Graphic */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-celestial-blue/5 rounded-full blur-3xl pointer-events-none" />
                </div>
            </div>
        )}
    </div>
  );
};
