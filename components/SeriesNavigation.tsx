import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface SeriesNavigationProps {
  post: PostMeta;
}

export default function SeriesNavigation({ post }: SeriesNavigationProps) {
  // 如果文章不属于任何专栏，不显示导航
  if (!post.series) {
    return null;
  }

  // 获取相邻文章的逻辑将在文章页面中处理
  // 这里只渲染导航结构
  return (
    <nav className="mt-12 pt-8 border-t border-[var(--border)]">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="font-semibold text-[var(--foreground)]">
          专栏：{post.series}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 上一篇 */}
        <div className="sr-only">
          {/* 占位，实际内容由父组件传入 */}
        </div>

        {/* 下一篇 */}
        <div className="sr-only">
          {/* 占位，实际内容由父组件传入 */}
        </div>
      </div>
    </nav>
  );
}

// 章节导航项组件
interface NavigationItemProps {
  post: PostMeta | null;
  type: 'prev' | 'next';
}

export function NavigationItem({ post, type }: NavigationItemProps) {
  if (!post) {
    return (
      <div className={`p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg opacity-50`}>
        <div className="text-sm text-[var(--muted)] mb-1">
          {type === 'prev' ? '上一篇' : '下一篇'}
        </div>
        <div className="text-[var(--muted)]">无</div>
      </div>
    );
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg
                  hover:border-[var(--accent)] hover:shadow-md transition-all
                  ${type === 'next' ? 'text-right' : ''}`}
    >
      <div className="text-sm text-[var(--muted)] mb-1">
        {type === 'prev' ? '上一篇' : '下一篇'}
      </div>
      <div className="font-medium text-[var(--foreground)] line-clamp-2">
        {post.title}
      </div>
    </Link>
  );
}
