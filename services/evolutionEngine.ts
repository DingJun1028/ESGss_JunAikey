
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { 
    InteractionEvent, UniversalKnowledgeNode, UniversalLabel, 
    QuantumNode, SemanticContext, MCPTool, MCPResource, 
    EvolutionStage, EvolutionMilestone 
} from '../types';
import { VerificationEngine } from './verificationEngine';

export interface SystemVital {
  contextLoad: number;
  activeThreads: number;
  memoryNodes: number;
  entropy: number;
  evolutionStage: number;
  networkLatency: number;
  integrityScore: number;
  systemCoherence: number; // 全系統邏輯相干度
}

export interface MCPRegistryItem {
  id: string;
  name: string;
  type: 'tool' | 'resource' | 'prompt';
  description?: string;
  status: 'active' | 'standby' | 'error';
  latency: number;
}

export type SystemEventType = 'CARBON_UPDATED' | 'RISK_ESCALATED' | 'KNOWLEDGE_INGESTED' | 'BUDGET_ALERT' | 'SYSTEM_ERROR' | 'UNIT_TEST_FAIL' | 'EVOLUTION_UPGRADE';

class AIOSKernel {
  private static STORAGE_KEY = 'jun_aikey_aios_kernel_v6_infinite';
  
  private knowledgeGraph: Map<string, UniversalKnowledgeNode>; 
  private quantumStore: Map<string, QuantumNode>;
  private tools: Map<string, MCPTool>;
  private resources: Map<string, MCPResource>;
  private sdrModules: Set<string>;

  private _vitals = new BehaviorSubject<SystemVital>({
    contextLoad: 12, activeThreads: 1, memoryNodes: 8024, entropy: 0.05, 
    evolutionStage: 15, networkLatency: 12, integrityScore: 100, systemCoherence: 95
  });
  private _mcpRegistry = new BehaviorSubject<MCPRegistryItem[]>([]);
  private _neuralBus = new Subject<{ type: SystemEventType, payload: any }>();

  constructor() {
    this.knowledgeGraph = new Map();
    this.quantumStore = new Map();
    this.tools = new Map();
    this.resources = new Map();
    this.sdrModules = new Set();
    
    this.load();
    this.startLifeCycle();
    this.setupNeuralReflexes();
  }

  private startLifeCycle() {
    interval(2000).subscribe(() => {
      const current = this._vitals.value;
      // 計算相干度：基於知識節點的演進階段
      const nodes = Array.from(this.knowledgeGraph.values());
      const evolvedCount = nodes.filter(n => n.evolutionStage === 'Autonomous' || n.evolutionStage === 'Infinite').length;
      const coherence = nodes.length > 0 ? (evolvedCount / nodes.length) * 100 : 100;

      this._vitals.next({
        ...current,
        contextLoad: parseFloat((Math.random() * 20 + 10).toFixed(2)),
        memoryNodes: this.knowledgeGraph.size + this.quantumStore.size,
        entropy: Math.max(0.01, current.entropy - 0.0001), // 持續熵減
        systemCoherence: parseFloat(coherence.toFixed(1)),
        networkLatency: Math.floor(8 + Math.random() * 5)
      });
    });
  }

  private setupNeuralReflexes() {
      this._neuralBus.pipe(filter(e => e.type === 'UNIT_TEST_FAIL')).subscribe(({ payload }) => {
          this.ingestLogToThinkTank('LOGIC_ANOMALY', `Anomaly in ${payload.module}: ${payload.details}`);
      });
  }

  public registerNode(id: string, label: UniversalLabel | string, initialValue: any) {
    if (!this.knowledgeGraph.has(id)) {
      const labelObj: UniversalLabel = typeof label === 'string' ? { id, text: label } : label;
      const newNode: UniversalKnowledgeNode = {
        id, type: 'component', label: labelObj, currentValue: initialValue,
        traits: ['learning'], confidence: 'high', lastInteraction: Date.now(), interactionCount: 0,
        evolutionStage: 'Seed',
        evolutionHistory: [{
            id: `ev-${id}-0`,
            timestamp: Date.now(),
            stage: 'Seed',
            description: 'Component manifested in reality.',
            logicChanges: ['Initialized'],
            verificationHash: '0x' + Math.random().toString(16).substr(2, 8)
        }],
        memory: { history: [], aiInsights: [] }
      };
      this.knowledgeGraph.set(id, newNode);
      this.save();
    }
  }

  public recordInteraction(event: InteractionEvent) {
    const node = this.knowledgeGraph.get(event.componentId);
    if (node) {
      node.interactionCount += 1;
      node.lastInteraction = Date.now();
      
      // 演進邏輯：每 10 次互動進行一次階段評估
      if (node.interactionCount % 10 === 0) {
          this.evaluateEvolution(node);
      }
      
      this.save();
    }
  }

  // Added missing agentUpdate method to fix module error
  public agentUpdate(id: string, updates: Partial<UniversalKnowledgeNode>) {
    const node = this.knowledgeGraph.get(id);
    if (node) {
        this.knowledgeGraph.set(id, { ...node, ...updates });
        this.save();
    }
  }

  private evaluateEvolution(node: UniversalKnowledgeNode) {
      const stages: EvolutionStage[] = ['Seed', 'Structure', 'Optimized', 'Autonomous', 'Infinite'];
      const currentIndex = stages.indexOf(node.evolutionStage);
      
      if (currentIndex < stages.length - 1) {
          const nextStage = stages[currentIndex + 1];
          const milestone: EvolutionMilestone = {
              id: `ev-${node.id}-${node.evolutionHistory.length}`,
              timestamp: Date.now(),
              stage: nextStage,
              description: `Evolved from ${node.evolutionStage} to ${nextStage} via deep interaction.`,
              logicChanges: [`Refined ${node.label.text} logic anchors`, `Entropy reduction complete`],
              verificationHash: '0x' + Math.random().toString(16).substr(2, 8)
          };
          
          node.evolutionStage = nextStage;
          node.evolutionHistory.push(milestone);
          
          // 更新特質
          if (nextStage === 'Optimized') node.traits.push('optimization');
          if (nextStage === 'Autonomous') node.traits.push('evolution');
          if (nextStage === 'Infinite') node.traits.push('transcendent');

          this._neuralBus.next({ type: 'EVOLUTION_UPGRADE', payload: { componentId: node.id, stage: nextStage } });
      }
  }

  private ingestLogToThinkTank(type: string, message: string) {
      this.injectQuantumNodes([{
          id: `log-${Date.now()}`,
          atom: `Kernel Event: ${type}`,
          vector: ['System', 'Logic', 'Verification'],
          weight: 0.95
      }], 'AIOS_Internal');
  }

  public get vitals$() { return this._vitals.asObservable(); }
  public get neuralBus$() { return this._neuralBus.asObservable(); }

  // Added missing mcpRegistry$ observable to fix module error
  public get mcpRegistry$() { return this._mcpRegistry.asObservable(); }

  public emit(type: SystemEventType, payload: any) {
      this._neuralBus.next({ type, payload });
  }

  private load() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(AIOSKernel.STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.nodes) {
              Object.values(parsed.nodes).forEach((n: any) => this.knowledgeGraph.set(n.id, n));
          }
        } catch (e) {}
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      const obj = { nodes: Object.fromEntries(this.knowledgeGraph) };
      localStorage.setItem(AIOSKernel.STORAGE_KEY, JSON.stringify(obj));
    }
  }

  public getNode(id: string): UniversalKnowledgeNode | undefined { return this.knowledgeGraph.get(id); }
  public getAllQuantumNodes(): QuantumNode[] { return Array.from(this.quantumStore.values()); }
  public injectQuantumNodes(nodes: any[], sourceId: string) { /* ... implementation ... */ }
  public isSDRInstalled(id: string): boolean { return this.sdrModules.has(id); }
  public installSDRModule(id: string) { this.sdrModules.add(id); this.save(); }
  public syncGlobalDatabases() { ['sdr-cdp', 'sdr-gri'].forEach(m => this.sdrModules.add(m)); this.save(); }
  public retrieveContextualNodes(context: SemanticContext): QuantumNode[] { return []; }
}

export const universalIntelligence = new AIOSKernel();
