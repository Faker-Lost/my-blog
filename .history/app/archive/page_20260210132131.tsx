import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import ArchiveCard from '@/components/ArchiveCard';

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
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // 获取排序后的年份列表（倒序）
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 page-transition">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          📦 文章归档
        </h1>
        <p className="text-[var(--muted)]">
          共 {posts.length} 篇文章，记录成长的足迹
        </p>
      </header>

      <div className="space-y-16 relative">
        {/* 左侧时间轴线条 (可选) */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[var(--border)] -z-10 md:left-1/2 transform md:-translate-x-1/2" />

        {years.map((year) => (
          <div key={year} className="relative z-10">
            {/* 年份标签 */}
            <div className="flex justify-center mb-8">
              <span className="bg-[var(--card)] border border-[var(--border)] 
                               px-4 py-1 rounded-full text-xl font-bold 
                               text-[var(--accent)] shadow-sm">
                {year}
              </span>
            </div>

            <div className="grid gap-6">
              {postsByYear[year].map((post) => (
                <ArchiveCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
