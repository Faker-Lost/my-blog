'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface SearchProps {
  posts: PostMeta[];
}

export default function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<PostMeta[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
    setResults(filtered.slice(0, 5)); // 最多显示5条结果
  }, [query, posts]);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘快捷键 Ctrl+K 打开搜索
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* 搜索输入框 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索文章... (Ctrl+K)"
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg
                     bg-[var(--card)] border border-[var(--border)]
                     text-[var(--foreground)] placeholder-[var(--muted)]
                     focus:outline-none focus:border-[var(--accent)]
                     transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && query.trim() && (
        <div
          className="absolute top-full left-0 right-0 mt-2
                     bg-[var(--card)] border border-[var(--border)]
                     rounded-lg shadow-lg overflow-hidden z-50"
        >
          {results.length > 0 ? (
            <ul>
              {results.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="block px-4 py-3 hover:bg-[var(--background)] transition-colors"
                  >
                    <p className="font-medium text-[var(--foreground)]">{post.title}</p>
                    <p className="text-sm text-[var(--muted)] line-clamp-1">
                      {post.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-[var(--muted)] text-center">
              未找到相关文章
            </div>
          )}
        </div>
      )}
    </div>
  );
}
