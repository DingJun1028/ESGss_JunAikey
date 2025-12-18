import React, { useState, useRef } from 'react';
import { Language, CarbonData } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';
import { Leaf, UploadCloud, Loader2, FileText, CheckCircle, Trash2, Calculator, Save, AlertTriangle } from 'lucide-react';
import { BackendService } from '../services/backend';
import { VerificationEngine } from '../services/verificationEngine';
import { universalIntelligence } from '../services/evolutionEngine';

interface CarbonAssetProps {
  language: Language;
}

export const CarbonAsset: React.FC<CarbonAssetProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { files, addFile, removeFile, carbonData, updateCarbonData } = useCompany();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [calcForm, setCalcForm] = useState({
      fuel: carbonData.fuelConsumption,
      electricity: carbonData.electricityConsumption
  });

  const pageData = {
      title: { zh: '碳資產管理', en: 'Carbon Asset Mgmt' },
      desc: { zh: 'SBTi 路徑與內部碳定價模擬', en: 'SBTi paths & Internal Carbon Pricing Simulation' },
      tag: { zh: '運營核心', en: 'Ops Core' }
  };

  const handleCalculate = () => {
      const s1 = calcForm.fuel * 2.68; 
      const s2 = calcForm.electricity * 0.49; 
      
      // Fixed: included missing scope3 property required by CarbonData type
      const newData: CarbonData = {
          fuelConsumption: calcForm.fuel,
          electricityConsumption: calcForm.electricity,
          scope1: parseFloat((s1 / 1000).toFixed(2)),
          scope2: parseFloat((s2 / 1000).toFixed(2)),
          scope3: carbonData.scope3,
          lastUpdated: Date.now()
      };

      // --- 強化點：底層數據單元檢驗 ---
      const check = VerificationEngine.checkCarbonIntegrity(newData);
      
      if (check.status === 'INVALID') {
          addToast('error', isZh ? `數據檢核失敗：${check.messages[0]}` : `Verification Failed: ${check.messages[0]}`, 'Logic Guard');
          return;
      }

      if (check.status === 'WARNING') {
          addToast('warning', isZh ? `偵測到數據異常：${check.messages[0]}` : `Anomaly Detected: ${check.messages[0]}`, 'Data Quality');
      }

      updateCarbonData(newData);
      // 發送事件至神經網絡，觸發其他模組的反射
      universalIntelligence.emit('CARBON_UPDATED', newData);
      
      addToast('success', isZh ? '碳排放量已更新' : 'Emissions Updated', 'Calculator');
      
      BackendService.logActivity({
          date: new Date().toISOString(),
          amount: calcForm.electricity,
          source: 'Electricity',
          memo: 'Manual Entry'
      });
  };

  const carbonFiles = files.filter(f => f.sourceModule === 'CarbonAsset');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Leaf}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
            accentColor="text-emerald-400"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 h-fit">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    {isZh ? '排放計算器 (Unit: kg/L)' : 'Calculator'}
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Stationary Combustion (L)</label>
                        <input 
                            type="number" 
                            value={calcForm.fuel}
                            onChange={(e) => setCalcForm({...calcForm, fuel: parseFloat(e.target.value) || 0})}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Electricity (kWh)</label>
                        <input 
                            type="number" 
                            value={calcForm.electricity}
                            onChange={(e) => setCalcForm({...calcForm, electricity: parseFloat(e.target.value) || 0})}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    
                    <button 
                        onClick={handleCalculate}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <Save className="w-4 h-4" />
                        {isZh ? '執行邏輯校驗並儲存' : 'Verify & Save'}
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-celestial-gold" />
                        {isZh ? '數據品質監測 (Verification Feedback)' : 'Data Quality'}
                    </h4>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[11px] text-gray-400">
                        {VerificationEngine.checkCarbonIntegrity(carbonData).status === 'VALID' ? (
                            <span className="text-emerald-400">> System status: VALID. No logic errors found.</span>
                        ) : (
                            <span className="text-amber-400">> System status: {VerificationEngine.checkCarbonIntegrity(carbonData).status}. Warnings in buffer.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};