'use client';

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock4, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldAlert 
} from 'lucide-react';
import { OperationalMetrics } from '../types';

interface MetricsCardsProps {
  metrics: OperationalMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Card 1: Perda Contestável Ativa */}
      <div className="bg-[#0f172a]/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg shadow-amber-950/10 relative overflow-hidden group hover:border-amber-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Perda em Análise
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
            Ação Urgente
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            R$ {metrics.pendingDisputeValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <span className="text-amber-400 font-semibold flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5" /> 3 casos
          </span>
          com &gt;90% de probabilidade de vitória
        </p>
      </div>

      {/* Card 2: Capital Recuperado */}
      <div className="bg-[#0f172a]/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-950/10 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Capital Recuperado
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
            {metrics.winRatePercentage}% Taxa de Êxito
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            R$ {metrics.totalRecoveredValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <span className="text-emerald-400 font-semibold">Crédito já liquidado</span>
          no extrato de repasse
        </p>
      </div>

      {/* Card 3: Horas Reais Economizadas */}
      <div className="bg-[#0f172a]/90 border border-indigo-500/30 rounded-2xl p-5 shadow-lg shadow-indigo-950/10 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400/90 flex items-center gap-1.5">
            <Clock4 className="h-4 w-4 text-indigo-400" />
            Horas Economizadas
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            Automação Ativa
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {metrics.hoursSavedEstimated} horas
          </span>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <span>Tempo médio reduzido de <strong>25 min</strong> para <strong>30s</strong></span>
        </p>
      </div>

      {/* Card 4: Prevenção de Perda Interna */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-slate-400" />
            Perda Operacional Real
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Atraso Cozinha
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            R$ {metrics.totalLostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Cancelamentos justificados por estouro de SLA interno
        </p>
      </div>

    </div>
  );
};
