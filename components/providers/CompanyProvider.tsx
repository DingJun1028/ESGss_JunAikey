
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { 
  DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem, NoteItem, BookmarkItem, 
  UserTier, CarbonData, MasteryLevel, Badge, WidgetType, AppFile, IntelligenceItem,
  UniversalCrystal, UserJournalEntry, Role, Permission, UniversalTag
} from '../../types';
import { UNIVERSAL_CORES, ROLE_DEFINITIONS } from '../../constants';
import { universalIntelligence } from '../../services/evolutionEngine';

// Initial Mock Data
const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Upload Electricity Bill', desc: 'Upload PDF invoice for HQ.', type: 'Daily', rarity: 'Common', xp: 100, status: 'active', requirement: 'image_upload' },
  { id: 'q2', title: 'Supplier Engagement', desc: 'Send survey to Tier 1 suppliers.', type: 'Weekly', rarity: 'Rare', xp: 300, status: 'active', requirement: 'manual' },
  { id: 'q3', title: 'Carbon Neutral Day', desc: 'Achieve net zero emissions for 24h.', type: 'Challenge', rarity: 'Legendary', xp: 1000, status: 'active', requirement: 'manual' }
];

// Initial Universal Tags with Hidden Attributes and Dual Language
const INITIAL_TAGS: UniversalTag[] = [
    { id: 'ut-1', label: 'CEO Persona', labelZh: '執行長人格', labelEn: 'CEO Persona', hiddenPrompt: 'Act as a visionary CEO. Focus on strategic growth, long-term value, and high-level decision making. Use authoritative yet inspiring tone.', theme: 'gold', description: 'Strategy & Leadership' },
    { id: 'ut-2', label: 'Critic', labelZh: '嚴厲評論家', labelEn: 'Critic', hiddenPrompt: 'Act as a rigorous auditor. Critique the content for logical fallacies, missing data, and potential risks. Be harsh but fair.', theme: 'rose', description: 'Risk & Audit' },
    { id: 'ut-3', label: 'ELI5', labelZh: '五歲聽得懂', labelEn: 'ELI5', hiddenPrompt: 'Explain Like I am 5. Simplify all concepts to their absolute core. Use analogies and simple language. Avoid jargon.', theme: 'blue', description: 'Simplification' },
    { id: 'ut-4', label: 'Socratic', labelZh: '蘇格拉底式', labelEn: 'Socratic', hiddenPrompt: 'Do not answer directly. Instead, ask guiding questions to help the user discover the answer themselves. Foster deep thinking.', theme: 'purple', description: 'Deep Thinking' },
    { id: 'ut-5', label: 'Green Washer', labelZh: '漂綠偵測', labelEn: 'Green Washer', hiddenPrompt: 'Analyze for Greenwashing risks. Flag any vague claims, unsubstantiated data, or overly positive spin on environmental impact.', theme: 'emerald', description: 'Compliance Check' },
];

interface CompanyContextType {
  userName: string;
  setUserName: (name: string) => void;
  userRole: Role;
  setUserRole: (role: Role) => void;
  bio: string;
  setBio: (bio: string) => void;
  personalGoal: string;
  setPersonalGoal: (goal: string) => void;
  roleTitle: string; 
  companyName: string;
  setCompanyName: (name: string) => void;
  tier: UserTier;
  upgradeTier: (tier: UserTier) => void;
  
  hasPermission: (permission: Permission) => boolean;

  xp: number;
  level: number;
  awardXp: (amount: number, reason?: string) => void;
  
  goodwillBalance: number;
  updateGoodwillBalance: (amount: number) => void;
  
  esgScores: { environmental: number; social: number; governance: number };
  updateEsgScore: (category: 'environmental' | 'social' | 'governance', val: number) => void;
  totalScore: number;
  
  carbonData: CarbonData;
  updateCarbonData: (data: Partial<CarbonData>) => void;
  
  budget: number;
  setBudget: (val: number) => void;
  carbonCredits: number;
  setCarbonCredits: (val: number) => void;
  
  quests: Quest[];
  updateQuestStatus: (id: string, status: 'active' | 'verifying' | 'completed') => void;
  completeQuest: (id: string, xpReward: number) => void;
  
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string) => void;
  
  collectedCards: string[];
  unlockCard: (id: string) => void;
  purifiedCards: string[];
  purifyCard: (id: string) => void;
  cardMastery: Record<string, MasteryLevel>;
  updateCardMastery: (id: string, level: MasteryLevel) => void;
  
  todos: ToDoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  
  universalNotes: NoteItem[];
  addNote: (content: string, tags?: string[], title?: string, universalTags?: string[]) => void; 
  updateNote: (id: string, content: string, title?: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => void;
  
  files: AppFile[];
  addFile: (file: File, sourceModule: string) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<AppFile>) => void;

  myIntelligence: IntelligenceItem[];
  saveIntelligence: (item: IntelligenceItem) => void;
  
  lastBriefingDate: string;
  markBriefingRead: () => void;
  latestEvent: string;
  setLatestEvent: (event: string) => void;
  
  customWidgets: DashboardWidget[];
  addCustomWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removeCustomWidget: (id: string) => void;

  myEsgWidgets: DashboardWidget[];
  addMyEsgWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removeMyEsgWidget: (id: string) => void;
  updateMyEsgWidgetSize: (id: string, size: 'small' | 'medium' | 'large' | 'full') => void;

  palaceWidgets: DashboardWidget[];
  addPalaceWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removePalaceWidget: (id: string) => void;
  
  checkBadges: () => Badge[];
  resetData: () => void;

  intelligenceBrief: any;
  setIntelligenceBrief: (data: any) => void;

  isAiToolsUnlocked: boolean;
  unlockAiTools: () => void;

  crystals: UniversalCrystal[];
  collectCrystalFragment: (crystalId: string) => void;
  restoreCrystal: (crystalId: string) => void;

  journal: UserJournalEntry[];
  addJournalEntry: (title: string, impact: string, xp: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => void;

  universalTags: UniversalTag[];
  addUniversalTag: (tag: Omit<UniversalTag, 'id'>) => void;
  deleteUniversalTag: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Profile
  const [userName, setUserName] = useState('DingJun Hong');
  const [userRole, setUserRole] = useState<Role>('ADMIN');
  const [bio, setBio] = useState('Sustainable architecture pioneer and AI integration specialist.');
  const [personalGoal, setPersonalGoal] = useState('Achieving net-zero operational status by Q4 2025.');
  const [companyName, setCompanyName] = useState('TechFlow Industries');
  const [tier, setTier] = useState<UserTier>('Free');
  
  // Gamification
  const [xp, setXp] = useState(1250);
  const [goodwillBalance, setGoodwillBalance] = useState(2450);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  
  // ESG Metrics
  const [esgScores, setEsgScores] = useState({ environmental: 72, social: 85, governance: 68 });
  const [carbonData, setCarbonData] = useState<CarbonData>({ 
    fuelConsumption: 15000, 
    electricityConsumption: 45000, 
    scope1: 420.5, 
    scope2: 380.2, 
    scope3: 1200.0, 
    lastUpdated: Date.now() 
  });
  
  // Assets
  const [budget, setBudget] = useState(500000);
  const [carbonCredits, setCarbonCredits] = useState(1500);
  const [isAiToolsUnlocked, setIsAiToolsUnlocked] = useState(false);
  
  // Collections
  const [collectedCards, setCollectedCards] = useState<string[]>(['card-legend-001', 'card-e1-001']);
  const [purifiedCards, setPurifiedCards] = useState<string[]>(['card-legend-001']);
  const [cardMastery, setCardMastery] = useState<Record<string, MasteryLevel>>({ 'card-legend-001': 'Master' });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // Universal Crystals & Journal
  const [crystals, setCrystals] = useState<UniversalCrystal[]>(UNIVERSAL_CORES);
  const [journal, setJournal] = useState<UserJournalEntry[]>([
      { id: 'j1', timestamp: Date.now() - 86400000, title: 'System Initialization', impact: 'ESGss Platform Activated', xpGained: 100, type: 'milestone', tags: ['System'] },
      { id: 'j2', timestamp: Date.now() - 43200000, title: 'Carbon Data Synced', impact: 'Scope 1 & 2 baseline established', xpGained: 50, type: 'action', tags: ['Operation'] }
  ]);

  // Universal Tags
  const [universalTags, setUniversalTags] = useState<UniversalTag[]>(INITIAL_TAGS);

  // Productivity & Files
  const [todos, setTodos] = useState<ToDoItem[]>([
      { id: 1, text: 'Review annual carbon report', done: false },
      { id: 2, text: 'Schedule supplier audit', done: true }
  ]);
  const [universalNotes, setUniversalNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [files, setFiles] = useState<AppFile[]>([
      {
          id: 'doc-123',
          name: 'FY2024_Sustainability_Report.pdf',
          type: 'pdf',
          size: '8.4 MB',
          uploadDate: Date.now() - 172800000,
          sourceModule: 'ResearchHub',
          status: 'processed',
          tags: ['GRI', 'Annual Report', 'Verified'],
          confidence: 98,
          aiSummary: "**Executive Summary (AI Analysis):**\n\n**Key Achievements:**\n- 📉 **Emissions:** Successfully reduced Scope 1 emissions by 15% through solar energy adoption.\n- 👥 **Diversity:** Achieved 40% gender diversity in executive leadership roles.\n\n**Strategic Challenges:**\n- ⚠️ **Supply Chain:** Significant data collection gaps identified in Tier-2 suppliers (Scope 3).\n- 💧 **Resource Efficiency:** Water usage intensity increased by 2% due to rapid manufacturing expansion.",
          complianceData: {
              standard: 'GRI Standards 2024',
              certId: 'GRI-2024-8821',
              issuer: 'Global Reporting Initiative',
              expiryDate: '2025-12-31'
          }
      }
  ]);
  
  // Intelligence System
  const [myIntelligence, setMyIntelligence] = useState<IntelligenceItem[]>([
      { id: 'intel-def-1', type: 'news', title: 'EU CBAM Updates', source: 'System Feed', date: new Date().toISOString(), summary: 'Latest regulatory changes.', tags: ['Compliance'], isRead: false },
      { id: 'intel-def-2', type: 'report', title: 'Yang Bo Analysis EP.24', source: 'Yang Bo Zone', date: new Date().toISOString(), summary: 'Strategic insights for Q3.', tags: ['Strategy'], isRead: false }
  ]);

  // System & Widgets
  const [lastBriefingDate, setLastBriefingDate] = useState('never');
  const [latestEvent, setLatestEvent] = useState('System Initialized');
  
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>([
    { id: 'w1', type: 'kpi_card', title: 'ESG Score', config: { metricId: '3' }, gridSize: 'small' }
  ]);
  
  const [myEsgWidgets, setMyEsgWidgets] = useState<DashboardWidget[]>([
      { id: 'me-1', type: 'profile', title: 'Profile', config: {}, gridSize: 'medium' },
      { id: 'me-yb', type: 'yang_bo_feed', title: 'Dr. Yang Insights', config: {}, gridSize: 'medium' },
      { id: 'me-2', type: 'quest_list', title: 'Daily Quests', config: {}, gridSize: 'small' },
      { id: 'me-events', type: 'event_list', title: 'Latest Activity', config: {}, gridSize: 'medium' },
      { id: 'me-note', type: 'quick_note', title: 'To-Do', config: {}, gridSize: 'medium' },
  ]);

  const [palaceWidgets, setPalaceWidgets] = useState<DashboardWidget[]>([
      { id: 'pw1', type: 'quest_list', title: 'Daily Quests', gridSize: 'medium' },
      { id: 'pw2', type: 'intel_feed', title: 'My Intel', gridSize: 'medium' },
      { id: 'pw3', type: 'quick_note', title: 'Quick Notes', gridSize: 'small' }
  ]);
  
  const [intelligenceBrief, setIntelligenceBrief] = useState<any>(null);

  // Computed
  const level = Math.floor(xp / 1000) + 1;
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));
  const roleTitle = ROLE_DEFINITIONS[userRole]?.label || userRole;

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem('esgss_state_v6');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserName(data.userName || 'DingJun Hong');
        setUserRole(data.userRole || 'ADMIN');
        setBio(data.bio || 'Sustainable architecture pioneer.');
        setPersonalGoal(data.personalGoal || 'Achieving net-zero.');
        setCompanyName(data.companyName || 'TechFlow');
        setTier(data.tier || 'Free');
        setXp(data.xp || 1250);
        setGoodwillBalance(data.goodwillBalance || 2450);
        setEsgScores(data.esgScores || { environmental: 72, social: 85, governance: 68 });
        setCarbonData(data.carbonData || { fuelConsumption: 0, electricityConsumption: 0, scope1: 0, scope2: 0, scope3: 0, lastUpdated: Date.now() });
        setBudget(data.budget || 500000);
        setCarbonCredits(data.carbonCredits || 1500);
        setCollectedCards(data.collectedCards || []);
        setPurifiedCards(data.purifiedCards || []);
        setCardMastery(data.cardMastery || {});
        setAuditLogs(data.auditLogs || []);
        setTodos(data.todos || []);
        setUniversalNotes(data.universalNotes || []);
        setBookmarks(data.bookmarks || []);
        setFiles(data.files || []);
        setMyIntelligence(data.myIntelligence || []);
        setLastBriefingDate(data.lastBriefingDate || 'never');
        setCustomWidgets(data.customWidgets || []);
        if(data.myEsgWidgets) setMyEsgWidgets(data.myEsgWidgets);
        if(data.palaceWidgets) setPalaceWidgets(data.palaceWidgets);
        setIsAiToolsUnlocked(data.isAiToolsUnlocked || false);
        if(data.crystals) setCrystals(data.crystals);
        if(data.journal) setJournal(data.journal);
        if(data.universalTags) setUniversalTags(data.universalTags);
      } catch (e) { console.error("Failed to load state", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    const state = {
      userName, userRole, bio, personalGoal, companyName, tier, xp, goodwillBalance, esgScores, carbonData,
      budget, carbonCredits, collectedCards, purifiedCards, cardMastery, auditLogs,
      todos, universalNotes, bookmarks, files, myIntelligence, lastBriefingDate, customWidgets, myEsgWidgets, palaceWidgets,
      isAiToolsUnlocked, crystals, journal, universalTags
    };
    localStorage.setItem('esgss_state_v6', JSON.stringify(state));
  }, [userName, userRole, bio, personalGoal, companyName, tier, xp, goodwillBalance, esgScores, carbonData, budget, carbonCredits, collectedCards, purifiedCards, cardMastery, auditLogs, todos, universalNotes, bookmarks, files, myIntelligence, lastBriefingDate, customWidgets, myEsgWidgets, palaceWidgets, isAiToolsUnlocked, crystals, journal, universalTags]);

  const hasPermission = useCallback((permission: Permission) => {
      const allowed = ROLE_DEFINITIONS[userRole]?.permissions || [];
      return allowed.includes(permission) || allowed.includes('VIEW_ALL');
  }, [userRole]);

  const addJournalEntry = useCallback((title: string, impact: string, xpGain: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => {
      const entry: UserJournalEntry = { id: `j-${Date.now()}`, timestamp: Date.now(), title, impact, xpGained: xpGain, type, tags };
      setJournal(prev => [entry, ...prev].slice(0, 100));
  }, []);

  const upgradeTier = useCallback((newTier: UserTier) => setTier(newTier), []);
  const awardXp = useCallback((amount: number, reason: string = 'Activity') => {
      setXp(prev => prev + amount);
      if (amount >= 50) addJournalEntry(reason, `Gained ${amount} XP`, amount, 'action', ['Growth']);
  }, [addJournalEntry]);

  const updateGoodwillBalance = useCallback((amount: number) => setGoodwillBalance(prev => prev + amount), []);
  const updateEsgScore = useCallback((cat: 'environmental' | 'social' | 'governance', val: number) => {
    setEsgScores(prev => ({ ...prev, [cat]: val }));
  }, []);
  
  const updateCarbonData = useCallback((data: Partial<CarbonData>) => {
    setCarbonData(prev => ({ ...prev, ...data, lastUpdated: Date.now() }));
  }, []);
  
  const updateQuestStatus = useCallback((id: string, status: 'active' | 'verifying' | 'completed') => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  }, []);
  
  const completeQuest = useCallback((id: string, reward: number) => {
    updateQuestStatus(id, 'completed');
    const quest = quests.find(q => q.id === id);
    awardXp(reward, `Quest Complete: ${quest?.title || 'Unknown'}`);
  }, [updateQuestStatus, awardXp, quests]);
  
  const addAuditLog = useCallback((action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      action,
      user: userName,
      details,
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      verified: true
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [userName]);
  
  const unlockCard = useCallback((id: string) => {
    if (!collectedCards.includes(id)) setCollectedCards(prev => [...prev, id]);
  }, [collectedCards]);
  
  const purifyCard = useCallback((id: string) => {
    if (!purifiedCards.includes(id)) setPurifiedCards(prev => [...prev, id]);
  }, [purifiedCards]);
  
  const updateCardMastery = useCallback((id: string, level: MasteryLevel) => {
    setCardMastery(prev => ({ ...prev, [id]: level }));
  }, []);
  
  const addTodo = useCallback((text: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  }, []);
  
  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);
  
  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);
  
  const addNote = useCallback((content: string, tags: string[] = [], title?: string, universalTags?: string[]) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const generatedTitle = title || `${dateStr} - New Note`;
    const newId = Date.now().toString();
    const newNote: NoteItem = { id: newId, title: generatedTitle, content, tags, universalTags: universalTags || [], createdAt: Date.now(), source: 'manual', backlinks: [] };
    setUniversalNotes(prev => [newNote, ...prev]);
  }, []);
  
  const updateNote = useCallback((id: string, content: string, title?: string, tags?: string[]) => {
    setUniversalNotes(prev => prev.map(n => n.id === id ? { ...n, content, title: title || n.title, tags: tags || n.tags } : n));
  }, []);
  
  const deleteNote = useCallback((id: string) => {
    setUniversalNotes(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const toggleBookmark = useCallback((item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => {
    setBookmarks(prev => prev.some(b => b.id === item.id) ? prev.filter(b => b.id !== item.id) : [{ ...item, addedAt: Date.now() }, ...prev]);
  }, []);

  const addFile = useCallback((file: File, sourceModule: string) => {
      const newFile: AppFile = { id: `f-${Date.now()}`, name: file.name, type: file.type.split('/')[1] || 'unknown', size: (file.size / 1024).toFixed(1) + ' KB', uploadDate: Date.now(), sourceModule, status: 'scanning', tags: ['Incoming'], confidence: 0 };
      setFiles(prev => [newFile, ...prev]);
      setTimeout(() => {
          setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'processed', tags: [...f.tags, 'Processed'], aiSummary: 'Indexed.', confidence: 95 } : f));
      }, 2500);
  }, []);

  const removeFile = useCallback((id: string) => setFiles(prev => prev.filter(f => f.id !== id)), []);
  const updateFile = useCallback((id: string, updates: Partial<AppFile>) => setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f)), []);
  const saveIntelligence = useCallback((item: IntelligenceItem) => setMyIntelligence(prev => [item, ...prev]), []);
  const markBriefingRead = useCallback(() => setLastBriefingDate(new Date().toDateString()), []);
  
  const addCustomWidget = useCallback((widget: Partial<DashboardWidget>) => {
    setCustomWidgets(prev => [...prev, { id: `w-${Date.now()}`, type: widget.type || 'kpi_card', title: widget.title || 'New Widget', config: widget.config || {}, gridSize: widget.gridSize || 'small' }]);
  }, []);
  
  const removeCustomWidget = useCallback((id: string) => setCustomWidgets(prev => prev.filter(w => w.id !== id)), []);

  const addMyEsgWidget = useCallback((widget: Partial<DashboardWidget>) => {
    setMyEsgWidgets(prev => [...prev, { id: `me-${Date.now()}`, type: widget.type || 'kpi_card', title: widget.title || 'New Widget', config: widget.config || {}, gridSize: widget.gridSize || 'small' }]);
  }, []);

  const removeMyEsgWidget = useCallback((id: string) => setMyEsgWidgets(prev => prev.filter(w => w.id !== id)), []);
  const updateMyEsgWidgetSize = useCallback((id: string, size: 'small' | 'medium' | 'large' | 'full') => setMyEsgWidgets(prev => prev.map(w => w.id === id ? { ...w, gridSize: size } : w)), []);

  const addPalaceWidget = useCallback((widget: Partial<DashboardWidget>) => {
    setPalaceWidgets(prev => [...prev, { id: `pw-${Date.now()}`, type: widget.type || 'kpi_card', title: widget.title || 'New Widget', config: widget.config || {}, gridSize: widget.gridSize || 'small' }]);
  }, []);

  const removePalaceWidget = useCallback((id: string) => setPalaceWidgets(prev => prev.filter(w => w.id !== id)), []);
  const resetData = useCallback(() => { localStorage.removeItem('esgss_state_v6'); window.location.reload(); }, []);

  const contextValue = useMemo(() => ({
      userName, setUserName, userRole, setUserRole, bio, setBio, personalGoal, setPersonalGoal, roleTitle, companyName, setCompanyName, tier, upgradeTier, hasPermission,
      xp, level, awardXp, goodwillBalance, updateGoodwillBalance, esgScores, updateEsgScore, totalScore,
      carbonData, updateCarbonData, budget, setBudget, carbonCredits, setCarbonCredits,
      quests, updateQuestStatus, completeQuest, auditLogs, addAuditLog,
      collectedCards, unlockCard, purifiedCards, purifyCard, cardMastery, updateCardMastery,
      todos, addTodo, toggleTodo, deleteTodo, universalNotes, addNote, updateNote, deleteNote,
      bookmarks, toggleBookmark, lastBriefingDate, markBriefingRead, latestEvent, setLatestEvent,
      customWidgets, addCustomWidget, removeCustomWidget, 
      myEsgWidgets, addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize,
      palaceWidgets, addPalaceWidget, removePalaceWidget,
      checkBadges: () => [], resetData,
      intelligenceBrief, setIntelligenceBrief,
      files, addFile, removeFile, updateFile,
      myIntelligence, saveIntelligence,
      isAiToolsUnlocked, unlockAiTools: () => setIsAiToolsUnlocked(true),
      crystals: UNIVERSAL_CORES, collectCrystalFragment: () => {}, restoreCrystal: () => {},
      journal, addJournalEntry,
      universalTags, addUniversalTag: () => {}, deleteUniversalTag: () => {}
  }), [
      userName, userRole, bio, personalGoal, companyName, tier, xp, level, goodwillBalance, esgScores, totalScore,
      carbonData, budget, carbonCredits, quests, auditLogs, collectedCards, purifiedCards, cardMastery,
      todos, universalNotes, bookmarks, lastBriefingDate, latestEvent, customWidgets, intelligenceBrief,
      files, myIntelligence, isAiToolsUnlocked, journal, palaceWidgets, myEsgWidgets, roleTitle, universalTags,
      upgradeTier, awardXp, updateGoodwillBalance, updateEsgScore, updateCarbonData,
      updateQuestStatus, completeQuest, addAuditLog, unlockCard, purifyCard, updateCardMastery,
      addTodo, toggleTodo, deleteTodo, addNote, updateNote, deleteNote, toggleBookmark,
      markBriefingRead, addCustomWidget, removeCustomWidget, addPalaceWidget, removePalaceWidget, resetData,
      addFile, removeFile, updateFile, saveIntelligence, addJournalEntry,
      addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize, hasPermission
  ]);

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) throw new Error('useCompany must be used within a CompanyProvider');
  return context;
};
