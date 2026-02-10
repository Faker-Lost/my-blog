'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto border-x border-white/5 bg-black/20 backdrop-blur-md">
      {/* 内容区 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/10"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Bot className="w-12 h-12 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white/90">
              Faker AI Studio
            </h1>
            <p className="text-muted max-w-sm">
              欢迎来到比特世界的入口。我是 Faker 的数字分身，准备好解析现实了吗？
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-4">
              {['分析 C++ 内存泄漏', '解释 OpenCV 特征提取', '如何理解 Code is Reality?', '优化我的 Qt 界面代码'].map(q => (
                <button
                  key={q}
                  onClick={() => handleInputChange({ target: { value: q } } as any)}
                  className="p-3 text-xs text-left border border-white/5 rounded-lg bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-white/60 hover:text-cyan-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={clsx(
                "flex gap-4 group",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={clsx(
                "w-8 h-8 rounded shrink-0 flex items-center justify-center border",
                m.role === 'user' ? "bg-white/5 border-white/10" : "bg-cyan-500/20 border-cyan-500/30"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Terminal className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className={clsx(
                "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                m.role === 'user'
                  ? "bg-white/5 text-white/90 rounded-tr-none"
                  : "bg-cyan-500/5 border border-cyan-500/10 text-white/90 rounded-tl-none shadow-[0_0_20px_rgba(34,211,238,0.02)]"
              )}>
                <div className="prose prose-invert prose-sm max-w-none">
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Sparkles className="w-4 h-4 text-cyan-500/50" />
            </div>
            <div className="h-10 w-32 bg-white/5 rounded-2xl rounded-tl-none border border-white/5" />
          </div>
        )}
      </div>

      {/* 输入框区 */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <form
          onSubmit={handleSubmit}
          className="relative group max-w-4xl mx-auto"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="输入指令，解析现实..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-white/20"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/10 disabled:text-white/20 text-black font-semibold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-3 text-[10px] text-center text-white/20 uppercase tracking-[0.2em]">
          Algorithm is Power · Data is Truth
        </p>
      </div>
    </div>
  );
}
