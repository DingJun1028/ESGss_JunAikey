
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { JOURNEY_TEMPLATES } from '../constants';
import { UserJourney, JourneyStep, View } from '../types';

export type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID' | 'CUSTOM';
export type AgentMode = 'companion' | 'captain' | 'phantom'; // New Global Mode
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

export interface CustomAgentConfig {
    name: string;
    instruction: string;
    knowledgeBase: string[]; // Array of text content from uploaded files, formatted with headers
}

interface UniversalAgentContextType {
    activeFace: AvatarFace;
    setActiveFace: (face: AvatarFace) => void;
    
    // New: Global Agent Mode (The Avatar Form)
    agentMode: AgentMode;
    setAgentMode: (mode: AgentMode) => void;
    
    customAgent: CustomAgentConfig;
    setCustomAgent: (config: CustomAgentConfig) => void;

    logs: AgentLog[];
    chatHistory: AgentLog[];
    systemLogs: AgentLog[];
    addLog: (message: string, type?: AgentLog['type'], source?: AgentLog['source']) => void;
    
    // Action Plan
    detectedActions: ActionItem[];
    extractActionFromText: (text: string) => ActionItem | null;
    markActionSynced: (id: string) => void;

    clearLogs: () => void;
    archiveLogs: () => void;
    exportLogs: () => void;
    isProcessing: boolean;
    activeKeyId: string | null;
    executeMatrixProtocol: (keyId: string, label: string) => Promise<void>;
    processUniversalInput: (input: string) => Promise<void>; // New Automatic Classification
    subAgentsActive: string[];
    
    systemStatus: SystemStatus;
    triggerSystemCrash: () => void;
    initiateSelfHealing: () => void;

    evolutionPlan: EvolutionMilestone[];
    generateEvolutionReport: () => void;

    // User Journey
    activeJourney: UserJourney | null;
    startJourney: (journeyId: string) => void;
    advanceJourney: () => void;
    completeJourney: () => void;
    currentInstruction: string | null;
}

const UniversalAgentContext = createContext<UniversalAgentContextType | undefined>(undefined);

export const UniversalAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
    const [agentMode, setAgentMode] = useState<AgentMode>('companion'); // Default Mode

    const [customAgent, setCustomAgent] = useState<CustomAgentConfig>({
        name: 'Custom Agent',
        instruction: 'You are a helpful custom assistant.',
        knowledgeBase: []
    });

    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [archivedLogs, setArchivedLogs] = useState<AgentLog[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
    const [subAgentsActive, setSubAgentsActive] = useState<string[]>([]);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>('STABLE');
    const [detectedActions, setDetectedActions] = useState<ActionItem[]>([]);
    
    // Journey State
    const [activeJourney, setActiveJourney] = useState<UserJourney | null>(null);

    const [evolutionPlan, setEvolutionPlan] = useState<EvolutionMilestone[]>([
        { version: 'v1.0', codename: 'Genesis', focus: 'Basic Infrastructure', status: 'completed', improvements: ['Core Kernel Online', 'Basic UI'], estimatedImpact: 'Baseline' },
        { version: 'v15.0', codename: 'Singularity', focus: 'Self-Awareness', status: 'current', improvements: ['Zero Hallucination Protocol', 'Universal Crystal Integration'], estimatedImpact: 'High Accuracy' },
        { version: 'v16.0', codename: 'Ascension', focus: 'Quantum Reasoning', status: 'pending', improvements: ['Context Window 2M Tokens', 'Predictive Latency -40%'], estimatedImpact: 'Strategic Foresight' },
        { version: 'v17.0', codename: 'Omniscience', focus: 'Global Synchronization', status: 'locked', improvements: ['Real-time Planetary Twin', 'Autonomous DAO Governance'], estimatedImpact: 'Global Impact' }
    ]);

    const { addToast } = useToast();

    useEffect(() => {
        addLog('Universal Neural Link Established.', 'info', 'System');
        addLog('Evolution Module: Active. Monitoring system entropy...', 'info', 'Kernel');
    }, []);

    const addLog = (message: string, type: AgentLog['type'] = 'info', source: AgentLog['source'] = 'System') => {
        const newLog = { id: Date.now().toString() + Math.random(), timestamp: Date.now(), source, message, type };
        setLogs(prev => [...prev, newLog]);
    };

    // Separated lists
    const chatHistory = logs.filter(l => l.source === 'Chat' || l.source === 'Assistant');
    // Insights now go to system logs
    const systemLogs = logs.filter(l => l.source !== 'Chat' && l.source !== 'Assistant');

    const extractActionFromText = (text: string): ActionItem | null => {
        // Simple keyword heuristic for demo purposes
        const keywords = ['建議', '需', '檢查', '排程', 'recommend', 'suggest', 'check', 'schedule', 'review'];
        const hasKeyword = keywords.some(k => text.toLowerCase().includes(k));
        
        if (hasKeyword && text.length < 100) {
            const newItem: ActionItem = {
                id: `act-${Date.now()}`,
                text: text.replace(/\[.*?\]/g, '').trim(), // Remove timestamps or tags
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
        const subAgentMap: Record<string, string[]> = {
            'awaken': ['Memory_Core', 'Context_Loader', 'Intent_Parser'],
            'inspect': ['Code_Scanner', 'Data_Validator', 'Pattern_Recognizer'],
            'scripture': ['Knowledge_Retriever', 'Compliance_Check', 'Best_Practice_DB'],
            'connect': ['Graph_Linker', 'Dependency_Mapper', 'Bridge_Builder'],
            'summon': ['API_Gateway', 'Auth_Manager', 'Quota_Monitor'],
            'transmute': ['Format_Converter', 'Schema_Validator', 'Type_Inferencer'],
            'bridge': ['Protocol_Adapter', 'Lang_Translator', 'Env_Configurator'],
            'encase': ['Docker_Builder', 'Module_Packer', 'Version_Tagger'],
            'manifest': ['Code_Generator', 'Text_Synthesizer', 'Asset_Renderer'],
            'trial': ['Unit_Tester', 'Integration_Tester', 'Stress_Tester'],
            'judge': ['Security_Auditor', 'Performance_Profiler', 'Logic_Verifier'],
            'ascend': ['Deploy_Script', 'CI_CD_Pipeline', 'Rollback_Guard'],
            'purify': ['Refactor_Engine', 'Dead_Code_Eliminator', 'Style_Enforcer'],
            'ward': ['Vulnerability_Scanner', 'Firewall_Config', 'Encryption_Key_Rotator'],
            'entropy': ['Compression_Algo', 'Cache_Optimizer', 'Resource_Allocator'],
            'evolve': ['Model_FineTuner', 'Feedback_Loop', 'Trait_Mutator']
        };
        const agents = subAgentMap[keyId] || ['General_Agent'];
        for (const agent of agents) {
            setSubAgentsActive(prev => [...prev, agent]);
            await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
            addLog(`> Agent [${agent}] active...`, 'info', 'System');
        }
        await new Promise(r => setTimeout(r, 800));
        let resultMsg = '';
        if (activeFace === 'MIRROR') resultMsg = `Reflection complete. [${label}] has been integrated into your workflow.`;
        else if (activeFace === 'EXPERT') resultMsg = `Optimization success. [${label}] execution efficiency increased by 24%.`;
        else if (activeFace === 'VOID') resultMsg = `Command [${label}] executed. Output stored in void buffer.`;
        else resultMsg = `Custom Agent executed [${label}].`;
        
        addLog(resultMsg, 'success', 'Matrix');
        addToast('success', `${label} Protocol Complete`, 'Universal Agent');
        setSubAgentsActive([]);
        setIsProcessing(false);
        setActiveKeyId(null);
    };

    const processUniversalInput = async (input: string) => {
        setIsProcessing(true);
        addLog(`Receiving neural signal: "${input.substring(0, 30)}..."`, 'info', 'Matrix');

        // Mock Classification Logic
        const lower = input.toLowerCase();
        let targetMode: AgentMode = 'companion';
        let reasoning = "Input appears conversational.";

        if (lower.includes('monitor') || lower.includes('system') || lower.includes('log') || lower.includes('run') || lower.includes('execute') || lower.includes('deploy') || lower.includes('kernel') || lower.includes('status')) {
            targetMode = 'phantom';
            reasoning = "Detected system commands/background tasks.";
        } else if (lower.includes('analyze') || lower.includes('report') || lower.includes('strategy') || lower.includes('data') || lower.includes('dashboard') || lower.includes('risk') || lower.includes('finance') || lower.includes('predict')) {
            targetMode = 'captain';
            reasoning = "Detected strategic analysis request.";
        } else {
            // Default to Companion for chat, help, ideas, or ambiguous inputs
            targetMode = 'companion';
            reasoning = "Detected conversational/emotional intent.";
        }

        // Simulate AI Processing Delay
        await new Promise(r => setTimeout(r, 1500));

        setAgentMode(targetMode);
        addLog(`Intent Classified: ${targetMode.toUpperCase()}. ${reasoning}`, 'success', 'Kernel');
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
    };

    const currentInstruction = activeJourney ? activeJourney.steps[activeJourney.currentStepIndex].instruction : null;

    return (
        <UniversalAgentContext.Provider value={{
            activeFace, setActiveFace,
            agentMode, setAgentMode, // Added
            customAgent, setCustomAgent,
            logs, chatHistory, systemLogs, 
            addLog, clearLogs, archiveLogs, exportLogs,
            isProcessing, activeKeyId, executeMatrixProtocol,
            processUniversalInput, // New
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
