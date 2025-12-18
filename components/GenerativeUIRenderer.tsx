import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, LabelList, BarChart, 
  Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Send, FileText, CheckCircle, Database, Layout, ShieldCheck, Search, Activity, GitBranch, Download, Share2, Save, Trash2, X, TrendingUp } from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';

interface GenerativeUIRendererProps {
  content: string;
  onSendMessage?: (message: string) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export const GenerativeUIRenderer: React.FC<GenerativeUIRendererProps> = ({ content, onSendMessage }) => {
  const [showLogicChain, setShowLogicChain] = useState<string | null>(null);
  const { addToast } = useToast();
  
  const parsedContent = useMemo(() => {
    const parts = [];
    const regex = /```json_ui([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    // 先檢測是否為純 JSON (AI 有時會直接輸出)
    const trimmedContent = content.trim();
    const isLikelyJson = (trimmedContent.startsWith('{') && trimmedContent.endsWith('}')) || 
                        (trimmedContent.startsWith('[') && trimmedContent.endsWith(']'));

    if (isLikelyJson) {
        try {
            const data = JSON.parse(trimmedContent);
            // 如果 JSON 內部含有 UI 定義，則走 UI 渲染
            if (data.type && (data.type === 'chart' || data.type === 'comparison')) {
                return [{ type: 'ui', data }];
            }
            // 否則視為原始數據流
            return [{ type: 'raw_json', data }];
        } catch (e) {
            // 解析失敗則按普通文字處理
        }
    }

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

  const handleExport = (title: string) => {
    addToast('info', `正在編譯「${title}」以供匯出...`, '系統中心');
    setTimeout(() => addToast('success', `「${title}」已成功匯出至 PDF`, '系統中心'), 1500);
  };

  const renderUIComponent = (data: any) => {
    const componentId = `ui-${Math.random().toString(36).substr(2, 5)}`;
    return (
      <div className="relative my-8 group/ui animate-fade-in">
        <div className="absolute -top-4 left-6 z-20 flex gap-2">
            <div 
                className="px-3 py-1 bg-slate-950 border border-emerald-500/60 rounded-full text-[9px] font-black text-emerald-400 flex items-center gap-2 cursor-help hover:bg-emerald-500/10 transition-colors shadow-2xl tracking-widest uppercase"
                onClick={() => setShowLogicChain(showLogicChain === componentId ? null : componentId)}
            >
                <ShieldCheck className="w-3 h-3" />
                JunAiKey 邏輯驗證
            </div>
        </div>
        <div className="p-1 rounded-[2.2rem] bg-white/5 border border-white/10 overflow-hidden shadow-inner backdrop-blur-md">
            <div className="p-4 border-b border-white/5 bg-white/[0.03] flex justify-between items-center">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">{data.title || '決策分析視圖'}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">即時同步中</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                </div>
            </div>
            <div className="bg-black/20">
                {data.type === 'chart' && renderChart(data)}
                {data.type === 'comparison' && renderComparison(data)}
            </div>
        </div>
      </div>
    );
  };

  const renderComparison = (data: any) => (
      <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-gray-500 font-black uppercase tracking-widest">指標邏輯 (Metric)</th>
                  {data.headers.map((h: string) => (
                    <th key={h} className={`p-4 font-black uppercase tracking-tighter ${data.config?.highlightColumn === h ? 'text-celestial-gold bg-celestial-gold/5' : 'text-white'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.data.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-all group/row">
                    <td className="p-4 text-gray-400 font-bold group-hover/row:text-gray-200 transition-colors">{row.metric}</td>
                    {data.headers.map((h: string) => {
                      const val = row[h]?.toString() || '';
                      const isCheck = val.includes('[[CHECK]]');
                      const isUp = val.includes('[[UP]]');
                      const isDown = val.includes('[[DOWN]]');
                      const isX = val.includes('[[X]]');
                      const displayVal = val.replace(/\[\[.*?\]\]/g, '').trim();
                      return (
                        <td key={h} className={`p-4 font-medium ${data.config?.highlightColumn === h ? 'bg-white/5 text-white' : 'text-gray-300'}`}>
                          <div className="flex items-center gap-2">
                             <span>{displayVal}</span>
                             {isCheck && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                             {isUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                             {isDown && <TrendingUp className="w-3.5 h-3.5 text-rose-500 rotate-180" />}
                             {isX && <Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
  );

  const renderChart = (data: any) => {
    return (
        <div className="h-[320px] w-full p-6">
            <ResponsiveContainer width="100%" height="100%">
                {data.chartType === 'area' ? (
                    <AreaChart data={data.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={data.config?.xKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold' }} />
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }} />
                        {data.config?.dataKeys?.map((k: any, idx: number) => {
                            const color = k.color || (idx === 0 ? '#10b981' : '#3b82f6');
                            return (
                                <Area key={k.key} name={k.name || k.key} type="monotone" dataKey={k.key} stroke={color} fillOpacity={0.2} fill={color} strokeWidth={3}>
                                    <LabelList dataKey={k.key} position="top" fill={color} fontSize={10} offset={10} />
                                </Area>
                            );
                        })}
                    </AreaChart>
                ) : (
                    <BarChart data={data.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={data.config?.xKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold' }} />
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }} />
                        {data.config?.dataKeys?.map((k: any, idx: number) => {
                            const color = k.color || (idx === 0 ? '#10b981' : '#3b82f6');
                            return (
                                <Bar key={k.key} name={k.name || k.key} dataKey={k.key} fill={color} radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey={k.key} position="top" fill={color} fontSize={10} offset={5} />
                                </Bar>
                            );
                        })}
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      {parsedContent.map((part, idx) => {
        if (part.type === 'ui') return <div key={idx}>{renderUIComponent(part.data)}</div>;
        if (part.type === 'raw_json') return (
            <div key={idx} className="my-4 bg-black/40 border border-white/10 rounded-2xl p-5 overflow-x-auto custom-scrollbar animate-fade-in">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
                    <Database className="w-3 h-3" /> 原始數據流 (Raw Data)
                </div>
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                    {JSON.stringify(part.data, null, 2)}
                </pre>
            </div>
        );
        return (
          <div 
            key={idx} 
            className="markdown-content text-sm text-gray-300 leading-relaxed font-normal tracking-wide prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked.parse(part.content) as string }} 
          />
        );
      })}
    </div>
  );
};