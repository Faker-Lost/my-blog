import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';
import Giscus from '@/components/Giscus';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// 生成静态路由参数
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 生成页面元数据
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: '文章未找到' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.date
    ? format(new Date(post.date), 'yyyy年M月d日', { locale: zhCN })
    : '';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 page-transition">
      <div className="flex gap-12">
        {/* 主内容区 */}
        <article className="flex-1 max-w-3xl">
          {/* 文章头部 */}
          <header className="mb-8">
            {/* 返回链接 */}
            <Link
              href="/"
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
              返回首页
            </Link>

            {/* 标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] leading-tight mb-4">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
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
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="px-2 py-0.5 bg-[var(--card)] border border-[var(--border)]
                                   rounded text-[var(--accent)] hover:border-[var(--accent)]
                                   transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* 文章正文 */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 评论系统 */}
          <Giscus />

          {/* 底部分隔 */}
          <footer className="mt-12 pt-8 border-t border-[var(--border)]">
            <p className="text-center text-[var(--muted)] text-sm">
              感谢阅读！如有任何问题或建议，欢迎交流。
            </p>
          </footer>
        </article>

        {/* 侧边目录 - 仅在大屏幕显示 */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
