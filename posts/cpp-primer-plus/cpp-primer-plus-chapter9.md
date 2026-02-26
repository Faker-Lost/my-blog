---
title: C++ Primer Plus 学习笔记 - 第9章 内存模型和名称空间
date: 2026-02-26
excerpt: 深入理解 C++ 内存模型：单独编译机制、存储持续性（自动/静态/动态）、作用域与连接性、定位new运算符，以及名称空间的创建与使用。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 10
---

## 本章概览

**Why This Matters**: 到目前为止，我们编写的程序相对简单。但当项目变大时，会遇到这些问题：变量在什么时候创建和销毁？不同文件中的同名变量会不会冲突？如何避免全局变量的污染？本章将解答这些疑问，让你真正理解 C++ 的内存管理机制。

**前置知识**: 建议先掌握第1-8章内容，特别是函数和基本数据类型。

**核心目标**：

- 理解单独编译的原理和头文件保护
- 掌握四种存储持续性的区别
- 理解作用域和连接性的概念
- 学会使用定位 new 运算符
- 掌握名称空间的创建和使用

```text
第9章知识体系：内存模型和名称空间
├── 单独编译
│   ├── 源文件与头文件分工
│   ├── 头文件保护（#ifndef）
│   └── 编译链接过程
│
├── 存储持续性
│   ├── 自动存储持续性（栈）
│   ├── 静态存储持续性
│   ├── 动态存储持续性（堆）
│   └── 线程存储持续性（C++11）
│
├── 作用域和连接性
│   ├── 作用域规则
│   ├── 连接性：外部/内部/无
│   └── 静态变量的使用
│
├── 定位 new 运算符
│   ├── new 的工作原理
│   ├── 定位 new 基本用法
│   └── 内存池管理
│
└── 名称空间
    ├── 名称空间定义
    ├── using 声明和指令
    ├── 嵌套名称空间
    └── 名称空间别名
```

---

## 一、基础知识讲解 (Core Concepts)

### 1.1 单独编译（Separate Compilation）

实际项目中不可能把所有代码写在一个文件里。C++ 支持将程序拆分成多个文件分别编译。

#### 1.1.1 单独编译的架构

```
项目结构：
├── coord.h          // 头文件：声明
├── coord.cpp        // 源文件：定义实现
├── main.cpp         // 主程序：使用
└── build.sh         // 编译脚本
```

```cpp
// 完整示例 - 可直接编译运行
// 文件名：coord.h
#ifndef COORD_H  // 头文件保护
#define COORD_H

// 只放声明，不放定义
struct Point {
    double x;
    double y;
};

// 函数声明
void movePoint(Point& p, double dx, double dy);
double distance(const Point& a, const Point& b);

#endif
```

```cpp
// 完整示例 - 可直接编译运行
// 文件名：coord.cpp
#include "coord.h"
#include <cmath>

// 函数定义
void movePoint(Point& p, double dx, double dy) {
    p.x += dx;
    p.y += dy;
}

double distance(const Point& a, const Point& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return std::sqrt(dx * dx + dy * dy);
}
```

```cpp
// 完整示例 - 可直接编译运行
// 文件名：main.cpp
#include <iostream>
#include "coord.h"  // 引入头文件

int main() {
    Point p1 = {0.0, 0.0};
    Point p2 = {3.0, 4.0};

    std::cout << "距离: " << distance(p1, p2) << std::endl;  // 5

    movePoint(p1, 1.0, 2.0);
    std::cout << "移动后: (" << p1.x << ", " << p1.y << ")" << std::endl;

    return 0;
}
```

#### 1.1.2 头文件保护（Header Guards）

防止头文件被重复包含导致重定义错误。

```cpp
// 方法1：传统的 #ifndef 方式
#ifndef COORD_H
#define COORD_H
// 内容
#endif

// 方法2：现代的 #pragma once（编译器支持）
#pragma once
// 内容

// 方法3：C++17 的 #pragma once（标准支持）
// 上述两种方式效果相同
```

#### 1.1.3 编译链接过程

```
源代码 → (预处理) → 预处理文件 → (编译) → 目标文件 → (链接) → 可执行文件
  .cpp                              .o/.obj              .exe
```

```bash
# Linux/Mac 编译示例
g++ -c coord.cpp      # 编译：生成 coord.o
g++ -c main.cpp       # 编译：生成 main.o
g++ main.o coord.o    # 链接：生成可执行文件

# 一步到位
g++ main.cpp coord.cpp -o program
```

---

### 1.2 存储持续性（Storage Duration）

变量在内存中存在的时间称为存储持续性。C++ 有四种存储持续性：

#### 1.2.1 自动存储持续性（Automatic）

**栈上**的局部变量，在代码块结束时自动销毁。

```cpp
// 完整示例 - 可直接编译运行
// 文件名：auto_storage.cpp
#include <iostream>

void function() {
    int x = 10;  // 自动变量，函数结束时销毁
    std::cout << "x = " << x << std::endl;
}

int main() {
    for (int i = 0; i < 3; i++) {
        int y = i;  // 每次循环结束 y 销毁
        std::cout << "y = " << y << std::endl;
    }

    function();  // 调用时创建 x，函数返回时销毁
    function();

    return 0;
}
```

**栈帧图解**：

```
进入 function() 时：
┌─────────────────────┐
│ function 栈帧      │
│   x = 10           │ ← 自动存储
└─────────────────────┘

函数返回时：
  x 被销毁，栈帧弹出
```

#### 1.2.2 静态存储持续性（Static）

**程序运行期间**一直存在的变量。

```cpp
// 完整示例 - 可直接编译运行
// 文件名：static_storage.cpp
#include <iostream>

// 三种静态变量的初始化方式
int globalVar = 1;           // 1. 全局变量
static int fileStatic = 2;  // 2. 文件静态（仅本文件可见）

void function() {
    static int callCount = 0;  // 3. 函数静态（首次调用时初始化）
    callCount++;
    std::cout << "调用次数: " << callCount << std::endl;
}

int main() {
    function();  // 调用次数: 1
    function();  // 调用次数: 2
    function();  // 调用次数: 3

    std::cout << "全局变量: " << globalVar << std::endl;
    std::cout << "文件静态: " << fileStatic << std::endl;

    return 0;
}
```

**静态变量的初始化时机**：

| 类型 | 初始化时机 |
|------|-----------|
| 全局静态 | 程序启动时 |
| 函数内静态 | 首次执行到声明时 |

```cpp
void demo() {
    static int x = 1;    // 第一次调用时初始化
    std::cout << x << std::endl;
    x++;                 // 修改静态变量
}

demo();  // 输出 1，x 变为 2
demo();  // 输出 2，x 变为 3
```

#### 1.2.3 动态存储持续性（Dynamic）

**堆（Heap）**上分配，由 `new` 和 `delete` 控制。

```cpp
// 完整示例 - 可直接编译运行
// 文件名：dynamic_storage.cpp
#include <iostream>

int main() {
    // 动态分配整数
    int* p1 = new int(10);      // 堆上分配，初始化为 10
    std::cout << "*p1 = " << *p1 << std::endl;

    // 动态分配数组
    int* arr = new int[5];      // 堆上分配 5 个整数
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }

    // 使用
    std::cout << "arr[2] = " << arr[2] << std::endl;

    // 释放内存
    delete p1;    // 释放单个对象
    delete[] arr; // 释放数组

    // 避免悬空指针
    p1 = nullptr;
    arr = nullptr;

    return 0;
}
```

**内存分布图**：

```
进程内存布局：
┌─────────────────┐ 高地址
│   代码段        │ 存放程序指令
├─────────────────┤
│   数据段        │ 全局/静态变量
├─────────────────┤
│   堆            │ new 分配 ← 向高地址增长
│   (Heap)        │
├─────────────────┤
│   栈            │ 局部变量 ← 向低地址增长
│   (Stack)       │
└─────────────────┘ 低地址
```

#### 1.2.4 线程存储持续性（C++11）

```cpp
// 完整示例 - 可直接编译运行
// 文件名：thread_storage.cpp
#include <iostream>
#include <thread>

thread_local int threadVar = 0;  // 每个线程独立的变量

void worker(int id) {
    for (int i = 0; i < 3; i++) {
        threadVar++;
        std::cout << "线程 " << id << ": threadVar = " << threadVar << std::endl;
    }
}

int main() {
    std::thread t1(worker, 1);
    std::thread t2(worker, 2);

    t1.join();
    t2.join();

    return 0;
}
```

#### 1.2.5 存储持续性对比表

| 存储类型 | 关键字 | 位置 | 创建时机 | 销毁时机 |
|----------|--------|------|----------|----------|
| 自动 | 局部变量 | 栈 | 进入作用域 | 离开作用域 |
| 静态 | `static` | 数据段 | 程序启动 | 程序结束 |
| 动态 | `new` | 堆 | new 时 | delete 时 |
| 线程 | `thread_local` | 线程存储 | 线程开始 | 线程结束 |

---

### 1.3 作用域和连接性（Scope and Linkage）

#### 1.3.1 作用域（Scope）

变量在程序中**可见的范围**。

```cpp
// 完整示例 - 可直接编译运行
// 文件名：scope.cpp
#include <iostream>

int x = 100;  // 全局作用域

int main() {
    int x = 10;  // 局部作用域，遮蔽全局变量

    std::cout << "局部 x = " << x << std::endl;        // 10
    std::cout << "全局 x = " << ::x << std::endl;      // 100（:: 为作用域解析运算符）

    {
        int x = 5;  // 块作用域
        std::cout << "块内 x = " << x << std::endl;    // 5
        std::cout << "全局 x = " << ::x << std::endl;  // 100
    }

    std::cout << "局部 x = " << x << std::endl;        // 10

    return 0;
}
```

**作用域层级**：

```
├── 全局作用域（文件级别）
│   └── 整个文件可见
│
├── 命名空间作用域
│   └── namespace 内可见
│
├── 类作用域
│   └── class/struct 内可见
│
├── 函数作用域
│   └── 函数内可见
│
└── 块作用域
    └── {} 内可见
```

#### 1.3.2 连接性（Linkage）

变量能否在**其他文件中访问**。

| 连接性 | 关键字 | 含义 | 示例 |
|--------|--------|------|------|
| 无连接 | 无 | 仅当前作用域可见 | `int local;` |
| 内部连接 | `static` | 仅当前文件可见 | `static int fileLocal;` |
| 外部连接 | 无（或 `extern`） | 可被其他文件访问 | `int global;` |

```cpp
// 文件1：file1.cpp
int globalVar = 10;           // 外部连接：其他文件可见
static int fileLocal = 20;    // 内部连接：仅 file1.cpp 可见

// 文件2：file2.cpp
extern int globalVar;         // 声明：引用 file1.cpp 中的 globalVar
// static int fileLocal;     // ❌ 无法访问，fileLocal 是 file1.cpp 的内部连接

int main() {
    std::cout << globalVar << std::endl;  // 10
    return 0;
}
```

#### 1.3.3 作用域和连接性的组合

```cpp
// 完整示例 - 可直接编译运行
// 文件名：linkage.cpp
#include <iostream>

// 1. 全局变量（外部连接）
int globalExternal = 100;

// 2. 静态全局变量（内部连接）
static int globalInternal = 200;

// 3. 常量全局变量（内部连接）
const int constGlobal = 300;  // 默认内部连接

// 4. constexpr（C++11，内部连接）
constexpr int constexprVar = 400;

// 5. 外部 const（需要 extern 声明）
extern const int externalConst = 500;

void demo() {
    // 局部静态变量（无连接，但静态存储持续性）
    static int localStatic = 0;
    localStatic++;
    std::cout << "局部静态: " << localStatic << std::endl;
}

int main() {
    std::cout << "全局外部: " << globalExternal << std::endl;
    std::cout << "全局内部: " << globalInternal << std::endl;
    std::cout << "常量: " << constGlobal << std::endl;
    std::cout << "constexpr: " << constexprVar << std::endl;
    std::cout << "外部常量: " << externalConst << std::endl;

    demo();  // 1
    demo();  // 2
    demo();  // 3

    return 0;
}
```

---

### 1.4 定位 new 运算符（Placement new）

#### 1.4.1 普通 new 的工作原理

```cpp
int* p = new int(10);

// 实际执行：
// 1. 调用 operator new( sizeof(int) ) 分配内存
// 2. 调用构造函数初始化对象
// 3. 返回指针
```

#### 1.4.2 定位 new 的基本用法

定位 new 允许在**指定内存地址**构造对象。

```cpp
// 完整示例 - 可直接编译运行
// 文件名：placement_new.cpp
#include <iostream>
#include <new>

struct Point {
    int x, y;
    Point(int _x = 0, int _y = 0) : x(_x), y(_y) {}
};

int main() {
    // 1. 先分配一块原始内存
    char buffer[sizeof(Point) * 3];  // 足够存放 3 个 Point

    // 2. 使用定位 new 在指定位置构造对象
    Point* p1 = new(buffer) Point(1, 2);
    Point* p2 = new(buffer + sizeof(Point)) Point(3, 4);
    Point* p3 = new(buffer + sizeof(Point) * 2) Point(5, 6);

    std::cout << "p1: (" << p1->x << ", " << p1->y << ")" << std::endl;
    std::cout << "p2: (" << p2->x << ", " << p2->y << ")" << std::endl;
    std::cout << "p3: (" << p3->x << ", " << p3->y << ")" << std::endl;

    // 3. 手动调用析构函数（重要！）
    p1->~Point();
    p2->~Point();
    p3->~Point();

    return 0;
}
```

#### 1.4.3 定位 new 的典型应用：内存池

```cpp
// 完整示例 - 可直接编译运行
// 文件名：memory_pool.cpp
#include <iostream>
#include <new>

class MemoryPool {
private:
    static const size_t POOL_SIZE = 1024;
    char buffer[POOL_SIZE];
    size_t offset;

public:
    MemoryPool() : offset(0) {}

    // 分配内存
    void* allocate(size_t size) {
        // 内存对齐
        size = (size + alignof(std::max_align_t) - 1) & ~(alignof(std::max_align_t) - 1);

        if (offset + size > POOL_SIZE) {
            return nullptr;
        }

        void* ptr = buffer + offset;
        offset += size;
        return ptr;
    }

    // 重置池
    void reset() {
        offset = 0;
    }

    // 打印使用情况
    void printUsage() {
        std::cout << "已使用: " << offset << " / " << POOL_SIZE << " 字节" << std::endl;
    }
};

struct Data {
    int id;
    double value;
    Data(int _id = 0, double _v = 0.0) : id(_id), value(_v) {}
};

int main() {
    MemoryPool pool;

    // 使用内存池分配对象
    Data* d1 = new(pool.allocate(sizeof(Data))) Data(1, 3.14);
    Data* d2 = new(pool.allocate(sizeof(Data))) Data(2, 2.71);

    std::cout << "d1: id=" << d1->id << ", value=" << d1->value << std::endl;
    std::cout << "d2: id=" << d2->id << ", value=" << d2->value << std::endl;

    pool.printUsage();

    // 手动销毁
    d1->~Data();
    d2->~Data();

    return 0;
}
```

#### 1.4.4 使用定位 new 的注意事项

```cpp
// ❌ 错误：重复 delete
int* p = new(buffer) int(10);
// delete p;  // 错误！不能 delete 定位 new 的内存

// ✅ 正确：手动调用析构函数
p->~int();

// 或者使用定位 new 的标准库版本
#include <memory>
std::destroy_at(p);  // C++17
```

---

### 1.5 名称空间（Namespace）

名称空间用于组织代码，避免命名冲突。

#### 1.5.1 名称空间的定义

```cpp
// 完整示例 - 可直接编译运行
// 文件名：namespace_basic.cpp
#include <iostream>

namespace MyLib {
    int version = 1;
    void print() {
        std::cout << "MyLib version " << version << std::endl;
    }

    namespace Detail {
        void helper() {
            std::cout << "helper" << std::endl;
        }
    }
}

int main() {
    // 方式1：完全限定
    MyLib::print();
    std::cout << MyLib::version << std::endl;

    // 方式2：using 声明
    using MyLib::print;
    print();

    // 方式3：using 指令
    using namespace MyLib;
    print();  // 可以直接调用
    std::cout << version << std::endl;

    // 嵌套名称空间
    MyLib::Detail::helper();

    return 0;
}
```

#### 1.5.2 名称空间的特性

```cpp
// 1. 名称空间可以分段声明
namespace MyLib {
    void func1();  // 声明
}

namespace MyLib {
    void func1() { /* 定义 */ }  // 定义
}

// 2. 名称空间可以嵌套
namespace Outer {
    namespace Inner {
        void func() {}
    }
}

// 简化写法
namespace Outer::Inner {
    void func2() {}
}

// 3. 名称空间可以取别名
namespace M = MyLib;
M::print();
```

#### 1.5.3 名称空间 vs 作用域

```cpp
// 完整示例 - 可直接编译运行
// 文件名：namespace_scope.cpp
#include <iostream>

int value = 1;  // 全局变量

namespace NS {
    int value = 2;  // 名称空间中的变量

    void show() {
        int value = 3;  // 局部变量

        std::cout << "局部: " << value << std::endl;          // 3
        std::cout << "名称空间: " << NS::value << std::endl;  // 2
        std::cout << "全局: " << ::value << std::endl;        // 1
    }
}

int main() {
    NS::show();
    return 0;
}
```

#### 1.5.4 名称空间的使用建议

```cpp
// 1. 头文件中：使用完全限定名
// header.h
namespace MyLib {
    void process();  // 声明
}

// 2. 源文件中：使用 using 指令（谨慎）
// source.cpp
#include "header.h"
using namespace MyLib;  // 可以简化，但可能引入命名冲突

int main() {
    process();  // 直接调用
    return 0;
}

// 3. 局部使用：推荐
void someFunction() {
    using std::cout;  // 只引入需要的
    using std::endl;
    cout << "hello" << endl;
}
```

#### 1.5.5 无名名称空间（Anonymous Namespace）

替代 C 的 `static` 关键字，实现文件内部链接。

```cpp
// 之前的方式（C 风格）
static int fileOnly = 10;  // 仅当前文件可见

// 现代 C++ 方式
namespace {
    int fileOnly = 10;  // 同样仅当前文件可见
    void helper() {}    // 文件内部函数
}
```

---

## 二、进阶应用 (Modern C++ Practice)

### 2.1 多文件项目的组织

```cpp
// 完整示例 - 可直接编译运行
// 文件结构示例
// ├── math_utils.h
// ├── math_utils.cpp
// └── main.cpp

// ============================================
// 文件：math_utils.h
// ============================================
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

namespace MathUtils {

int add(int a, int b);
int subtract(int a, int b);
double divide(double a, double b);

}  // namespace MathUtils

#endif

// ============================================
// 文件：math_utils.cpp
// ============================================
#include "math_utils.h"

namespace MathUtils {

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

double divide(double a, double b) {
    if (b == 0) return 0.0;
    return a / b;
}

}  // namespace MathUtils

// ============================================
// 文件：main.cpp
// ============================================
#include <iostream>
#include "math_utils.h"

int main() {
    using namespace MathUtils;

    std::cout << "10 + 5 = " << add(10, 5) << std::endl;
    std::cout << "10 - 5 = " << subtract(10, 5) << std::endl;
    std::cout << "10 / 5 = " << divide(10, 5) << std::endl;

    return 0;
}
```

### 2.2 静态变量的线程安全（C++11）

```cpp
// C++11 之后，函数局部静态变量是线程安全的
void demo() {
    // 编译器会保证线程安全的初始化
    static Resource resource("config");

    resource.use();
}

// 等价于（C++11 之前的双重检查锁定）
static Resource* resource = nullptr;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

Resource* getResource() {
    if (resource == nullptr) {
        pthread_mutex_lock(&mutex);
        if (resource == nullptr) {
            resource = new Resource("config");
        }
        pthread_mutex_unlock(&mutex);
    }
    return resource;
}
```

### 2.3 RAII 和智能指针

```cpp
// 完整示例 - 可直接编译运行
// 文件名：smart_ptr.cpp
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource 构造" << std::endl; }
    ~Resource() { std::cout << "Resource 销毁" << std::endl; }
    void use() { std::cout << "Resource 使用中" << std::endl; }
};

int main() {
    // unique_ptr：独占所有权
    {
        std::unique_ptr<Resource> p1 = std::make_unique<Resource>();
        p1->use();
    }  // 自动销毁

    // shared_ptr：共享所有权
    {
        std::shared_ptr<Resource> p2 = std::make_shared<Resource>();
        std::shared_ptr<Resource> p3 = p2;  // 引用计数 = 2
        std::cout << "引用计数: " << p2.use_count() << std::endl;
    }  // 引用计数 = 0，自动销毁

    std::cout << "程序结束" << std::endl;
    return 0;
}
```

---

## 三、工程陷阱与避坑指南 (Engineering Pitfalls)

### 3.1 头文件重复包含

**现象**：编译错误 "redefinition" 或 "undefined reference"。
**原因**：头文件被多次包含。
**解决方案**：使用头文件保护。

```cpp
// ❌ 错误：没有保护
// #ifndef HEADER_H
// #define HEADER_H
// ...

// ✅ 正确：添加保护
#ifndef HEADER_H
#define HEADER_H
// 内容
#endif
```

---

### 3.2 全局变量污染

**现象**：多个文件中出现同名变量冲突。
**原因**：滥用全局变量。
**解决方案**：使用命名空间或静态变量。

```cpp
// ❌ 不好：全局变量
int counter = 0;

// ✅ 好：命名空间
namespace Config {
    int counter = 0;
}

// ✅ 好：类封装
class Counter {
    static int count;
};
```

---

### 3.3 内存泄漏

**现象**：程序运行久了内存不断增长。
**原因**：new 后没有 delete。
**解决方案**：使用智能指针或 RAII。

```cpp
// ❌ 泄漏
void leak() {
    int* p = new int[100];
    // 忘记 delete
}

// ✅ 使用智能指针
void noLeak() {
    auto p = std::make_unique<int[]>(100);
    // 自动释放
}
```

---

### 3.4 定位 new 忘记析构

**现象**：对象析构函数没有调用，资源未释放。
**原因**：定位 new 需要手动调用析构。
**解决方案**：始终手动调用析构函数。

```cpp
// ❌ 错误
char buffer[sizeof(T)];
T* p = new(buffer) T();
// p 使用完毕没有调用析构

// ✅ 正确
p->~T();  // 手动调用析构
```

---

### 3.5 using namespace 在头文件中

**现象**：污染用户代码的命名空间。
**原因**：头文件中使用 `using namespace`。
**解决方案**：头文件中使用完全限定名。

```cpp
// ❌ 错误：头文件中
#include <iostream>
using namespace std;  // 污染！

// ✅ 正确：头文件中
#include <iostream>
void print();  // 使用完全限定名

// ✅ 正确：源文件中
#include "header.h"
using namespace std;  // 可以
```

---

## 四、面试高频考点 (Interview Focus)

### Q1: C++ 中有哪几种存储持续性？

**答**：

- 自动存储持续性：局部变量（栈）
- 静态存储持续性：static 变量（数据段）
- 动态存储持续性：new 分配的内存（堆）
- 线程存储持续性：thread_local 变量（C++11）

---

### Q2: 全局变量和静态全局变量的区别？

**答**：

- 全局变量：外部连接，其他文件可见
- 静态全局变量：内部连接，仅当前文件可见

---

### Q3: 头文件保护的作用？

**答**：

防止头文件被重复包含导致重定义错误。常用 `#ifndef` 或 `#pragma once`。

---

### Q4: 定位 new 和普通 new 的区别？

**答**：

- 普通 new：自动分配内存
- 定位 new：在指定内存地址构造对象，需要手动调用析构函数

---

### Q5: 名称空间的作用？

**答**：

避免命名冲突，控制作用域，提供代码组织机制。

---

### Q6: 静态局部变量的初始化时机？

**答**：

首次执行到该声明时初始化，整个程序运行期间存在。C++11 后保证线程安全。

---

## 五、总结与回顾 (Summary & Review)

### 核心记忆点

1. **单独编译**：源文件+头文件，头文件保护防止重定义
2. **存储持续性**：自动（栈）、静态（数据段）、动态（堆）、线程
3. **作用域和连接性**：作用域决定可见范围，连接性决定跨文件访问
4. **定位 new**：在指定地址构造对象，需手动析构
5. **名称空间**：避免命名冲突，分段声明，可嵌套

### 内存模型检查清单

- 头文件是否添加了保护宏？
- 全局变量是否必要？能否用命名空间封装？
- new 是否有对应的 delete？
- 定位 new 是否手动调用了析构函数？
- 名称空间是否合理组织代码？

---

> **下一章预告**：第 10 章将进入**类和对象**的学习，我们会探讨面向对象编程的核心概念：类的定义、构造函数、析构函数、成员函数等。

