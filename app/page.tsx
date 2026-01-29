import { getAllPosts, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Search from '@/components/Search';
import TagCloudCard from '@/components/TagCloudCard';
import ArchiveCard from '@/components/ArchiveCard';
import SeriesCard from '@/components/SeriesCard';

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  // 分离精选文章和普通文章
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
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

      {/* 主内容区：左侧文章，右侧侧边栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：文章列表 */}
        <div className="lg:col-span-2">
          {/* 精选文章 */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                精选文章
              </h2>
              <div className="divide-y divide-[var(--border)]">
                {featuredPosts.map((post) => (
                  <PostCard key={post.slug} post={post} featured />
                ))}
              </div>
            </section>
          )}

          {/* 最新文章 */}
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

            {regularPosts.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {regularPosts.map((post) => (
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

        {/* 右侧：侧边栏 */}
        <aside className="space-y-6">
          {/* 专栏卡片 */}
          <SeriesCard />

          {/* 标签云卡片 */}
          <TagCloudCard tags={tags} />

          {/* 文章归档卡片 */}
          <ArchiveCard posts={posts} />
        </aside>
      </div>
    </div>
  );
}
