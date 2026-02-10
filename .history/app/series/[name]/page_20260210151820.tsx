import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeriesBySlug, getAllSeries } from '@/lib/posts';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface SeriesPageProps {
  params: Promise<{
    name: string;
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  const series = getAllSeries();
  return series.map((s) => ({
    name: s.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { name } = await params;
  const series = getSeriesBySlug(name);

  if (!series) {
    return {
      title: '专栏不存在',
    };
  }

  return {
    title: `${series.name} - 专栏`,
    description: series.description || `${series.name} 专栏系列`,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { name } = await params;
  const series = getSeriesBySlug(name);

  if (!series) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 返回链接 */}
      <Link
        href="/series"
        className="inline-flex items-center text-sm text-[var(--muted)]
                  hover:text-[var(--accent)] transition-colors mb-8"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回专栏列表
      </Link>

      {/* 专栏标题 */}
      <header className="mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            {series.name}
          </h1>
          <span className="px-3 py-1 text-sm bg-[var(--accent)] text-white rounded-full">
            {series.count} 篇
          </span>
        </div>

        {series.description && (
          <p className="text-[var(--muted)] text-lg">
            {series.description}
          </p>
        )}
      </header>

      {/* 章节列表 */}
      <div className="space-y-4">
        {series.posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block p-5 bg-[var(--card)] border border-[var(--border)]
                       rounded-lg hover:border-[var(--accent)] hover:shadow-md
                       transition-all"
          >
            <div className="flex items-start gap-4">
              {/* 章节序号 */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center
                              bg-[var(--accent)] text-white rounded-full font-bold text-lg">
                {post.seriesOrder || index + 1}
              </div>

              {/* 文章信息 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--foreground)]
                              group-hover:text-[var(--accent)] transition-colors mb-2">
                  {post.title}
                </h3>

                <p className="text-sm text-[var(--muted)] line-clamp-2 mb-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                  </span>

                  {post.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {post.tags.length} 个标签
                    </span>
                  )}
                </div>
              </div>

              {/* 箭头图标 */}
              <svg className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)]
                              group-hover:translate-x-1 transition-all flex-shrink-0 mt-2"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
