---
title: 如何写博客文章
date: 2025-01-21
excerpt: 介绍如何在本博客系统中添加和发布新文章。
tags:
  - 教程
  - 博客
---

# 如何在本系统上写博客文章

在本博客系统中发布文章非常简单。

## 步骤一：创建 Markdown 文件

在项目的 `posts/` 目录下创建一个 `.md` 文件，文件名会成为 URL 路径。

例如：`my-first-post.md` → 访问地址为 `/posts/my-first-post`

## 步骤二：添加 Frontmatter

每篇文章开头需要包含元信息：

```yaml
---
title: 文章标题
date: 2025-01-21
excerpt: 文章摘要
tags:
  - 标签1
---
```

## 步骤三：编写正文

使用标准 Markdown 语法编写内容，支持：

- **粗体** 和 *斜体*
- 代码块和行内代码
- 表格、列表、引用
- 图片和链接

## 步骤四：发布

保存文件后，推送到 GitHub：

```bash
git add .
git commit -m "add: 新文章"
git push
```

Vercel 会自动部署，新文章即刻上线！
