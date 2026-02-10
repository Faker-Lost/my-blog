import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Search from '@/components/Search';

/**
 * 自定义 404 页面
 * 提供更友好的错误提示和导航引导
 */
export default function NotFound() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 py-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
      </div>

      {/* 巨大的 404 文字 */}
      <div className="relative">
        <h1 className="text-[150px] font-black text-[var(--border)] leading-none select-none opacity-20 dark:opacity-10 scale-150 transform translate-y-10">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-bounce filter drop-shadow-lg">🛸</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4 text-[var(--foreground)] mt-8">
        页面竟然消失了！
      </h2>

      <p className="text-[var(--muted)] mb-10 max-w-md text-lg leading-relaxed">
        看来你访问的页面进入了异次元空间，或者被我还没写的代码吞噬了。
        <br />
        试着搜索看看？
      </p>

      {/* 搜索框 */}
      <div className="w-full max-w-md mb-12 transform hover:scale-105 transition-transform duration-300">
        <div className="bg-[var(--card)] p-2 rounded-xl shadow-lg border border-[var(--border)]">
          <Search posts={posts} />
        </div>
      </div>

      {/* 导航按钮组 */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-[var(--accent)] text-white font-medium 
                     hover:opacity-90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                     flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          返回首页
        </Link>

        <Link
          href="/archive"
          className="px-8 py-3 rounded-full bg-[var(--card)] text-[var(--foreground)] font-medium
                     border border-[var(--border)]
                     hover:bg-[var(--border)] hover:-translate-y-1 transition-all duration-300
                     flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          查看归档
        </Link>
      </div>

      <p className="mt-16 text-sm text-[var(--muted)] opacity-60">
        错误代码：EST0404 • 空间折叠异常
      </p>
    </div>
  );
}
