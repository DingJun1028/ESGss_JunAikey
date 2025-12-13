
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { 
  DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem, NoteItem, BookmarkItem, 
  UserTier, CarbonData, MasteryLevel, Badge, WidgetType, AppFile, IntelligenceItem,
  UniversalCrystal, UserJournalEntry
} from '../../types';
import { UNIVERSAL_CORES } from '../../constants';
import { universalIntelligence } from '../../services/evolutionEngine';

// Initial Mock Data
const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Upload Electricity Bill', desc: 'Upload PDF invoice for HQ.', type: 'Daily', rarity: 'Common', xp: 100, status: 'active', requirement: 'image_upload' },
  { id: 'q2', title: 'Supplier Engagement', desc: 'Send survey to Tier 1 suppliers.', type: 'Weekly', rarity: 'Rare', xp: 300, status: 'active', requirement: 'manual' },
  { id: 'q3', title: 'Carbon Neutral Day', desc: 'Achieve net zero emissions for 24h.', type: 'Challenge', rarity: 'Legendary', xp: 1000, status: 'active', requirement: 'manual' }
];

interface CompanyContextType {
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  tier: UserTier;
  upgradeTier: (tier: UserTier) => void;
  
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
  addNote: (content: string, tags?: string[], title?: string) => void; 
  updateNote: (id: string, content: string, title?: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => void;
  
  // Universal File System
  files: AppFile[];
  addFile: (file: File, sourceModule: string) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<AppFile>) => void;

  // Universal Intelligence System (My Intelligence)
  myIntelligence: IntelligenceItem[];
  saveIntelligence: (item: IntelligenceItem) => void;
  
  lastBriefingDate: string;
  markBriefingRead: () => void;
  latestEvent: string;
  setLatestEvent: (event: string) => void;
  
  // Dashboard Widgets
  customWidgets: DashboardWidget[];
  addCustomWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removeCustomWidget: (id: string) => void;

  // My ESG Widgets (New)
  myEsgWidgets: DashboardWidget[];
  addMyEsgWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removeMyEsgWidget: (id: string) => void;
  updateMyEsgWidgetSize: (id: string, size: 'small' | 'medium' | 'large' | 'full') => void;

  // Palace Widgets
  palaceWidgets: DashboardWidget[];
  addPalaceWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removePalaceWidget: (id: string) => void;
  
  checkBadges: () => Badge[];
  resetData: () => void;

  // New: Cross-Module Intelligence
  intelligenceBrief: any;
  setIntelligenceBrief: (data: any) => void;

  // Unlock Status
  isAiToolsUnlocked: boolean;
  unlockAiTools: () => void;

  // Universal Crystal System (The Cores)
  crystals: UniversalCrystal[];
  collectCrystalFragment: (crystalId: string) => void;
  restoreCrystal: (crystalId: string) => void;

  // User Journal
  journal: UserJournalEntry[];
  addJournalEntry: (title: string, impact: string, xp: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Profile
  const [userName, setUserName] = useState('DingJun Hong');
  const [userRole, setUserRole] = useState('CSO');
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
          aiSummary: "**Executive Summary:**\n- **Achievements:** Achieved 15% reduction in Scope 1 emissions via solar transition. Reached 40% gender diversity in senior leadership.\n- **Challenges:** Scope 3 data collection gaps in Tier-2 suppliers. Water usage efficiency dropped by 2% due to expansion.",
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
  
  // Optimized Default Layout for "Top-Left Gravity" & "Complete Look"
  const [myEsgWidgets, setMyEsgWidgets] = useState<DashboardWidget[]>([
      // Row 1: Profile (1) | Yang Bo (2) | Quests (1)
      { id: 'me-1', type: 'kpi_card', title: 'Profile', config: { type: 'profile' }, gridSize: 'small' },
      { id: 'me-yb', type: 'yang_bo_feed', title: 'Dr. Yang Insights', config: {}, gridSize: 'medium' },
      { id: 'me-2', type: 'quest_list', title: 'Daily Quests', config: {}, gridSize: 'small' },
      
      // Row 2: Events (2) | Todo (2)
      { id: 'me-events', type: 'event_list', title: 'Latest Activity', config: {}, gridSize: 'medium' },
      { id: 'me-note', type: 'quick_note', title: 'To-Do', config: {}, gridSize: 'medium' },
  ]);

  const [palaceWidgets, setPalaceWidgets] = useState<DashboardWidget[]>([
      { id: 'pw1', type: 'quest_list', title: 'Daily Quests', gridSize: 'medium' },
      { id: 'pw2', type: 'intel_feed', title: 'My Intel', gridSize: 'medium' },
      { id: 'pw3', type: 'quick_note', title: 'Quick Notes', gridSize: 'small' }
  ]);
  
  // Cross-Module State
  const [intelligenceBrief, setIntelligenceBrief] = useState<any>(null);

  // Computed
  const level = Math.floor(xp / 1000) + 1;
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem('esgss_state_v5');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserName(data.userName || 'DingJun Hong');
        setUserRole(data.userRole || 'CSO');
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
        // Only load if exists, else use default logic above
        if(data.myEsgWidgets) setMyEsgWidgets(data.myEsgWidgets);
        setPalaceWidgets(data.palaceWidgets || [
            { id: 'pw1', type: 'quest_list', title: 'Daily Quests', gridSize: 'medium' },
            { id: 'pw2', type: 'intel_feed', title: 'My Intel', gridSize: 'medium' },
            { id: 'pw3', type: 'quick_note', title: 'Quick Notes', gridSize: 'small' }
        ]);
        setIsAiToolsUnlocked(data.isAiToolsUnlocked || false);
        if(data.crystals) setCrystals(data.crystals);
        if(data.journal) setJournal(data.journal);
      } catch (e) { console.error("Failed to load state", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    const state = {
      userName, userRole, companyName, tier, xp, goodwillBalance, esgScores, carbonData,
      budget, carbonCredits, collectedCards, purifiedCards, cardMastery, auditLogs,
      todos, universalNotes, bookmarks, files, myIntelligence, lastBriefingDate, customWidgets, myEsgWidgets, palaceWidgets,
      isAiToolsUnlocked, crystals, journal
    };
    localStorage.setItem('esgss_state_v5', JSON.stringify(state));
  }, [userName, userRole, companyName, tier, xp, goodwillBalance, esgScores, carbonData, budget, carbonCredits, collectedCards, purifiedCards, cardMastery, auditLogs, todos, universalNotes, bookmarks, files, myIntelligence, lastBriefingDate, customWidgets, myEsgWidgets, palaceWidgets, isAiToolsUnlocked, crystals, journal]);

  // Actions wrapped in useCallback for performance
  const addJournalEntry = useCallback((title: string, impact: string, xpGain: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => {
      const entry: UserJournalEntry = {
          id: `j-${Date.now()}`,
          timestamp: Date.now(),
          title,
          impact,
          xpGained: xpGain,
          type,
          tags
      };
      setJournal(prev => [entry, ...prev].slice(0, 100)); // Keep last 100
  }, []);

  const upgradeTier = useCallback((newTier: UserTier) => setTier(newTier), []);
  
  const awardXp = useCallback((amount: number, reason: string = 'Activity') => {
      setXp(prev => prev + amount);
      if (amount >= 50) {
          addJournalEntry(reason, `Gained ${amount} XP`, amount, 'action', ['Growth']);
      }
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
    if (!collectedCards.includes(id)) {
      setCollectedCards(prev => [...prev, id]);
    }
  }, [collectedCards]);
  
  const purifyCard = useCallback((id: string) => {
    if (!purifiedCards.includes(id)) {
      setPurifiedCards(prev => [...prev, id]);
    }
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
  
  const addNote = useCallback((content: string, tags: string[] = [], title?: string) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const generatedTitle = title || `${dateStr} - New Note`;
    setUniversalNotes(prev => [{ 
        id: Date.now().toString(), 
        title: generatedTitle,
        content, 
        tags, 
        createdAt: Date.now(), 
        source: 'manual',
        backlinks: []
    }, ...prev]);
  }, []);
  
  const updateNote = useCallback((id: string, content: string, title?: string, tags?: string[]) => {
    setUniversalNotes(prev => prev.map(n => n.id === id ? { ...n, content, title: title || n.title, tags: tags || n.tags } : n));
  }, []);
  
  const deleteNote = useCallback((id: string) => {
    setUniversalNotes(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const toggleBookmark = useCallback((item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => {
    setBookmarks(prev => {
        if (prev.some(b => b.id === item.id)) {
            return prev.filter(b => b.id !== item.id);
        } else {
            return [{ ...item, addedAt: Date.now() }, ...prev];
        }
    });
  }, []);

  const addFile = useCallback((file: File, sourceModule: string) => {
      const newFile: AppFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          type: file.type.split('/')[1] || 'unknown',
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadDate: Date.now(),
          sourceModule,
          status: 'scanning',
          tags: ['Incoming'],
          confidence: 0
      };
      
      setFiles(prev => [newFile, ...prev]);
      
      setTimeout(() => {
          setFiles(prev => prev.map(f => {
              if (f.id === newFile.id) {
                  const autoTags = ['Processed'];
                  let summary = 'AI has indexed this file.';
                  
                  if (sourceModule === 'ResearchHub') {
                      autoTags.push('Research');
                      summary = 'Contains regulatory keywords.';
                  } else if (sourceModule === 'UniversalTools') {
                      autoTags.push('Knowledge');
                      summary = 'Added to Neural Network training set.';
                  } else {
                      autoTags.push('Operations');
                  }

                  // Auto-collect Crystal Fragment for Perception Core
                  if (Math.random() > 0.5) {
                      collectCrystalFragment('core-perception');
                  }

                  return {
                      ...f,
                      status: 'processed',
                      tags: [...f.tags, ...autoTags],
                      aiSummary: summary,
                      confidence: 95
                  };
              }
              return f;
          }));
      }, 2500);
  }, []);

  const removeFile = useCallback((id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<AppFile>) => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const saveIntelligence = useCallback((item: IntelligenceItem) => {
      setMyIntelligence(prev => [item, ...prev]);
      universalIntelligence.recordInteraction({
          componentId: 'Intel_Ingestion',
          eventType: 'ai-trigger',
          timestamp: Date.now(),
          payload: { title: item.title, type: item.type }
      });
      // Collecting cognition fragments
      collectCrystalFragment('core-cognition');
  }, []);
  
  const markBriefingRead = useCallback(() => setLastBriefingDate(new Date().toDateString()), []);
  
  const addCustomWidget = useCallback((widget: Partial<DashboardWidget>) => {
    const newWidget: DashboardWidget = {
      id: `w-${Date.now()}`,
      type: widget.type || 'kpi_card',
      title: widget.title || 'New Widget',
      config: widget.config || {},
      gridSize: widget.gridSize || 'small'
    };
    setCustomWidgets(prev => [...prev, newWidget]);
  }, []);
  
  const removeCustomWidget = useCallback((id: string) => {
    setCustomWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  // My ESG Widgets Helpers
  const addMyEsgWidget = useCallback((widget: Partial<DashboardWidget>) => {
    const newWidget: DashboardWidget = {
      id: `me-${Date.now()}`,
      type: widget.type || 'kpi_card',
      title: widget.title || 'New Widget',
      config: widget.config || {},
      gridSize: widget.gridSize || 'small'
    };
    setMyEsgWidgets(prev => [...prev, newWidget]);
  }, []);

  const removeMyEsgWidget = useCallback((id: string) => {
    setMyEsgWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const updateMyEsgWidgetSize = useCallback((id: string, size: 'small' | 'medium' | 'large' | 'full') => {
      setMyEsgWidgets(prev => prev.map(w => w.id === id ? { ...w, gridSize: size } : w));
  }, []);

  const addPalaceWidget = useCallback((widget: Partial<DashboardWidget>) => {
    const newWidget: DashboardWidget = {
      id: `pw-${Date.now()}`,
      type: widget.type || 'kpi_card',
      title: widget.title || 'New Widget',
      config: widget.config || {},
      gridSize: widget.gridSize || 'small'
    };
    setPalaceWidgets(prev => [...prev, newWidget]);
  }, []);

  const removePalaceWidget = useCallback((id: string) => {
    setPalaceWidgets(prev => prev.filter(w => w.id !== id));
  }, []);
  
  const checkBadges = useCallback((): Badge[] => [], []);
  
  const resetData = useCallback(() => {
    localStorage.removeItem('esgss_state_v5');
    window.location.reload();
  }, []);

  const unlockAiTools = useCallback(() => {
      setIsAiToolsUnlocked(true);
  }, []);

  // --- Crystal Management ---
  const collectCrystalFragment = useCallback((crystalId: string) => {
      setCrystals(prev => prev.map(c => {
          if (c.id === crystalId) {
              if (c.fragmentsCollected < c.fragmentsRequired) {
                  const newFragments = c.fragmentsCollected + 1;
                  const newState = newFragments >= c.fragmentsRequired && c.state === 'Fragmented' ? 'Crystallizing' : c.state;
                  // Log if state changed
                  if (newState !== c.state) {
                      addJournalEntry('Crystal Evolution', `${c.name} is now Crystallizing`, 500, 'milestone', ['System']);
                  }
                  return { ...c, fragmentsCollected: newFragments, state: newState };
              }
          }
          return c;
      }));
  }, [addJournalEntry]);

  const restoreCrystal = useCallback((crystalId: string) => {
      setCrystals(prev => prev.map(c => {
          if (c.id === crystalId && c.state === 'Crystallizing') {
              addJournalEntry('System Restoration', `${c.name} Fully Restored`, 1000, 'milestone', ['System']);
              return { ...c, state: 'Restored', integrity: 100 };
          }
          return c;
      }));
  }, [addJournalEntry]);

  // Optimized Context Value
  const contextValue = useMemo(() => ({
      userName, setUserName, userRole, setUserRole, companyName, setCompanyName, tier, upgradeTier,
      xp, level, awardXp, goodwillBalance, updateGoodwillBalance, esgScores, updateEsgScore, totalScore,
      carbonData, updateCarbonData, budget, setBudget, carbonCredits, setCarbonCredits,
      quests, updateQuestStatus, completeQuest, auditLogs, addAuditLog,
      collectedCards, unlockCard, purifiedCards, purifyCard, cardMastery, updateCardMastery,
      todos, addTodo, toggleTodo, deleteTodo, universalNotes, addNote, updateNote, deleteNote,
      bookmarks, toggleBookmark, lastBriefingDate, markBriefingRead, latestEvent, setLatestEvent,
      customWidgets, addCustomWidget, removeCustomWidget, 
      myEsgWidgets, addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize,
      palaceWidgets, addPalaceWidget, removePalaceWidget,
      checkBadges, resetData,
      intelligenceBrief, setIntelligenceBrief,
      files, addFile, removeFile, updateFile,
      myIntelligence, saveIntelligence,
      isAiToolsUnlocked, unlockAiTools,
      crystals, collectCrystalFragment, restoreCrystal,
      journal, addJournalEntry
  }), [
      userName, userRole, companyName, tier, xp, level, goodwillBalance, esgScores, totalScore,
      carbonData, budget, carbonCredits, quests, auditLogs, collectedCards, purifiedCards, cardMastery,
      todos, universalNotes, bookmarks, lastBriefingDate, latestEvent, customWidgets, intelligenceBrief,
      files, myIntelligence, isAiToolsUnlocked, crystals, journal, palaceWidgets, myEsgWidgets,
      upgradeTier, awardXp, updateGoodwillBalance, updateEsgScore, updateCarbonData,
      updateQuestStatus, completeQuest, addAuditLog, unlockCard, purifyCard, updateCardMastery,
      addTodo, toggleTodo, deleteTodo, addNote, updateNote, deleteNote, toggleBookmark,
      markBriefingRead, addCustomWidget, removeCustomWidget, addPalaceWidget, removePalaceWidget, checkBadges, resetData,
      addFile, removeFile, updateFile, saveIntelligence, unlockAiTools, collectCrystalFragment, restoreCrystal, addJournalEntry,
      addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize
  ]);

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
