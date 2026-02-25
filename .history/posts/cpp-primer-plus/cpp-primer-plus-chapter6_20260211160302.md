---
title: C++ Primer Plus 学习笔记 - 第6章 分支语句和逻辑运算符
date: 2026-02-11
excerpt: 掌握 C++ 的条件控制：if/else 语句、逻辑运算符、switch 语句、条件运算符、cctype 字符函数库，以及文件输入输出的实战应用。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 7
---

## 本章概览

**Why This Matters**: 程序需要根据不同条件做出不同决策。分支语句是实现程序逻辑的核心，从简单的用户输入验证到复杂的业务逻辑，都离不开条件判断。

**前置知识**: 学习本章前，建议先掌握第 5 章的循环和关系运算符。

**核心目标**：

- 掌握 `if`/`else` 和 `switch` 语句的使用场景
- 熟练使用逻辑运算符（`&&`/`||`/`!`）
- 学会使用 `cctype` 字符函数库处理字符
- 理解 `break` 和 `continue` 的区别
- 掌握文件输入输出的基本操作

```text
分支控制结构：
├── 条件语句
│   ├── if 语句（单分支）
│   ├── if-else 语句（双分支）
│   ├── if-else if-else（多分支）
│   └── switch 语句（多路分支）
│
├── 逻辑运算符
│   ├── && (逻辑与)
│   ├── || (逻辑或)
│   └── ! (逻辑非)
│
├── 控制语句
│   ├── break（跳出循环/switch）
│   └── continue（跳过本次循环）
│
└── 高级应用
    ├── 条件运算符 (?:)
    ├── cctype 字符处理
    └── 文件输入输出
```

---

## 一、基础知识讲解 (Core Concepts)

### 1.1 if 语句

`if` 语句用于**单分支判断**。

```cpp
// 完整示例 - 可直接编译运行
#include <iostream>
using namespace std;

int main() {
    int score = 85;
    
    // 单行语句可以省略大括号（但不推荐）
    if (score >= 60)
        cout << "及格" << endl;
    
    // 推荐写法：始终使用大括号
    if (score >= 90) {
        cout << "优秀！" << endl;
        cout << "继续保持！" << endl;
    }
    
    return 0;
}
```

### 1.2 if-else 语句

`if-else` 用于**双分支判断**。

```cpp
#include <iostream>
using namespace std;

int main() {
    int age;
    cout << "请输入年龄：";
    cin >> age;
    
    if (age >= 18) {
        cout << "成年人" << endl;
    } else {
        cout << "未成年人" << endl;
    }
    
    return 0;
}
```

### 1.3 if-else if-else（多分支）

```cpp
#include <iostream>
using namespace std;

int main() {
    int score;
    cout << "请输入成绩：";
    cin >> score;
    
    if (score >= 90) {
        cout << "A" << endl;
    } else if (score >= 80) {
        cout << "B" << endl;
    } else if (score >= 70) {
        cout << "C" << endl;
    } else if (score >= 60) {
        cout << "D" << endl;
    } else {
        cout << "F" << endl;
    }
    
    return 0;
}
```

### 1.4 逻辑运算符

| 运算符 | 含义 | 示例 | 结果 |
| :--- | :--- | :--- | :--- |
| `&&` | 逻辑与（AND） | `true && false` | `false` |
| `||` | 逻辑或（OR） | `true || false` | `true` |
| `!` | 逻辑非（NOT） | `!true` | `false` |

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 25;
    bool hasLicense = true;
    
    // 逻辑与：两个条件都为真
    if (age >= 18 && hasLicense) {
        cout << "可以开车" << endl;
    }
    
    // 逻辑或：至少一个条件为真
    if (age < 18 || !hasLicense) {
        cout << "不能开车" << endl;
    }
    
    // 逻辑非：取反
    if (!hasLicense) {
        cout << "没有驾照" << endl;
    }
    
    return 0;
}
```

**短路求值**：

```cpp
int x = 5;

// && 短路：如果左侧为 false，右侧不执行
if (x > 10 && ++x > 0) {
    // ++x 不会执行，因为 x > 10 为 false
}
cout << x;  // 5（未递增）

// || 短路：如果左侧为 true，右侧不执行
if (x < 10 || ++x > 0) {
    // ++x 不会执行，因为 x < 10 为 true
}
cout << x;  // 5（未递增）
```

### 1.5 cctype 字符函数库

`<cctype>` 提供了一组字符处理函数。

| 函数 | 功能 | 示例 |
| :--- | :--- | :--- |
| `isalpha(c)` | 是否为字母 | `isalpha('A')` → `true` |
| `isdigit(c)` | 是否为数字 | `isdigit('5')` → `true` |
| `isalnum(c)` | 是否为字母或数字 | `isalnum('a')` → `true` |
| `isspace(c)` | 是否为空白字符 | `isspace(' ')` → `true` |
| `isupper(c)` | 是否为大写字母 | `isupper('A')` → `true` |
| `islower(c)` | 是否为小写字母 | `islower('a')` → `true` |
| `toupper(c)` | 转换为大写 | `toupper('a')` → `'A'` |
| `tolower(c)` | 转换为小写 | `tolower('A')` → `'a'` |

```cpp
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    char ch;
    cout << "输入一个字符：";
    cin >> ch;
    
    if (isalpha(ch)) {
        cout << "这是字母" << endl;
        if (isupper(ch)) {
            cout << "大写字母，转为小写：" << (char)tolower(ch) << endl;
        } else {
            cout << "小写字母，转为大写：" << (char)toupper(ch) << endl;
        }
    } else if (isdigit(ch)) {
        cout << "这是数字" << endl;
    } else {
        cout << "这是特殊字符" << endl;
    }
    
    return 0;
}
```

### 1.6 条件运算符 (?:)

三元运算符 `?:` 是 `if-else` 的简洁形式。

```cpp
// 语法：条件 ? 表达式1 : 表达式2

int a = 10, b = 20;

// 传统 if-else
int max;
if (a > b) {
    max = a;
} else {
    max = b;
}

// 条件运算符（更简洁）
int max = (a > b) ? a : b;

// 实际应用
cout << "较大值是：" << ((a > b) ? a : b) << endl;
```

### 1.7 switch 语句

`switch` 用于**多路分支**，适合基于整数或字符的选择。

```cpp
#include <iostream>
using namespace std;

int main() {
    char grade;
    cout << "输入成绩等级（A/B/C/D/F）：";
    cin >> grade;
    
    switch (grade) {
        case 'A':
        case 'a':  // 可以多个 case 共享代码
            cout << "优秀！90-100 分" << endl;
            break;  // 必须 break，否则会继续执行下一个 case
        case 'B':
        case 'b':
            cout << "良好！80-89 分" << endl;
            break;
        case 'C':
        case 'c':
            cout << "中等！70-79 分" << endl;
            break;
        case 'D':
        case 'd':
            cout << "及格！60-69 分" << endl;
            break;
        case 'F':
        case 'f':
            cout << "不及格！0-59 分" << endl;
            break;
        default:  // 可选，处理其他情况
            cout << "无效输入" << endl;
    }
    
    return 0;
}
```

**switch vs if-else**：

| 特性 | `switch` | `if-else` |
| :--- | :--- | :--- |
| 条件类型 | 整数、字符、枚举 | 任意布尔表达式 |
| 可读性 | 多路分支更清晰 | 复杂条件更灵活 |
| 性能 | 编译器可能优化为跳转表 | 逐个判断 |

### 1.8 break 语句

`break` 用于**跳出循环**或 `switch` 语句。

```cpp
// 跳出循环
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // 跳出循环
    }
    cout << i << " ";  // 输出：0 1 2 3 4
}

// 跳出 switch
switch (choice) {
    case 1:
        cout << "选项 1" << endl;
        break;  // 跳出 switch
    case 2:
        cout << "选项 2" << endl;
        break;
}
```

### 1.9 continue 语句

`continue` 用于**跳过本次循环**，继续下一次循环。

```cpp
// 跳过偶数
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // 跳过偶数
    }
    cout << i << " ";  // 输出：1 3 5 7 9
}
```

**break vs continue**：

| 语句 | 作用 | 示例 |
| :--- | :--- | :--- |
| `break` | 跳出整个循环 | 找到目标后退出 |
| `continue` | 跳过本次循环 | 跳过无效数据 |

### 1.10 读取数字的循环

处理用户输入时，需要验证输入是否有效。

```cpp
#include <iostream>
using namespace std;

int main() {
    int num;
    
    cout << "请输入一个整数：";
    while (!(cin >> num)) {  // 输入失败时循环
        cin.clear();  // 清除错误标志
        cin.ignore(1000, '\n');  // 清空缓冲区
        cout << "输入无效，请重新输入：";
    }
    
    cout << "你输入的数字是：" << num << endl;
    return 0;
}
```

### 1.11 基本文件输入输出

使用 `<fstream>` 进行文件操作。

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    // 写入文件
    ofstream outFile("output.txt");  // 创建输出文件流
    if (!outFile.is_open()) {
        cout << "无法打开文件" << endl;
        return 1;
    }
    
    outFile << "Hello, File!" << endl;
    outFile << "第二行内容" << endl;
    outFile.close();  // 关闭文件
    
    // 读取文件
    ifstream inFile("output.txt");  // 创建输入文件流
    if (!inFile.is_open()) {
        cout << "无法打开文件" << endl;
        return 1;
    }
    
    string line;
    while (getline(inFile, line)) {  // 逐行读取
        cout << line << endl;
    }
    inFile.close();
    
    return 0;
}
```

---

## 二、进阶应用 (Modern C++ Practice)

### 2.1 用 `constexpr if` 编译期分支 (C++17)

```cpp
template<typename T>
void process(T value) {
    if constexpr (std::is_integral_v<T>) {
        // 编译期判断：如果是整数类型
        cout << "整数：" << value << endl;
    } else if constexpr (std::is_floating_point_v<T>) {
        // 编译期判断：如果是浮点类型
        cout << "浮点数：" << value << endl;
    } else {
        cout << "其他类型" << endl;
    }
}
```

### 2.2 用 `std::optional` 处理可选值 (C++17)

```cpp
#include <optional>
#include <iostream>
using namespace std;

optional<int> divide(int a, int b) {
    if (b == 0) {
        return nullopt;  // 返回空值
    }
    return a / b;
}

int main() {
    auto result = divide(10, 2);
    
    if (result.has_value()) {
        cout << "结果：" << result.value() << endl;
    } else {
        cout << "除数为零" << endl;
    }
    
    return 0;
}
```

### 2.3 用 `std::filesystem` 处理文件 (C++17)

```cpp
#include <filesystem>
#include <iostream>
namespace fs = std::filesystem;

int main() {
    if (fs::exists("output.txt")) {
        cout << "文件存在" << endl;
        cout << "文件大小：" << fs::file_size("output.txt") << " 字节" << endl;
    } else {
        cout << "文件不存在" << endl;
    }
    
    return 0;
}
```

### 2.4 用 `switch` 初始化语句 (C++17)

```cpp
// C++17 允许在 switch 中初始化变量
switch (int status = getStatus(); status) {
    case 0:
        cout << "成功" << endl;
        break;
    case 1:
        cout << "警告" << endl;
        break;
    default:
        cout << "错误" << endl;
}
```

---

## 三、工程陷阱与避坑指南 (Engineering Pitfalls)

### 3.1 switch 忘记 break 导致穿透

**现象**：执行完一个 `case` 后继续执行下一个 `case`。
**原因**：忘记写 `break`。

```cpp
int choice = 1;

switch (choice) {
    case 1:
        cout << "选项 1" << endl;
        // ❌ 忘记 break，会继续执行 case 2
    case 2:
        cout << "选项 2" << endl;
        break;
}

// 输出：
// 选项 1
// 选项 2
```

**解决方案**：每个 `case` 都加 `break`（除非故意穿透）。

### 3.2 浮点数比较使用 ==

**现象**：`if (x == 0.3)` 永远为 `false`。
**原因**：浮点数精度误差。

```cpp
double x = 0.1 + 0.2;

if (x == 0.3) {  // ❌ false！
    cout << "相等" << endl;
}

// ✅ 正确做法
const double EPSILON = 1e-9;
if (fabs(x - 0.3) < EPSILON) {
    cout << "相等" << endl;
}
```

### 3.3 逻辑运算符优先级陷阱

**现象**：条件判断结果不符合预期。
**原因**：运算符优先级理解错误。

```cpp
int x = 5;

// ❌ 错误：! 优先级高于 ==
if (!x == 0) {  // 等价于 (!x) == 0，即 false == 0
    // 永远不会执行
}

// ✅ 正确
if (!(x == 0)) {
    // 或者
}
if (x != 0) {
    // 更简洁
}
```

**运算符优先级**（从高到低）：

1. `!`（逻辑非）
2. `<`, `>`, `<=`, `>=`（关系运算符）
3. `==`, `!=`（相等运算符）
4. `&&`（逻辑与）
5. `||`（逻辑或）

### 3.4 文件流未检查打开状态

**现象**：程序崩溃或产生错误数据。
**原因**：文件打开失败但继续操作。

```cpp
ofstream outFile("output.txt");

// ❌ 未检查文件是否打开成功
outFile << "Data";  // 如果打开失败，写入无效

// ✅ 正确做法
if (!outFile.is_open()) {
    cerr << "无法打开文件" << endl;
    return 1;
}
outFile << "Data";
```

---

## 四、面试高频考点 (Interview Focus)

### Q1: `break` 和 `continue` 有什么区别？

**答**：

- **`break`**：跳出整个循环或 `switch` 语句，不再执行后续迭代
- **`continue`**：跳过本次循环的剩余代码，直接进入下一次迭代

```cpp
for (int i = 0; i < 5; i++) {
    if (i == 2) break;     // 输出：0 1
    cout << i << " ";
}

for (int i = 0; i < 5; i++) {
    if (i == 2) continue;  // 输出：0 1 3 4
    cout << i << " ";
}
```

### Q2: `switch` 和 `if-else` 如何选择？

**答**：

| 场景 | 推荐 | 原因 |
| :--- | :--- | :--- |
| 基于整数/字符的多路分支 | `switch` | 更清晰，可能有性能优化 |
| 复杂条件（范围判断、逻辑运算） | `if-else` | 更灵活 |
| 少于 3 个分支 | `if-else` | 更简洁 |

### Q3: 逻辑运算符的短路求值是什么？

**答**：短路求值是指逻辑运算符在确定结果后，不再计算后续表达式。

- **`&&`**：如果左侧为 `false`，右侧不执行
- **`||`**：如果左侧为 `true`，右侧不执行

```cpp
int x = 0;

// && 短路
if (x != 0 && 10 / x > 1) {  // ✅ 安全，不会除以零
    // ...
}

// || 短路
if (x == 0 || 10 / x > 1) {  // ✅ 安全，x==0 时不执行除法
    // ...
}
```

---

## 五、总结与回顾 (Summary & Review)

### 核心记忆点

1. **if-else**：双分支判断，`if (条件) { ... } else { ... }`
2. **switch**：多路分支，适合整数/字符，必须 `break`
3. **逻辑运算符**：`&&`（与）、`||`（或）、`!`（非），支持短路求值
4. **条件运算符**：`条件 ? 值1 : 值2`，简洁的 `if-else`
5. **break**：跳出循环/switch
6. **continue**：跳过本次循环
7. **cctype**：`isalpha()`、`isdigit()`、`toupper()`、`tolower()`
8. **文件 I/O**：`ofstream` 写入，`ifstream` 读取，检查 `is_open()`

### 分支语句选择指南

| 场景 | 推荐语句 | 示例 |
| :--- | :--- | :--- |
| 单条件判断 | `if` | `if (x > 0) { ... }` |
| 二选一 | `if-else` | `if (x > 0) { ... } else { ... }` |
| 多条件（复杂） | `if-else if` | 成绩等级判断 |
| 多条件（简单） | `switch` | 菜单选择 |
| 简单二选一 | `?:` | `max = (a > b) ? a : b;` |

---

> **下一章预告**：第 7 章将介绍**函数**——C++ 的编程模块，学习如何组织代码、参数传递、函数重载等核心概念！
