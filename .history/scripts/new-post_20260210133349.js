const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取命令行参数作为标题
const title = process.argv[2];

if (!title) {
  console.error('\x1b[31m%s\x1b[0m', '❌ 错误: 请提供文章标题！');
  console.log('\x1b[36m%s\x1b[0m', '用法: npm run new -- "文章标题" [可选:专栏名]');
  process.exit(1);
}

// 获取可选参数：专栏名
const series = process.argv[3];
const slug = title.trim(); // 直接使用标题作为文件名，支持中文

const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// 构建 Frontmatter
let content = `---
title: "${title}"
date: "${date}"
excerpt: "${title} 的摘要..."
tags: []
`;

if (series) {
  content += `series: "${series}"
seriesOrder: 1
`;
}

content += `---

在此处编写正文...
`;

// 目标路径：如果是专栏文章，尝试放到子目录（但这略复杂，简单起见先放 posts 根目录）
// 或者根据 series 创建子目录？
let targetDir = path.join(__dirname, '..', 'posts');

// 如果指定了专栏，尝试创建专栏子目录（可选优化）
if (series) {
  // 简单的拼音转换或直接用中文目录 (Next.js 支持中文路径)
  const seriesDir = path.join(targetDir, series);
  if (!fs.existsSync(seriesDir)) {
    // 询问用户是否创建目录太麻烦，直接创建
    fs.mkdirSync(seriesDir, { recursive: true });
  }
  targetDir = seriesDir;
}

const filePath = path.join(targetDir, `${slug}.md`);

// 检查文件是否存在
if (fs.existsSync(filePath)) {
  console.error('\x1b[31m%s\x1b[0m', `❌ 文件已存在: ${filePath}`);
  process.exit(1);
}

// 写入文件
fs.writeFileSync(filePath, content);

console.log('\x1b[32m%s\x1b[0m', `✅ 文章已创建成功！`);
console.log(`📂 路径: ${filePath}`);

// 尝试自动打开文件 (VS Code)
try {
  execSync(`code "${filePath}"`);
  console.log('📝 已在 VS Code 中打开文件');
} catch (e) {
  // 忽略错误，可能没装 code 命令
}
