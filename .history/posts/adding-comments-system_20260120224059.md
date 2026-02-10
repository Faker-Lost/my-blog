---
title: 为 Next.js 博客添加评论系统
date: 2025-01-23
excerpt: 详细介绍如何为 Next.js 博客集成多种评论系统，包括 Disqus、Giscus、自建评论系统等方案。
tags:
  - Next.js
  - 评论系统
  - Disqus
  - GitHub Issues
  - 教程
---

# 为 Next.js 博客添加评论系统

评论系统是博客的重要组成部分，它能增强读者互动，提升用户参与度。本篇文章将介绍多种为 Next.js 博客添加评论系统的方案。

## 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Disqus | 功能完整、免费、简单 | 广告、加载慢、需梯子 | 面向国际用户 |
| Giscus | 免费、无广告、基于 GitHub | 需要 GitHub 账户 | 技术博客 |
| Waline | 中文友好、功能丰富 | 需要服务器 | 企业博客 |
| 自建 | 完全可控、定制性强 | 开发维护成本高 | 有技术团队 |

## 方案一：Disqus 评论系统

### 1. 注册 Disqus 账号

访问 [disqus.com](https://disqus.com) 注册账号，并创建站点。

### 2. 安装 Disqus

创建 `components/Disqus.tsx` 组件：

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface DisqusConfig {
  url: string;
  identifier: string;
  title: string;
}

export default function Disqus({ url, identifier, title }: DisqusConfig) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.disqus_config = function () {
        this.page.url = url;
        this.page.identifier = identifier;
        this.page.title = title;
      };

      // 创建评论脚本
      const script = document.createElement('script');
      script.src = 'https://your-disqus-shortname.disqus.com/embed.js';
      script.setAttribute('data-timestamp', Date.now().toString());
      (document.head || document.body).appendChild(script);
    }
  }, [url, identifier, title]);

  return (
    <div>
      <div ref={commentsRef} id="disqus_thread" />
      <noscript>
        请启用 JavaScript 以查看
        <a href="https://disqus.com/?ref_noscript">
          评论系统
        </a>
      </noscript>
    </div>
  );
}
```

### 3. 在文章页面集成

```tsx
// app/posts/[slug]/page.tsx
import Disqus from '@/components/Disqus';

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  return (
    <>
      {/* 文章内容 */}
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* 评论系统 */}
      <Disqus
        url={`https://yourblog.com/posts/${slug}`}
        identifier={slug}
        title={post.title}
      />
    </>
  );
}
```

## 方案二：Giscus 评论系统（推荐）

Giscus 基于 GitHub Discussions，免费无广告，适合技术博客。

### 1. 安装 Giscus App

访问 [giscus.app](https://giscus.app) 并授权安装。

### 2. 创建组件

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface GiscusConfig {
  repo: string;          // e.g., "username/repo"
  repoId: string;       // 从 giscus.app 获取
  category: string;      // Discussions 分类
  categoryId: string;    // 从 giscus.app 获取
  mapping: 'pathname' | 'url' | 'title' | 'og:title';
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: 'top' | 'bottom';
  theme: 'light' | 'dark' | 'preferred_color_scheme';
  lang: string;
  loading: string;
}

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = 'bottom',
  theme = 'preferred_color_scheme',
  lang = 'zh-CN',
  loading = 'lazy',
}: GiscusConfig) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', emitMetadata ? '1' : '0');
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-loading', loading);
    script.async = true;

    commentsRef.current?.appendChild(script);
  }, [repo, repoId, category, categoryId, mapping, reactionsEnabled, emitMetadata, inputPosition, theme, lang, loading]);

  return (
    <div className="giscus" ref={commentsRef} />
  );
}
```

### 3. 使用示例

```tsx
<Giscus
  repo="username/repo"
  repoId="YOUR_REPO_ID"
  category="General"
  categoryId="YOUR_CATEGORY_ID"
  mapping="pathname"
  theme="preferred_color_scheme"
/>
```

## 方案三：Waline 评论系统

Waline 是基于 Valine 改进的评论系统，支持 Serverless 部署。

### 1. 部署到 Vercel

使用官方模板一键部署：[GitHub 仓库](https://github.com/walinejs/waline/tree/main/examples/vercel)

### 2. 安装依赖

```bash
npm install @waline/client
```

### 3. 创建组件

```tsx
'use client';

import { useEffect, useRef } from 'react';
import type { WalineConfig } from '@waline/client';

interface WalineCommentProps {
  serverURL: string;  // 你的 Waline 服务地址
  path: string;
  lang?: string;
}

export default function WalineComment({
  serverURL,
  path,
  lang = 'zh-CN',
}: WalineCommentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initWaline = async () => {
      const { default: Waline } = await import('@waline/client');

      const waline = Waline.init({
        el: containerRef.current!,
        serverURL,
        path,
        lang,
        dark: 'auto',
        commentCount: {
          type: 'valine',
        },
        pageview: true,
      });
    };

    initWaline();
  }, [serverURL, path, lang]);

  return <div ref={containerRef} />;
}
```

### 4. 使用示例

```tsx
<WalineComment
  serverURL="https://your-waline.vercel.app"
  path="/posts/slug"
/>
```

## 方案四：自建评论系统

### 1. 数据库设计

使用 Prisma + SQLite：

```prisma
// prisma/schema.prisma
model Comment {
  id        String   @id @default(cuid())
  postSlug  String
  author    String
  email     String
  content   String
  createdAt DateTime @default(now())
  approved  Boolean  @default(false)

  @@index([postSlug])
}
```

### 2. API 路由

```ts
// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get('postSlug');

  const comments = await prisma.comment.findMany({
    where: {
      postSlug,
      approved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postSlug, author, email, content } = body;

  const comment = await prisma.comment.create({
    data: {
      postSlug,
      author,
      email,
      content,
    },
  });

  return NextResponse.json(comment);
}
```

### 3. 评论组件

```tsx
'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export default function CustomComments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postSlug=${postSlug}`)
      .then(res => res.json())
      .then(setComments);
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, ...formData }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setFormData({ author: '', email: '', content: '' });
        alert('评论提交成功，待审核后显示！');
      }
    } catch (error) {
      alert('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section mt-12">
      <h3 className="text-xl font-bold mb-4">评论 ({comments.length})</h3>

      {/* 评论列表 */}
      <div className="comments-list space-y-4 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <strong>{comment.author}</strong>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      {/* 发表评论 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="昵称"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="邮箱"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="写下你的评论..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '提交中...' : '发表评论'}
        </button>
      </form>
    </div>
  );
}
```

## 防垃圾评论策略

### 1. 验证码

```tsx
import { useState } from 'react';

function Captcha() {
  const [captcha, setCaptcha] = useState('');
  const [question] = useState(() => Math.floor(Math.random() * 10) + 1);

  return (
    <div>
      <label>
        {question} + 3 = ?
        <input
          type="number"
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          required
        />
      </label>
      <input type="hidden" value={question} name="captchaQuestion" />
    </div>
  );
}
```

### 2. 内容过滤

```ts
// utils/spamFilter.ts
export function isSpam(content: string): boolean {
  const spamPatterns = [
    /http[s]?:\/\//,  // 链接
    /[0-9]{11}/,       // 11位数字（手机号）
    /(免费|赚钱|赌博)/, // 关键词
  ];

  return spamPatterns.some((pattern) => pattern.test(content));
}
```

## 评论管理后台

创建简单的管理界面：

```tsx
// app/admin/comments/page.tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CommentsAdmin() {
  const pendingComments = await prisma.comment.findMany({
    where: { approved: false },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1>评论管理</h1>
      {pendingComments.map((comment) => (
        <div key={comment.id} className="border p-4">
          <h3>{comment.author}</h3>
          <p>{comment.content}</p>
          <form action={`/api/comments/${comment.id}/approve`} method="post">
            <button type="submit">通过审核</button>
          </form>
        </div>
      ))}
    </div>
  );
}
```

## 总结

选择评论系统时需要考虑：

1. **用户群体** - 技术博客推荐 Giscus
2. **维护成本** - 托管服务更省心
3. **功能需求** - 是否需要回复、点赞等
4. **隐私政策** - 评论数据存储位置

对于大多数 Next.js 博客，我推荐使用 **Giscus**，它免费、无广告、加载快，且与 GitHub 完美集成。

## 下一步

考虑添加：
- 评论通知（邮件/微信）
- 评论回复功能
- 评论点赞系统
- 评论热榜排序
