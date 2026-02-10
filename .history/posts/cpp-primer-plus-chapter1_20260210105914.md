---
title: C++ Primer Plus 学习笔记 - 第1章 预备知识
date: 2026-01-29
excerpt: C++ 学习起点：了解 C++ 的历史、编程范式（过程性编程、面向对象编程、泛型编程）以及 C++ 对 C 语言的扩展。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
series: C++ Primer Plus
seriesOrder: 1
---

# C++ Primer Plus 学习笔记 - 第1章 预备知识

## C 语言和 C++ 的发展历史

### C++ 的起源

```
1972        1979           1983        1998   2011   2020
 │           │              │           │      │      │
 ALGOL68 → C with Classes → C++ → C++98 → C++11 → C++20
                                      ↓        ↓
                                   标准化   现代 C++
```

| 时间 | 事件 | 意义 |
|------|------|------|
| 1972 | Dennis Ritchie 创建 C 语言 | Unix 系统的开发语言 |
| 1979 | Bjarne Stroustrup 创建 "C with Classes" | C++ 的前身 |
| 1983 | 正式命名为 C++ | "++" 表示 increment（递增） |
| 1998 | C++98 标准发布 | 第一个 ISO C++ 标准 |
| 2011 | C++11 标准发布 | 现代 C++ 的起点 |
| 2020 | C++20 标准发布 | 最新标准（截至本笔记） |

### C 和 C++ 的关系

```
C 语言（1972）
    ↓
C++（1983）= C + 类 + 面向对象 + 泛型编程 + 其他特性
```

**C++ 是 C 的超集**：C++ 几乎支持所有 C 语言特性，同时添加了面向对象和泛型编程支持。

---

## 编程范式（Programming Paradigms）

### 1. 过程性编程（Procedural Programming）

**核心思想**：以过程（函数/算法）为中心，强调"做什么"和"怎么做"

```c
/* C 语言示例：过程性编程 */
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

### 2. 面向对象编程（Object-Oriented Programming, OOP）

**核心思想**：以对象为中心，强调"谁来做"和"如何协作"

```cpp
// C++ 示例：面向对象编程
#include <iostream>
#include <string>
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
|------|------|------|
| **封装** | 隐藏实现细节，暴露接口 | `private` 成员变量，`public` 方法 |
| **继承** | 子类继承父类的属性和方法 | `class Dog : public Animal` |
| **多态** | 同一接口，不同实现 | 虚函数 `virtual void speak()` |

**OOP 优势**：

- ✅ 更好的代码组织
- ✅ 更容易维护和扩展
- ✅ 代码复用性强
- ✅ 模拟现实世界更自然

### 3. 泛型编程（Generic Programming）

**核心思想**：使用类型参数化，编写与类型无关的通用代码

```cpp
// C++ 示例：泛型编程（使用模板）
#include <iostream>
using namespace std;

// 函数模板：泛型编程
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// 类模板：泛型容器
template<typename T>
class Box {
private:
    T content;

public:
    Box(T c) : content(c) {}
    T getValue() const { return content; }
};

int main() {
    // 同一个函数模板用于不同类型
    cout << maximum(3, 5) << endl;        // int: 5
    cout << maximum(3.14, 2.72) << endl;   // double: 3.14
    cout << maximum('a', 'z') << endl;     // char: z

    // 类模板用于不同类型
    Box<int> intBox(42);
    Box<string> strBox("Hello");

    cout << intBox.getValue() << endl;   // 42
    cout << strBox.getValue() << endl;   // Hello

    return 0;
}
```

**泛型编程优势**：

- ✅ 代码复用性极强
- ✅ 类型安全（编译时检查）
- ✅ 避免代码重复

---

## C++ 在 C 语言基础上添加的面向对象概念

### 1. 类和对象

```cpp
// C 语言：结构体只有数据
struct Point_C {
    int x;
    int y;
};

void move(struct Point_C* p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

// C++：类包含数据和方法
class Point_CPP {
private:        // 访问控制
    int x;
    int y;

public:
    // 构造函数
    Point_CPP(int x = 0, int y = 0) : x(x), y(y) {}

    // 成员函数
    void move(int dx, int dy) {
        x += dx;
        y += dy;
    }

    void display() const {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};
```

### 2. 继承

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

### 3. 多态（虚函数）

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

// 多态使用
void printArea(const Shape& shape) {
    cout << shape.area() << endl;  // 根据实际对象类型调用
}
```

### 4. 抽象类和纯虚函数

```cpp
// 抽象类：包含纯虚函数
class AbstractShape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual ~AbstractShape() = 0;
};

// 必须实现纯虚函数才能实例化
class Rectangle : public AbstractShape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override {
        return width * height;
    }
};
```

---

## C++ 在 C 语言基础上添加的泛型编程概念

### 1. 函数模板

```cpp
// 类型参数化
template<typename T>
T add(T a, T b) {
    return a + b;
}

// 使用
int result1 = add(3, 5);           // T = int
double result2 = add(1.5, 2.5);    // T = double
```

### 2. 类模板

```cpp
template<typename T>
class Stack {
private:
    vector<T> elements;

public:
    void push(T element) {
        elements.push_back(element);
    }

    T pop() {
        T top = elements.back();
        elements.pop_back();
        return top;
    }
};

// 使用
Stack<int> intStack;
Stack<string> stringStack;
```

### 3. 标准模板库（STL）

```
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
    ├── 输入迭代器
    ├── 输出迭代器
    └── 前向/双向/随机访问迭代器
```

**STL 示例**：

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

## 编程范式对比

| 特性 | 过程性编程 | 面向对象编程 | 泛型编程 |
|------|-----------|-------------|---------|
| **核心** | 函数/过程 | 对象/类 | 类型参数化 |
| **数据** | 独立于函数 | 封装在对象中 | 类型无关 |
| **复用** | 函数调用 | 继承/组合 | 模板实例化 |
| **适用** | 小型程序 | 大型系统 | 通用库 |
| **效率** | 高 | 稍低 | 编译时优化 |

---

## C++ 的设计哲学

> "C++ 设计目标：让程序员能够编写高质量、高性能的程序，同时保持灵活性和可扩展性。" —— Bjarne Stroustrup

### C++ 核心原则

1. **零开销抽象**（Zero-overhead abstraction）
   - 你不使用的特性，不需要为其付出代价
   - 抽象不应该带来性能损失

2. **相信程序员**（Trust the programmer）
   - 给程序员足够的控制权
   - 不强制使用某种编程风格

3. **支持多种编程风格**
   - 过程性、面向对象、泛型编程可以混合使用

---

## 总结

### 本章要点

```
C++ = C + 面向对象 + 泛型编程

C++ 语言特性：
├── 保留 C 语言的效率和灵活性
├── 添加类和对象（封装、继承、多态）
├── 支持泛型编程（模板、STL）
└── 兼容多种编程范式
```

### 学习路线

```
第1章：预备知识（本章）✅
    ↓
第2章：开始学习 C++
    ↓
第3章：处理数据
    ↓
...继续学习...
```
