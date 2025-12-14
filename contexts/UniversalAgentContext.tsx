
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { JOURNEY_TEMPLATES } from '../constants';
import { UserJourney, JourneyStep, View, AgentSkill, CustomAgentProfile } from '../types';
import { Bot, Terminal, Grid, Sparkles, BrainCircuit, User } from 'lucide-react';

export type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID' | 'CUSTOM';
export type AgentMode = 'companion' | 'captain' | 'phantom' | 'custom';
export type SystemStatus = 'STABLE' | 'UNSTABLE' | 'CRITICAL' | 'REBOOTING';

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
}

// Initial Skills
const INITIAL_SKILLS: AgentSkill[] = [
    { id: 'sk-1', name: 'Context Retention', description: 'Increases memory span of conversation.', level: 1, maxLevel: 5, xpRequired: 500, icon: BrainCircuit },
    { id: 'sk-2', name: 'Data Processing', description: 'Faster analysis of large datasets.', level: 1, maxLevel: 5, xpRequired: 800, icon: Grid },
    { id: 'sk-3', name: 'Creative Synthesis', description: 'Better idea generation.', level: 1, maxLevel: 5, xpRequired: 600, icon: Sparkles },
];

interface UniversalAgentContextType {
    activeFace: AvatarFace;
    setActiveFace: (face: AvatarFace) => void;
    
    agentMode: AgentMode;
    setAgentMode: (mode: AgentMode) => void;
    switchMode: (mode: AgentMode, reason?: string) => void;
    
    activeAgentProfile: any; // Derived profile based on mode
    
    // Growth System
    agentLevel: number;
    agentXp: number;
    nextLevelXp: number;
    agentSkills: AgentSkill[];
    feedAgent: (amount: number) => void;
    trainSkill: (skillId: string) => void;

    // Custom Agents
    customAgents: CustomAgentProfile[];
    addCustomAgent: (profile: Omit<CustomAgentProfile, 'id' | 'created'>) => void;
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
    processUniversalInput: (input: string) => Promise<void>; 
    subAgentsActive: string[];
    
    systemStatus: SystemStatus;
    triggerSystemCrash: () => void;
    initiateSelfHealing: () => void;

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
    const [agentMode, setAgentMode] = useState<AgentMode>('companion'); 
    
    // Growth State
    const [agentLevel, setAgentLevel] = useState(1);
    const [agentXp, setAgentXp] = useState(0);
    const [agentSkills, setAgentSkills] = useState<AgentSkill[]>(INITIAL_SKILLS);
    
    // Custom Agent State
    const [customAgents, setCustomAgents] = useState<CustomAgentProfile[]>([]);
    const [activeCustomAgentId, setActiveCustomAgentId] = useState<string | null>(null);

    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [archivedLogs, setArchivedLogs] = useState<AgentLog[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
    const [subAgentsActive, setSubAgentsActive] = useState<string[]>([]);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>('STABLE');
    const [detectedActions, setDetectedActions] = useState<ActionItem[]>([]);
    const [activeJourney, setActiveJourney] = useState<UserJourney | null>(null);

    const [evolutionPlan, setEvolutionPlan] = useState<EvolutionMilestone[]>([
        { version: 'v1.0', codename: 'Genesis', focus: 'Basic Infrastructure', status: 'completed', improvements: ['Core Kernel Online', 'Basic UI'], estimatedImpact: 'Baseline' },
        { version: 'v15.0', codename: 'Singularity', focus: 'Self-Awareness', status: 'current', improvements: ['Zero Hallucination Protocol', 'Universal Crystal Integration'], estimatedImpact: 'High Accuracy' },
        { version: 'v16.0', codename: 'Ascension', focus: 'Quantum Reasoning', status: 'pending', improvements: ['Context Window 2M Tokens', 'Predictive Latency -40%'], estimatedImpact: 'Strategic Foresight' },
        { version: 'v17.0', codename: 'Omniscience', focus: 'Global Synchronization', status: 'locked', improvements: ['Real-time Planetary Twin', 'Autonomous DAO Governance'], estimatedImpact: 'Global Impact' }
    ]);

    const { addToast } = useToast();
    const nextLevelXp = agentLevel * 1000;

    useEffect(() => {
        addLog('Universal Neural Link Established.', 'info', 'System');
        addLog('Evolution Module: Active. Monitoring system entropy...', 'info', 'Kernel');
    }, []);

    // --- Growth Logic ---
    const feedAgent = (amount: number) => {
        setAgentXp(prev => {
            let newXp = prev + amount;
            if (newXp >= nextLevelXp) {
                // Level Up!
                const overflow = newXp - nextLevelXp;
                setAgentLevel(l => l + 1);
                addLog(`Universal Agent reached Level ${agentLevel + 1}!`, 'success', 'Evolution');
                addToast('reward', `Level Up! Agents are smarter now.`, 'Universal Agent');
                return overflow;
            }
            return newXp;
        });
        addLog(`Consumed ${amount} data fragments.`, 'info', 'Assistant');
    };

    const trainSkill = (skillId: string) => {
        setAgentSkills(prev => prev.map(skill => {
            if (skill.id === skillId) {
                if (agentXp >= skill.xpRequired && skill.level < skill.maxLevel) {
                    setAgentXp(xp => xp - skill.xpRequired);
                    addToast('success', `${skill.name} upgraded to Level ${skill.level + 1}`, 'Skill Training');
                    return { ...skill, level: skill.level + 1, xpRequired: Math.floor(skill.xpRequired * 1.5) };
                } else {
                    addToast('error', 'Insufficient XP or Max Level Reached', 'Training Failed');
                }
            }
            return skill;
        }));
    };

    // --- Custom Agent Logic ---
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

    const selectCustomAgent = (id: string) => {
        const agent = customAgents.find(a => a.id === id);
        if (agent) {
            setActiveCustomAgentId(id);
            switchMode('custom', `Loaded personality: ${agent.name}`);
        }
    };

    // --- Derived Profile ---
    const getActiveProfile = () => {
        if (agentMode === 'custom' && activeCustomAgentId) {
            const custom = customAgents.find(a => a.id === activeCustomAgentId);
            if (custom) return {
                name: custom.name,
                role: custom.role,
                instruction: custom.instruction,
                color: custom.color,
                icon: custom.icon || User
            };
        }
        
        switch (agentMode) {
            case 'captain': return { name: 'Captain Deck', role: 'Strategic Commander', instruction: 'You are a strategic advisor.', color: 'gold', icon: Grid };
            case 'phantom': return { name: 'Phantom Process', role: 'System Daemon', instruction: 'You are a linux terminal.', color: 'emerald', icon: Terminal };
            default: return { name: 'Personal Steward', role: 'Companion', instruction: 'You are a helpful assistant.', color: 'purple', icon: Bot };
        }
    };

    const activeAgentProfile = getActiveProfile();

    const switchMode = (mode: AgentMode, reason: string = 'User Override') => {
        setAgentMode(mode);
        addLog(`[MODE SWITCH] ${mode.toUpperCase()} Active. ${reason}`, 'info', 'System');
        
        // Mode specific side-effects
        if (mode === 'phantom') {
            addToast('warning', 'Entering System Root...', 'Phantom Protocol');
        } else if (mode === 'captain') {
            addToast('info', 'Strategic Dashboard Loaded.', 'Captain Deck');
        } else if (mode === 'custom') {
            // Handled by selectCustomAgent primarily, but fallback here
        } else {
            addToast('success', 'Companion Interface Ready.', 'Universal Agent');
        }
    };

    const addLog = (message: string, type: AgentLog['type'] = 'info', source: AgentLog['source'] = 'System') => {
        const newLog = { id: Date.now().toString() + Math.random(), timestamp: Date.now(), source, message, type };
        setLogs(prev => [...prev, newLog]);
    };

    // Separated lists
    const chatHistory = logs.filter(l => l.source === 'Chat' || l.source === 'Assistant');
    const systemLogs = logs.filter(l => l.source !== 'Chat' && l.source !== 'Assistant');

    const extractActionFromText = (text: string): ActionItem | null => {
        const keywords = ['建議', '需', '檢查', '排程', 'recommend', 'suggest', 'check', 'schedule', 'review'];
        const hasKeyword = keywords.some(k => text.toLowerCase().includes(k));
        
        if (hasKeyword && text.length < 100) {
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

    const markActionSynced = (id: string) => {
        setDetectedActions(prev => prev.map(a => a.id === id ? { ...a, status: 'synced' } : a));
    };

    const clearLogs = () => {
        setLogs([]);
        addToast('info', 'Memory buffer flushed.', 'System');
    };

    const archiveLogs = () => {
        setArchivedLogs(prev => [...prev, ...logs]);
        setLogs([]);
        addToast('success', 'Logs archived to secure storage.', 'System');
    };

    const exportLogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `agent_logs_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        addToast('success', 'Logs exported successfully.', 'System');
    };

    const generateEvolutionReport = () => {
        addLog('Initiating Self-Diagnostic Evolution Scan...', 'thinking', 'Evolution');
        setTimeout(() => {
            addLog('Optimization vectors identified. Generating report...', 'success', 'Evolution');
        }, 1500);
    };

    const triggerSystemCrash = () => {
        if (systemStatus !== 'STABLE') return;
        setSystemStatus('UNSTABLE');
        addLog('WARNING: Integrity Breach Detected. Cascade Failure Imminent.', 'error', 'Kernel');
        addToast('error', 'SYSTEM INSTABILITY DETECTED', 'CRITICAL ALERT');
        setTimeout(() => {
            setSystemStatus('CRITICAL');
            addLog('CRITICAL: Core Services Unresponsive. Memory Heap Overflow.', 'error', 'Kernel');
        }, 1500);
        setTimeout(() => {
            initiateSelfHealing();
        }, 4000);
    };

    const initiateSelfHealing = () => {
        if (systemStatus === 'REBOOTING') return;
        addLog('AI AGENT: Intercepting Crash Protocol. Rerouting Neural Pathways...', 'thinking', 'Assistant');
        setSystemStatus('REBOOTING');
        setTimeout(() => {
            setSystemStatus('STABLE');
            addLog('System Fully Restored. Zero Hallucination Protocol Active.', 'success', 'System');
            addToast('success', 'AI Self-Healing Complete.', 'System Restored');
        }, 8000);
    };

    const executeMatrixProtocol = async (keyId: string, label: string) => {
        if (isProcessing || systemStatus !== 'STABLE') return;
        setIsProcessing(true);
        setActiveKeyId(keyId);
        addLog(`Protocol Initiated: [${label.toUpperCase()}]`, 'thinking', 'Matrix');
        // ... (protocol logic same as before, simplified for brevity in this context update)
        const subAgentMap: Record<string, string[]> = {
            'awaken': ['Memory_Core', 'Context_Loader'],
            'inspect': ['Code_Scanner', 'Data_Validator'],
            'scripture': ['Knowledge_Retriever', 'Compliance_Check'],
            'connect': ['Graph_Linker', 'Dependency_Mapper'],
            'summon': ['API_Gateway', 'Auth_Manager'],
            'transmute': ['Format_Converter', 'Schema_Validator'],
            'bridge': ['Protocol_Adapter', 'Env_Configurator'],
            'encase': ['Docker_Builder', 'Module_Packer'],
            'manifest': ['Code_Generator', 'Text_Synthesizer'],
            'trial': ['Unit_Tester', 'Stress_Tester'],
            'judge': ['Security_Auditor', 'Logic_Verifier'],
            'ascend': ['Deploy_Script', 'Rollback_Guard'],
            'purify': ['Refactor_Engine', 'Style_Enforcer'],
            'ward': ['Vulnerability_Scanner', 'Firewall_Config'],
            'entropy': ['Compression_Algo', 'Resource_Allocator'],
            'evolve': ['Model_FineTuner', 'Trait_Mutator']
        };
        const agents = subAgentMap[keyId] || ['General_Agent'];
        for (const agent of agents) {
            setSubAgentsActive(prev => [...prev, agent]);
            await new Promise(r => setTimeout(r, 400));
            addLog(`> Agent [${agent}] active...`, 'info', 'System');
        }
        await new Promise(r => setTimeout(r, 800));
        addLog(`[${label}] Protocol Complete.`, 'success', 'Matrix');
        addToast('success', `${label} Protocol Complete`, 'Universal Agent');
        setSubAgentsActive([]);
        setIsProcessing(false);
        setActiveKeyId(null);
    };

    const processUniversalInput = async (input: string) => {
        setIsProcessing(true);
        addLog(input, 'info', 'Chat');

        const lower = input.toLowerCase();
        let targetMode: AgentMode = agentMode;
        let reasoning = "";
        let isExplicit = false;

        // Explicit Command Handling
        if (lower.startsWith('/captain') || lower.startsWith('/cap')) {
            targetMode = 'captain';
            reasoning = "Manual override: Captain Mode engaged.";
            isExplicit = true;
        } else if (lower.startsWith('/phantom') || lower.startsWith('/dev') || lower.startsWith('/term')) {
            targetMode = 'phantom';
            reasoning = "Manual override: Phantom Protocol engaged.";
            isExplicit = true;
        } else if (lower.startsWith('/companion') || lower.startsWith('/chat') || lower.startsWith('/help')) {
            targetMode = 'companion';
            reasoning = "Manual override: Companion Interface engaged.";
            isExplicit = true;
        }

        // Heuristic Inference (if not explicit)
        if (!isExplicit) {
             const phantomKeywords = ['monitor', 'system', 'log', 'kernel', 'deploy', 'status', 'debug', 'terminal', 'console', 'cli', 'trace', 'init', 'sudo'];
             const captainKeywords = ['analyze', 'report', 'strategy', 'dashboard', 'risk', 'finance', 'predict', 'forecast', 'kpi', 'metric', 'overview', 'summary', 'growth'];
             const companionKeywords = ['hello', 'hi', 'explain', 'write', 'draft', 'suggest', 'idea', 'thank', 'story', 'tell', 'what', 'how', 'why'];

             const phantomScore = phantomKeywords.filter(k => lower.includes(k)).length;
             const captainScore = captainKeywords.filter(k => lower.includes(k)).length;
             const companionScore = companionKeywords.filter(k => lower.includes(k)).length;

             if (phantomScore > 0 && phantomScore >= captainScore && phantomScore >= companionScore) {
                 if (agentMode !== 'phantom') addToast('info', 'Suggestion: Switch to Phantom Mode for system tasks.', 'AI Insight');
             } else if (captainScore > 0 && captainScore > companionScore) {
                 if (agentMode !== 'captain') addToast('info', 'Suggestion: Switch to Captain Mode for analysis.', 'AI Insight');
             }
        }

        // Simulate AI Processing Delay
        const delay = isExplicit ? 600 : 1200;
        await new Promise(r => setTimeout(r, delay));

        if (targetMode !== agentMode && isExplicit) {
            switchMode(targetMode, reasoning);
        } else {
            // Provide contextual response based on current mode
            if (agentMode === 'phantom') {
                addLog(`[EXEC] Command processed: ${input}`, 'success', 'Phantom');
            } else if (agentMode === 'captain') {
                addLog(`[ANALYSIS] Processing strategic request: "${input}"`, 'info', 'Assistant');
            } else if (agentMode === 'custom' && activeAgentProfile) {
                addLog(`[${activeAgentProfile.name}] ${input}`, 'info', 'Assistant');
            } else {
                addLog(`[REPLY] I've received your input: "${input}"`, 'info', 'Assistant');
            }
        }
        
        setIsProcessing(false);
    };

    // --- User Journey Logic ---
    const startJourney = (journeyId: string) => {
        const template = (JOURNEY_TEMPLATES as any)[journeyId];
        if (template) {
            setActiveJourney({ ...template, currentStepIndex: 0, isCompleted: false });
            addLog(`Journey Started: ${template.name}`, 'info', 'Assistant');
            addToast('info', template.description, template.name);
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
        addLog(`Journey Completed: ${activeJourney.name}`, 'success', 'Assistant');
        addToast('reward', 'Journey Complete! +200 XP', 'System');
        feedAgent(200); // Reward Agent Growth
    };

    const currentInstruction = activeJourney ? activeJourney.steps[activeJourney.currentStepIndex].instruction : null;

    return (
        <UniversalAgentContext.Provider value={{
            activeFace, setActiveFace,
            agentMode, setAgentMode, switchMode,
            
            // Growth
            agentLevel, agentXp, nextLevelXp, agentSkills, feedAgent, trainSkill,

            // Custom Agents
            customAgents, addCustomAgent, selectCustomAgent, activeCustomAgentId,
            activeAgentProfile, // Derived
            setCustomAgent: () => {}, // Deprecated or mapped to addCustomAgent if needed, keeping sig for compat
            customAgent: { name: 'Default', instruction: '', knowledgeBase: [] }, // Compat placeholder

            logs, chatHistory, systemLogs, 
            addLog, clearLogs, archiveLogs, exportLogs,
            isProcessing, activeKeyId, executeMatrixProtocol,
            processUniversalInput, 
            subAgentsActive,
            systemStatus, triggerSystemCrash, initiateSelfHealing,
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
    if (!context) throw new Error('useUniversalAgent must be used within a UniversalAgentProvider');
    return context;
};
