---
title: C++ Primer Plus 学习笔记 - 第4章 复合类型
date: 2026-02-11
excerpt: 详解 C++ 复合数据类型：数组、C 风格字符串与 std::string、结构体 (struct)、共用体 (union)、枚举 (enum)，以及核心难点——指针与动态内存管理 (new/delete)。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 5
---

## 本章概览

在第 3 章中我们学习了整数和浮点数等基本类型。第 4 章将介绍如何利用这些基本类型构建更复杂的**复合类型**。

本章核心内容：

- **数组 (Arrays)**：存储多个同类型数据
- **字符串 (Strings)**：处理文本（C 风格与 `std::string`）
- **结构体 (Structures)**：存储多个不同类型数据
- **共用体 (Unions)**：节省内存的变体
- **枚举 (Enumerations)**：符号常量集合
- **指针 (Pointers)**：C++ 的灵魂，直接操作内存
- **动态内存 (Dynamic Memory)**：`new` 和 `delete`

```text
复合类型体系：
├── 静态绑定（编译时确定）
│   ├── 数组 (int arr[10])
│   ├── 结构体 (struct)
│   ├── 枚举 (enum)
│   └── 共用体 (union)
│
└── 动态绑定（运行时确定）
    ├── 指针 (int* p)
    └── 动态数组 (new int[10])
```

---

## 4.1 数组 (Arrays)

数组是一种数据格式，能够存储多个**同类型**的值。

### 声明与初始化

声明数组需要指定三点：

1. 存储在每个元素中的值的**类型**
2. 数组的**名称**
3. 数组中的**元素数**

```cpp
short months[12];       // 创建一个包含 12 个 short 的数组
int yams[3] = {7, 8, 6}; // 创建并初始化
```

> **注意**：数组大小必须是**整型常量**（或 `const` 值，或字面值），不能是变量（C99 支持变长数组，但 C++ 标准只支持静态数组，动态数组需用 `new`）。

### 访问元素

通过**下标（索引）**访问元素，下标从 **0** 开始。

```cpp
#include <iostream>
int main() {
    using namespace std;
    int yams[3];
    yams[0] = 7;
    yams[1] = 8;
    yams[2] = 6;

    cout << "Total yams = " << yams[0] + yams[1] + yams[2] << endl;
    
    // ⚠️ 越界访问是未定义行为！编译器通常不会报错，但会导致程序崩溃或数据损坏。
    // yams[3] = 10; // DANGER!
    return 0;
}
```

### 初始化规则

1. **列表初始化**：

    ```cpp
    int cards[4] = {3, 6, 8, 10};       // 列表初始化
    int hand[4];                        // 声明
    // hand[4] = {5, 6, 7, 9};          // ❌ 错误！不能将数组赋给数组
    ```

2. **部分初始化**：提供的值少于元素数，剩余元素初始化为 **0**。

    ```cpp
    long totals[500] = {0};             // 全部初始化为 0（极其常用！）
    float balances[100] = {12.5f};      // 第一个为 12.5，其余为 0
    ```

3. **自动推断大小**：

    ```cpp
    short things[] = {1, 5, 3, 8};      // 编译器自动计算为 size=4
    ```

4. **C++11 列表初始化（省略 `=`）**：

    ```cpp
    double earnings[4] {1.2e4, 1.6e4, 1.1e4, 1.7e4}; // 省略等号
    unsigned int counts[10] {};         // 空大括号 -> 全部为 0
    ```

---

## 4.2 字符串 (Strings)

C++ 处理字符串有两种方式：

1. **C 风格字符串**（基于 char 数组）
2. **string 类库**（基于 `std::string`，强烈推荐）

### C 风格字符串

C 风格字符串不仅仅是 char 数组，它必须以**空字符 (`\0`, ASCII 0)** 结尾。

```cpp
char dog[8] = {'b', 'e', 'a', 'u', 'x', ' ', 'I', 'I'}; // 只是字符数组，不是字符串！
char cat[8] = {'f', 'a', 't', 'e', 's', 's', 'a', '\0'}; // 是字符串
```

#### 更简洁的初始化（字符串常量）

```cpp
char bird[11] = "Mr. Cheeps";   // 自动添加 \0
char fish[] = "Bubbles";        // 自动计算大小（7字符 + 1个\0 = 8）
```

> **注意**：用引号括起的字符串隐式包含结尾的 `\0`。如果数组太小装不下，会导致编译错误或更严重的内存问题。

#### 输入问题

```cpp
char name[20];
cin >> name; // 如果输入 "New York"，name 只会存 "New"，"York" 留在缓冲区
```

**解决方案：面向行的输入**

| 方法 | 语法 | 特点 |
| :--- | :--- | :--- |
| `getline()` | `cin.getline(arr, size)` | 读取并在缓冲区丢弃换行符 |
| `get()` | `cin.get(arr, size)` | 读取并将换行符**留**在缓冲区 |

```cpp
const int Size = 20;
char name[Size];
char dessert[Size];

cout << "Enter name:\n";
cin.getline(name, Size);  // 读取一行，丢弃换行符

cout << "Enter dessert:\n";
cin.get(dessert, Size);   // 读取一行，换行符留在队列
cin.get();                // 读取并丢弃那个换行符（否则下一次读取会直接读到空行）
```

### string 类 (std::string)

C++ 提供的 `std::string` 类让字符串处理变得像简单变量一样容易。需包含头文件 `<string>`。

```cpp
#include <string>
using namespace std;

string str1;                // 长度为 0
string str2 = "panther";
string str3;
str3 = str1 + str2;        // 拼接！不再需要 strcat
str1 += " paste";          // 追加！
int len = str1.size();     // 获取长度！不再需要 strlen
```

**输入 string**：
使用 `getline(cin, str)` 函数（注意不是 `cin.getline`）。

```cpp
string str;
getline(cin, str); // 自动调整大小以容纳输入
```

---

## 4.3 结构体 (Structures)

结构体可以存储多个**不同类型**的数据。

```cpp
struct Inflatable {
    char name[20];
    float volume;
    double price;
};

int main() {
    Inflatable guest = {"Glorious Gloria", 1.88, 29.99}; // 列表初始化
    
    // 访问成员使用 . 运算符
    cout << guest.name << ": $" << guest.price << endl;
    
    // 结构体赋值
    Inflatable choice;
    choice = guest; // ✅ 允许直接赋值（成员逐个复制），数组做不到这一点！
    return 0;
}
```

---

## 4.4 共用体 (Unions)

共用体（union）能够存储不同的数据类型，但**同一时间只能存储其中一种**。所有成员共享同一块内存。

```cpp
union One4All { // 可能会存储 int, long 或 double
    int int_val;
    long long_val;
    double double_val;
};

One4All pail;
pail.int_val = 15;        // 存储 int
cout << pail.int_val;
pail.double_val = 1.38;   // 存储 double，int_val 的值丢失！
```

**用途**：主要用于节省内存（嵌入式系统）或解析二进制数据格式。

---

## 4.5 枚举 (Enumerations)

`enum` 提供了一种创建符号常量的方式，可代替 `const`。

```cpp
enum Spectrum { Red, Orange, Yellow, Green, Blue, Violet, Indigo, Ultraviolet };
// Red=0, Orange=1, Yellow=2 ...

Spectrum band = Blue;
// band = 2000;           // ❌ 错误，只能赋枚举值
// band = Orange + Red;   // ❌ 错误，枚举没有定义算术运算
int a = Blue;             // ✅ 枚举可以隐式转为 int
```

### 设置特定值

```cpp
enum Bits { One = 1, Two = 2, Four = 4, Eight = 8 };
```

---

## 4.6 指针 (Pointers) —— C++ 的灵魂

指针是一个变量，其存储的值是**内存地址**。

### 核心运算符

- **地址运算符 (`&`)**：获取变量的地址。
- **解引用运算符 (`*`)**：获取指针指向地址处的值。

```cpp
int updates = 6;
int *p_updates;     // 声明一个指向 int 的指针
p_updates = &updates; // 将 updates 的地址赋给指针

cout << "Values: updates = " << updates;
cout << ", *p_updates = " << *p_updates << endl; // 6

cout << "Addresses: &updates = " << &updates;
cout << ", p_updates = " << p_updates << endl;   // 0x006FF...

*p_updates = *p_updates + 1; // 修改指针指向的值
cout << "Now updates = " << updates << endl;     // 7
```

### 危险：未初始化的指针

```cpp
long *fellow;
*fellow = 223323; // ❌ 及其危险！fellow 指向哪里是未知的，可能覆盖系统关键数据。
```

> **原则**：在对指针使用 `*` 运算符之前，必须确保它被初始化为指向一个确定的、合法的内存地址。

---

## 4.7 动态内存 (new 和 delete)

指针真正的威力在于运行阶段分配未命名的内存。

### 使用 new 分配内存

```cpp
int *pn = new int;    // 分配适合存储 int 的内存，返回地址
*pn = 1001;           // 赋值
```

### 使用 delete 释放内存

```cpp
delete pn;            // 释放 pn 指向的内存
```

**重要规则**：

1. 不要使用 `delete` 释放不是 `new` 分配的内存。
2. 不要使用 `delete` 释放同一个内存块两次。
3. 如果使用 `new []` 为数组分配内存，则应使用 `delete []` 释放。
4. 对空指针 (`nullptr`) 应用 `delete` 是安全的。

### 动态数组

```cpp
int *psome = new int[10]; // 分配 10 个 int 的块
// 访问动态数组，就像使用数组名一样
psome[0] = 100;
psome[1] = 200;

cout << "psome[0] is " << psome[0] << endl;

psome = psome + 1; // 指针可以修改指向！数组名不可以。
// 现在 psome[0] 实际上是原来的 psome[1]

psome = psome - 1; // 指回开头，准备 delete
delete [] psome;   // 释放整个块
```

---

## 4.8 指针算术与数组

在 C++ 中，**数组名被解释为数组第一个元素的地址**。

```cpp
double wages[3] = {10000.0, 20000.0, 30000.0};
double *pw = wages; // 数组名 = 地址

// 以下三者等价：
// wages[1]
// *(wages + 1)
// pw[1]
// *(pw + 1)
```

**指针算术**：`pointer + 1` 会将地址增加 `sizeof(type)` 个字节。

```cpp
short stacks[3] = {3, 2, 1};
short *ps = stacks;
cout << ps;      // 0x...00
cout << ps + 1;  // 0x...02 (增加了 2 字节，因为 short 是 2 字节)
```

### 字符串指针陷阱

```cpp
char animal[20] = "bear";
const char *bird = "wren"; // 指向字符串字面值
char *ps;

cout << animal << " and " << bird << endl; // char指针给cout，会打印字符串直到 \0，而不是打印地址！

// 如果想看地址：
cout << (int*)animal << endl;
```

---

## 4.9 总结与回顾

```cpp
// 复合类型全家桶示例
struct Polar {
    double distance;
    double angle;
};

int main() {
    // 1. 结构体
    Polar p1 = {10.0, 0.5};
    
    // 2. 结构体指针
    Polar * pp = &p1;
    cout << pp->distance; // 使用 -> 访问指针指向的结构体成员
    
    // 3. 动态结构体数组
    Polar * pa = new Polar[2];
    pa[0].distance = 20.0;
    delete [] pa;
    
    // 4. 指针数组 (用于存储字符串列表很常见)
    const char * cities[3] = {
        "Beijing",
        "Shanghai",
        "Guangzhou"
    };
    
    return 0;
}
```

### 核心记忆点

1. **数组**：固定大小，效率高。
2. **string**：动态大小，安全，易用（优于 char 数组）。
3. **结构体**：将相关数据打包。
4. **指针**：存储地址，允许间接访问。
5. **new/delete**：接管堆内存，灵活但需手动管理，**切记配对使用**。
6. **指针算术**：`+1` 是加一个元素的大小，不是加 1 字节。

---
> **下一章预告**：第 5 章将介绍**循环和关系表达式** (`for`, `while`, `do while`)，让我们的数据动起来！
