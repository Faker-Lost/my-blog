import { useChat } from '@ai-sdk/react';
// import { type UIMessage } from 'ai'; 
import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIChatProps {
  chatId: string;
  initialMessages?: any[];
  onFinish?: (messages: any[]) => void;
}

export default function AIChat({ chatId, initialMessages, onFinish }: AIChatProps) {
  const [inputValue, setInputValue] = useState('');

  const { messages, sendMessage, status, setMessages } = useChat();

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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto border-x border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-10 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="p-5 rounded-3xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-800/50 shadow-sm dark:shadow-[0_0_40px_rgba(8,145,178,0.2)]">
              <Bot className="w-14 h-14 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-mono italic">
                FAKER :: AI STUDIO
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-sm leading-relaxed font-medium">
                Welcome to the digital frontier. I am Faker&apos;s digital avatar, ready to parse reality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg pt-8">
              {['分析 C++ 内存对齐', '解释 OpenCV 特征提取', 'Code is Reality?', '优化 Qt 异步任务'].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInputValue(q)}
                  className="group relative p-5 text-left border border-zinc-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-cyan-500/50 transition-all overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 dark:group-hover:from-cyan-500/10 group-hover:to-transparent transition-all duration-500" />
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 uppercase tracking-widest mb-1.5 block font-bold">Prompt</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white font-semibold transition-colors">{q}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((m: any) => (
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
                "w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-sm dark:shadow-lg",
                m.role === 'user'
                  ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  : "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-100 dark:border-cyan-800/50 dark:shadow-[0_0_15px_rgba(8,145,178,0.15)]"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" /> : <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
              </div>

              {/* Message Content */}
              <div className={clsx(
                "flex-1 max-w-[85%] rounded-2xl p-5 sm:p-6 text-base sm:text-[17px] leading-relaxed shadow-sm",
                m.role === 'user'
                  ? "bg-zinc-100 text-zinc-900 rounded-tr-none border border-zinc-200"
                  : "bg-white text-zinc-800 rounded-tl-none border border-zinc-100 shadow-inner-sm"
              )}>
                {/* Reasoning Part */}
                {m.parts?.some((p: any) => p.type === 'reasoning') && (
                  <div className="mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-sm text-zinc-500 font-mono leading-relaxed italic">
                    <div className="flex items-center gap-2 mb-3 text-cyan-600/70 uppercase tracking-widest font-black text-[10px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Thinking Process</span>
                    </div>
                    {m.parts
                      .filter((p: any) => p.type === 'reasoning')
                      .map((p: any) => p.text)
                      .join('')}
                  </div>
                )}

                <div className="prose prose-zinc max-w-none break-words font-medium">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        return !inline ? (
                          <CodeBlock className={className} {...props}>{children}</CodeBlock>
                        ) : (
                          <code className="bg-zinc-100 px-2 py-0.5 rounded text-cyan-700 text-[13px] font-mono border border-zinc-200/50 font-bold" {...props}>{children}</code>
                        )
                      }
                    }}
                  >
                    {m.parts
                      ? m.parts
                        .filter((p: any) => p.type === 'text')
                        .map((p: any) => p.text)
                        .join('')
                      : m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(status === 'submitted' || status === 'streaming') && (
          <div className="flex gap-4 sm:gap-6 animate-pulse">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
              <Sparkles className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="space-y-2 flex-1 pt-2">
              <div className="h-4 bg-zinc-100 rounded w-24" />
              <div className="h-4 bg-zinc-100/50 rounded w-full max-w-md" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-zinc-200 bg-white/80 backdrop-blur-md">
        <form
          onSubmit={handleFormSubmit}
          className="relative group max-w-4xl mx-auto"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Input instructions to parse reality..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-5 pl-7 pr-16 text-base text-zinc-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/10 transition-all placeholder:text-zinc-400 font-medium"
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-100 disabled:text-zinc-400 text-white transition-all shadow-md hover:shadow-cyan-100 disabled:shadow-none flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-4 flex justify-center items-center gap-4 text-[11px] text-zinc-500 font-mono uppercase tracking-[0.25em] font-bold">
          <span>Algorithm is Power</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 rotate-45" />
          <span>Data is Truth</span>
        </div>
      </div>
    </div>
  );
}

// Simple Helper for Code Blocks
function CodeBlock({ className, children, ...props }: any) {
  return (
    <pre className={clsx("relative group rounded-xl my-6 bg-[#1a1a2e] border border-zinc-200 shadow-sm overflow-x-auto p-5", className)} {...props}>
      <code className="font-mono text-[13px] text-cyan-100 leading-relaxed">{children}</code>
    </pre>
  );
}
