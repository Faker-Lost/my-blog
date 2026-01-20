<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>RSS Feed - 墨迹笔记</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #8b4513;
          }

          h1 {
            color: #8b4513;
            font-size: 2.5em;
            margin-bottom: 10px;
          }

          .description {
            color: #666;
            font-size: 1.1em;
            margin-bottom: 15px;
          }

          .info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
          }

          .info h3 {
            color: #8b4513;
            margin-bottom: 10px;
          }

          .info a {
            color: #8b4513;
            text-decoration: none;
            font-weight: bold;
          }

          .info a:hover {
            text-decoration: underline;
          }

          .articles {
            list-style: none;
          }

          .article {
            margin-bottom: 30px;
            padding: 20px;
            background: #fafafa;
            border-radius: 5px;
            border-left: 4px solid #8b4513;
          }

          .article h2 {
            color: #8b4513;
            font-size: 1.5em;
            margin-bottom: 10px;
          }

          .article h2 a {
            color: #8b4513;
            text-decoration: none;
          }

          .article h2 a:hover {
            text-decoration: underline;
          }

          .meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
          }

          .description {
            color: #444;
            line-height: 1.8;
          }

          .tags {
            margin-top: 10px;
          }

          .tag {
            display: inline-block;
            background: #8b4513;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.8em;
            margin-right: 5px;
          }

          footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
          }

          @media (max-width: 768px) {
            .container {
              padding: 20px;
            }

            h1 {
              font-size: 2em;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>📡 RSS Feed</h1>
            <div class="description">
              <xsl:value-of select="rss/channel/description"/>
            </div>
            <div class="info">
              <h3>🎯 如何使用 RSS？</h3>
              <p>复制此链接到 RSS 阅读器（如 <a href="https://feedly.com" target="_blank">Feedly</a>、<a href="https://inoreader.com" target="_blank">Inoreader</a>）自动获取更新</p>
              <p><strong>RSS 地址：</strong> <code>https://my-blog-kappa-teal.vercel.app/rss.xml</code></p>
              <p><a href="https://my-blog-kappa-teal.vercel.app">← 返回博客首页</a></p>
            </div>
          </header>

          <ul class="articles">
            <xsl:for-each select="rss/channel/item">
              <li class="article">
                <h2>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="link"/>
                    </xsl:attribute>
                    <xsl:attribute name="target">_blank</xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>

                <div class="meta">
                  📅 <xsl:value-of select="pubDate"/>
                </div>

                <div class="description">
                  <xsl:value-of select="description"/>
                </div>

                <div class="tags">
                  <xsl:for-each select="category">
                    <span class="tag">
                      <xsl:value-of select="."/>
                    </span>
                  </xsl:for-each>
                </div>
              </li>
            </xsl:for-each>
          </ul>

          <footer>
            <p>🤖 由 <a href="https://my-blog-kappa-teal.vercel.app">墨迹笔记</a> 自动生成</p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
