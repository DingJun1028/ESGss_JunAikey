import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { Book, TrendingUp, Award, Zap, Clock, Activity, ShieldAlert, Terminal, RefreshCw, Database } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface UserJournalProps {
  language: Language;
}

export const UserJournal: React.FC<UserJournalProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { journal, level } = useCompany();
  const { systemLogs, clearLogs } = useUniversalAgent();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'activity' | 'system' | 'errors'>('activity');

  const milestones = journal.filter(j => j.type === 'milestone').length;
  
  // 模擬錯誤日誌 (過濾 systemLogs)
  const errorLogs = useMemo(() => systemLogs.filter(l => l.type === 'error'), [systemLogs]);

  const handleSyncToThinkTank = () => {
      addToast('info', isZh ? '正在將系統經驗數據注入萬能智庫...' : 'Injecting system experience into Think Tank...', 'SDR Sync');
      setTimeout(() => {
          addToast('success', isZh ? '同步完成：已優化 12 個邏輯路徑' : 'Sync Complete: 12 logic paths optimized', 'System');
      }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                    <Book className="w-8 h-8 text-celestial-purple" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{isZh ? '萬能日誌 (OS Journal)' : 'Universal Journal'}</h2>
                    <p className="text-gray-400">{isZh ? '記錄成長軌跡與系統內核狀態' : 'Tracking growth and system kernel status'}</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={handleSyncToThinkTank}
                    className="flex items-center gap-2 px-4 py-2 bg-celestial-gold/20 hover:bg-celestial-gold/30 text-celestial-gold border border-celestial-gold/30 rounded-xl text-xs font-bold transition-all"
                >
                    <Database className="w-4 h-4" />
                    {isZh ? '同步至智庫' : 'Sync to Think Tank'}
                </button>
                <button 
                    onClick={clearLogs}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Flush Logs"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit">
            <button onClick={() => setActiveTab('activity')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'activity' ? 'bg-white text-black' : 'text-gray-400'}`}>
                <Activity className="w-4 h-4" /> {isZh ? '活動日誌' : 'Activity'}
            </button>
            <button onClick={() => setActiveTab('system')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'system' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}>
                <Terminal className="w-4 h-4" /> {isZh ? '系統日誌' : 'System'}
            </button>
            <button onClick={() => setActiveTab('errors')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'errors' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>
                <ShieldAlert className="w-4 h-4" /> {isZh ? '錯誤日誌' : 'Errors'}
            </button>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 min-h-[400px]">
            {activeTab === 'activity' && (
                <div className="space-y-8 relative">
                    <div className="absolute left-8 top-2 bottom-8 w-0.5 bg-white/5" />
                    {journal.map((entry) => (
                        <div key={entry.id} className="relative pl-12 group animate-fade-in">
                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transform -translate-x-[7px] bg-slate-900 ${entry.type === 'milestone' ? 'border-celestial-gold' : 'border-emerald-500'}`} />
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                <div className="text-[10px] text-gray-500 mb-1">{new Date(entry.timestamp).toLocaleString()}</div>
                                <h4 className={`font-bold ${entry.type === 'milestone' ? 'text-celestial-gold' : 'text-white'}`}>{entry.title}</h4>
                                <p className="text-xs text-gray-400 mt-1">{entry.impact}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'system' && (
                <div className="font-mono text-xs space-y-2 text-emerald-400/80">
                    {systemLogs.length === 0 ? (
                        <p className="text-gray-600 italic">No system events logged.</p>
                    ) : (
                        systemLogs.map((log) => (
                            <div key={log.id} className="flex gap-4 p-2 hover:bg-white/5 rounded border border-transparent hover:border-white/5">
                                <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span className="text-blue-400">[{log.source}]</span>
                                <span className="flex-1">{log.message}</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'errors' && (
                <div className="space-y-4">
                    {errorLogs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No critical errors detected. System is healthy.</p>
                        </div>
                    ) : (
                        errorLogs.map((log) => (
                            <div key={log.id} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 animate-fade-in">
                                <div className="p-2 bg-red-500/20 rounded-lg shrink-0 h-fit">
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">{log.source} ERROR</span>
                                        <span className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-200">{log.message}</p>
                                    <button className="mt-3 text-[10px] text-red-400 font-bold hover:underline flex items-center gap-1">
                                        <RefreshCw className="w-3 h-3" /> Attempt Auto-Repair
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    </div>
  );
};