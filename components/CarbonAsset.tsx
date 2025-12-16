import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';
import { Leaf, UploadCloud, Loader2, FileText, CheckCircle, Trash2, Calculator, Save } from 'lucide-react';
import { BackendService } from '../services/backend';

interface CarbonAssetProps {
  language: Language;
}

export const CarbonAsset: React.FC<CarbonAssetProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { files, addFile, removeFile, carbonData, updateCarbonData } = useCompany();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculator State
  const [calcForm, setCalcForm] = useState({
      fuel: carbonData.fuelConsumption,
      electricity: carbonData.electricityConsumption
  });

  const pageData = {
      title: { zh: '碳資產管理', en: 'Carbon Asset Mgmt' },
      desc: { zh: 'SBTi 路徑與內部碳定價模擬', en: 'SBTi paths & Internal Carbon Pricing Simulation' },
      tag: { zh: '運營核心', en: 'Ops Core' }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setIsAnalyzing(true);
          addToast('info', isZh ? '正在上傳並解析碳數據...' : 'Uploading and analyzing carbon data...', 'Carbon AI');
          
          // Simulate AI analysis delay
          setTimeout(() => {
              addFile(file, 'CarbonAsset');
              setIsAnalyzing(false);
              addToast('success', isZh ? '數據解析完成' : 'Data Analysis Complete', 'System');
          }, 2000);
      }
  };

  const handleCalculate = () => {
      // Simple logic for demo: Fuel * 2.68 + Elec * 0.49 (example factors)
      const s1 = calcForm.fuel * 2.68; // kgCO2e/L diesel approx
      const s2 = calcForm.electricity * 0.49; // kgCO2e/kWh approx
      
      updateCarbonData({
          fuelConsumption: calcForm.fuel,
          electricityConsumption: calcForm.electricity,
          scope1: parseFloat((s1 / 1000).toFixed(2)), // to tonnes
          scope2: parseFloat((s2 / 1000).toFixed(2))  // to tonnes
      });
      
      addToast('success', isZh ? '碳排放量已更新' : 'Emissions Updated', 'Calculator');
      
      // Log to backend (optional, but good for demo)
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
            {/* Calculator Section */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 h-fit">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    {isZh ? '排放計算器 (Calculator)' : 'Emissions Calculator'}
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">{isZh ? '固定燃燒 (L) - Scope 1' : 'Stationary Combustion (L) - Scope 1'}</label>
                        <input 
                            type="number" 
                            value={calcForm.fuel}
                            onChange={(e) => setCalcForm({...calcForm, fuel: parseFloat(e.target.value) || 0})}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">{isZh ? '外購電力 (kWh) - Scope 2' : 'Purchased Electricity (kWh) - Scope 2'}</label>
                        <input 
                            type="number" 
                            value={calcForm.electricity}
                            onChange={(e) => setCalcForm({...calcForm, electricity: parseFloat(e.target.value) || 0})}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    
                    <button 
                        onClick={handleCalculate}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <Save className="w-4 h-4" />
                        {isZh ? '計算並儲存' : 'Calculate & Save'}
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <OmniEsgCell mode="list" label="Scope 1" value={`${carbonData.scope1} t`} color="emerald" />
                    <OmniEsgCell mode="list" label="Scope 2" value={`${carbonData.scope2} t`} color="blue" />
                </div>
            </div>

            {/* Upload Area */}
            <div className="lg:col-span-2 space-y-6">
                <div 
                    onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                    className={`glass-panel p-10 rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative overflow-hidden
                        ${isAnalyzing ? 'bg-emerald-500/5 cursor-wait' : 'hover:bg-white/5 hover:border-emerald-500/50'}
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-celestial-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className={`w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform ${isAnalyzing ? 'animate-pulse ring-4 ring-emerald-500/20' : ''}`}>
                        {isAnalyzing ? <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" /> : <UploadCloud className="w-10 h-10 text-emerald-400" />}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                        {isAnalyzing ? (isZh ? '正在解析報告數據...' : 'Analyzing Report Data...') : (isZh ? '上傳供應商排放報告' : 'Upload Supplier Emissions Report')}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md relative z-10">
                        {isZh 
                            ? '支援 PDF, CSV, Excel。JunAiKey 將自動提取範疇三 (Scope 3) 排放數據與查證聲明。' 
                            : 'Supports PDF, CSV, Excel. JunAiKey automatically extracts Scope 3 emissions data and verification statements.'}
                    </p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.csv,.xlsx" disabled={isAnalyzing} />
                </div>

                {/* File List */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-celestial-blue" />
                        {isZh ? '已上傳文件' : 'Uploaded Documents'}
                    </h4>
                    
                    <div className="space-y-3">
                        {carbonFiles.length === 0 && (
                            <div className="text-center text-gray-500 py-4 text-xs">
                                {isZh ? '尚無文件' : 'No documents uploaded.'}
                            </div>
                        )}
                        {carbonFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 rounded-lg">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{file.name}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <span>{file.size}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span className={file.status === 'processed' ? 'text-emerald-400' : 'text-amber-400'}>
                                                {file.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {file.status === 'processed' && (
                                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Extracted
                                        </span>
                                    )}
                                    <button 
                                        onClick={() => removeFile(file.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
