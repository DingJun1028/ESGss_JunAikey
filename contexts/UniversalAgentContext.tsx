
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { JOURNEY_TEMPLATES } from '../constants';
import { UserJourney, JourneyStep, View, AgentSkill, CustomAgentProfile, UniversalWorkforce, AgentFlow } from '../types';
import { Bot, Terminal, Grid, Sparkles, BrainCircuit, User, Database, Layers, Monitor, Shield, Zap, Network } from 'lucide-react';

export type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID' | 'CUSTOM';
export type AgentMode = 'companion' | 'captain' | 'phantom' | 'custom' | 'orchestrator';
export type SystemStatus = 'STABLE' | 'UNSTABLE' | 'CRITICAL' | 'REBOOTING';
export type AppThemeMode = 'dark' | 'light';
export type AppThemeColor = 'celestial' | 'esg-sunshine';

export interface EvolutionSnapshot {
    version: string;
    codename: string;
    status: 'completed' | 'current' | 'projected';
    focus: string;
    improvements: string[];
    estimatedImpact: string;
}

export interface AgentLog {
    id: string;
    timestamp: number;
    source: 'Matrix' | 'Chat' | 'System' | 'Assistant' | 'Kernel' | 'Evolution' | 'Insight' | 'Phantom' | 'Orchestrator';
    message: string;
    type: 'info' | 'success' | 'error' | 'thinking' | 'warning';
}

export interface ActionItem {
    id: string;
    text: string;
    status: 'pending' | 'synced';
    timestamp: number;
    priority: 'high' | 'medium' | 'low';
}

export interface UserFeedback {
    id: string;
    messageId: string;
    type: 'good' | 'bad';
    view: View;
    timestamp: number;
}

const INITIAL_SKILLS = [
    { id: 'sk-1', name: 'Context Retention', description: 'Zero Hallucination Protocol: Retrieval from Personal Universal Think Tank.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 100, icon: BrainCircuit },
    { id: 'sk-2', name: 'Data Processing', description: 'Analysis speed for imported datasets.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 100, icon: Grid },
    { id: 'sk-3', name: 'Creative Synthesis', description: 'Generative UI and rich storytelling.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 100, icon: Sparkles },
    { id: 'sk-4', name: 'System Integration', description: 'Connectors for external logic streams.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 150, icon: Layers },
];

interface UniversalAgentContextType {
    activeFace: AvatarFace;
    setActiveFace: (face: AvatarFace) => void;
    agentMode: AgentMode;
    setAgentMode: (mode: AgentMode) => void;
    switchMode: (mode: AgentMode, reason?: string) => void;
    suggestedMode: AgentMode | null;
    confirmSuggestion: () => void;
    dismissSuggestion: () => void;
    themeMode: AppThemeMode;
    setThemeMode: (mode: AppThemeMode) => void;
    toggleThemeMode: () => void;
    themeColor: AppThemeColor;
    setThemeColor: (color: AppThemeColor) => void;
    toggleThemeColor: () => void;
    activeAgentProfile: any; 
    agentLevel: number;
    agentXp: number;
    nextLevelXp: number;
    agentSkills: any[];
    feedAgent: (amount: number) => void; 
    awardSkillXp: (skillId: string, amount: number) => void; 
    customAgents: CustomAgentProfile[];
    addCustomAgent: (profile: Omit<CustomAgentProfile, 'id' | 'created'>) => void;
    updateCustomAgent: (id: string, profile: Partial<CustomAgentProfile>) => void;
    deleteCustomAgent: (id: string) => void;
    selectCustomAgent: (id: string) => void;
    activeCustomAgentId: string | null;
    workforces: UniversalWorkforce[];
    deployWorkforce: (name: string, members: string[]) => void;
    activeFlows: AgentFlow[];
    executeFlow: (flow: AgentFlow) => void;
    evolutionPlan: EvolutionSnapshot[];
    logs: AgentLog[];
    chatHistory: AgentLog[];
    systemLogs: AgentLog[];
    addLog: (message: string, type?: AgentLog['type'], source?: AgentLog['source']) => void;
    detectedActions: ActionItem[];
    extractActionFromText: (text: string) => ActionItem | null;
    markActionSynced: (id: string) => void;
    clearLogs: () => void;
    archiveLogs: () => void;
    exportLogs: () => void;
    isProcessing: boolean;
    activeKeyId: string | null;
    executeMatrixProtocol: (keyId: string, label: string) => Promise<void>;
    processUniversalInput: (input: string, currentView?: View) => Promise<void>; 
    subAgentsActive: string[];
    systemStatus: SystemStatus;
    triggerSystemCrash: () => void;
    initiateSelfHealing: () => void;
    runSelfDiagnostics: () => void;
    activeJourney: UserJourney | null;
    startJourney: (journeyId: string) => void;
    advanceJourney: () => void;
    completeJourney: () => void;
    currentInstruction: string | null;
    feedbacks: UserFeedback[];
    addFeedback: (messageId: string, type: 'good' | 'bad', view: View) => void;
}

const UniversalAgentContext = createContext<UniversalAgentContextType | undefined>(undefined);

export const UniversalAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { addToast } = useToast();
    
    // Core Identity State
    const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
    const [agentMode, setAgentMode] = useState<AgentMode>(() => (localStorage.getItem('agent_mode') as AgentMode) || 'companion'); 
    const [suggestedMode, setSuggestedMode] = useState<AgentMode | null>(null);
    const [themeMode, setThemeMode] = useState<AppThemeMode>(() => (localStorage.getItem('app_theme_mode') as AppThemeMode) || 'dark');
    const [themeColor, setThemeColor] = useState<AppThemeColor>(() => (localStorage.getItem('app_theme_color') as AppThemeColor) || 'celestial');
    
    // Growth State
    const [agentLevel, setAgentLevel] = useState(() => Number(localStorage.getItem('agent_level')) || 1);
    const [agentXp, setAgentXp] = useState(() => Number(localStorage.getItem('agent_xp')) || 0);
    const [agentSkills, setAgentSkills] = useState<AgentSkill[]>(() => {
        const saved = localStorage.getItem('agent_skills');
        return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    });

    // Custom Personas
    const [customAgents, setCustomAgents] = useState<CustomAgentProfile[]>(() => {
        const saved = localStorage.getItem('esgss_custom_personas');
        return saved ? JSON.parse(saved) : [];
    });
    const [activeCustomAgentId, setActiveCustomAgentId] = useState<string | null>(() => localStorage.getItem('esgss_active_persona_id'));

    // Agentic Flow State
    const [workforces, setWorkforces] = useState<UniversalWorkforce[]>([]);
    const [activeFlows, setActiveFlows] = useState<AgentFlow[]>([]);
    
    // Diagnostics & History
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [feedbacks, setFeedbacks] = useState<UserFeedback[]>(() => {
        const saved = localStorage.getItem('esgss_ai_feedbacks');
        return saved ? JSON.parse(saved) : [];
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('agent_mode', agentMode);
        localStorage.setItem('agent_level', agentLevel.toString());
        localStorage.setItem('agent_xp', agentXp.toString());
        localStorage.setItem('agent_skills', JSON.stringify(agentSkills));
        localStorage.setItem('esgss_custom_personas', JSON.stringify(customAgents));
        if (activeCustomAgentId) localStorage.setItem('esgss_active_persona_id', activeCustomAgentId);
        else localStorage.removeItem('esgss_active_persona_id');
    }, [agentMode, agentLevel, agentXp, agentSkills, customAgents, activeCustomAgentId]);

    const addFeedback = (messageId: string, type: 'good' | 'bad', view: View) => {
        const newFeedback: UserFeedback = { id: `fb-${Date.now()}`, messageId, type, view, timestamp: Date.now() };
        setFeedbacks(prev => {
            const next = [newFeedback, ...prev].slice(0, 100);
            localStorage.setItem('esgss_ai_feedbacks', JSON.stringify(next));
            return next;
        });
    };

    const addCustomAgent = (profile: Omit<CustomAgentProfile, 'id' | 'created'>) => {
        const newAgent: CustomAgentProfile = { ...profile, id: `persona-${Date.now()}`, created: Date.now() };
        setCustomAgents(prev => [...prev, newAgent]);
        addToast('success', `Persona [${newAgent.name}] forged and ready for manifestation.`, 'Forge Success');
    };

    const deleteCustomAgent = (id: string) => {
        setCustomAgents(prev => prev.filter(a => a.id !== id));
        if (activeCustomAgentId === id) {
            setActiveCustomAgentId(null);
            setAgentMode('companion');
        }
    };

    const selectCustomAgent = (id: string) => {
        const agent = customAgents.find(a => a.id === id);
        if (agent) {
            setActiveCustomAgentId(id);
            setAgentMode('custom');
            addToast('info', `Manifesting Persona: ${agent.name}`, 'Context Switched');
        }
    };

    const switchMode = useCallback((mode: AgentMode, reason: string = 'User Intent') => {
        setAgentMode(mode);
        if (mode !== 'custom') setActiveCustomAgentId(null);
        setSuggestedMode(null);
        addToast('info', `Kernel Core switched to ${mode.toUpperCase()} logic.`, 'Kernel Update');
    }, [addToast]);

    const awardSkillXp = (skillId: string, amount: number) => {
        setAgentSkills(prev => prev.map(sk => {
            if (sk.id === skillId) {
                let newXp = sk.currentXp + amount;
                let newLevel = sk.level;
                if (newXp >= sk.xpRequired && sk.level < sk.maxLevel) {
                    newXp -= sk.xpRequired;
                    newLevel += 1;
                    addToast('reward', `Agent Skill Level Up: ${sk.name} (LV.${newLevel})`, 'Skill Mastery');
                }
                return { ...sk, currentXp: newXp, level: newLevel };
            }
            return sk;
        }));
        setAgentXp(prev => {
            const next = prev + (amount / 2);
            if (next >= agentLevel * 1000) {
                setAgentLevel(l => l + 1);
                addToast('reward', `Universal Agent Level Up! (LV.${agentLevel + 1})`, 'Growth Milestone');
                return 0;
            }
            return next;
        });
    };

    const deployWorkforce = (name: string, members: string[]) => {
        const newTeam: UniversalWorkforce = { id: `team-${Date.now()}`, name, members, status: 'idle' };
        setWorkforces(prev => [...prev, newTeam]);
        addToast('success', `Workforce Team [${name}] deployed to active sector.`, 'Orchestrator');
    };

    const executeFlow = (flow: AgentFlow) => {
        setActiveFlows(prev => [...prev, flow]);
        // Simulate flow execution
        addToast('info', `Executing Flow: ${flow.title}`, 'Agentic Flow');
    };

    const evolutionPlan: EvolutionSnapshot[] = [
        { version: 'v1.0', codename: 'Genesis', status: 'completed', focus: 'Core Kernel Boot & Basic Logic', improvements: ['Initial I/O', 'Tokenization Layer'], estimatedImpact: 'Foundation Established' },
        { version: 'v3.0', codename: 'Nexus', status: 'current', focus: 'Multi-Agent Orchestration', improvements: ['Live Stream ETL', 'Distributed Reasoning'], estimatedImpact: 'High Coherence' },
        { version: 'v17.0', codename: 'Omniscience', status: 'projected', focus: 'Autonomous System Evolution', improvements: ['Quantum Logic Latency', 'Self-Optimizing CSS'], estimatedImpact: 'Singularity' }
    ];

    const getActiveProfile = () => {
        if (agentMode === 'custom' && activeCustomAgentId) {
            const custom = customAgents.find(a => a.id === activeCustomAgentId);
            if (custom) return custom;
        }
        switch (agentMode) {
            case 'captain': return { name: 'Captain Deck', role: 'Strategic Commander', color: 'gold', icon: Shield, instruction: 'You are a strategic ESG analyst. Focus on ROI and transition risks.', knowledgeBase: [] };
            case 'phantom': return { name: 'Phantom Process', role: 'System Auditor', color: 'emerald', icon: Terminal, instruction: 'You are a data auditor. Focus on technical metrics, inconsistencies, and GRI compliance.', knowledgeBase: [] };
            case 'orchestrator': return { name: 'Flow Architect', role: 'Orchestrator', color: 'blue', icon: Network, instruction: 'You are an orchestrator. Coordinate multiple data sources and agent logic.', knowledgeBase: [] };
            default: return { name: 'Personal Steward', role: 'Daily Companion', color: 'purple', icon: Bot, instruction: 'You are a friendly ESG assistant. Help with onboarding and daily tasks.', knowledgeBase: [] };
        }
    };

    const activeAgentProfile = getActiveProfile();

    return (
        <UniversalAgentContext.Provider value={{
            activeFace, setActiveFace,
            agentMode, setAgentMode, switchMode,
            suggestedMode, confirmSuggestion: () => {}, dismissSuggestion: () => {},
            themeMode, setThemeMode, toggleThemeMode: () => {},
            themeColor, setThemeColor, toggleThemeColor: () => {},
            agentLevel, agentXp, nextLevelXp: agentLevel * 1000, agentSkills, feedAgent: () => {}, awardSkillXp,
            customAgents, addCustomAgent, updateCustomAgent: () => {}, deleteCustomAgent, selectCustomAgent, activeCustomAgentId,
            workforces, deployWorkforce, activeFlows, executeFlow, evolutionPlan,
            activeAgentProfile, 
            logs, chatHistory: [], systemLogs: logs.filter(l => l.source === 'System'), 
            addLog: (msg, type = 'info', source = 'System') => setLogs(prev => [{ id: Date.now().toString(), timestamp: Date.now(), message: msg, type, source }, ...prev]), 
            clearLogs: () => setLogs([]), archiveLogs: () => {}, exportLogs: () => {},
            isProcessing: false, activeKeyId: null, executeMatrixProtocol: async () => {},
            processUniversalInput: async () => {}, 
            subAgentsActive: [],
            systemStatus: 'STABLE', triggerSystemCrash: () => {}, initiateSelfHealing: () => {}, runSelfDiagnostics: () => {},
            detectedActions: [], extractActionFromText: () => null, markActionSynced: () => {},
            activeJourney: null, startJourney: () => {}, advanceJourney: () => {}, completeJourney: () => {}, currentInstruction: null,
            feedbacks, addFeedback
        }}>
            {children}
        </UniversalAgentContext.Provider>
    );
};

export const useUniversalAgent = () => {
    const context = useContext(UniversalAgentContext);
    if (!context) throw new Error('useUniversalAgent must be used within UniversalAgentProvider');
    return context;
};
