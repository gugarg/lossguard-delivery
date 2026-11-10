'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Send, 
  CheckCircle2, 
  Copy, 
  ShieldAlert, 
  Bot, 
  ChevronRight, 
  AlertTriangle, 
  Building2, 
  UserCheck, 
  MapPin, 
  Check,
  History
} from 'lucide-react';
import { DeliveryOrder, ReimbursementStatus } from '../types';
import { evaluateOrderRules } from '../lib/reconciliation';

interface DisputeModalProps {
  order: DeliveryOrder;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: ReimbursementStatus, note?: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ order, onClose, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'TELEMETRIA' | 'AGENTE' | 'LOGS'>('AGENTE');
  const [copied, setCopied] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const rules = evaluateOrderRules(order);
  const analysis = order.aiAnalysis;

  const handleCopyDraft = () => {
    if (!analysis?.disputeDraft) return;
    navigator.clipboard.writeText(analysis.disputeDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDispatch = () => {
    onUpdateStatus(
      order.id, 
      'CONTESTADO', 
      'Contestação técnica formal despachada automaticamente via LossGuard AI para a fila de ouvidoria do iFood.'
    );
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 3000);
  };

  const handleMarkRefunded = () => {
    onUpdateStatus(
      order.id, 
      'RESSARCIDO', 
      'Operador confirmou lançamento do crédito compensatório no extrato bancário/financeiro.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0f172a] border border-slate-800 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{order.code}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {order.marketplace}
                </span>
                <span className="text-xs text-slate-400">• {order.customerName}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Valor Total do Prejuízo: <strong className="text-white">R$ {order.lossValue.toFixed(2)}</strong> (Produtos + Taxa de Entrega)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-5 border-b border-slate-800 bg-slate-900/30 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('AGENTE')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'AGENTE'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Agente LossGuard AI (Decisão & Minuta)
          </button>

          <button
            onClick={() => setActiveTab('TELEMETRIA')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'TELEMETRIA'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            Telemetria & Linha do Tempo
          </button>

          <button
            onClick={() => setActiveTab('LOGS')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'LOGS'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            Log de Auditoria ({order.auditLog.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: AGENTE AI */}
          {activeTab === 'AGENTE' && (
            <div className="space-y-6">
              
              {/* Verdict Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Parecer da IA Autônoma:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        (analysis?.riskScore || 0) >= 80 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {analysis?.recommendation.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      {analysis?.summary}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-center shrink-0 w-full md:w-auto">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Probabilidade de Êxito</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {analysis?.riskScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">R$ {order.lossValue.toFixed(2)} recuperáveis</span>
                </div>
              </div>

              {/* Legal & Regulatory Basis */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-rose-400" />
                  Fundamentação Contratual & Jurídica
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850 font-mono text-[11px]">
                  {analysis?.legalBasis}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis?.applicableRules.map((rule, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      ✓ {rule}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dispute Formal Draft */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Minuta Pronta para Envio ao Marketplace
                  </h4>
                  <button
                    onClick={handleCopyDraft}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700 text-[11px]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  value={analysis?.disputeDraft || 'Minuta não gerada.'}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-rose-500"
                />
              </div>

            </div>
          )}

          {/* TAB 2: TELEMETRIA */}
          {activeTab === 'TELEMETRIA' && (
            <div className="space-y-6">
              
              {/* Timeline Horizontal */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">
                  Linha do Tempo de Execução do Pedido
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                  
                  {/* Step 1 */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-400 block">1. Criação</span>
                    <span className="text-xs font-semibold text-white">
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Pedido registrado</span>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-400 block">2. Aceite Cozinha</span>
                    <span className="text-xs font-semibold text-white">
                      {new Date(order.acceptedAt).toLocaleTimeString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Preparo: {order.preparationTimeMinutes} min
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-[10px] font-bold text-indigo-400 block">3. Despacho Motoboy</span>
                    <span className="text-xs font-semibold text-white">
                      {order.dispatchedAt ? new Date(order.dispatchedAt).toLocaleTimeString('pt-BR') : 'Não despachado'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {order.driverName || 'Sem entregador'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-lg">
                    <span className="text-[10px] font-bold text-rose-400 block">4. Cancelamento</span>
                    <span className="text-xs font-semibold text-rose-200">
                      {new Date(order.canceledAt).toLocaleTimeString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-rose-300 block mt-1 truncate">
                      {order.cancellationReason}
                    </span>
                  </div>

                </div>
              </div>

              {/* Regras Contratuais Avaliadas */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
                  Verificação de Conformidade de Regras de Mercado
                </h4>
                
                <div className="space-y-2.5">
                  {rules.map((rule, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-lg border flex items-start gap-3 ${
                        rule.triggered 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="mt-0.5">
                        {rule.triggered ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block">{rule.name}</span>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {rule.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items Detail */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2">
                  Itens Confeccionados (Descarte / Perda de Insumos)
                </h4>
                <div className="divide-y divide-slate-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.quantity}x {item.name}</span>
                      <span className="text-white font-bold">R$ {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LOG DE AUDITORIA */}
          {activeTab === 'LOGS' && (
            <div className="space-y-3">
              {order.auditLog.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <UserCheck className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{log.author}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR')} • {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5">{log.action}</p>
                      {log.notes && (
                        <p className="text-slate-400 text-[11px] mt-1 bg-slate-950 p-2 rounded border border-slate-850">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status atual:</span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-white border border-slate-700">
              {order.reimbursementStatus.replace('_', ' ')}
            </span>
            {dispatchSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="h-3.5 w-3.5" /> Despachado com sucesso!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkRefunded}
              className="px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-colors cursor-pointer"
            >
              Marcar como Ressarcido (R$ {order.lossValue.toFixed(2)})
            </button>

            <button
              onClick={handleDispatch}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Despachar Contestação ao iFood</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
