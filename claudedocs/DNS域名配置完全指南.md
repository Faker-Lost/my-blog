# DNS 域名配置完全指南：从入门到实战

> 本文系统讲解 DNS 原理和域名配置，结合 Vercel 部署博客的实际案例，帮助开发者快速掌握域名相关知识。

## 目录

- [一、DNS 基础概念](#一dns-基础概念)
- [二、域名系统工作原理](#二域名系统工作原理)
- [三、DNS 记录类型详解](#三dns-记录类型详解)
- [四、Vercel 博客部署实战](#四vercel-博客部署实战)
- [五、常见问题排查](#五常见问题排查)

---

## 一、DNS 基础概念

### 1.1 什么是 DNS？

**DNS（Domain Name System）域名系统**是互联网的电话簿，负责将人类可读的域名（如 `emoji-blog.cn`）转换为机器可识别的 IP 地址（如 `76.76.21.21`）。

```
人类访问: https://emoji-blog.cn
    ↓
DNS 查询: emoji-blog.cn → ?
    ↓
返回 IP: 76.76.21.21
    ↓
实际访问: https://76.76.21.21
```

### 1.2 为什么需要 DNS？

| 对比项 | IP 地址 | 域名 |
|--------|---------|------|
| 可读性 | ❌ `192.0.2.1` 难记忆 | ✅ `emoji-blog.cn` 易记忆 |
| 灵活性 | ❌ 绑定固定服务器 | ✅ 可随时更换服务器 |
| 扩展性 | ❌ 一个 IP 一个站点 | ✅ 一个域名多个服务 |

### 1.3 域名结构解析

```
完整域名: blog.emoji-blog.cn.
          └─┬──┘ └───┬───┘ └┬┘
            │        │      │
          子域    二级域  顶级域
```

- **顶级域（TLD）**：`.cn`、`.com`、`.org`
- **二级域（SLD）**：`emoji-blog`（你购买的部分）
- **子域**：`blog`、`www`（可自由创建）

---

## 二、域名系统工作原理

### 2.1 DNS 查询流程

```
用户输入: emoji-blog.cn
    ↓
1. 检查浏览器缓存
    ↓ (未找到)
2. 检查系统缓存 (hosts 文件)
    ↓ (未找到)
3. 查询本地 DNS 服务器
    ↓ (未找到)
4. 查询根域名服务器 (.)
    ↓
5. 查询顶级域名服务器 (.cn)
    ↓
6. 查询权威域名服务器 (emoji-blog.cn)
    ↓
7. 返回 IP 地址
```

### 2.2 DNS 层级结构

```
                    根服务器 (.)
                     │
        ┌────────────┼────────────┐
        │            │            │
       .cn          .com         .org
        │            │            │
   emoji-blog.cn  example.com  test.org
        │
    blog.emoji-blog.cn
```

### 2.3 DNS 缓存机制

| 缓存类型 | 位置 | TTL（生存时间） |
|----------|------|----------------|
| 浏览器缓存 | 浏览器 | 几分钟 |
| 系统缓存 | 操作系统 | 几小时 |
| DNS 服务器缓存 | ISP / 公共 DNS | 可配置 |

---

## 三、DNS 记录类型详解

### 3.1 核心 DNS 记录

#### A 记录（Address）

**将域名指向 IPv4 地址**

```
名称    类型    值
@       A       76.76.21.21
www     A       76.76.21.21
```

**用途**：直接指向服务器 IP

---

#### CNAME 记录（Canonical Name）

**将域名指向另一个域名**

```
名称    类型        值
blog    CNAME       emoji-blog.cn
www     CNAME       cname.vercel-dns.com
```

**用途**：
- 指向托管服务（Vercel、GitHub Pages）
- 避免硬编码 IP 地址

**限制**：CNAME 不能用于根域名（@）

---

#### TXT 记录

**存储文本信息**

```
名称    类型    值
@       TXT     "v=spf1 include:vercel.com ~all"
@       TXT     "google-site-verification=xxx"
```

**用途**：
- SPF 邮件验证
- 域名所有权验证
- 安全配置

---

#### MX 记录（Mail Exchange）

**指定邮件服务器**

```
名称    类型    优先级    值
@       MX      10        mx.zoho.com
@       MX      20        mx2.zoho.com
```

---

### 3.2 DNS 记录对比

| 记录类型 | 指向目标 | 根域名支持 | 典型场景 |
|----------|----------|------------|----------|
| **A** | IPv4 地址 | ✅ | 直接服务器 |
| **AAAA** | IPv6 地址 | ✅ | IPv6 服务器 |
| **CNAME** | 域名 | ❌ | 托管服务 |
| **TXT** | 文本 | ✅ | 验证配置 |
| **MX** | 邮件服务器 | ✅ | 邮件服务 |

---

## 四、Vercel 博客部署实战

### 4.1 完整配置流程

#### 步骤 1：域名注册

```bash
# 购买域名
平台: 阿里云 / 腾讯云 / Cloudflare
域名: emoji-blog.cn
费用: ¥30-50/年
```

#### 步骤 2：DNS 配置

**阿里云域名解析**

```
主机记录   记录类型   记录值
@          CNAME      cname.vercel-dns.com
www        CNAME      cname.vercel-dns.com
```

**Vercel 自动配置（推荐）**

Vercel 会提供具体的 DNS 记录：

```
类型: CNAME
名称: @
值: cname.vercel-dns.com

类型: CNAME
名称: www
值: cname.vercel-dns.com
```

#### 步骤 3：Vercel 添加域名

```
1. 打开 Vercel 项目 → Settings → Domains
2. 输入域名: emoji-blog.cn
3. 选择环境: Production
4. Vercel 自动检测 DNS 配置
5. 等待验证通过
```

#### 步骤 4：更新环境变量

```bash
# Vercel → Settings → Environment Variables
SITE_URL = https://emoji-blog.cn
```

更新文件：
- `app/robots.ts`
- `app/sitemap.ts`
- `app/rss.xml/route.ts`

---

### 4.2 配置验证

#### 检查 DNS 生效

```bash
# Windows
nslookup emoji-blog.cn

# macOS / Linux
dig emoji-blog.cn
```

#### 预期结果

```
emoji-blog.cn → cname.vercel-dns.com → 76.76.21.21
```

#### 检查 HTTPS 证书

```
访问: https://emoji-blog.cn
浏览器: 显示 🔒 安全锁
```

---

## 五、常见问题排查

### 5.1 域名无法访问

| 现象 | 可能原因 | 解决方案 |
|------|----------|----------|
| **域名无法解析** | DNS 未生效 | 等待 10 分钟 - 48 小时 |
| **证书错误** | 域名未验证完成 | 检查 Vercel 域名状态 |
| **404 错误** | DNS 配置错误 | 验证 CNAME 记录值 |
| **部分网络无法访问** | DNS 污染 | 使用自定义域名 |

### 5.2 DNS 生效时间

| 配置类型 | 生效时间 |
|----------|----------|
| **DNS 记录** | 10 分钟 - 48 小时 |
| **Vercel 域名** | 通常 < 5 分钟 |
| **HTTPS 证书** | 自动签发，< 1 小时 |

### 5.3 域名状态说明

| 状态 | 含义 | 操作 |
|------|------|------|
| **注册局审核中** | 域名正在验证 | 等待 |
| **正常** | 可以使用 | 开始配置 |
| **已过期** | 需要续费 | 立即续费 |
| **客户端hold** | 需要实名认证 | 完成认证 |

---

## 总结

### 关键要点

1. **DNS 是互联网的电话簿**，将域名转换为 IP
2. **CNAME 记录**是托管服务的最佳选择
3. **Vercel 提供自动配置**，按提示操作即可
4. **DNS 生效需要时间**，耐心等待验证

### 配置清单

- [ ] 注册域名
- [ ] 等待审核通过
- [ ] 配置 DNS 解析
- [ ] Vercel 添加域名
- [ ] 更新环境变量
- [ ] 验证域名访问
- [ ] 确认 HTTPS 生效

### 下一步

配置完成后，你的博客就可以通过 `https://emoji-blog.cn` 正常访问了！

---

## 参考资料

- [Vercel Domains 官方文档](https://vercel.com/docs/concepts/projects/domains)
- [阿里云 DNS 解析文档](https://help.aliyun.com/product/29695.html)
- [DNS 原理详解 - RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)

---

**作者**: 墨迹笔记
**发布日期**: 2026-01-21
**标签**: #DNS #域名 #Vercel #Web开发
