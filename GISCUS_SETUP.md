# Giscus 评论系统配置指南

本博客使用 **Giscus** 作为评论系统，基于 GitHub Discussions，免费、无广告、加载快。

## 快速配置

### 步骤 1：准备 GitHub 仓库

1. 确保你有一个公开的 GitHub 仓库
2. 在仓库设置中开启 **Discussions** 功能：
   - 进入仓库 Settings → Features
   - 勾选 "Discussions"

### 步骤 2：访问 Giscus 官网

打开 https://giscus.app 并点击 "**Install**" 安装到你的仓库。

### 步骤 3：获取配置信息

1. 在 giscus.app 页面填写配置：
   ```
   Repository: your-username/your-repo
   Discussion category: General (或选择其他分类)
   ```

2. 页面会生成配置代码，复制其中的：
   - `data-repo`
   - `data-repo-id`
   - `data-category`
   - `data-category-id`

### 步骤 4：更新配置文件

编辑 `components/Giscus.tsx` 文件，将生成的配置替换占位符：

```tsx
const config = {
  repo: 'your-username/your-repo',        // 你的仓库
  repoId: 'YOUR_REPO_ID',                // 替换为实际值
  category: 'General',                    // 分类名称
  categoryId: 'YOUR_CATEGORY_ID',        // 替换为实际值
  // ... 其他配置保持不变
};
```

### 步骤 5：部署更新

```bash
git add .
git commit -m "feat: 启用 Giscus 评论系统"
git push
```

## 配置示例

### 完整配置示例

```tsx
const config = {
  repo: 'Faker-Lost/my-blog',              // 仓库名
  repoId: 'R_kgDOHXXXXXXXX',               // 仓库 ID
  category: 'General',                      // 分类
  categoryId: 'DIC_kwDOHXXXXXXXX',         // 分类 ID
  mapping: 'pathname',                     // URL 映射方式
  reactionsEnabled: true,                   // 启用表情反应
  emitMetadata: false,                     // 不发送额外数据
  inputPosition: 'bottom',                 // 评论输入框位置
  theme: 'preferred_color_scheme',          // 主题（跟随系统）
  lang: 'zh-CN',                           // 语言
  loading: 'lazy',                         // 懒加载
};
```

## 高级配置

### 1. 自定义主题

Giscus 支持多种主题：

```tsx
// 浅色主题
theme: 'light',

// 深色主题
theme: 'dark',

// 跟随系统
theme: 'preferred_color_scheme',

// 透明主题
theme: 'transparent',

// 使用自定义 CSS
theme: 'custom',
```

### 2. 自定义样式

如果需要自定义样式，可以：

1. 在 giscus.app 选择 "custom" 主题
2. 复制默认 CSS
3. 修改颜色和样式
4. 在页面 `<head>` 中引入自定义 CSS

### 3. 多语言支持

支持的语言：

- `zh-CN` - 简体中文
- `zh-TW` - 繁体中文
- `en` - 英文
- `ja` - 日文
- `ko` - 韩文
- `es` - 西班牙文
- `fr` - 法文

## 功能特性

### ✅ 已实现

- 基于 GitHub 登录
- 评论发布和回复
- 表情反应
- Markdown 支持
- 懒加载
- 暗黑模式适配

### 🔧 管理功能

- 评论审核（Discussions 中管理）
- 垃圾评论过滤
- 评论排序（最新、最热）
- 通知系统（GitHub 通知）

## 故障排除

### 评论不显示

1. 检查配置是否正确
2. 确认 Discussions 已开启
3. 检查网络是否正常
4. 查看浏览器控制台错误

### 样式问题

1. 检查 CSS 是否有冲突
2. 确认主题设置正确
3. 清除浏览器缓存

### 权限问题

1. 确保仓库是公开的
2. 检查 Discussions 是否开启
3. 确认配置信息正确

## 替代方案

如果不想使用 Giscus，可以考虑：

1. **Disqus** - 功能完整但有广告
2. **Waline** - 中文友好，需服务器
3. **自建系统** - 完全可控，成本高

## 相关链接

- [Giscus 官网](https://giscus.app)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)
- [博客仓库](https://github.com/Faker-Lost/my-blog)

---

**提示**：Giscus 完全免费且开源，数据存储在 GitHub 上，隐私安全有保障。
