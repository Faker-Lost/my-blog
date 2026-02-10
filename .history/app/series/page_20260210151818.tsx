import Link from 'next/link';
import { getAllSeries } from '@/lib/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '专栏',
  description: '浏览所有专栏系列',
};

export default function SeriesPage() {
  const series = getAllSeries();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          专栏系列
        </h1>
        <p className="text-[var(--muted)]">
          共 {series.length} 个专栏，按系列学习，循序渐进
        </p>
      </header>

      {series.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {series.map((s) => (
            <Link
              key={s.slug}
              href={`/series/${s.slug}`}
              className="group p-6 bg-[var(--card)] border border-[var(--border)]
                         rounded-lg hover:border-[var(--accent)] hover:shadow-lg
                         transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-[var(--foreground)]
                              group-hover:text-[var(--accent)] transition-colors">
                  {s.name}
                </h2>
                <span className="px-2 py-1 text-xs bg-[var(--accent)] text-white rounded-full">
                  {s.count} 篇
                </span>
              </div>

              {s.description && (
                <p className="text-sm text-[var(--muted)] line-clamp-2">
                  {s.description}
                </p>
              )}

              <div className="mt-4 flex items-center text-sm text-[var(--muted)]
                              group-hover:text-[var(--accent)] transition-colors">
                <span>查看专栏</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1
                              transition-transform" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[var(--muted)]">暂无专栏</p>
        </div>
      )}
    </div>
  );
}
