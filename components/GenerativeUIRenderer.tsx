
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LabelList 
} from 'recharts';
import { AlertCircle, CheckCircle2, FileSpreadsheet, Activity, PieChart as PieIcon, BarChart3, Split, ArrowRight, Minus, XCircle, TrendingUp, TrendingDown, Clock, Download, Image as ImageIcon, Share2, Plus, Save } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Definition of JSON UI Structure
interface UIBlock {
  type: 'chart' | 'table' | 'status' | 'comparison';
  chartType?: 'area' | 'bar' | 'pie' | 'radar';
  title?: string;
  description?: string;
  data: any[];
  config?: {
    xKey?: string;
    dataKeys?: { key: string; color?: string; name?: string }[];
    highlightColumn?: string; // For comparison view
  };
  columns?: string[]; // For Table
  headers?: string[]; // For Comparison
  message?: string;
  status?: 'success' | 'error';
  details?: string;
  meta?: Record<string, string | number>;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#fbbf24'];

// Helper Hooks
const useChartActions = () => {
    const { addToast } = useToast();

    const handleExport = (title: string, type: 'png' | 'csv') => {
        // Mock export logic
        addToast('success', `Exporting ${title} as ${type.toUpperCase()}...`, 'System');
    };

    const handleShare = (title: string) => {
        addToast('success', `Share link for "${title}" generated.`, 'Share');
    };

    const handleSaveToDashboard = (title: string) => {
        addToast('success', `"${title}" added to your Dashboard.`, 'Dashboard');
    };

    return { handleExport, handleShare, handleSaveToDashboard };
};

// --- Sub-Components (Memoized for Performance) ---

const ChartRenderer = React.memo(({ data }: { data: UIBlock }) => {
  const { handleExport, handleShare, handleSaveToDashboard } = useChartActions();

  if (!data.data || data.data.length === 0) return <div className="text-gray-500 text-xs p-4 text-center">No data available for chart</div>;

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
              <Bar key={k.key} dataKey={k.key} name={k.name} fill={k.color || COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey={k.key} position="top" fill={k.color || COLORS[i % COLORS.length]} fontSize={10} />
              </Bar>
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
              >
                  <LabelList dataKey={k.key} position="top" fill={k.color || COLORS[i % COLORS.length]} fontSize={10} />
              </Area>
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
      <div className="flex items-center justify-between p-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            {getIcon()}
            <div>
                <h4 className="text-sm font-bold text-white leading-tight">{data.title}</h4>
                {data.description && <p className="text-[10px] text-gray-400">{data.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
              <button onClick={() => handleSaveToDashboard(data.title || 'Chart')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-emerald-400 transition-colors" title="Save to Dashboard">
                  <Save className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleShare(data.title || 'Chart')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-blue-400 transition-colors" title="Share Chart">
                  <Share2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleExport(data.title || 'chart', 'png')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Download Image">
                  <ImageIcon className="w-3.5 h-3.5" />
              </button>
          </div>
      </div>
      <div className="p-4 h-[250px] w-full min-h-[250px]">
        <ResponsiveContainer width="99%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const TableRenderer = React.memo(({ data }: { data: UIBlock }) => {
  const { handleExport } = useChartActions();
  
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-md shadow-lg">
      <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white">{data.title}</h4>
          </div>
          <button onClick={() => handleExport(data.title || 'table', 'csv')} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Export CSV">
              <Download className="w-4 h-4" />
          </button>
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
  );
});

const ComparisonRenderer = React.memo(({ data }: { data: UIBlock }) => {
  const { handleExport } = useChartActions();
  const headers = data.headers || [];
  const rows = data.data;
  const highlightCol = data.config?.highlightColumn;

  const renderVisual = (val: string) => {
    if (typeof val !== 'string') return val;
    const cleanVal = val.replace(/\[\[.*?\]\]/g, '').trim();
    
    let icon = null;
    if (val.includes('[[UP]]')) icon = <TrendingUp className="w-3 h-3 text-emerald-400" />;
    else if (val.includes('[[DOWN]]')) icon = <TrendingDown className="w-3 h-3 text-rose-400" />;
    else if (val.includes('[[CHECK]]')) icon = <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
    else if (val.includes('[[X]]')) icon = <XCircle className="w-3 h-3 text-rose-400" />;
    else if (val.includes('[[CLOCK]]')) icon = <Clock className="w-3 h-3 text-amber-400" />;

    return (
      <span className="flex items-center justify-center gap-1.5">
        {cleanVal}
        {icon}
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl">
      <div className="p-3 bg-gradient-to-r from-celestial-purple/10 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Split className="w-4 h-4 text-celestial-purple" />
            <h4 className="text-sm font-bold text-white">{data.title || 'Comparison Analysis'}</h4>
          </div>
          <button onClick={() => handleExport('comparison', 'csv')} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Export CSV">
              <Download className="w-4 h-4" />
          </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider w-1/4">Metric</th>
              {headers.map((h, i) => (
                <th key={i} className={`px-4 py-3 font-bold text-center tracking-wider text-xs uppercase w-1/4 border-l border-white/5 ${h === highlightCol ? 'text-celestial-gold bg-celestial-gold/5' : 'text-white'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="px-4 py-3 text-xs font-medium text-slate-300 bg-white/5 group-hover:text-white transition-colors">{row.metric}</td>
                {headers.map((h, j) => (
                  <td key={j} className={`px-4 py-3 text-xs text-center border-l border-white/5 font-mono ${h === highlightCol ? 'bg-celestial-gold/5 font-medium text-white' : 'text-slate-400'}`}>
                    {renderVisual(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

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
          case 'comparison': Component = ComparisonRenderer; break;
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
