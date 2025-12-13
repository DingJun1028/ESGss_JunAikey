
import React, { useState } from 'react';
import { Language, View } from '../types';
import { BookOpen, Calendar, Users, Database, Search, ArrowRight, Heart, Share2, Star, Download, ExternalLink, Library, FileText, BarChart2, Lightbulb, GraduationCap } from 'lucide-react';
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
      desc: { zh: '知識共享與社群共學的中心', en: 'Hub for Knowledge Sharing and Community Learning' },
      tag: { zh: '知識核心', en: 'Knowledge Core' }
  };

  const books = [
      { id: 1, title: 'Net Positive', author: 'Paul Polman', desc: isZh ? '企業如何透過解決世界問題來獲利。' : 'How courageous companies thrive by giving more than they take.', cover: 'bg-emerald-500', rating: 4.8 },
      { id: 2, title: 'Speed & Scale', author: 'John Doerr', desc: isZh ? '解決氣候危機的行動計畫。' : 'An action plan for solving our climate crisis now.', cover: 'bg-blue-500', rating: 4.7 },
      { id: 3, title: 'The Infinite Game', author: 'Simon Sinek', desc: isZh ? '領導者如何建立長青基業。' : 'How to lead with an infinite mindset.', cover: 'bg-amber-500', rating: 4.9 },
  ];

  const events = [
      { id: 1, title: isZh ? '《Net Positive》共讀會' : 'Net Positive Reading Circle', date: '2024.06.15', time: '20:00', host: 'Dr. Yang', attendees: 45 },
      { id: 2, title: isZh ? 'ESG 創價實戰讀書會' : 'ESG Value Creation Workshop', date: '2024.06.22', time: '19:30', host: 'Consultant Sarah', attendees: 28 },
  ];

  const repos = [
      { category: isZh ? 'ESG 專區' : 'ESG Zone', items: ['GRI Standards 2024', 'IFRS S1/S2 Guide', 'TCFD Framework'] },
      { category: isZh ? '善向永續專區' : 'EsgSunshine Zone', items: ['Founder Vision', 'Impact Report 2023', 'Project Methodology'] },
      { category: isZh ? '萬能系統專區' : 'Universal System Zone', items: ['JunAiKey API Docs', 'System Architecture', 'Zero Hallucination Protocol'] },
  ];

  const enterpriseReports = [
      { id: 'r1', company: 'TSMC 台積電', year: '2023', sector: 'Semiconductor', score: 'AA', highlight: 'Water Management', color: 'bg-emerald-600' },
      { id: 'r2', company: 'Delta 台達電', year: '2023', sector: 'Electronics', score: 'AAA', highlight: 'Energy Efficiency', color: 'bg-blue-600' },
      { id: 'r3', company: 'E.SUN 玉山金控', year: '2023', sector: 'Finance', score: 'AA', highlight: 'Green Finance', color: 'bg-emerald-500' },
      { id: 'r4', company: 'China Steel 中鋼', year: '2023', sector: 'Steel', score: 'A', highlight: 'Carbon Capture', color: 'bg-slate-600' },
      { id: 'r5', company: 'Acer 宏碁', year: '2023', sector: 'Technology', score: 'AA', highlight: 'Circular Economy', color: 'bg-lime-600' },
      { id: 'r6', company: 'Cathay 國泰金', year: '2023', sector: 'Finance', score: 'AA', highlight: 'Climate Action', color: 'bg-emerald-500' },
  ];

  const handleRegister = (eventTitle: string) => {
      addToast('success', isZh ? `已報名：${eventTitle}` : `Registered: ${eventTitle}`, 'Book Club');
  };

  const handleReportAction = (action: string, company: string) => {
      addToast('info', isZh ? `正在執行 ${company} 的${action}...` : `Running ${action} for ${company}...`, 'AI Analyst');
      setTimeout(() => {
          addToast('success', isZh ? '分析報告已生成至「商情分析」' : 'Analysis generated in Market Intel', 'System');
      }, 1500);
  };

  // Filter Logic
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReports = enterpriseReports.filter(r => r.company.toLowerCase().includes(searchQuery.toLowerCase()) || r.sector.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRepos = repos.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.items.length > 0);


  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Library}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Global Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isZh ? "搜尋書名、活動或報告..." : "Search books, events, or reports..."}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-1 focus:ring-celestial-gold outline-none shadow-lg backdrop-blur-md transition-all focus:border-celestial-gold/50"
            />
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit overflow-x-auto mx-auto mb-8">
            {[
                { id: 'reports', label: isZh ? '企業永續年鑑' : 'Enterprise Yearbook', icon: FileText },
                { id: 'books', label: isZh ? '好書分享' : 'Book Sharing', icon: BookOpen },
                { id: 'club', label: isZh ? '讀書會' : 'Book Club', icon: Users },
                { id: 'repo', label: isZh ? '館藏知識庫' : 'Knowledge Repo', icon: Database },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* --- Content: Enterprise Yearbook (New) --- */}
        {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
                {/* Removed local search bar to use global one */}
                <div className="flex justify-end mb-4">
                    <span className="text-xs text-gray-400 px-3 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-1">
                        <Database className="w-3 h-3" /> Source: GRI / SDR
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map(report => (
                        <div key={report.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-celestial-gold/30 transition-all flex flex-col">
                            <div className={`h-32 ${report.color} relative p-6 flex flex-col justify-between`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10">
                                        {report.year} Report
                                    </span>
                                    <span className="text-2xl font-bold text-white opacity-20 group-hover:opacity-100 transition-opacity">
                                        {report.score}
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white">{report.company}</h3>
                                    <p className="text-xs text-gray-300">{report.sector}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 flex-1 flex flex-col gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">{isZh ? '年度亮點' : 'Highlight'}</div>
                                    <div className="text-sm text-gray-200 flex items-center gap-2">
                                        <Star className="w-3 h-3 text-celestial-gold fill-current" />
                                        {report.highlight}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-auto">
                                    <button 
                                        onClick={() => handleReportAction('AI Analysis', report.company)}
                                        className="flex flex-col items-center justify-center gap-1 py-2 bg-celestial-purple/10 hover:bg-celestial-purple/20 text-celestial-purple rounded-lg transition-colors border border-celestial-purple/20"
                                        title={isZh ? 'AI 深度分析' : 'AI Deep Analysis'}
                                    >
                                        <BarChart2 className="w-4 h-4" />
                                        <span className="text-[9px] font-bold">{isZh ? '深度分析' : 'Analyze'}</span>
                                    </button>
                                    <button 
                                        onClick={() => handleReportAction('Summary', report.company)}
                                        className="flex flex-col items-center justify-center gap-1 py-2 bg-celestial-gold/10 hover:bg-celestial-gold/20 text-celestial-gold rounded-lg transition-colors border border-celestial-gold/20"
                                        title={isZh ? '重點提示摘要' : 'Key Highlights'}
                                    >
                                        <Lightbulb className="w-4 h-4" />
                                        <span className="text-[9px] font-bold">{isZh ? '重點提示' : 'Summary'}</span>
                                    </button>
                                    <button 
                                        onClick={() => handleReportAction('Teaching Mode', report.company)}
                                        className="flex flex-col items-center justify-center gap-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20"
                                        title={isZh ? '報告書教學模式' : 'Teaching Mode'}
                                    >
                                        <GraduationCap className="w-4 h-4" />
                                        <span className="text-[9px] font-bold">{isZh ? '合規教學' : 'Teach'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredReports.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            {isZh ? '找不到相關報告' : 'No reports found matching your search.'}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- Content: Book Sharing --- */}
        {activeTab === 'books' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                {filteredBooks.map(book => (
                    <div key={book.id} className="glass-panel p-4 rounded-2xl border border-white/10 group hover:border-celestial-gold/30 transition-all flex flex-col h-full">
                        <div className={`h-48 rounded-xl ${book.cover} mb-4 relative overflow-hidden shadow-lg`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                                <p className="text-xs opacity-80">{book.author}</p>
                            </div>
                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs text-yellow-400">
                                <Star className="w-3 h-3 fill-current" /> {book.rating}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-300 mb-4 line-clamp-2">{book.desc}</p>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-2">
                                <BookOpen className="w-3 h-3" /> {isZh ? '試讀摘要' : 'Read Summary'}
                            </button>
                            <button className="p-2 bg-white/5 hover:bg-celestial-gold/20 hover:text-celestial-gold rounded-lg text-gray-400 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredBooks.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {isZh ? '找不到相關書籍' : 'No books found matching your search.'}
                    </div>
                )}
                <div className="glass-panel p-4 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center hover:bg-white/5 cursor-pointer transition-all min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <Heart className="w-6 h-6 text-pink-400" />
                    </div>
                    <h4 className="font-bold text-white mb-1">{isZh ? '推薦好書' : 'Recommend a Book'}</h4>
                    <p className="text-xs text-gray-500">{isZh ? '分享您的閱讀清單給社群' : 'Share your reading list with the community'}</p>
                </div>
            </div>
        )}

        {/* --- Content: Book Club --- */}
        {activeTab === 'club' && (
            <div className="space-y-6 animate-fade-in">
                <div className="glass-panel p-8 rounded-2xl bg-gradient-to-r from-celestial-purple/10 to-transparent border border-celestial-purple/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{isZh ? '加入我們的閱讀社群' : 'Join Our Reading Community'}</h3>
                            <p className="text-gray-300 max-w-xl">{isZh ? '每週與 Dr. Yang 及永續專家共同探討 ESG 經典著作，深入交流實戰經驗。' : 'Weekly deep dives into ESG classics with Dr. Yang and sustainability experts.'}</p>
                        </div>
                        <button className="px-6 py-3 bg-celestial-purple hover:bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2">
                            {isZh ? '了解會員權益' : 'Membership Info'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="p-6 bg-slate-900/50 border border-white/10 rounded-2xl hover:border-celestial-gold/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-celestial-gold/10 text-celestial-gold px-3 py-1 rounded text-xs font-bold border border-celestial-gold/20">Upcoming</span>
                                <div className="text-gray-400 text-xs flex items-center gap-2">
                                    <Users className="w-3 h-3" /> {event.attendees} Attending
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                            <div className="space-y-2 text-sm text-gray-300 mb-6">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> {event.date} • {event.time}</div>
                                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /> Host: {event.host}</div>
                            </div>
                            <button 
                                onClick={() => handleRegister(event.title)}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10 group-hover:border-celestial-gold/50 group-hover:text-celestial-gold"
                            >
                                {isZh ? '立即報名' : 'Register Now'}
                            </button>
                        </div>
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            {isZh ? '找不到相關活動' : 'No events found matching your search.'}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- Content: Knowledge Repo --- */}
        {activeTab === 'repo' && (
            <div className="space-y-8 animate-fade-in">
                {/* Removed local search bar to use global one */}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredRepos.map((repo, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10">
                            <h4 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
                                <Database className="w-4 h-4 text-celestial-gold" />
                                {repo.category}
                            </h4>
                            <ul className="space-y-3">
                                {repo.items.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-celestial-gold transition-colors" />
                                            <span className="text-sm text-gray-300 group-hover:text-white">{item}</span>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="w-3 h-3 text-gray-400 hover:text-white" />
                                            <ExternalLink className="w-3 h-3 text-gray-400 hover:text-white" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-4 py-2 text-xs text-gray-500 hover:text-white transition-colors border-t border-white/5">
                                {isZh ? '查看更多' : 'View More'}
                            </button>
                        </div>
                    ))}
                    {filteredRepos.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            {isZh ? '找不到相關文件' : 'No documents found matching your search.'}
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
