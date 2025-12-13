
import React, { useState, useEffect } from 'react';
import { Language, View } from '../types';
import { Stethoscope, CheckSquare, BarChart, Settings, Activity, ShieldCheck, Zap, ArrowRight, ClipboardCheck, Users, Target, ArrowRightLeft, Search } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface HealthCheckProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { intelligenceBrief, setIntelligenceBrief } = useCompany(); // Get context
  
  const [activeTab, setActiveTab] = useState<'service' | 'lite_check'>('service');
  const [formData, setFormData] = useState({
      strategy: 3,
      governance: 3,
      social: 3,
      env: 3
  });
  const [isGenerated, setIsGenerated] = useState(false);

  const pageData = {
      title: { zh: 'ESG 健檢服務', en: 'ESG Assessment Service' },
      desc: { zh: '從「合規」到「創價」的雙軌深度診斷', en: 'Dual-Track Diagnosis: Compliance to Value Creation' },
      tag: { zh: '診斷核心', en: 'Diagnosis Core' }
  };

  // Handle incoming intelligence
  useEffect(() => {
      if (intelligenceBrief && intelligenceBrief.action === 'compare') {
          setActiveTab('lite_check');
          addToast('success', isZh ? `已載入 ${intelligenceBrief.targetCompany} 的數據模型` : `Loaded data model for ${intelligenceBrief.targetCompany}`, 'System Link');
          // Simulate adjusting initial values based on external intelligence
          setFormData({
              strategy: 4, // Assume competitor pressures strategy
              governance: 2, // Assume finding weakness
              social: 3,
              env: 3
          });
      }
  }, [intelligenceBrief]);

  const handleGenerate = () => {
      setIsGenerated(true);
      addToast('success', isZh ? '分析報告已生成' : 'Analysis Report Generated', 'System');
  };

  const handleRequestService = () => {
      addToast('success', isZh ? '已發送顧問諮詢請求' : 'Consultation Request Sent', 'ESG Sunshine');
  };

  const handleGoToIntel = () => {
      if (onNavigate) {
          setIntelligenceBrief(null); // Clear context
          onNavigate(View.BUSINESS_INTEL);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Stethoscope}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Cross-Module Banner */}
        {intelligenceBrief && (
            <div className="p-4 bg-celestial-blue/10 border border-celestial-blue/30 rounded-xl flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-celestial-blue/20 rounded-lg text-celestial-blue">
                        <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">{isZh ? '比較模式已啟動' : 'Comparative Mode Active'}</h4>
                        <p className="text-xs text-gray-400">
                            {isZh ? `正在針對 ${intelligenceBrief.targetCompany} 進行落差分析。` : `Running gap analysis against ${intelligenceBrief.targetCompany}.`}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setIntelligenceBrief(null)} 
                    className="text-xs text-gray-500 hover:text-white underline"
                >
                    {isZh ? '退出比較' : 'Exit Mode'}
                </button>
            </div>
        )}

        <div className="flex justify-between items-end">
            <div className="flex items-center gap-4">
                {/* Visual removed, handled by UniversalHeader */}
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                <button onClick={() => setActiveTab('service')} className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'service' ? 'bg-celestial-purple text-white' : 'text-gray-400 hover:text-white'}`}>{isZh ? '專業健檢服務' : 'Pro Assessment'}</button>
                <button onClick={() => setActiveTab('lite_check')} className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'lite_check' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>{isZh ? '快速自評 (Lite)' : 'Self Check'}</button>
            </div>
        </div>

        {activeTab === 'service' && (
            <div className="space-y-8">
                {/* Service Intro */}
                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        {isZh ? '不只是指標比對，而是永續體質的全面掃描' : 'Beyond Indicators: A Full Body Scan of Sustainability'}
                    </h3>
                    <p className="text-gray-300 leading-relaxed max-w-4xl">
                        {isZh 
                            ? 'ESG Sunshine 整合 AI × 永續治理 × 創價型 ESG 方法學，提供企業真正可行、可落地的診斷。這不是打分數，而是協助您找到最適合的「永續成長曲線」。' 
                            : 'Integrating AI, Governance, and Value-Creating ESG methodologies to provide actionable diagnosis. We identify your optimal sustainability growth curve.'}
                    </p>
                </div>

                {/* Dual Track Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Compliance Track */}
                    <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-emerald-500 bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            <h4 className="text-xl font-bold text-white">{isZh ? '合規型 ESG 健檢' : 'Compliance Check'}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-4 h-10">
                            {isZh ? '檢查企業是否符合國際主流框架與法規要求，降低營運風險。' : 'Verify alignment with international frameworks and regulations to minimize risk.'}
                        </p>
                        <div className="bg-white/5 rounded-xl p-4 space-y-2">
                            <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">{isZh ? '檢核重點' : 'Key Focus'}</h5>
                            <ul className="text-sm text-gray-300 space-y-2">
                                <li className="flex gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> ISSB / IFRS S1, S2</li>
                                <li className="flex gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> GRI Standards</li>
                                <li className="flex gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> TCFD / SASB</li>
                                <li className="flex gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> {isZh ? '國內淨零政策要求' : 'Domestic Net Zero Policy'}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Value Creation Track */}
                    <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-gold bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-8 h-8 text-celestial-gold" />
                            <h4 className="text-xl font-bold text-white">{isZh ? '創價型 ESG 健檢' : 'Value-Creating Check'}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-4 h-10">
                            {isZh ? 'ESG Sunshine 核心特色。透過七大模組盤點企業的「永續創造力」與商業潛力。' : 'Our core differentiator. Assessing sustainability creativity and business potential via 7 modules.'}
                        </p>
                        <div className="bg-white/5 rounded-xl p-4 space-y-2">
                            <h5 className="text-xs font-bold text-celestial-gold uppercase tracking-wider mb-2">{isZh ? '分析面向' : 'Analysis Dimensions'}</h5>
                            <ul className="text-sm text-gray-300 space-y-2">
                                <li className="flex gap-2"><Target className="w-4 h-4 text-celestial-gold"/> {isZh ? '願景與文明敘事一致性' : 'Vision & Narrative Alignment'}</li>
                                <li className="flex gap-2"><Target className="w-4 h-4 text-celestial-gold"/> {isZh ? '創新商模與再生設計' : 'Regenerative Business Models'}</li>
                                <li className="flex gap-2"><Target className="w-4 h-4 text-celestial-gold"/> {isZh ? '多方利害關係人價值' : 'Multi-stakeholder Value'}</li>
                                <li className="flex gap-2"><Target className="w-4 h-4 text-celestial-gold"/> {isZh ? '社會影響力與正向擴散' : 'Social Impact Scaling'}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Target Audience & CTA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-celestial-blue" />
                            {isZh ? '適用對象 (Who Needs This?)' : 'Target Audience'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span className="text-sm text-gray-300">{isZh ? '想在 ESG 報告前先掌握體質' : 'Pre-report health check'}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span className="text-sm text-gray-300">{isZh ? '缺乏永續治理架構的組織' : 'Lacking governance structure'}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span className="text-sm text-gray-300">{isZh ? '希望以低成本快速了解現況' : 'Fast, low-cost status update'}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span className="text-sm text-gray-300">{isZh ? '需要永續與策略的整體盤點' : 'Strategic holistic review'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-celestial-purple/30 bg-celestial-purple/10 flex flex-col justify-center items-center text-center">
                        <ClipboardCheck className="w-12 h-12 text-celestial-purple mb-4" />
                        <h4 className="text-lg font-bold text-white mb-2">{isZh ? '立即預約專業健檢' : 'Book Assessment'}</h4>
                        <p className="text-xs text-gray-400 mb-6">
                            {isZh ? '獲得完整體質報告與 90 天衝刺藍圖。' : 'Get full report & 90-day sprint plan.'}
                        </p>
                        <button 
                            onClick={handleRequestService}
                            className="w-full py-3 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-all shadow-lg"
                        >
                            {isZh ? '聯絡顧問' : 'Contact Consultant'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'lite_check' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">{isZh ? '快速自我評估 (Lite)' : 'Quick Self-Assessment'}</h3>
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Beta</span>
                    </div>
                    {[
                        { id: 'strategy', label: isZh ? '品牌永續戰略清晰度' : 'Brand Sustainability Strategy Clarity' },
                        { id: 'governance', label: isZh ? '治理結構與當責性' : 'Governance Structure & Accountability' },
                        { id: 'social', label: isZh ? '員工與社區參與度' : 'Employee & Community Engagement' },
                        { id: 'env', label: isZh ? '碳管理數據完整性' : 'Carbon Data Integrity' }
                    ].map((item) => (
                        <div key={item.id} className="space-y-2">
                            <label className="text-sm text-gray-300 flex justify-between">
                                {item.label}
                                <span className="font-bold text-red-400">{(formData as any)[item.id]}/5</span>
                            </label>
                            <input 
                                type="range" min="1" max="5" step="1"
                                value={(formData as any)[item.id]}
                                onChange={(e) => setFormData({...formData, [item.id]: parseInt(e.target.value)})}
                                className="w-full accent-red-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Low</span>
                                <span>High</span>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleGenerate} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all mt-4">
                        {isZh ? '生成初步分析' : 'Generate Lite Analysis'}
                    </button>
                </div>

                {isGenerated ? (
                    <div className="glass-panel p-8 rounded-2xl border border-red-500/30 bg-slate-900/80 animate-fade-in flex flex-col justify-center items-center text-center">
                        <div className="w-24 h-24 rounded-full border-8 border-red-500/20 border-t-red-500 flex items-center justify-center mb-6">
                            <span className="text-3xl font-bold text-white">72</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{isZh ? '現況：尚可' : 'Status: Moderate'}</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">
                            {isZh 
                                ? '您的戰略清晰，但在數據完整性方面存在風險。建議升級至專業版健檢以獲得詳細改善清單。' 
                                : 'Strategy is clear, but data integrity poses a risk. Upgrade to Pro Assessment for detailed action items.'}
                        </p>
                        <div className="flex flex-col gap-3 w-full">
                            <button onClick={handleRequestService} className="w-full py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-bold border border-red-500/50 flex items-center justify-center gap-2 transition-all">
                                <BarChart className="w-4 h-4" /> {isZh ? '預約完整健檢' : 'Book Full Check'}
                            </button>
                            <button onClick={handleGoToIntel} className="w-full py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-all">
                                <Search className="w-4 h-4" /> {isZh ? '尋找標竿企業 (商情)' : 'Find Benchmarks (Intel)'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center opacity-50">
                        <Activity className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-sm text-gray-500">{isZh ? '請填寫左側表單以生成報告' : 'Complete the form to generate report'}</p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
