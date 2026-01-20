'use client';

import Giscus from '@giscus/react';

export default function GiscusComments() {
  // 从 giscus.app 获取的配置
  const config = {
    repo: 'Faker-Lost/my-blog' as `${string}/${string}`,
    repoId: 'R_kgDOQ9iDcg',
    category: 'General',
    categoryId: 'DIC_kwDOQ9iDcs4C1Mig',
    mapping: 'pathname' as const,
    reactionsEnabled: '1' as '0' | '1',
    emitMetadata: '0' as '0' | '1',
    inputPosition: 'bottom' as const,
    theme: 'preferred_color_scheme',
    lang: 'zh-CN',
    loading: 'lazy' as 'lazy' | 'eager',
  };

  return (
    <div className="mt-12 pt-8 border-t border-[var(--border)]">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
        💬 评论区
      </h3>

      <Giscus
        repo={config.repo}
        repoId={config.repoId}
        category={config.category}
        categoryId={config.categoryId}
        mapping={config.mapping}
        reactionsEnabled={config.reactionsEnabled}
        emitMetadata={config.emitMetadata}
        inputPosition={config.inputPosition}
        theme={config.theme}
        lang={config.lang}
        loading={config.loading}
      />

      {/* 配置说明 */}
      <div className="mt-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg">
        <h4 className="font-semibold text-[var(--foreground)] mb-2">💡 如何启用评论</h4>
        <p className="text-sm text-[var(--muted)] mb-3">
          当前评论系统使用 <strong>Giscus</strong>（基于 GitHub Discussions），需要简单配置才能启用。
        </p>
        <ol className="text-sm text-[var(--muted)] space-y-1 list-decimal list-inside">
          <li>访问 <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">giscus.app</a></li>
          <li>使用 GitHub 登录并授权到你的仓库</li>
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
