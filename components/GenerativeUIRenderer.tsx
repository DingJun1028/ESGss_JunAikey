
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { AlertCircle, CheckCircle2, FileSpreadsheet, Activity, PieChart as PieIcon, BarChart3 } from 'lucide-react';

// Definition of JSON UI Structure
interface UIBlock {
  type: 'chart' | 'table' | 'status';
  chartType?: 'area' | 'bar' | 'pie' | 'radar';
  title?: string;
  description?: string;
  data: any[];
  config?: {
    xKey?: string;
    dataKeys?: { key: string; color?: string; name?: string }[];
  };
  columns?: string[];
  message?: string;
  status?: 'success' | 'error';
  details?: string;
  meta?: Record<string, string | number>;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#fbbf24'];

// --- Sub-Components (Memoized for Performance) ---

const ChartRenderer = React.memo(({ data }: { data: UIBlock }) => {
  const renderChart = () => {
    switch (data.chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data.data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey={data.config?.xKey} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            {data.config?.dataKeys?.map((k, i) => (
              <Radar
                key={k.key}
                name={k.name}
                dataKey={k.key}
                stroke={k.color || COLORS[i % COLORS.length]}
                fill={k.color || COLORS[i % COLORS.length]}
                fillOpacity={0.4}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
          </RadarChart>
        );
      case 'bar':
        return (
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={data.config?.xKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            {data.config?.dataKeys?.map((k, i) => (
              <Bar key={k.key} dataKey={k.key} name={k.name} fill={k.color || COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
      case 'area':
      default:
        return (
          <AreaChart data={data.data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={data.config?.xKey} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            {data.config?.dataKeys?.map((k, i) => (
              <Area 
                key={k.key} 
                type="monotone" 
                dataKey={k.key} 
                name={k.name}
                stroke={k.color || COLORS[i % COLORS.length]} 
                fillOpacity={1} 
                fill={i === 0 ? "url(#colorValue)" : (k.color || COLORS[i % COLORS.length])} 
              />
            ))}
          </AreaChart>
        );
    }
  };

  const getIcon = () => {
    switch(data.chartType) {
      case 'pie': return <PieIcon className="w-4 h-4 text-celestial-purple" />;
      case 'radar': return <Activity className="w-4 h-4 text-celestial-gold" />;
      default: return <BarChart3 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 p-3 bg-white/5 border-b border-white/10">
          {getIcon()}
          <div>
              <h4 className="text-sm font-bold text-white leading-tight">{data.title}</h4>
              {data.description && <p className="text-[10px] text-gray-400">{data.description}</p>}
          </div>
      </div>
      <div className="p-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const TableRenderer = React.memo(({ data }: { data: UIBlock }) => (
  <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-md shadow-lg">
    <div className="p-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
        <FileSpreadsheet className="w-4 h-4 text-blue-400" />
        <h4 className="text-sm font-bold text-white">{data.title}</h4>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
            {data.columns?.map((h, i) => (
                <th key={i} className="px-4 py-3 font-medium tracking-wider">{h}</th>
            ))}
            </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
            {data.data.map((row, i) => (
            <tr key={i} className="hover:bg-white/5 transition-colors">
                {data.columns?.map((col, j) => (
                <td key={j} className="px-4 py-3 whitespace-nowrap text-xs">{row[col] || row[j]}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  </div>
));

const StatusCard = React.memo(({ data }: { data: UIBlock }) => {
  const isSuccess = data.status === 'success';
  return (
    <div className={`flex gap-4 p-4 rounded-xl border shadow-lg ${
      isSuccess 
       ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
        : 'bg-rose-950/30 border-rose-500/30 text-rose-400'
    }`}>
      <div className="mt-1">
        {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      <div>
        <h5 className="font-bold text-sm mb-1">{data.message || data.title}</h5>
        <p className="text-xs opacity-80 leading-relaxed">{data.details}</p>
        {data.meta && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {Object.entries(data.meta).map(([k, v]) => (
              <span key={k} className="px-2 py-1 bg-black/20 rounded text-[10px] font-mono">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// --- Main Component ---

const GenerativeUIRenderer: React.FC<{ content: string }> = React.memo(({ content }) => {
  const renderedParts = useMemo(() => {
    const jsonBlockRegex = /```json_ui\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = jsonBlockRegex.exec(content)) !== null) {
      // 1. Text segment
      if (match.index > lastIndex) {
        const textSegment = content.substring(lastIndex, match.index);
        if (textSegment.trim()) {
          parts.push(
            <div key={`text-${lastIndex}`} className="prose prose-invert max-w-none mb-4 text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
              {textSegment}
            </div>
          );
        }
      }

      // 2. UI Component segment
      try {
        const uiData: UIBlock = JSON.parse(match[1]);
        let Component;
        switch (uiData.type) {
          case 'chart': Component = ChartRenderer; break;
          case 'table': Component = TableRenderer; break;
          case 'status': Component = StatusCard; break;
          default: Component = null;
        }

        if (Component) {
          parts.push(
            <div key={`ui-${match.index}`} className="my-6 animate-fade-in w-full">
              <Component data={uiData} />
            </div>
          );
        }
      } catch (e) {
        parts.push(
          <div key={`err-${match.index}`} className="p-4 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
            UI Render Error: Invalid JSON
          </div>
        );
      }

      lastIndex = jsonBlockRegex.lastIndex;
    }

    // 3. Remaining text
    if (lastIndex < content.length) {
      parts.push(
        <div key="text-end" className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
          {content.substring(lastIndex)}
        </div>
      );
    }

    return parts;
  }, [content]);

  return <div className="w-full">{renderedParts}</div>;
});

export default GenerativeUIRenderer;
