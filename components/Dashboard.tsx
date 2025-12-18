
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Language, View } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalPageHeader } from './UniversalPageHeader';
import { TRANSLATIONS, VIEW_METADATA } from '../constants';

interface DashboardProps {
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const { carbonData, esgScores } = useCompany();
  const t = TRANSLATIONS[language].dashboard;

  // 從統一元數據獲取圖標與配色
  const diagnosticsMeta = VIEW_METADATA[View.DIAGNOSTICS];
  const carbonMeta = VIEW_METADATA[View.CARBON];
  const academyMeta = VIEW_METADATA[View.ACADEMY];
  const dashboardMeta = VIEW_METADATA[View.DASHBOARD];

  const emissionVsBaselineData = [
    { name: 'Jan', value: 400, baseline: 450 },
    { name: 'Feb', value: 300, baseline: 440 },
    { name: 'Mar', value: 550, baseline: 460 },
    { name: 'Apr', value: 480, baseline: 455 },
    { name: 'May', value: 390, baseline: 450 },
    { name: 'Jun', value: 350, baseline: 445 },
  ];

  const scopeHistoricalData = [
    { name: 'Jan', s1: 120, s2: 80, s3: 200 },
    { name: 'Feb', s1: 110, s2: 85, s3: 190 },
    { name: 'Mar', s1: 150, s2: 100, s3: 300 },
    { name: 'Apr', s1: 140, s2: 90, s3: 250 },
    { name: 'May', s1: 130, s2: 85, s3: 175 },
    { name: 'Jun', s1: 125, s2: 82, s3: 143 },
  ];

  const primaryColor = "#10b981";
  const secondaryColor = "#64748b";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={dashboardMeta.icon}
            title={{ zh: '企業決策儀表板', en: 'Executive Dashboard' }}
            description={{ zh: '即時永續績效概覽', en: 'Real-time sustainability performance overview' }}
            language={language}
            tag={{ zh: '運營核心', en: 'Ops Core' }}
            accentColor="text-emerald-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OmniEsgCell mode="card" label="ESG Score" value={esgScores.environmental} color={diagnosticsMeta.color} icon={diagnosticsMeta.icon} />
            <OmniEsgCell mode="card" label="Carbon (tCO2e)" value={carbonData.scope1 + carbonData.scope2} color={carbonMeta.color} icon={carbonMeta.icon} />
            <OmniEsgCell mode="card" label="Social Score" value={esgScores.social} color={academyMeta.color} icon={academyMeta.icon} />
            <OmniEsgCell mode="card" label="Governance" value={esgScores.governance} color={dashboardMeta.color} icon={dashboardMeta.icon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-inherit mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    {t.chartTitle}
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={emissionVsBaselineData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            <Area type="monotone" dataKey="value" name="Emissions" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            <Area type="monotone" dataKey="baseline" name="Baseline" stroke={secondaryColor} strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-inherit mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    {language === 'zh-TW' ? '歷史範疇排放明細' : 'Historical Scope Breakdown'}
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={scopeHistoricalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            <Area stackId="1" type="monotone" dataKey="s1" name="Scope 1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                            <Area stackId="1" type="monotone" dataKey="s2" name="Scope 2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                            <Area stackId="1" type="monotone" dataKey="s3" name="Scope 3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};
