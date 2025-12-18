
import { 
  LayoutDashboard, GraduationCap, Settings, Activity, Target, Leaf, FileText, 
  Calculator, ShieldCheck, Coins, Home, Crown, Hexagon, Book, Globe, 
  Search, Heart, Swords, Fingerprint, Library, Wrench, Code, Info, Mail, Sparkles, Users
} from 'lucide-react';
import { Metric, Course, SystemHealth, Language, ReportSection, EsgCard, CardSynergy, UniversalCrystal, View, ChangelogEntry, UserJourney, OmniEsgTrait, Role, Permission, OmniEsgColor } from './types';

// --- VIEW VISUAL METADATA (Single Source of Truth) ---
export const VIEW_METADATA: Record<View, { icon: any; color: OmniEsgColor }> = {
    [View.MY_ESG]: { icon: Home, color: 'gold' },
    [View.YANG_BO]: { icon: Crown, color: 'gold' },
    [View.RESTORATION]: { icon: Hexagon, color: 'gold' },
    [View.USER_JOURNAL]: { icon: Book, color: 'gold' },
    
    [View.DASHBOARD]: { icon: LayoutDashboard, color: 'emerald' },
    [View.CARBON]: { icon: Leaf, color: 'emerald' },
    [View.STRATEGY]: { icon: Target, color: 'emerald' },
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

// ... 其餘代碼保持不變 (ROLE_DEFINITIONS, VIEW_ACCESS_MAP, etc.)
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
    [View.MY_ESG]: 'VIEW_CORE',
    [View.YANG_BO]: 'VIEW_CORE',
    [View.USER_JOURNAL]: 'VIEW_CORE',
    [View.RESTORATION]: 'VIEW_CORE',
    [View.CARD_GAME_ARENA]: 'VIEW_CORE',
    [View.UNIVERSAL_AGENT]: 'VIEW_CORE',
    [View.ABOUT_US]: 'VIEW_CORE',
    [View.CONTACT_US]: 'VIEW_CORE',
    [View.DASHBOARD]: 'VIEW_OPS',
    [View.STRATEGY]: 'VIEW_OPS',
    [View.CARBON]: 'EDIT_OPS',
    [View.REPORT]: 'EDIT_OPS',
    [View.INTEGRATION]: 'VIEW_OPS',
    [View.FINANCE]: 'VIEW_FINANCE',
    [View.AUDIT]: 'VIEW_OPS',
    [View.HEALTH_CHECK]: 'VIEW_OPS',
    [View.BUSINESS_INTEL]: 'VIEW_INTEL',
    [View.RESEARCH_HUB]: 'VIEW_INTEL',
    [View.ACADEMY]: 'VIEW_INTEL',
    [View.LIBRARY]: 'VIEW_INTEL',
    [View.GOODWILL]: 'VIEW_ECO',
    [View.FUNDRAISING]: 'VIEW_ECO',
    [View.ALUMNI_ZONE]: 'VIEW_ECO',
    [View.TALENT]: 'VIEW_ECO',
    [View.CULTURE]: 'VIEW_ECO',
    [View.SETTINGS]: 'MANAGE_SETTINGS',
    [View.DIAGNOSTICS]: 'VIEW_SYS',
    [View.API_ZONE]: 'MANAGE_API',
    [View.UNIVERSAL_BACKEND]: 'MANAGE_API',
    [View.UNIVERSAL_TOOLS]: 'VIEW_SYS',
    [View.CARD_GAME]: 'VIEW_CORE'
};

export const LOGIN_README = [
    { title: "Executive Summary", icon: "Target", content: "ESGss x JunAiKey is not just a SaaS platform; it is an intelligent organism running on AIOS." },
    { title: "Core Philosophy", icon: "BrainCircuit", content: "We strictly adhere to the 'Component as Agent' philosophy." },
    { title: "The Golden Triangle", icon: "Triangle", content: "1. Capital (FinanceSim)\n2. Policy (StrategyHub)\n3. Knowledge (ResearchHub)" },
    { title: "Architecture", icon: "Cpu", content: "Powered by Gemini 3 Pro (Reasoning) and Gemini 2.5 Flash (Speed)." }
];

export const UNIVERSAL_CORES: UniversalCrystal[] = [
    { id: 'core-perception', name: 'Perception Core (Spectral Eye)', type: 'Perception', description: 'Grants the ability to see and digitize the physical world.', state: 'Fragmented', integrity: 45, fragmentsCollected: 1, fragmentsRequired: 4, linkedModule: View.RESEARCH_HUB, abilities: ['Spectral Scan (OCR)', 'Data Ingestion'] },
    { id: 'core-cognition', name: 'Cognition Core (Deep Mind)', type: 'Cognition', description: 'Unlocks deep reasoning, simulation, and strategic foresight.', state: 'Fragmented', integrity: 60, fragmentsCollected: 2, fragmentsRequired: 5, linkedModule: View.STRATEGY, abilities: ['Multi-Agent Debate', 'Risk Heatmap', 'Carbon Pricing Sim'] },
    { id: 'core-memory', name: 'Memory Core (Quantum Lattice)', type: 'Memory', description: 'Stores knowledge as atomic nodes for infinite recall and context.', state: 'Restored', integrity: 90, fragmentsCollected: 5, fragmentsRequired: 5, linkedModule: View.MY_ESG, abilities: ['Knowledge Graph', 'SDR Archive', 'Skill Embedding'] },
    { id: 'core-expression', name: 'Expression Core (The Scribe)', type: 'Expression', description: 'Manifests insights into reports, visuals, and interfaces.', state: 'Crystallizing', integrity: 75, fragmentsCollected: 3, fragmentsRequired: 4, linkedModule: View.REPORT, abilities: ['Auto-Report Gen', 'Generative UI', 'Visual Refraction'] },
    { id: 'core-nexus', name: 'Nexus Core (The Synapse)', type: 'Nexus', description: 'Orchestrates the entire system and connects to external reality.', state: 'Fragmented', integrity: 30, fragmentsCollected: 1, fragmentsRequired: 3, linkedModule: View.INTEGRATION, abilities: ['API Gateway', 'Role Switching', 'Audit Chain'] }
];

export const SYSTEM_CHANGELOG: ChangelogEntry[] = [
    { version: 'v15.0', date: '2025.05.20', title: 'The AIOS Awakening (Current)', category: 'Core', changes: ['Architecture Reborn.', 'AIOS Kernel.', 'Zero Hallucination Protocol.', 'MCP Standard.'] }
];

export const JOURNEY_TEMPLATES = {
    carbon_kickstart: { id: 'carbon_kickstart', name: 'Carbon Kickstart', description: 'Master your first Scope 1 & 2 inventory with AI guidance.', steps: [{ id: 's1', label: 'Go to Carbon Asset', targetView: View.CARBON, instruction: 'Navigate to the Carbon Asset module.', status: 'pending' }], currentStepIndex: 0, isCompleted: false }
};

export const GLOBAL_GLOSSARY = {
    'Scope 1': { definition: "Direct GHG emissions.", formula: "Σ (Fuel × Factor)", rationale: "Crucial for direct decarbonization.", tags: ['GHG'] },
    'ESG Score': { definition: "Composite score.", formula: "0.4E + 0.3S + 0.3G", rationale: "Represents overall health.", tags: ['KPI'] }
};

export const TRANSLATIONS = {
  'en-US': { nav: { myEsg: 'My ESG', dashboard: 'Dashboard', strategy: 'Strategy Hub', carbon: 'Carbon Asset', report: 'Report Center', finance: 'ROI Simulator', audit: 'Audit Trail', researchHub: 'Research Hub', academy: 'Academy', settings: 'Settings', diagnostics: 'Diagnostics', yangBo: 'Yang Bo Zone', businessIntel: 'Business Intel', restoration: 'Universal Agent', cardGameArena: 'Arena', goodwill: 'Goodwill', fundraising: 'Fundraising', talent: 'Talent Passport', library: 'Library', apiZone: 'API Zone', universalTools: 'Tools' }, dashboard: { chartTitle: 'Emissions vs Baseline' }, research: { dataExplorer: 'Data Explorer', knowledgeBase: 'Knowledge Base', filters: 'Filters', viewAll: 'View All', table: { metric: 'Metric',