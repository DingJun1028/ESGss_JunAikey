
import React, { useState } from 'react';
import { Language } from '../types';
import { Crown, Mic, BookOpen, BrainCircuit, PlayCircle, ArrowRight, Lightbulb, X, Star, Award, Briefcase } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface YangBoZoneProps {
  language: Language;
}

export const YangBoZone: React.FC<YangBoZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeSimulation, setActiveSimulation] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const pageData = {
      title: { zh: '楊博專區', en: 'Yang Bo Zone' },
      desc: { zh: '創價者的永續智庫與實戰指導', en: 'Sustainability Insights & Practical Guidance from Dr. Yang' },
      tag: { zh: '策略核心', en: 'Strategy Core' }
  };

  // Profile Data based on PDF
  const profile = {
      name: isZh ? '楊博 (Thoth)' : 'Thoth Yang',
      title: isZh ? '創價型 ESG 策略顧問' : 'Value-Creating ESG Strategy Consultant',
      subtitle: isZh ? '永續轉型實務家 × 生態系推動者' : 'Sustainability Practitioner × Ecosystem Driver',
      philosophy: isZh 
        ? '推動「創價型 ESG」，結合矽谷精實創業與永續商模，協助企業將 ESG 轉化為具體競爭力。'
        : 'Promoting "Value-Creating ESG", combining Silicon Valley Lean Startup with sustainable business models to transform ESG into competitive advantage.',
      roles: [
          isZh ? '善向永續 (ESG Sunshine) 創辦人暨執行長' : 'Founder & CEO, ESG Sunshine',
          isZh ? '台灣社會創新永續發展協會 理事長' : 'Chairman, Social Innovation & Sustainability Development Association',
          isZh ? 'Berkeley Haas 國際永續策略長課程 台灣端負責人 / 主責講師' : 'Director / Lead Instructor, Berkeley Haas Global ESG Strategy Program (Taiwan)'
      ],
      expertise: [
          isZh ? '創價型 ESG 策略與轉型' : 'Value-Creating ESG Strategy',
          isZh ? '矽谷精實創業 × 永續商模' : 'Lean Startup × Sustainable Business Models',
          isZh ? 'AI × ESG 決策儀表板' : 'AI × ESG Decision Dashboard',
          isZh ? '企業品牌重塑與國際鏈結' : 'Corporate Rebranding & Global Connection'
      ]
  };

  const weeklyReport = {
      title: isZh ? '全球永續觀察周報 #42' : 'Global Sustainability Weekly #42',
      date: '2024.05.20',
      summary: isZh 
        ? '本週重點：歐盟 CBAM 正式進入過渡期，企業應如何調整供應鏈數據盤查策略？同時，TNFD 公布最終框架，生物多樣性將成為下一個 ESG 戰場。'
        : 'Key Focus: EU CBAM enters transition phase. How should enterprises adjust supply chain data strategies? TNFD releases final framework.',
      tags: ['CBAM', 'TNFD', 'Supply Chain']
  };

  const podcastEp = {
      title: isZh ? 'EP.24: 碳焦慮時代的生存指南' : 'EP.24: Survival Guide in the Carbon Anxiety Era',
      guest: 'Dr. Yang',
      duration: '45 min',
      desc: isZh ? '深入探討中小企業如何面對來自品牌商的減碳壓力。' : 'Deep dive into how SMEs face decarbonization pressure from big brands.'
  };

  const simulationData = [
      {
          question: isZh ? '您的主要供應商無法提供準確的碳足跡數據，您該怎麼做？' : 'Your key supplier cannot provide accurate carbon footprint data. What do you do?',
          options: [
              { text: isZh ? '直接更換供應商' : 'Switch supplier immediately', advice: isZh ? '太激進了。更換供應商成本高昂且可能破壞長期關係。建議先協助輔導。' : 'Too aggressive. Switching is costly. Try assisting them first.' },
              { text: isZh ? '使用行業平均係數估算' : 'Use industry average factors', advice: isZh ? '可行，但這只是權宜之計。長期仍需實測數據以符合合規要求。' : 'Feasible as a stopgap, but real data is needed for long-term compliance.' },
              { text: isZh ? '啟動供應商議合計畫' : 'Launch supplier engagement program', advice: isZh ? '正解！這能建立長期韌性並共同成長。' : 'Correct! This builds long-term resilience and mutual growth.' }
          ]
      }
  ];

  const handleSimOption = (advice: string) => {
      addToast('info', advice, 'Dr. Yang says:');
      setTimeout(() => {
          setActiveSimulation(false);
          setSimulationStep(0);
      }, 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Crown}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* SPEAKER PROFILE CARD */}
        <div className="glass-panel p-8 rounded-2xl border border-celestial-gold/30 bg-gradient-to-r from-slate-900 to-slate-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                {/* Avatar / Photo Area */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-celestial-gold/50 shadow-[0_0_20px_rgba(251,191,36,0.2)] mb-4 relative group bg-slate-800">
                        {/* Placeholder Visual since we can't use the actual image file */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center">
                             <Crown className="w-20 h-20 text-celestial-gold opacity-50" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center text-xs text-celestial-gold font-bold uppercase tracking-widest">
                            THOTH YANG, PH.D.
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                        <div className="text-xs text-celestial-gold font-bold tracking-wider uppercase mb-2">PH.D.</div>
                        <p className="text-sm text-gray-400">{profile.subtitle}</p>
                    </div>
                </div>

                {/* Info Area */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-3 leading-tight">
                            {profile.title}
                        </h3>
                        <div className="p-4 rounded-xl bg-white/5 border-l-4 border-celestial-gold italic text-gray-300 leading-relaxed">
                            <Lightbulb className="w-4 h-4 text-celestial-gold inline mr-2 mb-1" />
                            "{profile.philosophy}"
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                            <h4 className="text-xs font-bold text-celestial-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                {isZh ? '現任職務 (Current Roles)' : 'Current Roles'}
                            </h4>
                            <ul className="space-y-3">
                                {profile.roles.map((role, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-celestial-gold mt-1.5 shrink-0" />
                                        <span>{role}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                {isZh ? '專業領域 (Expertise)' : 'Expertise'}
                            </h4>
                            <ul className="space-y-3">
                                {profile.expertise.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Report */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-celestial-gold/30 bg-gradient-to-br from-celestial-gold/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen className="w-32 h-32 text-celestial-gold" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-celestial-gold text-black text-xs font-bold rounded">Weekly</span>
                        <span className="text-gray-400 text-sm">{weeklyReport.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{weeklyReport.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{weeklyReport.summary}</p>
                    <div className="flex gap-2 mb-6">
                        {weeklyReport.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full border border-white/20 text-xs text-gray-400">{tag}</span>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 text-celestial-gold font-bold hover:underline">
                        {isZh ? '閱讀完整報告' : 'Read Full Report'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Podcast Player */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/80 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-celestial-purple/20 to-transparent" />
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-celestial-purple">
                            <Mic className="w-5 h-5" />
                            <span className="text-xs font-bold tracking-wider">PODCAST</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{podcastEp.title}</h3>
                        <p className="text-xs text-gray-400 mb-4">{podcastEp.desc}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                            <PlayCircle className="w-6 h-6 fill-current" />
                        </button>
                        <div>
                            <div className="text-xs text-gray-500">{podcastEp.duration}</div>
                            <div className="text-sm font-bold text-white">Listen Now</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Interactive Simulation: Yang Bo's Week */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-800/50">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-emerald-400" />
                    {isZh ? '創價者楊博的一周：實戰模擬' : "Yang Bo's Week: Simulation"}
                </h3>
                {!activeSimulation && (
                    <button 
                        onClick={() => setActiveSimulation(true)} 
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all"
                    >
                        {isZh ? '開始模擬' : 'Start Simulation'}
                    </button>
                )}
            </div>

            {activeSimulation ? (
                <div className="animate-fade-in bg-slate-900 p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Lightbulb className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-xs text-emerald-400 font-bold uppercase mb-1">Scenario</div>
                                <h4 className="text-lg font-bold text-white">{simulationData[simulationStep].question}</h4>
                            </div>
                        </div>
                        <button onClick={() => setActiveSimulation(false)}><X className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {simulationData[simulationStep].options.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSimOption(opt.advice)}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 text-left transition-all group"
                            >
                                <div className="text-sm text-gray-300 group-hover:text-white">{opt.text}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-full mb-3 flex items-center justify-center text-xl">🤔</div>
                        <h4 className="font-bold text-white mb-1">{isZh ? '模擬真實困境' : 'Simulate Dilemmas'}</h4>
                        <p className="text-xs text-gray-400">{isZh ? '面對供應鏈斷鏈、碳稅衝擊等真實情境。' : 'Face real scenarios like supply chain breaks & carbon tax.'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-full mb-3 flex items-center justify-center text-xl">💡</div>
                        <h4 className="font-bold text-white mb-1">{isZh ? '做出決策' : 'Make Decisions'}</h4>
                        <p className="text-xs text-gray-400">{isZh ? '在有限資源下做出最佳 ESG 決策。' : 'Make the best ESG decisions with limited resources.'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-full mb-3 flex items-center justify-center text-xl">🎓</div>
                        <h4 className="font-bold text-white mb-1">{isZh ? '專家建議' : 'Expert Advice'}</h4>
                        <p className="text-xs text-gray-400">{isZh ? '獲得楊博的即時反饋與策略指導。' : 'Get immediate feedback & strategy from Dr. Yang.'}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
