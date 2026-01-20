import Link from 'next/link';

interface TagCloudCardProps {
  tags: Array<{ name: string; count: number }>;
}

export default function TagCloudCard({ tags }: TagCloudCardProps) {
  // 限制显示数量，取前15个
  const displayTags = tags.slice(0, 15);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        热门标签
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="group px-3 py-1.5 text-sm bg-[var(--background)] border border-[var(--border)]
                       rounded-md hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-all"
          >
            <span className="text-[var(--foreground)]">{tag.name}</span>
            <span className="ml-1.5 text-xs text-[var(--muted)] group-hover:text-[var(--accent)]">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
      {tags.length > 15 && (
        <Link
          href="/tags"
          className="block mt-4 text-sm text-[var(--muted)] hover:text-[var(--accent)]
                     text-center transition-colors"
        >
          查看全部 {tags.length} 个标签 →
        </Link>
      )}
    </div>
  );
}
