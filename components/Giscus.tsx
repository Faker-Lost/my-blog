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

interface GiscusProps {
  postSlug: string;
  title: string;
}

export default function Giscus({ postSlug, title }: GiscusProps) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 从 giscus.app 获取这些值
    // 这里使用占位符，用户需要替换为实际值
    const config = {
      repo: 'your-username/your-repo',
      repoId: 'YOUR_REPO_ID',
      category: 'General',
      categoryId: 'YOUR_CATEGORY_ID',
      mapping: 'pathname' as const,
      reactionsEnabled: true,
      emitMetadata: false,
      inputPosition: 'bottom' as const,
      theme: 'preferred_color_scheme',
      lang: 'zh-CN',
      loading: 'lazy',
    };

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId);
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId);
    script.setAttribute('data-mapping', config.mapping);
    script.setAttribute('data-reactions-enabled', config.reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', config.emitMetadata ? '1' : '0');
    script.setAttribute('data-input-position', config.inputPosition);
    script.setAttribute('data-theme', config.theme);
    script.setAttribute('data-lang', config.lang);
    script.setAttribute('data-loading', config.loading);
    script.async = true;

    commentsRef.current?.appendChild(script);
  }, [postSlug, title]);

  return (
    <div className="mt-12 pt-8 border-t border-[var(--border)]">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
        评论区
      </h3>
      <div className="giscus" ref={commentsRef} />

      {/* 配置说明 */}
      <div className="mt-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg">
        <h4 className="font-semibold text-[var(--foreground)] mb-2">💡 如何启用评论</h4>
        <p className="text-sm text-[var(--muted)] mb-3">
          当前评论系统使用 Giscus（基于 GitHub Discussions），需要简单配置才能启用。
        </p>
        <ol className="text-sm text-[var(--muted)] space-y-1 list-decimal list-inside">
          <li>访问 <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">giscus.app</a></li>
          <li>使用 GitHub 登录并授权</li>
          <li>选择你的仓库（需要开启 Discussions）</li>
          <li>复制生成的配置信息</li>
          <li>更新 <code className="bg-[var(--background)] px-1 rounded">components/Giscus.tsx</code> 文件中的配置</li>
        </ol>
        <div className="mt-3 text-xs text-[var(--muted)]">
          <strong>优点：</strong>免费、无广告、基于 GitHub<br/>
          <strong>要求：</strong>GitHub 账号、公开仓库
        </div>
      </div>
    </div>
  );
}
