import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Faker :: Lost",
    template: "%s | Faker :: Lost",
  },
  description: "Code is Reality. Reality is Fake. 技术探索与迷失记录。",
  keywords: ["Faker-Lost", "博客", "技术", "C++", "Qt", "OpenCV"],
  authors: [{ name: "Faker-Lost" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Faker :: Lost",
  },
  verification: {
    other: {
      "baidu-site-verification": "codeva-wALds0TuPo",
    },
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
      <body className="min-h-screen flex flex-col relative">
        <ParticleBackground />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
