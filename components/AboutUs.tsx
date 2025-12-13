
import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Info, Globe, ArrowRight, ShieldCheck, Zap, Users, Target, 
    DollarSign, Server, Map as MapIcon, List, Layers, Cpu, 
    Lock, FileText, Download, Share2, GitCommit, Calendar, 
    CheckCircle, BrainCircuit, Network 
} from 'lucide-react';
import { LogoIcon } from './Layout';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { SYSTEM_CHANGELOG } from '../constants';

interface AboutUsProps {
  language: Language;
}

export const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vision' | 'roadmap' | 'tech' | 'action'>('vision');

  const pageData = {
      title: { zh: '關於 ESGss x JunAiKey', en: 'About ESGss x JunAiKey' },
      desc: { zh: '給投資者、夥伴與開發者的系統白皮書', en: 'System Whitepaper for Investors, Partners & Developers' },
      tag: { zh: '系統宣言', en: 'System Manifesto' }
  };

  const handleDownloadPDF = () => {
      addToast('info', isZh ? '正在編譯白皮書 PDF (v15.0)...' : 'Compiling Whitepaper PDF (v15.0)...', 'System');
      setTimeout(() => {
          addToast('success', isZh ? '下載完成' : 'Download Complete', 'System');
      }, 2000);
  };

  const tabs = [
      { id: 'vision', label: isZh ? '願景與黃金三角' : 'Vision & Triangle', icon: Target },
      { id: 'roadmap', label: isZh ? '演進日誌 (Roadmap)' : 'Evolution Roadmap', icon: GitCommit },
      { id: 'tech', label: isZh ? '技術架構 (Stack)' : 'Tech Architecture', icon: Server },
      { id: 'action', label: isZh ? '行動呼籲' : 'Call to Action', icon: List },
  ];

  const renderContent = () => {
      switch (activeTab) {
          case 'vision':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="text-center space-y-4 mb-12">
                          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold via-white to-celestial-emerald">
                              {isZh ? '黃金三角：資本、政策、知識' : 'The Golden Triangle: Capital, Policy, Knowledge'}
                          </h3>
                          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto text-lg">
                              {isZh 
                                ? 'ESGss 致力於構建「創價型 ESG」生態系。我們不只是合規工具，而是透過 AI 與區塊鏈，將企業的永續投入轉化為可量化的競爭力護城河。' 
                                : 'ESGss builds a "Value-Creating ESG" ecosystem. Beyond compliance, we use AI & Blockchain to transform sustainability efforts into quantifiable competitive moats.'}
                          </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-emerald-500 bg-gradient-to-b from-emerald-900/10 to-transparent group hover:-translate-y-2 transition-transform duration-500">
                              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                                  <ShieldCheck className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-3">{isZh ? '防禦 (Defense)' : 'Defense'}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                  {isZh ? '降低營運風險與合規成本。' : 'Minimize operational risk & compliance costs.'}
                              </p>
                              <ul className="text-xs text-gray-500 space-y-2">
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> GRI/SASB Reporting</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> CBAM/Carbon Tax</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Audit Trail</li>
                              </ul>
                          </div>

                          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-gold bg-gradient-to-b from-amber-900/10 to-transparent group hover:-translate-y-2 transition-transform duration-500">
                              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 text-celestial-gold group-hover:scale-110 transition-transform">
                                  <Zap className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-3">{isZh ? '進攻 (Offense)' : 'Offense'}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                  {isZh ? '創造商業價值與綠色溢價。' : 'Create business value & green premium.'}
                              </p>
                              <ul className="text-xs text-gray-500 space-y-2">
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-celestial-gold"/> Green Supply Chain</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-celestial-gold"/> Innovation Models</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-celestial-gold"/> Brand Reputation</li>
                              </ul>
                          </div>

                          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-purple bg-gradient-to-b from-purple-900/10 to-transparent group hover:-translate-y-2 transition-transform duration-500">
                              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-celestial-purple group-hover:scale-110 transition-transform">
                                  <Users className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-3">{isZh ? '賦能 (Empowerment)' : 'Empowerment'}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                  {isZh ? '培育人才與建立共識文化。' : 'Cultivate talent & consensus culture.'}
                              </p>
                              <ul className="text-xs text-gray-500 space-y-2">
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-celestial-purple"/> Talent Passport</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-celestial-purple"/> Culture Bot</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-celestial-purple"/> Academy</li>
                              </ul>
                          </div>
                      </div>
                  </div>
              );
          case 'roadmap':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                              <GitCommit className="w-6 h-6 text-celestial-gold" />
                              {isZh ? '系統演進之路 (System Log)' : 'System Evolution Roadmap'}
                          </h3>
                          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-gray-300">Live Status: v15.0</span>
                      </div>
                      
                      <div className="relative border-l-2 border-white/10 ml-4 space-y-12 pb-12">
                          {SYSTEM_CHANGELOG.map((log, idx) => (
                              <div key={idx} className="relative pl-8 group">
                                  {/* Timeline Node */}
                                  <div className={`
                                      absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10
                                      ${idx === 0 ? 'bg-celestial-emerald border-celestial-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)] scale-125' : 'bg-slate-900 border-gray-600 group-hover:border-white'}
                                  `} />
                                  
                                  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                          <div>
                                              <div className="flex items-center gap-3">
                                                  <h4 className={`text-lg font-bold ${idx === 0 ? 'text-celestial-emerald' : 'text-white'}`}>{log.version}</h4>
                                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border
                                                      ${log.category === 'Core' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                                                        log.category === 'Feature' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                                                  `}>
                                                      {log.category}
                                                  </span>
                                              </div>
                                              <div className="text-sm text-gray-300 font-medium mt-1">{log.title}</div>
                                          </div>
                                          <div className="text-xs text-gray-500 flex items-center gap-1 font-mono bg-black/20 px-2 py-1 rounded">
                                              <Calendar className="w-3 h-3" /> {log.date}
                                          </div>
                                      </div>
                                      
                                      <ul className="space-y-2">
                                          {log.changes.map((change, cIdx) => (
                                              <li key={cIdx} className="text-sm text-gray-400 flex items-start gap-2 leading-relaxed">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0 group-hover:bg-celestial-gold transition-colors" />
                                                  <span>{change}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'tech':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="glass-panel p-8 rounded-2xl border border-white/10">
                              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                  <Cpu className="w-6 h-6 text-celestial-purple" />
                                  {isZh ? '核心技術棧 (Core Tech)' : 'Core Tech Stack'}
                              </h3>
                              <ul className="space-y-4">
                                  <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Globe className="w-5 h-5"/></div>
                                      <div>
                                          <div className="text-sm font-bold text-white">Frontend Architecture</div>
                                          <div className="text-xs text-gray-400 mt-1">React 19, TypeScript, Tailwind CSS, Glassmorphism UI 2.0</div>
                                      </div>
                                  </li>
                                  <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                      <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><BrainCircuit className="w-5 h-5"/></div>
                                      <div>
                                          <div className="text-sm font-bold text-white">AI Engine (AIOS)</div>
                                          <div className="text-xs text-gray-400 mt-1">Google Gemini 3 Pro (Reasoning), Gemini 2.5 Flash (Speed), Zero Hallucination Protocol</div>
                                      </div>
                                  </li>
                                  <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Network className="w-5 h-5"/></div>
                                      <div>
                                          <div className="text-sm font-bold text-white">State & Data</div>
                                          <div className="text-xs text-gray-400 mt-1">Universal Intelligence Engine (Observable), RxJS Neural Bus</div>
                                      </div>
                                  </li>
                                  <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                      <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><Server className="w-5 h-5"/></div>
                                      <div>
                                          <div className="text-sm font-bold text-white">Backend Infrastructure</div>
                                          <div className="text-xs text-gray-400 mt-1">NoCodeBackend (NCB), Supabase, Node.js Edge Functions</div>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                          
                          <div className="space-y-6">
                              <div className="glass-panel p-8 rounded-2xl border border-white/10">
                                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                      <Lock className="w-6 h-6 text-emerald-400" />
                                      {isZh ? '安全與隱私 (Security)' : 'Security & Privacy'}
                                  </h3>
                                  <ul className="space-y-3 text-sm text-gray-300">
                                      <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-500"/> SOC2 Type II 準則設計</li>
                                      <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-500"/> 端對端加密 (E2EE) 數據傳輸</li>
                                      <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-500"/> RBAC 基於角色的存取控制</li>
                                      <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-500"/> AI 護欄 (Guardrails) 防止 PII 外洩</li>
                                  </ul>
                              </div>

                              <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900/50">
                                  <h3 className="text-xl font-bold text-white mb-4">Design System: Singularity</h3>
                                  <div className="flex gap-4">
                                      <div className="w-12 h-12 rounded-full bg-celestial-900 border border-white/20 shadow-lg" title="Deep Space" />
                                      <div className="w-12 h-12 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" title="Growth" />
                                      <div className="w-12 h-12 rounded-full bg-celestial-gold shadow-[0_0_15px_rgba(251,191,36,0.5)]" title="Value" />
                                      <div className="w-12 h-12 rounded-full bg-celestial-purple shadow-[0_0_15px_rgba(139,92,246,0.5)]" title="Intelligence" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'action':
              return (
                  <div className="glass-panel p-10 rounded-3xl border border-white/10 animate-fade-in bg-slate-900/80 max-w-4xl mx-auto">
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                          <List className="w-8 h-8 text-celestial-emerald" />
                          {isZh ? '下一步行動建議 (Next Steps)' : 'Next Steps'}
                      </h3>
                      <div className="space-y-6">
                          <div className="flex gap-6 items-start p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-celestial-emerald/50 transition-all cursor-pointer group">
                              <div className="w-12 h-12 rounded-full bg-celestial-emerald/20 text-celestial-emerald flex items-center justify-center shrink-0 font-bold text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">1</div>
                              <div>
                                  <h4 className="font-bold text-white text-lg mb-2 group-hover:text-emerald-300 transition-colors">啟動全方位健檢 (Health Check)</h4>
                                  <p className="text-sm text-gray-400">使用 <span className="text-white font-bold">Health Check</span> 模組盤點企業目前的 ESG 數據成熟度與風險缺口。這將為您生成一份專屬的改善路徑圖。</p>
                              </div>
                          </div>
                          <div className="flex gap-6 items-start p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-celestial-purple/50 transition-all cursor-pointer group">
                              <div className="w-12 h-12 rounded-full bg-celestial-purple/20 text-celestial-purple flex items-center justify-center shrink-0 font-bold text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.3)]">2</div>
                              <div>
                                  <h4 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">對接數據源 (Integration)</h4>
                                  <p className="text-sm text-gray-400">前往 <span className="text-white font-bold">API Zone</span> 或 <span className="text-white font-bold">Integration Hub</span>，將現有的 ERP/電費單數據導入系統，讓 AI 開始即時監控。</p>
                              </div>
                          </div>
                          <div className="flex gap-6 items-start p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-celestial-gold/50 transition-all cursor-pointer group">
                              <div className="w-12 h-12 rounded-full bg-celestial-gold/20 text-celestial-gold flex items-center justify-center shrink-0 font-bold text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.3)]">3</div>
                              <div>
                                  <h4 className="font-bold text-white text-lg mb-2 group-hover:text-amber-300 transition-colors">賦能團隊 (Empowerment)</h4>
                                  <p className="text-sm text-gray-400">邀請員工加入 <span className="text-white font-bold">Academy</span> 與 <span className="text-white font-bold">My ESG</span>，透過遊戲化機制與卡牌收集，提升全員永續意識。</p>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-7xl mx-auto">
        <UniversalPageHeader 
            icon={Info}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Standardized Header Banner */}
        <div className="glass-panel p-10 rounded-[2.5rem] border border-celestial-gold/30 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden text-center mb-10 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-celestial-emerald via-celestial-gold to-celestial-purple" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 h-28 mb-8 relative">
                    <div className="absolute inset-0 bg-celestial-gold/20 blur-2xl rounded-full animate-pulse" />
                    <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    ESGss <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald to-celestial-gold">JunAiKey</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 font-light">
                    The Universal Operating System for Sustainable Future.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-8 py-3 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 group hover:scale-105"
                    >
                        <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        {isZh ? '下載完整白皮書 PDF' : 'Download Whitepaper PDF'}
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 hover:border-white/30 hover:scale-105">
                        <Share2 className="w-5 h-5" />
                        {isZh ? '分享' : 'Share'}
                    </button>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 sticky top-4 z-30">
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                                ? 'bg-white text-black shadow-lg shadow-white/10 scale-105' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
            {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center pt-16 border-t border-white/5 text-gray-500 text-xs flex flex-col items-center gap-3">
            <div className="w-8 h-8 opacity-30">
                <LogoIcon className="w-full h-full grayscale" />
            </div>
            <p className="font-medium">&copy; 2025 ESGss Corp. All rights reserved.</p>
            <p className="font-mono text-[10px] opacity-60">Documentation v15.0.0 | Generated by JunAiKey System Architect</p>
        </div>
    </div>
  );
};
