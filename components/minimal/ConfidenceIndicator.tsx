
import React from 'react';
import { Lock } from 'lucide-react';
import { OmniEsgConfidence } from '../../types';

export const ConfidenceIndicator: React.FC<{ level: OmniEsgConfidence; verified?: boolean; compact?: boolean; isZh?: boolean }> = ({ level, verified, compact, isZh = true }) => {
  const getColor = () => {
    switch (level) {
      case 'high': return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]';
      case 'medium': return 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.7)]';
      case 'low': return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]';
    }
  };

  const getLabel = () => {
      if (isZh) {
          switch(level) {
              case 'high': return '高置信度 (High)';
              case 'medium': return '中置信度 (Mid)';
              case 'low': return '低置信度 (Low)';
          }
      }
      return level.toUpperCase();
  };

  return (
    <div className="flex items-center gap-2" title={`${isZh ? '邏輯置信度' : 'Confidence'}: ${getLabel()}`}>
      {verified && <Lock className={`text-emerald-400 ${compact ? 'w-3 h-3' : 'w-4 h-4'} drop-shadow-sm`} />}
      <div className={`rounded-full ${getColor()} ${compact ? 'w-2 h-2' : 'w-2.5 h-2.5'} animate-pulse`} />
      {!compact && <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{getLabel()}</span>}
    </div>
  );
};
