import React, { useState } from 'react';
import { Language } from '../types';
import { Crown, Mic, BookOpen, BrainCircuit, PlayCircle, ArrowRight, Lightbulb, X, Star, Award, Briefcase, FileText, ChevronRight, Zap, Target } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';

interface YangBoZoneProps {
  language: Language;
}

export const YangBoZone: React.FC<YangBoZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeSimulation, setActiveSimulation] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const pageData = {
      title: { zh: '楊博專區 (Thoth Hub)', en: 'Yang Bo Zone' },
      desc: { zh: '創價者的永續智庫與實戰指導：從策略對齊到商業落地。', en: 'Strategic Sustainability Insights & Practice from Dr. Thoth Yang.' },
      tag: { zh: '策略核心', en: 'Strategy Core' }
  };

  const profile = {
      name: isZh ? '楊博 (Thoth)' : 'Thoth Yang, Ph.D.',
      title: isZh ? '創價型 ESG 策略顧問' : 'Value-Creating ESG Strategy Consultant',
      subtitle: isZh ? '永續轉型實務家 × 矽谷精實創業導師' : 'Sustainability Practitioner × Silicon Valley Lean Mentor',
      philosophy: isZh 
        ? '推動「創價型 ESG」，將永續投入轉化為企業最具競爭力的商業模組。'
        : 'Driving "Value-Creating ESG", transforming sustainability into competitive business models.',
      roles: [
          isZh ? '善向永續 (ESG Sunshine) 創辦人暨執行長' : 'Founder & CEO, ESG Sunshine',
          isZh ? '台灣社會創新永續發展協會 理事長' : 'Chairman, SISDA',
          isZh ? 'Berkeley Haas 國際永續策略長課程 主責講師' : 'Lead Instructor, Berkeley Haas Global ESG Strategy'
      ],
      expertise: [
          isZh ? '雙重重大性分析 (Double Materiality)' : 'Double Materiality',
          isZh ? '精實創業 × 永續商模設計' : 'Lean Startup × Sustainability Design',
          isZh ? 'AI 驅動決策與數據治理' : 'AI-Driven Decision Governance'
      ]
  };

  const simulationData = [
      {
          question: isZh ? '您的供應商無法提供 Scope 3 數據，且面臨 CBAM 壓力，您的首要行動？' : 'Supplier lacks Scope 3 data under CBAM pressure. Primary action?',
          options: [
              { text: isZh ? '單純更換合規供應商' : 'Replace with compliant supplier', type: 'risk', advice: isZh ? '這會增加隱形成本。建議改用協作輔導。' : 'High hidden cost. Try guidance instead.' },
              { text: isZh ? '啟動「綠色溢價」共同研發' : 'Launch Green Premium R&D', type: 'value', advice: isZh ? '非常棒！這是創價型思考。與供應商共創低碳價值。' : 'Excellent! This is value-creating logic.' },
              { text: isZh ? '使用行業平均值暫代' : 'Use industry average factors', type: 'compliance', advice: isZh ? '可作為短期過渡，但無法解決核心競爭力問題。' : 'Short-term fix, not a strategic solution.' }
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

        {/* --- Dr. Yang Profile Section --- */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-celestial-gold/30 bg-gradient-to-r from-slate-900 via-slate-900/50 to-slate-900 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-celestial-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-celestial-gold/10 transition-all duration-1000" />
            
            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="relative w-56 h-56 mb-6">
                        <div className="absolute inset-0 bg-celestial-gold/20 rounded-full blur-2xl animate-pulse" />
                        <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-celestial-gold/40 shadow-2xl relative z-10 bg-slate-800">
                             <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                <Crown className="w-24 h-24 text-celestial-gold" />
                             </div>
                             <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-3 text-center">
                                <span className="text-[10px] font-black text-celestial-gold tracking-[0.2em] uppercase">Thoth Yang Ph.D.</span>
                             </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{profile.name}</h2>
                        <p className="text-sm text-celestial-gold font-bold mt-1">{profile.title}</p>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 italic text-gray-300 leading-relaxed relative">
                        <Lightbulb className="absolute -top-3 -left-3 w-8 h-8 text-celestial-gold bg-slate-900 rounded-full p-1.5 border border-celestial-gold/30 shadow-lg" />
                        "{profile.philosophy}"
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-celestial-gold" /> {isZh ? '關鍵角色' : 'Core Roles'}
                            </h4>
                            <div className="space-y-2">
                                {profile.roles.map((r, i) => (
                                    <div key={i} className="flex gap-2 text-sm text-gray-300">
                                        <ChevronRight className="w-4 h-4 text-celestial-gold shrink-0 mt-0.5" />
                                        <span>{r}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Award className="w-4 h-4 text-emerald-400" /> {isZh ? '專長領域' : 'Expertise'}
                            </h4>
                            <div className="space-y-2">
                                {profile.expertise.map((e, i) => (
                                    <div key={i} className="flex gap-2 text-sm text-gray-300">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>{e}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Dynamic Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Insights */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FileText className="w-40 h-40 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-1 bg-celestial-gold text-black text-[10px] font-black rounded uppercase">Weekly Report</span>
                        <span className="text-xs text-gray-500 font-mono">MAY 2025 EDITION</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                        {isZh ? '全球永續觀察：歐盟 CSDDD 正式落地對台企的機會' : 'Global Watch: CSDDD Opportunities for APAC'}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        {isZh 
                            ? '供應鏈盡職調查指令不再只是法規風險，而是篩選「高透明度供應鏈」的利器。本週楊博與您分享如何利用 AI 預判稽核風險。' 
                            : 'Supply chain due diligence is now a tool for high-transparency value. AI-driven risk anticipation is the key strategy for 2025.'}
                    </p>
                    <div className="flex gap-2 mb-8">
                        {['CSDDD', 'AI Audit', 'Transparency'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400">#{tag}</span>
                        ))}
                    </div>
                </div>
                <button className="flex items-center gap-2 text-celestial-gold font-bold hover:underline group">
                    {isZh ? '閱讀全文' : 'Read Full Analysis'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Podcast Player / Audio Insights */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col bg-slate-900/50">
                <div className="flex items-center gap-2 mb-6 text-celestial-purple">
                    <Mic className="w-5 h-5" />
                    <span className="text-xs font-black tracking-widest uppercase">Podcast Insight</span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-celestial-purple/10 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full border border-celestial-purple/30 animate-ping" />
                        <PlayCircle className="w-10 h-10 text-celestial-purple" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{isZh ? '解決你的碳焦慮：精實 ESG 第 42 集' : 'Lean ESG Ep.42'}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">面對不確定的碳稅預期，我們該如何建立韌性財務模型？</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>LENGTH: 32:45</span>
                    <span>THOTH YANG X JUNAIKEY</span>
                </div>
            </div>
        </div>

        {/* --- Interactive Simulation --- */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-950/80">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <BrainCircuit className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{isZh ? '創價者實戰模擬器' : 'Value Creator Simulator'}</h3>
                        <p className="text-xs text-gray-500">測試您的 ESG 戰略思維，獲取楊博的即時反饋。</p>
                    </div>
                </div>
                {!activeSimulation && (
                    <button 
                        onClick={() => setActiveSimulation(true)}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                        {isZh ? '啟動模擬' : 'Launch Simulation'}
                    </button>
                )}
            </div>

            {activeSimulation ? (
                <div className="animate-fade-in space-y-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-20 h-20 text-emerald-400" />
                        </div>
                        <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Decision Scenario #{simulationStep + 1}</div>
                        <h4 className="text-xl font-bold text-white leading-relaxed max-w-2xl">{simulationData[simulationStep].question}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {simulationData[simulationStep].options.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSimOption(opt.advice)}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all text-left group"
                            >
                                <div className={`text-[10px] font-black uppercase mb-3 ${opt.type === 'value' ? 'text-celestial-gold' : opt.type === 'risk' ? 'text-red-400' : 'text-blue-400'}`}>[{opt.type}]</div>
                                <div className="text-sm text-gray-300 group-hover:text-white leading-relaxed">{opt.text}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Lightbulb, title: isZh ? '情境決策' : 'Strategic Scenarios', desc: isZh ? '模擬現實中複雜的利害關係人衝突。' : 'Simulate stakeholder conflicts.' },
                        /* Added missing Target icon import to fix the "Cannot find name 'Target'" error on line 235 */
                        { icon: Target, title: isZh ? '獲取建議' : 'Expert Advice', desc: isZh ? '楊博的方法論將直接指導您的選擇。' : 'Methodology guidance on every choice.' },
                        { icon: Zap, title: isZh ? '累積經驗' : 'Accumulate XP', desc: isZh ? '正確的創價決策可獲得額外系統經驗值。' : 'Earn GWC and XP for value-creating decisions.' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-3 p-4">
                            <item.icon className="w-10 h-10 text-gray-600 opacity-50" />
                            <h4 className="font-bold text-white">{item.title}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
