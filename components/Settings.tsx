
import React, { useState } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language } from '../types';
import { Settings as SettingsIcon, Save, RotateCcw, User, Building, CreditCard, Globe, ShieldAlert, Cpu, PlayCircle } from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';

interface SettingsProps {
  language: Language;
}

export const Settings: React.FC<SettingsProps> = ({ language }) => {
  const { 
    companyName, setCompanyName, 
    userName, setUserName,
    userRole, setUserRole,
    budget, setBudget,
    carbonCredits, setCarbonCredits,
    esgScores, updateEsgScore,
    resetData,
    addAuditLog,
    checkBadges 
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';

  const pageData = {
      title: { zh: '系統設定', en: 'Settings' },
      desc: { zh: '管理個人資料、企業參數與模擬環境', en: 'Manage profile, enterprise parameters, and simulation environment' },
      tag: { zh: '配置核心', en: 'Config Core' }
  };

  const [formData, setFormData] = useState({
    companyName,
    userName,
    userRole,
    budget,
    carbonCredits,
    envScore: esgScores.environmental,
    socScore: esgScores.social,
    govScore: esgScores.governance
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    setCompanyName(formData.companyName);
    setUserName(formData.userName);
    setUserRole(formData.userRole);
    setBudget(formData.budget);
    setCarbonCredits(formData.carbonCredits);
    
    updateEsgScore('environmental', formData.envScore);
    updateEsgScore('social', formData.socScore);
    updateEsgScore('governance', formData.govScore);
    
    addAuditLog('System Configuration Update', `Modified company profile, budget ($${formData.budget}), and simulation scores.`);
    
    setTimeout(() => {
        const newBadges = checkBadges();
        if(newBadges.length > 0) {
            addToast('reward', isZh ? `設定變更觸發成就：${newBadges[0].name}` : `Settings triggered badge: ${newBadges[0].name}`, 'God Mode');
        } else {
            addToast('success', isZh ? '設定已儲存並記錄於稽核軌跡' : 'Settings saved & logged to Audit Trail', 'System');
        }
    }, 100);
  };

  const handleReplayOnboarding = () => {
      sessionStorage.removeItem('esgss_boot_sequence');
      window.location.reload();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-24">
      <UniversalPageHeader 
          icon={SettingsIcon}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Section */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-celestial-purple" />
                {isZh ? '個人檔案' : 'User Profile'}
            </h3>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '顯示名稱' : 'Display Name'}</label>
                    <input 
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '職稱' : 'Job Title'}</label>
                    <input 
                        type="text"
                        name="userRole"
                        value={formData.userRole}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all"
                    />
                </div>
            </div>
        </div>

        {/* Enterprise Section */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-celestial-emerald" />
                {isZh ? '企業資訊' : 'Enterprise Info'}
            </h3>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '公司名稱' : 'Company Name'}</label>
                    <input 
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-celestial-emerald outline-none transition-all"
                    />
                </div>
                 <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '所在區域 (模擬)' : 'Region (Simulated)'}</label>
                    <div className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed flex items-center gap-2">
                         <Globe className="w-4 h-4" />
                         Global / Multi-region
                    </div>
                </div>
            </div>
        </div>

        {/* Simulation Parameters - ESG Scores */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-celestial-gold" />
                {isZh ? '模擬參數 (God Mode) - ESG 權重' : 'Simulation Params (God Mode) - ESG Weights'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1 flex justify-between">
                        <span>Environment Score</span>
                        <span className="text-emerald-400">{formData.envScore}</span>
                    </label>
                    <input 
                        type="range" min="0" max="100" step="0.5"
                        name="envScore"
                        value={formData.envScore}
                        onChange={handleChange}
                        className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1 flex justify-between">
                        <span>Social Score</span>
                        <span className="text-blue-400">{formData.socScore}</span>
                    </label>
                    <input 
                        type="range" min="0" max="100" step="0.5"
                        name="socScore"
                        value={formData.socScore}
                        onChange={handleChange}
                        className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1 flex justify-between">
                        <span>Governance Score</span>
                        <span className="text-purple-400">{formData.govScore}</span>
                    </label>
                    <input 
                        type="range" min="0" max="100" step="0.5"
                        name="govScore"
                        value={formData.govScore}
                        onChange={handleChange}
                        className="w-full accent-purple-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>

        {/* Financial & Inventory */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '年度預算 (USD)' : 'Annual Budget (USD)'}</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input 
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-celestial-gold font-mono focus:ring-1 focus:ring-celestial-gold outline-none transition-all"
                        />
                    </div>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '碳權庫存 (tCO2e)' : 'Carbon Credits Inventory (tCO2e)'}</label>
                     <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="number"
                            name="carbonCredits"
                            value={formData.carbonCredits}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-emerald-400 font-mono focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* System Actions */}
        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col justify-between md:col-span-2">
             <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    {isZh ? '危險區域' : 'Danger Zone'}
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                    {isZh ? '重置將清除所有本地儲存的數據，恢復為預設值。' : 'Reset will clear all local storage and revert to factory defaults.'}
                </p>
             </div>
             <div className="flex gap-4">
                 <button 
                    onClick={handleReplayOnboarding}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                 >
                    <PlayCircle className="w-4 h-4" />
                    {isZh ? '重播引導動畫' : 'Replay Onboarding'}
                 </button>
                 <button 
                    onClick={() => {
                        if(confirm(isZh ? '確定要重置所有系統數據嗎？' : 'Are you sure you want to reset all system data?')) {
                            resetData();
                        }
                    }}
                    className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                 >
                    <RotateCcw className="w-4 h-4" />
                    {isZh ? '重置系統' : 'Factory Reset'}
                 </button>
             </div>
        </div>

      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in">
          <span className="text-sm text-gray-400 hidden md:inline">{isZh ? '記得儲存您的變更' : 'Remember to save your changes'}</span>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Save className="w-4 h-4" />
            {isZh ? '儲存變更' : 'Save Changes'}
          </button>
      </div>
    </div>
  );
};
