
import React, { useState, useEffect, useRef } from 'react';
import { Search, Database, BookOpen, Filter, Network, Share2, FileText, Globe, Loader2, ExternalLink, ScanLine, Upload, CheckCircle, Tag, Eye, Download, Check, RefreshCw, Briefcase, ArrowUpRight, BrainCircuit, Zap, Table } from 'lucide-react';
import { Language, QuantumNode } from '../types';
import { TRANSLATIONS, GLOBAL_SDR_MODULES } from '../constants';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { performLocalRAG, quantizeData, inferSemanticContext } from '../services/ai-service';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { universalIntelligence } from '../services/evolutionEngine';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ResearchHubProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Agent: Knowledge Concept Node
// ----------------------------------------------------------------------
interface ConceptNodeProps extends InjectedProxyProps {
    id: string;
    type: 'center' | 'satellite';
    text: string;
    isActive: boolean;
    onClick: () => void;
    position: 'center' | 'top-left' | 'bottom-right' | 'mid-right';
}

const ConceptNodeBase: React.FC<ConceptNodeProps> = ({ 
    type, text, isActive, onClick, position,
    adaptiveTraits, trackInteraction, isAgentActive
}) => {
    
    // Agent Evolution: More interaction = Larger Size & Gold Glow
    const isEvolved = adaptiveTraits?.includes('evolution');
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive;

    const baseStyle = "absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 z-20";
    
    let posStyle = {};
    if (position === 'center') posStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    if (position === 'top-left') posStyle = { top: '20%', left: '25%' };
    if (position === 'bottom-right') posStyle = { bottom: '20%', right: '25%' };
    if (position === 'mid-right') posStyle = { top: '50%', right: '10%' };

    const dynamicClass = type === 'center'
        ? `${isActive ? 'w-24 h-24 bg-celestial-purple shadow-[0_0_30px_rgba(139,92,246,0.6)] border-2 border-white' : 'w-20 h-20 bg-celestial-purple/20 border border-celestial-purple animate-pulse'}`
        : `${isActive ? 'bg-celestial-gold text-black font-bold scale-125 shadow-[0_0_15px_rgba(251,191,36,0.6)] border-transparent' : 'bg-white/5 border border-white/20 text-gray-300 hover:border-white/50'}`;

    const sizeClass = type === 'satellite' ? (isEvolved ? 'w-14 h-14 text-xs' : 'w-10 h-10 text-[10px]') : '';

    return (
        <div 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`${baseStyle} ${dynamicClass} ${sizeClass}`}
            style={posStyle}
        >
            {type === 'center' ? <Database className={`w-8 h-8 ${isActive ? 'text-white' : 'text-celestial-purple'}`} /> : text}
            
            {/* Thought Indicator */}
            {isLearning && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-celestial-emerald rounded-full animate-ping" />
            )}
        </div>
    );
};

const ConceptAgent = withUniversalProxy(ConceptNodeBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const ResearchHub: React.FC<ResearchHubProps> = ({ language }) => {
  const t = TRANSLATIONS[language].research;
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addFile, files } = useCompany(); // Hook into Global File System
  const [activeTab, setActiveTab] = useState<'explorer' | 'scanner' | 'sdr' | 'cases' | 'quantum'>('quantum'); 
  
  // Explorer State
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{text: string, sources?: any[]} | null>(null);

  // Scanner State (Now mostly UI state, data lives in CompanyProvider)
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SDR State
  const [installingSdr, setInstallingSdr] = useState<string | null>(null);
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);

  // Quantum Graph State
  const [quantumNodes, setQuantumNodes] = useState<QuantumNode[]>([]);
  const [isQuantizing, setIsQuantizing] = useState(false);
  const [quantumInput, setQuantumInput] = useState('Scope 3 includes 15 categories such as purchased goods, capital goods, and business travel. It is often 70% of total emissions.');

  const pageData = {
      title: { zh: '研究中心', en: 'Research Center' },
      desc: { zh: '深入挖掘數據、法規與量子知識圖譜', en: 'Deep dive into data, regulations, and Quantum Knowledge Graph.' },
      tag: { zh: '知識核心', en: 'Knowledge Core' }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    // Load initial quantum nodes from memory if any
    setQuantumNodes(universalIntelligence.getAllQuantumNodes());
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = (id: string) => setSelectedNode(selectedNode === id ? null : id);
  const handleAiAnalyze = (label: string) => addToast('info', `AI Agent analyzing lineage for: ${label}`, 'Data Lineage Agent');

  const handleWebSearch = async () => {
      if(!searchQuery.trim()) return;
      setIsSearching(true);
      setSearchResults(null);
      addToast('info', isZh ? '啟動 RAG 檢索增強生成引擎...' : 'Activating RAG Engine...', 'Research Agent');
      
      try {
          const result = await performLocalRAG(searchQuery, language);
          setSearchResults(result);
          addToast('success', isZh ? '檢索完成 (包含本地知識庫)' : 'Retrieval Complete (Included Local Knowledge)', 'JunAiKey');
      } catch (e) {
          addToast('error', 'Search failed. Please check API Key.', 'Error');
      } finally {
          setIsSearching(false);
      }
  };

  const handleDownload = (elementId: string, fileName: string) => {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      addToast('info', isZh ? '正在生成 PDF...' : 'Generating PDF...', 'System');
      
      const opt = {
          margin: 10,
          filename: `${fileName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#0f172a' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save().then(() => {
          addToast('success', isZh ? '下載完成' : 'Download Complete', 'System');
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setIsScanning(true);
          addToast('info', `Uploading ${file.name} to JunAiKey OCR Engine...`, 'Document Scanner');

          // Delegate to Universal File System
          addFile(file, 'ResearchHub');
          
          setTimeout(() => {
              setIsScanning(false);
              addToast('success', 'Document analysis complete. Entities extracted and synced to My Files.', 'JunAiKey');
          }, 1000); // Visual feedback delay, real logic happens in addFile
      }
  };

  const handleInstallSDR = (moduleId: string, moduleName: string) => {
      setInstallingSdr(moduleId);
      setTimeout(() => {
          universalIntelligence.installSDRModule(moduleId);
          setInstallingSdr(null);
          addToast('success', isZh ? `已安裝模組：${moduleName}` : `Module Installed: ${moduleName}`, 'SDR Expansion');
      }, 2000);
  };

  const handleSyncGlobal = () => {
      setIsSyncingGlobal(true);
      addToast('info', isZh ? '正在同步全球 ESG 開源數據庫...' : 'Syncing Global ESG Open Databases...', 'JunAiKey Link');
      
      setTimeout(() => {
          universalIntelligence.syncGlobalDatabases();
          setIsSyncingGlobal(false);
          addToast('success', isZh ? '全球數據庫同步完成' : 'Global DB Sync Complete', 'SDR Network');
      }, 2500);
  };

  const handleQuantize = async () => {
      if(!quantumInput.trim()) return;
      setIsQuantizing(true);
      addToast('info', isZh ? '正在進行知識量子化...' : 'Quantizing knowledge into atomic nodes...', 'Quantum Engine');
      
      try {
          // 1. Deconstruct
          const nodes = await quantizeData(quantumInput, language);
          
          // 2. Inject to Brain (Lattice Rebuild)
          universalIntelligence.injectQuantumNodes(nodes, 'manual-input');
          
          // 3. Retrieve (Show all for visual effect)
          setQuantumNodes(universalIntelligence.getAllQuantumNodes());
          
          addToast('success', isZh ? `生成了 ${nodes.length} 個知識原子` : `Generated ${nodes.length} Knowledge Atoms`, 'Lattice Updated');
      } catch (e) {
          addToast('error', 'Quantization Failed', 'Error');
      } finally {
          setIsQuantizing(false);
      }
  };

  const handleSemanticSearch = async (query: string) => {
      if(!query.trim()) return;
      addToast('info', isZh ? '正在推斷語意上下文...' : 'Inferring semantic context...', 'Context Engine');
      
      const context = await inferSemanticContext(query, language);
      addToast('info', isZh ? `上下文鎖定：${context.intent}` : `Context Locked: ${context.intent}`, 'Lattice Search');
      
      const results = universalIntelligence.retrieveContextualNodes(context);
      setQuantumNodes(results); // Filter view to results
  };

  const cases = [
      { 
          id: 1, 
          title: isZh ? 'TSMC 台積電' : 'TSMC', 
          sector: 'Semiconductor', 
          desc: isZh ? 'Eco Plus 生態倡議：如何帶領供應鏈解決人才培育與成效量化痛點。' : 'Eco Plus Initiative: Leading the supply chain in talent cultivation and impact quantification.', 
          tags: ['Supply Chain', 'Talent', 'Scope 3'],
          color: 'border-emerald-500/30'
      },
      { 
          id: 2, 
          title: 'Patagonia', 
          sector: 'Retail', 
          desc: isZh ? '地球是我們唯一的股東：將 100% 股權捐贈給地球，樹立企業治理新典範。' : 'Earth is our only shareholder: Donating 100% equity to the planet.', 
          tags: ['Governance', 'Philanthropy'],
          color: 'border-blue-500/30'
      },
      { 
          id: 3, 
          title: 'Interface', 
          sector: 'Manufacturing', 
          desc: isZh ? 'Mission Zero：地毯製造商如何達成負碳排目標，實現循環經濟。' : 'Mission Zero: How a carpet manufacturer reached carbon negative.', 
          tags: ['Circular Economy', 'Carbon Negative'],
          color: 'border-purple-500/30'
      },
      { 
          id: 4, 
          title: 'Ørsted', 
          sector: 'Energy', 
          desc: isZh ? '從黑轉綠：由傳統石油天然氣公司成功轉型為全球最大離岸風電商。' : 'Black to Green: Transforming from oil & gas to global wind leader.', 
          tags: ['Energy Transition', 'Strategy'],
          color: 'border-amber-500/30'
      },
  ];

  // Filter files relevant to ResearchHub for display here (optional, or show all)
  const scannedFiles = files.filter(f => f.sourceModule === 'ResearchHub');

  return (
    <div className="space-y-8 animate-fade-in">
       <UniversalPageHeader 
            icon={Search}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
       />

       {/* Header Tabs & Search */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex gap-4 border-b border-white/10 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('quantum')}
                className={`pb-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'quantum' ? 'text-celestial-gold border-b-2 border-celestial-gold' : 'text-gray-400 hover:text-white'}`}
              >
                  <BrainCircuit className="w-4 h-4" />
                  {isZh ? '量子知識圖譜 (Quantum)' : 'Quantum Graph'}
              </button>
              <button 
                onClick={() => setActiveTab('cases')}
                className={`pb-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'cases' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                  <Briefcase className="w-4 h-4" />
                  {isZh ? 'ESG 案例庫' : 'Case Database'}
              </button>
              <button 
                onClick={() => setActiveTab('explorer')}
                className={`pb-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'explorer' ? 'text-celestial-emerald border-b-2 border-celestial-emerald' : 'text-gray-400 hover:text-white'}`}
              >
                  <Table className="w-4 h-4" />
                  {t.dataExplorer}
              </button>
              <button 
                onClick={() => setActiveTab('scanner')}
                className={`pb-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'scanner' ? 'text-celestial-purple border-b-2 border-celestial-purple' : 'text-gray-400 hover:text-white'}`}
              >
                  <ScanLine className="w-4 h-4" />
                  {language === 'zh-TW' ? 'AI 文檔掃描 (OCR)' : 'AI Document Scanner'}
              </button>
              <button 
                onClick={() => setActiveTab('sdr')}
                className={`pb-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'sdr' ? 'text-gray-200 border-b-2 border-gray-200' : 'text-gray-400 hover:text-white'}`}
              >
                  <Database className="w-4 h-4" />
                  {language === 'zh-TW' ? 'SDR 全球數據庫' : 'SDR Global DB'}
              </button>
          </div>
        </div>
        
        {activeTab === 'explorer' && (
            <div className="relative w-full md:w-auto flex gap-2">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleWebSearch()}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-celestial-emerald outline-none transition-all"
                />
            </div>
            <button 
                onClick={handleWebSearch}
                disabled={isSearching}
                className="px-4 py-2 bg-celestial-purple/20 hover:bg-celestial-purple/40 text-celestial-purple rounded-xl border border-celestial-purple/30 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                <span>RAG Search</span>
            </button>
            </div>
        )}
      </div>

      {activeTab === 'quantum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/30 flex flex-col h-full">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-celestial-gold" />
                      {isZh ? '知識量子化引擎' : 'Knowledge Quantizer'}
                  </h3>
                  <textarea 
                      value={quantumInput}
                      onChange={(e) => setQuantumInput(e.target.value)}
                      className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-gray-300 mb-4 focus:border-celestial-gold/50 outline-none"
                      placeholder={isZh ? "輸入任意文本..." : "Input raw text..."}
                  />
                  <button 
                      onClick={handleQuantize}
                      disabled={isQuantizing}
                      className="w-full py-3 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                      {isQuantizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                      {isZh ? '量子化 (Deconstruct)' : 'Quantize'}
                  </button>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{isZh ? '語意檢索 (One-Shot)' : 'Semantic Retrieval'}</h4>
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                              type="text" 
                              placeholder={isZh ? "輸入問題 (例如: 碳盤查範圍)" : "Ask query (e.g. Carbon Scope)"}
                              onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch(e.currentTarget.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-celestial-gold/50 outline-none"
                          />
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden bg-slate-900 min-h-[500px]">
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <div className="px-2 py-1 bg-celestial-gold/10 border border-celestial-gold/30 rounded text-[10px] text-celestial-gold font-mono">
                          NODES: {quantumNodes.length}
                      </div>
                  </div>
                  
                  {/* Visualization Area */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full p-8 flex flex-wrap content-center justify-center gap-4 overflow-y-auto custom-scrollbar">
                          {quantumNodes.length === 0 ? (
                              <div className="text-center opacity-30">
                                  <Network className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                  <p>{isZh ? '等待輸入...' : 'Waiting for input...'}</p>
                              </div>
                          ) : (
                              quantumNodes.map((node, i) => (
                                  <div 
                                      key={node.id} 
                                      className="relative group cursor-pointer animate-fade-in hover:z-20"
                                      style={{ animationDelay: `${i * 50}ms` }}
                                  >
                                      <div className={`
                                          px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg
                                          ${node.weight > 0.8 ? 'bg-celestial-gold/20 border-celestial-gold/50' : 
                                            node.weight > 0.5 ? 'bg-celestial-purple/20 border-celestial-purple/50' : 
                                            'bg-white/5 border-white/10'}
                                      `}>
                                          <div className="text-xs font-bold text-white max-w-[150px] leading-snug">{node.atom}</div>
                                          <div className="flex gap-1 mt-2">
                                              {node.vector.slice(0,2).map(v => (
                                                  <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-gray-300">{v}</span>
                                              ))}
                                          </div>
                                      </div>
                                      
                                      {/* Connection Lines (Simulated visually) */}
                                      {node.connections.length > 0 && (
                                          <div className="absolute top-1/2 left-full w-4 h-px bg-white/10 group-hover:bg-white/50 transition-colors" />
                                      )}
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'cases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="col-span-full mb-2">
                  <h3 className="text-xl font-bold text-white mb-1">{isZh ? '精選 ESG 轉型案例' : 'Featured ESG Cases'}</h3>
                  <p className="text-gray-400 text-sm">{isZh ? '瀏覽、搜尋並學習豐富的 ESG 案例，為您的永續轉型提供靈感。' : 'Browse, search, and learn from rich ESG cases for inspiration.'}</p>
              </div>
              {cases.map(c => (
                  <div id={`case-card-${c.id}`} key={c.id} className={`glass-panel p-6 rounded-2xl border ${c.color} hover:bg-white/5 transition-all group cursor-pointer`} onClick={() => addToast('info', isZh ? '正在分析案例詳情...' : 'Analyzing case details...', 'JunAiKey Case Study')}>
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{c.sector}</div>
                              <h4 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{c.title}</h4>
                          </div>
                          <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDownload(`case-card-${c.id}`, `${c.title}_CaseStudy`); }}
                                className="p-2 bg-white/5 rounded-full hover:bg-white/20 hover:text-white text-gray-400 transition-colors"
                                title="Download Case PDF"
                              >
                                  <Download className="w-4 h-4" />
                              </button>
                              <div className="p-2 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                              </div>
                          </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed mb-4 min-h-[40px]">{c.desc}</p>
                      <div className="flex gap-2 flex-wrap">
                          {c.tags.map(t => (
                              <span key={t} className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">{t}</span>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* ... (rest of the component logic for sdr, scanner, explorer) ... */}
      {activeTab === 'sdr' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              <div className="col-span-full mb-4 flex justify-between items-center">
                  <div className="p-4 bg-celestial-gold/10 border border-celestial-gold/30 rounded-xl flex items-start gap-3 flex-1 mr-4">
                      <Database className="w-6 h-6 text-celestial-gold shrink-0 mt-1" />
                      <div>
                          <h3 className="font-bold text-white text-lg">{isZh ? '萬能智庫 SDR 擴充中心' : 'Universal SDR Expansion Hub'}</h3>
                          <p className="text-sm text-gray-400">
                              {isZh 
                                ? '安裝全球 ESG 開源資料庫模組，讓 JunAiKey 具備更強大的數據驗證與交叉比對能力。' 
                                : 'Install global ESG open-source database modules to empower JunAiKey with stronger verification and cross-referencing capabilities.'}
                          </p>
                      </div>
                  </div>
                  
                  <button 
                      onClick={handleSyncGlobal}
                      disabled={isSyncingGlobal}
                      className="px-6 py-4 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                      {isSyncingGlobal ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                      {isZh ? (isSyncingGlobal ? '同步中...' : '同步全球資料庫') : (isSyncingGlobal ? 'Syncing...' : 'Sync Global DB')}
                  </button>
              </div>

              {GLOBAL_SDR_MODULES.map((mod) => {
                  const isInstalled = universalIntelligence.isSDRInstalled(mod.id);
                  const isInstalling = installingSdr === mod.id;

                  return (
                      <div key={mod.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-celestial-gold/30 transition-all">
                          <div>
                              <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-celestial-gold/20 transition-colors">
                                      <Database className="w-6 h-6 text-gray-300 group-hover:text-celestial-gold" />
                                  </div>
                                  {isInstalled && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                              </div>
                              <h4 className="font-bold text-white mb-2">{mod.name}</h4>
                              <p className="text-xs text-gray-400 leading-relaxed mb-4">{mod.description}</p>
                          </div>
                          
                          <button 
                              onClick={() => !isInstalled && handleInstallSDR(mod.id, mod.name)}
                              disabled={isInstalled || isInstalling}
                              className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
                                  ${isInstalled 
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
                              `}
                          >
                              {isInstalling ? <Loader2 className="w-3 h-3 animate-spin" /> : (isInstalled ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />)}
                              {isInstalled ? (isZh ? '已安裝' : 'Installed') : (isInstalling ? (isZh ? '安裝中...' : 'Installing...') : (isZh ? '安裝模組' : 'Install Module'))}
                          </button>
                      </div>
                  );
              })}
          </div>
      )}

      {activeTab === 'explorer' && (
          <>
            {/* Search Results Area */}
            {searchResults && (
                <div id="rag-search-results" className="glass-panel p-6 rounded-2xl border border-celestial-emerald/30 bg-celestial-emerald/5 animate-fade-in relative">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-celestial-emerald" />
                            RAG Enhanced Search Results
                        </h3>
                        <button 
                            onClick={() => handleDownload('rag-search-results', `Search_Result_${Date.now()}`)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-celestial-emerald/20 hover:bg-celestial-emerald/30 text-celestial-emerald rounded-lg text-xs font-bold transition-all border border-celestial-emerald/30"
                        >
                            <Download className="w-3 h-3" />
                            {isZh ? '下載報告' : 'Download PDF'}
                        </button>
                    </div>
                    <div className="text-sm text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">
                        {searchResults.text}
                    </div>
                    {searchResults.sources && searchResults.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                            {searchResults.sources.map((source: any, idx: number) => source.web?.uri && (
                                <a 
                                    key={idx} 
                                    href={source.web.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-300 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    {source.web.title || "Source Link"}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Feature: Graph RAG / Service Flow Visual (Now Agents) */}
            <div className="glass-panel p-6 rounded-2xl border-white/10 overflow-hidden relative">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Network className="w-5 h-5 text-celestial-gold" />
                        {language === 'zh-TW' ? 'Graph RAG 知識圖譜' : 'Graph RAG Knowledge Network'}
                    </h3>
                    <span className="text-xs text-celestial-emerald border border-celestial-emerald/30 px-2 py-1 rounded-full bg-celestial-emerald/10">Active Learning</span>
                </div>
                
                <div className="h-48 relative flex items-center justify-center bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden">
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10" />
                            <div className="absolute w-32 h-32 rounded-full border border-white/5 animate-ping opacity-20" />
                        </div>
                    ) : (
                        <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                            {/* Neural Connections */}
                            <div className={`absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-0 transition-opacity duration-300 ${selectedNode && selectedNode !== 'center' ? 'opacity-20' : 'opacity-100'}`}></div>
                            <div className={`absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 transition-opacity duration-300 ${selectedNode && selectedNode !== 'center' ? 'opacity-20' : 'opacity-100'}`}></div>
                            <div className={`absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 transition-opacity duration-300 ${selectedNode && selectedNode !== 'center' ? 'opacity-20' : 'opacity-100'}`}></div>

                            {/* Knowledge Agents */}
                            <ConceptAgent 
                                id="MainDB" label="Knowledge Core" text="Core" type="center" 
                                position="center" isActive={selectedNode === 'MainDB'} onClick={() => handleNodeClick('MainDB')} 
                            />
                            
                            <ConceptAgent 
                                id="GRI_Node" label="GRI Standard" text="GRI" type="satellite" 
                                position="top-left" isActive={selectedNode === 'GRI_Node'} onClick={() => handleNodeClick('GRI_Node')} 
                            />

                            <ConceptAgent 
                                id="SASB_Node" label="SASB" text="SASB" type="satellite" 
                                position="bottom-right" isActive={selectedNode === 'SASB_Node'} onClick={() => handleNodeClick('SASB_Node')} 
                            />

                            <ConceptAgent 
                                id="TCFD_Node" label="TCFD" text="TCFD" type="satellite" 
                                position="mid-right" isActive={selectedNode === 'TCFD_Node'} onClick={() => handleNodeClick('TCFD_Node')} 
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-celestial-purple" />
                                {t.dataExplorer}
                            </h3>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                                    <Share2 className="w-3 h-3" /> Export
                                </button>
                                <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                                    <Filter className="w-3 h-3" /> {t.filters}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-4 pb-2 border-b border-white/5">
                                <div className="col-span-6">{t.table.metric}</div>
                                <div className="col-span-3 text-right">{t.table.value}</div>
                                <div className="col-span-3 text-right">{t.table.confidence}</div>
                            </div>

                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                <OmniEsgCell key={i} mode="list" loading={true} />
                                ))
                            ) : (
                                [
                                { id: 1, label: 'Scope 1 Emissions', value: '450 tCO2e', conf: 'high', verified: true, traits: ['performance'], tags: ['Direct'], link: 'live' },
                                { id: 2, label: 'Scope 2 (Electricity)', value: '320 tCO2e', conf: 'high', verified: true, traits: ['optimization'], tags: ['Market-based'] },
                                { id: 3, label: 'Scope 3 (Supply Chain)', value: '2,400 tCO2e', conf: 'low', verified: false, traits: ['gap-filling'], tags: ['Estimates'], link: 'ai' },
                                { id: 4, label: 'Water Usage', value: '1.2 ML', conf: 'medium', verified: true, traits: ['bridging'], tags: ['IoT Sensor'], link: 'live' },
                                { id: 5, label: 'Waste Diversion', value: '85%', conf: 'medium', verified: false, traits: ['tagging'], tags: ['Recycling'] },
                                ].map((item) => (
                                    <OmniEsgCell 
                                        key={item.id}
                                        mode="list"
                                        label={item.label}
                                        value={item.value}
                                        confidence={item.conf as any}
                                        verified={item.verified}
                                        traits={item.traits as any}
                                        tags={item.tags}
                                        dataLink={item.link as any}
                                        icon={Globe}
                                        color={item.id % 2 === 0 ? 'emerald' : 'purple'}
                                        onAiAnalyze={() => handleAiAnalyze(item.label)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-celestial-gold" />
                            {t.knowledgeBase}
                        </h3>
                        <div className="space-y-3 flex-1">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <OmniEsgCell key={i} mode="list" loading={true} />
                                ))
                            ) : (
                                ['TCFD Implementation Guide v2.1', 'GRI 2024 Standards Update', 'Internal Water Policy Doc'].map((doc, idx) => (
                                <OmniEsgCell 
                                    key={idx}
                                    mode="list"
                                    label={doc}
                                    subValue="PDF • 2.4MB"
                                    value="View"
                                    icon={FileText}
                                    color="slate"
                                    confidence="high"
                                    verified={true}
                                    traits={['seamless']}
                                />
                                ))
                            )}
                        </div>
                        <button disabled={isLoading} className="w-full mt-4 py-3 text-sm text-center text-celestial-purple bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50">
                            {t.viewAll}
                        </button>
                    </div>
                </div>
            </div>
          </>
      )}

      {activeTab === 'scanner' && (
          /* Scanner View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="glass-panel p-8 rounded-2xl border-dashed border-2 border-white/20 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <div className={`w-20 h-20 rounded-full bg-celestial-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isScanning ? 'animate-pulse' : ''}`}>
                      {isScanning ? <Loader2 className="w-10 h-10 text-celestial-purple animate-spin" /> : <Upload className="w-10 h-10 text-celestial-purple" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{language === 'zh-TW' ? '拖放或點擊上傳' : 'Drag & Drop or Click to Upload'}</h3>
                  <p className="text-gray-400 mb-6 max-w-xs">{language === 'zh-TW' ? '支援 PDF, PNG, JPG。JunAiKey 將自動辨識 ESG 關鍵指標並同步至檔案中心。' : 'Supports PDF, PNG, JPG. JunAiKey automatically extracts ESG metrics and syncs to File Center.'}</p>
                  <button className="px-6 py-2 bg-celestial-purple text-white rounded-xl font-bold hover:bg-celestial-purple/80 transition-colors pointer-events-none">
                      {language === 'zh-TW' ? '選擇文件' : 'Select File'}
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.png" />
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <ScanLine className="w-5 h-5 text-celestial-emerald" />
                      {language === 'zh-TW' ? '最近掃描 (Live Stream)' : 'Scan Results'}
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                      {scannedFiles.length === 0 && (
                          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                              {language === 'zh-TW' ? '尚未掃描任何文件' : 'No documents scanned yet.'}
                          </div>
                      )}
                      {scannedFiles.map(file => (
                          <div key={file.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-emerald/30 transition-all group">
                              <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-slate-800 rounded-lg">
                                          <FileText className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-white">{file.name}</div>
                                          <div className="text-xs text-gray-400">{file.size} • {new Date(file.uploadDate).toLocaleTimeString()}</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                                      <CheckCircle className="w-3 h-3" /> {file.status === 'processed' ? 'Processed' : 'Scanning'}
                                  </div>
                              </div>
                              
                              <div className="flex gap-2 flex-wrap">
                                  {file.tags.map((tag: string, i: number) => (
                                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">
                                          <Tag className="w-2 h-2" /> {tag}
                                      </span>
                                  ))}
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-celestial-gold/10 rounded text-[10px] text-celestial-gold border border-celestial-gold/20">
                                      <Eye className="w-2 h-2" /> {file.confidence}% Confidence
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
