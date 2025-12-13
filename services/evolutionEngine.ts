
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { InteractionEvent, UniversalKnowledgeNode, UniversalLabel, CardSynergy, QuantumNode, SemanticContext, MCPTool, MCPResource, MCPPrompt } from '../types';
import { getCardSynergies } from '../constants';

type Listener = (node: UniversalKnowledgeNode) => void;

// 定義系統核心指標 (System Vitals)
export interface SystemVital {
  contextLoad: number;      // 上下文視窗負載 (0-100%)
  activeThreads: number;    // 活躍的 Agent 執行緒
  memoryNodes: number;      // 知識圖譜 (RAG) 節點數量
  entropy: number;          // 系統熵值 (模擬混亂度/需優化程度)
  evolutionStage: number;   // 當前演化世代 (自我優化次數)
  networkLatency: number;   // 神經網絡延遲
}

// MCP 工具註冊項目
export interface MCPRegistryItem {
  id: string;
  name: string;
  type: 'tool' | 'resource' | 'prompt';
  description?: string;
  status: 'active' | 'standby' | 'error';
  latency: number;
}

// Neural Events
export type SystemEventType = 'CARBON_UPDATED' | 'RISK_ESCALATED' | 'KNOWLEDGE_INGESTED' | 'BUDGET_ALERT';

/**
 * AIOS Kernel (Universal Intelligence Engine v4.0 - Singularity).
 * Optimized with Neural Event Bus for seamless cross-module reflexes.
 */
class AIOSKernel {
  private static STORAGE_KEY = 'jun_aikey_aios_kernel_v4';
  private static MAX_MEMORY_ITEMS = 50;
  
  private knowledgeGraph: Map<string, UniversalKnowledgeNode>; 
  private subscribers: Map<string, Set<Listener>>;
  private quantumStore: Map<string, QuantumNode>;
  private tools: Map<string, MCPTool>;
  private resources: Map<string, MCPResource>;
  private prompts: Map<string, MCPPrompt>;
  private sdrModules: Set<string>;

  // RxJS Streams
  private _vitals = new BehaviorSubject<SystemVital>({
    contextLoad: 12, activeThreads: 1, memoryNodes: 8024, entropy: 0.05, evolutionStage: 1, networkLatency: 12
  });
  private _mcpRegistry = new BehaviorSubject<MCPRegistryItem[]>([]);
  
  // The Neural Bus (Event Stream)
  private _neuralBus = new Subject<{ type: SystemEventType, payload: any }>();

  constructor() {
    this.knowledgeGraph = new Map();
    this.subscribers = new Map();
    this.quantumStore = new Map();
    this.tools = new Map();
    this.resources = new Map();
    this.prompts = new Map();
    this.sdrModules = new Set();
    
    this.initializeMCP();
    this.load();
    this.startLifeCycle();
    this.setupNeuralReflexes();
  }

  // --- Life Cycle & Optimization ---

  private startLifeCycle() {
    interval(1500).subscribe(() => {
      const current = this._vitals.value;
      
      // Simulate dynamic load based on active threads
      const targetLoad = 10 + (current.activeThreads * 5);
      const smoothing = 0.1;
      let newLoad = current.contextLoad + (targetLoad - current.contextLoad) * smoothing;
      
      // Entropy naturally increases over time, decreases with 'evolution' events
      let newEntropy = Math.min(1, current.entropy + 0.001);

      // Evolution Mechanic
      let newStage = current.evolutionStage;
      if (current.activeThreads > 5 && Math.random() > 0.95) {
        newStage += 1;
        newEntropy = Math.max(0, newEntropy - 0.2); // Evolution reduces entropy
      }

      this._vitals.next({
        ...current,
        contextLoad: parseFloat(newLoad.toFixed(2)),
        memoryNodes: this.knowledgeGraph.size + this.quantumStore.size,
        entropy: parseFloat(newEntropy.toFixed(4)),
        evolutionStage: newStage,
        networkLatency: Math.floor(10 + Math.random() * 15)
      });
    });
  }

  // --- Neural Reflexes (Cross-Module Logic) ---
  private setupNeuralReflexes() {
      // Reflex 1: Carbon High -> Risk Escalation
      this._neuralBus.pipe(
          filter(e => e.type === 'CARBON_UPDATED')
      ).subscribe(({ payload }) => {
          const totalEmissions = payload.scope1 + payload.scope2;
          // If emissions spike, trigger risk alert
          if (totalEmissions > 1000) {
              this.emit('RISK_ESCALATED', { source: 'CarbonAsset', level: 'critical', factor: 'Emission Spike' });
              this.agentUpdate('StrategyOracle', { confidence: 'low', traits: ['gap-filling'] }); // Degrade strategy confidence
          } else {
              this.agentUpdate('StrategyOracle', { confidence: 'high', traits: ['optimization'] });
          }
      });
  }

  // --- Public API ---

  public get vitals$() { return this._vitals.asObservable(); }
  public get mcpRegistry$() { return this._mcpRegistry.asObservable(); }
  public get neuralBus$() { return this._neuralBus.asObservable(); }

  public emit(type: SystemEventType, payload: any) {
      console.log(`[Neural Bus] Signal: ${type}`, payload);
      this._neuralBus.next({ type, payload });
      
      // Spike activity on bus event
      const v = this._vitals.value;
      this._vitals.next({ ...v, activeThreads: v.activeThreads + 1 });
      setTimeout(() => this._vitals.next({ ...this._vitals.value, activeThreads: Math.max(1, this._vitals.value.activeThreads - 1) }), 2000);
  }

  private initializeMCP() {
      // Register Standard MCP Tools
      this.registerTool({ name: 'generate_report', description: 'Generates a sustainability report section.', inputSchema: {}, requiresApproval: true });
      this.registerTool({ name: 'query_database', description: 'Queries internal SQL or Vector DB.', inputSchema: {} });
      this.registerTool({ name: 'send_email', description: 'Sends an email notification.', inputSchema: {}, requiresApproval: true });
      this.registerResource({ uri: 'db://esg/emissions', name: 'Emission Database', mimeType: 'application/json' });
      this.registerResource({ uri: 'api://sdr/gri-standards', name: 'GRI Standards 2024', mimeType: 'application/pdf' });
      this.broadcastRegistry();
  }

  private broadcastRegistry() {
      const items: MCPRegistryItem[] = [];
      this.tools.forEach(t => items.push({ id: t.name, name: t.name, type: 'tool', description: t.description, status: 'active', latency: Math.floor(Math.random() * 50) }));
      this.resources.forEach(r => items.push({ id: r.uri, name: r.name, type: 'resource', description: r.mimeType, status: 'active', latency: 10 }));
      this._mcpRegistry.next(items);
  }

  public registerTool(tool: MCPTool) { this.tools.set(tool.name, tool); this.broadcastRegistry(); }
  public registerResource(resource: MCPResource) { this.resources.set(resource.uri, resource); this.broadcastRegistry(); }
  public registerPrompt(prompt: MCPPrompt) { this.prompts.set(prompt.name, prompt); }
  public getAllPrompts(): MCPPrompt[] { return Array.from(this.prompts.values()); }

  private load() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(AIOSKernel.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.nodes) Object.values(parsed.nodes).forEach((n: any) => this.knowledgeGraph.set(n.id, n));
          if (parsed.sdr) parsed.sdr.forEach((m: string) => this.sdrModules.add(m));
          if (parsed.quantum) Object.values(parsed.quantum).forEach((n: any) => this.quantumStore.set(n.id, n));
        } else {
          this.injectGenesisSeeds();
        }
      } catch (e) { console.error("AIOS Kernel: Memory Load Error", e); }
    }
  }

  private injectGenesisSeeds() {
      this.registerNode('428_Main', { id: '428_Main', text: 'JunAiKey Kernel' }, 'Standby');
      this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      const obj = {
          nodes: Object.fromEntries(this.knowledgeGraph),
          sdr: Array.from(this.sdrModules),
          quantum: Object.fromEntries(this.quantumStore)
      };
      localStorage.setItem(AIOSKernel.STORAGE_KEY, JSON.stringify(obj));
    }
  }

  public registerNode(id: string, label: UniversalLabel | string, initialValue: any) {
    if (!this.knowledgeGraph.has(id)) {
      const labelObj: UniversalLabel = typeof label === 'string' ? { id, text: label } : label;
      const newNode: UniversalKnowledgeNode = {
        id, type: 'component', label: labelObj, currentValue: initialValue,
        traits: [], confidence: 'high', lastInteraction: Date.now(), interactionCount: 0,
        memory: { history: [], aiInsights: [] }
      };
      this.knowledgeGraph.set(id, newNode);
      this.save();
    }
  }

  public subscribe(id: string, listener: Listener): () => void {
    if (!this.subscribers.has(id)) this.subscribers.set(id, new Set());
    this.subscribers.get(id)!.add(listener);
    return () => {
      const listeners = this.subscribers.get(id);
      if (listeners) {
          listeners.delete(listener);
          if (listeners.size === 0) this.subscribers.delete(id);
      }
    };
  }

  private notify(node: UniversalKnowledgeNode) {
    this.subscribers.get(node.id)?.forEach(l => l(node));
  }

  public recordInteraction(event: InteractionEvent) {
    const { componentId, eventType, payload } = event;
    const node = this.knowledgeGraph.get(componentId);
    if (node) {
      node.interactionCount += 1;
      node.lastInteraction = Date.now();
      const traits = new Set(node.traits);
      if (node.interactionCount > 5) traits.add('optimization'); 
      if (eventType === 'ai-trigger') traits.add('learning');    
      if (node.interactionCount > 50) traits.add('evolution');   
      node.traits = Array.from(traits);
      if (node.memory.history.length >= AIOSKernel.MAX_MEMORY_ITEMS) node.memory.history.shift();
      node.memory.history.push({ eventType, timestamp: Date.now(), payload });
      this.knowledgeGraph.set(componentId, node);
      this.save();
      this.notify(node);
    }
  }

  public agentUpdate(id: string, updates: Partial<UniversalKnowledgeNode>) {
      const node = this.knowledgeGraph.get(id);
      if (node) {
          Object.assign(node, updates);
          this.knowledgeGraph.set(id, node);
          this.save();
          this.notify(node);
      }
  }

  public getNode(id: string): UniversalKnowledgeNode | undefined { return this.knowledgeGraph.get(id); }
  
  public installSDRModule(moduleId: string) { this.sdrModules.add(moduleId); this.save(); return true; }
  public isSDRInstalled(moduleId: string): boolean { return this.sdrModules.has(moduleId); }
  public syncGlobalDatabases() { ['sdr-cdp', 'sdr-gri', 'sdr-ifrs'].forEach(id => this.sdrModules.add(id)); this.save(); }

  public calculateActiveSynergies(collectedCardIds: string[], lang: 'zh-TW' | 'en-US'): CardSynergy[] {
      const allSynergies = getCardSynergies(lang);
      return allSynergies.filter(synergy => synergy.requiredCards.every(reqId => collectedCardIds.includes(reqId)));
  }

  public injectQuantumNodes(nodes: any[], sourceId: string) {
      nodes.forEach(node => {
          const qNode: QuantumNode = {
              id: node.id || `q-${Math.random().toString(36).substr(2,9)}`,
              atom: node.atom,
              vector: node.vector || [],
              weight: node.weight || 0.5,
              connections: [],
              source: sourceId
          };
          this.quantumStore.set(qNode.id, qNode);
      });
      this.emit('KNOWLEDGE_INGESTED', { count: nodes.length, source: sourceId });
      this.save();
  }

  public retrieveContextualNodes(context: SemanticContext): QuantumNode[] {
      const results: { node: QuantumNode, score: number }[] = [];
      this.quantumStore.forEach(node => {
          let score = 0;
          context.keywords.forEach(kw => {
              if (node.vector.some(v => v.toLowerCase().includes(kw.toLowerCase()))) score += 2;
              if (node.atom.toLowerCase().includes(kw.toLowerCase())) score += 3;
          });
          if (score > 0) results.push({ node, score });
      });
      return results.sort((a, b) => b.score - a.score).slice(0, 15).map(r => r.node);
  }

  public getAllQuantumNodes(): QuantumNode[] { return Array.from(this.quantumStore.values()); }
}

export const universalIntelligence = new AIOSKernel();
