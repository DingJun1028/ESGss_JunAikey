
import React from 'react';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { View } from '../types';

interface AccessDeniedProps {
  requiredPermission?: string;
  onGoBack?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredPermission, onGoBack }) => {
  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 animate-fade-in relative overflow-hidden rounded-2xl border border-red-500/20 bg-slate-900/50">
        
        {/* Background Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-slate-900/0 to-slate-900/0 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            <div className="p-6 bg-red-500/10 rounded-full border border-red-500/30 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-bounce-slow">
                <Lock className="w-12 h-12 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-400" />
                Access Restricted
            </h2>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
                Your current role level does not have the required clearance 
                {requiredPermission ? <span className="font-mono text-red-300 mx-1">[{requiredPermission}]</span> : ''} 
                to access this module.
            </p>
            
            <button 
                onClick={onGoBack}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 border border-white/10"
            >
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
            </button>
        </div>
    </div>
  );
};
