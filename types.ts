
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
    CONTACT_US = 'contact_us',
    CARD_GAME = 'card_game' 
}

// --- Agentic Flow / Universal Flow Extensions ---

export interface FlowStep {
    id: string;
    agentId: string; // 指定執行的化身人格
    action: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    output?: string;
}

export interface UniversalWorkforce {
    id: string;
    name: string;
    members: string[]; // 代理化身 ID 列表
    activeFlowId?: string;
    status: 'idle' | 'deployed';
}

export interface AgentFlow {
    id: string;
    title: string;
    description: string;
    steps: FlowStep[];
    coherenceScore: number;
}

export type EvolutionStage = 'Seed' | 'Structure' | 'Optimized' | 'Autonomous' | 'Infinite';

export interface EvolutionMilestone {
    id: string;
    timestamp: number;
    stage: EvolutionStage;
    description: string;
    logicChanges: string[];
    verificationHash: string;
}

export type OmniEsgTrait = 'optimization' | 'performance' | 'gap-filling' | 'tagging' | 'evolution' | 'learning' | 'bridging' | 'seamless' | 'transcendent';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'rose' | 'cyan' | 'slate' | 'orange' | 'indigo' | 'pink';

export interface UniversalTag {
    id: string;
    label: string; 
    labelZh: string; 
    labelEn: string; 
    hiddenPrompt: string; 
    theme: 'gold' | 'purple' | 'emerald' | 'blue' | 'rose' | 'slate';
    description?: string;
}

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

export interface NoteItem {
    id: string;
    title: string;
    content: string;
    tags: string[];
    universalTags?: string[];
    createdAt: number;
    source: string;
    backlinks: string[];
    evolutionHistory?: EvolutionMilestone[];
}

export interface CarbonData {
    fuelConsumption: number;
    electricityConsumption: number;
    scope1: number;
    scope2: number;
    scope3: number;
    lastUpdated: number;
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

export interface UniversalKnowledgeNode {
    id: string;
    type: 'component' | 'concept' | 'data';
    label: UniversalLabel;
    currentValue: any;
    traits: OmniEsgTrait[];
    confidence: OmniEsgConfidence;
    lastInteraction: number;
    interactionCount: number;
    evolutionStage: EvolutionStage;
    evolutionHistory: EvolutionMilestone[];
    memory: {
        history: any[];
        aiInsights: string[];
    };
}

export type Role = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'AUDITOR';
export type Permission = 'VIEW_ALL' | 'VIEW_CORE' | 'VIEW_OPS' | 'EDIT_OPS' | 'VIEW_INTEL' | 'VIEW_ECO' | 'VIEW_SYS' | 'MANAGE_SETTINGS' | 'MANAGE_API' | 'VIEW_FINANCE';

export interface Course {
    id: string;
    title: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    progress: number;
    thumbnail: string;
}

export interface SystemHealth {
    module: string;
    status: 'Healthy' | 'Warning' | 'Error';
    latency: number;
}

export interface ReportSection {
    id: string;
    title: string;
    template?: string;
    example?: string;
    griStandards?: string;
    subSections?: ReportSection[];
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
    effect: any;
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
    category: 'Core' | 'Feature' | 'UI';
    changes: string[];
}

export interface JourneyStep {
    id: string;
    label: string;
    targetView: View;
    instruction: string;
    status: 'pending' | 'completed';
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

export type WidgetType = 'kpi_card' | 'quest_list' | 'quick_note' | 'yang_bo_feed' | 'event_list' | 'intel_feed' | 'profile';

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    config?: any;
    gridSize?: 'small' | 'medium' | 'large' | 'full';
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

export interface BookmarkItem {
    id: string;
    type: 'article' | 'video' | 'news';
    title: string;
    link?: string;
    addedAt: number;
}

export type UserTier = 'Free' | 'Pro' | 'Enterprise';
export type MasteryLevel = 'Novice' | 'Apprentice' | 'Adept' | 'Expert' | 'Master';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface AppFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: number;
    sourceModule: string;
    status: 'scanning' | 'processed';
    tags: string[];
    confidence: number;
    aiSummary?: string;
    complianceData?: any;
}

export interface IntelligenceItem {
    id: string;
    type: 'news' | 'report' | 'competitor';
    title: string;
    source: string;
    date: string;
    summary: string;
    tags: string[];
    isRead: boolean;
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
    status: string;
    metrics: any;
}

export interface InteractionEvent {
    componentId: string;
    eventType: 'click' | 'hover' | 'edit' | 'ai-trigger';
    timestamp: number;
    payload?: any;
}

export interface MCPTool {
    id: string;
    name: string;
    description: string;
}

export interface MCPResource {
    id: string;
    name: string;
    description: string;
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
    prompt?: string;
    color: string;
    knowledgeBase: string[];
    icon: any;
    created: number;
}
