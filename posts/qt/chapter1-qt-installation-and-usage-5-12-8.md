---
title: Qt 开发教程 - 第1章 Qt 的安装与使用（Qt 5.12.8）
date: 2026-02-25
excerpt: 从零开始完成 Qt 5.12.8 安装与环境配置，覆盖在线安装、组件选择、Creator 使用、首个工程创建与常见问题排查。

series: Qt 教程
seriesSlug: Qt
seriesOrder: 1
tags:
  - Qt
  - C++
  - GUI开发
  - 教程
  - Qt5
---

## 第1章：Qt 的安装与使用（Qt 5.12.8）

本章目标是让你在本机完成 **Qt 5.12.8** 的可用开发环境，并成功运行第一个 Qt 程序。

## 一、为什么选择 Qt 5.12.8

- Qt 5.12.8 属于 Qt 5 LTS 线，生态成熟，历史项目覆盖率高。
- 对传统 Widgets 桌面开发非常稳定，资料多、踩坑经验多。
- 如果你后续维护老项目，5.12.x 往往是高频版本。

## 二、安装前准备

### 1. 系统与磁盘

- Windows 10/11（64 位）
- 建议预留至少 10 GB 空间（含 SDK、编译器、缓存）

### 2. 编译器选择

Qt 本身只是框架，构建程序还需要工具链。常见两类：

- MinGW：安装简单，适合快速入门
- MSVC：更贴近企业 Windows 生态，适合对接 Visual Studio 工具链

建议新手先选一个，不要同时装太多版本（KISS）。

## 三、安装 Qt 5.12.8

### 1. 获取安装器

下载并运行 Qt 官方在线安装器（Qt Online Installer），登录 Qt 账号后进入组件选择页面。

### 2. 关键组件勾选建议

在版本树中选择 `Qt 5.12.8`，按你的工具链勾选一个套件即可：

- `Qt 5.12.8 -> MinGW 64-bit`（或同类 MinGW 套件）
- 或 `Qt 5.12.8 -> MSVC 2017/2019 64-bit`（按你本机 VS 版本对应）

再勾选：

- `Qt Creator`
- `Debug Information Files`（可选，占空间大）
- `Sources`（可选，便于查看源码）

不建议首装时全选所有模块（YAGNI）。

### 3. 安装路径建议

- 建议使用默认路径，避免中文路径和空格路径带来的脚本兼容问题。
- 如果必须自定义，路径尽量简短，如：`D:\Qt\`.

## 四、安装后验证

### 1. 验证 qmake

在终端执行（进入对应版本工具链目录后）：

```bash
qmake -v
```

你应该看到类似版本信息，包含 `Qt version 5.12.8`。

### 2. 验证 Qt Creator 套件

打开 Qt Creator：

- `工具 -> 选项 -> Kits`
- 检查 `Qt Versions` 是否存在 5.12.8
- 检查 `Compilers`、`Debuggers`、`Kits` 是否自动匹配

如果 Kit 是红色警告，通常是编译器路径未识别。

## 五、创建并运行第一个 Qt 工程

### 1. 新建工程

- `File -> New File or Project`
- 选择 `Application -> Qt Widgets Application`
- 选择 Kit：`Qt 5.12.8 + 你的编译器`

### 2. 运行验证

直接构建并运行，看到空白主窗口即表示环境可用。

你也可以用最小示例验证：

```cpp
#include <QApplication>
#include <QPushButton>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    QPushButton button("Hello Qt 5.12.8");
    button.resize(240, 80);
    button.show();
    return app.exec();
}
```

## 六、常见问题与排查

### 1. 启动报缺少 DLL

现象：程序在 Creator 里能跑，双击 exe 报错。  
原因：Qt 运行库未随程序发布。  
处理：使用 `windeployqt` 打包依赖。

### 2. Kit 不可用

现象：Creator 提示未配置编译器。  
处理：

- MinGW 套件：确认安装了对应 MinGW 组件
- MSVC 套件：确认本机有对应版本 Visual Studio C++ 工具集

### 3. CMake / qmake 混淆

Qt 5.12.8 常见是 `qmake` 工作流，新项目也可用 CMake。  
建议学习初期先统一一种构建方式（DRY + KISS）。

## 七、本章小结

- 你已经完成 Qt 5.12.8 的安装、套件配置与基础验证
- 已能创建并运行 Qt Widgets 工程
- 已掌握 3 类高频安装问题的定位思路

---

下一章建议：**Qt 信号与槽详解**（对象通信核心机制）。

