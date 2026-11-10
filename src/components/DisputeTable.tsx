'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  FileText
} from 'lucide-react';
import { DeliveryOrder, ReimbursementStatus } from '../types';

interface DisputeTableProps {
  orders: DeliveryOrder[];
  onSelectOrder: (order: DeliveryOrder) => void;
}

export const DisputeTable: React.FC<DisputeTableProps> = ({ orders, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReimbursementStatus>('ALL');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cancellationReason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.reimbursementStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReimbursementStatus) => {
    switch (status) {
      case 'PENDENTE_ANALISE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            Pendente
          </span>
        );
      case 'CONTESTADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <AlertCircle className="h-3 w-3" />
            Em Disputa
          </span>
        );
      case 'RESSARCIDO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Ressarcido
          </span>
        );
      case 'PERDA_CONFIRMADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="h-3 w-3" />
            Perda Interna
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getScoreBadge = (score?: number) => {
    if (score === undefined) return null;
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          {score}% Favorável
        </span>
      );
    } else if (score >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {score}% Mediano
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          {score}% Improvável
        </span>
      );
    }
  };

  return (
    <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-12">
      
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDENTE_ANALISE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'PENDENTE_ANALISE'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Pendentes ({orders.filter(o => o.reimbursementStatus === 'PENDENTE_ANALISE').length})
          </button>
          <button
            onClick={() => setStatusFilter('CONTESTADO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'CONTESTADO'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Em Disputa ({orders.filter(o => o.reimbursementStatus === 'CONTESTADO').length})
          </button>
          <button
            onClick={() => setStatusFilter('RESSARCIDO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'RESSARCIDO'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Ressarcidos ({orders.filter(o => o.reimbursementStatus === 'RESSARCIDO').length})
          </button>
          <button
            onClick={() => setStatusFilter('PERDA_CONFIRMADA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'PERDA_CONFIRMADA'
                ? 'bg-rose-900/60 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Perda Interna ({orders.filter(o => o.reimbursementStatus === 'PERDA_CONFIRMADA').length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, cliente ou motivo..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/90 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Pedido / Marketplace</th>
              <th className="py-3.5 px-4">Cliente & Itens</th>
              <th className="py-3.5 px-4">Valor em Risco</th>
              <th className="py-3.5 px-4">Motivo do Cancelamento</th>
              <th className="py-3.5 px-4">Avaliação IA</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 text-xs">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  Nenhum pedido encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr 
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Pedido */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm group-hover:text-rose-400 transition-colors">
                        {order.code}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {order.marketplace}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {new Date(order.canceledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {new Date(order.canceledAt).toLocaleDateString('pt-BR')}
                    </span>
                  </td>

                  {/* Cliente */}
                  <td className="py-4 px-4 max-w-[200px]">
                    <span className="font-semibold text-slate-200 block truncate">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </span>
                  </td>

                  {/* Valor */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-bold text-white text-sm block">
                      R$ {order.lossValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (inclui R$ {order.deliveryFee.toFixed(2)} frete)
                    </span>
                  </td>

                  {/* Motivo */}
                  <td className="py-4 px-4 max-w-[250px]">
                    <p className="text-slate-300 font-medium line-clamp-2">
                      {order.cancellationReason}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                      Origem: {order.cancellationOrigin}
                    </span>
                  </td>

                  {/* Avaliação IA */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getScoreBadge(order.aiAnalysis?.riskScore)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(order.reimbursementStatus)}
                  </td>

                  {/* Ação */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white transition-all cursor-pointer border border-slate-700 hover:border-rose-500 shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-rose-400 group-hover:text-white" />
                      <span>Auditar</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Exibindo <strong>{filteredOrders.length}</strong> de <strong>{orders.length}</strong> incidentes</span>
        <span className="hidden sm:inline">Auditoria em tempo real ativa com o motor de regras iFood</span>
      </div>

    </div>
  );
};
