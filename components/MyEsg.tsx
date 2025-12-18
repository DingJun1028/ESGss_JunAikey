
import React, { useState } from 'react';
import { 
  CheckSquare, Crown, ListTodo, Plus, Trash2, Edit3, Grid, X, ArrowRight, Target, Award, Maximize2, Minimize2, Calendar, Coins, Layout, Briefcase, Sparkles, Activity, FileText, Globe, GraduationCap, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { Language, View, DashboardWidget, WidgetType } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';
import { VIEW_METADATA } from '../constants';

interface MyEsgProps {
  language: Language;
  onNavigate: (view: View) => void;
}

const BerkeleyHeroBanner: React.FC<{ isZh: boolean, onNavigate: (view: View) => void }> = ({ isZh, onNavigate }) => (
    <div className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-amber-900/20 border border-amber-500/30 group cursor-pointer h-full min-h-[300px]" onClick={() => onNavigate(View.ACADEMY)}>
        <div className="absolute inset-0">
            <img src="https://thumbs4.imagebam.com/12/1d/de/ME18KXOE_t.jpg" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" alt="Berkeley Course" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        <div className="relative z-10 p-10 md:p-14 flex flex-col justify-center h-full gap-6">
            <div>
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <Award className="w-3.5 h-3.5" /> 頂尖國際雙認證 (Berkeley Haas IBI)
                    </span>
                    <span className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20 backdrop-blur-md">
                        2025 全新學期
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-none tracking-tighter max-w-3xl">
                    {isZh ? 'Berkeley 國際永續策略創新師' : 'Berkeley International ESG Strategy Innovator'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mb-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                            {isZh ? '對接矽谷大師 Dr. Solomon Darwin 智慧，整合 UC Berkeley Haas 八大機構之創價邏輯。' : 'Integrating Silicon Valley wisdom from Dr. Solomon Darwin.'}
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                            {isZh ? '五合一核心訓練：從 ESG 戰略對齊、合規撰寫、商模設計到顧問實務，直搗經營核心。' : '5-in-1 core training covering strategy, compliance, and business models.'}
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                            {isZh ? '實戰導向：直接產出企業「永續策略藍圖 2.0」與「品牌創價專案」，拒絕紙上談兵。' : 'Action-oriented output including strategic blueprints and brand value projects.'}
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                            {isZh ? '結業即認證： Berkeley IBI 證書與 TSISDA 國際永續轉型規劃師證照，職涯競爭力最大化。' : 'Earn Berkeley IBI and TSISDA certifications upon completion.'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <button className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-black rounded-2xl transition-all flex items-center gap-3 group/btn shadow-xl shadow-amber-500/20">
                    {isZh ? '立即報名 / 了解課程詳情' : 'Register Now / Details'}
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

const WidgetContainer: React.FC<{ 
    widget: DashboardWidget, 
    children: React.ReactNode, 
    isEditing: boolean, 
    onRemove: () => void,
    onResize: () => void,
    isZh: boolean
}> = ({ widget, children, isEditing, onRemove, onResize, isZh }) => {
    const colSpanClass = {
        'small': 'col-span-1',
        'medium': 'col-span-1 md:col-span-2',
        'large': 'col-span-1 md:col-span-3',
        'full': 'col-span-full'
    }[widget.gridSize || 'small'];

    return (
        <div className={`${colSpanClass} glass-card rounded-[2.5rem] border border-white/10 relative group h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 ${isEditing ? 'ring-2 ring-celestial-gold/50 ring-dashed animate-pulse bg-celestial-gold/5' : ''}`}>
            {isEditing && (
                <div className="absolute top-5 right-5 flex gap-2 z-30 animate-fade-in">
                    <button onClick={onResize} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md border border-white/20 transition-all active:scale-90" title={isZh ? "調整大小" : "Resize"}><Maximize2 className="w-4 h-4" /></button>
                    <button onClick={onRemove} className="p-2.5 bg-rose-500/20 hover:bg-rose-500/40 rounded-xl text-rose-400 backdrop-blur-md border border-rose-500/30 transition-all active:scale-90" title={isZh ? "移除" : "Remove"}><Trash2 className="w-4 h-4" /></button>
                </div>
            )}
            {children}
        </div>
    );
};

const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export const MyEsg: React.FC<MyEsgProps> = ({ language, onNavigate }) => {
  const { 
      userName, xp, level, quests, todos, addTodo, toggleTodo, deleteTodo,
      myEsgWidgets, addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize, goodwillBalance,
      esgScores, journal, bio, personalGoal, roleTitle
  } = useCompany();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const isZh = language === 'zh-TW';

  // Fix: Added handleResize to cycle through grid sizes
  const handleResize = (id: string, currentSize: 'small' | 'medium' | 'large' | 'full' | undefined) => {
    const sizes: ('small' | 'medium' | 'large' | 'full')[] = ['small', 'medium', 'large', 'full'];
    const currentIndex = sizes.indexOf(currentSize || 'small');
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    updateMyEsgWidgetSize(id, nextSize);
  };

  const widgetCatalog: { type: WidgetType, title: string, titleEn: string, icon: any, desc: string }[] = [
      { type: 'profile', title: '個人資訊', titleEn: 'Profile Card', icon: UserIcon, desc: '顯示您的等級、XP 與個人目標。' },
      { type: 'kpi_card', title: '關鍵永續指標', titleEn: 'KPI Card', icon: Activity, desc: '即時監測 ESG 綜合評分。' },
      { type: 'quest_list', title: '每日策略任務', titleEn: 'Quests', icon: Target, desc: '完成任務提升 XP 並累積善向幣。' },
      { type: 'quick_note', title: '永續待辦清單', titleEn: 'To-Do List', icon: ListTodo, desc: '快速記錄策略想法與行動草案。' },
      { type: 'yang_bo_feed', title: '楊博戰略週報', titleEn: 'Thoth Insights', icon: Crown, desc: '獲取楊博博士的核心洞察。' },
      { type: 'event_list', title: '系統行為日誌', titleEn: 'Event Log', icon: Calendar, desc: '追蹤系統操作紀錄。' },
  ];

  const renderWidgetContent = (widget: DashboardWidget) => {
      switch (widget.type) {
          case 'profile':
              const nextLevelXp = 1000;
              const currentXpInLevel = xp % 1000;
              const progress = (currentXpInLevel / nextLevelXp) * 100;
              return (
                  <div className="p-8 h-full flex flex-col justify-between">
                      <div className="flex items-start gap-6">
                          <div className="relative">
                              <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-celestial-purple to-celestial-emerald shadow-lg">
                                  <img 
                                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`} 
                                      alt="Avatar" 
                                      className="w-full h-full rounded-[1.2rem] bg-slate-900 object-cover" 
                                  />
                              </div>
                              <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-white/20 rounded-full px-2 py-0.5 text-[9px] font-black text-white shadow-xl">
                                  LV.{level}
                              </div>
                          </div>
                          <div className="min-w-0">
                              <h4 className="text-xl font-black text-white truncate mb-1">{userName}</h4>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-black text-celestial-gold uppercase border border-white/5">{roleTitle}</span>
                              </div>
                              <p className="text-[11px] text-gray-400 line-clamp-2 italic font-medium leading-relaxed">"{bio}"</p>
                          </div>
                      </div>
                      <div className="mt-8 space-y-4">
                          <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                  <span>{isZh ? '等級進度' : 'Level Progress'}</span>
                                  <span className="text-white">{currentXpInLevel} / {nextLevelXp} XP</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-celestial-purple via-celestial-emerald to-celestial-emerald transition-all duration-1000" style={{ width: `${progress}%` }} />
                              </div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                              <Target className="w-4 h-4 text-emerald-400" />
                              <div className="min-w-0">
                                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{isZh ? '當前目標' : 'Active Goal'}</div>
                                  <div className="text-[10px] text-gray-300 font-bold truncate">{personalGoal}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'kpi_card':
              return (
                  <div className="p-8 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-celestial-emerald/15 rounded-2xl text-celestial-emerald"><Activity className="w-6 h-6"/></div>
                          <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{widget.title}</span>
                      </div>
                      <div className="text-5xl font-black text-white tracking-tighter mb-2">{esgScores.environmental}</div>
                      <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{isZh ? '環境績效綜合評分' : 'Current Env Performance'}</div>
                  </div>
              );
          case 'quest_list':
              return (
                  <div className="p-8 h-full flex flex-col">
                      <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-celestial-purple" /> {widget.title}</h4>
                      <div className="space-y-3.5 flex-1 overflow-y-auto no-scrollbar">
                          {quests.slice(0, 3).map(q => (
                              <div key={q.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.2rem] border border-white/5 group/q cursor-pointer hover:bg-white/10 transition-all">
                                  <div className="w-2.5 h-2.5 rounded-full bg-celestial-gold animate-pulse" />
                                  <span className="text-sm font-bold text-gray-300 truncate flex-1 group-hover/q:text-white transition-colors">{q.title}</span>
                                  <span className="text-[10px] font-black text-celestial-purple bg-purple-500/10 px-2 py-0.5 rounded-full">+{q.xp} XP</span>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'quick_note':
              return (
                  <div className="p-8 h-full flex flex-col">
                      <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ListTodo className="w-5 h-5 text-blue-400" /> {widget.title}</h4>
                      <div className="flex gap-2 mb-6">
                          <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder={isZh ? "新增策略待辦..." : "Add to-do..."} className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" onKeyDown={e => e.key === 'Enter' && addTodo(newTodo)} />
                          <button onClick={() => { addTodo(newTodo); setNewTodo(''); }} className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"><Plus className="w-5 h-5" /></button>
                      </div>
                      <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1">
                          {todos.slice(0, 4).map(t => (
                              <div key={t.id} className="flex items-center gap-3 text-sm group/t px-1">
                                  <button onClick={() => toggleTodo(t.id)} className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${t.done ? 'bg-blue-500 border-blue-500' : 'border-white/20 hover:border-blue-400'}`}>
                                      {t.done && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                  </button>
                                  <span className={`flex-1 truncate font-medium ${t.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{t.text}</span>
                                  <button onClick={() => deleteTodo(t.id)} className="opacity-0 group-hover/t:opacity-100 p-1 text-gray-600 hover:text-rose-500 transition-all"><X className="w-4 h-4"/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'yang_bo_feed':
            return (
                <div className="p-8 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Crown className="w-5 h-5 text-celestial-gold" />
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{widget.title}</span>
                        </div>
                        <h5 className="text-lg font-black text-white leading-snug mb-3">{isZh ? '歐盟 CSDDD 實務對策：從合規到供應鏈議價權。' : 'CSDDD Strategies.'}</h5>
                        <p className="text-sm text-gray-400 line-clamp-3 italic opacity-80 leading-relaxed">{isZh ? '利用 AI 進行預判式稽核，可以提前發現潛在風險，將其轉化為供應鏈協作的價值點。' : 'Predictive auditing identifies risks early.'}</p>
                    </div>
                    <button onClick={() => onNavigate(View.YANG_BO)} className="mt-6 text-[11px] font-black text-celestial-gold uppercase flex items-center gap-2 hover:underline group">
                        {isZh ? '進入楊博週報專區' : 'Read Full Report'} 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            );
          case 'event_list':
              return (
                  <div className="p-8 h-full flex flex-col">
                      <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-400" /> {widget.title}</h4>
                      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                          {journal.slice(0, 3).map(entry => (
                              <div key={entry.id} className="flex gap-3 items-start p-3 bg-white/5 rounded-2xl border border-white/5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                  <div>
                                      <div className="text-[10px] font-mono text-gray-600 mb-0.5">{new Date(entry.timestamp).toLocaleDateString()}</div>
                                      <div className="text-xs font-bold text-white leading-tight">{entry.title}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          default:
              return (
                  <div className="p-8 h-full flex flex-col items-center justify-center text-gray-700 opacity-40">
                      <Layout className="w-10 h-10 mb-3" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{widget.title}</span>
                  </div>
              );
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 relative">
        <UniversalPageHeader 
            icon={VIEW_METADATA[View.MY_ESG].icon}
            title={{ zh: '個人永續戰情室', en: 'Personal ESG Cockpit' }}
            description={{ zh: '高度自定義的成長看板：整合學習進度、策略任務與即時數據分析。', en: 'Highly customizable cockpit: integrating learning, tasks, and analytics.' }}
            language={language}
            tag={{ zh: '個人核心', en: 'Personal Core' }}
            accentColor="text-amber-500"
        />

        <div className="flex justify-between items-center mb-4 gap-6 -mt-16 relative z-10">
            <div className="flex gap-4">
                <div className="px-6 py-3 liquid-glass rounded-3xl flex items-center gap-4 border border-white/5 group hover:border-celestial-purple/30 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-celestial-purple/15 flex items-center justify-center text-celestial-purple border border-celestial-purple/25 group-hover:scale-110 transition-transform"><Sparkles className="w-5 h-5" /></div>
                    <div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{isZh ? '總部經驗 (XP)' : 'Total XP'}</div>
                        <div className="text-sm font-black text-white">{xp.toLocaleString()}</div>
                    </div>
                </div>
                <div className="px-6 py-3 liquid-glass rounded-3xl flex items-center gap-4 border border-white/5 group hover:border-rose-500/30 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-400 border border-rose-500/25 group-hover:scale-110 transition-transform"><Coins className="w-5 h-5" /></div>
                    <div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{isZh ? '善向幣 (GWC)' : 'GWC Balance'}</div>
                        <div className="text-sm font-black text-white">{goodwillBalance.toLocaleString()}</div>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => { setIsEditing(!isEditing); setShowCatalog(false); }} 
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-xl backdrop-blur-xl border border-white/10 uppercase tracking-widest ${isEditing ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
            >
                <Edit3 className="w-4 h-4" />
                {isEditing ? (isZh ? '儲存配置' : 'Save Layout') : (isZh ? '自定義戰情室' : 'Customize')}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 grid-flow-dense auto-rows-[minmax(250px,auto)]">
            <div className="col-span-1 md:col-span-2 lg:col-span-4 min-h-[300px]">
                <BerkeleyHeroBanner isZh={isZh} onNavigate={onNavigate} />
            </div>
            {myEsgWidgets.map(widget => (
                <WidgetContainer key={widget.id} widget={widget} isEditing={isEditing} isZh={isZh} onRemove={() => removeMyEsgWidget(widget.id)} onResize={() => handleResize(widget.id, widget.gridSize)}>
                    {renderWidgetContent(widget)}
                </WidgetContainer>
            ))}
        </div>
    </div>
  );
};
