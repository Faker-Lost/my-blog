import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于',
  description: '了解更多关于我和这个博客的信息',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 page-transition">
      <article className="prose">
        <h1>关于我</h1>

        <p>
          你好！欢迎来到我的个人博客——<strong>墨迹笔记</strong>。
        </p>

        <h2>关于这个博客</h2>

        <p>
          这是一个记录技术成长与生活感悟的空间。在这里，我会分享：
        </p>

        <ul>
          <li><strong>技术文章</strong> — 前端、后端、架构设计等技术领域的学习心得</li>
          <li><strong>项目实践</strong> — 实际项目中遇到的问题与解决方案</li>
          <li><strong>读书笔记</strong> — 技术书籍及其他领域的阅读感悟</li>
          <li><strong>生活随笔</strong> — 一些日常思考与感悟</li>
        </ul>

        <h2>技术栈</h2>

        <p>
          这个博客基于以下技术构建：
        </p>

        <ul>
          <li><strong>Next.js 16</strong> — React 服务端渲染框架</li>
          <li><strong>TypeScript</strong> — 类型安全的 JavaScript</li>
          <li><strong>Tailwind CSS</strong> — 实用优先的 CSS 框架</li>
          <li><strong>Markdown</strong> — 文章编写格式</li>
        </ul>

        <h2>联系方式</h2>

        <p>
          如果你有任何问题、建议或只是想打个招呼，欢迎通过以下方式联系我：
        </p>

        <ul>
          <li>
            <strong>GitHub</strong>:{' '}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              @username
            </a>
          </li>
          <li>
            <strong>Email</strong>: your@email.com
          </li>
        </ul>

        <hr />

        <p>
          感谢你花时间阅读，希望这里的内容能对你有所帮助！
        </p>
      </article>
    </div>
  );
}
