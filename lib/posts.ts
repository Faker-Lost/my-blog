import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// 博客文章存放目录
const postsDirectory = path.join(process.cwd(), 'posts');

// 文章元数据类型定义
export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
}

// 完整文章类型（含内容）
export interface Post extends PostMeta {
  content: string;
  headings: Heading[];
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

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        coverImage: data.coverImage,
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
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
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

  return fs.readdirSync(postsDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}
