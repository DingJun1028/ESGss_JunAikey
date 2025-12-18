import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { JOURNEY_TEMPLATES } from '../constants';
import { UserJourney, JourneyStep, View, AgentSkill, CustomAgentProfile } from '../types';
import { Bot, Terminal, Grid, Sparkles, BrainCircuit, User, Database, Layers, Monitor, Shield, Zap } from 'lucide-react';

export type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID' | 'CUSTOM';
export type AgentMode = 'companion' | 'captain' | 'phantom' | 'custom';
export type SystemStatus = 'STABLE' | 'UNSTABLE' | 'CRITICAL' | 'REBOOTING';
export type AppThemeMode = 'dark' | 'light';
export type AppThemeColor = 'celestial' | 'esg-sunshine';

export interface AgentLog {
    id: string;
    timestamp: number;
    source: 'Matrix' | 'Chat' | 'System' | 'Assistant' | 'Kernel' | 'Evolution' | 'Insight' | 'Phantom';
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

export interface EvolutionMilestone {
    version: string;
    codename: string;
    focus: string;
    status: 'completed' | 'current' | 'pending' | 'locked';
    improvements: string[];
    estimatedImpact: string;
    evaluation: string;
    predictedPath: string;
}

const INITIAL_SKILLS: AgentSkill[] = [
    { id: 'sk-1', name: 'Context Retention', description: 'Zero Hallucination Protocol: Retrieval from Personal Universal Think Tank (Notion/Drive/Files).', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 100, icon: BrainCircuit },
    { id: 'sk-2', name: 'Data Processing', description: 'Analysis speed for imported datasets (CSV/PDF) and external DBs.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 100, icon: Grid },
    { id: 'sk-3', name: 'Creative Synthesis', description: 'Generative UI and rich storytelling based on verified facts.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 100, icon: Sparkles },
    { id: 'sk-4', name: 'System Integration', description: 'Connectors for Capacities, InfoFlow, UpNote, and Cloud Storage.', level: 1, maxLevel: 10, currentXp: 0, xpRequired: 150, icon: Layers },
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
    agentSkills: AgentSkill[];
    feedAgent: (amount: number) => void; 
    awardSkillXp: (skillId: string, amount: number) => void; 
    trainSkill: (skillId: string) => void;

    customAgents: CustomAgentProfile[];
    addCustomAgent: (profile: Omit<CustomAgentProfile, 'id' | 'created'>) => void;
    deleteCustomAgent: (id: string) => void;
    selectCustomAgent: (id: string) => void;
    activeCustomAgentId: string | null;

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

    evolutionPlan: EvolutionMilestone[];
    generateEvolutionReport: () => void;

    activeJourney: UserJourney | null;
    startJourney: (journeyId: string) => void;
    advanceJourney: () => void;
    completeJourney: () => void;
    currentInstruction: string | null;
}

const UniversalAgentContext = createContext<UniversalAgentContextType | undefined>(undefined);

export const UniversalAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
    const [agentMode, setAgentMode] = useState<AgentMode>(() => (localStorage.getItem('agent_mode') as AgentMode) || 'companion'); 
    const [suggestedMode, setSuggestedMode] = useState<AgentMode | null>(null);
    
    const [themeMode, setThemeMode] = useState<AppThemeMode>(() => (localStorage.getItem('app_theme_mode') as AppThemeMode) || 'dark');
    const [themeColor, setThemeColor] = useState<AppThemeColor>(() => (localStorage.getItem('app_theme_color') as AppThemeColor) || 'celestial');
    
    const [agentLevel, setAgentLevel] = useState(1);
    const [agentXp, setAgentXp] = useState(0);
    const [agentSkills, setAgentSkills] = useState<AgentSkill[]>(INITIAL_SKILLS);
    
    const [customAgents, setCustomAgents] = useState<CustomAgentProfile[]>(() => {
        const saved = localStorage.getItem('custom_agents');
        return saved ? JSON.parse(saved) : [];
    });
    const [activeCustomAgentId, setActiveCustomAgentId] = useState<string | null>(() => localStorage.getItem('active_custom_agent_id'));

    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [archivedLogs, setArchivedLogs] = useState<AgentLog[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
    const [subAgentsActive, setSubAgentsActive] = useState<string[]>([]);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>('STABLE');
    const [detectedActions, setDetectedActions] = useState<ActionItem[]>([]);
    const [activeJourney, setActiveJourney] = useState<UserJourney | null>(null);

    const [evolutionPlan, setEvolutionPlan] = useState<EvolutionMilestone[]>([
        { 
            version: 'v1.0', 
            codename: 'Genesis', 
            focus: 'Basic Infrastructure', 
            status: 'completed', 
            improvements: ['Core Kernel Online', 'Basic UI'], 
            estimatedImpact: 'Baseline',
            evaluation: 'Initial system stability confirmed. Basic cognitive functions operational.',
            predictedPath: 'Establish neural baseline.'
        },
        { 
            version: 'v15.0', 
            codename: 'Singularity', 
            focus: 'Self-Awareness', 
            status: 'current', 
            improvements: ['Zero Hallucination Protocol', 'Universal Crystal Integration'], 
            estimatedImpact: 'High Accuracy',
            evaluation: 'System has achieved Level 1 self-awareness. Zero Hallucination Protocol reducing error rate by 99%.',
            predictedPath: 'Expand context window and recursive reasoning capabilities.'
        },
        { 
            version: 'v16.0', 
            codename: 'Ascension', 
            focus: 'Quantum Reasoning', 
            status: 'pending', 
            improvements: ['Context Window 2M Tokens', 'Predictive Latency -40%'], 
            estimatedImpact: 'Strategic Foresight',
            evaluation: 'Projected cognitive leap. Pending resource allocation for Quantum Lattice.',
            predictedPath: 'Integration with global real-time data streams.'
        },
        { 
            version: 'v17.0', 
            codename: 'Omniscience', 
            focus: 'Global Synchronization', 
            status: 'locked', 
            improvements: ['Real-time Planetary Twin', 'Autonomous DAO Governance'], 
            estimatedImpact: 'Global Impact',
            evaluation: 'Theoretical limit of current architecture. Requires distributed planetary compute.',
            predictedPath: 'Total system ubiquity.'
        }
    ]);

    const { addToast } = useToast();
    const nextLevelXp = agentLevel * 1000;

    useEffect(() => {
        localStorage.setItem('custom_agents', JSON.stringify(customAgents));
    }, [customAgents]);

    useEffect(() => {
        if (activeCustomAgentId) localStorage.setItem('active_custom_agent_id', activeCustomAgentId);
        else localStorage.removeItem('active_custom_agent_id');
    }, [activeCustomAgentId]);

    useEffect(() => {
        localStorage.setItem('agent_mode', agentMode);
    }, [agentMode]);

    useEffect(() => {
        localStorage.setItem('app_theme_mode', themeMode);
        localStorage.setItem('app_theme_color', themeColor);
        const root = document.documentElement;
        if (themeMode === 'light') root.classList.add('theme-light');
        else root.classList.remove('theme-light');
        if (themeColor === 'esg-sunshine') root.classList.add('theme-esg-sunshine');
        else root.classList.remove('theme-esg-sunshine');
    }, [themeMode, themeColor]);

    const toggleThemeMode = () => {
        const nextMode = themeMode === 'dark' ? 'light' : 'dark';
        setThemeMode(nextMode);
        addToast('info', `Mode switched to: ${nextMode.toUpperCase()}`, 'System UI');
    };

    const toggleThemeColor = () => {
        const nextColor = themeColor === 'celestial' ? 'esg-sunshine' : 'celestial';
        setThemeColor(nextColor);
        addToast('info', `Style switched to: ${nextColor === 'celestial' ? 'Celestial' : 'ESG Sunshine'}`, 'System UI');
    };

    const feedAgent = (amount: number) => {
        setAgentXp(prev => {
            let newXp = prev + amount;
            if (newXp >= nextLevelXp) {
                const overflow = newXp - nextLevelXp;
                setAgentLevel(l => l + 1);
                addLog(`Universal Agent reached Level ${agentLevel + 1}!`, 'success', 'Evolution');
                addToast('reward', `Agent Level Up! Processing Power Increased.`, 'Universal Agent');
                return overflow;
            }
            return newXp;
        });
        if (amount > 50) addLog(`Consumed ${amount} data fragments (Global XP).`, 'info', 'Assistant');
    };

    const awardSkillXp = (skillId: string, amount: number) => {
        setAgentSkills(prev => prev.map(skill => {
            if (skill.id === skillId) {
                let newXp = skill.currentXp + amount;
                let newLevel = skill.level;
                let newReq = skill.xpRequired;
                let leveledUp = false;
                while (newXp >= newReq && newLevel < skill.maxLevel) {
                    newXp -= newReq;
                    newLevel++;
                    newReq = Math.floor(newReq * 1.5); 
                    leveledUp = true;
                }
                if (skill.level >= skill.maxLevel) newXp = skill.xpRequired; 
                if (leveledUp) {
                    addToast('reward', `${skill.name} Leveled Up to ${newLevel}!`, 'Skill Upgrade');
                    addLog(`Skill Evolved: ${skill.name} -> Lv.${newLevel}`, 'success', 'Evolution');
                    feedAgent(newLevel * 100);
                }
                return { ...skill, level: newLevel, currentXp: newXp, xpRequired: newReq };
            }
            return skill;
        }));
    };

    const trainSkill = (skillId: string) => awardSkillXp(skillId, 50); 

    const addCustomAgent = (profile: Omit<CustomAgentProfile, 'id' | 'created'>) => {
        const newAgent: CustomAgentProfile = {
            ...profile,
            id: `custom-${Date.now()}`,
            created: Date.now()
        };
        setCustomAgents(prev => [...prev, newAgent]);
        addLog(`Custom Agent [${newAgent.name}] compiled successfully.`, 'success', 'Matrix');
        addToast('success', 'New Agent Created', 'Factory');
    };

    const deleteCustomAgent = (id: string) => {
        setCustomAgents(prev => prev.filter(a => a.id !== id));
        if (activeCustomAgentId === id) {
            setActiveCustomAgentId(null);
            switchMode('companion', 'Active agent deleted');
        }
        addToast('info', 'Custom Agent removed.', 'Factory');
    };

    const selectCustomAgent = (id: string) => {
        const agent = customAgents.find(a => a.id === id);
        if (agent) {
            setActiveCustomAgentId(id);
            switchMode('custom', `Loaded personality: ${agent.name}`);
        }
    };

    const getActiveProfile = () => {
        if (agentMode === 'custom' && activeCustomAgentId) {
            const custom = customAgents.find(a => a.id === activeCustomAgentId);
            if (custom) return {
                name: custom.name,
                role: custom.role,
                instruction: custom.instruction,
                color: custom.color,
                icon: custom.icon || User,
                knowledgeBase: custom.knowledgeBase
            };
        }
        switch (agentMode) {
            case 'captain': return { name: 'Captain Deck', role: 'Strategic Commander', instruction: 'You are a strategic advisor focusing on corporate ROI, risk assessment, and long-term ESG planning. Use data-driven language.', color: 'gold', icon: Shield };
            case 'phantom': return { name: 'Phantom Process', role: 'System Daemon', instruction: 'You are a system monitor and kernel auditor. You provide raw system logs, latency metrics, and technical insights. Tone: Technical, CLI-style.', color: 'emerald', icon: Terminal };
            default: return { name: 'Personal Steward', role: 'Companion', instruction: 'You are a friendly and proactive ESG companion. You help users navigate the platform and understand sustainability concepts simply.', color: 'purple', icon: Bot };
        }
    };

    const activeAgentProfile = getActiveProfile();

    const switchMode = (mode: AgentMode, reason: string = 'User Override') => {
        if (mode === agentMode && mode !== 'custom') return;
        setAgentMode(mode);
        setSuggestedMode(null); 
        addLog(`[SYSTEM_OS] Mode switch initiated: ${mode.toUpperCase()}.`, 'thinking', 'Kernel');
        addLog(`[SYSTEM_OS] Reallocating cognitive resources...`, 'thinking', 'Kernel');
        
        setTimeout(() => {
            addLog(`[SYSTEM_OS] Mode optimized: ${mode.toUpperCase()}. Source: ${reason}`, 'success', 'Kernel');
            if (mode === 'phantom') addToast('warning', 'System Root Access Granted.', 'Phantom Mode');
            else if (mode === 'captain') addToast('info', 'Strategic War Room Active.', 'Captain Mode');
            else if (mode === 'custom') addToast('success', `Agent Identity Verified.`, 'Custom Mode');
            else addToast('success', 'Companion Active.', 'Steward Mode');
        }, 800);
    };

    const confirmSuggestion = () => suggestedMode && switchMode(suggestedMode, 'AI Suggestion accepted');
    const dismissSuggestion = () => setSuggestedMode(null);

    const addLog = (message: string, type: AgentLog['type'] = 'info', source: AgentLog['source'] = 'System') => {
        const newLog = { id: Date.now().toString() + Math.random(), timestamp: Date.now(), source, message, type };
        setLogs(prev => [...prev, newLog]);
    };

    const chatHistory = logs.filter(l => l.source === 'Chat' || l.source === 'Assistant');
    const systemLogs = logs.filter(l => l.source !== 'Chat' && l.source !== 'Assistant');

    const extractActionFromText = (text: string): ActionItem | null => {
        const keywords = ['建議', '需', '檢查', '排程', 'recommend', 'suggest', 'check', 'schedule', 'review'];
        if (keywords.some(k => text.toLowerCase().includes(k)) && text.length < 100) {
            const newItem: ActionItem = {
                id: `act-${Date.now()}`,
                text: text.replace(/\[.*?\]/g, '').trim(), 
                status: 'pending',
                timestamp: Date.now(),
                priority: text.includes('立即') || text.includes('urgent') ? 'high' : 'medium'
            };
            setDetectedActions(prev => [newItem, ...prev]);
            return newItem;
        }
        return null;
    };

    const markActionSynced = (id: string) => setDetectedActions(prev => prev.map(a => a.id === id ? { ...a, status: 'synced' } : a));
    const clearLogs = () => { setLogs([]); addToast('info', 'Buffer flushed.', 'System'); };
    const archiveLogs = () => { setArchivedLogs(prev => [...prev, ...logs]); setLogs([]); addToast('success', 'Logs archived.', 'System'); };
    const exportLogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", `jak_logs_${Date.now()}.json`);
        anchor.click();
        anchor.remove();
    };

    const generateEvolutionReport = () => {
        addLog('Initiating Self-Diagnostic Evolution Scan...', 'thinking', 'Evolution');
        setTimeout(() => addLog('Optimization vectors identified.', 'success', 'Evolution'), 1500);
    };

    const triggerSystemCrash = () => {
        if (systemStatus !== 'STABLE') return;
        setSystemStatus('UNSTABLE');
        addLog('WARNING: Integrity Breach Detected.', 'error', 'Kernel');
        setTimeout(() => setSystemStatus('CRITICAL'), 1500);
        setTimeout(() => initiateSelfHealing(), 4000);
    };

    const initiateSelfHealing = () => {
        if (systemStatus === 'REBOOTING') return;
        addLog('AI: Intercepting Crash Protocol. Rerouting...', 'thinking', 'Assistant');
        setSystemStatus('REBOOTING');
        setTimeout(() => {
            setSystemStatus('STABLE');
            addLog('System Restored.', 'success', 'System');
            addToast('success', 'Neural Link Stabilized.', 'System Restored');
        }, 8000);
    };
    
    const runSelfDiagnostics = () => {
        addLog('Initiating Self-Detection Sequence...', 'thinking', 'Kernel');
        setIsProcessing(true);
        setTimeout(() => {
            addLog('Neural pathways optimized.', 'success', 'Evolution');
            setIsProcessing(false);
        }, 3500);
    };

    const executeMatrixProtocol = async (keyId: string, label: string) => {
        if (isProcessing || systemStatus !== 'STABLE') return;
        setIsProcessing(true);
        setActiveKeyId(keyId);
        addLog(`Protocol Initiated: [${label.toUpperCase()}]`, 'thinking', 'Matrix');
        const subAgentMap: Record<string, string[]> = {
            'awaken': ['Memory_Core', 'Context_Loader'],
            'inspect': ['Code_Scanner', 'Data_Validator'],
            'scripture': ['Knowledge_Retriever', 'Compliance_Check'],
            'connect': ['Graph_Linker', 'Dependency_Mapper'],
            'summon': ['API_Gateway', 'Auth_Manager'],
            'transmute': ['Format_Converter', 'Schema_Validator']
        };
        const agents = subAgentMap[keyId] || ['General_Agent'];
        for (const agent of agents) {
            setSubAgentsActive(prev => [...prev, agent]);
            await new Promise(r => setTimeout(r, 400));
        }
        await new Promise(r => setTimeout(r, 800));
        addLog(`[${label}] Protocol Complete.`, 'success', 'Matrix');
        setSubAgentsActive([]);
        setIsProcessing(false);
        setActiveKeyId(null);
    };

    const processUniversalInput = async (input: string, currentView?: View) => {
        setIsProcessing(true);
        addLog(input, 'info', 'Chat');
        const lower = input.toLowerCase().trim();
        
        // --- Enhanced Suggestion Logic ---
        let suggested: AgentMode | null = null;
        
        // View-based suggestions
        if (currentView === View.DASHBOARD || currentView === View.STRATEGY || currentView === View.FINANCE) {
            if (agentMode !== 'captain') suggested = 'captain';
        } else if (currentView === View.API_ZONE || currentView === View.UNIVERSAL_BACKEND || currentView === View.DIAGNOSTICS) {
            if (agentMode !== 'phantom') suggested = 'phantom';
        }

        // Keyword-based overrides
        const phantomWords = ['api', 'log', 'kernel', 'root', 'debug', 'monitor', 'deploy', 'system', 'latency', 'version'];
        const captainWords = ['roi', 'strategy', 'risk', 'dashboard', 'finance', 'report', 'benchmark', 'audit', 'plan'];
        const companionWords = ['help', 'hello', 'explain', 'what is', 'guide', 'story', 'simplify'];

        const pScore = phantomWords.filter(w => lower.includes(w)).length;
        const capScore = captainWords.filter(w => lower.includes(w)).length;
        const comScore = companionWords.filter(w => lower.includes(w)).length;

        if (pScore > capScore && pScore > comScore && agentMode !== 'phantom') suggested = 'phantom';
        else if (capScore > pScore && capScore > comScore && agentMode !== 'captain') suggested = 'captain';
        else if (comScore > pScore && comScore > capScore && agentMode !== 'companion') suggested = 'companion';

        if (suggested && suggested !== agentMode) {
            setSuggestedMode(suggested);
        }

        // Skill triggers
        if (lower.match(/analyze|data|calc|stats|trend|forecast/)) awardSkillXp('sk-2', 15);
        else if (lower.match(/write|create|draft|idea|suggest|generate/)) awardSkillXp('sk-3', 15);
        else if (lower.length > 50 || lower.match(/remember|context|history|previous/)) awardSkillXp('sk-1', 10);

        // Command processing
        if (lower.startsWith('/') || lower.startsWith('switch ')) {
            let target: AgentMode | null = null;
            if (lower.match(/captain|cap|strategy|executive/)) target = 'captain';
            else if (lower.match(/phantom|dev|term|cli|root|system/)) target = 'phantom';
            else if (lower.match(/companion|chat|help|normal/)) target = 'companion';
            
            if (target) {
                switchMode(target, "User command detected.");
                setIsProcessing(false);
                return;
            }
        }

        await new Promise(r => setTimeout(r, 1200));
        addLog(`Received: "${input}". Logic Core: ${agentMode.toUpperCase()} active.`, 'info', 'Assistant');
        setIsProcessing(false);
    };

    const startJourney = (journeyId: string) => {
        const template = (JOURNEY_TEMPLATES as any)[journeyId];
        if (template) {
            setActiveJourney({ ...template, currentStepIndex: 0, isCompleted: false });
            addLog(`Journey Started: ${template.name}`, 'info', 'Assistant');
        }
    };

    const advanceJourney = () => {
        if (!activeJourney) return;
        const nextIndex = activeJourney.currentStepIndex + 1;
        if (nextIndex < activeJourney.steps.length) {
            setActiveJourney(prev => prev ? ({ 
                ...prev, 
                currentStepIndex: nextIndex,
                steps: prev.steps.map((s, i) => i === prev.currentStepIndex ? { ...s, status: 'completed' } : s)
            }) : null);
        } else {
            completeJourney();
        }
    };

    const completeJourney = () => {
        if (!activeJourney) return;
        setActiveJourney(null);
        feedAgent(200);
    };

    const currentInstruction = activeJourney ? activeJourney.steps[activeJourney.currentStepIndex].instruction : null;

    return (
        <UniversalAgentContext.Provider value={{
            activeFace, setActiveFace,
            agentMode, setAgentMode, switchMode,
            suggestedMode, confirmSuggestion, dismissSuggestion,
            themeMode, setThemeMode, toggleThemeMode,
            themeColor, setThemeColor, toggleThemeColor,
            agentLevel, agentXp, nextLevelXp, agentSkills, feedAgent, trainSkill, awardSkillXp,
            customAgents, addCustomAgent, deleteCustomAgent, selectCustomAgent, activeCustomAgentId,
            activeAgentProfile, 
            logs, chatHistory, systemLogs, 
            addLog, clearLogs, archiveLogs, exportLogs,
            isProcessing, activeKeyId, executeMatrixProtocol,
            processUniversalInput, 
            subAgentsActive,
            systemStatus, triggerSystemCrash, initiateSelfHealing, runSelfDiagnostics,
            evolutionPlan, generateEvolutionReport,
            detectedActions, extractActionFromText, markActionSynced,
            activeJourney, startJourney, advanceJourney, completeJourney, currentInstruction
        }}>
            {children}
        </UniversalAgentContext.Provider>
    );
};

export const useUniversalAgent = () => {
    const context = useContext(UniversalAgentContext);
    if (!context) throw new Error('useUniversalAgent error');
    return context;
};