
import React, { useState } from 'react';
import { 
  CheckSquare, Crown, ListTodo, Plus, Layout, Trash2, Edit3, Grid, X, ArrowRight, Target, Users, Award, Maximize2, Minimize2, Calendar, Lightbulb
} from 'lucide-react';
import { Language, View, DashboardWidget, WidgetType } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';

interface MyEsgProps {
  language: Language;
  onNavigate: (view: View) => void;
}

// ... (Rest of component implementations: BerkeleyHeroBanner, WidgetContainer) ...
const BerkeleyHeroBanner: React.FC<{ isZh: boolean, onNavigate: (view: View) => void }> = ({ isZh, onNavigate }) => (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 border border-celestial-gold/30 group cursor-pointer h-full min-h-[220px]" onClick={() => onNavigate(View.ACADEMY)}>
        <div className="absolute inset-0">
            <img src="https://thumbs4.imagebam.com/12/1d/de/ME18KXOE_t.jpg" className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500" alt="Berkeley Course" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        <div className="relative z-10 p-8 flex flex-col justify-center h-full gap-4">
            <div>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-celestial-gold text-black text-[10px] font-bold rounded-full uppercase tracking-wider">Dual Cert</span>
                    <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/20">Berkeley IBI</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {isZh ? 'Berkeley 國際永續策略創新師' : 'Berkeley International ESG Strategy Innovator'}
                </h2>
                <div className="flex gap-4 mt-2 text-xs text-gray-300">
                    <div className="flex items-center gap-1"><Target className="w-3 h-3 text-celestial-gold"/> Strategy Blueprint</div>
                    <div className="flex items-center gap-1"><Award className="w-3 h-3 text-emerald-400"/> Dual Certificates</div>
                </div>
            </div>
            <button className="self-start px-5 py-2 bg-celestial-gold hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2 group/btn">
                {isZh ? '立即報名' : 'Register Now'}
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
);

const WidgetContainer: React.FC<{ 
    widget: DashboardWidget, 
    children: React.ReactNode, 
    isEditing: boolean, 
    onRemove: () => void,
    onResize: () => void
}> = ({ widget, children, isEditing, onRemove, onResize }) => {
    const colSpanClass = {
        'small': 'col-span-1',
        'medium': 'col-span-1 md:col-span-2',
        'large': 'col-span-1 md:col-span-3',
        'full': 'col-span-full'
    }[widget.gridSize || 'small'];

    return (
        <div className={`${colSpanClass} glass-panel rounded-2xl border border-white/10 relative group h-full flex flex-col transition-all duration-300 overflow-hidden ${isEditing ? 'border-dashed border-celestial-gold/30 bg-celestial-gold/5' : ''}`}>
            {isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button onClick={onResize} className="p-1 bg-white/10 hover:bg-white/20 rounded text-white" title="Resize">
                        {widget.gridSize === 'small' ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </button>
                    <button onClick={onRemove} className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400" title="Remove">
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            )}
            {children}
        </div>
    );
};

export const MyEsg: React.FC<MyEsgProps> = ({ language, onNavigate }) => {
  const { 
      userName, companyName, xp, level, quests, completeQuest, todos, addTodo, toggleTodo, deleteTodo,
      myEsgWidgets, addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize 
  } = useCompany();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  
  const isZh = language === 'zh-TW';

  const pageData = {
      title: { zh: '我的 ESG (My ESG)', en: 'My ESG Cockpit' },
      desc: { zh: '您的個人化永續戰情室與成長中心', en: 'Your personalized sustainability command center.' },
      tag: { zh: '個人核心', en: 'Personal Core' }
  };

  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim()) return;
      addTodo(newTodo);
      setNewTodo('');
      addToast('success', isZh ? '待辦事項已新增' : 'Todo Added', 'My ESG');
  };

  const cycleSize = (current: string | undefined): 'small' | 'medium' | 'large' => {
      if (current === 'small') return 'medium';
      if (current === 'medium') return 'large';
      return 'small';
  };

  // ... (Widget Renderers remain same) ...
  const renderProfileWidget = (size: 'small' | 'medium' | 'large' | 'full' = 'small') => {
      if (size === 'small') {
          return (
              <div className="p-4 flex flex-col items-center justify-center h-full text-center relative group/profile cursor-pointer" onClick={() => onNavigate(View.SETTINGS)}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-celestial-purple to-blue-500 p-[2px] mb-3 group-hover/profile:scale-105 transition-transform">
                      <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full rounded-full bg-slate-900" />
                  </div>
                  <h3 className="text-sm font-bold text-white truncate w-full px-2">{userName}</h3>
                  <div className="text-[10px] text-celestial-gold mt-1 bg-celestial-gold/10 px-2 py-0.5 rounded-full border border-celestial-gold/20">
                      Lv.{level}
                  </div>
                  <div className="w-2/3 h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-celestial-purple w-3/4" />
                  </div>
              </div>
          );
      }
      return (
          <div className="p-6 flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-celestial-purple to-blue-500 p-[2px]">
                      <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full rounded-full bg-slate-900" />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white">{userName}</h3>
                      <p className="text-sm text-gray-400">{companyName}</p>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-2xl font-bold text-celestial-gold">{xp.toLocaleString()} XP</div>
                  <div className="text-xs text-gray-400">Level {level}</div>
              </div>
          </div>
      );
  };

  const renderQuestsWidget = () => (
      <div className="p-4 flex flex-col h-full">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-celestial-gold" />
              {isZh ? '每日任務' : 'Daily Quests'}
          </h3>
          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
              {quests.map(quest => (
                  <div key={quest.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <div className={`p-1.5 rounded-md shrink-0 ${quest.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}`}>
                              <CheckSquare className="w-3 h-3" />
                          </div>
                          <div className="min-w-0">
                              <div className={`text-xs font-medium truncate ${quest.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{quest.title}</div>
                          </div>
                      </div>
                      {quest.status !== 'completed' && (
                          <button 
                              onClick={() => completeQuest(quest.id, quest.xp)}
                              className="px-2 py-0.5 bg-celestial-purple/20 text-celestial-purple text-[10px] font-bold rounded hover:bg-celestial-purple/30 transition-all shrink-0"
                          >
                              Claim
                          </button>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderTodoWidget = () => (
      <div className="p-4 flex flex-col h-full">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-emerald-400" />
              {isZh ? '待辦清單' : 'To-Do List'}
          </h3>
          
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-3">
              <input 
                  type="text" 
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder={isZh ? "新增..." : "Add..."}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
              <button type="submit" className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
                  <Plus className="w-3 h-3" />
              </button>
          </form>

          <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
              {todos.length === 0 && <div className="text-center text-[10px] text-gray-500 py-4">{isZh ? '無待辦事項' : 'No tasks'}</div>}
              {todos.map(todo => (
                  <div key={todo.id} className="group flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                          <button onClick={() => toggleTodo(todo.id)} className={`w-3 h-3 rounded border flex items-center justify-center ${todo.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500'}`}>
                              {todo.done && <Plus className="w-2 h-2 text-black rotate-45" />}
                          </button>
                          <span className={`text-xs ${todo.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{todo.text}</span>
                      </div>
                      <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderYangBoWidget = () => (
      <div className="p-5 flex flex-col h-full bg-gradient-to-br from-celestial-gold/5 to-transparent relative group overflow-hidden" onClick={() => onNavigate(View.YANG_BO)}>
          <div className="absolute top-0 right-0 p-3 opacity-10">
              <Crown className="w-16 h-16 text-celestial-gold" />
          </div>
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 relative z-10">
              <Crown className="w-4 h-4 text-celestial-gold" />
              {isZh ? '楊博專區' : 'Yang Bo Zone'}
          </h3>
          <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                  <div className="text-[10px] text-celestial-gold uppercase font-bold tracking-wider mb-1">Latest Insight</div>
                  <h4 className="text-sm font-bold text-white leading-tight mb-2 group-hover:text-celestial-gold transition-colors">
                      {isZh ? 'EP.24: 碳焦慮時代的生存指南' : 'EP.24: Survival in Carbon Anxiety Era'}
                  </h4>
                  <p className="text-[10px] text-gray-400 line-clamp-2">
                      {isZh ? '深入探討中小企業如何面對來自品牌商的減碳壓力。' : 'How SMEs can handle decarbonization pressure.'}
                  </p>
              </div>
              <div className="flex gap-2 mt-3">
                  <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">Podcast</span>
                  <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">Strategy</span>
              </div>
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="w-4 h-4 text-celestial-gold" />
          </div>
      </div>
  );

  const renderEventsWidget = () => (
      <div className="p-4 flex flex-col h-full">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-celestial-purple" />
              {isZh ? '最新活動' : 'Latest Activities'}
          </h3>
          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
              {[
                  { title: isZh ? '永續長早餐會' : 'CSO Breakfast', date: 'Jun 15', type: 'Networking' },
                  { title: isZh ? '供應鏈工作坊' : 'Supply Chain Workshop', date: 'Jun 22', type: 'Workshop' },
                  { title: isZh ? 'Net Positive 共讀' : 'Reading Club', date: 'Jun 28', type: 'Book Club' },
              ].map((evt, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => onNavigate(View.ACADEMY)}>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-celestial-purple/10 rounded min-w-[40px] border border-celestial-purple/20">
                          <span className="text-[9px] font-bold text-celestial-purple uppercase">{evt.date.split(' ')[0]}</span>
                          <span className="text-xs font-bold text-white">{evt.date.split(' ')[1]}</span>
                      </div>
                      <div className="min-w-0">
                          <div className="text-[10px] text-gray-400 mb-0.5 truncate">{evt.type}</div>
                          <h4 className="text-xs font-bold text-white truncate">{evt.title}</h4>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderWidgetContent = (widget: DashboardWidget) => {
      switch(widget.type) {
          case 'kpi_card': return renderProfileWidget(widget.gridSize); 
          case 'quest_list': return renderQuestsWidget();
          case 'quick_note': return renderTodoWidget(); 
          case 'yang_bo_feed': return renderYangBoWidget();
          case 'event_list': return renderEventsWidget();
          default: return <div className="p-4 text-xs">Unknown Widget</div>;
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
        <UniversalPageHeader 
            icon={Layout}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
            accentColor="text-amber-400"
        />

        {/* Edit Toggle Bar */}
        <div className="flex justify-end items-center mb-2 gap-4 -mt-16 relative z-10">
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditing ? 'bg-celestial-gold text-black shadow-lg' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
            >
                <Edit3 className="w-3 h-3" />
                {isEditing ? (isZh ? '完成編輯' : 'Done Editing') : (isZh ? '自訂版面' : 'Customize')}
            </button>
            {isEditing && (
                <button 
                    onClick={() => setShowCatalog(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-celestial-purple text-white shadow-lg transition-all animate-pulse"
                >
                    <Plus className="w-3 h-3" />
                    {isZh ? '新增' : 'Add'}
                </button>
            )}
        </div>

        {/* Hero Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-dense auto-rows-[minmax(180px,auto)]">
            <div className="col-span-1 md:col-span-2 lg:col-span-4 min-h-[220px]">
                <BerkeleyHeroBanner isZh={isZh} onNavigate={onNavigate} />
            </div>

            {myEsgWidgets.map(widget => (
                <WidgetContainer 
                    key={widget.id} 
                    widget={widget} 
                    isEditing={isEditing}
                    onRemove={() => removeMyEsgWidget(widget.id)}
                    onResize={() => updateMyEsgWidgetSize(widget.id, cycleSize(widget.gridSize))}
                >
                    {renderWidgetContent(widget)}
                </WidgetContainer>
            ))}
            
            {/* Add Placeholder in Edit Mode */}
            {isEditing && (
                <div 
                    onClick={() => setShowCatalog(true)}
                    className="col-span-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 cursor-pointer transition-all h-full bg-white/5 min-h-[180px]"
                >
                    <Grid className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold">{isZh ? '新增小工具' : 'Add Widget'}</span>
                </div>
            )}
        </div>

        {/* Widget Catalog Modal */}
        {showCatalog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Grid className="w-5 h-5 text-celestial-gold" />
                            {isZh ? '小工具目錄' : 'Widget Catalog'}
                        </h3>
                        <button onClick={() => setShowCatalog(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => { addMyEsgWidget({ type: 'kpi_card', title: 'Profile', gridSize: 'small' }); setShowCatalog(false); }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-purple/10 hover:border-celestial-purple/30 transition-all text-left group"
                        >
                            <div className="p-2.5 rounded-lg bg-celestial-purple/20 text-celestial-purple">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Profile Card</div>
                                <div className="text-xs text-gray-400">Stats & Level (Small)</div>
                            </div>
                            <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                        </button>

                        <button 
                            onClick={() => { addMyEsgWidget({ type: 'yang_bo_feed', title: 'Yang Bo Zone', gridSize: 'medium' }); setShowCatalog(false); }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-gold/10 hover:border-celestial-gold/30 transition-all text-left group"
                        >
                            <div className="p-2.5 rounded-lg bg-celestial-gold/20 text-celestial-gold">
                                <Crown className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Yang Bo Insights</div>
                                <div className="text-xs text-gray-400">Strategy Feed (Medium)</div>
                            </div>
                            <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                        </button>

                        <button 
                            onClick={() => { addMyEsgWidget({ type: 'event_list', title: 'Events', gridSize: 'medium' }); setShowCatalog(false); }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-purple/10 hover:border-celestial-purple/30 transition-all text-left group"
                        >
                            <div className="p-2.5 rounded-lg bg-celestial-purple/20 text-celestial-purple">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Latest Events</div>
                                <div className="text-xs text-gray-400">Activities (Medium)</div>
                            </div>
                            <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                        </button>

                        <button 
                            onClick={() => { addMyEsgWidget({ type: 'quest_list', title: 'Daily Quests', gridSize: 'small' }); setShowCatalog(false); }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-gold/10 hover:border-celestial-gold/30 transition-all text-left group"
                        >
                            <div className="p-2.5 rounded-lg bg-celestial-gold/20 text-celestial-gold">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Quests List</div>
                                <div className="text-xs text-gray-400">Daily Tasks (Small)</div>
                            </div>
                            <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                        </button>

                        <button 
                            onClick={() => { addMyEsgWidget({ type: 'quick_note', title: 'To-Do', gridSize: 'small' }); setShowCatalog(false); }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left group"
                        >
                            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <ListTodo className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">To-Do List</div>
                                <div className="text-xs text-gray-400">Quick Tasks (Small)</div>
                            </div>
                            <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
