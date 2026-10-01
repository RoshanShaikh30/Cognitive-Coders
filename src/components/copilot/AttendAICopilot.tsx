import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, X, Minimize2, Send, GripHorizontal, Bot } from 'lucide-react';
import { askAttendAICopilot } from '../../services/geminiService';
import { sound } from '../../services/soundService';

interface AttendAICopilotProps {
  onTriggerDashboardAction?: (actionType: string, payload: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: { label: string; action: string; payload: string }[];
}

export const AttendAICopilot: React.FC<AttendAICopilotProps> = ({
  onTriggerDashboardAction,
}) => {
  const { currentOrg, currentUser, students } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dockSide, setDockSide] = useState<'bottom-right' | 'bottom-left'>('bottom-right');

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Greetings. I am **AttendAI Copilot**, your predictive intelligence assistant for **${currentOrg?.name || 'your institution'}**.\n\nYou can ask me to forecast attendance recovery, analyze debarment risks, or draft parental advisories.`,
      timestamp: 'Active',
      actions: [
        { label: 'Check At-Risk Quotas', action: 'filter_risk', payload: 'below_75' },
        { label: 'Forecast 6-Lecture Recovery', action: 'simulate_recovery', payload: '6_lectures' },
      ],
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const newX = Math.max(10, Math.min(window.innerWidth - 380, e.clientX - dragStartRef.current.x));
    const newY = Math.max(10, Math.min(window.innerHeight - 450, e.clientY - dragStartRef.current.y));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleSubmit = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    sound.playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askAttendAICopilot(query, {
        orgName: currentOrg?.name || 'Academic Institution',
        role: currentUser?.role || 'Member',
        avgAttendance: `${currentOrg?.averageAttendance || 85}%`,
        riskStudents: students.filter((s) => s.overallAttendance < 75).map((s) => `${s.name} (${s.overallAttendance}%)`),
      });

      const actionMatches = [...response.reply.matchAll(/\[ACTION:\s*([^|]+)\s*\|\s*([^\]]+)\]/g)];
      const parsedActions = actionMatches.map((m) => ({
        label: m[1].replace(/_/g, ' ').toUpperCase(),
        action: m[1].trim(),
        payload: m[2].trim(),
      }));

      const cleanReply = response.reply.replace(/\[ACTION:[^\]]+\]/g, '').trim();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: cleanReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: parsedActions.length > 0 ? parsedActions : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
      sound.playHover();
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  // Minimized Floating Launcher
  if (!isOpen || isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 cursor-pointer group"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
          sound.playSuccessChime();
        }}
      >
        <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#2b2523]/15 text-xs text-[#1c1917] font-semibold shadow-md group-hover:border-[#c83a4b]/60 transition-all">
          AttendAI Copilot
        </span>
        <div className="w-13 h-13 rounded-2xl bg-white border border-[#2b2523]/15 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#c83a4b] transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#c83a4b]/10 text-[#c83a4b] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  const containerStyle =
    dockSide === 'bottom-right'
      ? { bottom: '24px', right: '24px' }
      : { bottom: '24px', left: '24px' };

  return (
    <div
      ref={panelRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={containerStyle}
      className="fixed z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-60px)] washi-card-elevated rounded-2xl border border-[#2b2523]/15 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
    >
      {/* Draggable Header */}
      <div
        onPointerDown={handlePointerDown}
        className="px-4 py-3 bg-[#ede8dc]/80 border-b border-[#2b2523]/10 flex items-center justify-between cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#c83a4b]/10 border border-[#c83a4b]/20 flex items-center justify-center text-[#c83a4b]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5 font-display">
              AttendAI Copilot
              <span className="text-[9px] font-mono text-[#b48728] px-1 py-0.2 rounded bg-[#b48728]/10 border border-[#b48728]/20 font-bold">
                GEMINI 3.8
              </span>
            </h4>
            <span className="text-[10px] text-[#78716c] block truncate max-w-[180px]">
              {currentOrg?.name || 'Institution Context'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setDockSide((prev) => (prev === 'bottom-right' ? 'bottom-left' : 'bottom-right'));
              sound.playClick();
            }}
            className="p-1 rounded text-[#78716c] hover:text-[#1c1917] text-[10px] font-mono px-1.5 border border-[#2b2523]/10 bg-white"
          >
            {dockSide === 'bottom-right' ? '◧ Dock L' : '◨ Dock R'}
          </button>
          <button
            onClick={() => {
              setIsMinimized(true);
              sound.playClick();
            }}
            className="p-1 rounded text-[#78716c] hover:text-[#1c1917]"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
            }}
            className="p-1 rounded text-[#78716c] hover:text-[#1c1917]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#fbf9f5]/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-[#c83a4b] text-white rounded-tr-sm shadow-sm'
                  : 'bg-white border border-[#2b2523]/10 text-[#1c1917] rounded-tl-sm shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.text}
              </div>

              {m.actions && m.actions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[#2b2523]/10 flex flex-wrap gap-1.5">
                  {m.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        if (onTriggerDashboardAction) onTriggerDashboardAction(act.action, act.payload);
                      }}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold bg-[#c83a4b]/10 text-[#c83a4b] border border-[#c83a4b]/20 hover:bg-[#c83a4b]/20 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#b48728]" />
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#78716c] font-mono mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#2b2523]/10 text-xs text-[#78716c]">
            <Sparkles className="w-3.5 h-3.5 text-[#c83a4b] animate-spin" />
            <span>Consulting Gemini analytics...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-3 bg-white border-t border-[#2b2523]/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AttendAI Copilot..."
          className="flex-1 bg-[#f7f5ef] border border-[#2b2523]/15 rounded-xl px-3.5 py-2 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#c83a4b]"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="w-8 h-8 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
