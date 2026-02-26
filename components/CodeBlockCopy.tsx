'use client';

import { useEffect } from 'react';

/**
 * 客户端组件：为文章中的代码块添加复制按钮
 * 
 * 原理：
 * 由于文章内容是服务端生成的静态 HTML，我们在客户端使用 useEffect 
 * 遍历所有的 <pre> 标签，并动态插入复制按钮。
 */
export default function CodeBlockCopy() {
  useEffect(() => {
    // 查找所有代码块外层的 pre 标签
    const preElements = document.querySelectorAll('.prose pre');

    preElements.forEach((pre) => {
      // 检查是否已经添加过按钮（防止重复添加）
      if (pre.parentNode && (pre.parentNode as HTMLElement).classList.contains('code-block-wrapper')) {
        return;
      }

      // 1. 创建包装容器
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper relative group';

      // 将 pre 放入 wrapper
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // 2. 创建复制按钮
      const button = document.createElement('button');
      button.className = `
        code-copy-btn absolute top-2 right-2 p-1.5 rounded-md
        opacity-0 group-hover:opacity-100 focus-visible:opacity-100
        transition-all duration-200 text-xs flex items-center gap-1 backdrop-blur-sm
      `;
      button.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
          />
        </svg>
        <span>复制</span>
      `;

      // 3. 添加点击事件
      button.addEventListener('click', async () => {
        try {
          const codeEl = pre.querySelector('code');
          // 使用 HTMLElement 断言来访问 innerText
          const code = (codeEl as HTMLElement)?.innerText || (pre as HTMLElement).innerText;

          await navigator.clipboard.writeText(code);

          // 复制成功反馈
          const originalHTML = button.innerHTML;
          button.innerHTML = `
            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-green-400 text-xs">已复制</span>
          `;

          // 2秒后恢复
          setTimeout(() => {
            button.innerHTML = originalHTML;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          button.innerText = '复制失败';
        }
      });

      // 插入按钮到 wrapper
      wrapper.appendChild(button);
    });
  }, []); // 仅在组件挂载时执行一次

  return null; // 此组件不渲染任何自身的 DOM
}
