
import React, { useState } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { UserCheck, Award, Star, Fingerprint, BrainCircuit, Sparkles, GraduationCap, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LabelList } from 'recharts';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface TalentPassportProps {
  language: Language;
}

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
                        >
                            <LabelList dataKey="A" position="top" fill="#10b981" fontSize={10} />
                        </Radar>
                        <Radar 
                            name={isZh ? "職位要求" : "Role Requirement"} 
                            dataKey="B" 
                            stroke="#8b5cf6" 
                            strokeWidth={2} 
                            fill="#8b5cf6" 
                            fillOpacity={0.1} 
                        >
                            <LabelList dataKey="B" position="top" fill="#8b5cf6" fontSize={10} />
                        </Radar>
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const SkillGalaxyAgent = withUniversalProxy(SkillGalaxyBase);

export const TalentPassport: React.FC<TalentPassportProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { userName, roleTitle, xp, level } = useCompany();
  const { addToast } = useToast();

  const pageData = {
      title: { zh: '人才護照', en: 'Talent Passport' },
      desc: { zh: '區塊鏈驗證的綠色人才技能認證', en: 'Blockchain-verified Green Skill Certification' },
      tag: { zh: '人才核心', en: 'Talent Core' }
  };

  const skillsData = [
      { subject: 'GRI', A: 120, B: 110, fullMark: 150 },
      { subject: 'SBTi', A: 98, B: 130, fullMark: 150 },
      { subject: 'TCFD', A: 86, B: 130, fullMark: 150 },
      { subject: 'Leadership', A: 99, B: 100, fullMark: 150 },
      { subject: 'Audit', A: 85, B: 90, fullMark: 150 },
      { subject: 'LCA', A: 65, B: 85, fullMark: 150 },
  ];

  const handleVerify = () => {
      addToast('success', isZh ? '證書已上鏈驗證' : 'Certificate Verified on Chain', 'Blockchain');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Fingerprint}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
            accentColor="text-pink-400"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Identity Card */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <UserCheck className="w-24 h-24 text-celestial-purple" />
                </div>
                
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-celestial-purple to-pink-500 mb-6 relative z-10">
                    <img 
                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`} 
                        alt="Profile" 
                        className="w-full h-full rounded-full bg-slate-900 object-cover" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-celestial-purple text-celestial-purple px-3 py-1 rounded-full text-xs font-bold">
                        Lv.{level}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{userName}</h3>
                <p className="text-sm text-celestial-purple font-medium mb-6">{roleTitle}</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-400 mb-1">XP</div>
                        <div className="text-lg font-bold text-white">{xp.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-400 mb-1">Certificates</div>
                        <div className="text-lg font-bold text-white">4</div>
                    </div>
                </div>

                <button 
                    onClick={handleVerify}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                    <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    {isZh ? '驗證鏈上身份' : 'Verify On-Chain ID'}
                </button>
            </div>

            {/* Skill Galaxy Agent */}
            <SkillGalaxyAgent 
                id="SkillGalaxy"
                label="My Skill Galaxy"
                data={skillsData}
                isZh={isZh}
            />
        </div>

        {/* Certificates */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-celestial-gold" />
                {isZh ? '已獲證書' : 'Earned Certificates'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: 'ISO 14064-1 Verifier', issuer: 'SGS', date: '2023.11.20', id: 'SGS-8821' },
                    { title: 'GRI Certified Pro', issuer: 'GRI Academy', date: '2024.02.15', id: 'GRI-9942' },
                    { title: 'ESG Strategy Master', issuer: 'ESG Sunshine', date: '2024.05.01', id: 'ES-0012' },
                ].map((cert, i) => (
                    <div key={i} className="p-4 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5 hover:border-celestial-gold/30 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-2 bg-slate-900 rounded-lg border border-white/10">
                                <Award className="w-6 h-6 text-celestial-gold" />
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">{cert.id}</span>
                        </div>
                        <h4 className="font-bold text-white mb-1 relative z-10">{cert.title}</h4>
                        <div className="text-xs text-gray-400 relative z-10">{cert.issuer} • {cert.date}</div>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
