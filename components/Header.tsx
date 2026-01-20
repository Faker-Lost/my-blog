import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / 站点名称 */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-[var(--foreground)]
                     hover:text-[var(--accent)] transition-colors"
          style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
        >
          墨迹笔记
        </Link>

        {/* 导航 */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            首页
          </Link>
          <Link
            href="/tags"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            标签
          </Link>
          <Link
            href="/about"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            关于
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
