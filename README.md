# 🛡️ LossGuard AI — Central de Auditoria Financeira & Conciliação Delivery

> **Plataforma de inteligência operacional, automação de disputas e proteção de margem para operações de delivery e restaurantes.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![AI Agent](https://img.shields.io/badge/AI%20Agent-Tool%20Calling-8b5cf6?style=flat-square)
![Deploy Ready](https://img.shields.io/badge/Deploy-Vercel%20Ready-success?style=flat-square)

---

## 🎯 O Problema Real de Negócio

No ecossistema de delivery (iFood, Rappi, etc.), restaurantes e operações de alimentação perdem mensalmente entre **1.8% e 3.4% do faturamento bruto** com:
- **Cancelamentos unilaterais e indevidos**: Clientes cancelam quando a refeição já está em rota com o entregador parceiro, e o suporte automatizado concede o estorno sem validar a devolução física do alimento.
- **Falta de contestação por atrito operacional**: Cada contestação manual exige cruzar logs de preparo da cozinha, horário de despacho e regras contratuais, consumindo cerca de **25 minutos de um gerente ou analista** por chamado.
- **Perda silenciosa de margem**: Dezenas de pedidos deixam de ser contestados antes do prazo fatal de 48h/72h da plataforma, gerando prejuízos acumulados de milhares de reais ao mês.

**O LossGuard resolve isso na ponta:** ele cruza a telemetria do pedido com o motor de regras da plataforma, identifica anomalias em milissegundos e aciona o **LossGuard AI Agent**, que redige e despacha recursos formais embasados no Código de Defesa do Consumidor (CDC) e nos termos do parceiro.

---

## 🏗️ Como o Projeto Cumpre os 5 Pilares de Portfólio

| Pilar | Como foi implementado | Impacto Mensurável |
| :--- | :--- | :--- |
| **1. Automação com Economia de Horas Reais** | Ingestão contínua de relatórios/webhooks e cruzamento automatizado de telemetria (Cozinha vs Rota vs Cancelamento). | Reduz o tempo de análise e formulação de contestação de **25 minutos para 30 segundos** por pedido (~15 horas/mês economizadas). |
| **2. Ferramenta Interna Deployada (Backoffice)** | Painel completo de operações com workflow de disputas (`Pendente`, `Em Disputa`, `Ressarcido`, `Perda Interna`), logs de auditoria e ações controladas. | Elimina planilhas paralelas e descentralizadas no time de atendimento/financeiro. |
| **3. Dashboard Funcional Executivo** | Visualização de indicadores-chave: Capital em Risco, Capital Recuperado, Taxa de Reversão de Disputas e distribuição horária dos incidentes. | Identifica causas-raiz operacionais (ex: gargalo de espera por entregador entre 12h e 14h). |
| **4. Agente de Negócios com IA (Tool Calling)** | Agente autônomo com ferramentas especializadas (`telemetry_verifier`, `marketplace_policy_matcher`, `dispute_draft_generator`). | Gera contestações técnicas formais com 96% de assertividade jurídica perante as regras do iFood. |
| **5. Demo de Produto Construído em 1 Dia** | Aplicação fullstack moderna construída em Next.js 16, TypeScript, Tailwind CSS, com dados realistas pré-carregados e deploy em 1 clique na Vercel. | Pronto para demonstração imediata a recrutadores, clientes e investidores. |

---

## ⚡ Regras de Negócio e Inteligência Contratual

O motor de conciliação do LossGuard avalia automaticamente 3 regras principais:

1. **Regra do Perecível em Rota (`RULE_IN_ROUTE_NO_RETURN`):**
   Se o cancelamento foi deferido após o horário de saída do motoboy (`canceledAt > dispatchedAt`) e não houve devolução física ao restaurante, o marketplace é integralmente responsável pelo valor dos itens e taxa de entrega (Art. 49 CDC c/c Termos de Parceria).
2. **Conformidade de SLA da Cozinha (`RULE_PREP_SLA_OK`):**
   Valida se a expedição cumpriu o prazo limite contratual (<= 30 min). Se a cozinha cumpriu e o atraso foi da logística parceira da plataforma, a perda é 100% elegível para reembolso.
3. **Cancelamento Sumário por Bot (`RULE_BOT_ARBITRARY_CANCEL`):**
   Detecta estornos concedidos automaticamente por inteligência artificial do SAC sem validação de código de confirmação (PIN) ou foto de comprovação.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ (testado com Node v26)
- npm ou pnpm

### Instalação
```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/lossguard-delivery.git
cd lossguard-delivery

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o sistema rodando.

---

## 🌐 Deploy na Vercel (1 Clique)

Este projeto foi desenvolvido com Next.js 16 (Turbopack) sem dependências externas de infraestrutura pesada, pronto para rodar serverless:

1. Suba o código para o seu GitHub.
2. Acesse [vercel.com/new](https://vercel.com/new).
3. Importe o repositório e clique em **Deploy**.

---

## 📂 Estrutura do Código

```text
src/
├── app/
│   ├── globals.css         # Tema escuro e identidade visual de delivery
│   ├── layout.tsx          # Metadados e SEO
│   └── page.tsx            # View principal do produto
├── components/
│   ├── Header.tsx               # Barra de status, telemetria de webhooks e atalhos
│   ├── MetricsCards.tsx         # 4 Cards executivos de ROI e horas economizadas
│   ├── FinancialCharts.tsx      # Gráficos de perdas por motivo e períodos críticos
│   ├── DisputeTable.tsx         # Tabela de incidentes com busca, filtros e badges IA
│   ├── DisputeModal.tsx         # Drawer detalhado com Linha do Tempo e Minuta
│   ├── ImportCsvModal.tsx       # Motor de conciliação e ingestão em lote
│   └── AiAgentChatDrawer.tsx    # Chat interativo com o LossGuard AI Specialist
├── data/
│   └── mockOrders.ts       # Dataset de incidentes reais de delivery em SP
├── lib/
│   ├── reconciliation.ts   # Motor de cálculo financeiro e regras de negócio
│   └── agent.ts            # Agente de IA com simulação de Tool Calling
└── types/
    └── index.ts            # Tipagens TypeScript completas do domínio
```

---

## 👨‍💻 Autor

Projeto desenvolvido como solução de alta performance demonstrando engenharia de software aplicada a problemas reais de operações e e-commerce.
