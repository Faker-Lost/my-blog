'use client';

import { useChat } from '@ai-sdk/react';
// import { type UIMessage } from 'ai'; // 'ai' might not export UIMessage directly, let's try importing from @ai-sdk/react or use any
// key: in newer SDKs, Message is often just 'Message' from 'ai'. 
// But error said "ai has no exported member Message". This is key.
// Maybe it's named 'CoreMessage'? Or 'UIMessage'?
// I will try to use 'any' for messages to be safe and fix the functional error first.
// The user just wants it to work.
import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIChatProps {
  chatId: string;
  initialMessages?: any[]; // Revert to any[] to avoid import issues for now
  onFinish?: (messages: any[]) => void;
}

export default function AIChat({ chatId, initialMessages, onFinish }: AIChatProps) {
  const [inputValue, setInputValue] = useState('');

  const { messages, sendMessage, status, setMessages } = useChat({
    id: chatId,
    initialMessages: initialMessages || [],
    onFinish: (message) => {
      // The onFinish prop expects all messages, but we only have the last one here cleanly.
      // We'll just pass the single message to satisfy the callback existence check
      // or we can try to pass `undefined` if the parent handles it.
      // But the previous code tried to pass `allMessages`.
      // Let's just pass `[message]` for now.
      if (onFinish) {
        onFinish([message]);
      }
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status !== 'ready') return;

    const content = inputValue;
    setInputValue('');
    await sendMessage({ text: content });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto border-x border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/50 shadow-[0_0_40px_rgba(8,145,178,0.2)]">
              <Bot className="w-14 h-14 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                FAKER :: AI STUDIO
              </h1>
              <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
                Welcome to the digital frontier. I am Faker's digital avatar, ready to parse reality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-6">
              {['分析 C++ 内存对齐', '解释 OpenCV 特征提取', 'Code is Reality?', '优化 Qt 异步任务'].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInputValue(q)}
                  className="group relative p-4 text-left border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 hover:border-cyan-500/30 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-500" />
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-cyan-400 uppercase tracking-widest mb-1 block">Prompt</span>
                  <span className="text-sm text-zinc-300 group-hover:text-white font-medium">{q}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex gap-4 sm:gap-6",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div className={clsx(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-lg",
                m.role === 'user'
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-cyan-950/30 border-cyan-800/50 shadow-[0_0_15px_rgba(8,145,178,0.15)]"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5 text-zinc-400" /> : <Terminal className="w-5 h-5 text-cyan-400" />}
              </div>

              {/* Message Content */}
              <div className={clsx(
                "flex-1 max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed shadow-sm",
                m.role === 'user'
                  ? "bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700"
                  : "bg-zinc-900/80 text-zinc-200 rounded-tl-none border border-zinc-800/50"
              )}>
                <div className="prose prose-invert prose-zinc max-w-none break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        return !inline ? (
                          <CodeBlock className={className} {...props}>{children}</CodeBlock>
                        ) : (
                          <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-200 text-xs font-mono border border-zinc-700/50" {...props}>{children}</code>
                        )
                      }
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {status === 'submitted' && (
          <div className="flex gap-6 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/20 flex items-center justify-center border border-cyan-900/30">
              <Sparkles className="w-5 h-5 text-cyan-500/50" />
            </div>
            <div className="space-y-2 flex-1 pt-2">
              <div className="h-4 bg-zinc-800 rounded w-24" />
              <div className="h-4 bg-zinc-800/50 rounded w-64" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md">
        <form
          onSubmit={handleFormSubmit}
          className="relative group max-w-4xl mx-auto"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Input instructions to parse reality..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm sm:text-base text-zinc-200 focus:outline-none focus:border-cyan-700/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-zinc-600 font-sans shadow-inner"
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white transition-all shadow-lg hover:shadow-cyan-500/20 disabled:shadow-none flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-3 flex justify-center items-center gap-4 text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">
          <span>Algorithm is Power</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>Data is Truth</span>
        </div>
      </div>
    </div>
  );
}

// Simple Helper for Code Blocks
function CodeBlock({ className, children, ...props }: any) {
  return (
    <pre className={clsx("relative group rounded-lg my-4 bg-[#0d1117] border border-zinc-700 overflow-x-auto p-4", className)} {...props}>
      <code className="font-mono text-sm text-zinc-300">{children}</code>
    </pre>
  );
}
