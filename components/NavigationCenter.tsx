
import React from 'react';
import { X, Map, PlayCircle, Leaf, FileText, Zap, ShieldCheck } from 'lucide-react';
import { Language, View } from '../types';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useToast } from '../contexts/ToastContext';

interface NavigationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
    onNavigate: (view: View) => void;
}

export const NavigationCenter: React.FC<NavigationCenterProps> = ({ isOpen, onClose, language, onNavigate }) => {
    const isZh = language === 'zh-TW';
    const { startJourney } = useUniversalAgent();
    const { addToast } = useToast();

    if (!isOpen) return null;

    const tours = [
        {
            id: 'carbon_kickstart',
            title: isZh ? '碳盤查新手引導' : 'Carbon Kickstart',
            desc: isZh ? '從 0 到 1 完成範疇 1 & 2 盤查。' : 'Complete Scope 1 & 2 inventory from scratch.',
            icon: Leaf,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30'
        },
        {
            id: 'report_guide',
            title: isZh ? '報告書生成教學' : 'Report Generator Guide',
            desc: isZh ? '學習如何使用 AI 撰寫 GRI 合規報告。' : 'Learn AI-driven GRI compliant reporting.',
            icon: FileText,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30'
        },
        {
            id: 'risk_sim',
            title: isZh ? '風險模擬演練' : 'Risk Simulation Drill',
            desc: isZh ? '模擬碳稅衝擊與財務韌性測試。' : 'Simulate carbon tax impact & resilience.',
            icon: Zap,
            color: 'text-celestial-gold',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30'
        },
        {
            id: 'audit_prep',
            title: isZh ? '稽核準備指南' : 'Audit Prep Guide',
            desc: isZh ? '確保數據不可篡改與合規性。' : 'Ensure data immutability & compliance.',
            icon: ShieldCheck,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30'
        }
    ];

    const handleStartTour = (tourId: string) => {
        if (tourId === 'carbon_kickstart') {
            startJourney('carbon_kickstart');
            onNavigate(View.CARBON);
            onClose();
        } else {
            addToast('info', isZh ? '此導覽即將推出' : 'This tour is coming soon', 'System');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-celestial-purple/20 rounded-lg text-celestial-purple">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{isZh ? '導覽中心' : 'Navigation Center'}</h2>
                            <p className="text-xs text-gray-400">{isZh ? '選擇您的學習路徑' : 'Choose your learning path'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tours.map((tour) => (
                        <button
                            key={tour.id}
                            onClick={() => handleStartTour(tour.id)}
                            className={`p-4 rounded-xl border flex flex-col text-left transition-all group hover:scale-[1.02] ${tour.bg} ${tour.border}`}
                        >
                            <div className="flex justify-between items-start mb-3 w-full">
                                <div className={`p-2 rounded-lg bg-black/20 ${tour.color}`}>
                                    <tour.icon className="w-6 h-6" />
                                </div>
                                <PlayCircle className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${tour.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:underline">{tour.title}</h3>
                            <p className="text-xs text-gray-300 leading-relaxed">{tour.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-white/5 text-center text-xs text-gray-500">
                    {isZh ? '完成導覽可獲得額外 XP 獎勵' : 'Complete tours to earn bonus XP'}
                </div>
            </div>
        </div>
    );
};
