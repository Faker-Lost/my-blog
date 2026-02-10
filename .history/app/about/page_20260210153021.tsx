import { Metadata } from 'next';
import AutoGlitchText from '@/components/AutoGlitchText';

export const metadata: Metadata = {
  title: '关于 | Faker :: Lost',
  description: '在比特流中迷失自我，在伪造中寻找真理。',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 page-transition">
      {/* Hero 区域 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-[var(--foreground)] mb-4">
          <AutoGlitchText text="whoami" glitchInterval={5000} glitchDuration={400} />
        </h1>
        <div className="inline-block px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-sm text-[var(--muted)] font-mono">
          <span className="text-[var(--accent)]">&gt;</span> 一个在数字世界里建造的人<span className="animate-pulse">_</span>
        </div>
      </section>

      <article className="prose">
        {/* 自我介绍 */}
        <p>
          你好，我是 <strong className="text-[var(--accent)]">Faker :: Lost</strong>。
        </p>
        <p>
          一个相信代码可以重塑现实的开发者。我在真实与虚构的边界上写代码、做项目、记录思考。
          这里没有精心包装的人设，只有一个不断学习、不断推翻自己认知的普通人。
        </p>

        <h2>// README.md</h2>

        <p>
          这个博客是我的<strong>数字花园</strong>——一个公开的思维实验场。
          我会在这里种下各种想法，看看哪些能长成有用的东西：
        </p>

        <ul>
          <li><strong>技术深潜</strong> — 深入底层原理，不止于 API 调用</li>
          <li><strong>工程实践</strong> — 真实项目中踩过的坑与填坑指南</li>
          <li><strong>读书 & 学习笔记</strong> — 把别人的智慧消化成自己的</li>
          <li><strong>随想</strong> — 偶尔跳出代码，想想代码之外的事</li>
        </ul>

        <blockquote>
          "We build our computer systems the way we build our cities: over time, without a plan, on top of ruins."
          <br />— Ellen Ullman
        </blockquote>

        <h2>// system.specs</h2>

        <p>
          这个站点本身也是一个作品。它的技术栈：
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
          如果你想聊技术、提建议、或者只是打个招呼：
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
          感谢你来到这里。
        </p>
      </article>
    </div>
  );
}
