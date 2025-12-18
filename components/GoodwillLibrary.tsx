import React, { useState } from 'react';
import { Language, View } from '../types';
import { BookOpen, Calendar, Users, Database, Search, ArrowRight, Heart, Share2, Star, Download, ExternalLink, Library, FileText, BarChart2, Lightbulb, GraduationCap, X, ShieldCheck, Globe } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface GoodwillLibraryProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

export const GoodwillLibrary: React.FC<GoodwillLibraryProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'books' | 'club' | 'repo' | 'reports'>('reports');
  const [searchQuery, setSearchQuery] = useState('');

  const pageData = {
      title: { zh: '善向圖書館', en: 'Goodwill Library' },
      desc: { zh: '知識共享與標竿企業永續實踐中心', en: 'Hub for Knowledge Sharing and Enterprise ESG Practice' },
      tag: { zh: '知識核心', en: 'Knowledge Core' }
  };

  const enterpriseReports = [
      { id: 'ctbc', company: 'CTBC 中國信託', year: '2023', sector: 'Finance', score: 'AA', highlight: 'Green Finance & Digital Inclusion', color: 'bg-emerald-700', description: isZh ? '亞洲領先的金融永續轉型標竿。' : 'Leading financial sustainability benchmark in Asia.' },
      { id: 'r1', company: 'TSMC 台積電', year: '2023', sector: 'Semiconductor', score: 'AA', highlight: 'Water Management', color: 'bg-emerald-600' },
      { id: 'r2', company: 'Delta 台達電', year: '2023', sector: 'Electronics', score: 'AAA', highlight: 'Energy Efficiency', color: 'bg-blue-600' },
      { id: 'r3', company: 'E.SUN 玉山金控', year: '2023', sector: 'Finance', score: 'AA', highlight: 'Green Finance', color: 'bg-emerald-500' },
  ];

  const handleReportAction = (action: string, company: string) => {
      addToast('info', isZh ? `正在執行 ${company} 的 ${action}...` : `Running ${action} for ${company}...`, 'AI Analyst');
      
      // 特殊實作：如果是中國信託，產出特定金融分析
      if (company.includes('CTBC')) {
          setTimeout(() => {
              addToast('reward', isZh ? '已完成 CTBC 綠色融資數據交叉比對' : 'CTBC Green Finance Cross-Check Complete', 'FinESG Agent');
          }, 1500);
      }
  };

  const filteredReports = enterpriseReports.filter(r => 
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Library}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isZh ? "搜尋企業、標竿或報告..." : "Search enterprise, benchmarks, or reports..."}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-white focus:ring-1 focus:ring-celestial-gold outline-none shadow-lg backdrop-blur-md transition-all"
            />
        </div>

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit mx-auto mb-8">
            {[
                { id: 'reports', label: isZh ? '企業永續年鑑' : 'Enterprise Yearbook', icon: FileText },
                { id: 'books', label: isZh ? '好書分享' : 'Book Sharing', icon: BookOpen },
                { id: 'repo', label: isZh ? '館藏知識庫' : 'Knowledge Repo', icon: Database },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredReports.map(report => (
                    <div key={report.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-celestial-gold/40 transition-all flex flex-col">
                        <div className={`h-32 ${report.color} relative p-6 flex flex-col justify-between`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                            <div className="relative z-10 flex justify-between">
                                <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10">
                                    {report.year} SUSTAINABILITY
                                </span>
                                <div className="flex gap-1">
                                    <ShieldCheck className="w-4 h-4 text-white opacity-50" />
                                    <span className="text-xl font-bold text-white">{report.score}</span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white">{report.company}</h3>
                                <p className="text-xs text-gray-300">{report.sector}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">{isZh ? '核心標籤' : 'Core Focus'}</div>
                                <div className="text-sm text-gray-200 flex items-center gap-2">
                                    <Globe className="w-3 h-3 text-celestial-gold" />
                                    {report.highlight}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-auto">
                                <button 
                                    onClick={() => handleReportAction('Analyze', report.company)}
                                    className="flex flex-col items-center justify-center gap-1.5 py-3 bg-white/5 hover:bg-celestial-blue/20 rounded-xl transition-all border border-white/5 group/btn"
                                >
                                    <BarChart2 className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-white">{isZh ? '深度分析' : 'Analyze'}</span>
                                </button>
                                <button 
                                    onClick={() => handleReportAction('Summary', report.company)}
                                    className="flex flex-col items-center justify-center gap-1.5 py-3 bg-white/5 hover:bg-celestial-gold/20 rounded-xl transition-all border border-white/5 group/btn"
                                >
                                    <Lightbulb className="w-4 h-4 text-celestial-gold group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-white">{isZh ? '重點提示' : 'Highlights'}</span>
                                </button>
                                <button 
                                    onClick={() => handleReportAction('Education', report.company)}
                                    className="flex flex-col items-center justify-center gap-1.5 py-3 bg-white/5 hover:bg-celestial-emerald/20 rounded-xl transition-all border border-white/5 group/btn"
                                >
                                    <GraduationCap className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-white">{isZh ? '合規教學' : 'Complian'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'repo' && (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center opacity-50">
                <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">{isZh ? '正在從智庫同步標竿企業資源...' : 'Syncing benchmark resources from Think Tank...'}</p>
            </div>
        )}
    </div>
  );
};