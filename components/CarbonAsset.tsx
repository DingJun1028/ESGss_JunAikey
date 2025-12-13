
import React, { useState, useEffect, useRef } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { Leaf, TrendingUp, PieChart, MapPin, Loader2, Zap, Calculator, Fuel, Save, DollarSign, AlertTriangle, Cloud, RefreshCw, ExternalLink, Wand2, Power, Link as LinkIcon, Radio } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { performMapQuery } from '../services/ai-service';
import { BackendService } from '../services/backend';
import { useCompany } from './providers/CompanyProvider';
import { QuantumSlider } from './minimal/QuantumSlider';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { universalIntelligence } from '../services/evolutionEngine';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface CarbonAssetProps {
  language: Language;
}

const EMISSION_DATA = [
  { name: 'Jan', scope1: 120, scope2: 80, scope3: 300 },
  { name: 'Feb', scope1: 115, scope2: 78, scope3: 290 },
  { name: 'Mar', scope1: 130, scope2: 85, scope3: 310 },
  { name: 'Apr', scope1: 110, scope2: 75, scope3: 280 },
  { name: 'May', scope1: 105, scope2: 70, scope3: 270 },
  { name: 'Jun', scope1: 100, scope2: 65, scope3: 260 },
];

const PricingSimulatorBase: React.FC<any> = ({ shadowPrice, setShadowPrice, carbonData, isZh, adaptiveTraits, trackInteraction, isAgentActive }) => {
    const totalEmissions = carbonData.scope1 + carbonData.scope2;
    const cost = totalEmissions * shadowPrice;
    const isHighPressure = cost > 100000;
    const isEvolved = adaptiveTraits?.includes('evolution');

    useEffect(() => {
        if (isHighPressure) universalIntelligence.agentUpdate('Budget', { confidence: 'low' });
    }, [isHighPressure]);

    return (
        <div className={`glass-panel p-8 rounded-3xl border transition-all duration-500 bg-gradient-to-br from-celestial-gold/5 to-transparent
            ${isHighPressure ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-celestial-gold/20'}
            ${isEvolved ? 'scale-[1.01]' : ''}
        `}>
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className={`w-6 h-6 ${isHighPressure ? 'text-red-400' : 'text-celestial-gold'}`} /> 
                    {isZh ? '內部碳定價模擬器' : 'Internal Carbon Pricing Simulator'}
                </h3>
                <button 
                    onClick={() => { setShadowPrice(85); trackInteraction?.('ai-trigger'); universalIntelligence.emit('CARBON_UPDATED', { scope1: carbonData.scope1, scope2: carbonData.scope2 }); }}
                    className="flex items-center gap-2 text-xs text-black bg-celestial-gold hover:bg-amber-400 px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/30"
                >
                    <Wand2 className="w-4 h-4" /> {isZh ? 'AI 最佳化' : 'AI Optimize'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <QuantumSlider 
                        label={isZh ? '影子價格 (Shadow Price)' : 'Shadow Price'}
                        value={shadowPrice} min={0} max={300} unit="USD/t" color={isHighPressure ? 'purple' : 'gold'}
                        onChange={(val) => { setShadowPrice(val); trackInteraction?.('edit', val); }}
                    />
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                        <div className="text-sm text-gray-400 uppercase tracking-wider">{isZh ? '總排放量 (Scope 1+2)' : 'Total Emissions'}</div>
                        <div className="text-2xl font-bold text-white font-mono">{totalEmissions.toFixed(1)} tCO2e</div>
                    </div>
                </div>
                <div className={`flex flex-col justify-center items-center text-center p-8 rounded-2xl border transition-colors duration-500
                    ${isHighPressure ? 'bg-red-500/10 border-red-500/30' : 'bg-celestial-gold/10 border-celestial-gold/30'}
                `}>
                    <div className={`text-sm font-bold uppercase mb-2 tracking-widest ${isHighPressure ? 'text-red-400' : 'text-celestial-gold'}`}>
                        {isZh ? '預估內部碳費' : 'Projected Carbon Fee'}
                    </div>
                    <div className="text-5xl font-mono font-bold text-white tracking-tight mb-4">
                        ${cost.toLocaleString()}
                    </div>
                    {isHighPressure && (
                        <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/20 px-3 py-1.5 rounded-lg animate-bounce">
                            <AlertTriangle className="w-3 h-3" />
                            {isZh ? '警告：超出部門預算上限' : 'Warning: Exceeds Dept Cap'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PricingSimulatorAgent = withUniversalProxy(PricingSimulatorBase);

export const CarbonAsset: React.FC<CarbonAssetProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { carbonData, updateCarbonData, addAuditLog, checkBadges } = useCompany();
  const { activeJourney, advanceJourney } = useUniversalAgent(); // Get Journey Context
  
  const [mapQuery, setMapQuery] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [mapResult, setMapResult] = useState<{text: string, sources?: any[]} | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'pricing'>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [shadowPrice, setShadowPrice] = useState(50);
  const [fuelInput, setFuelInput] = useState(carbonData.fuelConsumption);
  const [elecInput, setElecInput] = useState(carbonData.electricityConsumption);
  const [factors, setFactors] = useState({ diesel: 2.68, electricity: 0.509 });
  
  // Automation State
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(false);
  const autoSyncIntervalRef = useRef<number | null>(null);

  const pageData = {
      title: { zh: '碳資產管理', en: 'Carbon Asset Management' },
      desc: { zh: '即時監控與自動化盤查 (SBTi/CBAM)', en: 'Real-time Monitoring & Automated Inventory' },
      tag: { zh: '淨零核心', en: 'Net Zero Core' }
  };

  // Journey Trigger Logic
  const isCalculatorStep = activeJourney?.id === 'carbon_kickstart' && activeJourney?.steps[activeJourney.currentStepIndex].id === 's3';
  const journeyHighlightClass = "ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20 relative animate-pulse";

  // Auto-Sync Logic (IoT Simulation)
  useEffect(() => {
      if (isAutoSyncEnabled) {
          addToast('success', isZh ? 'IoT 自動同步已啟動' : 'IoT Auto-Sync Activated', 'System');
          autoSyncIntervalRef.current = window.setInterval(() => {
              // Simulate small fluctuations
              setElecInput(prev => {
                  const variance = Math.random() * 10 - 5; // +/- 5 kWh
                  const newVal = Math.max(0, prev + variance);
                  
                  // Silent update to context to trigger Neural Reflexes elsewhere
                  const s2 = (newVal * factors.electricity) / 1000;
                  const currentS1 = (fuelInput * factors.diesel) / 1000;
                  
                  updateCarbonData({ electricityConsumption: newVal, scope2: parseFloat(s2.toFixed(2)) });
                  
                  // Trigger Neural Bus event occasionally
                  if (Math.random() > 0.7) {
                      universalIntelligence.emit('CARBON_UPDATED', { scope1: currentS1, scope2: s2 });
                  }
                  
                  return newVal;
              });
          }, 3000); // Update every 3s
      } else {
          if (autoSyncIntervalRef.current) window.clearInterval(autoSyncIntervalRef.current);
      }
      return () => { if (autoSyncIntervalRef.current) window.clearInterval(autoSyncIntervalRef.current); };
  }, [isAutoSyncEnabled, factors, fuelInput]);

  useEffect(() => {
      if (activeTab === 'calculator') {
          BackendService.fetchFactors().then(remoteFactors => {
              if (remoteFactors && remoteFactors.length > 0) {
                  const newFactors = { ...factors };
                  remoteFactors.forEach((f: any) => {
                      if (f.name === 'diesel') newFactors.diesel = parseFloat(f.value);
                      if (f.name === 'electricity') newFactors.electricity = parseFloat(f.value);
                  });
                  setFactors(newFactors);
              }
          });
      }
  }, [activeTab]);

  const handleLocateSupplier = async () => {
      if(!mapQuery.trim()) return;
      setIsMapping(true);
      setMapResult(null);
      addToast('info', 'Locating facility via Google Maps Grounding...', 'Maps Agent');
      try {
          const result = await performMapQuery(mapQuery, language);
          setMapResult(result);
      } catch (e) {
          addToast('error', 'Map query failed.', 'Error');
      } finally {
          setIsMapping(false);
      }
  };

  const calculateEmissions = async () => {
      setIsSyncing(true);
      setTimeout(async () => {
          const s1 = (fuelInput * factors.diesel) / 1000;
          const s2 = (elecInput * factors.electricity) / 1000;
          const newData = { fuelConsumption: fuelInput, electricityConsumption: elecInput, scope1: parseFloat(s1.toFixed(2)), scope2: parseFloat(s2.toFixed(2)) };
          
          updateCarbonData(newData);
          addAuditLog('Carbon Calculation', `S1=${s1.toFixed(2)}t, S2=${s2.toFixed(2)}t`);
          checkBadges();
          
          universalIntelligence.emit('CARBON_UPDATED', newData);
          
          addToast('success', isZh ? '數據已同步至企業雲端' : 'Data synced to Enterprise Cloud', 'Cloud Agent');
          
          // Journey Progression
          if (isCalculatorStep) {
              advanceJourney();
          }

          setIsSyncing(false);
      }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Leaf}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="flex justify-end -mt-16 mb-6 relative z-10">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                {[
                    { id: 'dashboard', icon: PieChart, label: isZh ? '儀表板' : 'Dashboard' },
                    { id: 'calculator', icon: Calculator, label: isZh ? '計算器' : 'Calculator' },
                    { id: 'pricing', icon: DollarSign, label: isZh ? '定價模擬' : 'Pricing Sim' },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-celestial-emerald text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-white/5 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{isZh ? '排放趨勢 (Emission Trend)' : 'Emission Trend'}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Scope 1
                            <span className="w-3 h-3 rounded-full bg-amber-400 ml-2"></span> Scope 3
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={EMISSION_DATA}>
                                <defs>
                                    <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorS3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} dy={10} fontSize={12} />
                                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#e2e8f0' }} />
                                <Area type="monotone" dataKey="scope3" stackId="1" stroke="#fbbf24" fill="url(#colorS3)" strokeWidth={2} />
                                <Area type="monotone" dataKey="scope1" stackId="1" stroke="#10b981" fill="url(#colorS1)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col h-full">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-celestial-gold" />
                            {isZh ? '供應鏈地圖查詢' : 'Supplier Facility Locator'}
                        </h3>
                        <div className="flex-1 space-y-4">
                            <div className="relative">
                                <input type="text" value={mapQuery} onChange={(e) => setMapQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLocateSupplier()} placeholder={isZh ? "輸入工廠名稱..." : "Enter facility name..."} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-gold outline-none" />
                                <button onClick={handleLocateSupplier} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors">
                                    {isMapping ? <Loader2 className="w-4 h-4 animate-spin"/> : <Zap className="w-4 h-4"/>}
                                </button>
                            </div>
                            
                            {mapResult && (
                                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 animate-fade-in space-y-3 shadow-inner">
                                    <div className="text-xs text-gray-300 leading-relaxed">
                                        {mapResult.text}
                                    </div>
                                    {mapResult.sources && mapResult.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                            {mapResult.sources.map((source: any, idx: number) => source.web?.uri && (
                                                <a key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 bg-celestial-blue/10 hover:bg-celestial-blue/20 text-celestial-blue rounded text-[10px] transition-colors border border-celestial-blue/20 font-medium">
                                                    <MapPin className="w-3 h-3" />
                                                    {source.web.title || "Map"}
                                                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'calculator' && (
            <div className={`glass-panel p-8 rounded-3xl border ${isCalculatorStep ? 'border-celestial-emerald shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-white/10'} max-w-2xl mx-auto relative overflow-hidden transition-all duration-500`}>
                {/* Connection Status Indicator */}
                <div className="absolute top-0 right-0 p-6 flex items-center gap-3">
                    <span className={`text-xs font-bold ${isAutoSyncEnabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {isAutoSyncEnabled ? 'IoT CONNECTED' : 'MANUAL MODE'}
                    </span>
                    <button 
                        onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
                        className={`w-10 h-6 rounded-full flex items-center transition-colors p-1 ${isAutoSyncEnabled ? 'bg-emerald-500' : 'bg-gray-700'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAutoSyncEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-celestial-blue" /> 
                        {isZh ? '活動數據輸入' : 'Activity Data Input'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                        {isZh ? '支援 IoT 自動同步或手動輸入。數據將即時寫入區塊鏈存證。' : 'Supports IoT auto-sync or manual input. Data committed to blockchain instantly.'}
                    </p>
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Fuel className="w-4 h-4 text-celestial-gold" /> Diesel (L)
                            </label>
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">Factor: {factors.diesel}</span>
                        </div>
                        <input 
                            type="number" 
                            value={fuelInput} 
                            onChange={(e) => setFuelInput(Number(e.target.value))} 
                            className={`w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-xl text-white font-mono focus:ring-1 focus:ring-emerald-500 outline-none transition-all ${isCalculatorStep ? journeyHighlightClass : ''}`} 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-celestial-blue" /> Electricity (kWh)
                            </label>
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">Factor: {factors.electricity}</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={Math.floor(elecInput)} 
                                onChange={(e) => setElecInput(Number(e.target.value))} 
                                className={`w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-xl text-white font-mono focus:ring-1 focus:ring-blue-500 outline-none transition-all ${isAutoSyncEnabled ? 'text-emerald-400' : ''} ${isCalculatorStep ? journeyHighlightClass : ''}`} 
                                readOnly={isAutoSyncEnabled}
                            />
                            {isAutoSyncEnabled && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-500 text-xs font-bold animate-pulse">
                                    <LinkIcon className="w-3 h-3" /> IoT Syncing
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={calculateEmissions} 
                        disabled={isSyncing || isAutoSyncEnabled}
                        className={`w-full py-4 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4
                            ${isCalculatorStep ? 'animate-pulse ring-2 ring-white' : ''}
                        `}
                    >
                        {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isZh ? (isSyncing ? '正在同步...' : '更新數據 & 同步至雲端') : (isSyncing ? 'Syncing...' : 'Update & Sync to Cloud')}
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'pricing' && (
            <PricingSimulatorAgent 
                id="PriceSimulator"
                label="PriceSimulator"
                shadowPrice={shadowPrice}
                setShadowPrice={setShadowPrice}
                carbonData={carbonData}
                isZh={isZh}
            />
        )}
    </div>
  );
};
