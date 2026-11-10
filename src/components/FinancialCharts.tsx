'use client';

import React from 'react';
import { BarChart3, PieChart, Info, TrendingDown } from 'lucide-react';
import { OperationalMetrics } from '../types';

interface FinancialChartsProps {
  metrics: OperationalMetrics;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ metrics }) => {
  const maxReasonValue = Math.max(...metrics.cancellationsByReason.map(r => r.value), 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Gráfico 1: Impacto Financeiro por Motivo de Cancelamento */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-rose-500" />
              Perdas Financeiras por Motivo de Cancelamento
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Valores acumulados em pedidos cancelados (comida + frete)
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Foco de Auditoria
          </span>
        </div>

        <div className="space-y-4">
          {metrics.cancellationsByReason.map((item, idx) => {
            const percentage = Math.round((item.value / maxReasonValue) * 100);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium truncate max-w-[280px]">
                    {item.reason}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">({item.count} ped.)</span>
                    <span className="font-bold text-white">
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0 
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500' 
                        : idx === 1 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                        : 'bg-slate-500'
                    }`}
                    style={{ width: `${Math.max(percentage, 6)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-slate-400">
          <Info className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>92% das perdas</strong> por "pedido em rota" são ressarcíveis perante as normas da plataforma.
          </span>
        </div>
      </div>

      {/* Gráfico 2: Período Crítico & Distribuição de Horário */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-400" />
                Concentração por Faixa de Horário
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Volume de cancelamentos e perdas no almoço vs jantar
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Telemetria Operacional
            </span>
          </div>

          {/* Timeline Bars */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">11:00 - 12:00</span>
              <span className="text-sm font-bold text-white block">R$ 88,00</span>
              <span className="text-[10px] text-emerald-400 font-medium">1 resolvido</span>
            </div>
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 text-center relative overflow-hidden">
              <div className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></div>
              <span className="text-[11px] font-semibold text-rose-300 block mb-1">12:00 - 13:00</span>
              <span className="text-sm font-bold text-white block">R$ 254,50</span>
              <span className="text-[10px] text-rose-400 font-medium">2 em rota</span>
            </div>
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-center">
              <span className="text-[11px] font-semibold text-amber-300 block mb-1">13:00 - 14:00</span>
              <span className="text-sm font-bold text-white block">R$ 464,00</span>
              <span className="text-[10px] text-amber-400 font-medium">Pico financeiro</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">20:00 - 21:00</span>
              <span className="text-sm font-bold text-white block">R$ 231,00</span>
              <span className="text-[10px] text-slate-400 font-medium">Falha interna</span>
            </div>
          </div>

          {/* Operational Callout */}
          <div className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Diagnóstico Automático da Operação
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Entre <strong>12:45 e 13:45</strong> ocorre <strong>71% das perdas por cancelamento</strong>. A telemetria indica que o gargalo não é o tempo de cozinha (média de 21 min), mas sim a <strong>espera pelo motoboy parceiro</strong> em dias de chuva/pico.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Tempo médio de análise do LossGuard AI: <strong>220ms</strong></span>
          <span className="text-indigo-400 font-medium">Total de 6 incidentes mapeados</span>
        </div>
      </div>

    </div>
  );
};
