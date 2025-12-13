
import React, { useState } from 'react';
import { Language, View, IntelligenceItem } from '../types';
import { Briefcase, Search, Globe, FileText, Loader2, Database, TrendingUp, AlertCircle, CheckCircle, ArrowRightLeft, Activity, Save, BarChart } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { performWebSearch } from '../services/ai-service';
import { marked } from 'marked';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface BusinessIntelProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

export const BusinessIntel: React.FC<BusinessIntelProps> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { setIntelligenceBrief, saveIntelligence } = useCompany();
  
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: Crawling, 2: Analyzing, 3: Done
  const [report, setReport] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const pageData = {
      title: { zh: '商情分析', en: 'Market Analysis' },
      desc: { zh: 'AI 驅動的企業全方位偵測與競爭者分析', en: 'AI-driven Enterprise Surveillance & Competitor Analysis' },
      tag: { zh: '智慧偵測', en: 'Intel Scout' }
  };

  const handleScan = async () => {
      if (!companyName) {
          addToast('error', isZh ? '請輸入企業名稱' : 'Please enter company name', 'Error');
          return;
      }

      setIsScanning(true);
      setScanStep(1);
      setReport(null);
      setIsSaved(false);

      try {
          // Step 1: Simulated Crawl
          addToast('info', isZh ? `正在爬取 ${companyName} 前 30 大搜尋結果...` : `Crawling top 30 results for ${companyName}...`, 'Crawler');
          await new Promise(r => setTimeout(r, 2000));
          
          setScanStep(2);
          addToast('info', isZh ? 'JunAiKey 正在進行非結構化數據清洗...' : 'JunAiKey cleaning unstructured data...', 'AI Processor');
          
          // Step 2: Use AI to generate report
          const query = isZh 
            ? `分析企業 "${companyName}" (網址: ${website}) 的最新 ESG 動態、負面新聞與競爭力分析。請整理成一份結構化的商情報告。`
            : `Analyze company "${companyName}" (URL: ${website}) for latest ESG news, negative press, and competitive analysis. Structure as a business intelligence report.`;
          
          const result = await performWebSearch(query, language);
          
          setReport(result.text);
          setScanStep(3);
          addToast('success', isZh ? '商情報告生成完畢' : 'Intelligence Report Generated', 'System');

      } catch (e) {
          addToast('error', 'Analysis Failed', 'Error');
          setScanStep(0);
      } finally {
          setIsScanning(false);
      }
  };

  const handleSaveToKnowledge = () => {
      if (!report) return;
      
      const newItem: IntelligenceItem = {
          id: `intel-${Date.now()}`,
          type: 'competitor',
          title: `${companyName} - ${isZh ? '全方位分析' : 'Comprehensive Analysis'}`,
          source: 'Business Intelligence Center',
          date: new Date().toISOString(),
          summary: isZh ? '包含 ESG 評分、負面新聞與競爭力分析的完整報告。' : 'Full report containing ESG scores, negative press, and competitive analysis.',
          tags: ['Competitor', 'Auto-Generated'],
          isRead: false
      };

      saveIntelligence(newItem);
      setIsSaved(true);
      addToast('success', isZh ? '報告已儲存至萬能智庫 (My Intelligence)' : 'Report saved to Universal Knowledge Base (My Intelligence)', 'Universal Brain');
  };

  const handleLinkToHealthCheck = () => {
      // 1. Save intent to Provider
      setIntelligenceBrief({
          source: 'BusinessIntel',
          targetCompany: companyName,
          keyFindings: ['Supply Chain Resilience', 'Carbon Disclosure'],
          action: 'compare'
      });

      // 2. Navigate
      if (onNavigate) {
          onNavigate(View.HEALTH_CHECK);
          addToast('info', isZh ? `正在建立針對 ${companyName} 的落差分析模型...` : `Building gap analysis model vs ${companyName}...`, 'System Link');
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={BarChart}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Input Section */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">{isZh ? '企業名稱' : 'Company Name'}</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={isZh ? "例如：台積電 TSMC" : "e.g., TSMC"}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-celestial-blue outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">{isZh ? '企業網址 (選填)' : 'Website (Optional)'}</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-celestial-blue outline-none"
                        />
                    </div>
                </div>
            </div>
            <button 
                onClick={handleScan}
                disabled={isScanning || !companyName}
                className="mt-6 w-full py-4 bg-gradient-to-r from-celestial-blue to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                {isZh ? (isScanning ? '正在掃描全網...' : '啟動全網商情偵測') : (isScanning ? 'Scanning Web...' : 'Start Intelligence Scan')}
            </button>
        </div>

        {/* Status Display */}
        {scanStep > 0 && (
            <div className="flex justify-between items-center px-8 py-4 bg-slate-900/50 rounded-xl border border-white/5">
                <div className={`flex items-center gap-2 ${scanStep >= 1 ? 'text-celestial-blue' : 'text-gray-600'}`}>
                    {scanStep === 1 && <Loader2 className="w-4 h-4 animate-spin" />}
                    {scanStep > 1 && <CheckCircle className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase">{isZh ? '爬取網頁' : 'Crawling'}</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10" />
                <div className={`flex items-center gap-2 ${scanStep >= 2 ? 'text-celestial-purple' : 'text-gray-600'}`}>
                    {scanStep === 2 && <Loader2 className="w-4 h-4 animate-spin" />}
                    {scanStep > 2 && <CheckCircle className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase">{isZh ? '清洗數據' : 'Cleaning Data'}</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10" />
                <div className={`flex items-center gap-2 ${scanStep === 3 ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {scanStep === 3 && <CheckCircle className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase">{isZh ? '生成報告' : 'Report Ready'}</span>
                </div>
            </div>
        )}

        {/* Result Area */}
        {report && (
            <div className="glass-panel p-8 rounded-2xl border border-celestial-blue/30 bg-slate-900/80 animate-fade-in relative">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-celestial-blue" />
                        {companyName} - {isZh ? '商情分析報告' : 'Intelligence Report'}
                    </h3>
                    <div className="flex gap-2">
                        {/* Action: Save to My Intelligence */}
                        <button 
                            onClick={handleSaveToKnowledge}
                            disabled={isSaved}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg 
                                ${isSaved 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                    : 'bg-celestial-purple hover:bg-purple-600 text-white'}
                            `}
                        >
                            {isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {isZh ? (isSaved ? '已儲存' : '儲存至智庫') : (isSaved ? 'Saved' : 'Save to Knowledge')}
                        </button>

                        {/* Action: Link to Health Check */}
                        <button 
                            onClick={handleLinkToHealthCheck}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                        >
                            <Activity className="w-4 h-4" />
                            {isZh ? '執行內部落差分析' : 'Run Gap Analysis'}
                        </button>
                    </div>
                </div>
                <div className="markdown-content text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: marked.parse(report) as string }} />
            </div>
        )}
    </div>
  );
};
