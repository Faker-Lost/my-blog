import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs, getSeriesNeighbors, generateSlug } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';
import Giscus from '@/components/Giscus';
import ReadingProgress from '@/components/ReadingProgress';
import CodeBlockCopy from '@/components/CodeBlockCopy';
import { NavigationItem } from '@/components/SeriesNavigation';
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

  // 获取专栏相邻文章
  const { prev, next } = getSeriesNeighbors(post);

  return (
    <>
      {/* 阅读进度条 */}
      <ReadingProgress />

      {/* 代码块复制功能 (Client Component) */}
      <CodeBlockCopy />

      <div className="max-w-6xl mx-auto px-6 py-12 page-transition">
        <div className="flex gap-12">
          {/* 主内容区 */}
          <article className="flex-1 max-w-3xl">
            {/* 文章头部 */}
            <header className="mb-8">
              {/* 面包屑导航 */}
              <nav
                className="flex items-center flex-wrap gap-2 text-sm text-[var(--muted)] mb-8"
                aria-label="Breadcrumb"
              >
                <Link
                  href="/"
                  className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  首页
                </Link>

                <svg className="w-3 h-3 opacity-40 transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>

                {post.series ? (
                  <>
                    <span className="opacity-60">专栏</span>
                    <svg className="w-3 h-3 opacity-40 transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link
                      href={post.seriesSlug ? `/series/${post.seriesSlug}` : '#'}
                      className="hover:text-[var(--foreground)] transition-colors font-medium border-b border-transparent hover:border-[var(--muted)]"
                    >
                      {post.series}
                    </Link>
                  </>
                ) : (
                  <span className="opacity-60">文章</span>
                )}
              </nav>

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

                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>预计阅读 {post.readingTime}</span>
                </div>

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

            {/* 专栏章节导航 */}
            {post.series && (
              <nav className="mt-12 pt-8 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    专栏：{post.series}
                  </h3>
                  <Link
                    href={`/series/${post.seriesSlug || generateSlug(post.series)}`}
                    className="ml-auto text-sm text-[var(--muted)] hover:text-[var(--accent)]
                            transition-colors flex items-center gap-1"
                  >
                    查看完整专栏
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <NavigationItem post={prev} type="prev" />
                  <NavigationItem post={next} type="next" />
                </div>
              </nav>
            )}

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
    </>
  );
}
