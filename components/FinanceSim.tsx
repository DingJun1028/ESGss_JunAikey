
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Calculator, TrendingUp, DollarSign, AlertCircle, LineChart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { QuantumSlider } from './minimal/QuantumSlider';
import { OmniEsgCell } from './OmniEsgCell';
import { predictFutureTrends } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface FinanceSimProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Agent: Market Oracle (The Forecaster)
// ----------------------------------------------------------------------
interface MarketOracleProps extends InjectedProxyProps {
    data: any[];
    isZh: boolean;
}

const MarketOracleBase: React.FC<MarketOracleProps> = ({ data, isZh, adaptiveTraits, isAgentActive, trackInteraction }) => {
    // Agent Visuals
    const isCalculating = adaptiveTraits?.includes('optimization');
    const isVolatile = adaptiveTraits?.includes('evolution'); // E.g. High Carbon Price scenario

    return (
        <div 
            className={`lg:col-span-2 glass-panel p-6 rounded-2xl border transition-all duration-500 min-h-[400px] flex flex-col relative overflow-hidden group
                ${isVolatile ? 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5'}
            `}
            onClick={() => trackInteraction?.('click')}
        >
            {/* Scan Line Effect when Calculating */}
            {isCalculating && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-celestial-emerald/5 to-transparent animate-[scan_2s_linear_infinite] pointer-events-none" />
            )}

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${isVolatile ? 'text-amber-400' : 'text-celestial-emerald'}`} />
                    {isZh ? '情境分析：一切照舊 vs 綠色轉型' : 'Scenario: BAU vs Green Transition'}
                </h3>
                {isAgentActive && (
                    <div className="flex items-center gap-1 text-[10px] text-celestial-emerald border border-celestial-emerald/30 px-2 py-1 rounded bg-celestial-emerald/10">
                        <Activity className="w-3 h-3" /> Oracle Live
                    </div>
                )}
            </div>
            
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBau" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area name={isZh ? "綠色轉型" : "Green Transition"} type="monotone" dataKey="Green" stroke="#10b981" fill="url(#colorGreen)" strokeWidth={2} />
                        <Area name={isZh ? "一切照舊 (BAU)" : "Business As Usual"} type="monotone" dataKey="BAU" stroke="#64748b" fill="url(#colorBau)" strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs text-amber-200">
                    {isZh 
                        ? "注意：當碳價超過 €120/t 時，BAU 情境將出現負現金流。建議加速資本支出。" 
                        : "Insight: BAU scenario turns cash-negative when Carbon Price exceeds €120/t. Acceleration advised."}
                </div>
            </div>
        </div>
    );
};

const MarketOracleAgent = withUniversalProxy(MarketOracleBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const FinanceSim: React.FC<FinanceSimProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { carbonData } = useCompany(); // Get Carbon Data for link
  
  // Simulation Parameters
  const [carbonPrice, setCarbonPrice] = useState(85); // EUR
  const [investment, setInvestment] = useState(5); // Million USD
  const [timeHorizon, setTimeHorizon] = useState(5); // Years
  const [efficiency, setEfficiency] = useState(15); // %

  const [data, setData] = useState<any[]>([]);

  const pageData = {
      title: { zh: '財務模擬器', en: 'ROI Simulator' },
      desc: { zh: '去碳化投資回報與碳稅衝擊預測', en: 'Decarbonization Investment Analysis' },
      tag: { zh: '認知核心', en: 'Cognition Core' }
  };

  // Calculate Projection (Updated with Carbon Link)
  useEffect(() => {
    const newData = [];
    const baseRevenue = 100; // Base baseline in Millions
    
    // Real Carbon Burden Factor
    const currentCarbon = (carbonData.scope1 + carbonData.scope2) / 1000; // Scale down for millions chart
    
    for (let i = 0; i <= timeHorizon; i++) {
      const year = 2024 + i;
      
      // Business As Usual (BAU): Hit by carbon tax linked to real data
      // Use currentCarbon as base intensity
      const carbonTaxLoad = (currentCarbon * carbonPrice * 0.05 * i); 
      const bauCost = carbonTaxLoad; 
      const bau = baseRevenue + (i * 2) - bauCost;

      // Green Transition: Upfront cost, then efficiency gains + lower tax
      const investCost = i === 0 ? investment * 2 : 0; // Simplified
      const efficiencyGain = (efficiency * 0.5 * i);
      const greenTax = (carbonTaxLoad * 0.4); // Assuming 60% reduction in tax due to transition
      const green = baseRevenue + (i * 3) + efficiencyGain - greenTax - investCost;

      newData.push({
        year: year.toString(),
        BAU: parseFloat(bau.toFixed(1)),
        Green: parseFloat(green.toFixed(1))
      });
    }
    setData(newData);
  }, [carbonPrice, investment, timeHorizon, efficiency, carbonData]);

  const handleAiForecast = async () => {
      addToast('info', 'AI Agent running Monte Carlo simulations...', 'Finance Bot');
      try {
          await predictFutureTrends('ROI', [10, 12, 15, 18], '25%', language);
          addToast('success', 'Simulation optimized. Confidence interval: 92%.', 'AI Forecast');
      } catch(e) {
          addToast('error', 'Forecast failed', 'Error');
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <UniversalPageHeader 
          icon={Calculator}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="glass-panel p-6 rounded-2xl space-y-8 border border-white/5 h-full">
            <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg border border-white/5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">
                    Linked to Carbon: 
                    <span className="text-white font-bold ml-1">{(carbonData.scope1 + carbonData.scope2).toFixed(1)} tCO2e</span>
                </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '模擬參數' : 'Parameters'}</h3>
            
            <QuantumSlider 
                label={isZh ? '預期碳價 (Carbon Price)' : 'Expected Carbon Price'}
                value={carbonPrice}
                min={0} max={300} unit="€"
                color="gold"
                onChange={setCarbonPrice}
            />
            
            <QuantumSlider 
                label={isZh ? '綠色投資額 (Investment)' : 'Green Investment'}
                value={investment}
                min={0} max={50} unit="M$"
                color="emerald"
                onChange={setInvestment}
            />

            <QuantumSlider 
                label={isZh ? '時間範疇 (Horizon)' : 'Time Horizon'}
                value={timeHorizon}
                min={1} max={15} unit="Yrs"
                color="purple"
                onChange={setTimeHorizon}
            />

            <QuantumSlider 
                label={isZh ? '預期能效提升 (Efficiency)' : 'Efficiency Gain'}
                value={efficiency}
                min={0} max={50} unit="%"
                color="blue"
                onChange={setEfficiency}
            />

            <div className="pt-6 border-t border-white/10">
                <OmniEsgCell 
                    mode="list" 
                    label="Internal Rate of Return (IRR)" 
                    value="14.2%" 
                    confidence="medium" 
                    traits={['gap-filling']}
                    color="emerald"
                    onAiAnalyze={handleAiForecast}
                />
            </div>
        </div>

        {/* Chart (Now Agent) */}
        <MarketOracleAgent 
            id="MarketOracle"
            label="ROI Forecast"
            data={data}
            isZh={isZh}
        />
      </div>
    </div>
  );
};
