---
title: C++ Primer Plus 学习笔记 - 第2章 开始学习 C++
date: 2026-02-10
excerpt: 开启 C++ 实战之旅：从简单的程序结构开始，理解 main 函数、预处理器指令、名称空间、C++ 的输入输出以及变量声明与赋值的基本逻辑。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
series: C++ Primer Plus
seriesOrder: 3
---

## 本章概览

第 2 章是 C++ 实战的起点。我们将通过最简单的程序，理解 C++ 程序的基本构成、变量声明、输入输出以及函数的使用。

---

## 2.1 进入 C++

一个典型的 C++ 程序由以下部分组成：

```cpp
#include <iostream>          // 预处理器指令
int main()                   // 函数头
{                            // 函数体开始
    using namespace std;     // 编译指令
    cout << "Hello World!";  // 语句
    cout << endl;            // 语句
    return 0;                // 返回语句
}                            // 函数体结束
```

### 1. main() 函数

- 程序执行的入口。
- 返回值类型必须是 `int`。
- 如果不显式写 `return 0;`，编译器会在 `main` 函数末尾自动补上（仅限 `main` 函数）。

### 2. 预处理器指令 (#include)

- `#include <iostream>` 让预处理器将 `iostream` 文件的内容添加到程序中。
- `iostream` 涉及到输入（in）和输出（out）流。

### 3. 名称空间 (using namespace std)

- `std` 是标准名称空间的缩写。
- 目的是为了避免大型项目中的函数名名冲突。
- 其他方式：`std::cout` 或 `using std::cout;`。

---

## 2.2 C++ 语句

### 1. 变量声明

C++ 是一种强类型语言，使用变量前必须声明。

```cpp
int carrots;    // 声明一个整型变量
carrots = 25;   // 赋值
```

### 2. cout 输出

使用 `<<` 操作符将内容发送给输出流进行显示。

```cpp
cout << "我有 " << carrots << " 根胡萝卜。" << endl;
```

### 3. cin 输入

使用 `>>` 操作符从输入流读取内容并存入变量。

```cpp
cout << "你想要多少根？";
cin >> carrots;
```

---

## 2.3 函数

### 1. 使用有返回值的函数

例如使用数学库 `cmath` 中的 `sqrt()`：

```cpp
#include <cmath>
double x = sqrt(6.25); // 调用并获取返回值
```

### 2. 自定义函数

自定义函数包含两个部分：

- **函数原型（Prototype）**：告诉编译器函数的参数和返回类型。
- **函数定义（Definition）**：包含函数的实际代码。

```cpp
#include <iostream>
using namespace std;

// 函数原型
void Simon(int); 

int main() {
    Simon(3); // 函数调用
    return 0;
}

// 函数定义
void Simon(int n) {
    cout << "Simon says touch your toes " << n << " times." << endl;
}
```

---

## 2.4 总结

### 本章核心概念

1. **程序结构**：`#include` -> `main()` -> `{ }`。
2. **I/O 系统**：`cout` 和 `cin`。
3. **变量**：声明 -> 赋值 -> 使用。
4. **函数**：原型 -> 调用 -> 定义。

### 下一章预告

第 3 章将深入探讨 C++ 处理数据的方式，包括各种基本数据类型、位、字节以及常量。

---

> 💡 **提示**：建议在本地创建源文件 `.cpp`，手动输入章节中的代码并编译运行，观察输出结果。
