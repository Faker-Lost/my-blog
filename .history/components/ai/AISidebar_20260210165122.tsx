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

export default function AISidebar() {
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
        <button className="w-full py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-xs font-medium flex items-center justify-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          新开对话
        </button>
      </div>

      {/* 历史记录 */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          最近通话
        </div>
        {[
          '关于 C++ 内存对其的思考',
          'OpenCV 中的高斯模糊实现',
          'Qt 信号槽机制详解',
          '比特世界的虚幻与真实'
        ].map((title, i) => (
          <button
            key={i}
            className="w-full text-left px-3 py-2 rounded-md text-xs text-white/50 hover:bg-white/5 hover:text-white transition-all truncate flex items-center gap-2 group"
          >
            <History className="w-3 h-3 text-white/20 group-hover:text-cyan-500/50" />
            {title}
          </button>
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

        <div className="flex items-center justify-between text-white/30 hover:text-white/60 transition-colors cursor-pointer">
          <div className="flex items-center gap-2 text-xs">
            <Settings className="w-4 h-4" />
            系统配置
          </div>
        </div>

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
