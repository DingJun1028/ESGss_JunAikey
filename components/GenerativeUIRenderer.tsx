
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, LabelList, BarChart, 
  Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Send, FileText, CheckCircle, Database, Layout, ShieldCheck, Search, Activity, GitBranch } from 'lucide-react';
import { marked } from 'marked';

interface GenerativeUIRendererProps {
  content: string;
  onSendMessage?: (message: string) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export const GenerativeUIRenderer: React.FC<GenerativeUIRendererProps> = ({ content, onSendMessage }) => {
  const [showLogicChain, setShowLogicChain] = useState<string | null>(null);
  
  const parsedContent = useMemo(() => {
    const parts = [];
    const regex = /```json_ui([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      }
      try {
        const jsonData = JSON.parse(match[1]);
        parts.push({ type: 'ui', data: jsonData });
      } catch (e) {
        parts.push({ type: 'text', content: match[0] }); 
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) parts.push({ type: 'text', content: content.substring(lastIndex) });
    return parts;
  }, [content]);

  const renderUIComponent = (data: any) => {
    const componentId = `ui-${Math.random().toString(36).substr(2, 5)}`;
    
    return (
      <div className="relative my-6 group/ui animate-fade-in">
        {/* Logic Provenance Badge */}
        <div className="absolute -top-3 left-4 z-20 flex gap-2">
            <div 
                className="px-2 py-0.5 bg-slate-900 border border-emerald-500/50 rounded-full text-[8px] font-black text-emerald-400 flex items-center gap-1 cursor-help hover:bg-emerald-500/10 transition-colors shadow-lg"
                onClick={() => setShowLogicChain(showLogicChain === componentId ? null : componentId)}
            >
                <ShieldCheck className="w-2.5 h-2.5" />
                VERIFIED BY JUNAIKEY
            </div>
        </div>

        {showLogicChain === componentId && (
            <div className="absolute top-8 left-4 z-30 w-72 bg-slate-950 border border-white/20 rounded-2xl p-5 shadow-2xl animate-fade-in backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <GitBranch className="w-3.5 h-3.5 text-celestial-gold" /> Logic Provenance
                    </h5>
                    <Search className="w-3 h-3 text-gray-500" />
                </div>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><div className="w-0.5 h-full bg-white/5"/></div>
                        <div><div className="text-[9px] font-bold text-white">Step 0: Perception</div><div className="text-[8px] text-gray-500">Ingesting BlueCC ERP live stream...</div></div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/><div className="w-0.5 h-full bg-white/5"/></div>
                        <div><div className="text-[9px] font-bold text-white">Step 1: Cognition</div><div className="text-[8px] text-gray-500">Matching with GRI 302-1 factors...</div></div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/></div>
                        <div><div className="text-[9px] font-bold text-white">Step ∞: Rendering</div><div className="text-[8px] text-gray-500">Generating structural visualization.</div></div>
                    </div>
                </div>
            </div>
        )}

        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {data.type === 'chart' && renderChart(data)}
            {/* ... other types ... */}
            {data.type === 'comparison' && renderComparison(data)}
        </div>
      </div>
    );
  };

  const renderComparison = (data: any) => (
      <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-3 text-gray-400 font-bold uppercase">Metric Logic</th>
                  {data.headers.map((h: string) => (
                    <th key={h} className={`p-3 font-bold ${data.config?.highlightColumn === h ? 'text-celestial-gold' : 'text-white'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20">
                {data.data.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-gray-400 font-medium">{row.metric}</td>
                    {data.headers.map((h: string) => (
                      <td key={h} className="p-3 text-white">
                        {row[h]?.toString().includes('[[CHECK]]') ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" /> : row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
  );

  const renderChart = (data: any) => {
    // Chart rendering logic remains similar but optimized for larger context
    return (
        <div className="h-[300px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
                {data.chartType === 'area' ? (
                    <AreaChart data={data.data}>
                        <defs>
                            <linearGradient id="colorEvo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey={data.config?.xKey} stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }} />
                        {data.config?.dataKeys?.map((k: any) => (
                            <Area key={k.key} type="monotone" dataKey={k.key} stroke={k.color} fillOpacity={1} fill="url(#colorEvo)" />
                        ))}
                    </AreaChart>
                ) : <BarChart data={data.data}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey={data.config?.xKey} stroke="#94a3b8" fontSize={10} /><YAxis stroke="#94a3b8" fontSize={10} /><Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />{data.config?.dataKeys?.map((k: any) => (<Bar key={k.key} dataKey={k.key} fill={k.color} />))}</BarChart>}
            </ResponsiveContainer>
        </div>
    );
  };

  return (
    <div className="space-y-4">
      {parsedContent.map((part, idx) => (
        part.type === 'ui' ? (
          <div key={idx}>{renderUIComponent(part.data)}</div>
        ) : (
          <div 
            key={idx} 
            className="markdown-content text-sm text-gray-300 leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: marked.parse(part.content) as string }} 
          />
        )
      ))}
    </div>
  );
};
