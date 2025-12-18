
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Brush, ReferenceArea
} from 'recharts';
import { TrendingUp, Sparkles, AlertTriangle, BrainCircuit, Activity, CheckSquare, Wrench, ChevronRight, LayoutGrid, Globe, ShieldCheck, Zap, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Language, View } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalPageHeader } from './UniversalPageHeader';
import { TRANSLATIONS, VIEW_METADATA } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { GlobalOperations } from './GlobalOperations';

interface DashboardProps {
  language: Language;
}

const INITIAL_DATA = [
  { name: 'Jan', value: 400, baseline: 450, details: 'Initial baseline setup' },
  { name: 'Feb', value: 300, baseline: 440, details: 'Seasonal dip observed' },
  { name: 'Mar', value: 550, baseline: 460, details: 'Q1 reporting spike' },
  { name: 'Apr', value: 480, baseline: 455, details: 'Normalization period' },
  { name: 'May', value: 390, baseline: 450, details: 'Efficiency measures active' },
  { name: 'Jun', value: 350, baseline: 445, details: 'Summer load management' },
  { name: 'Jul', value: 420, baseline: 440, details: 'Mid-year audit prep' },
  { name: 'Aug', value: 380, baseline: 435, details: 'Maintenance window' },
  { name: 'Sep', value: 510, baseline: 440, details: 'Production ramp-up' },
  { name: 'Oct', value: 490, baseline: 445, details: 'Q3 review impact' },
  { name: 'Nov', value: 460, baseline: 450, details: 'Process optimization' },
  { name: 'Dec', value: 430, baseline: 455, details: 'Year-end target alignment' },
];

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const { carbonData, esgScores } = useCompany();
  const { addToast } = useToast();
  const dict = TRANSLATIONS[language] || TRANSLATIONS['zh-TW'];
  const t = dict?.dashboard || TRANSLATIONS['en-US'].dashboard;
  const isZh = language === 'zh-TW';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'spatial' | 'sim'>('overview');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  
  // Interactive State for Zooming
  const [refAreaLeft, setRefAreaLeft] = useState<string | number>('');
  const [refAreaRight, setRefAreaRight] = useState<string | number>('');
  const [left, setLeft] = useState<string | number>('dataMin');
  const [right, setRight] = useState<string | number>('dataMax');

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // Sort the selection
    let [l, r] = [refAreaLeft, refAreaRight];
    if (l > r) [l, r] = [r, l];

    setLeft(l);
    setRight(r);
    setRefAreaLeft('');
    setRefAreaRight('');
    addToast('info', isZh ? '檢視區域已縮放' : 'View area zoomed', 'System');
  };

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
        const point = data.activePayload[0].payload;
        setSelectedPoint(point);
        addToast('success', isZh ? `選取時段：${point.name}` : `Selected Period: ${point.name}`, 'Neural Drill-Down');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8 relative">
        <UniversalPageHeader 
            icon={VIEW_METADATA[View.DASHBOARD].icon}
            title={{ zh: '企業決策矩陣', en: 'Decision Matrix Core' }}
            description={{ zh: '全系統邏輯共振：整合即時遙測與 AI 分佈式推理', en: 'System Resonance: Real-time Telemetry & Distributed AI Reasoning' }}
            language={language}
            tag={{ zh: '核心智能', en: 'Core Intel' }}
            accentColor="text-emerald-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            <OmniEsgCell 
                mode="card" 
                label={isZh ? "環境核心指標" : "Environment Core"} 
                value={esgScores.environmental} 
                color="emerald" 
                icon={Activity} 
                trend={{ value: 5.2, direction: 'up' }}
            />
            <OmniEsgCell 
                mode="card" 
                label={isZh ? "碳負載總量" : "Total Carbon"} 
                value={`${(carbonData.scope1 + carbonData.scope2).toFixed(1)}t`} 
                color="blue" 
                icon={TrendingUp} 
                trend={{ value: 2.1, direction: 'down' }}
            />
            <OmniEsgCell 
                mode="card" 
                label={isZh ? "社會參與" : "Social Resonance"} 
                value={esgScores.social} 
                color="purple" 
                icon={Sparkles} 
            />
            <OmniEsgCell 
                mode="card" 
                label={isZh ? "治理規章" : "Governance Grid"} 
                value={esgScores.governance} 
                color="gold" 
                icon={ShieldCheck} 
            />
        </div>

        <div className="grid grid-cols-12 gap-4 items-stretch relative z-10">
            <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="glass-card p-6 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-xl">
                                <Activity className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white tracking-tight uppercase leading-none">{t.chartTitle}</h3>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">INTERACTIVE TIME-LATTICE</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                                <button onClick={() => setActiveTab('overview')} className={`px-4 py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>CHRONOS</button>
                                <button onClick={() => setActiveTab('spatial')} className={`px-4 py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeTab === 'spatial' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>SPATIAL</button>
                            </div>
                            {(left !== 'dataMin' || right !== 'dataMax') && (
                                <button 
                                    onClick={zoomOut}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/10"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="h-[380px] w-full select-none">
                        {activeTab === 'overview' ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                    data={INITIAL_DATA}
                                    onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel || '')}
                                    onMouseMove={(e) => refAreaLeft && e && setRefAreaRight(e.activeLabel || '')}
                                    onMouseUp={zoom}
                                    onClick={handlePointClick}
                                    className="cursor-crosshair"
                                >
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} 
                                        domain={[left, right]}
                                        allowDataOverflow
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#475569', fontSize: 10, fontStyle: 'italic'}} 
                                    />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.2rem', backdropFilter: 'blur(10px)'}}
                                        itemStyle={{fontWeight: 'bold', fontSize: '12px'}}
                                        labelStyle={{color: '#10b981', fontWeight: '900', marginBottom: '4px', textTransform: 'uppercase'}}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#10b981" 
                                        strokeWidth={4} 
                                        fill="url(#colorVal)" 
                                        activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2, fill: '#10b981' }}
                                        animationDuration={1000}
                                    >
                                        <LabelList dataKey="value" position="top" fill="#10b981" fontSize={10} offset={12} fontStyle="bold" />
                                    </Area>
                                    <Area 
                                        type="monotone" 
                                        dataKey="baseline" 
                                        stroke="#475569" 
                                        strokeDasharray="5 5" 
                                        fill="transparent" 
                                        strokeWidth={1}
                                        opacity={0.5}
                                    />
                                    
                                    {refAreaLeft && refAreaRight ? (
                                        <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#10b981" fillOpacity={0.1} />
                                    ) : null}

                                    <Brush 
                                        dataKey="name" 
                                        height={30} 
                                        stroke="#1e293b" 
                                        fill="rgba(15, 23, 42, 0.5)"
                                        travellerWidth={10}
                                        gap={5}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full rounded-3xl overflow-hidden border border-white/5">
                                <GlobalOperations />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-between px-2">
                        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                            DRAG TO ZOOM • CLICK TO ANALYZE
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-emerald-500" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">Live Telemetry</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-slate-600 border-dashed border-t" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">SBTi Baseline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedPoint ? (
                    <div className="glass-card p-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 animate-slide-up flex flex-col md:flex-row items-center gap-8 group">
                         <div className="w-20 h-20 rounded-[2rem] bg-emerald-500 text-black flex flex-col items-center justify-center shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                             <span className="text-[10px] font-black uppercase opacity-60">Value</span>
                             <span className="text-3xl font-black">{selectedPoint.value}</span>
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                 <Zap className="w-4 h-4 text-celestial-gold" />
                                 <h4 className="text-lg font-black text-white uppercase tracking-tight italic">Period Insight: {selectedPoint.name}</h4>
                             </div>
                             <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                 {selectedPoint.details}. AI Kernel identifies a <span className="text-emerald-400 font-bold">12% efficiency gain</span> compared to the {selectedPoint.baseline} baseline. 
                                 Recommendation: Propagate Sector 7 logic to EMEA plant.
                             </p>
                         </div>
                         <button onClick={() => setSelectedPoint(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-500"><XCircle /></button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-card p-6 rounded-[2rem] border-white/5 bg-slate-900/40">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Anomaly Registry
                            </h4>
                            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4 transition-all hover:bg-amber-500/10 cursor-pointer">
                                <div className="w-1.5 h-12 bg-amber-500 rounded-full animate-pulse" />
                                <div>
                                    <div className="text-xs font-black text-white">Sector 7 Load Spike</div>
                                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Automated Root Cause Analysis completed. Context mapped to supply chain delay.</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-[2rem] border-white/5 flex items-center gap-6 bg-slate-900/20 group cursor-help">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-8 h-8 text-emerald-400 shrink-0" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">AI Recommendation</h5>
                                <p className="text-[11px] text-gray-300 italic leading-relaxed font-medium">
                                    "Syncing Scope 3 data to stabilize prediction lattice. Q3 efficiency forecast improved by 4.2%."
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="glass-card p-6 rounded-[2.5rem] border-white/5 h-full flex flex-col bg-slate-900/60 shadow-inner">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <h3 className="text-[10px] font-black text-gray-500 tracking-[0.3em] flex items-center gap-2 uppercase">
                            <LayoutGrid className="w-4 h-4 text-celestial-purple" /> Critical Nodes
                        </h3>
                        <div className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[8px] font-mono text-gray-500">
                            ID: MATRIX_GRID_01
                        </div>
                    </div>
                    
                    <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                        <OmniEsgCell mode="list" label="GRI Audit" value="85%" subValue="Verification Phase" color="purple" icon={CheckSquare} confidence="high" />
                        <OmniEsgCell mode="list" label="Supply Chain" value="12/45" subValue="Real-time Tracking" color="blue" icon={Globe} confidence="medium" />
                        <OmniEsgCell mode="list" label="Solar ROI" value="$1.2M" subValue="Investment Ready" color="gold" icon={Wrench} confidence="high" />
                        <OmniEsgCell mode="list" label="Carbon Tax" value="CRITICAL" subValue="H2 2025 Projection" color="rose" icon={AlertTriangle} confidence="low" />
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-white/5 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[8px] font-black text-gray-600 uppercase tracking-widest">
                            Neural Bus Interface
                        </div>
                        <button className="w-full py-5 bg-white text-black text-xs font-black rounded-3xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] group">
                            <BrainCircuit className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                            {isZh ? '啟動神經演算' : 'LAUNCH NEURAL KERNEL'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const XCircle = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);
