import { LucideIcon } from 'lucide-react';

export type Language = 'en-US' | 'zh-TW';

export enum View {
    MY_ESG = 'my_esg',
    DASHBOARD = 'dashboard',
    STRATEGY = 'strategy',
    TALENT = 'talent',
    CARBON = 'carbon',
    REPORT = 'report',
    INTEGRATION = 'integration',
    CULTURE = 'culture',
    FINANCE = 'finance',
    AUDIT = 'audit',
    GOODWILL = 'goodwill',
    RESTORATION = 'restoration',
    CARD_GAME_ARENA = 'card_game_arena',
    USER_JOURNAL = 'user_journal',
    RESEARCH_HUB = 'research_hub',
    ACADEMY = 'academy',
    DIAGNOSTICS = 'diagnostics',
    SETTINGS = 'settings',
    YANG_BO = 'yang_bo',
    BUSINESS_INTEL = 'business_intel',
    HEALTH_CHECK = 'health_check',
    UNIVERSAL_TOOLS = 'universal_tools',
    FUNDRAISING = 'fundraising',
    ABOUT_US = 'about_us',
    UNIVERSAL_BACKEND = 'universal_backend',
    API_ZONE = 'api_zone',
    ALUMNI_ZONE = 'alumni_zone',
    LIBRARY = 'library',
    UNIVERSAL_AGENT = 'universal_agent',
    CARD_GAME = 'card_game' // Legacy
}

export type Role = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'AUDITOR';
export type Permission = 'VIEW_ALL' | 'VIEW_CORE' | 'VIEW_OPS' | 'EDIT_OPS' | 'VIEW_INTEL' | 'VIEW_ECO' | 'VIEW_SYS' | 'MANAGE_SETTINGS' | 'MANAGE_API' | 'VIEW_FINANCE';

export type OmniEsgTrait = 'optimization' | 'performance' | 'gap-filling' | 'tagging' | 'evolution' | 'learning' | 'bridging' | 'seamless';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'rose' | 'cyan' | 'slate' | 'orange' | 'indigo' | 'pink';

export interface UniversalLabel {
    id?: string;
    text: string;
    definition?: string;
    formula?: string;
    rationale?: string;
}

export interface Metric {
    id: string;
    label: string | UniversalLabel;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    color: OmniEsgColor;
    traits?: OmniEsgTrait[];
    confidence?: OmniEsgConfidence;
    dataLink?: OmniEsgDataLink;
    tags?: string[];
}

export interface Course {
    id: string;
    title: string;
    category: string;
    level: string;
    progress: number;
    thumbnail: string;
}

export interface SystemHealth {
    module: string;
    status: 'Healthy' | 'Warning' | 'Critical';
    latency: number;
}

export interface ReportSection {
    id: string;
    title: string;
    subSections?: ReportSection[];
    template?: string;
    example?: string;
    griStandards?: string;
    guidelines?: string;
    principles?: string;
}

export interface EsgCard {
    id: string;
    title: string;
    description: string;
    attribute: string;
    category: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    term: string;
    definition: string;
    stats: { defense: number; offense: number };
    collectionSet: string;
    imageUrl?: string;
}

export interface CardSynergy {
    id: string;
    name: string;
    description: string;
    requiredCards: string[];
    effect: { type: string; target: string; value: number };
}

export type CrystalType = 'Perception' | 'Cognition' | 'Memory' | 'Expression' | 'Nexus';

export interface UniversalCrystal {
    id: string;
    name: string;
    type: CrystalType;
    description: string;
    state: 'Fragmented' | 'Crystallizing' | 'Restored' | 'Perfected';
    integrity: number;
    fragmentsCollected: number;
    fragmentsRequired: number;
    linkedModule: View;
    abilities: string[];
}

export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    category: 'Core' | 'Feature' | 'UI' | 'Bugfix';
    changes: string[];
}

export interface JourneyStep {
    id: string;
    label: string;
    targetView: View;
    instruction: string;
    status: 'pending' | 'active' | 'completed';
    triggerCondition?: string;
}

export interface UserJourney {
    id: string;
    name: string;
    description: string;
    steps: JourneyStep[];
    currentStepIndex: number;
    isCompleted: boolean;
}

export type WidgetType = 'kpi_card' | 'chart_area' | 'feed_list' | 'quest_list' | 'quick_note' | 'yang_bo_feed' | 'event_list' | 'intel_feed' | 'profile';

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    config?: any;
    gridSize?: 'small' | 'medium' | 'large' | 'full';
}

export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    connections: string[];
    source?: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'reward';

export interface Toast {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration: number;
}

export interface AuditLogEntry {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details: string;
    hash: string;
    verified: boolean;
}

export interface Quest {
    id: string;
    title: string;
    desc: string;
    type: 'Daily' | 'Weekly' | 'Challenge';
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    xp: number;
    status: 'active' | 'verifying' | 'completed';
    requirement: string;
}

export interface ToDoItem {
    id: number;
    text: string;
    done: boolean;
}

export interface NoteItem {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: number;
    source: string;
    backlinks: string[];
}

export interface BookmarkItem {
    id: string;
    type: 'article' | 'video' | 'news';
    title: string;
    link?: string;
    addedAt: number;
}

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface CarbonData {
    fuelConsumption: number;
    electricityConsumption: number;
    scope1: number;
    scope2: number;
    scope3: number;
    lastUpdated: number;
}

export type MasteryLevel = 'Novice' | 'Apprentice' | 'Expert' | 'Master' | 'Grandmaster';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: number;
}

export interface AppFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: number;
    sourceModule: string;
    status: 'scanning' | 'processed' | 'error';
    tags: string[];
    confidence: number;
    aiSummary?: string;
    complianceData?: any;
}

export interface IntelligenceItem {
    id: string;
    type: 'news' | 'report' | 'competitor' | 'regulation';
    title: string;
    source: string;
    date: string;
    summary: string;
    tags: string[];
    isRead: boolean;
}

export interface UserJournalEntry {
    id: string;
    timestamp: number;
    title: string;
    impact: string;
    xpGained: number;
    type: 'milestone' | 'action' | 'insight';
    tags: string[];
}

export interface SemanticContext {
    intent: string;
    keywords: string[];
    requiredConfidence: number;
}

export interface PastReport {
    year: number;
    title: string;
    version: string;
    publishDate: string;
    status: 'Published' | 'Draft' | 'Archived';
    metrics: {
        scope1: number;
        scope2: number;
        scope3: number;
        energyConsumption: number;
        griCoverage: number;
    };
}

export interface InteractionEvent {
    componentId: string;
    eventType: 'click' | 'hover' | 'edit' | 'ai-trigger';
    timestamp: number;
    payload?: any;
}

export interface UniversalKnowledgeNode {
    id: string;
    type: 'component' | 'concept' | 'data';
    label: UniversalLabel;
    currentValue: any;
    traits: OmniEsgTrait[];
    confidence: OmniEsgConfidence;
    lastInteraction: number;
    interactionCount: number;
    memory: {
        history: InteractionEvent[];
        aiInsights: string[];
    };
}

export interface MCPTool {
    name: string;
    description: string;
    inputSchema: any;
    requiresApproval?: boolean;
}

export interface MCPResource {
    uri: string;
    name: string;
    mimeType: string;
    description?: string;
}

export interface MCPPrompt {
    name: string;
    description?: string;
    arguments?: any[];
}

export interface AgentSkill {
    id: string;
    name: string;
    description: string;
    level: number;
    maxLevel: number;
    currentXp: number;
    xpRequired: number;
    icon: any; 
}

export interface CustomAgentProfile {
    id: string;
    name: string;
    role: string;
    instruction: string;
    knowledgeBase: string[];
    color: string;
    icon: any;
    created: number;
}