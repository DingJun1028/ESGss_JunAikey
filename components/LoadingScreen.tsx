
import React from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Initializing Module..." }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="relative">
            <div className="absolute inset-0 bg-celestial-purple/20 blur-xl rounded-full animate-pulse" />
            <div className="relative p-4 bg-slate-900/50 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
                <Loader2 className="w-8 h-8 text-celestial-purple animate-spin" />
            </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">{message}</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <BrainCircuit className="w-3 h-3" />
                <span>JunAiKey allocating resources</span>
            </div>
        </div>
    </div>
  );
};
