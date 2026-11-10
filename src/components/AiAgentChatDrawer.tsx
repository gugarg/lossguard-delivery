'use client';

import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, User, ShieldCheck } from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AiAgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    sender: 'ai',
    text: 'Olá! Sou o agente LossGuard AI especializado nas diretrizes do iFood e CDC. Posso analisar casos de cancelamento, fundamentar contestações jurídicas ou verificar se seu restaurante tem direito a ressarcimento integral. Como posso ajudar?',
    timestamp: '12:00'
  }
];

export const AiAgentChatDrawer: React.FC<AiAgentChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';

      if (query.includes('cdc') || query.includes('lei') || query.includes('artigo')) {
        reply = 'Conforme o Art. 49 do CDC, o direito de arrependimento possui exceções pacíficas na jurisprudência para produtos alimentícios perecíveis e de consumo imediato. Uma vez que o restaurante iniciou o preparo ou expediu o pedido, a desistência imotivada do consumidor não exime a plataforma de indenizar o estabelecimento pelos insumos descartados.';
      } else if (query.includes('motoboy') || query.includes('rota') || query.includes('entrega parceira')) {
        reply = 'Pela Cláusula 7 do Contrato de Parceria (Logística iFood Entregas), se o tempo de preparo da cozinha foi cumprido dentro do SLA e o pedido foi transferido ao entregador parceiro da plataforma, QUALQUER atraso posterior, extravio ou recusa do cliente é de responsabilidade integral do marketplace, que deve pagar o valor total dos itens e a taxa de serviço.';
      } else if (query.includes('chuva') || query.includes('atraso')) {
        reply = 'Em dias de chuva, ative a tolerância de 15 minutos adicionais no painel do restaurante antes do aceite do pedido. Caso o atraso decorra da falta de motoboys parceiros da plataforma alocados, registre o print da tela de "Buscando entregador" no chamado para garantir 100% de reversão do estorno.';
      } else {
        reply = `Compreendo a situação. Para esse cenário, a estratégia recomendada é protocolar contestação imediata no Portal do Parceiro anexando o comprovante de expedição da comanda fiscal e os horários de telemetria. De acordo com as diretrizes vigentes, o restaurante tem até 7 dias corridos para solicitar o estorno do débito.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#0f172a] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              LossGuard AI Specialist
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">● Agente Operacional Conectado</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-slate-900/40 border-b border-slate-850 flex gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => setInputText('Qual a regra se o cancelamento ocorrer com o motoboy em rota?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
        >
          Motoboy em rota
        </button>
        <button
          onClick={() => setInputText('Como o CDC se aplica a alimentos perecíveis?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
        >
          Fundamento CDC
        </button>
        <button
          onClick={() => setInputText('Atrasos em dias de chuva dão direito a repasse?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
        >
          Dias de chuva
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-indigo-400" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-rose-600 text-white rounded-tr-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
              }`}
            >
              <p className="leading-relaxed text-xs">{msg.text}</p>
              <span className="text-[10px] text-slate-400 block text-right mt-1.5 opacity-80">
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="h-7 w-7 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-4 w-4 text-rose-300" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <Bot className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="animate-pulse">LossGuard AI consultando regras de marketplace...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte sobre regras, prazos ou CDC..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
