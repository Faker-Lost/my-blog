'use client';

import AIChat from '@/components/ai/AIChat';
import AISidebar from '@/components/ai/AISidebar';

export default function AIStudioPage() {
  return (
    <div className="flex w-full h-full">
      {/* 侧边栏 */}
      <AISidebar />

      {/* 主对话区 */}
      <section className="flex-1 h-full relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#050508]">
        <AIChat />
      </section>
    </div>
  );
}
