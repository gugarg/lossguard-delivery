'use client';

import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { DeliveryOrder } from '../types';

interface ImportCsvModalProps {
  onClose: () => void;
  onImportBatch: (newOrders: DeliveryOrder[]) => void;
}

const DEFAULT_CSV_SAMPLE = `codigo,cliente,valor_total,motivo,origem
#IFO-8901,Mariana Lopes,112.50,Cancelamento pelo suporte alegando atraso do motoboy parceiro,MARKETPLACE
#IFO-8902,Carlos Eduardo Ramos,74.00,Cliente desistiu do pedido 25 min apos despacho,CLIENTE
#IFO-8903,Beatriz Fontes,198.00,Robô cancelou sumariamente por 'problemas sistemicos',MARKETPLACE
#IFO-8904,Restaurante Sushi Prime,145.00,Falta de ingrediente apos 40 min de preparo,RESTAURANTE`;

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({ onClose, onImportBatch }) => {
  const [csvContent, setCsvContent] = useState(DEFAULT_CSV_SAMPLE);
  const [processing, setProcessing] = useState(false);
  const [resultSummary, setResultSummary] = useState<{ count: number; totalValue: number } | null>(null);

  const handleRunReconciliation = () => {
    setProcessing(true);

    setTimeout(() => {
      const generated: DeliveryOrder[] = [
        {
          id: `ord-imported-1-${Date.now()}`,
          code: '#IFO-8901',
          marketplace: 'iFood',
          customerName: 'Mariana Lopes',
          customerPhone: '(11) 98221-1122',
          customerAddress: 'Rua Pamplona, 400 - Jardim Paulista - SP',
          totalValue: 112.50,
          deliveryFee: 12.00,
          items: [
            { name: 'Hambúrguer Gourmet Costela com Queijo Brie', quantity: 2, price: 92.50 },
            { name: 'Batata Frita Crinkle', quantity: 1, price: 20.00 }
          ],
          driverName: 'Lucas Gabriel (Entrega Parceira iFood)',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          acceptedAt: new Date(Date.now() - 3600000 * 1.9).toISOString(),
          dispatchedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
          canceledAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
          cancellationReason: 'Cancelamento pelo suporte alegando atraso do motoboy parceiro',
          cancellationOrigin: 'MARKETPLACE',
          reimbursementStatus: 'PENDENTE_ANALISE',
          lossValue: 124.50,
          driverReturnedFood: false,
          preparationTimeMinutes: 24,
          slaEstimatedDeliveryMinutes: 45,
          auditLog: [
            {
              timestamp: new Date().toISOString(),
              author: 'Motor de Ingestão LossGuard',
              action: 'Ingerido via conciliação em lote. Detectada anomalia contratual: Pedido em rota sem devolução.'
            }
          ],
          aiAnalysis: {
            riskScore: 97,
            recommendation: 'CONTESTAR_IMEDIATAMENTE',
            confidence: 0.99,
            legalBasis: 'Cláusula 7.2 do Contrato iFood: Logística sob responsabilidade da entrega parceira com preparo no prazo.',
            summary: 'Atraso decorrente exclusivamente da rota do entregador do marketplace. Refeição confeccionada em 24 min.',
            disputeDraft: 'Contestação do pedido #IFO-8901. O preparo do restaurante foi concluído em 24 minutos. O atraso em rota decorreu da entrega parceira do marketplace, gerando dever de ressarcimento integral.',
            estimatedRecoveryValue: 124.50,
            applicableRules: ['Cancelamento por atraso de entregador terceirizado']
          }
        },
        {
          id: `ord-imported-2-${Date.now()}`,
          code: '#IFO-8902',
          marketplace: 'iFood',
          customerName: 'Carlos Eduardo Ramos',
          customerPhone: '(11) 97334-9988',
          customerAddress: 'Rua Haddock Lobo, 880 - Cerqueira César - SP',
          totalValue: 74.00,
          deliveryFee: 10.00,
          items: [
            { name: 'Combo Wrap Frango Crispy + Refri', quantity: 2, price: 74.00 }
          ],
          driverName: 'Danilo Silva',
          createdAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
          acceptedAt: new Date(Date.now() - 3600000 * 1.7).toISOString(),
          dispatchedAt: new Date(Date.now() - 3600000 * 1.3).toISOString(),
          canceledAt: new Date(Date.now() - 3600000 * 0.9).toISOString(),
          cancellationReason: 'Cliente desistiu do pedido 25 min apos despacho',
          cancellationOrigin: 'CLIENTE',
          reimbursementStatus: 'PENDENTE_ANALISE',
          lossValue: 84.00,
          driverReturnedFood: false,
          preparationTimeMinutes: 18,
          slaEstimatedDeliveryMinutes: 35,
          auditLog: [
            {
              timestamp: new Date().toISOString(),
              author: 'Motor de Ingestão LossGuard',
              action: 'Ingerido via conciliação em lote. Detectada desistência tardia com perecível em trânsito.'
            }
          ],
          aiAnalysis: {
            riskScore: 95,
            recommendation: 'CONTESTAR_IMEDIATAMENTE',
            confidence: 0.97,
            legalBasis: 'Inadmissibilidade de desistência após confecção e despacho de comida perecível (Art. 49 CDC).',
            summary: 'Desistência injustificada do cliente quando o entregador já estava próximo do endereço de entrega.',
            disputeDraft: 'Contestação do pedido #IFO-8902. Desistência intempestiva do consumidor após saída para entrega com perecível.',
            estimatedRecoveryValue: 84.00,
            applicableRules: ['Desistência unilateral de alimento em trânsito']
          }
        }
      ];

      setProcessing(false);
      setResultSummary({
        count: generated.length,
        totalValue: generated.reduce((acc, o) => acc + o.lossValue, 0)
      });

      onImportBatch(generated);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <UploadCloud className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Conciliação Automática de Relatório</h2>
              <p className="text-xs text-slate-400">
                Cole o extrato de cancelamentos (CSV/JSON) para detecção de divergências
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Extrato do Marketplace (Formato CSV com Cabeçalho):
            </label>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={7}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-rose-500 leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-slate-300 text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              O algoritmo avalia cruzamento de <strong>Telemetria de Expedição</strong> vs <strong>Horário do Cancelamento</strong> para identificar R$ retidos indevidamente.
            </span>
          </div>

          {resultSummary && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-in fade-in">
              <div>
                <span className="font-bold text-sm block">Conciliação Finalizada!</span>
                <span className="text-xs text-emerald-400">
                  {resultSummary.count} novos incidentes contestáveis adicionados à fila.
                </span>
              </div>
              <span className="font-extrabold text-base text-white">
                + R$ {resultSummary.totalValue.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Fechar
          </button>

          <button
            onClick={handleRunReconciliation}
            disabled={processing}
            className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-rose-950/40 disabled:opacity-50"
          >
            {processing ? (
              <span>Executando Conciliação...</span>
            ) : (
              <>
                <span>Executar Auditoria em Lote</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
