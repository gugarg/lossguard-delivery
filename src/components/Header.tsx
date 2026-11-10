'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Bot
} from 'lucide-react';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenAgentChat: () => void;
  onResetData: () => void;
  hoursSaved: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenImport, 
  onOpenAgentChat, 
  onResetData,
  hoursSaved 
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0b1120]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-950/40">
            <div className="h-full w-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">LossGuard</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
                DELIVERY OPS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Auditoria de Cancelamentos & Conciliação Automatizada
            </p>
          </div>
        </div>

        {/* Integration Badges & Telemetry */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">iFood Merchant Webhook</span>
            <span className="text-emerald-400 font-semibold">Ativo</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <Clock className="h-3.5 w-3.5" />
            <span><strong>{hoursSaved}h</strong> poupadas hoje</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAgentChat}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Bot className="h-4 w-4 text-indigo-400" />
            <span className="hidden sm:inline">Assistente de Regras</span>
            <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-900/30 cursor-pointer"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Conciliar Relatório</span>
          </button>

          <button
            onClick={onResetData}
            title="Recarregar Dados Padrão"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer border border-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
