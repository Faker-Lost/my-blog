import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

interface ArchivePageProps {
  params: Promise<{ year: string; month: string }>;
}

// 生成静态路由参数
export async function generateStaticParams() {
  const posts = getAllPosts();
  const yearMonthMap = new Map<string, Set<string>>();

  posts.forEach((post) => {
    if (!post.date) return;

    const date = new Date(post.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // "01", "02"...

    if (!yearMonthMap.has(year)) {
      yearMonthMap.set(year, new Set());
    }
    yearMonthMap.get(year)!.add(month);
  });

  const params: Array<{ year: string; month: string }> = [];
  yearMonthMap.forEach((months, year) => {
    months.forEach((month) => {
      params.push({ year, month });
    });
  });

  return params;
}

// 生成页面元数据
export async function generateMetadata({
  params,
}: ArchivePageProps): Promise<Metadata> {
  const { year, month } = await params;
  // 将数字月份转换为中文月份名用于显示
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const monthName = monthNames[parseInt(month) - 1] || month;

  return {
    title: `${year}年${monthName} - 文章归档`,
    description: `浏览${year}年${monthName}发布的所有文章`,
  };
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { year, month } = await params;
  const allPosts = getAllPosts();

  // 将数字月份转换为中文月份名用于显示
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const monthName = monthNames[parseInt(month) - 1] || month;

  // 筛选指定年月的文章
  const posts = allPosts.filter((post) => {
    if (!post.date) return false;

    const date = new Date(post.date);
    const postYear = date.getFullYear().toString();
    const postMonth = (date.getMonth() + 1).toString().padStart(2, '0');

    return postYear === year && postMonth === month;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 page-transition">
      <header className="mb-8">
        {/* 返回首页 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[var(--muted)]
                     hover:text-[var(--foreground)] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回首页
        </Link>

        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-[var(--accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {year}年{monthName}
        </h1>
        <p className="text-[var(--muted)]">
          共 {posts.length} 篇文章
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="divide-y divide-[var(--border)]">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--muted)] py-12">
          该月份暂无文章
        </p>
      )}
    </div>
  );
}
