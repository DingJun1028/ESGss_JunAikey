
import { Metric, Course, SystemHealth, Language, ReportSection, EsgCard, CardSynergy, UniversalCrystal, View, ChangelogEntry, UserJourney, OmniEsgTrait, Role, Permission } from './types';

// --- RBAC CONSTANTS ---

export const ROLE_DEFINITIONS: Record<Role, { label: string; permissions: Permission[] }> = {
    ADMIN: {
        label: 'Super Admin (CSO)',
        permissions: [
            'VIEW_ALL', 'VIEW_CORE', 'VIEW_OPS', 'EDIT_OPS', 'VIEW_INTEL', 'VIEW_ECO', 'VIEW_SYS', 'MANAGE_SETTINGS', 'MANAGE_API', 'VIEW_FINANCE'
        ]
    },
    MANAGER: {
        label: 'Sustainability Manager',
        permissions: [
            'VIEW_CORE', 'VIEW_OPS', 'EDIT_OPS', 'VIEW_INTEL', 'VIEW_ECO', 'VIEW_FINANCE', 'VIEW_SYS'
        ]
    },
    ANALYST: {
        label: 'ESG Analyst',
        permissions: [
            'VIEW_CORE', 'VIEW_OPS', 'VIEW_INTEL', 'VIEW_ECO'
        ]
    },
    AUDITOR: {
        label: 'External Auditor',
        permissions: [
            'VIEW_OPS', 'VIEW_ECO'
        ]
    }
};

export const VIEW_ACCESS_MAP: Record<View, Permission> = {
    // Core
    [View.MY_ESG]: 'VIEW_CORE',
    [View.YANG_BO]: 'VIEW_CORE',
    [View.USER_JOURNAL]: 'VIEW_CORE',
    [View.RESTORATION]: 'VIEW_CORE',
    [View.CARD_GAME_ARENA]: 'VIEW_CORE',
    [View.UNIVERSAL_AGENT]: 'VIEW_CORE',
    [View.ABOUT_US]: 'VIEW_CORE',

    // Ops
    [View.DASHBOARD]: 'VIEW_OPS',
    [View.STRATEGY]: 'VIEW_OPS',
    [View.CARBON]: 'EDIT_OPS', // Requires higher privilege
    [View.REPORT]: 'EDIT_OPS',
    [View.INTEGRATION]: 'VIEW_OPS',
    [View.FINANCE]: 'VIEW_FINANCE',
    [View.AUDIT]: 'VIEW_OPS',
    [View.HEALTH_CHECK]: 'VIEW_OPS',

    // Intel
    [View.BUSINESS_INTEL]: 'VIEW_INTEL',
    [View.RESEARCH_HUB]: 'VIEW_INTEL',
    [View.ACADEMY]: 'VIEW_INTEL',
    [View.LIBRARY]: 'VIEW_INTEL',

    // Eco
    [View.GOODWILL]: 'VIEW_ECO',
    [View.FUNDRAISING]: 'VIEW_ECO',
    [View.ALUMNI_ZONE]: 'VIEW_ECO',
    [View.TALENT]: 'VIEW_ECO',
    [View.CULTURE]: 'VIEW_ECO',

    // Sys
    [View.SETTINGS]: 'MANAGE_SETTINGS',
    [View.DIAGNOSTICS]: 'VIEW_SYS',
    [View.API_ZONE]: 'MANAGE_API',
    [View.UNIVERSAL_BACKEND]: 'MANAGE_API',
    [View.UNIVERSAL_TOOLS]: 'VIEW_SYS',
    
    // Legacy mapping
    [View.CARD_GAME]: 'VIEW_CORE'
};

// --- LOGIN SCREEN README CONTENT ---
export const LOGIN_README = [
    {
        title: "Executive Summary",
        icon: "Target",
        content: "ESGss x JunAiKey is not just a SaaS platform; it is an intelligent organism running on AIOS. We adopt the MCP (Model Context Protocol) to deconstruct the system into 'Universal Component Cores'."
    },
    {
        title: "Core Philosophy",
        icon: "BrainCircuit",
        content: "We strictly adhere to the 'Component as Agent' philosophy. Every UI element is an autonomous agent capable of Perception, Cognition, and Expression, orchestrated by the central Kernel."
    },
    {
        title: "The Golden Triangle",
        icon: "Triangle",
        content: "1. Capital (FinanceSim)\n2. Policy (StrategyHub)\n3. Knowledge (ResearchHub)\nWe integrate these three pillars to transform compliance into competitive advantage."
    },
    {
        title: "Architecture",
        icon: "Cpu",
        content: "Powered by Gemini 3 Pro (Reasoning) and Gemini 2.5 Flash (Speed). Features Zero Hallucination Protocol via L3 Verification Layer."
    }
];

// --- Universal Cores (The Crystals) ---
export const UNIVERSAL_CORES: UniversalCrystal[] = [
    {
        id: 'core-perception',
        name: 'Perception Core (Spectral Eye)',
        type: 'Perception',
        description: 'Grants the ability to see and digitize the physical world. (OCR, Vision, IoT)',
        state: 'Fragmented',
        integrity: 45,
        fragmentsCollected: 1,
        fragmentsRequired: 4,
        linkedModule: View.RESEARCH_HUB,
        abilities: ['Spectral Scan (OCR)', 'Data Ingestion']
    },
    {
        id: 'core-cognition',
        name: 'Cognition Core (Deep Mind)',
        type: 'Cognition',
        description: 'Unlocks deep reasoning, simulation, and strategic foresight. (CoT, Game Theory)',
        state: 'Fragmented',
        integrity: 60,
        fragmentsCollected: 2,
        fragmentsRequired: 5,
        linkedModule: View.STRATEGY,
        abilities: ['Multi-Agent Debate', 'Risk Heatmap', 'Carbon Pricing Sim']
    },
    {
        id: 'core-memory',
        name: 'Memory Core (Quantum Lattice)',
        type: 'Memory',
        description: 'Stores knowledge as atomic nodes for infinite recall and context. (RAG, Vector DB)',
        state: 'Restored',
        integrity: 90,
        fragmentsCollected: 5,
        fragmentsRequired: 5,
        linkedModule: View.MY_ESG,
        abilities: ['Knowledge Graph', 'SDR Archive', 'Skill Embedding']
    },
    {
        id: 'core-expression',
        name: 'Expression Core (The Scribe)',
        type: 'Expression',
        description: 'Manifests insights into reports, visuals, and interfaces. (GenUI, Reports)',
        state: 'Crystallizing',
        integrity: 75,
        fragmentsCollected: 3,
        fragmentsRequired: 4,
        linkedModule: View.REPORT,
        abilities: ['Auto-Report Gen', 'Generative UI', 'Visual Refraction']
    },
    {
        id: 'core-nexus',
        name: 'Nexus Core (The Synapse)',
        type: 'Nexus',
        description: 'Orchestrates the entire system and connects to external reality. (API, HITL)',
        state: 'Fragmented',
        integrity: 30,
        fragmentsCollected: 1,
        fragmentsRequired: 3,
        linkedModule: View.INTEGRATION,
        abilities: ['API Gateway', 'Role Switching', 'Audit Chain']
    }
];

// --- SYSTEM CHANGELOG (Updated per discussion) ---
export const SYSTEM_CHANGELOG: ChangelogEntry[] = [
    {
        version: 'v16.0 (Future)',
        date: '2025.Q4',
        title: 'Roadmap: The Omni-Synchronization',
        category: 'Core',
        changes: [
            'Global Digital Twin: Real-time planetary ESG simulation.',
            'DAO Governance: Community-voted sustainability protocols.',
            'Quantum Uplink: Direct integration with quantum computing for molecular simulation.',
            'Holographic Interface: Spatial computing support for Vision Pro.'
        ]
    },
    {
        version: 'v15.0',
        date: '2025.05.20',
        title: 'The AIOS Awakening (Current)',
        category: 'Core',
        changes: [
            'Architecture Reborn: Established 5 Universal Cores (Perception, Cognition, Memory, Expression, Nexus).',
            'AIOS Kernel: Introduced Universal Agent Context for component-level agency.',
            'Zero Hallucination Protocol: Self-awareness mechanism locking high-risk features when integrity is low.',
            'MCP Standard: Standardized Tool Calls and Resource Mounting for external connectivity.'
        ]
    },
    {
        version: 'v14.8',
        date: '2025.05.18',
        title: 'User Journey & Compliance',
        category: 'Feature',
        changes: [
            'User Journey System: "Carbon Kickstart" guided interactive tutorial.',
            'Compliance Zone: Specialized input area for ISO/GRI certificates in File Center.',
            'Data Injection: Report Generator now actively pulls data from Carbon Assets & Compliance files.',
            'Visual Guidance: Highlighting and AI prompts for active workflow steps.'
        ]
    },
    {
        version: 'v14.5',
        date: '2025.05.15',
        title: 'Universal Notes & Palace Upgrade',
        category: 'Feature',
        changes: [
            'Universal Notes 2.0: AI toolbar for expansion, summarization, and auto-formatting.',
            'Palace Customization: Grid-based widget layout with resizeable blocks (S/M/L).',
            'Smart Tagging: Auto-generation of YYYYMMDD titles and semantic tags.',
            'Intel Bridge: One-click save from Notes to Universal Intelligence (My Intel).'
        ]
    },
    {
        version: 'v14.2',
        date: '2025.05.10',
        title: 'Navigation & Standardization',
        category: 'UI',
        changes: [
            'Navigation Reorg: Moved Yang Bo Zone to Core; Standardized "Market Analysis" & "Research Center".',
            'Universal Header: Unified page headers with breadcrumbs and tags.',
            'HOC Implementation: "withUniversalProxy" applied to key components for telemetry.'
        ]
    },
    {
        version: 'v13.8',
        date: '2025.05.01',
        title: 'Gamification & Restoration',
        category: 'Feature',
        changes: [
            'Restoration Mechanics: Crystal fragments collection system linked to feature unlocking.',
            'Goodwill Era: Card Game Arena for strategic knowledge battles.',
            'User Journal: Immutable log of XP gains and system milestones.'
        ]
    },
    {
        version: 'v1.0',
        date: '2024.01.01',
        title: 'Genesis Launch',
        category: 'Core',
        changes: [
            'Platform Initialization: Basic dashboard and calculator.',
            'Initial Release of ESGss Protocol.'
        ]
    }
];

// --- JOURNEY TEMPLATES ---
export const JOURNEY_TEMPLATES = {
    carbon_kickstart: {
        id: 'carbon_kickstart',
        name: 'Carbon Kickstart',
        description: 'Master your first Scope 1 & 2 inventory with AI guidance.',
        steps: [
            { id: 's1', label: 'Go to Carbon Asset', targetView: View.CARBON, instruction: 'Navigate to the Carbon Asset module to begin your journey.', status: 'pending' },
            { id: 's2', label: 'Open Calculator', targetView: View.CARBON, instruction: 'Switch to the "Calculator" tab to input your activity data.', status: 'pending' },
            { id: 's3', label: 'Input Activity Data', targetView: View.CARBON, instruction: 'Enter Fuel (L) and Electricity (kWh). The AI is waiting to calculate.', status: 'pending', triggerCondition: 'carbon_calculated' },
            { id: 's4', label: 'Check Audit Trail', targetView: View.AUDIT, instruction: 'Verify your data immutability in the Audit Trail.', status: 'pending' }
        ],
        currentStepIndex: 0,
        isCompleted: false
    } as UserJourney
};

// ... (Rest of existing constants: GLOBAL_GLOSSARY, TRANSLATIONS, etc.) ...
// --- NEW: Global Knowledge Base for Tooltips ---
export const GLOBAL_GLOSSARY: Record<string, { definition: string; formula?: string; rationale?: string; tags?: string[] }> = {
    'Scope 1': {
        definition: "Direct GHG emissions occurring from sources that are owned or controlled by the company (e.g., combustion in boilers, furnaces, vehicles).",
        formula: "Σ (Fuel Quantity × Emission Factor × GWP)",
        rationale: "Crucial for identifying direct decarbonization opportunities (e.g., electrification) and meeting compliance mandates like CBAM.",
        tags: ['GHG Protocol', 'Direct']
    },
    'Scope 2': {
        definition: "Indirect GHG emissions from the generation of purchased electricity, steam, heat, or cooling consumed by the company.",
        formula: "Σ (Electricity Consumption × Location/Market-based Factor)",
        rationale: "Essential for evaluating energy efficiency strategies and RE100 commitments.",
        tags: ['GHG Protocol', 'Indirect']
    },
    'Scope 3': {
        definition: "All other indirect emissions that occur in a company's value chain (e.g., purchased goods, business travel, waste disposal).",
        formula: "Σ (Activity Data × Spend-based or Average-data Factor)",
        rationale: "Often >70% of total footprint. Managing this reduces supply chain risk and meets customer demands.",
        tags: ['Value Chain', 'Upstream/Downstream']
    },
    'ESG Score': {
        definition: "A composite score evaluating a company's environmental, social, and governance performance relative to industry peers.",
        formula: "(0.4 × Environmental) + (0.3 × Social) + (0.3 × Governance)",
        rationale: "High scores lower the cost of capital, attract green investment, and improve brand reputation.",
        tags: ['Rating', 'KPI']
    },
    'Carbon Pricing': {
        definition: "An internal shadow price applied to carbon emissions to evaluate investment decisions and drive decarbonization.",
        formula: "Total Emissions (tCO2e) × Shadow Price ($/t)",
        rationale: "Internalizes environmental costs to prepare for future carbon taxes and drive low-carbon innovation.",
        tags: ['Finance', 'Risk']
    },
    'Supply Chain Coverage': {
        definition: "The percentage of suppliers (by spend or emissions) who have reported primary carbon data.",
        formula: "(Suppliers with Primary Data / Total Suppliers) × 100",
        rationale: "Higher coverage improves Scope 3 accuracy, replacing estimates with real data for better decision making.",
        tags: ['Engagement', 'Data Quality']
    },
    'Energy Anomaly': {
        definition: "A detected deviation in energy consumption patterns significantly exceeding the baseline variance.",
        formula: "|Current - Baseline| > (2 × Standard Deviation)",
        rationale: "Early detection prevents equipment failure, reduces waste, and lowers unexpected operational costs.",
        tags: ['AI', 'Monitoring']
    },
    'SROI': {
        definition: "Social Return on Investment. A method for measuring values that are not traditionally reflected in financial statements.",
        formula: "(Net Present Value of Benefits / Net Present Value of Investment)",
        rationale: "Quantifies the 'invisible' value of social projects, justifying budgets for CSR and community engagement.",
        tags: ['Impact', 'Social']
    },
    'CBAM': {
        definition: "Carbon Border Adjustment Mechanism. EU regulation putting a fair price on carbon emitted during production of carbon intensive goods entering the EU.",
        formula: "Imported Quantity × (Embedded Emissions - Free Allowances) × Weekly ETS Price",
        rationale: "Critical for maintaining EU market access and avoiding heavy carbon tariffs on exports.",
        tags: ['Regulation', 'EU']
    }
};

export const TRANSLATIONS = {
  'en-US': {
    nav: {
      myEsg: 'My ESG',
      dashboard: 'Dashboard',
      strategy: 'Strategy Hub',
      talent: 'Talent Passport',
      carbon: 'Carbon Asset',
      report: 'Report Center',
      integration: 'Integration Hub',
      culture: 'Culture Bot',
      finance: 'ROI Simulator',
      audit: 'Audit Trail',
      goodwill: 'Goodwill Coin',
      cardGame: 'Core Restoration',
      cardGameArena: 'Goodwill Era Arena',
      userJournal: 'User Log',
      restoration: 'Universal Restoration',
      researchHub: 'Research Hub',
      academy: 'Academy',
      diagnostics: 'Diagnostics',
      settings: 'Settings',
      yangBo: 'Yang Bo Zone',
      businessIntel: 'Business Intel',
      healthCheck: 'Health Check',
      universalTools: 'Universal Tools',
      fundraising: 'Fundraising',
      aboutUs: 'About Us',
      universalBackend: 'Universal Backend',
      apiZone: 'API Zone',
      alumniZone: 'Alumni & LMS',
      library: 'Goodwill Library'
    },
    modules: {
      myEsg: { title: 'My ESG Cockpit', desc: 'Your personalized sustainability command center.' },
      strategy: { title: 'Strategy Hub', desc: 'Risk heatmaps and stakeholder engagement analysis.' },
      talent: { title: 'Talent Passport', desc: 'Blockchain-verified certificates and skill tracking.' },
      carbon: { title: 'Carbon Asset Mgmt', desc: 'SBTi paths and internal carbon pricing simulation.' },
      report: { title: 'Report Center', desc: 'AI-driven GRI/SASB report drafting (ESGss X JunAiKey).' },
      integration: { title: 'Integration Hub', desc: 'IoT/ERP connections and data ETL flows.' },
      culture: { title: 'Culture Bot', desc: 'Micro-learning and ESG culture promotion.' },
      finance: { title: 'Financial Simulator', desc: 'ROI analysis for decarbonization investments.' },
      audit: { title: 'Audit Trail', desc: 'SHA-256 data verification and confidence scoring.' },
      goodwill: { title: 'Goodwill Coin', desc: 'Tokenized rewards and redemption center.' },
      cardGame: { title: 'Universal Core Restoration', desc: 'Collect Memory Fragment Crystals to restore the system to perfection.' },
    },
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time sustainability performance overview.',
      periods: { daily: 'Daily', monthly: 'Monthly', yearly: 'Yearly' },
      chartTitle: 'Emissions vs Baseline',
      feedTitle: 'JunAiKey Intelligence Feed',
      marketingTitle: 'Marketing Impact',
      vsLastMonth: 'vs last month'
    },
    research: {
      title: 'Research Hub',
      subtitle: 'Deep dive into data and regulatory frameworks.',
      searchPlaceholder: 'Search regulations, data points, or documents...',
      dataExplorer: 'Data Explorer',
      knowledgeBase: 'Knowledge Base',
      filters: 'Filters',
      viewAll: 'View All Documents',
      table: {
        metric: 'Metric',
        scope: 'Scope',
        value: 'Value',
        confidence: 'Confidence',
        source: 'Source'
      }
    },
    academy: {
      title: 'Sustainability Academy',
      subtitle: 'Upskill your team with curated ESG learning paths.',
      levelInfo: 'Level 12 • 4 Badges',
      progress: 'Progress',
      start: 'Start',
      resume: 'Resume'
    },
    diagnostics: {
      title: 'System Diagnostics',
      subtitle: 'Platform health and intelligence verification status.',
      moduleHealth: 'Module Health',
      security: 'Security & Compliance',
      uptime: 'Uptime',
      audit: 'SOC2 Audit',
      alerts: 'Critical Alerts',
      version: 'Version',
      maintenance: 'Maintenance Scheduled'
    }
  },
  'zh-TW': {
    nav: {
      myEsg: '我的 ESG (My ESG)',
      userJournal: '使用日誌 (Journal)',
      restoration: '萬能修復 (Crystals)',
      cardGameArena: '善向紀元 (Card Game)',
      
      dashboard: '儀表板 (Dashboard)',
      strategy: '策略中樞 (Strategy Hub)',
      carbon: '碳資產 (Carbon Asset)',
      report: '報告中心 (Report Center)',
      integration: '集成中樞 (Integration)',
      finance: 'ROI 模擬 (ROI Sim)',
      audit: '稽核軌跡 (Audit)',
      healthCheck: '全方位健檢 (Check)',
      
      researchHub: '研究中心 (Research)',
      businessIntel: '商情中心 (Biz Intel)',
      academy: '永續學院 (Academy)',
      library: '善向圖書館 (Library)',
      yangBo: '楊博專區 (Yang Bo)',
      
      goodwill: '善向幣 (Goodwill)',
      fundraising: '善向募資 (Fundraising)',
      alumniZone: '校友專區 (Alumni)',
      talent: '人才護照 (Passport)',
      culture: '文化推廣 (Culture)',
      
      settings: '設定 (Settings)',
      diagnostics: '系統診斷 (Diagnosis)',
      apiZone: 'API 專區 (API Zone)',
      universalBackend: '萬能後臺 (Backend)',
      universalTools: '萬能工具 (Tools)',
      aboutUs: '關於我們 (About)',
      
      cardGame: '萬能核心修復', // Legacy
    },
    modules: {
      myEsg: { title: '我的 ESG (My ESG)', desc: '您的個人化永續戰情室與成長中心。' },
      strategy: { title: '策略中樞 (Strategy Hub)', desc: '風險熱點圖與利害關係人議合分析 (Risk heatmaps & stakeholder engagement)。' },
      talent: { title: '人才護照 (Talent Passport)', desc: '區塊鏈驗證證書與技能追蹤 (Blockchain-verified certificates)。' },
      carbon: { title: '碳資產管理 (Carbon Asset Mgmt)', desc: 'SBTi 路徑與內部碳定價模擬 (SBTi paths & Carbon Pricing)。' },
      report: { title: '報告中心 (Report Center)', desc: 'JunAiKey 驅動之 GRI/SASB 報告草稿生成。' },
      integration: { title: '集成中樞 (Integration Hub)', desc: 'IoT/ERP連接與數據 ETL 流程 (IoT/ERP connections)。' },
      culture: { title: '文化推廣 (Culture Bot)', desc: '每日微學習與 ESG 文化推廣 (Micro-learning)。' },
      finance: { title: '財務模擬 (Financial Simulator)', desc: '減碳投資 ROI 分析與碳稅衝擊 (ROI analysis)。' },
      audit: { title: '稽核軌跡 (Audit Trail)', desc: 'SHA-256 數據驗證與信心分級 (Data verification)。' },
      goodwill: { title: '善向幣 (Goodwill Coin)', desc: '代幣化獎勵與兌換中心 (Tokenized rewards)。' },
      cardGame: { title: '萬能核心修復計畫', desc: '收集萬能元件記憶碎片結晶，將系統修復至完美型態 (Zero Hallucination)。' },
    },
    dashboard: {
      title: '企業決策儀表板 (Executive Dashboard)',
      subtitle: '即時永續績效概覽 (Real-time sustainability performance overview)',
      periods: { daily: '日 (Daily)', monthly: '月 (Monthly)', yearly: '年 (Yearly)' },
      chartTitle: '排放量 vs 基準線 (Emissions vs Baseline)',
      feedTitle: 'JunAiKey 智慧情報流',
      marketingTitle: '行銷影響力 (Marketing Impact)',
      vsLastMonth: '與上月相比 (vs last month)'
    },
    research: {
      title: '研究中心 (Research Hub)',
      subtitle: '深入挖掘數據與法規框架 (Deep dive into data and regulatory frameworks)',
      searchPlaceholder: '搜尋法規、數據點或文件 (Search regulations, data points...)',
      dataExplorer: '數據探索器 (Data Explorer)',
      knowledgeBase: '知識庫 (Knowledge Base)',
      filters: '篩選 (Filters)',
      viewAll: '查看所有文件 (View All)',
      table: {
        metric: '指標 (Metric)',
        scope: '範疇 (Scope)',
        value: '數值 (Value)',
        confidence: '信心度 (Confidence)',
        source: '來源 (Source)'
      }
    },
    academy: {
      title: '永續學院 (Sustainability Academy)',
      subtitle: '提升團隊 ESG 技能 (Upskill your team with curated ESG learning paths)',
      levelInfo: '等級 12 • 4 徽章',
      progress: '進度 (Progress)',
      start: '開始 (Start)',
      resume: '繼續 (Resume)'
    },
    diagnostics: {
      title: '系統診斷 (System Diagnostics)',
      subtitle: '平台健康與 JunAiKey 狀態 (Platform health and intelligence verification status)',
      moduleHealth: '模組健康度 (Module Health)',
      security: '安全與合規 (Security & Compliance)',
      uptime: '運行時間 (Uptime)',
      audit: 'SOC2 稽核 (Audit)',
      alerts: '關鍵警報 (Critical Alerts)',
      version: '版本 (Version)',
      maintenance: '排程維護 (Maintenance Scheduled)'
    }
  }
};

// --- MOCK DATA GENERATORS (Missing) ---

export const getMockMetrics = (language: Language): Metric[] => [
  { id: '1', label: 'Scope 1 Emissions', value: '420.5 t', change: -5.2, trend: 'down', color: 'emerald', traits: ['performance'], confidence: 'high', dataLink: 'live' },
  { id: '2', label: 'Scope 2 Emissions', value: '380.2 t', change: 2.1, trend: 'up', color: 'blue', traits: ['optimization'], confidence: 'high' },
  { id: '3', label: 'ESG Score', value: '78', change: 1.5, trend: 'up', color: 'gold', traits: ['seamless'], confidence: 'high' },
  { id: '4', label: 'Governance Rating', value: 'A-', change: 0, trend: 'neutral', color: 'purple', traits: ['bridging'], confidence: 'medium' }
];

export const GLOBAL_SDR_MODULES = [
    { id: 'sdr-cdp', name: 'CDP Database', description: 'Carbon Disclosure Project global dataset.' },
    { id: 'sdr-gri', name: 'GRI Standards', description: 'Global Reporting Initiative standards.' },
    { id: 'sdr-ifrs', name: 'IFRS S1/S2', description: 'International Sustainability Standards Board.' },
    { id: 'sdr-sasb', name: 'SASB Sector', description: 'Industry-specific sustainability accounting standards.' },
    { id: 'sdr-boost', name: 'Boost.Space', description: 'Unified cloud data sync and automation engine.' }
];

export const getMockCourses = (language: Language): Course[] => [
    { id: 'c1', title: 'Carbon Accounting 101', category: 'Environment', level: 'Beginner', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
    { id: 'c2', title: 'Supply Chain Auditing', category: 'Social', level: 'Intermediate', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' },
    { id: 'c3', title: 'Corporate Governance', category: 'Governance', level: 'Advanced', progress: 0, thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' }
];

export const getMockHealth = (language: Language): SystemHealth[] => [
    { module: 'Carbon Tracker', status: 'Healthy', latency: 45 },
    { module: 'Report Generator', status: 'Healthy', latency: 120 },
    { module: 'Intelligence Engine', status: 'Warning', latency: 450 },
    { module: 'API Gateway', status: 'Healthy', latency: 20 }
];

export const REPORT_STRUCTURE: ReportSection[] = [
    { 
        id: '1', title: 'Introduction', 
        subSections: [
            { id: '1.01', title: 'Letter from CEO', template: 'Write a CEO letter committing to sustainability.', example: 'Dear Stakeholders...', griStandards: 'GRI 2-22' },
            { id: '1.02', title: 'About Us', template: 'Describe the company profile and scale.', example: 'We are...', griStandards: 'GRI 2-1' }
        ]
    },
    {
        id: '2', title: 'Environmental', 
        subSections: [
            { id: '2.01', title: 'Energy Management', template: 'Detail energy consumption and renewable mix.', example: 'Total energy...', griStandards: 'GRI 302-1' },
            { id: '2.02', title: 'Emissions', template: 'Report Scope 1, 2, and 3 emissions.', example: 'Scope 1 was...', griStandards: 'GRI 305-1' }
        ]
    }
];

export const getCardSynergies = (lang: string): CardSynergy[] => [
    { id: 'syn-1', name: 'Green Ops', description: 'Bonus to Environmental Score', requiredCards: ['card-e1-001', 'card-e1-002'], effect: { type: 'score_boost', target: 'environmental', value: 5 } }
];

export const getEsgCards = (lang: string): EsgCard[] => [
    { id: 'card-legend-001', title: 'Net Zero Hero', description: 'Achieved Net Zero status.', attribute: 'Environmental', category: 'Green_Ops', rarity: 'Legendary', term: 'Net Zero', definition: 'Balance between emissions produced and removed.', stats: { defense: 90, offense: 80 }, collectionSet: 'Genesis' },
    { id: 'card-e1-001', title: 'Solar Panel', description: 'Renewable energy source.', attribute: 'Environmental', category: 'Green_Ops', rarity: 'Common', term: 'Photovoltaic', definition: 'Converting light into electricity.', stats: { defense: 20, offense: 40 }, collectionSet: 'Energy' },
    { id: 'card-e1-002', title: 'Wind Turbine', description: 'Wind energy.', attribute: 'Environmental', category: 'Green_Ops', rarity: 'Rare', term: 'Wind Power', definition: 'Using wind to generate electricity.', stats: { defense: 30, offense: 50 }, collectionSet: 'Energy' }
];
