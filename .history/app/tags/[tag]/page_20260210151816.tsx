import Link from 'next/link';
import { Metadata } from 'next';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// 生成静态路由参数
export async function generateStaticParams() {
  const tags = getAllTags();
  // Next.js 会自动对参数进行 URL 编码，所以这里直接返回原始标签名
  return tags.map((tag) => ({
    tag: tag.name
  }));
}

// 生成页面元数据
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  // 使用单重解码来匹配标签云的单重编码
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `标签: ${decodedTag}`,
    description: `查看所有标签为"${decodedTag}"的文章`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  // 使用单重解码来匹配标签云的单重编码
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 page-transition">
      <header className="mb-8">
        {/* 返回标签页 */}
        <Link
          href="/tags"
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
          返回标签
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          {decodedTag}
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
          该标签下暂无文章
        </p>
      )}
    </div>
  );
}
