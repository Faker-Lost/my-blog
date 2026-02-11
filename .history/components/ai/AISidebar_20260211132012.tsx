'use client';

import {
  MessageSquare,
  History,
  Plus,
  ChevronLeft,
  Hexagon,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface ChatHistoryItem {
  id: string;
  title: string;
  date: number;
}

interface AISidebarProps {
  onNewChat: () => void;
  history: ChatHistoryItem[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onClearHistory?: () => void;
}

export default function AISidebar({
  onNewChat,
  history,
  currentChatId,
  onSelectChat,
  onClearHistory
}: AISidebarProps) {
  return (
    <aside className="w-64 h-full border-r border-zinc-200 bg-zinc-50 flex flex-col shrink-0 overflow-hidden shadow-sm z-20">
      {/* Logo Area */}
      <div className="p-6 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center border border-cyan-100 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(8,145,178,0.2)] transition-all duration-300">
            <Hexagon className="w-5 h-5 text-cyan-600 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <span className="font-bold text-sm tracking-tighter text-zinc-900 group-hover:text-cyan-600 transition-colors uppercase italic">
            Faker Studio
          </span>
        </Link>
      </div>

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full py-3 rounded-xl border border-dashed border-zinc-300 bg-white hover:bg-zinc-100 hover:border-cyan-500/50 text-zinc-500 hover:text-cyan-600 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-200">
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Recent Logs
          </span>
          {history.length > 0 && onClearHistory && (
            <button
              onClick={onClearHistory}
              className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Clear History"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-zinc-400 italic font-medium">
            No history yet.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectChat(item.id)}
              className={`w-full text-left px-3 py-3 rounded-xl text-xs transition-all truncate flex items-center gap-3 group border ${currentChatId === item.id
                ? "bg-cyan-50 text-cyan-700 border-cyan-100 shadow-sm"
                : "text-zinc-500 hover:bg-white hover:text-zinc-900 border-transparent hover:border-zinc-200 hover:shadow-sm"
                }`}
            >
              <History className={`w-3.5 h-3.5 shrink-0 transition-colors ${currentChatId === item.id ? "text-cyan-600" : "text-zinc-300 group-hover:text-zinc-500"
                }`} />
              <span className={`truncate flex-1 ${currentChatId === item.id ? "font-bold" : "font-medium"}`}>{item.title}</span>
            </button>
          ))
        )}
      </div>

      {/* Footer / System Status */}
      <div className="mt-auto p-4 border-t border-zinc-200/50 space-y-4 bg-zinc-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-500 font-bold hover:text-cyan-600 transition-colors py-2 uppercase tracking-tighter"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    </aside>
  );
}
