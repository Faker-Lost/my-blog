'use client';

import { useEffect, useState } from 'react';

/**
 * 阅读进度条组件
 * 显示在页面顶部，指示文章阅读进度
 * 包含一个跟随进度移动的图标
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // 获取页面滚动信息
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    // 初始化
    updateProgress();

    // 监听滚动事件
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-12 z-50 pointer-events-none"
      aria-label={`阅读进度: ${Math.round(progress)}%`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 进度条背景 */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] via-blue-500 to-purple-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* 移动的图标 - 相对于外层容器定位 */}
      <div
        className="absolute"
        style={{
          left: `${progress}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: progress > 2 ? 1 : 0,
          transition: 'opacity 0.3s ease-out, left 0.15s ease-out',
        }}
      >
        {/* 纸飞机图标 */}
        <div className="relative">
          {/* 发光效果 */}
          <div className="absolute inset-0 bg-gray-400 dark:bg-gray-600 rounded-full blur-sm opacity-40 animate-pulse" />

          {/* 图标容器 */}
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
            <svg
              className="w-3.5 h-3.5 text-gray-700 dark:text-gray-200"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 纸飞机图标 - 斜向右上 */}
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 完成时的庆祝效果 */}
      {progress >= 99 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-lg border border-[var(--border)] animate-bounce">
            <span className="text-lg">🎉</span>
            <span className="text-xs font-semibold text-[var(--accent)]">完成</span>
          </div>
        </div>
      )}
    </div>
  );
}

