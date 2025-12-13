
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Target, Menu, LayoutDashboard, Crown } from 'lucide-react';
import { Language } from '../types';

interface OnboardingTourProps {
  language: Language;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);
  const isZh = language === 'zh-TW';

  useEffect(() => {
      const hasSeen = sessionStorage.getItem('esgss_tour_complete');
      if (hasSeen) {
          setIsVisible(false);
      }
  }, []);

  const handleNext = () => {
      if (step < steps.length - 1) {
          setStep(prev => prev + 1);
      } else {
          setIsVisible(false);
          sessionStorage.setItem('esgss_tour_complete', 'true');
      }
  };

  const steps = [
      {
          title: isZh ? "歡迎來到 ESGss" : "Welcome to ESGss",
          desc: isZh ? "您專屬的 AI 永續決策支援系統。讓我們花一分鐘熟悉介面。" : "Your AI-powered Sustainability Decision Support System. Let's take a quick tour.",
          target: "center"
      },
      {
          title: isZh ? "左側導航欄" : "Sidebar Navigation",
          desc: isZh ? "所有功能模組皆在此，依照 MECE 原則分類為：洞察、行動、成長、系統。" : "Access all modules here, organized by Intelligence, Operations, Growth, and System.",
          target: "#sidebar-nav" // ID to point to (logical)
      },
      {
          title: isZh ? "JunAiKey AI 助手" : "JunAiKey AI Agent",
          desc: isZh ? "位於右下角的光球。雙擊頭像可啟動語音對話，隨時為您進行深度推理。" : "The orb in the bottom right. Double-tap to enable voice mode for deep reasoning.",
          target: "bottom-right"
      },
      {
          title: isZh ? "升級 Pro 版" : "Go Pro",
          desc: isZh ? "解鎖 AI 報告自動撰寫與深度風險模擬。您的旅程由此開始！" : "Unlock AI Auto-write and deep risk simulation. Your journey starts now!",
          target: "center"
      }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
        <div className="max-w-md w-full bg-slate-900 border border-celestial-emerald/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-celestial-emerald/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        {[...Array(steps.length)].map((_, i) => (
                            <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i === step ? 'bg-celestial-emerald' : 'bg-white/10'}`} />
                        ))}
                    </div>
                    <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white text-xs">Skip</button>
                </div>

                <div className="mb-8 min-h-[120px]">
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                        {step === 3 && <Crown className="w-6 h-6 text-celestial-gold" />}
                        {steps[step].title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                        {steps[step].desc}
                    </p>
                </div>

                <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    {step === steps.length - 1 ? (isZh ? '開始探索' : 'Get Started') : (isZh ? '下一步' : 'Next')}
                    {step === steps.length - 1 ? <CheckCircle className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    </div>
  );
};
