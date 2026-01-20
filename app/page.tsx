import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Search from '@/components/Search';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 page-transition">
      {/* 头部介绍区域 */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
          欢迎来到墨迹笔记
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          在这里，我记录技术探索的足迹，分享项目实践的心得，偶尔也写些生活感悟。
          愿这些文字能为你带来一些启发。
        </p>
      </section>

      {/* 搜索框 */}
      <section className="flex justify-center mb-12">
        <Search posts={posts} />
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          最新文章
        </h2>

        {posts.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--muted)]">暂无文章，敬请期待...</p>
          </div>
        )}
      </section>
    </div>
  );
}
