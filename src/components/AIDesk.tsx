import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Volume2, VolumeX, Copy, Check, ThumbsUp, ThumbsDown, 
  Ticket as TicketIcon, RotateCcw
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIDeskProps {
  onConvertChatToTicket: (text: string) => void;
}

const SUGGESTED_PROMPTS = [
  'How do I request an official academic transcript?',
  'What are the deadlines for the 3-installment tuition plan?',
  'How to apply for a room swap in Southfield residence halls?',
  'How do I connect my laptop to campus eduroam Wi-Fi?',
  'Centennial Library quiet study room reservation rules',
  'What are the minimum GPA requirements for Dean’s List?',
];

export const AIDesk: React.FC<AIDeskProps> = ({ onConvertChatToTicket }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am Southfield College's 24/7 AI Desk Assistant. I can assist you with course prerequisite waivers, deferred tuition schedules, merit scholarship eligibility, library study pod reservations, campus Wi-Fi, or residential hall regulations. What can I help clarify today?",
      timestamp: 'Just now',
      sources: ['Southfield Academic Catalog', 'Student Services Welcome Center'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response received from the helpdesk service.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Southfield Student Information System'],
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "I encountered a communication issue connecting to the AI Desk server. You can still browse our verified Knowledge Base tab or file an official ticket with the Registrar.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['System Diagnostic'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleRate = (id: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, rating } : msg))
    );
  };

  const handleClear = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Conversation reset. How can I assist you with your academic, financial, housing, or campus life inquiries?",
        timestamp: 'Just now',
        sources: ['Southfield Student Handbook'],
      },
    ]);
  };

  return (
    <div className="w-full">
      {/* Editorial Hero Banner */}
      <div className="py-16 sm:py-20 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfdfc]">
        <span className="font-mono-space text-[#a37d58] tracking-[0.14em] block mb-2 font-semibold">
          Intelligent Campus Advisory
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.5rem] font-light tracking-tight text-[#1a1a1a] leading-tight my-4">
          Ask Southfield AI Desk
        </h1>
        <p className="text-sm sm:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
          Instant answers grounded in official Southfield University regulations, tuition schedules, degree requirements, and residential policies.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 sm:px-10 py-10 sm:py-12 space-y-8">
        {/* Suggested Prompts Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono-space text-[#888]">
              Frequent Campus Inquiries
            </span>
            <button
              onClick={handleClear}
              className="font-mono-space text-[#666] hover:text-[#1a1a1a] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Chat</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[0.75rem] text-[#1a1a1a] bg-white hover:bg-[#f8f8f5] border border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a] px-3.5 py-1.5 transition-colors text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread Container */}
        <div className="bg-white border border-[rgba(26,26,26,0.12)] flex flex-col h-[580px] shadow-sm">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 bg-[#1a1a1a] text-[#fdfdfc] flex items-center justify-center font-serif-cormorant font-bold text-base shrink-0 mt-0.5">
                    SC
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1a1a1a] text-[#fdfdfc]'
                      : 'bg-[#fdfdfc] text-[#1a1a1a] border border-[rgba(26,26,26,0.08)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {msg.role === 'model' && (
                    <div className="mt-4 pt-3 border-t border-[rgba(26,26,26,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs">
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono-space text-[#888]">Source:</span>
                          {msg.sources.map((src, sIdx) => (
                            <span key={sIdx} className="font-mono-space text-[#666]">
                              {src}
                              {sIdx < msg.sources!.length - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="p-1 text-[#666] hover:text-[#1a1a1a] cursor-pointer"
                          title={speakingId === msg.id ? 'Stop voice' : 'Listen with voice'}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-[#a37d58]" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="p-1 text-[#666] hover:text-[#1a1a1a] cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-[#065f46]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleRate(msg.id, 'up')}
                          className={`p-1 cursor-pointer ${
                            msg.rating === 'up' ? 'text-[#065f46]' : 'text-[#666] hover:text-[#1a1a1a]'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRate(msg.id, 'down')}
                          className={`p-1 cursor-pointer ${
                            msg.rating === 'down' ? 'text-[#991b1b]' : 'text-[#666] hover:text-[#1a1a1a]'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onConvertChatToTicket(msg.text)}
                          className="ml-2 font-mono-space text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-2 py-0.5 transition-colors cursor-pointer"
                        >
                          File Ticket
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={`mt-2 font-mono-space ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-[#888]'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-[#a37d58] text-white flex items-center justify-center font-mono-space font-bold text-xs shrink-0 mt-0.5">
                    YOU
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#1a1a1a] text-[#fdfdfc] flex items-center justify-center font-serif-cormorant font-bold text-base shrink-0 mt-0.5">
                  SC
                </div>
                <div className="bg-[#fdfdfc] border border-[rgba(26,26,26,0.08)] p-4 text-xs text-[#666] flex items-center gap-3">
                  <span className="font-mono-space">Querying university regulatory database...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-[#f8f8f5] border-t border-[rgba(26,26,26,0.08)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question regarding registration, tuition, residence, or library access..."
                rows={2}
                className="flex-1 resize-none bg-white border border-[rgba(26,26,26,0.15)] p-3 text-xs sm:text-sm text-[#1a1a1a] placeholder:text-[#999] focus:outline-none focus:border-[#1a1a1a]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="py-3 px-6 bg-[#1a1a1a] text-white hover:bg-black font-mono-space uppercase tracking-wider disabled:opacity-40 cursor-pointer h-[54px]"
              >
                Send
              </button>
            </form>
            <div className="mt-2 flex justify-between font-mono-space text-[#888]">
              <span>Enter to send · Shift+Enter for newline</span>
              <span>Southfield College :: 2026-2027 Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
