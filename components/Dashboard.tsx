
import React, { useState, useEffect, useMemo } from 'react';
import { getMockMetrics, TRANSLATIONS } from '../constants';
import { Wind, Activity, FileText, Zap, BrainCircuit, LayoutTemplate, Plus, Trash2, Grid, X, Globe, Map as MapIcon, ScanLine, FileCheck, Triangle, Sparkles, Sun, Loader2, ArrowUpRight, LayoutDashboard, Download } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import { Language, DashboardWidget, WidgetType } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { ChartSkeleton } from './ChartSkeleton';
import { useToast } from '../contexts/ToastContext';
import { analyzeDataAnomaly } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { GlobalOperations } from './GlobalOperations';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface DashboardProps {
  language: Language;
}

// ... (Widget Renderers remain same) ...
const MainChartWidget: React.FC<{ data: any[], onExport: () => void }> = React.memo(({ data, onExport }) => (
  <div style={{ width: '100%', height: 250 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
          itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
        />
        <Area type="monotone" dataKey="value" name="Current" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)">
          <LabelList dataKey="value" position="top" fill="#10b981" fontSize={10} formatter={(val: number) => val.toFixed(0)} />
        </Area>
        <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBase)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
));

const FeedWidget: React.FC<{ handleAiAnalyze: (label: string) => void }> = React.memo(({ handleAiAnalyze }) => (
  <div className="space-y-2 flex-1 overflow-hidden">
      <OmniEsgCell id="feed-energy" mode="list" label="Energy Anomaly" value="+15%" color="gold" icon={Zap} traits={['gap-filling']} subValue="Plant B • 2m ago" onAiAnalyze={() => handleAiAnalyze('Energy')} />
      <OmniEsgCell id="feed-goal" mode="list" label="Q2 Goal Met" value="Done" color="emerald" icon={Activity} traits={['performance']} subValue="Water Reduction" />
      <OmniEsgCell id="feed-csrd" mode="list" label="EU CSRD Update" value="New" color="purple" icon={FileText} traits={['learning']} subValue="Regulatory Bot" dataLink="ai" onAiAnalyze={() => handleAiAnalyze('CSRD')} />
  </div>
));

const IdpScannerWidget: React.FC<{ language: Language, isLoading: boolean }> = ({ language, isLoading }) => {
    const [scanText, setScanText] = useState('INITIALIZING...');
    
    useEffect(() => {
        if (isLoading) return;
        const phases = ["SCANNING...", "REFRACTION...", "DETECTING...", "EXTRACTING...", "INTERPRETATION: OK", "Scope 1: 420.5"];
        let phaseIndex = 0;
        const interval = setInterval(() => {
            setScanText(phases[phaseIndex]);
            phaseIndex = (phaseIndex + 1) % phases.length;
        }, 1500);
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div className="p-4 bg-slate-900/40 rounded-xl border border-white/5 relative overflow-hidden group/scan h-full flex flex-col justify-between shadow-lg hover:bg-slate-900/60 transition-all">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-celestial-emerald/10 rounded-lg border border-celestial-emerald/20">
                        <ScanLine className="w-3 h-3 text-celestial-emerald" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-white block leading-tight">{language === 'zh-TW' ? '智能文檔掃描' : 'IDP Scanner'}</span>
                        <span className="text-[9px] text-emerald-400 font-mono">v2.5 Active</span>
                    </div>
                </div>
            </div>
            
            <div className="relative flex-1 bg-black/40 rounded-lg border border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                <FileText className="w-8 h-8 text-gray-800 absolute opacity-50" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-celestial-emerald shadow-[0_0_15px_rgba(16,185,129,1)] animate-[scan_2s_linear_infinite]" />
                <div className="relative z-10 font-mono text-[9px] text-emerald-400 font-bold bg-black/80 px-2 py-0.5 rounded backdrop-blur-md border border-emerald-500/30 flex items-center gap-1">
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3 text-celestial-gold animate-pulse"/>}
                    {isLoading ? 'CALIBRATING...' : scanText}
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = TRANSLATIONS[language].dashboard;
  const metrics = useMemo(() => getMockMetrics(language), [language]);
  const { addToast } = useToast();
  const { customWidgets, addCustomWidget, removeCustomWidget, esgScores, totalScore, carbonData } = useCompany();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'executive' | 'global' | 'custom'>('executive');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const pageData = {
      title: { zh: '企業決策儀表板', en: 'Executive Dashboard' },
      desc: { zh: '即時監控關鍵 ESG 指標與全域運營狀態', en: 'Real-time monitoring of key ESG metrics and global operations.' },
      tag: { zh: '戰情核心', en: 'Ops Core' }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200); 
    return () => clearTimeout(timer);
  }, []);

  const getIcon = (color: string) => {
      switch(color) {
          case 'emerald': return Wind;
          case 'gold': return Activity;
          case 'purple': return FileText;
          case 'blue': return Zap;
          default: return Activity;
      }
  }

  const handleAiAnalyze = async (metricLabel: string) => {
      addToast('info', `AI Analyzing ${metricLabel}...`, 'Intelligence Orchestrator');
      setTimeout(() => addToast('success', 'Analysis Complete. Insights updated.', 'AI Analysis Finished'), 1500);
  };

  const handleExportChart = () => {
      addToast('success', 'Chart Exported to PDF', 'System');
  };

  const handleAddWidget = (type: WidgetType, title: string, config?: any, gridSize: 'small' | 'medium' | 'large' = 'small') => {
      addCustomWidget({ type, title, config, gridSize });
      addToast('success', `${title} added`, 'Customization');
      setIsCatalogOpen(false);
  };

  const liveMetrics = useMemo(() => metrics.map(m => {
      const labelText = typeof m.label === 'string' ? m.label : m.label.text;
      if (labelText.includes('ESG Score') || labelText.includes('ESG 評分')) return { ...m, value: totalScore.toString() };
      if (labelText.includes('Governance') || labelText.includes('治理')) return { ...m, value: esgScores.governance.toString() };
      if (labelText.includes('Scope 1')) return { ...m, value: carbonData.scope1.toString() };
      return m;
  }), [metrics, totalScore, esgScores, carbonData]);

  const dynamicChartData = useMemo(() => {
      const base = carbonData.scope1 + carbonData.scope2;
      return [
          { name: 'Jan', value: base * 1.1, baseline: 450 },
          { name: 'Feb', value: base * 1.05, baseline: 440 },
          { name: 'Mar', value: base * 1.15, baseline: 460 },
          { name: 'Apr', value: base * 0.95, baseline: 430 },
          { name: 'May', value: base * 0.9, baseline: 420 },
          { name: 'Jun', value: base * 0.85, baseline: 410 },
          { name: 'Jul', value: base * 0.8, baseline: 400 },
      ];
  }, [carbonData]);

  const renderExecutiveView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => <OmniEsgCell key={i} mode="card" loading={true} />)
          : liveMetrics.map((metric) => (
              <OmniEsgCell
                key={metric.id}
                id={metric.id}
                mode="card"
                label={metric.label}
                value={metric.value}
                subValue={t.vsLastMonth}
                color={metric.color}
                icon={getIcon(metric.color)}
                trend={{ value: metric.change, direction: metric.trend }}
                confidence="high"
                verified={true}
                traits={metric.traits}
                tags={metric.tags}
                dataLink={metric.dataLink}
                onAiAnalyze={() => handleAiAnalyze(typeof metric.label === 'string' ? metric.label : metric.label.text)}
              />
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/5 relative group overflow-hidden min-h-[300px] flex flex-col hover:border-white/10 transition-colors">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {t.chartTitle}
                  </h3>
                  <div className="flex gap-2">
                      <button onClick={handleExportChart} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Export Chart"><Download className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><BrainCircuit className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><ArrowUpRight className="w-4 h-4" /></button>
                  </div>
              </div>
              <div className="flex-1 w-full min-h-[220px]">
                 <MainChartWidget data={dynamicChartData} onExport={handleExportChart} />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 h-full">
            {/* Feed Widget */}
            <div className="glass-panel p-4 rounded-2xl relative flex flex-col border-white/5 flex-1 hover:bg-slate-900/60 transition-colors">
                <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-gray-400">{t.feedTitle}</h3>
                {isLoading ? <OmniEsgCell mode="list" loading={true} /> : <FeedWidget handleAiAnalyze={handleAiAnalyze} />}
            </div>

            {/* IDP Scanner - Optimized Height */}
            <div className="h-32 shrink-0">
               <IdpScannerWidget language={language} isLoading={isLoading} />
            </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-4 animate-fade-in relative">
      <UniversalPageHeader 
          icon={LayoutDashboard}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
          accentColor="text-emerald-400"
      />

      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-end items-end gap-4 mb-4 -mt-16 relative z-10">
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            {[
                { id: 'executive', icon: LayoutTemplate, label: language === 'zh-TW' ? '企業' : 'Exec' },
                { id: 'global', icon: Globe, label: language === 'zh-TW' ? '全球' : 'Global' },
                { id: 'custom', icon: Grid, label: language === 'zh-TW' ? '自訂' : 'Custom' },
            ].map(m => (
                <button 
                    key={m.id}
                    onClick={() => setViewMode(m.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${viewMode === m.id ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-gray-500 hover:text-white'}`}
                >
                    <m.icon className="w-3.5 h-3.5" />
                    {m.label}
                </button>
            ))}
        </div>
      </div>

      {viewMode === 'executive' && renderExecutiveView()}
      
      {viewMode === 'global' && (
          <div className="animate-fade-in">
              <GlobalOperations />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <OmniEsgCell mode="card" label="Total Facilities" value="12" subValue="Across 3 Regions" icon={MapIcon} color="blue" />
                  <OmniEsgCell mode="card" label="Global Efficiency" value="94.2%" trend={{value: 2.1, direction: 'up'}} icon={Zap} color="emerald" traits={['optimization']} />
                  <div className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col justify-center items-center text-center">
                      <div className="text-sm text-gray-400 mb-2">Next Audit</div>
                      <div className="text-2xl font-bold text-white">12 Days</div>
                      <div className="text-xs text-celestial-gold mt-1">Berlin Plant</div>
                  </div>
              </div>
          </div>
      )}

      {viewMode === 'custom' && (
        <div className="space-y-4 animate-fade-in">
            {customWidgets.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                    <LayoutTemplate className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg">Your dashboard is empty.</p>
                    <button onClick={() => setIsCatalogOpen(true)} className="mt-6 px-6 py-3 bg-celestial-emerald/20 text-celestial-emerald rounded-xl hover:bg-celestial-emerald/30 transition-colors font-bold">
                        Add Your First Widget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {customWidgets.map((widget) => {
                        let content = null;
                        const colSpan = widget.gridSize === 'medium' ? 'lg:col-span-2' : widget.gridSize === 'large' ? 'lg:col-span-3' : 'lg:col-span-1';
                        
                        if (widget.type === 'kpi_card') {
                            const m = liveMetrics.find(x => x.id === widget.config?.metricId) || liveMetrics[0];
                            content = m ? (
                                <OmniEsgCell
                                    id={m.id}
                                    mode="card"
                                    label={m.label}
                                    value={m.value}
                                    color={m.color}
                                    icon={getIcon(m.color)}
                                    traits={m.traits}
                                    confidence="high"
                                />
                            ) : <div className="p-4 text-xs text-gray-500 border border-white/5 rounded-xl h-full">Metric Unavailable</div>;
                        } else if (widget.type === 'chart_area') {
                            content = (
                                <div className="glass-panel p-5 rounded-2xl h-full border-white/5 flex flex-col">
                                    <h3 className="text-base font-semibold text-white mb-4">{widget.title}</h3>
                                    <div className="flex-1 w-full min-h-[200px]">
                                        <MainChartWidget data={dynamicChartData} onExport={handleExportChart} />
                                    </div>
                                </div>
                            );
                        } else if (widget.type === 'feed_list') {
                            content = (
                                <div className="glass-panel p-5 rounded-2xl h-full border-white/5">
                                    <h3 className="text-base font-semibold text-white mb-4">{widget.title}</h3>
                                    <FeedWidget handleAiAnalyze={handleAiAnalyze} />
                                </div>
                            );
                        }

                        return (
                            <div key={widget.id} className={`${colSpan} relative group`}>
                                 {content}
                                 <button 
                                    onClick={() => removeCustomWidget(widget.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40 z-20"
                                 >
                                    <Trash2 className="w-3 h-3" />
                                 </button>
                            </div>
                        );
                    })}
                     <button 
                        onClick={() => setIsCatalogOpen(true)}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all min-h-[150px]"
                    >
                        <Plus className="w-8 h-8 mb-2" />
                        <span>Add Widget</span>
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Widget Catalog Modal */}
      {isCatalogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Grid className="w-5 h-5 text-celestial-gold" />
                          {language === 'zh-TW' ? '小工具目錄' : 'Widget Catalog'}
                      </h3>
                      <button onClick={() => setIsCatalogOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                      {liveMetrics.map(m => (
                          <button 
                            key={`add-${m.id}`} 
                            onClick={() => handleAddWidget('kpi_card', typeof m.label === 'string' ? m.label : m.label.text, { metricId: m.id }, 'small')}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-purple/10 hover:border-celestial-purple/30 transition-all text-left group"
                          >
                             <div className={`p-2.5 rounded-lg ${m.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                 {React.createElement(getIcon(m.color), { className: "w-5 h-5" })}
                             </div>
                             <div>
                                 <div className="font-bold text-white">{typeof m.label === 'string' ? m.label : m.label.text}</div>
                                 <div className="text-xs text-gray-400">KPI Card • Small</div>
                             </div>
                             <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                          </button>
                      ))}
                      <button 
                        onClick={() => handleAddWidget('chart_area', 'Emissions Trend', {}, 'medium')}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-emerald/10 hover:border-celestial-emerald/30 transition-all text-left group md:col-span-2"
                      >
                             <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                                 <Activity className="w-5 h-5" />
                             </div>
                             <div>
                                 <div className="font-bold text-white">Main Area Chart</div>
                                 <div className="text-xs text-gray-400">Graph • Medium (2 cols)</div>
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
