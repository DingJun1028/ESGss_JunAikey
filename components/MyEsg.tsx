
import React, { useState } from 'react';
import { 
  CheckSquare, Crown, ListTodo, Plus, Trash2, Edit3, Grid, X, ArrowRight, Target, Award, Maximize2, Minimize2, Calendar, Coins
} from 'lucide-react';
import { Language, View, DashboardWidget } from '../types';
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
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 border border-amber-500/30 group cursor-pointer h-full min-h-[220px]" onClick={() => onNavigate(View.ACADEMY)}>
        <div className="absolute inset-0">
            <img src="https://thumbs4.imagebam.com/12/1d/de/ME18KXOE_t.jpg" className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500" alt="Berkeley Course" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        <div className="relative z-10 p-8 flex flex-col justify-center h-full gap-4">
            <div>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-full uppercase tracking-wider">Dual Cert</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {isZh ? 'Berkeley 國際永續策略創新師' : 'Berkeley International ESG Strategy Innovator'}
                </h2>
            </div>
            <button className="self-start px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2 group/btn">
                {isZh ? '我要報名' : 'Register Now'}
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
        <div className={`${colSpanClass} glass-panel rounded-2xl border border-white/10 relative group h-full flex flex-col transition-all duration-300 overflow-hidden ${isEditing ? 'border-dashed border-amber-500/30 bg-amber-500/5' : ''}`}>
            {isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button onClick={onResize} className="p-1 bg-white/10 hover:bg-white/20 rounded text-white"><Maximize2 className="w-3 h-3" /></button>
                    <button onClick={onRemove} className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"><Trash2 className="w-3 h-3" /></button>
                </div>
            )}
            {children}
        </div>
    );
};

export const MyEsg: React.FC<MyEsgProps> = ({ language, onNavigate }) => {
  const { 
      userName, xp, level, quests, completeQuest, todos, addTodo, toggleTodo, deleteTodo,
      myEsgWidgets, removeMyEsgWidget, updateMyEsgWidgetSize, goodwillBalance,
      esgScores, carbonData
  } = useCompany();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const isZh = language === 'zh-TW';

  // 從統一元數據獲取圖標與配色
  const homeMeta = VIEW_METADATA[View.MY_ESG];
  const diagMeta = VIEW_METADATA[View.DIAGNOSTICS];
  const carbonMeta = VIEW_METADATA[View.CARBON];
  const academyMeta = VIEW_METADATA[View.ACADEMY];
  const dashboardMeta = VIEW_METADATA[View.DASHBOARD];

  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim()) return;
      addTodo(newTodo);
      setNewTodo('');
      addToast('success', isZh ? '待辦事項已新增' : 'Todo Added', 'My ESG');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
        <UniversalPageHeader 
            icon={homeMeta.icon}
            title={{ zh: '我的 ESG', en: 'My ESG Cockpit' }}
            description={{ zh: '您的個人化永續戰情室與成長中心', en: 'Your personalized sustainability command center.' }}
            language={language}
            tag={{ zh: '個人核心', en: 'Personal Core' }}
            accentColor="text-amber-500"
        />

        <div className="flex justify-end items-center mb-2 gap-4 -mt-16 relative z-10">
            <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditing ? 'bg-amber-500 text-black shadow-lg' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}>
                <Edit3 className="w-3 h-3" />
                {isEditing ? (isZh ? '完成編輯' : 'Done Editing') : (isZh ? '自訂版面' : 'Customize')}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <OmniEsgCell mode="card" label="ESG Score" value={esgScores.environmental} color={diagMeta.color} icon={diagMeta.icon} />
            <OmniEsgCell mode="card" label="Carbon (tCO2e)" value={carbonData.scope1 + carbonData.scope2} color={carbonMeta.color} icon={carbonMeta.icon} />
            <OmniEsgCell mode="card" label="Social Score" value={esgScores.social} color={academyMeta.color} icon={academyMeta.icon} />
            <OmniEsgCell mode="card" label="Governance" value={esgScores.governance} color={dashboardMeta.color} icon={dashboardMeta.icon} />
        </div>

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
                    onResize={() => updateMyEsgWidgetSize(widget.id, 'small')}
                >
                    <div className="p-4 flex flex-col h-full">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                           {widget.title}
                        </h3>
                        <div className="flex-1 text-xs text-gray-500">Widget content...</div>
                    </div>
                </WidgetContainer>
            ))}
        </div>
    </div>
  );
};
