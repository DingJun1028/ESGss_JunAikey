
import React, { useState } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { UserCheck, Award, Star, Fingerprint, BrainCircuit, Sparkles, GraduationCap, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface TalentPassportProps {
  language: Language;
}

// ... (SkillGalaxyBase and Agent remain the same) ...
// ----------------------------------------------------------------------
// Agent: Skill Galaxy (The Neural Map)
// ----------------------------------------------------------------------
interface SkillGalaxyProps extends InjectedProxyProps {
    data: any[];
    isZh: boolean;
}

const SkillGalaxyBase: React.FC<SkillGalaxyProps> = ({ data, isZh, adaptiveTraits, isAgentActive, trackInteraction }) => {
    // Agent Visuals
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive; // Active Learning from Academy
    const isEvolved = adaptiveTraits?.includes('evolution'); // High Level

    return (
        <div 
            className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group h-full flex flex-col min-h-[400px]"
            onClick={() => trackInteraction?.('click')}
        >
            {/* Dynamic Background Nebula */}
            <div className={`absolute inset-0 bg-gradient-to-br from-celestial-purple/5 via-transparent to-celestial-blue/5 transition-opacity duration-1000 ${isLearning ? 'opacity-100' : 'opacity-20'}`} />
            
            {/* Agent Brain Activity Overlay */}
            {isLearning && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)] animate-pulse" />
                </div>
            )}

            <div className="absolute top-6 right-6 z-20">
                <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all duration-500
                    ${isLearning 
                        ? 'text-celestial-purple bg-celestial-purple/10 border-celestial-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                        : 'text-gray-400 bg-white/5 border-white/10'}
                `}>
                    {isLearning ? <BrainCircuit className="w-3 h-3 animate-pulse" /> : <Sparkles className="w-3 h-3" />}
                    {isZh ? (isLearning ? 'AI 路徑優化中' : 'AI 學習路徑') : (isLearning ? 'Optimizing Path...' : 'AI Learning Path')}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-6 relative z-10 flex items-center gap-2 shrink-0">
                <GraduationCap className="w-5 h-5 text-celestial-blue" />
                {isZh ? '技能星系 (Skill Galaxy)' : 'Skill Galaxy'}
            </h3>
            
            <div className="relative z-10 flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar 
                            name={isZh ? "我的技能" : "My Skills"} 
                            dataKey="A" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            fill="#10b981" 
                            fillOpacity={isEvolved ? 0.5 : 0.3} 
                            className="transition-all duration-1000"
                        />
                        <Radar 
                            name={isZh ? "職位要求" : "Role Requirement"} 
                            dataKey="B" 
                            stroke="#8b5cf6" 
                            strokeWidth={2} 
                            fill="#8b5cf6" 
                            fillOpacity={0.1} 
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const SkillGalaxyAgent = withUniversalProxy(SkillGalaxyBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const TalentPassport: React.FC<TalentPassportProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { userName, userRole } = useCompany();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'skills' | 'certs'>('skills');

  const pageData = {
      title: { zh: '人才護照', en: 'Talent Passport' },
      desc: { zh: '區塊鏈驗證技能與職涯星系', en: 'Blockchain Verified Skills & Career Galaxy' },
      tag: { zh: '人才核心', en: 'Talent Core' }
  };

  // Mock Data for Radar Chart
  const skillData = [
    { subject: isZh ? '碳管理' : 'Carbon Mgmt', A: 120, B: 110, fullMark: 150 },
    { subject: isZh ? '法規遵循' : 'Compliance', A: 98, B: 130, fullMark: 150 },
    { subject: isZh ? '數據分析' : 'Data Analytics', A: 86, B: 130, fullMark: 150 },
    { subject: isZh ? '循環經濟' : 'Circular Eco', A: 99, B: 100, fullMark: 150 },
    { subject: isZh ? '社會影響' : 'Social Impact', A: 85, B: 90, fullMark: 150 },
    { subject: isZh ? '綠色金融' : 'Green Finance', A: 65, B: 85, fullMark: 150 },
  ];

  const handleApplyCert = () => {
      addToast('success', isZh ? '申請已提交！請檢查您的郵箱。' : 'Application submitted! Check your email.', 'Certification');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in overflow-hidden">
      <div className="shrink-0">
          <UniversalPageHeader 
              icon={Fingerprint}
              title={pageData.title}
              description={pageData.desc}
              language={language}
              tag={pageData.tag}
          />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4 overflow-y-auto custom-scrollbar h-full">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-celestial-emerald to-celestial-blue p-1 shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full rounded-full border-4 border-slate-900 object-cover" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">{userName}</h3>
                <p className="text-sm text-celestial-purple">{userRole}</p>
            </div>
            <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">Level 15</span>
                <span className="px-3 py-1 rounded-full bg-celestial-gold/10 border border-celestial-gold/30 text-xs text-celestial-gold flex items-center gap-1"><Star className="w-3 h-3 fill-current"/> Top 1%</span>
            </div>
            
            <div className="w-full pt-6 border-t border-white/10 text-left space-y-3 flex-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{isZh ? '證書錢包' : 'Certificate Wallet'}</h4>
                <OmniEsgCell mode="list" label="ISO 14064 Lead Verifier" value="Verified" icon={Award} color="emerald" verified={true} dataLink="blockchain" />
                <OmniEsgCell mode="list" label="CFA ESG Investing" value="Verified" icon={Award} color="gold" verified={true} dataLink="blockchain" />
                <OmniEsgCell mode="list" label="GRI Certified Pro" value="Pending" icon={Award} color="slate" verified={false} />
            </div>
            
            <button 
                onClick={handleApplyCert}
                className="w-full py-3 mt-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/10 shrink-0"
            >
                <CheckCircle className="w-3 h-3" />
                {isZh ? '申請 ESG 認證' : 'Apply for ESG Certification'}
            </button>
        </div>

        {/* Skill Galaxy Chart (Now Agent) */}
        <SkillGalaxyAgent 
            id="SkillGalaxy"
            label="Skill Galaxy"
            data={skillData}
            isZh={isZh}
        />
      </div>
    </div>
  );
};
