'use client';

import {
  MessageSquare,
  History,
  Plus,
  Settings,
  ChevronLeft,
  ShieldAlert,
  Hexagon
} from 'lucide-react';
import Link from 'next/link';

'use client';

import {
  MessageSquare,
  History,
  Plus,
  Settings,
  ChevronLeft,
  ShieldAlert,
  Hexagon,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { removeChat } from '@/lib/actions/chat';
import clsx from 'clsx';

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  path: string;
}

interface AISidebarProps {
  chats: Chat[];
  user?: any;
}

export default function AISidebar({ chats, user }: AISidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full border-r border-white/5 bg-black/40 flex flex-col shrink-0 overflow-hidden">
      {/* Logo 区 */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center border border-cyan-500/40 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
            <Hexagon className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-bold text-sm tracking-tighter text-white/80 group-hover:text-cyan-400 transition-colors">
            FAKER STUDIO
          </span>
        </Link>
      </div>

      {/* 操作按钮 */}
      <div className="p-4">
        <Link
          href={`/chat/${crypto.randomUUID()}`}
          className="w-full py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          新开对话
        </Link>
      </div>

      {/* 历史记录 */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          最近通话
        </div>
        {chats.map((chat) => (
          <div key={chat.id} className="group relative flex items-center">
            <Link
              href={chat.path}
              className={clsx(
                "flex-1 text-left px-3 py-2 rounded-md text-xs truncate flex items-center gap-2 transition-all",
                pathname === chat.path
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <History className="w-3 h-3 text-white/20 group-hover:text-cyan-500/50" />
              <span className="truncate">{chat.title}</span>
            </Link>
            {/* Delete button (client-action wrapped) 
                 Ideally use a form or transition for server action 
             */}
          </div>
        ))}
      </div>

      {/* 系统状态 */}
      <div className="mt-auto p-4 border-t border-white/5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/40 mb-1 uppercase">
            <span>Core Usage</span>
            <span>42%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500/50 w-[42%]" />
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
              {user.image ? <img src={user.image} className="w-full h-full rounded-full" /> : <div className="w-2 h-2 bg-green-500 rounded-full" />}
            </div>
            <span className="truncate max-w-[120px]">{user.name || user.email}</span>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          返回博客
        </Link>
      </div>
    </aside>
  );
}
