
import { 
  LayoutDashboard, GraduationCap, Settings, Activity, Target, Leaf, FileText, 
  Calculator, ShieldCheck, Coins, Home, Crown, Hexagon, Book, Globe, 
  Search, Heart, Swords, Fingerprint, Library, Wrench, Code, Info, Mail, Sparkles, Users,
  BrainCircuit, Database, Cpu, Zap, Shield, History, Terminal
} from 'lucide-react';
import { Course, SystemHealth, Language, ReportSection, EsgCard, UniversalCrystal, View, ChangelogEntry, UserJourney, Role, Permission, OmniEsgColor } from './types';

// --- VIEW VISUAL METADATA ---
export const VIEW_METADATA: Record<View, { icon: any; color: OmniEsgColor }> = {
    [View.MY_ESG]: { icon: Home, color: 'gold' },
    [View.YANG_BO]: { icon: Crown, color: 'gold' },
    [View.RESTORATION]: { icon: Sparkles, color: 'purple' },
    [View.USER_JOURNAL]: { icon: Book, color: 'gold' },
    [View.DASHBOARD]: { icon: LayoutDashboard, color: 'emerald' },
    [View.STRATEGY]: { icon: Target, color: 'emerald' },
    [View.CARBON]: { icon: Leaf, color: 'emerald' },
    [View.REPORT]: { icon: FileText, color: 'emerald' },
    [View.FINANCE]: { icon: Calculator, color: 'emerald' },
    [View.AUDIT]: { icon: ShieldCheck, color: 'emerald' },
    [View.BUSINESS_INTEL]: { icon: Globe, color: 'blue' },
    [View.RESEARCH_HUB]: { icon: Search, color: 'blue' },
    [View.ACADEMY]: { icon: GraduationCap, color: 'blue' },
    [View.LIBRARY]: { icon: Library, color: 'blue' },
    [View.GOODWILL]: { icon: Coins, color: 'rose' },
    [View.CARD_GAME_ARENA]: { icon: Swords, color: 'rose' },
    [View.FUNDRAISING]: { icon: Heart, color: 'rose' },
    [View.TALENT]: { icon: Fingerprint, color: 'rose' },
    [View.SETTINGS]: { icon: Settings, color: 'slate' },
    [View.DIAGNOSTICS]: { icon: Activity, color: 'slate' },
    [View.API_ZONE]: { icon: Code, color: 'slate' },
    [View.UNIVERSAL_TOOLS]: { icon: Wrench, color: 'slate' },
    [View.HEALTH_CHECK]: { icon: Activity, color: 'emerald' },
    [View.INTEGRATION]: { icon: LayoutDashboard, color: 'emerald' },
    [View.CULTURE]: { icon: Target, color: 'rose' },
    [View.ABOUT_US]: { icon: Info, color: 'slate' },
    [View.CONTACT_US]: { icon: Mail, color: 'slate' },
    [View.UNIVERSAL_BACKEND]: { icon: Code, color: 'slate' },
    [View.ALUMNI_ZONE]: { icon: Users, color: 'rose' },
    [View.UNIVERSAL_AGENT]: { icon: Sparkles, color: 'gold' },
    [View.CARD_GAME]: { icon: Swords, color: 'rose' }
};

// --- ACCESS CONTROL ---
export const VIEW_ACCESS_MAP: Record<View, Permission> = {
    [View.MY_ESG]: 'VIEW_CORE',
    [View.USER_JOURNAL]: 'VIEW_CORE',
    [View.RESTORATION]: 'VIEW_CORE',
    [View.CARD_GAME_ARENA]: 'VIEW_CORE',
    [View.DASHBOARD]: 'VIEW_CORE',
    [View.STRATEGY]: 'VIEW_INTEL',
    [View.CARBON]: 'VIEW_OPS',
    [View.REPORT]: 'VIEW_OPS',
    [View.TALENT]: 'VIEW_CORE',
    [View.INTEGRATION]: 'VIEW_SYS',
    [View.CULTURE]: 'VIEW_CORE',
    [View.FINANCE]: 'VIEW_FINANCE',
    [View.AUDIT]: 'VIEW_SYS',
    [View.GOODWILL]: 'VIEW_ECO',
    [View.RESEARCH_HUB]: 'VIEW_INTEL',
    [View.ACADEMY]: 'VIEW_CORE',
    [View.DIAGNOSTICS]: 'VIEW_SYS',
    [View.SETTINGS]: 'MANAGE_SETTINGS',
    [View.YANG_BO]: 'VIEW_INTEL',
    [View.BUSINESS_INTEL]: 'VIEW_INTEL',
    [View.HEALTH_CHECK]: 'VIEW_CORE',
    [View.UNIVERSAL_TOOLS]: 'VIEW_SYS',
    [View.FUNDRAISING]: 'VIEW_ECO',
    [View.ABOUT_US]: 'VIEW_CORE',
    [View.API_ZONE]: 'MANAGE_API',
    [View.ALUMNI_ZONE]: 'VIEW_ECO',
    [View.LIBRARY]: 'VIEW_INTEL',
    [View.UNIVERSAL_AGENT]: 'VIEW_CORE',
    [View.CONTACT_US]: 'VIEW_CORE',
    [View.UNIVERSAL_BACKEND]: 'VIEW_SYS',
    [View.CARD_GAME]: 'VIEW_CORE'
};

// --- ROLE CONFIGURATION ---
export const ROLE_DEFINITIONS: Record<Role, { label: string; permissions: Permission[] }> = {
    ADMIN: { 
        label: 'System Admin', 
        permissions: ['VIEW_ALL', 'VIEW_CORE', 'VIEW_OPS', 'EDIT_OPS', 'VIEW_INTEL', 'VIEW_ECO', 'VIEW_SYS', 'MANAGE_SETTINGS', 'MANAGE_API', 'VIEW_FINANCE'] 
    },
    MANAGER: { 
        label: 'CSO Manager', 
        permissions: ['VIEW_CORE', 'VIEW_OPS', 'EDIT_OPS', 'VIEW_INTEL', 'VIEW_ECO', 'VIEW_FINANCE'] 
    },
    ANALYST: { 
        label: 'ESG Analyst', 
        permissions: ['VIEW_CORE', 'VIEW_OPS', 'VIEW_INTEL'] 
    },
    AUDITOR: { 
        label: 'Compliance Auditor', 
        permissions: ['VIEW_CORE', 'VIEW_OPS', 'VIEW_SYS'] 
    }
};

// --- INTEL & RESEARCH DATA ---
export const GLOBAL_SDR_MODULES = [
    { id: 'sdr-cdp', name: 'CDP Open Data', description: 'Global disclosure data from CDP.' },
    { id: 'sdr-gri', name: 'GRI Standards Repo', description: 'Complete GRI standard library.' },
    { id: 'sdr-tcfd', name: 'TCFD Scenarios', description: 'Climate risk scenarios and factors.' },
    { id: 'sdr-sasb', name: 'SASB Industry Map', description: 'Materiality mapping by industry.' }
];

// --- LOGIN & ONBOARDING DATA ---
export const LOGIN_README = [
    { title: 'The JunAiKey Awakening', icon: 'BrainCircuit', content: 'Our AIOS kernel v15.0 has achieved Level 1 self-awareness through distributed neural resonance.' },
    { title: 'Sustainable Core', icon: 'Target', content: 'We redefine value through the lens of longevity and systemic harmony, transforming ESG from cost to competitive edge.' },
    { title: 'Neural Infrastructure', icon: 'Cpu', content: 'Built on Gemini 3 Pro reasoning lattice with Zero Hallucination Protocol (ZHP).' }
];

// --- SYSTEM CORE CRYSTALS ---
export const UNIVERSAL_CORES: UniversalCrystal[] = [
    { id: 'core-perception', name: 'Perception Core', type: 'Perception', description: 'Handles data ingestion and telemetry verification.', state: 'Fragmented', integrity: 40, fragmentsCollected: 2, fragmentsRequired: 5, linkedModule: View.CARBON, abilities: ['OCR', 'API Sync'] },
    { id: 'core-cognition', name: 'Cognition Core', type: 'Cognition', description: 'Powers deep reasoning and strategic analysis.', state: 'Fragmented', integrity: 30, fragmentsCollected: 1, fragmentsRequired: 5, linkedModule: View.STRATEGY, abilities: ['Risk Forecast'] },
    { id: 'core-memory', name: 'Memory Core', type: 'Memory', description: 'Universal knowledge storage and RAG retrieval.', state: 'Fragmented', integrity: 50, fragmentsCollected: 3, fragmentsRequired: 5, linkedModule: View.RESEARCH_HUB, abilities: ['Context RAG'] },
    { id: 'core-expression', name: 'Expression Core', type: 'Expression', description: 'Drives report generation and multi-modal synthesis.', state: 'Fragmented', integrity: 20, fragmentsCollected: 1, fragmentsRequired: 5, linkedModule: View.REPORT, abilities: ['Auto-Draft'] },
    { id: 'core-nexus', name: 'Nexus Core', type: 'Nexus', description: 'System orchestration and logic synchronization.', state: 'Fragmented', integrity: 10, fragmentsCollected: 0, fragmentsRequired: 5, linkedModule: View.INTEGRATION, abilities: ['API Logic'] }
];

// --- REPORTING STRUCTURE ---
export const REPORT_STRUCTURE: ReportSection[] = [
    { 
        id: '1', 
        title: 'Strategy & Governance', 
        griStandards: 'GRI 2', 
        subSections: [
            { id: '1.01', title: 'Board Oversight of ESG', griStandards: 'GRI 2-12', template: 'Describe governance structure for ESG oversight.', example: 'Board meets quarterly to review climate risk exposures.' },
            { id: '1.02', title: 'Materiality Assessment', griStandards: 'GRI 3', template: 'Outline process for determining material topics.', example: 'Stakeholder engagement identified Scope 3 as priority.' }
        ] 
    },
    { 
        id: '2', 
        title: 'Environmental Stewardship', 
        griStandards: 'GRI 300', 
        subSections: [
            { id: '2.01', title: 'GHG Emissions (Scope 1 & 2)', griStandards: 'GRI 305-1, 305-2', template: 'Direct and indirect emissions telemetry data.', example: 'Scope 1 emissions totaled 420.5 tCO2e this cycle.' },
            { id: '2.02', title: 'Energy Efficiency', griStandards: 'GRI 302', template: 'Energy intensity and consumption within organization.', example: 'Renewable energy mix increased to 15%.' }
        ] 
    }
];

// --- CHANGELOG & ROADMAP ---
export const SYSTEM_CHANGELOG: ChangelogEntry[] = [
    { 
        version: 'v15.0', 
        date: '2025-01-15', 
        title: 'The Singularity Update', 
        category: 'Core', 
        changes: ['Neural Kernel v3.0 Online', 'Zero Hallucination Protocol Integrated', 'Universal Crystal Restoration Project Launched'] 
    },
    { 
        version: 'v14.2', 
        date: '2024-12-01', 
        title: 'Nexus Expansion', 
        category: 'Feature', 
        changes: ['GRI 2024 Standards Mapping', 'Real-time BlueCC ERP Integration', 'Market Intel Crawler Beta'] 
    }
];

// --- JOURNEY & ONBOARDING TEMPLATES ---
export const JOURNEY_TEMPLATES: Record<string, UserJourney> = {
    carbon_kickstart: { 
        id: 'carbon_kickstart', 
        name: 'Carbon Kickstart', 
        description: 'Guided walkthrough to establish your baseline carbon inventory.', 
        steps: [
            { id: 's1', label: 'Go to Carbon Assets', targetView: View.CARBON, instruction: 'Navigate to the Carbon Asset Management module.', status: 'pending' },
            { id: 's2', label: 'Input Base Data', targetView: View.CARBON, instruction: 'Enter your monthly electricity and fuel consumption data.', status: 'pending' }
        ], 
        currentStepIndex: 0, 
        isCompleted: false 
    }
};

// --- MOCK DATA GENERATORS ---
export const getMockCourses = (lang: Language): Course[] => [
    { id: 'c1', title: lang === 'zh-TW' ? '碳盤查實務指南' : 'Practical Carbon Accounting', category: 'Compliance', level: 'Beginner', progress: 85, thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400' },
    { id: 'c2', title: lang === 'zh-TW' ? '創價型 ESG 策略實戰' : 'Value-Creating ESG Strategy', category: 'Strategy', level: 'Intermediate', progress: 40, thumbnail: 'https://images.unsplash.com/photo-1454165833767-027eeed1596e?w=400' },
    { id: 'c3', title: lang === 'zh-TW' ? '供應鏈綠色轉型' : 'Supply Chain Transformation', category: 'Operations', level: 'Advanced', progress: 10, thumbnail: 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?w=400' }
];

export const getMockHealth = (lang: Language): SystemHealth[] => [
    { module: 'AIOS Kernel', status: 'Healthy', latency: 22 },
    { module: 'Neural Bus', status: 'Healthy', latency: 8 },
    { module: 'MCP Registry', status: 'Healthy', latency: 15 },
    { module: 'SDR Sync', status: 'Warning', latency: 350 }
];

export const getEsgCards = (lang: Language): EsgCard[] => [
    { 
        id: 'card-legend-001', 
        title: lang === 'zh-TW' ? '淨零排放 (Net Zero)' : 'Net Zero Path', 
        description: 'Achieve balance between anthropogenic emissions and removals.', 
        attribute: 'Environment', 
        category: 'Climate', 
        rarity: 'Legendary', 
        term: 'Net Zero', 
        definition: 'Achieving a state in which the greenhouse gases going into the atmosphere are balanced by removal from the atmosphere.', 
        stats: { defense: 99, offense: 99 }, 
        collectionSet: 'Genesis' 
    },
    { 
        id: 'card-e1-001', 
        title: lang === 'zh-TW' ? '再生能源轉型' : 'Renewable Energy', 
        description: 'Transitioning to natural sources that are constantly replenished.', 
        attribute: 'Environment', 
        category: 'Energy', 
        rarity: 'Rare', 
        term: 'Renewable Energy', 
        definition: 'Energy from a source that is not depleted when used, such as wind or solar power.', 
        stats: { defense: 60, offense: 40 }, 
        collectionSet: 'Genesis' 
    }
];

// --- GLOBAL TRANSLATIONS ---
export const TRANSLATIONS: Record<string, any> = {
  'en-US': { 
    nav: { 
        [View.MY_ESG]: 'My ESG', 
        [View.USER_JOURNAL]: 'Journal',
        [View.RESTORATION]: 'Universal Agent',
        [View.CARD_GAME_ARENA]: 'Arena',
        [View.DASHBOARD]: 'Matrix',
        [View.STRATEGY]: 'Strategy',
        [View.CARBON]: 'Carbon',
        [View.REPORT]: 'Report',
        [View.TALENT]: 'Talent',
        [View.INTEGRATION]: 'Integration',
        [View.CULTURE]: 'Culture',
        [View.FINANCE]: 'Finance',
        [View.AUDIT]: 'Audit',
        [View.GOODWILL]: 'Marketplace',
        [View.RESEARCH_HUB]: 'Research',
        [View.ACADEMY]: 'Academy',
        [View.DIAGNOSTICS]: 'Diagnostics',
        [View.SETTINGS]: 'Settings',
        [View.YANG_BO]: 'Yang Bo',
        [View.BUSINESS_INTEL]: 'Intel',
        [View.HEALTH_CHECK]: 'Health',
        [View.UNIVERSAL_TOOLS]: 'Tools',
        [View.FUNDRAISING]: 'Impact',
        [View.ABOUT_US]: 'Manifesto',
        [View.API_ZONE]: 'API Zone',
        [View.ALUMNI_ZONE]: 'Alumni',
        [View.LIBRARY]: 'Library',
        [View.UNIVERSAL_AGENT]: 'Agent Command',
        [View.CONTACT_US]: 'Contact',
        [View.CARD_GAME]: 'Game'
    },
    dashboard: { chartTitle: 'EMISSION TRENDS' },
    academy: { progress: 'Progress', resume: 'Resume', start: 'Start' },
    diagnostics: { moduleHealth: 'Module Health', security: 'Security', uptime: 'Uptime', audit: 'Audit', alerts: 'Alerts', version: 'Version', maintenance: 'Maintenance' },
    research: { dataExplorer: 'Data Explorer', searchPlaceholder: 'Search research...', knowledgeBase: 'Knowledge Base', viewAll: 'View All', filters: 'Filters', table: { metric: 'Metric', value: 'Value', confidence: 'Confidence' } }
  },
  'zh-TW': {
    nav: { 
        [View.MY_ESG]: '我的 ESG', 
        [View.USER_JOURNAL]: '萬能日誌',
        [View.RESTORATION]: '萬能代理',
        [View.CARD_GAME_ARENA]: '競技場',
        [View.DASHBOARD]: '決策矩陣',
        [View.STRATEGY]: '策略中樞',
        [View.CARBON]: '碳資產管理',
        [View.REPORT]: '報告引擎',
        [View.TALENT]: '人才護照',
        [View.INTEGRATION]: '集成中樞',
        [View.CULTURE]: '文化機器人',
        [View.FINANCE]: '財務模擬',
        [View.AUDIT]: '稽核軌跡',
        [View.GOODWILL]: '善向幣市集',
        [View.RESEARCH_HUB]: '研究中心',
        [View.ACADEMY]: '永續學院',
        [View.DIAGNOSTICS]: '系統診斷',
        [View.SETTINGS]: '系統設定',
        [View.YANG_BO]: '楊博專區',
        [View.BUSINESS_INTEL]: '商情分析',
        [View.HEALTH_CHECK]: 'ESG 健檢',
        [View.UNIVERSAL_TOOLS]: '邏輯矩陣',
        [View.FUNDRAISING]: '善向募資',
        [View.ABOUT_US]: '系統宣言',
        [View.API_ZONE]: 'API 專區',
        [View.ALUMNI_ZONE]: '視角中心',
        [View.LIBRARY]: '善向圖書館',
        [View.UNIVERSAL_AGENT]: '代理指揮中心',
        [View.CONTACT_US]: '與我們聯繫',
        [View.CARD_GAME]: '卡牌遊戲'
    },
    dashboard: { chartTitle: '排放趨勢' },
    academy: { progress: '進度', resume: '繼續', start: '開始' },
    diagnostics: { moduleHealth: '模組健康度', security: '安全性', uptime: '運行時間', audit: '稽核', alerts: '警告', version: '版本', maintenance: '維護資訊' },
    research: { dataExplorer: '數據探索器', searchPlaceholder: '搜尋研究內容...', knowledgeBase: '知識庫', viewAll: '查看全部', filters: '篩選', table: { metric: '指標', value: '數值', confidence: '置信度' } }
  }
};
