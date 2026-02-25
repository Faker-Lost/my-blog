---
title: C++ Primer Plus 学习笔记 - 第5章 循环和关系表达式
date: 2026-02-11
excerpt: 掌握 C++ 的循环控制：for/while/do-while 循环、递增递减运算符、关系运算符、复合赋值运算符，以及文件输入输出的实战应用。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 6
---

## 本章概览

**Why This Matters**: 循环是程序的核心控制结构。无论是处理数组、读取文件、还是实现算法，都离不开循环。掌握循环和关系运算符，是从"写出程序"到"写好程序"的关键一步。

**前置知识**: 学习本章前，建议先掌握第 3 章的数据类型和第 4 章的数组。

**核心目标**：

- 掌握三种循环结构（`for`/`while`/`do-while`）的使用场景
- 理解递增递减运算符（`++`/`--`）的前缀与后缀区别
- 熟练使用关系运算符和逻辑运算符
- 学会使用 `cin.get()` 进行字符级输入和文件读取

```text
循环与控制结构：
├── 循环语句
│   ├── for 循环（已知次数）
│   ├── while 循环（条件驱动）
│   └── do-while 循环（至少执行一次）
│
├── 运算符
│   ├── 递增递减 (++/--)
│   ├── 关系运算符 (<, >, ==, !=)
│   ├── 逻辑运算符 (&&, ||, !)
│   └── 复合赋值 (+=, -=, *=, /=)
│
└── 高级应用
    ├── 嵌套循环与二维数组
    ├── 文件输入输出
    └── 字符级输入处理
```

---

## 一、基础知识讲解 (Core Concepts)

### 1.1 for 循环

`for` 循环适合**已知循环次数**的场景。

```cpp
// 完整示例 - 可直接编译运行
#include <iostream>
using namespace std;

int main() {
    // 基本 for 循环
    for (int i = 0; i < 5; i++) {
        cout << i << " ";  // 输出：0 1 2 3 4
    }
    cout << endl;
    
    // 遍历数组
    int arr[5] = {10, 20, 30, 40, 50};
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << " ";  // 输出：10 20 30 40 50
    }
    
    return 0;
}
```

**for 循环的三个部分**：

```cpp
for (初始化; 条件; 更新) {
    // 循环体
}
```

1. **初始化**：只执行一次（`int i = 0`）
2. **条件**：每次循环前检查（`i < 5`）
3. **更新**：每次循环后执行（`i++`）

### 1.2 表达式与语句

**表达式**：有值的代码片段。
**语句**：以分号结尾的完整指令。

```cpp
// 表达式
x + 5          // 值为 x+5
y = 10         // 值为 10（赋值表达式的值是右侧的值）
cout << "Hi"   // 值为 cout 对象本身（支持链式调用）

// 语句
int x = 5;     // 声明语句
x++;           // 表达式语句
;              // 空语句（合法但无意义）
```

### 1.3 递增与递减运算符

`++` 和 `--` 有**前缀**和**后缀**两种形式，行为不同。

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    
    // 前缀：先递增，再使用
    cout << ++x << endl;  // 输出 6，x 变为 6
    
    // 后缀：先使用，再递增
    int y = 5;
    cout << y++ << endl;  // 输出 5，y 变为 6
    cout << y << endl;    // 输出 6
    
    return 0;
}
```

**区别总结**：

| 形式 | 操作顺序 | 示例 | 结果 |
| :--- | :--- | :--- | :--- |
| `++x` | 先加 1，再使用 | `int a = ++x;` | `a` 和 `x` 都增加 |
| `x++` | 先使用，再加 1 | `int a = x++;` | `a` 是旧值，`x` 增加 |

### 1.4 复合赋值运算符

```cpp
int x = 10;

x += 5;   // 等价于 x = x + 5;   → 15
x -= 3;   // 等价于 x = x - 3;   → 12
x *= 2;   // 等价于 x = x * 2;   → 24
x /= 4;   // 等价于 x = x / 4;   → 6
x %= 5;   // 等价于 x = x % 5;   → 1
```

### 1.5 复合语句（代码块）

用 `{}` 将多条语句组合成一个复合语句。

```cpp
if (x > 0) {
    cout << "Positive";
    x = 0;
}  // 复合语句

for (int i = 0; i < 3; i++) {
    cout << i;
    cout << " ";
}  // 复合语句
```

### 1.6 逗号运算符

逗号运算符从左到右执行表达式，返回**最右侧**表达式的值。

```cpp
int x = (5, 10, 15);  // x = 15（最右侧的值）

// 常用于 for 循环
for (int i = 0, j = 10; i < j; i++, j--) {
    cout << i << " " << j << endl;
}
```

### 1.7 关系运算符

| 运算符 | 含义 | 示例 | 结果 |
| :--- | :--- | :--- | :--- |
| `<` | 小于 | `5 < 10` | `true` |
| `>` | 大于 | `5 > 10` | `false` |
| `<=` | 小于等于 | `5 <= 5` | `true` |
| `>=` | 大于等于 | `5 >= 10` | `false` |
| `==` | 等于 | `5 == 5` | `true` |
| `!=` | 不等于 | `5 != 10` | `true` |

**注意**：`=` 是赋值，`==` 是比较！

```cpp
int x = 5;
if (x = 10) {  // ❌ 错误！这是赋值，不是比较
    // 永远为 true（非零值）
}

if (x == 10) {  // ✅ 正确
    // 比较
}
```

### 1.8 while 循环

`while` 循环适合**条件驱动**的场景（不知道具体循环次数）。

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 1;
    
    // 计算 1+2+3+...+100
    int sum = 0;
    while (n <= 100) {
        sum += n;
        n++;
    }
    cout << "Sum = " << sum << endl;  // 5050
    
    return 0;
}
```

**for vs while**：

- `for`：已知循环次数（如遍历数组）
- `while`：条件驱动（如读取文件直到结束）

### 1.9 typedef 工具

`typedef` 为类型创建别名，提高代码可读性。

```cpp
typedef unsigned int uint;
typedef long long ll;

uint count = 100;  // 等价于 unsigned int count = 100;
ll bigNum = 1000000000LL;
```

### 1.10 do-while 循环

`do-while` 循环**至少执行一次**（先执行，再判断）。

```cpp
#include <iostream>
using namespace std;

int main() {
    int num;
    
    do {
        cout << "请输入正数（输入负数退出）：";
        cin >> num;
    } while (num >= 0);  // 条件为 false 时退出
    
    cout << "程序结束" << endl;
    return 0;
}
```

**while vs do-while**：

- `while`：先判断，可能一次都不执行
- `do-while`：先执行，至少执行一次

### 1.11 字符输入方法 get()

`cin.get()` 用于**字符级输入**，可以读取空格和换行符。

```cpp
#include <iostream>
using namespace std;

int main() {
    char ch;
    
    // 方法 1：cin.get(ch)
    cout << "输入一个字符：";
    cin.get(ch);
    cout << "你输入了：" << ch << endl;
    
    // 方法 2：ch = cin.get()
    cout << "再输入一个字符：";
    ch = cin.get();
    cout << "你输入了：" << ch << endl;
    
    return 0;
}
```

**cin vs cin.get()**：

| 方法 | 读取空格 | 读取换行符 | 用途 |
| :--- | :--- | :--- | :--- |
| `cin >>` | ❌ 跳过 | ❌ 跳过 | 读取单词、数字 |
| `cin.get()` | ✅ 读取 | ✅ 读取 | 逐字符读取 |

### 1.12 文件尾条件 (EOF)

使用 `cin.get()` 读取文件时，可以检测文件尾。

```cpp
#include <iostream>
using namespace std;

int main() {
    char ch;
    int count = 0;
    
    // 读取直到文件尾（Ctrl+Z on Windows, Ctrl+D on Linux）
    while (cin.get(ch)) {  // cin.get() 返回 false 表示文件尾
        count++;
    }
    
    cout << "共读取 " << count << " 个字符" << endl;
    return 0;
}
```

### 1.13 嵌套循环与二维数组

```cpp
#include <iostream>
using namespace std;

int main() {
    // 二维数组
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    
    // 嵌套循环遍历
    for (int i = 0; i < 3; i++) {        // 行
        for (int j = 0; j < 4; j++) {    // 列
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

**输出**：

```text
1 2 3 4 
5 6 7 8 
9 10 11 12 
```

---

## 二、进阶应用 (Modern C++ Practice)

### 2.1 用范围 for 循环简化遍历 (C++11)

```cpp
// 传统写法
int arr[5] = {1, 2, 3, 4, 5};
for (int i = 0; i < 5; i++) {
    cout << arr[i] << " ";
}

// 现代写法（更简洁）
for (int num : arr) {
    cout << num << " ";
}

// 引用版本（可修改元素）
for (int& num : arr) {
    num *= 2;  // 每个元素乘以 2
}
```

### 2.2 用 `auto` 简化类型声明 (C++11)

```cpp
#include <vector>
using namespace std;

vector<int> vec = {1, 2, 3, 4, 5};

// 传统写法
for (vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
    cout << *it << " ";
}

// 现代写法
for (auto it = vec.begin(); it != vec.end(); ++it) {
    cout << *it << " ";
}

// 更现代的写法
for (auto num : vec) {
    cout << num << " ";
}
```

### 2.3 用 `constexpr` 定义编译期常量 (C++11)

```cpp
// 传统写法
const int SIZE = 100;

// 现代写法（保证编译期计算）
constexpr int SIZE = 100;
constexpr int DOUBLE_SIZE = SIZE * 2;  // 编译期计算
```

### 2.4 用 `std::array` 代替原生数组 (C++11)

```cpp
#include <array>
using namespace std;

// 传统写法
int arr[5] = {1, 2, 3, 4, 5};

// 现代写法
array<int, 5> arr = {1, 2, 3, 4, 5};

// 优势：支持 .size()、边界检查等
for (size_t i = 0; i < arr.size(); i++) {
    cout << arr.at(i) << " ";  // at() 会做边界检查
}
```

---

## 三、工程陷阱与避坑指南 (Engineering Pitfalls)

### 3.1 死循环（条件永远为真）

**现象**：程序卡死，CPU 占用 100%。
**原因**：循环条件永远不会变为 `false`。

```cpp
// ❌ 错误示例
int i = 0;
while (i < 10) {
    cout << i << endl;
    // 忘记 i++，i 永远是 0
}

// ✅ 正确
int i = 0;
while (i < 10) {
    cout << i << endl;
    i++;  // 必须更新循环变量
}
```

### 3.2 混淆 `=` 和 `==`

**现象**：条件判断总是为真，逻辑错误。
**原因**：误用赋值运算符 `=` 代替比较运算符 `==`。

```cpp
int x = 5;

if (x = 10) {  // ❌ 这是赋值！x 变成 10，条件永远为 true
    cout << "x is 10";
}

if (x == 10) {  // ✅ 正确的比较
    cout << "x is 10";
}
```

**解决方案**：养成写 `if (10 == x)` 的习惯（常量在左），这样写错会编译报错。

### 3.3 前缀 vs 后缀递增的性能差异

**现象**：在循环中使用 `i++` 可能比 `++i` 慢（对于复杂类型）。
**原因**：后缀递增需要创建临时对象保存旧值。

```cpp
// 对于 int，性能差异可忽略
for (int i = 0; i < 1000; i++) {}   // 后缀
for (int i = 0; i < 1000; ++i) {}   // 前缀（推荐）

// 对于迭代器等复杂类型，前缀更高效
for (auto it = vec.begin(); it != vec.end(); ++it) {}  // ✅ 推荐
for (auto it = vec.begin(); it != vec.end(); it++) {}  // ⚠️ 稍慢
```

**最佳实践**：养成使用 `++i` 的习惯。

### 3.4 浮点数作为循环计数器

**现象**：循环次数不符合预期，可能多一次或少一次。
**原因**：浮点数精度误差累积。

```cpp
// ❌ 危险
for (double d = 0.0; d != 1.0; d += 0.1) {
    cout << d << endl;
    // 可能永远不会等于 1.0（精度误差）
}

// ✅ 正确
for (int i = 0; i < 10; i++) {
    double d = i * 0.1;
    cout << d << endl;
}
```

---

## 四、面试高频考点 (Interview Focus)

### Q1: `++i` 和 `i++` 有什么区别？

**答**：

- **`++i`（前缀）**：先递增，再返回递增后的值
- **`i++`（后缀）**：先返回当前值，再递增

```cpp
int i = 5;
int a = ++i;  // a = 6, i = 6
int b = i++;  // b = 6, i = 7
```

**性能**：对于基本类型（`int`）差异可忽略，但对于复杂类型（迭代器、自定义类），前缀更高效（不需要创建临时对象）。

### Q2: `for`、`while`、`do-while` 如何选择？

**答**：

| 循环类型 | 使用场景 | 特点 |
| :--- | :--- | :--- |
| `for` | 已知循环次数 | 遍历数组、计数循环 |
| `while` | 条件驱动 | 读取文件、用户输入验证 |
| `do-while` | 至少执行一次 | 菜单系统、输入验证 |

### Q3: 如何避免死循环？

**答**：

1. **确保循环条件会变化**：循环变量必须在循环体内更新
2. **设置最大迭代次数**：防止意外的无限循环
3. **使用调试器**：单步执行检查循环逻辑
4. **添加日志**：输出循环变量的值

```cpp
// 安全的循环模式
int maxIterations = 1000;
int count = 0;
while (condition && count < maxIterations) {
    // ...
    count++;
}
```

---

## 五、总结与回顾 (Summary & Review)

### 核心记忆点

1. **for 循环**：已知次数，三部分（初始化、条件、更新）
2. **while 循环**：条件驱动，先判断再执行
3. **do-while 循环**：至少执行一次，先执行再判断
4. **递增递减**：`++i` 前缀（先加后用），`i++` 后缀（先用后加）
5. **关系运算符**：`==` 是比较，`=` 是赋值
6. **复合赋值**：`+=`、`-=`、`*=`、`/=`、`%=`
7. **cin.get()**：字符级输入，可读取空格和换行符
8. **范围 for**：C++11 新特性，简化数组遍历

### 循环选择速查表

| 场景 | 推荐循环 | 示例 |
| :--- | :--- | :--- |
| 遍历数组 | `for` 或范围 `for` | `for (int i = 0; i < n; i++)` |
| 读取文件 | `while` | `while (cin.get(ch))` |
| 菜单系统 | `do-while` | `do { ... } while (choice != 0);` |
| 条件未知 | `while` | `while (condition)` |

---

> **下一章预告**：第 6 章将介绍**分支语句和逻辑运算符**（`if`/`else`/`switch`/`&&`/`||`），让程序能够做出智能决策！
