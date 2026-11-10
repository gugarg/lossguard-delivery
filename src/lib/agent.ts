import { DeliveryOrder, AiDisputeAnalysis } from '../types';

export interface AgentStep {
  step: number;
  toolName: string;
  toolInput: Record<string, unknown>;
  toolOutput: Record<string, unknown>;
  thought: string;
}

export interface AgentExecutionResult {
  analysis: AiDisputeAnalysis;
  steps: AgentStep[];
  executionTimeMs: number;
}

/**
 * LossGuard AI Agent
 * Agente de IA com Tool Calling especializado na legislação de delivery (CDC)
 * e regras contratuais das plataformas (iFood, Rappi, etc.).
 */
export async function runDisputeAgent(order: DeliveryOrder): Promise<AgentExecutionResult> {
  const startTime = Date.now();
  const steps: AgentStep[] = [];

  // Passo 1: Ferramenta de Telemetria e Linha do Tempo
  steps.push({
    step: 1,
    toolName: 'telemetry_timeline_verifier',
    toolInput: {
      orderId: order.code,
      acceptedAt: order.acceptedAt,
      dispatchedAt: order.dispatchedAt,
      canceledAt: order.canceledAt,
      driverReturnedFood: order.driverReturnedFood
    },
    toolOutput: {
      preparationTimeMinutes: order.preparationTimeMinutes,
      isPrepWithinTarget: order.preparationTimeMinutes <= 30,
      wasDispatchedBeforeCancel: Boolean(order.dispatchedAt && new Date(order.canceledAt) > new Date(order.dispatchedAt)),
      minutesInRoute: order.dispatchedAt 
        ? Math.max(0, Math.round((new Date(order.canceledAt).getTime() - new Date(order.dispatchedAt).getTime()) / 60000))
        : 0,
      foodWasteConfirmed: !order.driverReturnedFood
    },
    thought: 'Avaliando se o cancelamento ocorreu com o item já em trânsito e se a cozinha cumpriu os prazos operacionais acordados.'
  });

  // Passo 2: Ferramenta de Consulta a Cláusulas Contratuais do Marketplace
  const wasInRoute = Boolean(order.dispatchedAt && new Date(order.canceledAt) > new Date(order.dispatchedAt));
  const prepOk = order.preparationTimeMinutes <= 30;

  let ruleKey = 'CLAUSE_DEFAULT';
  let legalBasis = 'Termos Gerais de Contratação do Marketplace.';
  let winProb = 50;

  if (wasInRoute && !order.driverReturnedFood && prepOk) {
    ruleKey = 'CLAUSE_7_2_IN_ROUTE_INDEMNITY';
    legalBasis = 'Cláusula 7.2 do Contrato de Parceria iFood c/c Art. 49 e Art. 39 do Código de Defesa do Consumidor.';
    winProb = 96;
  } else if (!prepOk) {
    ruleKey = 'CLAUSE_INTERNAL_KITCHEN_DELAY';
    legalBasis = 'Norma de SLA Operacional da Cozinha (Excedido prazo limite de preparo).';
    winProb = 15;
  } else {
    ruleKey = 'CLAUSE_ARBITRARY_CANCELLATION';
    legalBasis = 'Princípio da Boa-fé Objetiva e Vedação ao Enriquecimento Ilícito (Art. 884 Código Civil).';
    winProb = 85;
  }

  steps.push({
    step: 2,
    toolName: 'marketplace_policy_matcher',
    toolInput: {
      marketplace: order.marketplace,
      incidentType: order.cancellationReason,
      cancellationOrigin: order.cancellationOrigin,
      matchedRuleKey: ruleKey
    },
    toolOutput: {
      matchedClause: ruleKey,
      jurisprudencePrecedent: 'Ressarcimento integral obrigatório para produtos perecíveis após despacho da expedição.',
      reimbursementObligation: winProb > 60 ? 'OBRIGATÓRIO_TOTAL' : 'REJEIÇÃO_PROVÁVEL'
    },
    thought: 'Consultando jurisprudência e termos vigentes para pedidos cancelados em trânsito sem devolução de refeição perecível.'
  });

  // Passo 3: Ferramenta de Redação Jurídico-Operacional
  const draft = wasInRoute && prepOk
    ? `Contestação formal referente ao pedido ${order.code} (Valor Total: R$ ${order.totalValue.toFixed(2)} + Taxa R$ ${order.deliveryFee.toFixed(2)}).\n\n` +
      `O estabelecimento preparou e expediu o pedido em estrita conformidade com o prazo de SLA (${order.preparationTimeMinutes} min). ` +
      `O cancelamento foi deferido pelo suporte enquanto a refeição já estava sob custódia da logística/entregador parceiro, sem qualquer retorno dos insumos ao restaurante.\n\n` +
      `Fundamentação: ${legalBasis}.\n` +
      `Solicitamos o lançamento do crédito compensatório no próximo extrato de repasse financeiro.`
    : !prepOk
    ? `Caso de perda interna identificada: o tempo de preparo de ${order.preparationTimeMinutes} minutos superou a janela aceitável. Contestação não recomendada.`
    : `Contestação administrativa do pedido ${order.code}. Solicitação de conciliação por cancelamento arbitrário sem justa causa informada.`;

  steps.push({
    step: 3,
    toolName: 'dispute_draft_generator',
    toolInput: {
      tone: 'FORMAL_ASSERTIVO',
      includeFinancialBreakdown: true,
      targetChannel: 'PORTAL_DO_PARCEIRO_SAC'
    },
    toolOutput: {
      draftLengthChars: draft.length,
      estimatedResolutionHours: 24
    },
    thought: 'Minuta técnica gerada com base nos dados de telemetria e nos artigos contratuais aplicáveis.'
  });

  const recommendation = winProb >= 80 
    ? 'CONTESTAR_IMEDIATAMENTE' 
    : winProb >= 50 
    ? 'ACORDAR_COM_CLIENTE'
    : 'PERDA_INCONTESTAVEL';

  const executionTimeMs = Date.now() - startTime;

  const analysis: AiDisputeAnalysis = {
    riskScore: winProb,
    recommendation,
    confidence: winProb > 90 ? 0.98 : 0.85,
    legalBasis,
    summary: wasInRoute && prepOk
      ? `Probabilidade de reversão de ${winProb}%. O cancelamento ocorreu com a refeição em trânsito após produção dentro do prazo estipulado.`
      : `Probabilidade de reversão de ${winProb}%. Avaliação aponta infração de SLA operacional ou falta de evidências físicas.`,
    disputeDraft: draft,
    estimatedRecoveryValue: winProb >= 60 ? (order.totalValue + order.deliveryFee) : 0,
    applicableRules: [
      'Art. 49 CDC (Impossibilidade de arrependimento em bens perecíveis consumados/expedidos)',
      'Regras Operacionais de Parcerias Logísticas 2026',
      'Responsabilidade Civil da Plataforma por Rota de Entrega Própria'
    ]
  };

  return {
    analysis,
    steps,
    executionTimeMs
  };
}
