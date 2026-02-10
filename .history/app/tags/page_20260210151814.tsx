import Link from 'next/link';
import { getAllTags } from '@/lib/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '标签',
  description: '浏览所有文章标签',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 page-transition">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          标签云
        </h1>
        <p className="text-[var(--muted)]">
          共 {tags.length} 个标签，点击标签查看相关文章
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="group px-4 py-2 bg-[var(--card)] border border-[var(--border)]
                         rounded-lg hover:border-[var(--accent)] hover:shadow-md
                         transition-all"
            >
              <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {tag.name}
              </span>
              <span className="ml-2 text-sm text-[var(--muted)]">
                ({tag.count})
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--muted)] py-12">
          暂无标签
        </p>
      )}
    </div>
  );
}
