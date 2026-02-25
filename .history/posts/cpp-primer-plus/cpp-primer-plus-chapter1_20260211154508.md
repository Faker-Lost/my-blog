---
title: C++ Primer Plus 学习笔记 - 第1章 预备知识
date: 2026-01-29
excerpt: C++ 学习起点：了解 C++ 的历史、编程范式（过程性、面向对象、泛型编程）以及 C++ 对 C 语言的扩展。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 2
---

## 本章概览

**Why This Matters**: 理解 C++ 的设计哲学和编程范式，能帮助你在后续学习中更好地理解"为什么要这样设计"。C++ 不仅仅是 C 语言的扩展，它融合了三种编程范式，是一门极其灵活但也需要深入理解的语言。

**前置知识**: 无特殊要求，本章是 C++ 学习的起点。

**核心目标**：

- 了解 C++ 的发展历史和设计哲学
- 理解三种编程范式：过程性、面向对象、泛型编程
- 认识 C++ 对 C 语言的主要扩展

```text
C++ 知识体系：
├── 历史与发展
│   ├── C 语言（1972）
│   ├── C with Classes（1979）
│   ├── C++（1983）
│   └── 现代 C++（C++11/14/17/20）
│
├── 编程范式
│   ├── 过程性编程（C 语言风格）
│   ├── 面向对象编程（类、继承、多态）
│   └── 泛型编程（模板、STL）
│
└── 设计哲学
    ├── 零开销抽象
    ├── 相信程序员
    └── 支持多种编程风格
```

---

## 一、基础知识讲解 (Core Concepts)

### 1.1 C++ 的发展历史

```text
1972        1979           1983        1998   2011   2020
 │           │              │           │      │      │
 C 语言 → C with Classes → C++ → C++98 → C++11 → C++20
                                    ↓        ↓
                                 标准化   现代 C++
```

| 时间 | 事件 | 意义 |
| :--- | :--- | :--- |
| 1972 | Dennis Ritchie 创建 C 语言 | Unix 系统的开发语言 |
| 1979 | Bjarne Stroustrup 创建 "C with Classes" | C++ 的前身 |
| 1983 | 正式命名为 C++ | "++" 表示 increment（递增） |
| 1998 | C++98 标准发布 | 第一个 ISO C++ 标准 |
| 2011 | C++11 标准发布 | 现代 C++ 的起点 |
| 2020 | C++20 标准发布 | 最新标准 |

**C 和 C++ 的关系**：

```text
C 语言（1972）
    ↓
C++（1983）= C + 类 + 面向对象 + 泛型编程 + 其他特性
```

> C++ 是 C 的**超集**：C++ 几乎支持所有 C 语言特性，同时添加了面向对象和泛型编程支持。

### 1.2 编程范式一：过程性编程

**核心思想**：以过程（函数/算法）为中心，强调"做什么"和"怎么做"。

```c
// 完整示例 - 可直接编译运行（C 语言）
#include <stdio.h>

// 定义过程（函数）
void print_rectangle(int width, int height) {
    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            printf("*");
        }
        printf("\n");
    }
}

int main() {
    int w = 5, h = 3;
    print_rectangle(w, h);  // 调用过程
    return 0;
}
```

**特点**：

- ✅ 适合小型程序
- ✅ 执行效率高
- ❌ 难以维护大型项目
- ❌ 数据和操作分离

### 1.3 编程范式二：面向对象编程 (OOP)

**核心思想**：以对象为中心，强调"谁来做"和"如何协作"。

```cpp
// 完整示例 - 可直接编译运行（C++）
#include <iostream>
using namespace std;

// 定义类（对象的模板）
class Rectangle {
private:
    int width;
    int height;

public:
    // 构造函数
    Rectangle(int w, int h) : width(w), height(h) {}

    // 成员函数（方法）
    void print() const {
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                cout << "*";
            }
            cout << endl;
        }
    }

    int area() const {
        return width * height;
    }
};

int main() {
    // 创建对象
    Rectangle rect(5, 3);
    rect.print();  // 对象调用自己的方法
    cout << "面积: " << rect.area() << endl;
    return 0;
}
```

**OOP 三大特性**：

| 特性 | 说明 | 示例 |
| :--- | :--- | :--- |
| **封装** | 隐藏实现细节，暴露接口 | `private` 成员变量，`public` 方法 |
| **继承** | 子类继承父类的属性和方法 | `class Dog : public Animal` |
| **多态** | 同一接口，不同实现 | 虚函数 `virtual void speak()` |

### 1.4 编程范式三：泛型编程

**核心思想**：使用类型参数化，编写与类型无关的通用代码。

```cpp
// 完整示例 - 可直接编译运行
#include <iostream>
#include <string>
using namespace std;

// 函数模板：泛型编程
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    // 同一个函数模板用于不同类型
    cout << maximum(3, 5) << endl;        // int: 5
    cout << maximum(3.14, 2.72) << endl;   // double: 3.14
    cout << maximum('a', 'z') << endl;     // char: z
    
    return 0;
}
```

**泛型编程优势**：

- ✅ 代码复用性极强
- ✅ 类型安全（编译时检查）
- ✅ 避免代码重复

### 1.5 C++ 对 C 的主要扩展

#### 类和对象

```cpp
// C 语言：结构体只有数据
struct Point_C {
    int x;
    int y;
};

// C++：类包含数据和方法
class Point_CPP {
private:
    int x;
    int y;

public:
    Point_CPP(int x = 0, int y = 0) : x(x), y(y) {}
    
    void move(int dx, int dy) {
        x += dx;
        y += dy;
    }
};
```

#### 继承

```cpp
// 基类
class Animal {
protected:
    string name;

public:
    Animal(string n) : name(n) {}
    void speak() {
        cout << name << " makes a sound" << endl;
    }
};

// 派生类继承基类
class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}
    
    void bark() {
        cout << name << " says: Woof!" << endl;
    }
};
```

#### 多态（虚函数）

```cpp
class Shape {
public:
    // 虚函数：支持运行时多态
    virtual double area() const {
        return 0.0;
    }
    
    virtual ~Shape() {}  // 虚析构函数
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {  // C++11: override 关键字
        return 3.14159 * radius * radius;
    }
};
```

### 1.6 标准模板库 (STL)

```text
STL 三大组件：
├── 容器（Containers）
│   ├── 序列容器：vector, list, deque
│   ├── 关联容器：map, set
│   └── 无序容器：unordered_map, unordered_set
│
├── 算法（Algorithms）
│   ├── 排序：sort, stable_sort
│   ├── 查找：find, binary_search
│   └── 变换：transform, for_each
│
└── 迭代器（Iterators）
    └── 连接容器和算法的桥梁
```

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    // 容器
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    
    // 算法
    std::sort(numbers.begin(), numbers.end());
    
    // 迭代器
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        std::cout << *it << " ";
    }
    
    return 0;
}
```

---

## 二、进阶应用 (Modern C++ Practice)

### 2.1 用 `auto` 简化类型声明 (C++11)

```cpp
// 传统写法
std::vector<int>::iterator it = vec.begin();

// 现代写法
auto it = vec.begin();  // 编译器自动推导类型
```

### 2.2 用 `nullptr` 代替 `NULL` (C++11)

```cpp
// 传统写法
int *p = NULL;

// 现代写法
int *p = nullptr;  // 类型安全的空指针
```

### 2.3 用 `override` 明确标记虚函数覆盖 (C++11)

```cpp
class Base {
public:
    virtual void foo() {}
};

class Derived : public Base {
public:
    // 传统写法
    virtual void foo() {}  // 容易拼写错误
    
    // 现代写法
    void foo() override;  // 编译器会检查是否真的覆盖了基类函数
};
```

### 2.4 用智能指针代替原生指针 (C++11)

```cpp
#include <memory>

// 传统写法 - 容易内存泄漏
int *p = new int(42);
// ... 使用 p ...
delete p;  // 容易忘记

// 现代写法 - 自动管理内存
auto p = std::make_unique<int>(42);
// ... 使用 p ...
// 自动释放，无需 delete
```

---

## 三、工程陷阱与避坑指南 (Engineering Pitfalls)

### 3.1 过度使用继承导致类层次复杂

**现象**：类继承层次过深，难以理解和维护。
**原因**：滥用继承，将"has-a"关系误用为"is-a"关系。

```cpp
// ❌ 错误示例：汽车"是一个"引擎？
class Engine {};
class Car : public Engine {};  // 错误！汽车不是引擎

// ✅ 正确示例：汽车"有一个"引擎
class Engine {};
class Car {
    Engine engine;  // 组合优于继承
};
```

**解决方案**：优先使用组合（composition）而非继承。

### 3.2 忘记虚析构函数导致内存泄漏

**现象**：通过基类指针删除派生类对象时，派生类的析构函数不被调用。
**原因**：基类析构函数不是虚函数。

```cpp
class Base {
public:
    ~Base() { cout << "Base destructor" << endl; }
};

class Derived : public Base {
public:
    ~Derived() { cout << "Derived destructor" << endl; }
};

Base *p = new Derived();
delete p;  // ❌ 只调用 Base 的析构函数，Derived 的资源未释放！
```

**解决方案**：基类析构函数必须是虚函数。

```cpp
class Base {
public:
    virtual ~Base() { cout << "Base destructor" << endl; }
};
```

### 3.3 模板编译错误难以理解

**现象**：模板代码编译错误信息冗长且难以理解。
**原因**：模板在实例化时才进行类型检查。

```cpp
template<typename T>
void foo(T x) {
    x.bar();  // 如果 T 没有 bar() 方法，编译错误信息会很长
}
```

**解决方案**：使用 C++20 的 `concept` 约束模板参数。

```cpp
// C++20
template<typename T>
concept HasBar = requires(T x) {
    x.bar();
};

template<HasBar T>
void foo(T x) {
    x.bar();  // 错误信息更清晰
}
```

### 3.4 STL 迭代器失效

**现象**：程序崩溃或产生未定义行为。
**原因**：在遍历容器时修改容器，导致迭代器失效。

```cpp
vector<int> vec = {1, 2, 3, 4, 5};

for (auto it = vec.begin(); it != vec.end(); ++it) {
    if (*it == 3) {
        vec.erase(it);  // ❌ 迭代器失效！
    }
}
```

**解决方案**：使用 `erase` 的返回值更新迭代器。

```cpp
for (auto it = vec.begin(); it != vec.end(); ) {
    if (*it == 3) {
        it = vec.erase(it);  // ✅ 正确
    } else {
        ++it;
    }
}
```

---

## 四、面试高频考点 (Interview Focus)

### Q1: C++ 和 C 的主要区别是什么？

**答**：

1. **编程范式**：C 是过程性语言，C++ 支持过程性、面向对象、泛型编程
2. **类和对象**：C++ 有类、继承、多态，C 只有结构体
3. **模板**：C++ 支持泛型编程（模板），C 不支持
4. **STL**：C++ 有标准模板库，C 没有
5. **异常处理**：C++ 有 `try/catch`，C 只能用返回值
6. **命名空间**：C++ 有 `namespace`，C 没有

### Q2: 什么是多态？如何实现？

**答**：多态是指同一接口可以有不同的实现。C++ 通过**虚函数**实现运行时多态：

```cpp
class Animal {
public:
    virtual void speak() { cout << "Animal sound" << endl; }
};

class Dog : public Animal {
public:
    void speak() override { cout << "Woof!" << endl; }
};

Animal *p = new Dog();
p->speak();  // 输出 "Woof!"（调用 Dog 的版本）
```

### Q3: 什么是 STL？有哪些主要组件？

**答**：STL（Standard Template Library）是 C++ 标准模板库，包含三大组件：

1. **容器**：`vector`、`list`、`map`、`set` 等
2. **算法**：`sort`、`find`、`transform` 等
3. **迭代器**：连接容器和算法的桥梁

STL 的优势是**类型安全**、**高效**、**可复用**。

---

## 五、总结与回顾 (Summary & Review)

### 核心记忆点

1. **C++ = C + 面向对象 + 泛型编程**
2. **三种编程范式**：过程性（函数）、面向对象（类）、泛型（模板）
3. **OOP 三大特性**：封装、继承、多态
4. **STL 三大组件**：容器、算法、迭代器
5. **设计哲学**：零开销抽象、相信程序员、支持多种编程风格
6. **现代 C++**：C++11 是分水岭，引入了 `auto`、`nullptr`、智能指针等

### 编程范式对比

| 特性 | 过程性编程 | 面向对象编程 | 泛型编程 |
| :--- | :--- | :--- | :--- |
| **核心** | 函数/过程 | 对象/类 | 类型参数化 |
| **数据** | 独立于函数 | 封装在对象中 | 类型无关 |
| **复用** | 函数调用 | 继承/组合 | 模板实例化 |
| **适用** | 小型程序 | 大型系统 | 通用库 |

---

> **下一章预告**：第 2 章将带你编写第一个 C++ 程序，理解程序结构、输入输出、函数的使用！
