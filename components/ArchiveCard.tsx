import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface ArchiveCardProps {
  posts: PostMeta[];
}

interface ArchiveGroup {
  year: string;
  months: Array<{
    month: string;  // 数字月份 "01", "02"...
    monthName: string; // 中文月份名
    count: number;
  }>;
}

export default function ArchiveCard({ posts }: ArchiveCardProps) {
  // 按年月分组统计文章
  const archiveGroups: ArchiveGroup[] = [];

  const yearMonthMap = new Map<string, Map<string, { name: string; count: number }>>();

  posts.forEach((post) => {
    if (!post.date) return;

    const date = new Date(post.date);
    const year = date.getFullYear().toString();
    const monthNum = (date.getMonth() + 1).toString().padStart(2, '0'); // "01", "02"...
    const monthName = date.toLocaleString('zh-CN', { month: 'long' }); // "一月", "二月"...

    if (!yearMonthMap.has(year)) {
      yearMonthMap.set(year, new Map());
    }

    const monthMap = yearMonthMap.get(year)!;
    const existing = monthMap.get(monthNum);
    if (existing) {
      existing.count++;
    } else {
      monthMap.set(monthNum, { name: monthName, count: 1 });
    }
  });

  // 转换为数组并排序
  yearMonthMap.forEach((monthMap, year) => {
    const months = Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, monthName: data.name, count: data.count }))
      .reverse(); // 最新月份在前

    archiveGroups.push({ year, months });
  });

  archiveGroups.sort((a, b) => b.year.localeCompare(a.year)); // 最新年份在前

  // 只显示最近6个月份
  let totalMonths = 0;
  const displayGroups = archiveGroups
    .map(group => ({
      ...group,
      months: group.months.slice(0, 6 - totalMonths)
    }))
    .filter(group => {
      totalMonths += group.months.length;
      return group.months.length > 0 && totalMonths <= 6;
    });

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        文章归档
      </h3>
      <div className="space-y-3">
        {displayGroups.map((group) => (
          <div key={group.year}>
            <div className="text-sm font-semibold text-[var(--foreground)] mb-2">
              {group.year}
            </div>
            <div className="space-y-1.5 ml-2">
              {group.months.map((item) => (
                <Link
                  key={`${group.year}-${item.month}`}
                  href={`/archive/${group.year}/${item.month}`}
                  className="flex items-center justify-between text-sm text-[var(--muted)]
                             hover:text-[var(--accent)] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]
                                       group-hover:bg-[var(--accent)] transition-colors"></span>
                    {item.monthName}
                  </span>
                  <span className="text-xs">{item.count}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
