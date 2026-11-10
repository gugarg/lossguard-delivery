export type Marketplace = 'iFood' | 'Rappi' | 'UberEats' | 'Próprio';

export type CancellationOrigin = 'CLIENTE' | 'MARKETPLACE' | 'RESTAURANTE';

export type ReimbursementStatus = 
  | 'PENDENTE_ANALISE'
  | 'CONTESTADO'
  | 'RESSARCIDO'
  | 'NEGADO_PELO_MARKETPLACE'
  | 'PERDA_CONFIRMADA';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface AuditLogEntry {
  timestamp: string;
  author: string;
  action: string;
  notes?: string;
}

export interface AiDisputeAnalysis {
  riskScore: number; // 0 a 100 (quanto maior, mais favorável ao restaurante)
  recommendation: 
    | 'CONTESTAR_IMEDIATAMENTE'
    | 'REVER_OPERACAO_INTERNA'
    | 'ACORDAR_COM_CLIENTE'
    | 'PERDA_INCONTESTAVEL';
  confidence: number; // 0.0 a 1.0
  legalBasis: string;
  summary: string;
  disputeDraft: string;
  estimatedRecoveryValue: number;
  applicableRules: string[];
}

export interface DeliveryOrder {
  id: string;
  code: string; // Ex: #IFO-9412
  marketplace: Marketplace;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalValue: number;
  deliveryFee: number;
  items: OrderItem[];
  driverName?: string;
  createdAt: string;
  acceptedAt: string;
  dispatchedAt?: string;
  canceledAt: string;
  cancellationReason: string;
  cancellationOrigin: CancellationOrigin;
  reimbursementStatus: ReimbursementStatus;
  lossValue: number; // Valor financeiro a ser disputado/perdido
  driverReturnedFood: boolean;
  preparationTimeMinutes: number;
  slaEstimatedDeliveryMinutes: number;
  aiAnalysis?: AiDisputeAnalysis;
  auditLog: AuditLogEntry[];
}

export interface OperationalMetrics {
  totalLostValue: number;
  totalRecoveredValue: number;
  pendingDisputeValue: number;
  hoursSavedEstimated: number;
  totalIncidents: number;
  resolvedIncidents: number;
  winRatePercentage: number;
  cancellationsByReason: { reason: string; count: number; value: number }[];
  lossByHourOfDay: { hour: string; count: number; loss: number }[];
}
