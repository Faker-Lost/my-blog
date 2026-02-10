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
    </div>
  );
}
