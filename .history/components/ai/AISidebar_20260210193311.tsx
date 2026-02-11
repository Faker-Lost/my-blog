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
    <aside className="w-64 h-full border-r border-zinc-800 bg-zinc-950/90 flex flex-col shrink-0 overflow-hidden shadow-2xl z-20">
      {/* Logo Area */}
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-cyan-950/50 rounded-lg flex items-center justify-center border border-cyan-800/30 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all duration-300">
            <Hexagon className="w-5 h-5 text-cyan-500 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <span className="font-bold text-sm tracking-tighter text-zinc-300 group-hover:text-cyan-400 transition-colors">
            FAKER STUDIO
          </span>
        </Link>
      </div>

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full py-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-400 text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Recent Chats
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
          <div className="px-3 py-8 text-center text-xs text-zinc-700 italic">
            No history yet.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectChat(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all truncate flex items-center gap-3 group border border-transparent ${currentChatId === item.id
                  ? "bg-cyan-950/30 text-cyan-200 border-cyan-900/50"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 hover:border-zinc-800"
                }`}
            >
              <History className={`w-3.5 h-3.5 shrink-0 transition-colors ${currentChatId === item.id ? "text-cyan-500" : "text-zinc-700 group-hover:text-zinc-500"
                }`} />
              <span className="truncate flex-1">{item.title}</span>
            </button>
          ))
        )}
      </div>

      {/* Footer / System Status */}
      <div className="mt-auto p-4 border-t border-zinc-800/50 space-y-4 bg-zinc-950">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    </aside>
  );
}
