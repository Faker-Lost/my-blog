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
      className="fixed top-0 left-0 right-0 h-1 bg-[var(--border)] z-50 pointer-events-none"
      aria-label={`阅读进度: ${Math.round(progress)}%`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 进度条背景 */}
      <div
        className="h-full bg-gradient-to-r from-[var(--accent)] via-blue-500 to-purple-500 transition-all duration-150 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* 移动的图标 - 在进度条末端 */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
          style={{
            opacity: progress > 2 ? 1 : 0, // 滚动一点后才显示
            transition: 'opacity 0.3s ease-out',
          }}
        >
          {/* 火箭图标 */}
          <div className="relative">
            {/* 发光效果 */}
            <div className="absolute inset-0 bg-[var(--accent)] rounded-full blur-md opacity-60 animate-pulse" />

            {/* 图标容器 */}
            <div className="relative bg-white dark:bg-gray-900 rounded-full p-1 shadow-lg">
              <svg
                className="w-4 h-4 text-[var(--accent)]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 火箭图标 */}
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14zM4 11a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm9-1a1 1 0 100 2h1a1 1 0 100-2h-1z" />
              </svg>
            </div>
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

