
import React from 'react';
import { Language } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { Book, TrendingUp, Award, Zap, Clock, Activity } from 'lucide-react';

interface UserJournalProps {
  language: Language;
}

export const UserJournal: React.FC<UserJournalProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { journal, xp, level } = useCompany();

  // Simple stats calculation
  const totalImpact = journal.length;
  const milestones = journal.filter(j => j.type === 'milestone').length;
  const xpGained = journal.reduce((acc, curr) => acc + curr.xpGained, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                <Book className="w-8 h-8 text-celestial-purple" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{isZh ? '使用者日誌' : 'User Journal'}</h2>
                <p className="text-gray-400">{isZh ? '您的永續成長與影響力足跡' : 'Your sustainability growth and impact footprint'}</p>
            </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400"><TrendingUp className="w-6 h-6"/></div>
                <div>
                    <div className="text-2xl font-bold text-white">{totalImpact}</div>
                    <div className="text-xs text-gray-400">{isZh ? '總影響力事件' : 'Total Impact Events'}</div>
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-celestial-gold/10 rounded-full text-celestial-gold"><Award className="w-6 h-6"/></div>
                <div>
                    <div className="text-2xl font-bold text-white">{milestones}</div>
                    <div className="text-xs text-gray-400">{isZh ? '達成里程碑' : 'Milestones Achieved'}</div>
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-400"><Zap className="w-6 h-6"/></div>
                <div>
                    <div className="text-2xl font-bold text-white">Lv. {level}</div>
                    <div className="text-xs text-gray-400">{isZh ? '當前等級' : 'Current Level'}</div>
                </div>
            </div>
        </div>

        {/* Timeline */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 relative">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <Activity className="w-5 h-5 text-celestial-blue" />
                {isZh ? '成長軌跡' : 'Growth Timeline'}
            </h3>
            
            <div className="absolute left-8 top-20 bottom-8 w-0.5 bg-white/10" />

            <div className="space-y-8">
                {journal.map((entry, idx) => (
                    <div key={entry.id} className="relative pl-12 group">
                        {/* Timeline Node */}
                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transform -translate-x-[7px] bg-slate-900 transition-colors
                            ${entry.type === 'milestone' ? 'border-celestial-gold shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 
                              entry.type === 'insight' ? 'border-celestial-purple' : 'border-emerald-500'}
                        `} />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                                {entry.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`text-lg font-bold mb-1 ${entry.type === 'milestone' ? 'text-celestial-gold' : 'text-white'}`}>
                                        {entry.title}
                                    </h4>
                                    <p className="text-sm text-gray-300">{entry.impact}</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-400">+{entry.xpGained} XP</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
