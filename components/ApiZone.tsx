
import React, { useState } from 'react';
import { Language } from '../types';
import { Code, Key, Book, Activity, Copy, CheckCircle, Terminal, Zap, Shield, Globe, Server, Radio, Network, Wifi, Trash2, Send, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface ApiZoneProps {
  language: Language;
}

export const ApiZone: React.FC<ApiZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [apiKey, setApiKey] = useState('sk-esgss-' + Math.random().toString(36).substring(7));
  const [copied, setCopied] = useState(false);

  // Backend Config State
  const [backendConfig, setBackendConfig] = useState({
      url: 'https://api.nocodebackend.com',
      instanceId: '54686_esgss',
      status: 'idle' // idle, testing, connected, error
  });

  // Webhook State
  const [webhooks, setWebhooks] = useState([
      { id: 'wh_1', event: 'report.generated', url: 'https://api.enterprise.com/hooks/reports', status: 'active' },
      { id: 'wh_2', event: 'alert.critical', url: 'https://api.enterprise.com/hooks/alerts', status: 'active' }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const pageData = {
      title: { zh: 'API 專區', en: 'API Zone' },
      desc: { zh: '整合 JunAiKey 引擎至您的企業應用與後台管理', en: 'Integrate JunAiKey Engine & Manage Backend Connections' },
      tag: { zh: '開發核心 (Dev Core)', en: 'Dev Core' }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      addToast('success', 'API Key Copied', 'System');
      setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
      setApiKey('sk-esgss-' + Math.random().toString(36).substring(7));
      addToast('info', 'New API Key Generated. Previous key revoked.', 'Security');
  };

  const handleTestConnection = () => {
      setBackendConfig(prev => ({ ...prev, status: 'testing' }));
      // Simulate network request
      setTimeout(() => {
          setBackendConfig(prev => ({ ...prev, status: 'connected' }));
          addToast('success', isZh ? '後台連接成功 (Latency: 45ms)' : 'Backend Connection Established (Latency: 45ms)', 'System');
      }, 1500);
  };

  const handleAddWebhook = () => {
      if (!newWebhookUrl) return;
      const newHook = {
          id: `wh_${Date.now()}`,
          event: 'system.update', // Default for demo
          url: newWebhookUrl,
          status: 'active'
      };
      setWebhooks([...webhooks, newHook]);
      setNewWebhookUrl('');
      addToast('success', isZh ? 'Webhook 已註冊' : 'Webhook Registered', 'API');
  };

  const handleTestWebhook = (id: string) => {
      addToast('info', isZh ? `正在發送測試事件至 ${id}...` : `Sending test event to ${id}...`, 'Webhook');
      setTimeout(() => addToast('success', 'HTTP 200 OK', 'Webhook'), 1000);
  };

  const handleDeleteWebhook = (id: string) => {
      setWebhooks(webhooks.filter(w => w.id !== id));
      addToast('info', 'Webhook Removed', 'System');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in overflow-hidden">
        <div className="shrink-0">
            <UniversalPageHeader 
                icon={Code}
                title={pageData.title}
                description={pageData.desc}
                language={language}
                tag={pageData.tag}
            />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* API Key Management */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-celestial-gold" />
                        {isZh ? 'API 金鑰管理' : 'API Key Management'}
                    </h3>
                    
                    <div className="bg-slate-950 rounded-xl p-4 border border-white/10 flex items-center justify-between mb-4 relative overflow-hidden group">
                        <div className="font-mono text-gray-300 text-sm tracking-wide blur-[2px] group-hover:blur-0 transition-all cursor-pointer">
                            {apiKey}
                        </div>
                        <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    <div className="flex gap-4">
                        <button onClick={handleRegenerate} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-all flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            {isZh ? '重新生成' : 'Regenerate'}
                        </button>
                        <button className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-sm text-indigo-300 transition-all flex items-center gap-2">
                            <Book className="w-4 h-4" />
                            {isZh ? '查看文檔' : 'View Docs'}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h4 className="text-sm font-bold text-white mb-4">{isZh ? '配額與限制' : 'Quotas & Limits'}</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-xs text-gray-500 mb-1">Requests / min</div>
                                <div className="text-xl font-bold text-white">600</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-xs text-gray-500 mb-1">Tokens / day</div>
                                <div className="text-xl font-bold text-white">1M</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-xs text-gray-500 mb-1">Tier</div>
                                <div className="text-xl font-bold text-celestial-gold">PRO</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status Panel */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            {isZh ? '系統狀態' : 'System Status'}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    API Gateway
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Operational</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Gemini 3 Engine
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Operational</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Database Cluster
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Operational</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-celestial-purple" />
                            <span className="text-xs font-bold text-white">Security Level: High</span>
                        </div>
                        <p className="text-[10px] text-gray-500">End-to-end encryption enabled. Last audit passed.</p>
                    </div>
                </div>
            </div>

            {/* Backend & Webhooks Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Backend Connection */}
                <div className="glass-panel p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Server className="w-5 h-5 text-celestial-blue" />
                        {isZh ? '後台連接設置' : 'Backend Connection'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 font-medium mb-1 block">API Base URL</label>
                            <div className="flex items-center gap-2 bg-slate-950/50 rounded-xl px-4 py-2 border border-white/10">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={backendConfig.url}
                                    onChange={(e) => setBackendConfig({...backendConfig, url: e.target.value})}
                                    className="bg-transparent border-none outline-none text-sm text-white flex-1 font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-medium mb-1 block">Instance ID</label>
                            <div className="flex items-center gap-2 bg-slate-950/50 rounded-xl px-4 py-2 border border-white/10">
                                <Radio className="w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={backendConfig.instanceId}
                                    onChange={(e) => setBackendConfig({...backendConfig, instanceId: e.target.value})}
                                    className="bg-transparent border-none outline-none text-sm text-white flex-1 font-mono"
                                />
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleTestConnection}
                            disabled={backendConfig.status === 'testing' || backendConfig.status === 'connected'}
                            className={`w-full mt-2 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border
                                ${backendConfig.status === 'connected' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                    : backendConfig.status === 'testing'
                                        ? 'bg-celestial-blue/10 text-celestial-blue border-celestial-blue/30'
                                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                                }
                            `}
                        >
                            {backendConfig.status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin"/> : 
                            backendConfig.status === 'connected' ? <CheckCircle className="w-4 h-4"/> : 
                            <Wifi className="w-4 h-4"/>}
                            
                            {backendConfig.status === 'testing' ? (isZh ? '測試連接中...' : 'Testing Connection...') : 
                            backendConfig.status === 'connected' ? (isZh ? '已連接' : 'Connected') : 
                            (isZh ? '測試連接' : 'Test Connection')}
                        </button>
                    </div>
                </div>

                {/* Webhook Management */}
                <div className="glass-panel p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Network className="w-5 h-5 text-pink-400" />
                        {isZh ? 'Webhook 管理' : 'Webhook Management'}
                    </h3>

                    <div className="space-y-3 mb-6">
                        {webhooks.map(wh => (
                            <div key={wh.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2 group">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded">{wh.event}</span>
                                    <span className="text-[10px] text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Active</span>
                                </div>
                                <div className="text-[10px] font-mono text-gray-400 truncate">{wh.url}</div>
                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleTestWebhook(wh.id)} className="p-1 hover:text-white text-gray-500" title="Test"><Send className="w-3 h-3" /></button>
                                    <button onClick={() => handleDeleteWebhook(wh.id)} className="p-1 hover:text-red-400 text-gray-500" title="Delete"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newWebhookUrl}
                            onChange={(e) => setNewWebhookUrl(e.target.value)}
                            placeholder="https://your-api.com/webhook..." 
                            className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                        />
                        <button onClick={handleAddWebhook} className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Endpoints List */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-gray-400" />
                    {isZh ? '核心端點文件' : 'Core Endpoints Documentation'}
                </h3>
                
                <div className="space-y-4">
                    <EndpointItem 
                        method="POST" 
                        path="/v1/emissions/calculate" 
                        desc={isZh ? "計算範疇 1, 2, 3 排放量" : "Calculate Scope 1, 2, 3 emissions"} 
                    />
                    <EndpointItem 
                        method="GET" 
                        path="/v1/reports/:id" 
                        desc={isZh ? "獲取生成的 ESG 報告" : "Retrieve generated ESG reports"} 
                    />
                    <EndpointItem 
                        method="POST" 
                        path="/v1/intelligence/query" 
                        desc={isZh ? "向 JunAiKey 提問 (SDR)" : "Query JunAiKey (SDR Access)"} 
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

const EndpointItem = ({ method, path, desc }: { method: string, path: string, desc: string }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-white/5 hover:border-white/10 transition-all font-mono text-sm">
        <span className={`px-2 py-1 rounded text-xs font-bold ${method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {method}
        </span>
        <span className="text-gray-300 flex-1">{path}</span>
        <span className="text-gray-500 text-xs font-sans hidden sm:block">{desc}</span>
    </div>
);
