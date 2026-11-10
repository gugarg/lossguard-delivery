'use client';

import React, { useState } from 'react';
import { INITIAL_ORDERS } from '../data/mockOrders';
import { DeliveryOrder, ReimbursementStatus } from '../types';
import { calculateMetrics } from '../lib/reconciliation';

import { Header } from '../components/Header';
import { MetricsCards } from '../components/MetricsCards';
import { FinancialCharts } from '../components/FinancialCharts';
import { DisputeTable } from '../components/DisputeTable';
import { DisputeModal } from '../components/DisputeModal';
import { ImportCsvModal } from '../components/ImportCsvModal';
import { AiAgentChatDrawer } from '../components/AiAgentChatDrawer';

import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

export default function Home() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAgentChatOpen, setIsAgentChatOpen] = useState(false);

  // Métricas calculadas dinamicamente
  const metrics = calculateMetrics(orders);

  const handleUpdateStatus = (orderId: string, newStatus: ReimbursementStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedLogs = [
          ...order.auditLog,
          {
            timestamp: new Date().toISOString(),
            author: 'Operador (Backoffice)',
            action: `Status alterado para ${newStatus.replace('_', ' ')}`,
            notes: note
          }
        ];

        const updatedOrder: DeliveryOrder = {
          ...order,
          reimbursementStatus: newStatus,
          auditLog: updatedLogs
        };

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }

        return updatedOrder;
      })
    );
  };

  const handleImportBatch = (newOrders: DeliveryOrder[]) => {
    setOrders((prev) => [...newOrders, ...prev]);
  };

  const handleResetData = () => {
    setOrders(INITIAL_ORDERS);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header Global */}
      <Header
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAgentChat={() => setIsAgentChatOpen(true)}
        onResetData={handleResetData}
        hoursSaved={metrics.hoursSavedEstimated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Executive Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
                <Zap className="h-3.5 w-3.5 text-rose-400" />
                <span>Automação de Auditoria & Conciliação em Produção</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                LossGuard: Central de Proteção de Margem & Disputas iFood
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
                Transformando perdas silenciosas por cancelamento em receita recuperada. O motor cruza <strong>telemetria de rota</strong> com <strong>regras contratuais de marketplace</strong> para redigir e despachar recursos em 30 segundos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsImportOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Simular Conciliação em Lote</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Cards de Métricas e ROI */}
        <MetricsCards metrics={metrics} />

        {/* 3. Gráficos Analíticos e Diagnóstico */}
        <FinancialCharts metrics={metrics} />

        {/* 4. Tabela de Gestão de Incidentes (Backoffice Tool) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-rose-500" />
                Incidentes de Cancelamento em Auditoria
              </h2>
              <p className="text-xs text-slate-400">
                Selecione um pedido para visualizar a telemetria completa, fundamentação do agente e despacho de contestação.
              </p>
            </div>
          </div>

          <DisputeTable
            orders={orders}
            onSelectOrder={(order) => setSelectedOrder(order)}
          />
        </div>

        {/* 5. Seção de Arquitetura de Portfólio (Explicação Técnica do Projeto) */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 mb-12">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-400" />
            Como este projeto cumpre os 5 pilares de engenharia:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
              <strong className="text-white block mb-1">1. Automação Real</strong>
              Economia calculada de 25 minutos por caso para 30 segundos com parser de telemetria e checagem de regras.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
              <strong className="text-white block mb-1">2. Ferramenta Interna</strong>
              Backoffice de operações completo com controle de status, logs de auditoria e resolução de disputas.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
              <strong className="text-white block mb-1">3. Dashboard Funcional</strong>
              Métricas executivas de perda evitável, taxa de reversão, concentração por hora e perdas por motivo.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
              <strong className="text-white block mb-1">4. Agente de Negócio</strong>
              LossGuard AI com Tool Calling para checagem de jurisprudência do CDC, probabilidade de vitória e minutas.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
              <strong className="text-white block mb-1">5. Demo em Produção</strong>
              Construído do zero em 1 dia, pronto para deploy na Vercel com dados interativos.
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-[#070b12] py-6 text-center text-xs text-slate-500">
        <p>LossGuard AI • Desenvolvido para operações de delivery de alta performance e proteção financeira.</p>
      </footer>

      {/* Modals & Drawers */}
      {selectedOrder && (
        <DisputeModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {isImportOpen && (
        <ImportCsvModal
          onClose={() => setIsImportOpen(false)}
          onImportBatch={handleImportBatch}
        />
      )}

      <AiAgentChatDrawer
        isOpen={isAgentChatOpen}
        onClose={() => setIsAgentChatOpen(false)}
      />

    </div>
  );
}
