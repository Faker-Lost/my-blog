---
title: Vercel 博客绑定自定义域名完整指南
date: 2026-01-21
excerpt: 从域名注册到 DNS 配置，详细记录 Vercel 博客绑定自定义域名的完整过程，解决国内访问 Vercel 子域名受限的问题。
tags:
  - Vercel
  - DNS
  - 域名配置
  - Web部署
coverImage: /images/posts/vercel-domain.jpg
---

# Vercel 博客绑定自定义域名完整指南

## 背景

最近将博客部署到 Vercel 后，发现一个尴尬的问题：**Vercel 的子域名（如 `*.vercel.app`）在国内需要梯子才能访问**。为了让博客在国内正常访问，必须绑定自定义域名。

本文将详细记录从域名注册到最终可访问的完整过程，希望能帮助到遇到同样问题的朋友。

---

## 问题分析

### 为什么 Vercel 子域名国内受限？

```
访问情况:
├─ 海外: ✅ moji-my-blog.vercel.app 正常
└─ 国内: ❌ 需要梯子才能访问
```

**原因**：Vercel 使用的部分域名段在国内网络环境下被限制。

### 解决方案

使用自定义域名（如 `your-domain.com`）可以绕过这个限制，实现国内正常访问。

---

## 完整配置流程

### 步骤 1：注册域名

#### 选择域名注册平台

| 平台 | 优势 | 价格 |
|------|------|------|
| 阿里云 | 国内访问快，备案方便 | ¥30-50/年 |
| 腾讯云 | 操作简单，DNS 稳定 | ¥30-50/年 |
| Cloudflare | 免费，隐私保护 | 需信用卡 |

我选择了阿里云，注册了 `emoji-blog.cn` 域名。

#### 域名状态说明

| 状态 | 含义 | 操作 |
|------|------|------|
| **注册局审核中** | 域名正在验证 | 等待（几分钟到几小时） |
| **正常** | 可以使用 | 开始配置 |

> 💡 **提示**：域名审核通过后才能进行 DNS 配置，请耐心等待。

---

### 步骤 2：配置 DNS 解析

#### 登录阿里云 DNS 控制台

```
阿里云 → 控制台 → 域名 → 选择你的域名 → DNS 解析
```

#### 添加 DNS 记录

Vercel 推荐使用新的 DNS 配置（IP 扩展计划）：

| 主机记录 | 记录类型 | 记录值 |
|----------|----------|--------|
| `@` | A | `216.198.79.1` |
| `www` | CNAME | `[your-id].vercel-dns-017.com` |

> ⚠️ **注意**：
> - `@` 代表根域名（如 `emoji-blog.cn`）
> - `www` 代表子域名（如 `www.emoji-blog.cn`）
> - CNAME 记录值从 Vercel 获取，每个项目不同

#### DNS 记录类型说明

| 记录类型 | 指向目标 | 根域名支持 | 典型场景 |
|----------|----------|------------|----------|
| **A** | IPv4 地址 | ✅ | 直接指向服务器 IP |
| **CNAME** | 域名 | ❌ | 指向托管服务 |

**为什么根域名用 A 记录？**

CNAME 记录不能用于根域名（DNS 协议限制），所以 Vercel 推荐使用 A 记录指向固定 IP。

---

### 步骤 3：Vercel 添加域名

#### 操作路径

```
Vercel → 你的项目 → Settings → Domains → Add Domain
```

#### 添加域名

1. 输入域名：`emoji-blog.cn`
2. 选择环境：`Production`
3. 点击 `Add`

#### Vercel 自动检测

Vercel 会自动检测你的 DNS 配置：

| 状态 | 含义 |
|------|------|
| **Valid Configuration** | 配置正确 |
| **DNS Change Recommended** | 当前可用，有推荐更新 |
| **Invalid Configuration** | 配置错误，需要修复 |

> 💡 **提示**：如果显示 "DNS Change Recommended"，说明旧配置仍可用，但建议按推荐更新。

---

### 步骤 4：更新环境变量

#### 修改 SITE_URL

```
Vercel → Settings → Environment Variables
```

将 `SITE_URL` 更新为新域名：

```
名称: SITE_URL
值: https://emoji-blog.cn
环境: Production + Preview + Development
```

#### 为什么需要更新？

项目中多处使用了 `SITE_URL` 环境变量：

```typescript
// robots.ts
const SITE_URL = process.env.SITE_URL || 'https://yourblog.com';

// sitemap.ts
const SITE_URL = process.env.SITE_URL || 'https://yourblog.com';

// RSS feed
<link>${SITE_URL}</link>
```

更新后，RSS 订阅、sitemap、robots.txt 都会使用新域名。

---

### 步骤 5：触发部署并验证

#### 重新部署

环境变量更新后，需要重新部署项目：

```
Vercel → Deployments → 最新部署 → Redeploy
```

或推送代码触发自动部署。

#### 验证域名访问

部署完成后，测试访问：

```bash
# 测试根域名
https://emoji-blog.cn

# 测试 www 子域名
https://www.emoji-blog.cn

# 检查 HTTPS 证书
浏览器地址栏应显示 🔒 安全锁
```

#### 检查 DNS 生效

```bash
# Windows
nslookup emoji-blog.cn

# macOS / Linux
dig emoji-blog.cn
```

预期结果：
```
emoji-blog.cn → 216.198.79.1
www.emoji-blog.cn → [your-id].vercel-dns-017.com
```

---

## 常见问题排查

### 1. 域名无法解析

**现象**：访问域名提示 `ERR_NAME_NOT_RESOLVED`

**可能原因**：
- DNS 记录配置错误
- DNS 未生效（需要 10 分钟 - 48 小时）

**解决方案**：
- 检查 DNS 记录值是否正确
- 使用 `nslookup` 或 `dig` 检查 DNS 解析

---

### 2. Vercel 显示 "Invalid Configuration"

**可能原因**：
- DNS 记录类型错误
- 记录值不匹配

**解决方案**：
- 按照推荐的配置重新设置
- 确认 A 记录值为 `216.198.79.1`
- 确认 CNAME 记录值为 Vercel 提供的值

---

### 3. HTTPS 证书错误

**现象**：访问域名时浏览器提示证书无效

**解决方案**：
- 等待 Vercel 自动签发证书（通常 < 1 小时）
- 检查 Vercel Domains 页面的证书状态

---

### 4. 部分网络无法访问

**可能原因**：
- 使用了旧的 Vercel 子域名
- DNS 污染

**解决方案**：
- 确保使用自定义域名
- 使用推荐的新 DNS 配置

---

## DNS 知识补充

### 什么是 DNS？

**DNS（Domain Name System）** 是互联网的电话簿，负责将人类可读的域名转换为机器可识别的 IP 地址。

```
用户访问: https://emoji-blog.cn
    ↓
DNS 查询: emoji-blog.cn → ?
    ↓
返回 IP: 216.198.79.1
    ↓
实际访问: https://216.198.79.1
```

### DNS 解析流程

```
用户输入域名
    ↓
1. 检查浏览器缓存
    ↓ (未找到)
2. 检查系统缓存
    ↓ (未找到)
3. 查询本地 DNS 服务器
    ↓ (未找到)
4. 查询根域名服务器 (.)
    ↓
5. 查询顶级域名服务器 (.cn)
    ↓
6. 查询权威域名服务器
    ↓
7. 返回 IP 地址
```

### DNS 缓存机制

| 缓存类型 | 位置 | TTL（生存时间） |
|----------|------|----------------|
| 浏览器缓存 | 浏览器 | 几分钟 |
| 系统缓存 | 操作系统 | 几小时 |
| DNS 服务器缓存 | ISP / 公共 DNS | 可配置 |

---

## 总结

### 配置清单

- [x] 注册域名
- [x] 等待审核通过
- [x] 配置 DNS 解析
- [x] Vercel 添加域名
- [x] 更新环境变量
- [x] 重新部署
- [x] 验证域名访问

### 关键要点

1. **Vercel 子域名国内受限**，必须使用自定义域名
2. **DNS 配置注意根域名和子域名的区别**
3. **环境变量 `SITE_URL` 要同步更新**
4. **DNS 生效需要时间**，耐心等待验证

### 最终效果

```
国内访问: ✅ https://emoji-blog.cn
国外访问: ✅ https://emoji-blog.cn
HTTPS 证书: ✅ 自动签发
RSS 订阅: ✅ 正常工作
```

---

## 参考资料

- [Vercel Domains 官方文档](https://vercel.com/docs/concepts/projects/domains)
- [阿里云 DNS 解析文档](https://help.aliyun.com/product/29695.html)
- [DNS 原理详解 - RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)

---

**作者**: 🌈 墨迹笔记
**发布日期**: 2026-01-21
**相关文章**: [Next.js 博客开发记录](/posts/nextjs-blog-development)
