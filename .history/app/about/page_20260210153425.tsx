import { Metadata } from 'next';
import AutoGlitchText from '@/components/AutoGlitchText';

export const metadata: Metadata = {
  title: '关于 | Faker :: Lost',
  description: 'Code is Reality. Reality is Fake. 在代码构建的现实与现实本身的虚构之间，记录一切。',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 page-transition">
      {/* Hero — 核心 slogan 作为页面灵魂 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-[var(--foreground)] mb-6">
          <AutoGlitchText text="Code is Reality." glitchInterval={5000} glitchDuration={400} />
        </h1>
        <p className="text-2xl md:text-3xl font-mono text-[var(--muted)] mb-6">
          Reality is <span className="text-[var(--accent)] font-semibold">Fake</span>.
        </p>
        <div className="inline-block px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-sm text-[var(--muted)] font-mono">
          <span className="text-[var(--accent)]">&gt;</span> 这不只是一句标语，这是这里一切的起点<span className="animate-pulse">_</span>
        </div>
      </section>

      <article className="prose">
        {/* 核心哲学展开 */}
        <p>
          我们每天用代码构建系统、界面、世界——这些东西足够真实，
          真实到用户信赖它、依赖它、生活在其中。
          <strong>代码创造了现实。</strong>
        </p>
        <p>
          但退一步想：如果代码可以从无到有地"伪造"出一个现实，
          那我们习以为常的那个"真实世界"，又有多少是被构造出来的？
          <strong>现实本身，也许也是一种伪造。</strong>
        </p>
        <p>
          <strong className="text-[var(--accent)]">Faker :: Lost</strong> 就诞生在这个想法里——
          <strong>Faker</strong>，不是骗子，是创造者，是用代码伪造现实的人；
          <strong>Lost</strong>，是在真与假的边界上迷失、探索、不断追问的状态。
        </p>

        <h2>// 这个博客在做什么</h2>

        <p>
          既然真假的边界本就模糊，那不如把思考过程公开，
          让每一篇文章成为一次对"现实"的拆解与重建：
        </p>

        <ul>
          <li><strong>技术深潜</strong> — 深入底层原理，看看代码如何构造我们眼中的"真实"</li>
          <li><strong>工程实践</strong> — 真实项目中踩过的坑，每一个 bug 都是现实对伪造的反击</li>
          <li><strong>读书 & 学习笔记</strong> — 用别人的视角重新审视自己的认知框架</li>
          <li><strong>随想</strong> — 偶尔跳出代码，想想代码之外的事</li>
        </ul>

        <blockquote>
          我们用代码构建世界的方式，和我们建造城市一样——
          在时间中，没有规划，在废墟之上。
        </blockquote>

        <h2>// system.specs</h2>

        <p>
          这个站点本身也是一次"伪造"——用代码从零构建的一个空间：
        </p>

        <ul>
          <li><strong>Next.js 16</strong> — App Router，React Server Components</li>
          <li><strong>TypeScript</strong> — 类型即文档</li>
          <li><strong>Tailwind CSS v4</strong> — 原子化 CSS，快速迭代</li>
          <li><strong>Markdown + Remark</strong> — 内容驱动，纯文本至上</li>
          <li><strong>Vercel</strong> — 部署在边缘节点，毫秒级响应</li>
        </ul>

        <p className="text-sm text-[var(--muted)] font-mono">
          源码完全开源，欢迎 fork & star。
        </p>

        <h2>// network.connect()</h2>

        <p>
          如果你也在思考类似的问题，或者只是想聊聊：
        </p>

        <ul>
          <li>
            <strong>GitHub</strong>:{' '}
            <a href="https://github.com/Faker-Lost" target="_blank" rel="noopener noreferrer">
              @Faker-Lost
            </a>
          </li>
          <li>
            <strong>Email</strong>:{' '}
            <a href="mailto:1348098935@qq.com">1348098935@qq.com</a>
          </li>
        </ul>

        <hr />

        <p className="text-center text-[var(--muted)] font-mono text-sm">
          Code is Reality. Reality is Fake.<br />
          欢迎来到这场关于真实与虚构的实验。
        </p>
      </article>
    </div>
  );
}
