import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export default function PostCard({ post, featured }: PostCardProps) {
  // 格式化日期
  const formattedDate = post.date
    ? format(new Date(post.date), 'yyyy年M月d日', { locale: zhCN })
    : '';

  return (
    <article
      className={`group border-b border-[var(--border)] py-8 first:pt-0 last:border-b-0
        ${featured ? 'bg-[var(--card)] -mx-4 px-4 rounded-lg border border-[var(--accent)]/30' : ''}
      `}
    >
      <Link href={`/posts/${post.slug}`} className="block">
        {/* 精选标记 */}
        {featured && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            精选文章
          </div>
        )}

        {/* 标题 */}
        <h2
          className={`text-xl font-bold text-[var(--foreground)]
                     group-hover:text-[var(--accent)] transition-colors
                     leading-tight mb-2
                     ${featured ? 'text-lg' : ''}
          `}
        >
          {post.title}
        </h2>

        {/* 摘要 */}
        <p className="text-[var(--muted)] leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
          {/* 日期 */}
          <time dateTime={post.date} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formattedDate}
          </time>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <div className="flex gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[var(--accent)] hover:text-[var(--accent-light)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
