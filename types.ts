
/**
 * Defines the available views/modules within the application.
 */
export enum View {
  // Core (Personal & Gamification)
  MY_ESG = 'MY_ESG', 
  YANG_BO = 'YANG_BO', // Moved to Core
  USER_JOURNAL = 'USER_JOURNAL',
  RESTORATION = 'RESTORATION', // Universal Restoration (Crystals)
  CARD_GAME_ARENA = 'CARD_GAME_ARENA', // Goodwill Era
  UNIVERSAL_AGENT = 'UNIVERSAL_AGENT', // New: Universal Agent Avatar Core

  // Ops (Enterprise Operations)
  DASHBOARD = 'DASHBOARD',
  STRATEGY = 'STRATEGY',
  CARBON = 'CARBON',
  REPORT = 'REPORT',
  INTEGRATION = 'INTEGRATION',
  FINANCE = 'FINANCE',
  AUDIT = 'AUDIT',
  HEALTH_CHECK = 'HEALTH_CHECK',

  // Intel (Knowledge & Growth)
  BUSINESS_INTEL = 'BUSINESS_INTEL',
  RESEARCH_HUB = 'RESEARCH_HUB', 
  ACADEMY = 'ACADEMY', 
  LIBRARY = 'LIBRARY',

  // Eco (Community & Ecosystem)
  GOODWILL = 'GOODWILL',
  FUNDRAISING = 'FUNDRAISING',
  ALUMNI_ZONE = 'ALUMNI_ZONE',
  TALENT = 'TALENT',
  CULTURE = 'CULTURE',
  
  // Sys (System & Tools)
  SETTINGS = 'SETTINGS',
  DIAGNOSTICS = 'DIAGNOSTICS', 
  API_ZONE = 'API_ZONE',
  UNIVERSAL_BACKEND = 'UNIVERSAL_BACKEND',
  UNIVERSAL_TOOLS = 'UNIVERSAL_TOOLS', // New Universal Tools Hub
  ABOUT_US = 'ABOUT_US',
  
  // Deprecated/Mapped
  CARD_GAME = 'RESTORATION', 
}

export type Language = 'zh-TW' | 'en-US';
export type UserTier = 'Free' | 'Pro' | 'Enterprise';

// --- RBAC SYSTEM ---
export type Role = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'AUDITOR';

export type Permission = 
  | 'VIEW_ALL'
  | 'VIEW_CORE'
  | 'VIEW_OPS'
  | 'EDIT_OPS'
  | 'VIEW_INTEL'
  | 'VIEW_ECO'
  | 'VIEW_SYS'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_API'
  | 'VIEW_FINANCE';

// --- UNIVERSAL CRYSTAL ARCHITECTURE (萬能水晶架構) ---

export type CrystalType = 'Perception' | 'Cognition' | 'Memory' | 'Expression' | 'Nexus';
export type CrystalState = 'Fragmented' | 'Crystallizing' | 'Restored' | 'Perfected';

export interface UniversalCrystal {
    id: string;
    name: string;
    type: CrystalType;
    description: string;
    state: CrystalState;
    integrity: number; // 0-100% (Zero Hallucination Metric)
    fragmentsCollected: number;
    fragmentsRequired: number;
    linkedModule: View; // The functional module this crystal wraps
    abilities: string[]; // Unlocked capabilities
}

// --- USER JOURNEY SYSTEM ---
export type JourneyStepStatus = 'pending' | 'active' | 'completed';

export interface JourneyStep {
    id: string;
    label: string;
    targetView: View;
    instruction: string; // Message from AI
    status: JourneyStepStatus;
    triggerCondition?: string; // e.g., "carbon_calculated"
}

export interface UserJourney {
    id: string;
    name: string;
    description: string;
    steps: JourneyStep[];
    currentStepIndex: number;
    isCompleted: boolean;
}

// --- USER JOURNAL & INSIGHTS ---
export interface UserJournalEntry {
    id: string;
    timestamp: number;
    title: string;
    impact: string; // e.g., "Reduced Carbon Calculation time by 40%"
    xpGained: number;
    tags: string[]; // e.g., ["Learning", "Operation", "Community"]
    type: 'milestone' | 'action' | 'insight';
}

// --- CHANGELOG SYSTEM ---
export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    category: 'Core' | 'Feature' | 'UI' | 'Fix';
    changes: string[];
}

// --- MCP (Model Context Protocol) Definitions ---

export interface MCPTool {
    name: string;
    description: string;
    inputSchema: any; // JSON Schema
    requiresApproval?: boolean; // For HITL
}

export interface MCPResource {
    uri: string;
    name: string;
    mimeType: string;
    description?: string;
}

export interface MCPPrompt {
    name: string; // e.g., "summarize-pdf"
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
}

export interface MCPMessage {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string | { type: 'text' | 'image' | 'resource', data: any }[];
    toolCallId?: string;
    name?: string; // For tool outputs
}

// --- End MCP Definitions ---

export interface UserProfile {
  name: string;
  role: Role; // Updated to use Role type
  roleTitle: string; // Display title (e.g. "Chief Sustainability Officer")
  tier: UserTier;
  avatarSeed: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'reward';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  rewardData?: { xp?: number; coins?: number; card?: EsgCard; };
}

// --- Universal File System & Compliance ---
export interface ComplianceData {
    standard: string; // e.g., ISO 14064
    certId: string;
    issuer: string;
    expiryDate: string;
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
  aiSummary?: string;
  confidence: number;
  complianceData?: ComplianceData; // Linked compliance info
}

// --- Universal Intelligence System ---
export interface IntelligenceItem {
  id: string;
  type: 'report' | 'news' | 'competitor' | 'regulation' | 'note';
  title: string;
  source: string;
  date: string;
  summary: string;
  tags: string[];
  isRead: boolean;
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

// --- QUANTUM KNOWLEDGE ENGINE ---
export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    connections: string[];
    source: string;
}

export interface SemanticContext {
    intent: string;
    keywords: string[];
    requiredConfidence: number;
}

// --- ESG Universal Card Architecture (MECE) ---
export type ESGAttribute = 'Environmental' | 'Social' | 'Governance';
export type ESGCategory = 'Green_Ops' | 'Eco_System' | 'Human_Capital' | 'Social_Impact' | 'Foundation' | 'Partnership';
export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type MasteryLevel = 'Novice' | 'Apprentice' | 'Master';

export interface EsgCard {
  id: string;
  title: string;
  description: string;
  attribute: ESGAttribute;
  category: ESGCategory;
  rarity: CardRarity;
  term: string;
  definition: string;
  imageUrl?: string;
  stats: {
    defense: number;
    offense: number;
  };
  isPurified?: boolean;
  collectionSet: string;
}

// --- Synergy System ---
export interface SynergyEffect {
    type: 'score_boost' | 'resource_gen' | 'discount';
    target: 'environmental' | 'social' | 'governance' | 'credits' | 'budget';
    value: number;
}

export interface CardSynergy {
    id: string;
    name: string;
    description: string;
    requiredCards: string[];
    effect: SynergyEffect;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface CarbonData {
  fuelConsumption: number;
  electricityConsumption: number;
  scope1: number;
  scope2: number;
  scope3: number;
  lastUpdated: number;
}

export type QuestRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type QuestType = 'Daily' | 'Weekly' | 'Challenge';
export type QuestRequirement = 'manual' | 'image_upload';

export interface Quest {
  id: string;
  title: string;
  desc: string;
  type: QuestType;
  rarity: QuestRarity;
  xp: number;
  status: 'active' | 'verifying' | 'completed';
  requirement: QuestRequirement;
}

export interface ToDoItem {
  id: number;
  text: string;
  done: boolean;
}

export interface NoteItem {
  id: string;
  title: string; // New: Auto-generated Title
  content: string;
  tags: string[];
  createdAt: number;
  source?: 'manual' | 'voice' | 'ai';
  backlinks?: string[]; // New: Reverse Links
  isOptimized?: boolean;
}

export interface BookmarkItem {
  id: string;
  type: 'article' | 'video' | 'news';
  title: string;
  link?: string;
  addedAt: number;
}

/**
 * Universal Agent Traits
 */
export type OmniEsgTrait = 
  | 'optimization' 
  | 'gap-filling' 
  | 'tagging'
  | 'performance'
  | 'learning'
  | 'evolution'
  | 'bridging'
  | 'seamless';

export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'slate';

export interface UniversalLabel {
  id?: string;
  dataType?: string;
  text: string;
  description?: string;
  definition?: string;
  formula?: string;
  rationale?: string;
}

export interface UniversalKnowledgeNode {
  id: string;
  type: 'component' | 'concept' | 'metric';
  label: UniversalLabel;
  currentValue: any;
  traits: OmniEsgTrait[];
  confidence: OmniEsgConfidence;
  lastInteraction: number;
  interactionCount: number;
  memory: {
    history: any[];
    aiInsights: string[];
  };
}

export interface InteractionEvent {
  componentId: string;
  eventType: 'click' | 'hover' | 'edit' | 'ai-trigger';
  timestamp: number;
  payload?: any;
}

export interface Metric {
  id: string;
  label: string | UniversalLabel;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: OmniEsgColor;
  traits?: OmniEsgTrait[];
  tags?: string[];
  dataLink?: OmniEsgDataLink;
  confidence?: OmniEsgConfidence;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  thumbnail: string;
}

// Updated ChatMessage to support structured tool calls/HITL
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system' | 'tool';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  toolCall?: {
      id: string;
      name: string;
      args: any;
      requiresApproval?: boolean;
      status: 'pending' | 'approved' | 'rejected' | 'completed';
  };
  uiComponent?: any; // For Generative UI JSON payload
  // New: For AI Proactive Suggestions
  suggestion?: {
      title: string;
      reason: string;
      actionLabel: string;
      targetView: View;
  };
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

// --- Past Reports Archive ---
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
        griCoverage: number; // Percentage
    };
    downloadUrl?: string;
}

export type WidgetType = 'kpi_card' | 'chart_area' | 'feed_list' | 'mini_map' | 'quest_list' | 'intel_feed' | 'quick_note' | 'yang_bo_feed' | 'event_list';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config?: any;
  gridSize?: 'small' | 'medium' | 'large' | 'full';
}

export type InsightType = 'next_step' | 'optimization' | 'preparation';

export interface ProactiveInsight {
    id: string;
    type: InsightType;
    title: string;
    description: string;
    actionLabel?: string;
    targetView?: View;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
}

// --- Universal Agent Growth & Customization ---
export interface AgentSkill {
    id: string;
    name: string;
    description: string;
    level: number;
    maxLevel: number;
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
