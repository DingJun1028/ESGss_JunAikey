
import React, { useState, useEffect, useRef } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { AlertTriangle, Users, TrendingUp, Globe, ShieldAlert, Target, ArrowRight, Layers, BrainCircuit, Sparkles, X, ChevronRight, FileText, Bot, DollarSign, Scale, MessageSquare, Leaf, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { generateAgentDebate } from '../services/ai-service';
import { marked } from 'marked';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { LockedFeature } from './LockedFeature';
import { SubscriptionModal } from './SubscriptionModal';
import { universalIntelligence } from '../services/evolutionEngine';
import { UniversalPageHeader } from './UniversalPageHeader';

interface StrategyHubProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Universal Agent: Strategic Risk Node
// ----------------------------------------------------------------------
interface RiskNodeProps extends InjectedProxyProps {
    name: string;
    level: string;
    probability: string;
    onClick: () => void;
    isFlashing?: boolean;
}

const RiskNodeBase: React.FC<RiskNodeProps> = ({ 
    name, level, probability, onClick, 
    adaptiveTraits, trackInteraction, isHighFrequency, isAgentActive, isFlashing 
}) => {
    const getBaseColor = (lvl: string) => {
        switch (lvl) {
            case 'critical': return 'bg-red-500/80 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse';
            case 'high': return 'bg-amber-500/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
            case 'medium': return 'bg-yellow-500/80 border-yellow-400';
            case 'low': return 'bg-emerald-500/80 border-emerald-400';
            default: return 'bg-gray-500';
        }
    };

    const isEvolved = adaptiveTraits?.includes('evolution');
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive;

    const dynamicClasses = isEvolved 
        ? 'scale-110 shadow-2xl z-20 ring-2 ring-white' 
        : 'hover:scale-110 transition-all duration-300';

    return (
        <div 
            onClick={() => { trackInteraction?.('click'); onClick(); }}
            className={`
                relative group flex items-center justify-center rounded-xl border backdrop-blur-md cursor-pointer shadow-lg
                ${getBaseColor(level)}
                ${dynamicClasses}
                ${isFlashing ? 'ring-4 ring-red-500/50 animate-[ping_1s_infinite]' : ''}
                ${probability === 'high' ? 'col-start-3' : probability === 'medium' ? 'col-start-2' : 'col-start-1'}
                ${level === 'critical' || level === 'high' ? 'row-start-1' : level === 'medium' ? 'row-start-2' : 'row-start-3'}
            `}
        >
            <span className="text-[10px] sm:text-xs font-bold text-white text-center px-2 drop-shadow-md">{name}</span>
            <div className="absolute top-1 right-1 flex gap-1">
                {isLearning && <div className="w-2 h-2 rounded-full bg-celestial-purple animate-ping" />}
                <Sparkles className={`w-3 h-3 text-white ${isEvolved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
            </div>
        </div>
    );
};

const StrategicRiskAgent = withUniversalProxy(RiskNodeBase);

// Multi-Agent Debate Types
interface DebateMessage {
    id: string;
    role: 'CSO' | 'CFO' | 'JunAiKey';
    text: string;
    timestamp: number;
}

export const StrategyHub: React.FC<StrategyHubProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { esgScores, carbonCredits, budget, companyName } = useCompany();
  
  const [analyzingRisk, setAnalyzingRisk] = useState<string | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [carbonRiskEscalated, setCarbonRiskEscalated] = useState(false);
  
  // Debate State
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const pageData = {
      title: { zh: '策略中樞', en: 'Strategy Hub' },
      desc: { zh: '風險熱點圖與多代理決策模擬', en: 'Risk Heatmaps & Multi-Agent Decision Simulation' },
      tag: { zh: '認知核心', en: 'Cognition Core' }
  };

  // Safe Interval Ref
  const debateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Neural Reflex: Listen to Global System Events
  useEffect(() => {
      const sub = universalIntelligence.neuralBus$.subscribe(event => {
          if (event.type === 'RISK_ESCALATED' && event.payload.source === 'CarbonAsset') {
              setCarbonRiskEscalated(true);
              addToast('warning', isZh ? '接收到碳資產模組的風險升級訊號' : 'Received Risk Escalation from Carbon Asset', 'Neural Reflex');
              setTimeout(() => setCarbonRiskEscalated(false), 5000); // Stop flashing after 5s
          }
      });
      return () => sub.unsubscribe();
  }, [isZh, addToast]);

  useEffect(() => {
      // Cleanup on unmount
      return () => {
          if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
      };
  }, []);

  const risks = [
    { id: 'risk-1', name: isZh ? '碳定價衝擊' : 'Carbon Pricing', level: (carbonCredits < 1000 || carbonRiskEscalated) ? 'critical' : 'high', probability: 'high' },
    { id: 'risk-2', name: isZh ? '商譽風險' : 'Reputation', level: esgScores.social < 70 ? 'critical' : 'medium', probability: 'medium' },
    { id: 'risk-3', name: isZh ? '合規風險' : 'Compliance', level: esgScores.governance < 80 ? 'high' : 'low', probability: 'high' },
    { id: 'risk-4', name: isZh ? '極端氣候' : 'Extreme Weather', level: 'high', probability: 'medium' }, 
    { id: 'risk-5', name: isZh ? '供應鏈中斷' : 'Supply Chain', level: 'medium', probability: 'high' },
    { id: 'risk-6', name: isZh ? '人才流失' : 'Talent Loss', level: 'low', probability: 'low' },
  ];

  const handleRiskClick = async (riskName: string) => {
      setAnalyzingRisk(riskName);
      setDebateMessages([]);
      setIsDebating(true);
      setIsGenerating(true);
      
      try {
          addToast('info', isZh ? '正在召集 AI 代理 (CFO vs CSO)...' : 'Summoning AI Agents (CFO vs CSO)...', 'Multi-Agent System');
          const script = await generateAgentDebate(riskName, language);
          setIsGenerating(false);
          runDebate(script);
      } catch (e) {
          setIsGenerating(false);
          setIsDebating(false);
          addToast('error', 'Debate Generation Failed', 'Error');
      }
  };

  const runDebate = (script: DebateMessage[]) => {
      let i = 0;
      if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
      
      debateIntervalRef.current = setInterval(() => {
          if (i >= script.length) {
              if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
              setIsDebating(false);
              return;
          }
          const msg = script[i];
          setDebateMessages(prev => [...prev, { ...msg, timestamp: Date.now() }]);
          i++;
      }, 2500); // 2.5s per message for readability
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      <SubscriptionModal isOpen={showSubModal} onClose={() => setShowSubModal(false)} language={language} />
      
      <UniversalPageHeader 
          icon={Target}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Heatmap */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col group min-h-[400px]">
            <LockedFeature featureName="Deep Reasoning Heatmap" minTier="Pro" onUnlock={() => setShowSubModal(true)}>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-celestial-blue" />
                    {isZh ? '動態風險熱點圖' : 'Dynamic Risk Heatmap'}
                    </h3>
                    {carbonRiskEscalated && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold animate-pulse border border-red-500/50">
                            <AlertTriangle className="w-3 h-3" />
                            CRITICAL SIGNAL DETECTED
                        </div>
                    )}
                </div>
                
                <div className="relative flex-1 min-h-[350px] w-full bg-slate-900/30 rounded-xl border border-white/5 p-8 flex items-center justify-center overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none p-8 z-0">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="border border-white/5 border-dashed relative">
                                {i === 4 && <div className="absolute inset-0 bg-white/5 blur-xl animate-pulse" />}
                            </div>
                        ))}
                    </div>

                    <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 gap-4 z-10">
                        <div className="absolute -left-6 top-1/2 -rotate-90 text-[9px] font-bold text-gray-500 tracking-[0.2em] flex items-center gap-2">
                        <ArrowRight className="w-3 h-3" /> IMPACT
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 tracking-[0.2em] flex items-center gap-2">
                        PROBABILITY <ArrowRight className="w-3 h-3" />
                        </div>
                        
                        {risks.map((risk) => (
                            <StrategicRiskAgent 
                                key={risk.id}
                                id={risk.name} 
                                label={risk.name}
                                name={risk.name}
                                level={risk.level}
                                probability={risk.probability}
                                isFlashing={carbonRiskEscalated && risk.id === 'risk-1'}
                                onClick={() => handleRiskClick(risk.name)}
                            />
                        ))}
                    </div>
                </div>
            </LockedFeature>
        </div>

        {/* AI Action Cards */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-celestial-purple" />
            {isZh ? '戰略行動建議' : 'Strategic Actions'}
          </h3>
          
          <div className="space-y-4 flex-1">
            <OmniEsgCell 
                id="act-1"
                mode="list" 
                label={isZh ? "啟動內部碳定價" : "Launch Internal Carbon Pricing"}
                value="High Priority" 
                color="gold" 
                icon={Target}
                traits={['optimization']}
                onClick={() => addToast('info', 'Module linked: Carbon Assets', 'System')}
            />
            <OmniEsgCell 
                id="act-2"
                mode="list" 
                label={isZh ? "供應鏈稽核 (Tier 1)" : "Supply Chain Audit (Tier 1)"}
                value="In Progress" 
                color="purple" 
                icon={ShieldAlert}
                traits={['bridging']}
            />
          </div>
        </div>
      </div>

      {/* Debate Modal Overlay */}
      {analyzingRisk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-3xl bg-slate-900 border border-celestial-purple/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]">
                  {/* Header */}
                  <div className="p-6 bg-celestial-purple/10 border-b border-celestial-purple/30 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-celestial-purple rounded-lg">
                              <BrainCircuit className="w-6 h-6 text-white animate-pulse" />
                          </div>
                          <div>
                              <h3 className="font-bold text-white text-lg">{isZh ? '多代理決策會議' : 'Multi-Agent Decision Council'}</h3>
                              <p className="text-xs text-celestial-purple/80">{isZh ? `議題：${analyzingRisk}` : `Topic: ${analyzingRisk}`}</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => {
                            setAnalyzingRisk(null);
                            if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
                        }} 
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                          <X className="w-6 h-6 text-white" />
                      </button>
                  </div>
                  
                  {/* Debate Area */}
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950/30 space-y-6">
                      {isGenerating ? (
                          <div className="flex flex-col items-center justify-center h-full text-celestial-purple gap-4">
                              <div className="relative w-16 h-16">
                                  <div className="absolute inset-0 rounded-full border-4 border-celestial-purple/30 animate-ping"></div>
                                  <div className="absolute inset-0 rounded-full border-4 border-t-celestial-purple animate-spin"></div>
                              </div>
                              <p className="text-sm font-mono animate-pulse">Initializing Persona: CFO...</p>
                          </div>
                      ) : (
                          <>
                            {debateMessages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 animate-fade-in ${msg.role === 'CFO' ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 
                                        ${msg.role === 'CSO' ? 'bg-emerald-900 border-emerald-500 text-emerald-400' : 
                                            msg.role === 'CFO' ? 'bg-amber-900 border-amber-500 text-amber-400' : 
                                            'bg-purple-900 border-purple-500 text-purple-400'}
                                    `}>
                                        {msg.role === 'CSO' ? <Leaf className="w-5 h-5" /> : 
                                        msg.role === 'CFO' ? <DollarSign className="w-5 h-5" /> : 
                                        <Bot className="w-5 h-5" />}
                                    </div>
                                    
                                    {/* Message Bubble */}
                                    <div className={`flex flex-col max-w-[70%] ${msg.role === 'CFO' ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] text-gray-500 mb-1 font-bold tracking-wider">{msg.role}</span>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg
                                            ${msg.role === 'CSO' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tl-none' : 
                                                msg.role === 'CFO' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-tr-none' : 
                                                'bg-purple-500/10 border border-purple-500/20 text-purple-100'}
                                        `}>
                                            <div dangerouslySetInnerHTML={{__html: marked.parse(msg.text) as string}} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isDebating && (
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse mt-4">
                                    <MessageSquare className="w-3 h-3" />
                                    {isZh ? '代理人思考中...' : 'Agents are deliberating...'}
                                </div>
                            )}
                          </>
                      )}
                  </div>
                  
                  {/* Action Footer */}
                  {!isDebating && !isGenerating && (
                      <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                          <div className="flex-1 flex items-center gap-2 text-xs text-gray-400 pl-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              {isZh ? '共識已達成' : 'Consensus Reached'}
                          </div>
                          <button 
                            onClick={() => {
                                setAnalyzingRisk(null);
                                if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
                            }} 
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                          >
                              {isZh ? '忽略' : 'Ignore'}
                          </button>
                          <button 
                            onClick={() => {
                                addToast('success', isZh ? '決策已執行並寫入合約' : 'Decision Executed & Logged', 'Smart Contract');
                                setAnalyzingRisk(null);
                                if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
                            }} 
                            className="px-6 py-2 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20"
                          >
                              <Scale className="w-4 h-4" />
                              {isZh ? '執行決策' : 'Execute Decision'}
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
