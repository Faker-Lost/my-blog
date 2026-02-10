import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // 允许所有爬虫
      allow: '/',
      disallow: '/api/', // 通常 API 不包括在搜索结果中
    },
    sitemap: 'https://www.emoji-blog.cn/sitemap.xml',
  };
}
