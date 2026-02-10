---
title: 使用 GitHub Actions 实现自动部署
date: 2025-01-24
excerpt: 详细介绍如何使用 GitHub Actions 为 Next.js 博客配置 CI/CD 自动化部署，实现代码推送后自动构建和部署。
tags:
  - GitHub Actions
  - CI/CD
  - 自动化
  - 部署
  - 教程
---

## 使用 GitHub Actions 实现自动部署

GitHub Actions 是 GitHub 提供的持续集成和持续部署（CI/CD）服务，可以帮助我们自动化构建、测试和部署流程。本篇文章将介绍如何为 Next.js 博客配置 GitHub Actions 实现自动化部署。

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 的 CI/CD 平台，允许你自动化软件开发工作流程。通过配置文件（workflow），你可以定义在特定事件（如 push、pull request）发生时触发的操作。

### 核心概念

- **Workflow**：自动化工作流程
- **Event**：触发事件（push、pull_request 等）
- **Job**：工作单元
- **Step**：步骤
- **Action**：可重用模块

## 为 Next.js 博客配置 GitHub Actions

### 1. 创建 Workflow 文件

在项目根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to Vercel

on:
  # 推送到主分支时触发
  push:
    branches: ["master"]
  # 手动触发
  workflow_dispatch:

# 设置权限
permissions:
  contents: read
  pages: write
  id-token: write

# 并发控制
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    # 部署环境
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout
        uses: actions/checkout@v4

      # 2. 设置 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      # 3. 安装依赖
      - name: Install dependencies
        run: npm ci

      # 4. 构建项目
      - name: Build
        run: npm run build

      # 5. 设置 Pages
      - name: Setup Pages
        uses: actions/configure-pages@v4

      # 6. 上传构建产物
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

      # 7. 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. 理解配置文件

让我们逐步分析这个配置：

#### 触发条件

```yaml
on:
  push:
    branches: ["master"]    # 推送到 master 分支时触发
  workflow_dispatch:        # 手动触发
```

#### 权限设置

```yaml
permissions:
  contents: read            # 读取仓库内容
  pages: write             # 写入 Pages
  id-token: write          # 写入 ID 令牌
```

#### 步骤详解

1. **Checkout** - 检出代码到工作区
2. **Setup Node.js** - 设置 Node.js 环境（版本 18）
3. **Install dependencies** - 安装 npm 依赖
4. **Build** - 运行构建命令
5. **Setup Pages** - 配置 GitHub Pages
6. **Upload artifact** - 上传构建产物
7. **Deploy** - 部署到 GitHub Pages

### 3. 启用 GitHub Pages

推送配置后，在 GitHub 仓库中：

1. 进入 **Settings** → **Pages**
2. Source 选择 **"GitHub Actions"**
3. 保存设置

## 部署到 Vercel

如果你更倾向于使用 Vercel，可以使用官方 Action：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: ["master"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
          vercel-args: '--prod'
```

### 获取 Vercel 配置

1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目根目录运行：`vercel`
3. 设置环境变量：
   - `VERCEL_TOKEN`：从 Vercel Account Settings 获取
   - `ORG_ID` 和 `PROJECT_ID`：从 `.vercel/project.json` 获取

## 多环境部署

可以配置不同的环境和分支：

```yaml
name: Deploy

on:
  push:
    branches:
      - main      # 生产环境
      - develop   # 开发环境
  workflow_dispatch:

jobs:
  deploy-prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      # 生产环境部署步骤

  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: development
    steps:
      # 开发环境部署步骤
```

## 高级配置

### 1. 缓存依赖

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### 2. 并行任务

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run linter
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  build-and-deploy:
    needs: [lint, test]  # 依赖前面两个任务
    runs-on: ubuntu-latest
    steps:
      # 部署步骤
```

### 3. 矩阵构建

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

## 最佳实践

### 1. 使用环境变量

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中设置：

```yaml
- name: Deploy
  run: |
    echo "Deploying to ${{ vars.DEPLOY_ENV }}"
    deploy --token ${{ secrets.DEPLOY_TOKEN }}
```

### 2. 条件部署

```yaml
- name: Deploy
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  run: echo "Deploying to production"
```

### 3. 通知机制

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 自动化测试

集成测试到 CI/CD 流程：

```yaml
name: CI/CD

on:
  push:
    branches: ["master"]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      # 部署步骤
```

## 故障排除

### 常见问题

1. **权限不足**

   ```yaml
   permissions:
     contents: read
     pages: write
   ```

2. **缓存问题**

   ```yaml
   - name: Clear cache
     run: |
       rm -rf node_modules
       rm package-lock.json
   ```

3. **环境变量未设置**
   - 检查 Secrets 配置
   - 确认变量名拼写

### 调试技巧

```yaml
- name: Debug
  run: |
    echo "GitHub event: ${{ github.event_name }}"
    echo "GitHub ref: ${{ github.ref }}"
    echo "Branch: ${{ github.ref_name }}"
    ls -la
```

## 总结

GitHub Actions 为 Next.js 博客提供了强大的 CI/CD 能力：

### 优势

- ✅ 免费且集成度高
- ✅ 配置灵活，可定制性强
- ✅ 支持矩阵构建和并行任务
- ✅ 与 GitHub 深度集成
- ✅ 丰富的官方和社区 Action

### 使用建议

1. **简单项目** - 使用 GitHub Pages 部署
2. **生产项目** - 使用 Vercel + GitHub Actions
3. **企业项目** - 配置多环境和审批流程
4. **开源项目** - 开源配置供参考

GitHub Actions 让部署变得简单高效，是现代 Web 开发的必备工具。

## 下一步

考虑添加：

- 代码质量检查（ESLint、Prettier）
- 安全扫描（Dependabot）
- 性能监控
- 回滚机制
