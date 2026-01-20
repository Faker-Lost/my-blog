import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// 使用 Noto Serif SC 作为主字体，传统优雅风格
const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "墨迹笔记 - 个人技术博客",
    template: "%s | 墨迹笔记",
  },
  description: "分享技术心得、项目经验与生活感悟的个人博客",
  keywords: ["博客", "技术", "前端", "后端", "编程"],
  authors: [{ name: "作者名" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "墨迹笔记",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 防止 FOUC - 提前应用主题 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${notoSerifSC.variable} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
