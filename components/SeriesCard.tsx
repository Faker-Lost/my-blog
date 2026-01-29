import Link from 'next/link';
import { getAllSeries } from '@/lib/posts';

export default function SeriesCard() {
  const series = getAllSeries();

  if (series.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="font-bold text-[var(--foreground)]">专栏系列</h3>
      </div>

      <div className="space-y-3">
        {series.map((s) => (
          <Link
            key={s.slug}
            href={`/series/${s.slug}`}
            className="flex items-center justify-between group
                      hover:bg-[var(--muted)]/10 rounded-lg px-3 py-2
                      transition-colors"
          >
            <span className="text-sm text-[var(--foreground)]
                          group-hover:text-[var(--accent)] transition-colors">
              {s.name}
            </span>
            <span className="text-xs text-[var(--muted)] bg-[var(--muted)]/10
                          px-2 py-0.5 rounded-full">
              {s.count}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/series"
        className="mt-4 block text-center text-sm text-[var(--muted)]
                  hover:text-[var(--accent)] transition-colors
                  border-t border-[var(--border)] pt-3"
      >
        查看所有专栏 →
      </Link>
    </div>
  );
}
