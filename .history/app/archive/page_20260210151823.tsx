import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

/**
 * 归档页面 /archive
 * 展示所有年份的文章归档列表 (时间轴)
 */
export const metadata = {
  title: '文章归档',
  description: '所有文章的时间轴归档',
};

export default function ArchivePage() {
  const posts = getAllPosts();

  // 按照年份分组文章
  const postsByYear = posts.reduce((acc, post) => {
    // 处理日期格式，兼容 ISO 字符串
    const date = new Date(post.date);
    if (isNaN(date.getTime())) return acc; // 跳过无效日期

    const year = date.getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // 获取排序后的年份列表（倒序）
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 page-transition">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          📦 文章归档
        </h1>
        <p className="text-[var(--muted)]">
          共 {posts.length} 篇文章，记录成长的足迹
        </p>
      </header>

      {/* 归档主内容 */}
      <div className="relative">
        {/* 左侧贯穿线条 */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[var(--border)] -z-10" />

        <div className="space-y-16">
          {years.map((year) => (
            <div key={year} className="relative">
              {/* 年份大标签 */}
              <div className="flex items-center mb-8">
                <span className="bg-[var(--card)] border border-[var(--border)] 
                                 px-4 py-1 rounded-full text-2xl font-bold 
                                 text-[var(--accent)] shadow-sm z-10">
                  {year}
                </span>
                <span className="ml-4 text-sm text-[var(--muted)]">
                  {postsByYear[year].length} 篇
                </span>
              </div>

              {/* 文章列表 */}
              <div className="space-y-8 pl-10">
                {postsByYear[year].map((post) => (
                  <div key={post.slug} className="group relative">
                    {/* 时间轴节点 */}
                    <div className="absolute -left-[27px] top-2.5 w-3 h-3 rounded-full bg-[var(--border)] 
                                      group-hover:bg-[var(--accent)] group-hover:scale-125 transition-all duration-300
                                      border-2 border-[var(--background)] ring-4 ring-[var(--background)] z-10" />

                    <article className="bg-[var(--card)]/50 p-4 rounded-lg hover:bg-[var(--card)] transition-colors border border-transparent hover:border-[var(--border)]">
                      <Link href={`/posts/${post.slug}`} className="block group-hover:-translate-x-1 transition-transform">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                          <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                            {post.title}
                          </h3>
                          <time className="text-sm font-mono text-[var(--muted)] whitespace-nowrap">
                            {new Date(post.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                          </time>
                        </div>

                        {post.excerpt && (
                          <p className="text-sm text-[var(--muted)] line-clamp-2 opacity-80">
                            {post.excerpt}
                          </p>
                        )}

                        {/* 元信息：标签和阅读时间 */}
                        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted)] opacity-60">
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>🏷️</span>
                              <span>{post.tags.slice(0, 3).join(', ')}</span>
                            </div>
                          )}
                          {post.readingTime && (
                            <span>⏱️ {post.readingTime}</span>
                          )}
                        </div>
                      </Link>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
