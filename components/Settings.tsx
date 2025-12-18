
import React, { useState } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language, Role, NoteItem } from '../types';
import { ROLE_DEFINITIONS } from '../constants';
import { 
    Settings as SettingsIcon, Save, RotateCcw, User, Building, CreditCard, 
    Globe, ShieldAlert, Cpu, PlayCircle, Key, Plus, Trash2, CheckCircle, 
    XCircle, Crown, BookOpen, ScrollText, PenTool, Layout, BadgeCheck, 
    GraduationCap, Calendar, StickyNote
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';

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
    checkBadges,
    universalNotes, addNote, deleteNote,
    collectedCards,
    xp, level
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';
  const [activeTab, setActiveTab] = useState<'palace' | 'config'>('palace');

  // --- Note State ---
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);

  const pageData = {
      title: { zh: '使用者設定 & 永恆宮殿', en: 'User Settings & Eternal Palace' },
      desc: { zh: '個人成就、筆記與系統參數設定', en: 'Personal Achievements, Notes & System Config' },
      tag: { zh: '用戶核心', en: 'User Core' }
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

  // API Key State
  const [apiKeys, setApiKeys] = useState([
    { id: '1', service: 'Google Gemini', key: 'sk-********************', status: 'active' },
    { id: '2', service: 'Custom Model Endpoint', key: 'https://api.custom.com/v1', status: 'inactive' },
  ]);
  const [newKeyService, setNewKeyService] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    setCompanyName(formData.companyName);
    setUserName(formData.userName);
    setUserRole(formData.userRole as Role);
    setBudget(formData.budget);
    setCarbonCredits(formData.carbonCredits);
    
    updateEsgScore('environmental', formData.envScore);
    updateEsgScore('social', formData.socScore);
    updateEsgScore('governance', formData.govScore);
    
    addAuditLog('System Configuration Update', `Modified company profile, role to ${formData.userRole}, and simulation scores.`);
    
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

  const handleAddApiKey = () => {
      if (!newKeyService || !newKeyValue) return;
      setApiKeys([...apiKeys, {
          id: Date.now().toString(),
          service: newKeyService,
          key: newKeyValue.length > 8 ? newKeyValue.substring(0, 4) + '********************' + newKeyValue.substring(newKeyValue.length - 4) : '********',
          status: 'active'
      }]);
      setNewKeyService('');
      setNewKeyValue('');
      addToast('success', isZh ? '外部服務金鑰已新增' : 'External Service Key Added', 'Integrations');
  };

  const handleDeleteApiKey = (id: string) => {
      setApiKeys(prev => prev.filter(k => k.id !== id));
      addToast('info', isZh ? 'API 金鑰已刪除' : 'API Key Deleted', 'System');
  };

  const toggleApiKeyStatus = (id: string) => {
      setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'inactive' : 'active' } : k));
  };

  const handleAddNote = () => {
      if (!newNoteContent.trim()) return;
      addNote(newNoteContent, ['Personal'], `Palace Note ${new Date().toLocaleDateString()}`);
      setNewNoteContent('');
      addToast('success', isZh ? '筆記已儲存至永恆宮殿' : 'Note scribed to Eternal Palace', 'Scribe');
  };

  // --- RENDER SECTIONS ---

  const renderEternalPalace = () => (
      <div className="space-y-8 animate-fade-in">
          {/* Hero Profile */}
          <div className="glass-panel p-8 rounded-3xl border border-celestial-gold/30 bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Crown className="w-48 h-48 text-celestial-gold rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative">
                      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-celestial-gold to-purple-500">
                          <img 
                              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full bg-slate-900 object-cover" 
                          />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-slate-900 text-celestial-gold border border-celestial-gold/50 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Lv.{level}
                      </div>
                  </div>
                  <div className="text-center md:text-left space-y-2">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                          <h2 className="text-3xl font-bold text-white">{userName}</h2>
                          <BadgeCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-celestial-purple font-medium text-lg">{ROLE_DEFINITIONS[userRole as Role]?.label}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                          <div className="px-3 py-1 bg-white/10 rounded-lg text-xs text-gray-300 border border-white/10 flex items-center gap-2">
                              <PlayCircle className="w-3 h-3 text-celestial-gold" /> {xp.toLocaleString()} XP
                          </div>
                          <div className="px-3 py-1 bg-white/10 rounded-lg text-xs text-gray-300 border border-white/10 flex items-center gap-2">
                              <ScrollText className="w-3 h-3 text-emerald-400" /> {collectedCards.length} Cards
                          </div>
                          <div className="px-3 py-1 bg-white/10 rounded-lg text-xs text-gray-300 border border-white/10 flex items-center gap-2">
                              <StickyNote className="w-3 h-3 text-blue-400" /> {universalNotes.length} Notes
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Passports & Courses */}
              <div className="lg:col-span-1 space-y-6">
                  {/* Digital Passport */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-celestial-gold" />
                          {isZh ? '數位護照 & 證書' : 'Passport & Certs'}
                      </h3>
                      <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-900/30 to-slate-900 border border-emerald-500/30 flex items-center gap-3">
                              <div className="p-2 bg-emerald-500/20 rounded-lg"><CheckCircle className="w-4 h-4 text-emerald-400" /></div>
                              <div>
                                  <div className="text-sm font-bold text-white">ISO 14064 Verifier</div>
                                  <div className="text-[10px] text-emerald-400">Verified on Chain</div>
                              </div>
                          </div>
                          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/30 to-slate-900 border border-purple-500/30 flex items-center gap-3">
                              <div className="p-2 bg-purple-500/20 rounded-lg"><Crown className="w-4 h-4 text-purple-400" /></div>
                              <div>
                                  <div className="text-sm font-bold text-white">ESG Strategist</div>
                                  <div className="text-[10px] text-purple-400">Level 5 Mastery</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Course Records */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-blue-400" />
                          {isZh ? '修課紀錄' : 'Course Records'}
                      </h3>
                      <div className="space-y-4">
                          {[
                              { title: 'Carbon Mgmt 101', date: '2024.01.15', grade: 'A+' },
                              { title: 'Circular Economy', date: '2024.03.20', grade: 'In Progress' }
                          ].map((c, i) => (
                              <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                                  <div>
                                      <div className="text-white font-medium">{c.title}</div>
                                      <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {c.date}</div>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${c.grade === 'In Progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                      {c.grade}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Center/Right: Universal Notes & Collection */}
              <div className="lg:col-span-2 space-y-6">
                  {/* Universal Note Taker */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <PenTool className="w-5 h-5 text-celestial-purple" />
                              {isZh ? '萬能筆記 (Universal Notes)' : 'Universal Notes'}
                          </h3>
                          <button 
                              onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                              className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                              {isNoteExpanded ? (isZh ? '收起' : 'Collapse') : (isZh ? '展開' : 'Expand')}
                          </button>
                      </div>

                      <div className="flex gap-2 mb-4">
                          <input 
                              type="text" 
                              value={newNoteContent}
                              onChange={(e) => setNewNoteContent(e.target.value)}
                              placeholder={isZh ? "快速記錄想法..." : "Quickly capture a thought..."}
                              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-celestial-purple/50 transition-all"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                          />
                          <button 
                              onClick={handleAddNote}
                              className="px-4 py-2 bg-celestial-purple text-white rounded-xl hover:bg-purple-600 transition-all shadow-lg"
                          >
                              <Plus className="w-5 h-5" />
                          </button>
                      </div>

                      <div className={`space-y-2 overflow-y-auto custom-scrollbar transition-all duration-500 ${isNoteExpanded ? 'max-h-[500px]' : 'max-h-[200px]'}`}>
                          {universalNotes.length === 0 && (
                              <div className="text-center text-gray-500 text-sm py-4">{isZh ? '尚無筆記' : 'No notes yet.'}</div>
                          )}
                          {universalNotes.map(note => (
                              <div key={note.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-purple/30 transition-all group flex justify-between items-start">
                                  <div>
                                      <div className="text-sm text-gray-200">{note.content}</div>
                                      <div className="text-[10px] text-gray-500 mt-1 flex gap-2">
                                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                          {note.tags.map(t => <span key={t} className="text-celestial-purple">#{t}</span>)}
                                      </div>
                                  </div>
                                  <button onClick={() => deleteNote(note.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Trash2 className="w-3 h-3" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Collection Preview */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <ScrollText className="w-5 h-5 text-celestial-gold" />
                          {isZh ? '知識收藏 (最新)' : 'Knowledge Collection (Latest)'}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {collectedCards.slice(0, 4).map((cardId, idx) => (
                              <div key={idx} className="aspect-[3/4] bg-slate-800 rounded-lg border border-white/10 flex flex-col items-center justify-center p-2 text-center group cursor-pointer hover:border-celestial-gold/50 transition-all">
                                  <div className="w-8 h-8 rounded-full bg-celestial-gold/20 mb-2 group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] text-gray-400 font-mono truncate w-full">{cardId}</span>
                              </div>
                          ))}
                          {collectedCards.length === 0 && (
                              <div className="col-span-full text-center text-gray-500 text-sm py-8">
                                  {isZh ? '前往善向幣市集收集卡片' : 'Visit Marketplace to collect cards'}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderConfig = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        
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
                    <label className="text-xs text-gray-400 font-medium ml-1">{isZh ? '系統角色 (模擬)' : 'System Role (Sim)'}</label>
                    <select
                        name="userRole"
                        value={formData.userRole}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all appearance-none cursor-pointer"
                    >
                        {Object.keys(ROLE_DEFINITIONS).map((role) => (
                            <option key={role} value={role}>{ROLE_DEFINITIONS[role as Role].label}</option>
                        ))}
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1 pl-1">
                        *Changing this will update your access permissions immediately.
                    </p>
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

        {/* API Key Management */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                {isZh ? '外部服務整合 (API Keys)' : 'External Integrations (API Keys)'}
            </h3>
            
            <div className="space-y-3 mb-6">
                {apiKeys.map(key => (
                    <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group gap-3">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${key.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                {key.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-white truncate">{key.service}</div>
                                <div className="text-xs text-gray-500 font-mono truncate">{key.key}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            <button 
                                onClick={() => toggleApiKeyStatus(key.id)}
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                    key.status === 'active' 
                                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                                    : 'bg-white/5 text-gray-500 border-white/10'
                                }`}
                            >
                                {key.status === 'active' ? (isZh ? '啟用' : 'Active') : (isZh ? '停用' : 'Inactive')}
                            </button>
                            <button 
                                onClick={() => handleDeleteApiKey(key.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex-1 space-y-1 w-full">
                    <label className="text-xs text-gray-400 ml-1">{isZh ? '服務名稱' : 'Service Name'}</label>
                    <input 
                        type="text"
                        value={newKeyService}
                        onChange={(e) => setNewKeyService(e.target.value)}
                        placeholder="e.g. Google Gemini"
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                </div>
                <div className="flex-[2] space-y-1 w-full">
                    <label className="text-xs text-gray-400 ml-1">{isZh ? 'API 金鑰 / 端點' : 'API Key / Endpoint'}</label>
                    <input 
                        type="password"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                </div>
                <button 
                    onClick={handleAddApiKey}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" />
                </button>
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
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-24">
      <UniversalPageHeader 
          icon={SettingsIcon}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
          accentColor="text-indigo-400"
      />

      {/* Tabs */}
      <div className="flex justify-center mb-6">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
              <button 
                  onClick={() => setActiveTab('palace')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'palace' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                  <Crown className="w-4 h-4" />
                  {isZh ? '我的永恆宮殿' : 'My Eternal Palace'}
              </button>
              <button 
                  onClick={() => setActiveTab('config')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'config' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                  <SettingsIcon className="w-4 h-4" />
                  {isZh ? '系統設定' : 'Configuration'}
              </button>
          </div>
      </div>

      {activeTab === 'palace' && renderEternalPalace()}
      {activeTab === 'config' && renderConfig()}

      {/* Floating Save Bar (Only for Config) */}
      {activeTab === 'config' && (
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
      )}
    </div>
  );
};
