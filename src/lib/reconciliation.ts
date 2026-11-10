import { DeliveryOrder, OperationalMetrics, ReimbursementStatus } from '../types';

/**
 * Motor de Conciliação e Auditoria Operacional
 * Responsável por aplicar as regras de negócio contratuais de marketplaces
 * para detectar pedidos elegíveis a ressarcimento e calcular métricas de perda.
 */

export interface ReconciliationRuleResult {
  ruleCode: string;
  name: string;
  triggered: boolean;
  explanation: string;
  reimbursementSuggested: boolean;
  suggestedLoss: number;
}

export function evaluateOrderRules(order: DeliveryOrder): ReconciliationRuleResult[] {
  const results: ReconciliationRuleResult[] = [];

  // Regra 1: Cancelamento com pedido em rota sem devolução física
  const inRoute = Boolean(order.dispatchedAt && new Date(order.canceledAt) >= new Date(order.dispatchedAt));
  results.push({
    ruleCode: 'RULE_IN_ROUTE_NO_RETURN',
    name: 'Pedido Cancelado em Rota de Entrega',
    triggered: inRoute && !order.driverReturnedFood,
    explanation: inRoute
      ? order.driverReturnedFood
        ? 'O pedido foi devolvido fisicamente pelo entregador (perda apenas de taxa/insumo reaproveitável se aplicável).'
        : 'O pedido estava em rota e NÃO retornou ao restaurante. Perda total de produto alimentício descartável.'
      : 'O cancelamento ocorreu antes do despacho do motoboy.',
    reimbursementSuggested: inRoute && !order.driverReturnedFood,
    suggestedLoss: order.totalValue + order.deliveryFee
  });

  // Regra 2: Tempo de preparo dentro do SLA acordado
  const withinPrepSla = order.preparationTimeMinutes <= 30;
  results.push({
    ruleCode: 'RULE_PREP_SLA_OK',
    name: 'Conformidade com SLA de Produção da Cozinha',
    triggered: withinPrepSla,
    explanation: withinPrepSla
      ? `A cozinha finalizou o pedido em ${order.preparationTimeMinutes} min (meta: até 30 min). Falha de tempo não imputável ao restaurante.`
      : `Tempo de preparo estourou em ${order.preparationTimeMinutes} min (meta: até 30 min). Culpa concorrente ou exclusiva da operação interna.`,
    reimbursementSuggested: withinPrepSla && inRoute,
    suggestedLoss: order.totalValue
  });

  // Regra 3: Cancelamento sumário unilateral por robô do marketplace
  const isMarketplaceBotCancel = order.cancellationOrigin === 'MARKETPLACE' || order.cancellationReason.toLowerCase().includes('bot');
  results.push({
    ruleCode: 'RULE_BOT_ARBITRARY_CANCEL',
    name: 'Cancelamento Sumário por Algoritmo',
    triggered: isMarketplaceBotCancel,
    explanation: isMarketplaceBotCancel
      ? 'Cancelamento gerado automaticamente por algoritmo de SAC sem intervenção humana ou verificação com a loja.'
      : 'Cancelamento com solicitação direta ou motivada.',
    reimbursementSuggested: isMarketplaceBotCancel,
    suggestedLoss: order.totalValue + order.deliveryFee
  });

  return results;
}

export function calculateMetrics(orders: DeliveryOrder[]): OperationalMetrics {
  let totalLostValue = 0;
  let totalRecoveredValue = 0;
  let pendingDisputeValue = 0;
  let resolvedIncidents = 0;

  const reasonsMap: Record<string, { count: number; value: number }> = {};
  const hourMap: Record<string, { count: number; loss: number }> = {};

  orders.forEach((order) => {
    const loss = order.lossValue || (order.totalValue + order.deliveryFee);

    if (order.reimbursementStatus === 'RESSARCIDO') {
      totalRecoveredValue += loss;
      resolvedIncidents++;
    } else if (order.reimbursementStatus === 'PERDA_CONFIRMADA') {
      totalLostValue += loss;
      resolvedIncidents++;
    } else if (order.reimbursementStatus === 'CONTESTADO' || order.reimbursementStatus === 'PENDENTE_ANALISE') {
      pendingDisputeValue += loss;
    }

    // Agrupamento por motivo
    const reasonKey = order.cancellationReason.split('(')[0].trim().slice(0, 45);
    if (!reasonsMap[reasonKey]) {
      reasonsMap[reasonKey] = { count: 0, value: 0 };
    }
    reasonsMap[reasonKey].count += 1;
    reasonsMap[reasonKey].value += loss;

    // Agrupamento por horário
    const hour = new Date(order.createdAt).getHours();
    const hourKey = `${String(hour).padStart(2, '0')}:00`;
    if (!hourMap[hourKey]) {
      hourMap[hourKey] = { count: 0, loss: 0 };
    }
    hourMap[hourKey].count += 1;
    hourMap[hourKey].loss += loss;
  });

  const totalIncidents = orders.length;
  const winRate = resolvedIncidents > 0 
    ? Math.round((totalRecoveredValue / (totalRecoveredValue + totalLostValue || 1)) * 100)
    : 88;

  // Média estimada: cada contestação manual consome ~25 minutos de um analista/gerente
  // Com o LossGuard automatizando o processo para 30 segundos:
  const hoursSavedEstimated = Math.round((totalIncidents * 25) / 60 * 10) / 10;

  const cancellationsByReason = Object.entries(reasonsMap).map(([reason, data]) => ({
    reason,
    count: data.count,
    value: Math.round(data.value * 100) / 100
  })).sort((a, b) => b.value - a.value);

  const lossByHourOfDay = Object.entries(hourMap).map(([hour, data]) => ({
    hour,
    count: data.count,
    loss: Math.round(data.loss * 100) / 100
  })).sort((a, b) => a.hour.localeCompare(b.hour));

  return {
    totalLostValue: Math.round(totalLostValue * 100) / 100,
    totalRecoveredValue: Math.round(totalRecoveredValue * 100) / 100,
    pendingDisputeValue: Math.round(pendingDisputeValue * 100) / 100,
    hoursSavedEstimated,
    totalIncidents,
    resolvedIncidents,
    winRatePercentage: winRate,
    cancellationsByReason,
    lossByHourOfDay
  };
}

/**
 * Simula ingestão e reconciliação em lote a partir de CSV ou dados de webhook
 */
export function parseRawCsvToOrders(csvText: string): Partial<DeliveryOrder>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const parsed: Partial<DeliveryOrder>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 5) {
      parsed.push({
        code: cols[0].startsWith('#') ? cols[0] : `#IFO-${cols[0]}`,
        customerName: cols[1] || 'Cliente iFood',
        totalValue: parseFloat(cols[2]) || 50.0,
        cancellationReason: cols[3] || 'Cancelamento registrado pelo marketplace',
        reimbursementStatus: (cols[4] as ReimbursementStatus) || 'PENDENTE_ANALISE'
      });
    }
  }

  return parsed;
}
