
import React, { useState } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language, Role, NoteItem } from '../types';
import { ROLE_DEFINITIONS } from '../constants';
import { 
    Settings as SettingsIcon, Save, RotateCcw, User, Building, CreditCard, 
    Globe, ShieldAlert, Cpu, PlayCircle, Key, Plus, Trash2, CheckCircle, 
    XCircle, Crown, BookOpen, ScrollText, PenTool, Layout, BadgeCheck, 
    GraduationCap, Calendar, StickyNote, Quote, Flag
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
    bio, setBio,
    personalGoal, setPersonalGoal,
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
    bio,
    personalGoal,
    budget,
    carbonCredits,
    envScore: esgScores.environmental,
    socScore: esgScores.social,
    govScore: esgScores.governance
  });

  const [apiKeys, setApiKeys] = useState([
    { id: '1', service: 'Google Gemini', key: 'sk-********************', status: 'active' },
    { id: '2', service: 'Custom Model Endpoint', key: 'https://api.custom.com/v1', status: 'inactive' },
  ]);
  const [newKeyService, setNewKeyService] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    setBio(formData.bio);
    setPersonalGoal(formData.personalGoal);
    setBudget(formData.budget);
    setCarbonCredits(formData.carbonCredits);
    
    updateEsgScore('environmental', formData.envScore);
    updateEsgScore('social', formData.socScore);
    updateEsgScore('governance', formData.govScore);
    
    addAuditLog('Profile Update', `Updated profile for ${formData.userName}.`);
    addToast('success', isZh ? '設定已儲存' : 'Settings saved', 'System');
  };

  const handleAddNote = () => {
      if (!newNoteContent.trim()) return;
      addNote(newNoteContent, ['Personal'], `Palace Note ${new Date().toLocaleDateString()}`);
      setNewNoteContent('');
      addToast('success', isZh ? '筆記已儲存' : 'Note scribed', 'Scribe');
  };

  const renderEternalPalace = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl border border-celestial-gold/30 bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20"><Crown className="w-48 h-48 text-celestial-gold rotate-12" /></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative">
                      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-celestial-gold to-purple-500">
                          <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full rounded-full bg-slate-900 object-cover" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-slate-950 text-celestial-gold border border-celestial-gold/50 px-3 py-1 rounded-full text-xs font-bold shadow-lg">LV.{level}</div>
                  </div>
                  <div className="text-center md:text-left space-y-2 max-w-lg">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                          <h2 className="text-3xl font-bold text-white">{userName}</h2>
                          <BadgeCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-celestial-purple font-medium text-lg uppercase tracking-widest">{ROLE_DEFINITIONS[userRole as Role]?.label}</p>
                      <p className="text-gray-400 text-sm italic mt-2">"{bio}"</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                          <div className="px-3 py-1 bg-white/10 rounded-lg text-xs text-gray-300 border border-white/10 flex items-center gap-2"><PlayCircle className="w-3 h-3 text-celestial-gold" /> {xp.toLocaleString()} XP</div>
                          <div className="px-3 py-1 bg-white/10 rounded-lg text-xs text-gray-300 border border-white/10 flex items-center gap-2"><ScrollText className="w-3 h-3 text-emerald-400" /> {collectedCards.length} Cards</div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Flag className="w-5 h-5 text-emerald-400" /> {isZh ? '年度使命' : 'Mission'}</h3>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                          <p className="text-xs text-gray-300 leading-relaxed font-bold">{personalGoal}</p>
                      </div>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-400" /> {isZh ? '修課紀錄' : 'Course Records'}</h3>
                      <div className="space-y-4">
                          {[{ title: 'Carbon Mgmt 101', date: '2024.01.15', grade: 'A+' }].map((c, i) => (
                              <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                                  <div><div className="text-white font-medium">{c.title}</div><div className="text-xs text-gray-500">{c.date}</div></div>
                                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{c.grade}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2"><PenTool className="w-5 h-5 text-celestial-purple" /> {isZh ? '萬能筆記' : 'Universal Notes'}</h3>
                          <button onClick={() => setIsNoteExpanded(!isNoteExpanded)} className="text-xs text-gray-400 hover:text-white transition-colors">{isNoteExpanded ? 'Collapse' : 'Expand'}</button>
                      </div>
                      <div className="flex gap-2 mb-4">
                          <input type="text" value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} placeholder={isZh ? "快速記錄想法..." : "Capture a thought..."} className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-celestial-purple/50 transition-all" onKeyDown={(e) => e.key === 'Enter' && handleAddNote()} />
                          <button onClick={handleAddNote} className="px-4 py-2 bg-celestial-purple text-white rounded-xl hover:bg-purple-600 transition-all shadow-lg"><Plus className="w-5 h-5" /></button>
                      </div>
                      <div className={`space-y-2 overflow-y-auto custom-scrollbar transition-all duration-500 ${isNoteExpanded ? 'max-h-[500px]' : 'max-h-[200px]'}`}>
                          {universalNotes.map(note => (
                              <div key={note.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-purple/30 transition-all group flex justify-between items-start">
                                  <div><div className="text-sm text-gray-200">{note.content}</div><div className="text-[10px] text-gray-500 mt-1">{new Date(note.createdAt).toLocaleDateString()}</div></div>
                                  <button onClick={() => deleteNote(note.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderConfig = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><User className="w-5 h-5 text-celestial-purple" /> {isZh ? '個人檔案設定' : 'User Profile Config'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold ml-1">{isZh ? '顯示名稱' : 'Display Name'}</label>
                        <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-celestial-purple/50 transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold ml-1">{isZh ? '系統角色' : 'System Role'}</label>
                        <select name="userRole" value={formData.userRole} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none appearance-none cursor-pointer">
                            {Object.keys(ROLE_DEFINITIONS).map((role) => (
                                <option key={role} value={role}>{ROLE_DEFINITIONS[role as Role].label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold ml-1 flex items-center gap-1"><Quote className="w-3 h-3"/> {isZh ? '個人簡介' : 'Personal Bio'}</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} maxLength={120} className="w-full h-24 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-celestial-purple/50 transition-all resize-none text-sm" placeholder="Tell us about yourself..." />
                        <div className="text-right text-[9px] text-gray-600 font-mono">{formData.bio.length}/120</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 space-y-1">
                <label className="text-xs text-gray-400 font-bold ml-1 flex items-center gap-1"><Flag className="w-3 h-3"/> {isZh ? '個人永續目標' : 'Personal Sustainability Goal'}</label>
                <input type="text" name="personalGoal" value={formData.personalGoal} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50 transition-all" placeholder="e.g. Achieving Net Zero by 2030" />
            </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><Building className="w-5 h-5 text-celestial-emerald" /> {isZh ? '企業資訊' : 'Enterprise Info'}</h3>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold ml-1">{isZh ? '公司名稱' : 'Company Name'}</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-celestial-emerald/50" />
                </div>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col justify-between">
             <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-400" /> {isZh ? '危險區域' : 'Danger Zone'}</h3>
                <p className="text-sm text-gray-400 mb-6">Resetting clears all local progress data.</p>
             </div>
             <button onClick={() => {if(confirm('Reset all data?')) resetData();}} className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> {isZh ? '重置系統' : 'Reset Data'}</button>
        </div>
      </div>
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-24">
      <UniversalPageHeader icon={SettingsIcon} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} accentColor="text-indigo-400" />
      <div className="flex justify-center mb-6">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
              <button onClick={() => setActiveTab('palace')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'palace' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}><Crown className="w-4 h-4" /> {isZh ? '我的永恆宮殿' : 'Palace'}</button>
              <button onClick={() => setActiveTab('config')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'config' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><SettingsIcon className="w-4 h-4" /> {isZh ? '系統設定' : 'Settings'}</button>
          </div>
      </div>
      {activeTab === 'palace' ? renderEternalPalace() : renderConfig()}
      {activeTab === 'config' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in">
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"><Save className="w-4 h-4" /> {isZh ? '儲存變更' : 'Save Changes'}</button>
          </div>
      )}
    </div>
  );
};
