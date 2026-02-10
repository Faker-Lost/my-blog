import type { Metadata } from "next";
import ParticleBackground from "@/components/ParticleBackground";

export const metadata: Metadata = {
  title: "AI Studio | Faker :: Lost",
  description: "Faker AI Studio - 基于大模型的代码分析与创意助手",
};

export default function AIStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#050508] text-foreground overflow-hidden font-sans">
      {/* 粒子背景 - 深度较深 */}
      <div className="fixed inset-0 pointer-events-none opacity-30 select-none">
        <ParticleBackground />
      </div>

      {/* 这里的布局逻辑由 page 里的组件控制，
          layout 只提供最基础的容器环境，确保全屏 */}
      <main className="relative z-10 flex w-full h-full overflow-hidden">
        {children}
      </main>

      {/* 简单的全局样式覆盖，确保 ai 频道没有默认的 header/footer 干扰 */}
      <style jsx global>{`
        header, footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
