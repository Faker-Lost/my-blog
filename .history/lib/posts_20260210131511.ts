import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// 博客文章存放目录
const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * 递归扫描 posts 目录及子目录，获取所有 Markdown 文件
 * @param dir 要扫描的目录
 * @param baseDir 基础目录（用于计算相对路径）
 * @returns 所有 .md 文件的完整路径数组
 */
function getAllMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 递归扫描子目录
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// 文章元数据类型定义
export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  featured?: boolean; // 是否为精选文章
  series?: string; // 所属专栏（显示名称，支持中文）
  seriesSlug?: string; // 专栏 URL slug（纯 ASCII，可选）
  seriesOrder?: number; // 在专栏中的章节顺序
  readingTime: string; // 预计阅读时间
}

// 完整文章类型（含内容）
export interface Post extends PostMeta {
  content: string;
  headings: Heading[];
}

// 专栏类型定义
export interface Series {
  name: string;
  slug: string;
  count: number;
  description?: string;
}

// 专栏详情类型
export interface SeriesDetail extends Series {
  posts: PostMeta[];
}

// 目录标题类型
export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * 获取所有文章的元数据（用于列表展示）
 * 按日期倒序排列
 */
export function getAllPosts(): PostMeta[] {
  // 确保 posts 目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 递归扫描所有 Markdown 文件
  const allFiles = getAllMarkdownFiles(postsDirectory);
  const allPosts = allFiles.map((fullPath) => {
    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      featured: data.featured || false,
      series: data.series,
      seriesSlug: data.seriesSlug,
      seriesOrder: data.seriesOrder,
      readingTime: `${Math.ceil(matter(fileContents).content.replace(/\s/g, '').length / 400)} 分钟`,
    } as PostMeta;
  });

  // 按日期倒序排列
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 根据 slug 获取单篇文章的完整内容
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // 递归查找匹配 slug 的文件
    const allFiles = getAllMarkdownFiles(postsDirectory);
    const targetFile = allFiles.find(
      (file) => path.basename(file, '.md') === slug
    );

    if (!targetFile) {
      return null;
    }

    const fileContents = fs.readFileSync(targetFile, 'utf8');
    const { data, content } = matter(fileContents);

    // 提取标题生成目录
    const headings = extractHeadings(content);

    // 将 Markdown 转换为 HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);

    let htmlContent = processedContent.toString();

    // 为标题添加 id 属性（用于锚点导航）
    htmlContent = addHeadingIds(htmlContent);

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      featured: data.featured || false,
      series: data.series,
      seriesSlug: data.seriesSlug,
      seriesOrder: data.seriesOrder,
      readingTime: `${Math.ceil(content.replace(/\s/g, '').length / 400)} 分钟`,
      content: htmlContent,
      headings,
    };
  } catch {
    return null;
  }
}

/**
 * 获取所有标签及其文章数量
 */
export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 根据标签获取文章
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * 搜索文章（标题和摘要）
 */
export function searchPosts(query: string): PostMeta[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return getAllPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * 从 Markdown 内容中提取标题
 */
function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * 为 HTML 中的标题添加 id 属性
 */
function addHeadingIds(html: string): string {
  return html.replace(
    /<h([1-6])>(.+?)<\/h[1-6]>/g,
    (_, level, text) => {
      const id = text
        .replace(/<[^>]+>/g, '') // 移除 HTML 标签
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '');
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );
}

/**
 * 获取所有文章的 slug（用于静态生成）
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 递归扫描所有 Markdown 文件，返回 slug（仅文件名）
  return getAllMarkdownFiles(postsDirectory).map((file) =>
    path.basename(file, '.md')
  );
}

/**
 * 生成 URL 友好的 slug
 */
export function generateSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 获取所有专栏
 */
export function getAllSeries(): Series[] {
  const posts = getAllPosts();
  const seriesMap = new Map<string, { count: number; description?: string; seriesSlug?: string }>();

  posts.forEach((post) => {
    if (post.series) {
      const existing = seriesMap.get(post.series);
      if (existing) {
        existing.count++;
        // 优先使用已有的 seriesSlug
        if (!existing.seriesSlug && post.seriesSlug) {
          existing.seriesSlug = post.seriesSlug;
        }
      } else {
        seriesMap.set(post.series, { count: 1, seriesSlug: post.seriesSlug });
      }
    }
  });

  return Array.from(seriesMap.entries()).map(([name, data]) => ({
    name,
    slug: data.seriesSlug || generateSlug(name),
    count: data.count,
    description: data.description,
  }));
}

/**
 * 根据专栏 slug 获取专栏详情
 */
export function getSeriesBySlug(slug: string): SeriesDetail | null {
  const posts = getAllPosts();
  const series = getAllSeries().find((s) => s.slug === slug);

  if (!series) return null;

  const seriesPosts = posts
    .filter((post) => post.series === series.name)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

  return {
    ...series,
    posts: seriesPosts,
  };
}

/**
 * 根据专栏名称获取文章
 */
export function getPostsBySeries(seriesName: string): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.series === seriesName)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

/**
 * 获取文章在专栏中的相邻文章
 */
export function getSeriesNeighbors(post: PostMeta): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  if (!post.series) {
    return { prev: null, next: null };
  }

  const seriesPosts = getPostsBySeries(post.series);
  const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug);

  return {
    prev: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
  };
}

/**
 * 分页数据类型
 */
export interface PaginatedPostsResult {
  posts: PostMeta[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

/**
 * 获取分页文章（不含精选文章）
 * @param page 页码（从1开始）
 * @param limit 每页数量
 */
export function getPaginatedPosts(
  page: number = 1,
  limit: number = 10
): PaginatedPostsResult {
  const allPosts = getAllPosts();
  // 排除精选文章
  const regularPosts = allPosts.filter((post) => !post.featured);
  const totalPosts = regularPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);

  // 验证页码范围
  if (page < 1) page = 1;
  if (page > totalPages && totalPages > 0) page = totalPages;

  // 计算切片范围
  const start = (page - 1) * limit;
  const end = start + limit;
  const posts = regularPosts.slice(start, end);

  return {
    posts,
    totalPages,
    currentPage: page,
    totalPosts,
  };
}
