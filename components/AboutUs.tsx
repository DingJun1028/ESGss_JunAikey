
import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Info, Globe, ArrowRight, ShieldCheck, Zap, Users, Target, 
    DollarSign, Server, Map as MapIcon, List, Layers, Cpu, 
    Lock, FileText, Download, Share2, GitCommit, Calendar, 
    CheckCircle, BrainCircuit, Network, ScrollText, Binary, Activity
} from 'lucide-react';
import { LogoIcon } from './Layout';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { SYSTEM_CHANGELOG } from '../constants';
import { marked } from 'marked';

interface AboutUsProps {
  language: Language;
}

export const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vision' | 'roadmap' | 'tech' | 'whitepaper'>('whitepaper');

  const pageData = {
      title: { zh: '系統宣言與技術規格', en: 'Manifesto & Technical Specs' },
      desc: { zh: '給投資者、夥伴與開發者的官方技術白皮書 v15.0', en: 'Official Technical Whitepaper v15.0 for Developers' },
      tag: { zh: '系統核心', en: 'System Core' }
  };

  const handleDownloadPDF = () => {
      addToast('info', isZh ? '正在編譯白皮書 PDF (v15.0)...' : 'Compiling Whitepaper PDF (v15.0)...', 'System');
      setTimeout(() => {
          addToast('success', isZh ? '下載完成' : 'Download Complete', 'System');
      }, 2000);
  };

  const tabs = [
      { id: 'whitepaper', label: isZh ? '技術規格白皮書' : 'Tech Whitepaper', icon: ScrollText },
      { id: 'vision', label: isZh ? '願景與黃金三角' : 'Vision & Triangle', icon: Target },
      { id: 'roadmap', label: isZh ? '演進日誌' : 'Roadmap', icon: GitCommit },
      { id: 'tech', label: isZh ? '核心技術棧' : 'Tech Stack', icon: Server },
  ];

  const renderContent = () => {
      switch (activeTab) {
          case 'whitepaper':
              return (
                  <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
                      <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-slate-900/50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                              <Binary className="w-64 h-64 text-white" />
                          </div>
                          
                          <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-8">
                              <div>
                                  <span className="text-[10px] font-black text-celestial-gold uppercase tracking-[0.4em] mb-2 block">Official Documentation</span>
                                  <h3 className="text-4xl font-black text-white tracking-tighter">專案完全技術規格白皮書</h3>
                                  <div className="flex gap-4 mt-3">
                                      <span className="text-xs text-emerald-400 font-mono">Status: FINAL-V15</span>
                                      <span className="text-xs text-gray-500 font-mono">Released: 2025.05.20</span>
                                  </div>
                              </div>
                              <button onClick={handleDownloadPDF} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
                                  <Download className="w-6 h-6 text-white" />
                              </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-gray-300 leading-loose">
                              <div className="space-y-8">
                                  <section>
                                      <h4 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <BrainCircuit className="w-4 h-4 text-celestial-purple" /> 1. 神經內核引擎 (Neural Kernel)
                                      </h4>
                                      <p>系統核心採用 <strong>JunAiKey Neural-OS</strong> 架構，底層模型鎖定 <code>gemini-3-pro-preview</code>。其獨特的「交叉推理」協議允許系統在處理碳資產計算時，同步調用商情庫進行風險對位。透過 128k 上下文窗口，實現全企業數據的零丟失感知。</p>
                                  </section>
                                  <section>
                                      <h4 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Activity className="w-4 h-4 text-emerald-400" /> 2. 數據契約與校驗 (Data Contract)
                                      </h4>
                                      <p>數據處理遵循 <strong>MECE 原則</strong>。所有進入系統的遙測數據（Telemetry）需經過 L3 級別驗證。若偵測到數據異常（Anomaly），系統將自動啟動「預判式修復」，並在稽核軌跡中生成不可篡改的雜湊證書。</p>
                                  </section>
                              </div>
                              <div className="space-y-8">
                                  <section>
                                      <h4 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Network className="w-4 h-4 text-blue-400" /> 3. Agentic Flow 分佈式架構
                                      </h4>
                                      <p>ESGss 不採用單一任務邏輯，而是透過 <strong>Orchestrator</strong> 協調多個專業代理人。例如：<code>Captain Deck</code> 負責戰略、<code>The Scribe</code> 負責合規生成。代理人之間透過「神經匯流排」進行非同步通信，極大化決策效率。</p>
                                  </section>
                                  <section>
                                      <h4 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Zap className="w-4 h-4 text-celestial-gold" /> 4. 創價型 ESG 方法論
                                      </h4>
                                      <p>系統內建 Dr. Thoth Yang 的核心智庫。不同於傳統合規工具，ESGss 專注於開發企業的<strong>永續創造力</strong>。透過「永續競技場」卡牌化知識體系，將枯燥的培訓轉化為具備商業戰鬥力的實踐過程。</p>
                                  </section>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'vision':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="text-center space-y-4 mb-12">
                          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold via-white to-celestial-emerald">
                              {isZh ? '黃金三角：資本、政策、知識' : 'The Golden Triangle: Capital, Policy, Knowledge'}
                          </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-emerald-500 bg-gradient-to-b from-emerald-900/10 to-transparent group hover:-translate-y-2 transition-transform duration-500">
                              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                                  <ShieldCheck className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-3">{isZh ? '防禦 (Defense)' : 'Defense'}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">降低營運風險與合規成本。實作包含 GRI/SASB 自動生成與碳關稅監控。</p>
                          </div>
                          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-gold bg-gradient-to-b from-amber-900/10 to-transparent group hover:-translate-y-2 transition-transform duration-500">
                              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 text-celestial-gold group-hover:scale-110 transition-transform">
                                  <Zap className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-3">{isZh ? '進攻 (Offense)' : 'Offense'}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">創造商業價值與綠色溢價。實作包含綠色供應鏈協作與創新商模設計。</p>
                          </div>
                          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-celestial-purple bg-gradient-to-b from-purple-900/10 to-transparent group hover:-translate-y-2 transition-transform duration-500">
                              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-celestial-purple group-hover:scale-110 transition-transform">
                                  <Users className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-3">{isZh ? '賦能 (Empowerment)' : 'Empowerment'}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">培育人才與建立共識文化。實作包含人才護照、文化機器人與永續學院。</p>
                          </div>
                      </div>
                  </div>
              );
          case 'roadmap':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="relative border-l-2 border-white/10 ml-4 space-y-12 pb-12">
                          {SYSTEM_CHANGELOG.map((log, idx) => (
                              <div key={idx} className="relative pl-8 group">
                                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${idx === 0 ? 'bg-celestial-emerald border-celestial-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)] scale-125' : 'bg-slate-900 border-gray-600 group-hover:border-white'}`} />
                                  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                      <div className="flex justify-between items-center mb-4">
                                          <h4 className={`text-lg font-bold ${idx === 0 ? 'text-celestial-emerald' : 'text-white'}`}>{log.version} - {log.title}</h4>
                                          <span className="text-xs text-gray-500 font-mono">{log.date}</span>
                                      </div>
                                      <ul className="space-y-2">
                                          {log.changes.map((change, cIdx) => (
                                              <li key={cIdx} className="text-sm text-gray-400 flex items-start gap-2">
                                                  <div className="w-1 h-1 rounded-full bg-white/20 mt-2 shrink-0" />
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                      <div className="glass-panel p-8 rounded-2xl border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Cpu className="w-6 h-6 text-celestial-purple" /> 技術棧 (Stack)</h3>
                          <ul className="space-y-4">
                              <li className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                  <div className="text-sm font-bold text-white">Frontend Architecture: <span className="text-gray-400 font-normal">React 19, TypeScript, Tailwind CSS</span></div>
                              </li>
                              <li className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                  <div className="text-sm font-bold text-white">AI Engine: <span className="text-gray-400 font-normal">Gemini 3 Pro (Deep Reasoning), ZHP Protocol</span></div>
                              </li>
                              <li className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                  <div className="text-sm font-bold text-white">Data State: <span className="text-gray-400 font-normal">RxJS Neural Bus, Universal Intelligence Engine</span></div>
                              </li>
                          </ul>
                      </div>
                      <div className="glass-panel p-8 rounded-2xl border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Lock className="w-6 h-6 text-emerald-400" /> 安全與合規 (Security)</h3>
                          <p className="text-sm text-gray-400 leading-loose">ESGss 採用業界領先的數據安全加密。碳資產數據傳輸經過端對端加密（E2EE），並透過區塊鏈雜湊映射確保稽核軌跡的真實性。系統每 24 小時進行一次自我診斷，確保內核穩定度為 100%。</p>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-7xl mx-auto">
        <UniversalPageHeader icon={Info} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />

        <div className="flex justify-center mb-8 sticky top-4 z-30">
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}>
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="min-h-[500px]">
            {renderContent()}
        </div>
    </div>
  );
};
