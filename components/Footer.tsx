import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 版权信息 */}
          <p className="text-sm text-[var(--muted)]">
            © {currentYear} 墨迹笔记. All rights reserved.
          </p>

          {/* 链接 */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/rss.xml"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              RSS
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* 技术栈标识 */}
        <p className="text-center text-xs text-[var(--muted)] mt-6">
          Powered by Next.js · Styled with Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
