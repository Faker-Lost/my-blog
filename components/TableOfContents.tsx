'use client';

import { useEffect, useState } from 'react';
import { Heading } from '@/lib/posts';

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // 监听滚动，高亮当前标题
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // 点击跳转
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 顶部偏移量
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 uppercase tracking-wider">
        目录
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-1 border-l-2 pl-3 transition-colors leading-snug
                ${
                  activeId === heading.id
                    ? 'border-[var(--accent)] text-[var(--foreground)] font-medium'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
                }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
