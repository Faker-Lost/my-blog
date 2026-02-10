import { getAllPosts, getAllSeries } from '@/lib/posts';
import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.emoji-blog.cn';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const series = getAllSeries();

  // 1. 静态基础页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/archive`, // 新增归档页
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/series`, // 专栏列表页
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tags`, // 标签页
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`, // 关于页
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. 所有文章页面
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const, // 文章一般不常改，monthly 比较合适
    priority: 0.7, // 文章权重通常比首页低一点
  }));

  // 3. 所有专栏页面
  const seriesPages: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${SITE_URL}/series/${s.slug}`,
    lastModified: new Date(), // 专栏只要有新文章就会变，这里简单取当前时间
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...seriesPages];
}
