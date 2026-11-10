import { DeliveryOrder } from '../types';

export const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'ord-001',
    code: '#IFO-8831',
    marketplace: 'iFood',
    customerName: 'Renata Albuquerque Silva',
    customerPhone: '(11) 98721-4321',
    customerAddress: 'Rua Bela Cintra, 1420 - Apto 82, Consolação - SP',
    totalValue: 142.50,
    deliveryFee: 14.00,
    items: [
      { name: 'Combo Smash Burger Duplo Cheddar + Bacon', quantity: 2, price: 98.00 },
      { name: 'Batata Rústica Trufada com Alecrim', quantity: 1, price: 28.50 },
      { name: 'Refrigerante Coca-Cola Zero 350ml', quantity: 2, price: 16.00 }
    ],
    driverName: 'Marcos Vinicius (Entrega Parceira iFood)',
    createdAt: '2026-11-10T12:05:00',
    acceptedAt: '2026-11-10T12:06:12',
    dispatchedAt: '2026-11-10T12:28:40',
    canceledAt: '2026-11-10T12:47:15',
    cancellationReason: 'Cliente alegou tempo excessivo de espera no chat',
    cancellationOrigin: 'CLIENTE',
    reimbursementStatus: 'PENDENTE_ANALISE',
    lossValue: 156.50,
    driverReturnedFood: false,
    preparationTimeMinutes: 22,
    slaEstimatedDeliveryMinutes: 45,
    auditLog: [
      {
        timestamp: '2026-11-10T12:06:12',
        author: 'Sistema PDV',
        action: 'Pedido aceito e despachado para a cozinha.'
      },
      {
        timestamp: '2026-11-10T12:28:40',
        author: 'Expedição',
        action: 'Pedido entregue ao entregador parceiro Marcos Vinicius.'
      },
      {
        timestamp: '2026-11-10T12:47:15',
        author: 'Webhook iFood',
        action: 'Cancelamento unilateral notificado pelo marketplace.'
      }
    ],
    aiAnalysis: {
      riskScore: 96,
      recommendation: 'CONTESTAR_IMEDIATAMENTE',
      confidence: 0.98,
      legalBasis: 'Regulamento de Parcerias iFood (Seção 7 - Entregas e Cancelamentos) c/c Art. 49 CDC.',
      summary: 'O pedido foi preparado em 22 min (abaixo da meta de 30 min) e já havia sido retirado pelo motoboy parceiro da plataforma há 19 minutos. O restaurante cumpriu integralmente seu papel; a responsabilidade pelo tempo em rota é exclusiva da logística do marketplace.',
      disputeDraft: 'Prezada equipe de Operações iFood,\n\nSolicitamos a revisão e o ressarcimento integral do pedido #IFO-8831 (Valor: R$ 156,50). Conforme registros de telemetria da nossa expedição e da própria plataforma:\n1. O pedido foi aceito às 12:06 e liberado para entrega às 12:28 (tempo de cozinha de 22 minutos, estritamente dentro do SLA).\n2. O pedido foi coletado pelo entregador parceiro Marcos Vinicius às 12:28:40.\n3. O cancelamento foi deferido pelo suporte às 12:47:15, quando a refeição já se encontrava em trânsito há mais de 18 minutos.\n4. NÃO houve devolução do produto ao estabelecimento.\n\nNos termos da Cláusula 7.2 do Contrato de Parceria, o restaurante não responde por atrasos decorrentes da rota da entrega parceira quando a expedição é concluída no prazo. Solicitamos o estorno do valor no próximo ciclo de repasse financeiro.',
      estimatedRecoveryValue: 156.50,
      applicableRules: [
        'Cancelamento com pedido em rota (sem devolução física)',
        'Tempo de preparo dentro da margem contratual',
        'Logística sob responsabilidade da entrega parceira da plataforma'
      ]
    }
  },
  {
    id: 'ord-002',
    code: '#IFO-8845',
    marketplace: 'iFood',
    customerName: 'Guilherme Siqueira',
    customerPhone: '(11) 97112-9090',
    customerAddress: 'Alameda Santos, 980 - Cerqueira César - SP',
    totalValue: 89.00,
    deliveryFee: 9.00,
    items: [
      { name: 'Poke Salmão Fresh Completo', quantity: 1, price: 69.00 },
      { name: 'Suco Natural Laranja 500ml', quantity: 1, price: 14.00 },
      { name: 'Adicional Cream Cheese', quantity: 1, price: 6.00 }
    ],
    driverName: 'Lucas Ferreira',
    createdAt: '2026-11-10T12:35:00',
    acceptedAt: '2026-11-10T12:36:00',
    dispatchedAt: '2026-11-10T12:50:00',
    canceledAt: '2026-11-10T13:12:00',
    cancellationReason: 'Cliente informou que o entregador não encontrou o endereço e desistiu',
    cancellationOrigin: 'CLIENTE',
    reimbursementStatus: 'CONTESTADO',
    lossValue: 98.00,
    driverReturnedFood: false,
    preparationTimeMinutes: 14,
    slaEstimatedDeliveryMinutes: 35,
    auditLog: [
      {
        timestamp: '2026-11-10T12:36:00',
        author: 'Sistema PDV',
        action: 'Pedido aceito com preparo expresso.'
      },
      {
        timestamp: '2026-11-10T13:12:00',
        author: 'Webhook iFood',
        action: 'Cancelamento por falha de localização.'
      },
      {
        timestamp: '2026-11-10T13:25:00',
        author: 'LossGuard AI',
        action: 'Contestação automática despachada para a fila de suporte do marketplace.'
      }
    ],
    aiAnalysis: {
      riskScore: 92,
      recommendation: 'CONTESTAR_IMEDIATAMENTE',
      confidence: 0.95,
      legalBasis: 'Insucesso de entrega por endereço não localizado sem retorno da mercadoria perecível.',
      summary: 'Alimento perecível expedido corretamente. A não localização do cliente e posterior cancelamento sem retorno ao restaurante gera dever de repasse integral.',
      disputeDraft: 'Contestação formal do pedido #IFO-8845. Pedido perecível produzido e despachado. Não localização no destino sem devolução da refeição gera perda irrecuperável de insumos ao lojista. Solicitamos repasse integral.',
      estimatedRecoveryValue: 98.00,
      applicableRules: [
        'Pedido perecível descartado ou retido por entregador parceiro',
        'Insucesso de entrega por responsabilidade de terceiros'
      ]
    }
  },
  {
    id: 'ord-003',
    code: '#IFO-8790',
    marketplace: 'iFood',
    customerName: 'Camila Rodrigues Mendes',
    customerPhone: '(11) 99123-5544',
    customerAddress: 'Rua Augusta, 2100 - Apto 31 - Consolação - SP',
    totalValue: 215.00,
    deliveryFee: 16.00,
    items: [
      { name: 'Pizza Família 8 Pedaços Meio Margherita Meio Parma', quantity: 1, price: 110.00 },
      { name: 'Pizza Doce Pequena Nutella com Morango', quantity: 1, price: 65.00 },
      { name: 'Vinho Tinto Cabernet Sauvignon 750ml', quantity: 1, price: 40.00 }
    ],
    driverName: 'Rogério Andrade (Frota Própria)',
    createdAt: '2026-11-09T20:10:00',
    acceptedAt: '2026-11-09T20:12:00',
    dispatchedAt: '2026-11-09T21:20:00',
    canceledAt: '2026-11-09T21:15:00',
    cancellationReason: 'Atraso de mais de 45 minutos no preparo na cozinha',
    cancellationOrigin: 'RESTAURANTE',
    reimbursementStatus: 'PERDA_CONFIRMADA',
    lossValue: 231.00,
    driverReturnedFood: true,
    preparationTimeMinutes: 63,
    slaEstimatedDeliveryMinutes: 40,
    auditLog: [
      {
        timestamp: '2026-11-09T20:12:00',
        author: 'Sistema PDV',
        action: 'Pedido aceito em horário de pico.'
      },
      {
        timestamp: '2026-11-09T21:15:00',
        author: 'Webhook iFood',
        action: 'Cancelamento por estouro de SLA de produção.'
      },
      {
        timestamp: '2026-11-09T21:30:00',
        author: 'LossGuard AI',
        action: 'Auditoria marcou o caso como perda operacional interna.'
      }
    ],
    aiAnalysis: {
      riskScore: 12,
      recommendation: 'PERDA_INCONTESTAVEL',
      confidence: 0.99,
      legalBasis: 'Violação de SLA contratual de produção (tempo de cozinha excedeu 60 minutos sem atualização de status).',
      summary: 'Tempo de preparo estourou em 23 minutos o prazo prometido antes do despacho. Contestação improcedente; recomendada melhoria na capacidade produtiva da cozinha em horários de pico.',
      disputeDraft: 'Não recomendada contestação. Falha operacional interna comprovada por log.',
      estimatedRecoveryValue: 0.00,
      applicableRules: [
        'Tempo de preparo superior ao dobro do SLA acordado',
        'Cancelamento anterior ao despacho com culpa do estabelecimento'
      ]
    }
  },
  {
    id: 'ord-004',
    code: '#IFO-8860',
    marketplace: 'iFood',
    customerName: 'Eduardo Farias Brandão',
    customerPhone: '(11) 97654-1122',
    customerAddress: 'Rua Oscar Freire, 320 - Jardins - SP',
    totalValue: 310.00,
    deliveryFee: 18.00,
    items: [
      { name: 'Combo Parrilla Premium Picanha + Bife Ancho (Para 3 pessoas)', quantity: 1, price: 245.00 },
      { name: 'Farofa Especial de Ovos com Bacon', quantity: 1, price: 35.00 },
      { name: 'Cerveja Artesanal IPA 500ml', quantity: 2, price: 30.00 }
    ],
    driverName: 'Felipe Santana (Entrega Parceira iFood)',
    createdAt: '2026-11-10T13:00:00',
    acceptedAt: '2026-11-10T13:01:30',
    dispatchedAt: '2026-11-10T13:25:00',
    canceledAt: '2026-11-10T13:58:00',
    cancellationReason: 'Cancelamento sumário via bot de atendimento ("Item não entregue")',
    cancellationOrigin: 'MARKETPLACE',
    reimbursementStatus: 'PENDENTE_ANALISE',
    lossValue: 328.00,
    driverReturnedFood: false,
    preparationTimeMinutes: 23,
    slaEstimatedDeliveryMinutes: 45,
    auditLog: [
      {
        timestamp: '2026-11-10T13:01:30',
        author: 'Sistema PDV',
        action: 'Pedido aceito e produzido em 23 min.'
      },
      {
        timestamp: '2026-11-10T13:25:00',
        author: 'Expedição',
        action: 'Entregue ao parceiro logístico Felipe Santana.'
      },
      {
        timestamp: '2026-11-10T13:58:00',
        author: 'Webhook iFood',
        action: 'Cancelamento automático deferido pelo robô de SAC.'
      }
    ],
    aiAnalysis: {
      riskScore: 98,
      recommendation: 'CONTESTAR_IMEDIATAMENTE',
      confidence: 0.99,
      legalBasis: 'Cancelamento automatizado sem validação de código de confirmação (PIN) e sem acareação com o lojista.',
      summary: 'Ticket de alto valor (R$ 328,00). O motoboy parceiro não acionou o retorno e o cancelamento foi concedido automaticamente pelo sistema sem comprovação ou foto.',
      disputeDraft: 'Urgente: Contestação de estorno indevido referente ao pedido #IFO-8860 (Valor: R$ 328,00).\n\nO pedido em tela consiste em refeição de alta gastronomia despachada no horário rigorosamente previsto. O cancelamento foi concedido pelo suporte automatizado sob alegação genérica de "não entrega", sem que houvesse exigência do código PIN de segurança ou comunicação ao estabelecimento.\n\nExigimos ressarcimento integral imediato conforme termos de garantia de repasse para entregas sob gestão da plataforma.',
      estimatedRecoveryValue: 328.00,
      applicableRules: [
        'Cancelamento automatizado de alto valor (> R$ 200) sem PIN',
        'Entrega parceira sem devolução física'
      ]
    }
  },
  {
    id: 'ord-005',
    code: '#IFO-8812',
    marketplace: 'iFood',
    customerName: 'Patrícia Zanin',
    customerPhone: '(11) 98111-2233',
    customerAddress: 'Av. Paulista, 1578 - Bela Vista - SP',
    totalValue: 78.00,
    deliveryFee: 10.00,
    items: [
      { name: 'Marmita Fit Frango Grelhado com Legumes e Quinoa', quantity: 2, price: 78.00 }
    ],
    driverName: 'Marcos Vinicius',
    createdAt: '2026-11-08T11:40:00',
    acceptedAt: '2026-11-08T11:42:00',
    dispatchedAt: '2026-11-08T12:05:00',
    canceledAt: '2026-11-08T12:35:00',
    cancellationReason: 'Cliente recusou na portaria por engano de portaria',
    cancellationOrigin: 'CLIENTE',
    reimbursementStatus: 'RESSARCIDO',
    lossValue: 88.00,
    driverReturnedFood: false,
    preparationTimeMinutes: 23,
    slaEstimatedDeliveryMinutes: 40,
    auditLog: [
      {
        timestamp: '2026-11-08T12:05:00',
        author: 'Expedição',
        action: 'Despachado com sucesso.'
      },
      {
        timestamp: '2026-11-08T12:40:00',
        author: 'LossGuard AI',
        action: 'Contestação automática enviada com fundamentação legal.'
      },
      {
        timestamp: '2026-11-09T14:10:00',
        author: 'iFood Financeiro',
        action: 'Contestação aceita. Crédito de R$ 88,00 aprovado no extrato.'
      }
    ],
    aiAnalysis: {
      riskScore: 94,
      recommendation: 'CONTESTAR_IMEDIATAMENTE',
      confidence: 0.96,
      legalBasis: 'Recusa indevida no destino após conclusão de preparo.',
      summary: 'Caso resolvido com sucesso com ressarcimento integral creditado.',
      disputeDraft: 'Caso encerrado com êxito.',
      estimatedRecoveryValue: 88.00,
      applicableRules: ['Ressarcimento integral deferido por falha no recebimento']
    }
  },
  {
    id: 'ord-006',
    code: '#IFO-8877',
    marketplace: 'iFood',
    customerName: 'Thiago Neves Silveira',
    customerPhone: '(11) 96543-8899',
    customerAddress: 'Rua Fradique Coutinho, 540 - Pinheiros - SP',
    totalValue: 124.00,
    deliveryFee: 12.00,
    items: [
      { name: 'Risoto de Funghi Secchi ao Vinho Branco', quantity: 1, price: 68.00 },
      { name: 'Bruschetta Tradicional de Tomate Pomodoro', quantity: 1, price: 32.00 },
      { name: 'Água Mineral San Pellegrino 500ml', quantity: 1, price: 24.00 }
    ],
    driverName: 'André Luiz Souza',
    createdAt: '2026-11-10T13:15:00',
    acceptedAt: '2026-11-10T13:17:00',
    dispatchedAt: '2026-11-10T13:38:00',
    canceledAt: '2026-11-10T13:50:00',
    cancellationReason: 'Cliente alegou que pediu por engano e queria trocar endereço',
    cancellationOrigin: 'CLIENTE',
    reimbursementStatus: 'PENDENTE_ANALISE',
    lossValue: 136.00,
    driverReturnedFood: false,
    preparationTimeMinutes: 21,
    slaEstimatedDeliveryMinutes: 40,
    auditLog: [
      {
        timestamp: '2026-11-10T13:17:00',
        author: 'Sistema PDV',
        action: 'Pedido aceito e em preparo.'
      },
      {
        timestamp: '2026-11-10T13:38:00',
        author: 'Expedição',
        action: 'Despachado para o entregador André Luiz Souza.'
      },
      {
        timestamp: '2026-11-10T13:50:00',
        author: 'Webhook iFood',
        action: 'Cancelamento por desistência do consumidor em rota.'
      }
    ],
    aiAnalysis: {
      riskScore: 97,
      recommendation: 'CONTESTAR_IMEDIATAMENTE',
      confidence: 0.98,
      legalBasis: 'Arrependimento tardio após a confecção e despacho do produto alimentício perecível.',
      summary: 'O cliente desistiu porque digitou o endereço errado. O restaurante não pode ser onerado pelo erro cadastral do cliente após a comida já estar pronta e expedida.',
      disputeDraft: 'Contestação do pedido #IFO-8877. O motivo registrado de cancelamento é "erro de endereço informado pelo cliente". Conforme diretrizes da plataforma e jurisprudência pacífica sobre bens de consumo imediato perecíveis, o erro do consumidor não elide a obrigação de repasse ao restaurante parceiro que cumpriu o pedido.',
      estimatedRecoveryValue: 136.00,
      applicableRules: [
        'Erro cadastral do cliente no aplicativo',
        'Produto perecível sem viabilidade de reaproveitamento'
      ]
    }
  }
];
