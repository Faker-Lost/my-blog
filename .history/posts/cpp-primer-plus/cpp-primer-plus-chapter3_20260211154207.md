---
title: C++ Primer Plus 学习笔记 - 第3章 处理数据
date: 2026-02-10
excerpt: 深入理解 C++ 数据类型体系：整型家族、无符号类型、浮点数精度、算术运算符、类型转换，以及现代 C++ 的类型安全实践。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 4
---

## 本章概览

**Why This Matters**: C++ 是一门对类型要求严格的语言。选错类型会导致内存浪费、精度丢失、甚至程序崩溃。理解类型系统是写出高效、安全代码的基础。

**前置知识**: 学习本章前，建议先掌握第 2 章的变量声明和基本 I/O 操作。

**核心目标**：

- 掌握整型家族（`short`/`int`/`long`/`long long`）的选择原则
- 理解有符号与无符号类型的区别和溢出行为
- 避免浮点数精度陷阱（永远不要用 `==` 比较浮点数）
- 熟练使用类型转换（隐式 vs 显式）

```text
C++ 数据类型体系：
├── 整型 (Integer Types)
│   ├── short (≥16位) → int (≥16位) → long (≥32位) → long long (≥64位)
│   ├── unsigned 变体（仅非负数，范围翻倍）
│   ├── char（字符 = 小型整数）
│   └── bool（true/false）
│
├── 浮点型 (Floating-Point Types)
│   ├── float (6-7位精度)
│   ├── double (15-16位精度，默认)
│   └── long double (18-19位精度)
│
└── 修饰符与转换
    ├── const 限定符
    ├── 算术运算符 (+ - * / %)
    └── 类型转换（隐式 vs static_cast）
```

---

## 一、基础知识讲解 (Core Concepts)

### 1.1 变量的本质

变量就是一块**命名的内存**。声明变量时，编译器分配内存空间，变量名是这段内存的标签。

```cpp
// 完整示例 - 可直接编译运行
#include <iostream>
int main() {
    int age = 25;   // 分配 4 字节内存，贴上标签 "age"，写入 25
    std::cout << "Age: " << age << std::endl;
    return 0;
}
```

**位与字节**：

- **位 (bit)**：最小存储单位，值为 0 或 1
- **字节 (byte)**：C++ 中 `sizeof(char)` 始终为 1 字节，通常 1 字节 = 8 位
- **1 KB** = 1024 字节

### 1.2 变量命名规则

```cpp
// ✅ 合法
int playerScore;
double _value;
int item2count;

// ❌ 非法
int 2ndPlace;        // 数字开头
int my-var;          // 包含连字符
int return;          // C++ 关键字
int __internal;      // 双下划线开头（保留给编译器）
```

### 1.3 初始化方式

```cpp
int a = 5;        // C 风格
int b(10);        // 构造函数风格
int c{15};        // C++11 列表初始化（推荐）
int d = {20};     // C++11 列表初始化（带=号）
int e{};          // 零初始化，e = 0
```

> **推荐使用 `{}` 初始化**：它在发生窄化转换时会产生编译错误。

```cpp
int x = 3.14;     // ⚠️ 编译通过，但 x = 3，小数被截断
int y{3.14};      // ❌ 编译错误！不允许窄化转换
```

### 1.4 整型家族

C++ 提供多种整型，区别在于占用内存和表示范围。

| 类型 | 最小宽度 | 典型宽度 | 典型范围 |
| :--- | :--- | :--- | :--- |
| `short` | 16 位 | 16 位 | −32,768 ~ 32,767 |
| `int` | 16 位 | 32 位 | −2,147,483,648 ~ 2,147,483,647 |
| `long` | 32 位 | 32/64 位 | 至少 ±21 亿 |
| `long long` | 64 位 | 64 位 | ±922 京 |

```cpp
#include <iostream>
#include <climits>   // 整型限制常量
using namespace std;

int main() {
    cout << "int 大小: " << sizeof(int) << " 字节" << endl;
    cout << "int 范围: " << INT_MIN << " ~ " << INT_MAX << endl;
    return 0;
}
```

**典型输出**（64 位 Windows）：

```text
int 大小: 4 字节
int 范围: -2147483648 ~ 2147483647
```

### 1.5 无符号类型

加 `unsigned` 关键字，变量只能存储非负值，正数范围扩大一倍。

```cpp
short s = 32767;              // 有符号：−32,768 ~ 32,767
unsigned short us = 65535;    // 无符号：0 ~ 65,535
```

**溢出行为**：

```cpp
short s = 32767;
s = s + 1;           // ⚠️ 有符号溢出是未定义行为！

unsigned short us = 65535;
us = us + 1;         // ✅ 无符号溢出回绕到 0（定义良好）
```

### 1.6 整型字面值

```cpp
int dec = 42;     // 十进制
int oct = 042;    // 八进制（以 0 开头）→ 十进制 34
int hex = 0x42;   // 十六进制（以 0x 开头）→ 十进制 66
```

**字面值后缀**：

| 后缀 | 类型 | 示例 |
| :--- | :--- | :--- |
| 无 | `int` | `42` |
| `U` | `unsigned int` | `42U` |
| `L` | `long` | `42L` |
| `LL` | `long long` | `42LL` |
| `ULL` | `unsigned long long` | `42ULL` |

### 1.7 char 类型

`char` 用于存储字符，但本质是**小型整数**（通常 1 字节）。

```cpp
char ch = 'A';    // 存储的是 ASCII 码 65
int code = ch;    // 隐式转换为整数
cout << "字符: " << ch << endl;       // A
cout << "ASCII: " << code << endl;    // 65
cout << "A+1 = " << char(ch + 1) << endl;  // B
```

**转义序列**：

| 转义序列 | 含义 |
| :--- | :--- |
| `\n` | 换行 |
| `\t` | 制表符 |
| `\\` | 反斜杠 |
| `\'` | 单引号 |
| `\"` | 双引号 |
| `\0` | 空字符 |

### 1.8 bool 类型

`bool` 只有两个值：`true`（真）和 `false`（假）。

```cpp
bool isReady = true;
bool isDone  = false;

cout << isReady << endl;   // 1
cout << isDone << endl;    // 0

// 整数 → bool：非零为 true，零为 false
bool fromInt = 42;     // true
bool fromZero = 0;     // false

// bool → 整数：true 为 1，false 为 0
int num = true + true; // 2
```

### 1.9 const 限定符

`const` 创建**符号常量**——一旦初始化，不能再修改。

```cpp
const double PI = 3.14159;
// PI = 3.14;  // ❌ 编译错误！

const int UNINITIALIZED;  // ❌ const 必须在声明时初始化
```

**const vs #define**：

| 对比项 | `#define` | `const` |
| :--- | :--- | :--- |
| 类型检查 | ❌ 纯文本替换 | ✅ 完整类型检查 |
| 作用域 | 全局 | 遵循 C++ 作用域规则 |
| 调试 | ❌ 调试器看不到 | ✅ 可检查 |

> **最佳实践**：在 C++ 中，始终优先使用 `const` 而非 `#define`。

### 1.10 浮点数

浮点数用于表示带小数的数字。

| 类型 | 典型大小 | 有效数字位数 |
| :--- | :--- | :--- |
| `float` | 4 字节 | 6~7 位 |
| `double` | 8 字节 | 15~16 位 |
| `long double` | 8/12/16 字节 | 18~19 位 |

```cpp
double a = 3.14;       // 标准小数
double b = 3.14E2;     // 科学计数法 → 314.0
double c = 1.5e-3;     // → 0.0015

float  f = 3.14f;      // 后缀 f → float
long double ld = 3.14L; // 后缀 L → long double
// 默认无后缀 → double
```

**浮点精度陷阱**：

```cpp
double x = 0.1 + 0.2;
cout << (x == 0.3);    // 0（false！）
```

> **永远不要用 `==` 直接比较浮点数！** 正确做法：

```cpp
#include <cmath>

bool isEqual(double a, double b, double epsilon = 1e-9) {
    return fabs(a - b) < epsilon;
}
```

### 1.11 算术运算符

| 运算符 | 名称 | 示例 | 结果 |
| :--- | :--- | :--- | :--- |
| `+` | 加法 | `5 + 3` | `8` |
| `-` | 减法 | `5 - 3` | `2` |
| `*` | 乘法 | `5 * 3` | `15` |
| `/` | 除法 | `5 / 3` | `1`（整数除法） |
| `%` | 取模 | `5 % 3` | `2` |

**整数除法 vs 浮点除法**：

```cpp
cout << 9 / 4;       // 2（整数除法，截断）
cout << 9.0 / 4;     // 2.25（浮点除法）
cout << 9 % 4;       // 1（取模仅用于整数）
```

### 1.12 类型转换

#### 隐式转换（自动类型提升）

```text
提升规则（从低到高）：
bool → char → short → int → long → long long → float → double → long double
```

```cpp
int i = 10;
double d = 3.14;
auto result = i + d;  // i 提升为 double → result 为 double
```

#### 显式转换

```cpp
// C 风格（不推荐）
double avg = (double)total / count;

// C++ 风格（推荐）
double avg = static_cast<double>(total) / count;
```

---

## 二、进阶应用 (Modern C++ Practice)

### 2.1 用 `auto` 自动推导类型 (C++11)

```cpp
// 传统写法
std::vector<std::string>::iterator it = vec.begin();

// 现代写法
auto it = vec.begin();  // 编译器自动推导类型
```

### 2.2 用 `{} 初始化` 防止窄化转换 (C++11)

```cpp
// 传统写法 - 危险
int x = 3.14;     // ⚠️ 截断为 3，无警告

// 现代写法 - 安全
int y{3.14};      // ❌ 编译错误！禁止窄化转换
int z{3};         // ✅ 正确
```

### 2.3 用 `constexpr` 定义编译期常量 (C++11)

```cpp
// 传统 const - 运行时常量
const int size = getSize();

// 现代 constexpr - 编译期常量
constexpr int SIZE = 100;  // 必须在编译时可计算
constexpr double PI = 3.14159;
```

### 2.4 用 `std::numeric_limits` 代替 `climits` (C++11)

```cpp
#include <limits>

// 传统写法
#include <climits>
int max_int = INT_MAX;

// 现代写法
int max_int = std::numeric_limits<int>::max();
double max_double = std::numeric_limits<double>::max();
bool is_signed = std::numeric_limits<int>::is_signed;  // true
```

---

## 三、工程陷阱与避坑指南 (Engineering Pitfalls)

### 3.1 有符号整数溢出（未定义行为）

**现象**：程序崩溃、逻辑错误、安全漏洞。
**原因**：有符号整数溢出是**未定义行为**，编译器可以做任何事。

```cpp
int x = INT_MAX;
x = x + 1;    // ⚠️ 未定义行为！可能变成负数，也可能崩溃
```

**解决方案**：

- 使用更大的类型（`long long`）
- 使用无符号类型（如果确定不需要负数）
- 运算前检查边界

```cpp
if (x > INT_MAX - 1) {
    // 处理溢出
}
```

### 3.2 浮点数精度丢失

**现象**：`0.1 + 0.2 != 0.3`，金融计算出错。
**原因**：二进制无法精确表示某些十进制小数。

```cpp
double x = 0.1 + 0.2;
if (x == 0.3) {  // ❌ false！
    // 永远不会执行
}
```

**解决方案**：

```cpp
#include <cmath>

bool isEqual(double a, double b, double epsilon = 1e-9) {
    return fabs(a - b) < epsilon;
}

if (isEqual(x, 0.3)) {  // ✅ 正确
    // ...
}
```

### 3.3 整数除法截断

**现象**：`9 / 4` 得到 `2` 而不是 `2.25`。
**原因**：两个整数相除，结果是整数，小数部分被截断。

```cpp
int apples = 9;
int people = 4;
double avg = apples / people;  // ❌ 2.0（先算 9/4=2，再转 double）
```

**解决方案**：

```cpp
double avg = static_cast<double>(apples) / people;  // ✅ 2.25
```

### 3.4 char 的符号性不确定

**现象**：`char` 在不同平台上可能是有符号或无符号，导致跨平台 Bug。
**原因**：C++ 标准未规定 `char` 的符号性。

```cpp
char c = 200;
if (c > 0) {  // 可能为 true（无符号），也可能为 false（有符号）
    // ...
}
```

**解决方案**：明确指定 `signed char` 或 `unsigned char`。

```cpp
signed char sc = -10;     // 范围：-128 ~ 127
unsigned char uc = 200;   // 范围：0 ~ 255
```

---

## 四、面试高频考点 (Interview Focus)

### Q1: `int` 和 `long` 的大小在所有平台上都一样吗?

**答**：不一样。C++ 标准只规定了**最小宽度**和相对大小关系：

- `short` ≥ 16 位
- `int` ≥ 16 位
- `long` ≥ 32 位
- `long long` ≥ 64 位
- `short` ≤ `int` ≤ `long` ≤ `long long`

实际大小取决于平台。例如在 64 位 Windows 上，`int` 和 `long` 都是 32 位；在 64 位 Linux 上，`long` 是 64 位。

### Q2: 有符号溢出和无符号溢出有什么区别？

**答**：

- **有符号溢出**：**未定义行为**（Undefined Behavior），编译器可以做任何事，可能导致安全漏洞。
- **无符号溢出**：**定义良好**，会回绕（wrap around）。例如 `UINT_MAX + 1 = 0`。

### Q3: 为什么不能用 `==` 比较浮点数？

**答**：因为浮点数采用二进制表示，某些十进制小数（如 0.1）无法精确表示，运算会产生微小的舍入误差。正确做法是判断两个浮点数的差值是否小于一个极小的阈值（epsilon）。

```cpp
bool isEqual(double a, double b) {
    return fabs(a - b) < 1e-9;
}
```

---

## 五、总结与回顾 (Summary & Review)

### 核心记忆点

1. **整型选择**：默认用 `int`，需要更大范围用 `long long`，需要节省内存用 `short`
2. **无符号类型**：仅在确定不需要负数时使用（如数组索引、位运算）
3. **浮点数**：默认用 `double`，永远不要用 `==` 比较
4. **const vs #define**：C++ 中优先用 `const`，类型安全
5. **类型转换**：优先用 `static_cast<>`，避免 C 风格转换
6. **{} 初始化**：防止窄化转换，推荐使用
7. **整数除法**：两个整数相除结果是整数，需要浮点结果时先转换

### 数据类型快速参考

| 类型 | 字节 | 范围 | 用途 |
| :--- | :--- | :--- | :--- |
| `bool` | 1 | true/false | 逻辑判断 |
| `char` | 1 | −128 ~ 127 或 0 ~ 255 | 单个字符 |
| `short` | 2 | −32,768 ~ 32,767 | 节省内存的小整数 |
| `int` | 4 | ±21 亿 | **默认整数类型** |
| `long long` | 8 | ±922 京 | 超大整数 |
| `float` | 4 | 6位精度 | 节省内存的小数 |
| `double` | 8 | 15位精度 | **默认浮点类型** |

---

> **下一章预告**：第 4 章将介绍**复合类型**——数组、字符串、结构体和指针，这些是构建复杂数据结构的基础！
