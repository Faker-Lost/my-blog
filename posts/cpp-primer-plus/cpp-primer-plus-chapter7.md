---
title: C++ Primer Plus 学习笔记 - 第7章 函数：C++ 的编程模块
date: 2026-02-26
excerpt: 全面掌握 C++ 函数设计：函数原型、按值传参、数组与字符串函数、结构体与 string 对象函数、递归、函数指针，以及工程级避坑实践。
tags:
  - C++
  - C++ Primer Plus
  - 学习笔记
  - 教程
series: C++ Primer Plus
seriesOrder: 8
---

## 本章概览

**Why This Matters**: 当程序规模变大时，`main()` 里堆逻辑会迅速失控。函数是 C++ 组织代码的最小模块，决定了代码是否可读、可测、可维护。

**前置知识**: 建议先掌握第 4 章（数组、指针、结构体）和第 6 章（分支与循环），否则在参数传递、递归终止条件上会比较吃力。

**核心目标**：

- 掌握函数声明、定义、调用三要素
- 理解函数原型的编译期价值与常见不匹配问题
- 理解按值传参的拷贝语义与适用场景
- 学会为数组、C 风格字符串、结构体、`std::string` 设计函数接口
- 掌握 `const` 指针参数的正确写法
- 理解递归的执行模型与终止条件
- 学会声明、传递和调用函数指针

```text
第7章知识体系：函数设计与调用
├── 基础模型
│   ├── 函数定义/声明/调用
│   ├── 函数原型（编译期契约）
│   └── 按值传参（拷贝语义）
│
├── 面向数据结构的函数设计
│   ├── 数组函数（指针退化 + 显式长度）
│   ├── const 指针参数（只读契约）
│   ├── C 风格字符串函数（'\0' 结尾）
│   ├── 结构体函数（值传递 vs 引用）
│   └── string 对象函数（const 引用优先）
│
├── 特殊调用模式
│   ├── 递归（自调用 + 终止条件）
│   └── 函数指针（行为参数化）
│
└── 工程实践
    ├── 接口稳定性（原型一致）
    ├── 防御式校验（空指针/长度/边界）
    └── 可维护性（KISS/DRY/SOLID）
```

---

## 一、基础知识讲解 (Core Concepts)

### 1.1 函数基本知识

函数由三部分组成：**声明（原型）**、**定义（实现）**、**调用（使用）**。

```cpp
// 文件：examples/chapter7/function_basics.cpp
#include <iostream>

using namespace std;

double celsiusToFahrenheit(double celsius);  // 函数声明（原型）

int main() {
    double celsius = 36.5;
    double fahrenheit = celsiusToFahrenheit(celsius);  // 函数调用
    cout << celsius << " C = " << fahrenheit << " F" << endl;
    return 0;
}

double celsiusToFahrenheit(double celsius) {  // 函数定义
    // 使用函数封装公式，避免在多个位置重复表达式（DRY）
    return celsius * 9.0 / 5.0 + 32.0;
}
```

**函数签名（Signature）**通常指“函数名 + 参数列表（类型/顺序）”；返回值不参与重载决议。

---

### 1.2 函数原型（Prototype）

函数原型告诉编译器：

- 函数名是什么
- 参数个数和类型是什么
- 返回值类型是什么

没有原型，编译器无法在调用点做类型检查。

```cpp
// 文件：examples/chapter7/function_prototype.cpp
#include <iostream>

using namespace std;

// 原型写在前面，main 可以先调用后定义
int add(int a, int b);
void printResult(int value);

int main() {
    int result = add(10, 20);
    printResult(result);
    return 0;
}

int add(int a, int b) {
    return a + b;
}

void printResult(int value) {
    cout << "result = " << value << endl;
}
```

**设计建议（KISS）**：把函数原型集中放在头文件，源文件只保留定义，职责清晰。

---

### 1.3 按值传递函数参数（Pass by Value）

按值传递会把实参复制一份给形参，函数内修改不会影响调用者变量。

```cpp
// 文件：examples/chapter7/pass_by_value.cpp
#include <iostream>

using namespace std;

void increase(int n) {
    n += 10;  // 只修改副本，不影响 main 中的 x
    cout << "函数内 n = " << n << endl;
}

int main() {
    int x = 5;
    increase(x);
    cout << "函数外 x = " << x << endl;  // 仍然是 5
    return 0;
}
```

**何时适合按值传递**：

- 参数是小对象（`int`/`double`/`char`）
- 函数需要“副本语义”，不希望改动原始数据

---

### 1.4 设计处理数组的函数

数组作为函数参数时会退化为指针，函数本身无法知道数组长度，所以需要额外传长度参数。

```cpp
// 文件：examples/chapter7/array_functions.cpp
#include <iostream>

using namespace std;

double average(const double values[], int size);
int findMaxIndex(const double values[], int size);

int main() {
    double scores[] = {88.5, 92.0, 76.5, 99.0, 84.0};
    int size = static_cast<int>(sizeof(scores) / sizeof(scores[0]));

    cout << "平均分 = " << average(scores, size) << endl;
    cout << "最高分下标 = " << findMaxIndex(scores, size) << endl;
    return 0;
}

double average(const double values[], int size) {
    if (values == nullptr || size <= 0) {
        return 0.0;  // 防御式返回，避免除零
    }

    double sum = 0.0;
    for (int i = 0; i < size; ++i) {
        sum += values[i];
    }
    return sum / size;
}

int findMaxIndex(const double values[], int size) {
    if (values == nullptr || size <= 0) {
        return -1;
    }

    int index = 0;
    for (int i = 1; i < size; ++i) {
        if (values[i] > values[index]) {
            index = i;
        }
    }
    return index;
}
```

**关键点**：

- `const double values[]` 等价于 `const double* values`
- 传入 `size` 是必须的（YAGNI：只传当前需要的最小信息）

---

### 1.5 使用 `const` 指针参数

在函数设计中，`const` 代表“只读承诺”，可以防止误修改输入数据。

| 写法 | 含义 |
| :--- | :--- |
| `const int* p` | 不能通过 `p` 修改数据 |
| `int* const p` | 指针本身不能改指向 |
| `const int* const p` | 数据和指针都不能改 |

最常见的是第一种：把输入数组、字符串设为只读。

```cpp
// 文件：examples/chapter7/const_pointer_params.cpp
#include <iostream>

using namespace std;

int countGreaterThan(const int* data, int size, int threshold) {
    if (data == nullptr || size <= 0) {
        return 0;
    }

    int count = 0;
    for (int i = 0; i < size; ++i) {
        if (data[i] > threshold) {
            ++count;
        }
    }
    return count;
}

int main() {
    int nums[] = {3, 10, 5, 22, 18};
    int size = static_cast<int>(sizeof(nums) / sizeof(nums[0]));
    cout << "大于 9 的个数 = " << countGreaterThan(nums, size, 9) << endl;
    return 0;
}
```

**SOLID - 接口隔离思想**：只读函数就暴露只读接口，减少误用面。

---

### 1.6 设计处理文本字符串的函数（C 风格字符串）

C 风格字符串本质是 `char` 数组，以 `'\0'` 结尾。

```cpp
// 文件：examples/chapter7/c_string_functions.cpp
#include <iostream>
#include <cctype>

using namespace std;

int countLetters(const char* text);
void toUpperInPlace(char* text);

int main() {
    char title[] = "C++ Primer Plus";

    cout << "字母个数 = " << countLetters(title) << endl;
    toUpperInPlace(title);
    cout << "转换后 = " << title << endl;
    return 0;
}

int countLetters(const char* text) {
    if (text == nullptr) {
        return 0;
    }

    int count = 0;
    while (*text != '\0') {
        if (isalpha(static_cast<unsigned char>(*text))) {
            ++count;
        }
        ++text;
    }
    return count;
}

void toUpperInPlace(char* text) {
    if (text == nullptr) {
        return;
    }

    while (*text != '\0') {
        *text = static_cast<char>(toupper(static_cast<unsigned char>(*text)));
        ++text;
    }
}
```

**工程提示**：  
输入参数如果不需要修改，用 `const char*`；需要原地修改才使用 `char*`。

---

### 1.7 设计处理结构的函数

结构体常见两类函数：

- 读取型：`const Struct&`（不修改）
- 更新型：`Struct&`（原地修改）

```cpp
// 文件：examples/chapter7/struct_functions.cpp
#include <iostream>
#include <string>

using namespace std;

struct Student {
    string name;
    double score;
    int age;
};

void printStudent(const Student& s);
void addBonus(Student& s, double bonus);
bool isValidScore(double score);

int main() {
    Student alice{"Alice", 86.5, 20};

    printStudent(alice);
    addBonus(alice, 8.0);
    printStudent(alice);
    return 0;
}

void printStudent(const Student& s) {
    cout << "name=" << s.name
         << ", score=" << s.score
         << ", age=" << s.age << endl;
}

bool isValidScore(double score) {
    return score >= 0.0 && score <= 100.0;
}

void addBonus(Student& s, double bonus) {
    if (bonus < 0.0) {
        return;  // 拒绝非法输入，保持对象状态一致
    }
    s.score += bonus;
    if (!isValidScore(s.score)) {
        s.score = 100.0;  // 分数上限封顶
    }
}
```

---

### 1.8 设计处理 `string` 对象的函数

`std::string` 比 C 风格字符串更安全，推荐优先使用。

```cpp
// 文件：examples/chapter7/string_object_functions.cpp
#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

bool containsKeyword(const string& text, const string& keyword);
string trimSpaces(const string& input);

int main() {
    string line = "   modern c++ function design   ";
    string cleaned = trimSpaces(line);

    cout << "trim 后: [" << cleaned << "]" << endl;
    cout << "包含 function? " << (containsKeyword(cleaned, "function") ? "是" : "否") << endl;
    return 0;
}

bool containsKeyword(const string& text, const string& keyword) {
    if (keyword.empty()) {
        return false;
    }
    return text.find(keyword) != string::npos;
}

string trimSpaces(const string& input) {
    if (input.empty()) {
        return "";
    }

    size_t left = 0;
    while (left < input.size() && isspace(static_cast<unsigned char>(input[left]))) {
        ++left;
    }

    if (left == input.size()) {
        return "";
    }

    size_t right = input.size() - 1;
    while (right > left && isspace(static_cast<unsigned char>(input[right]))) {
        --right;
    }

    return input.substr(left, right - left + 1);
}
```

**KISS 建议**：字符串处理优先用标准库 API，避免手写复杂内存操作。

---

### 1.9 调用自身的函数（递归）

递归 = 函数直接或间接调用自己。必须有：

1. **终止条件**
2. **向终止条件收敛的递推步骤**

```cpp
// 文件：examples/chapter7/recursion_factorial.cpp
#include <iostream>

using namespace std;

unsigned long long factorial(unsigned int n) {
    if (n <= 1) {
        return 1ULL;  // 终止条件
    }
    return n * factorial(n - 1);  // 递推：规模缩小
}

int main() {
    for (unsigned int i = 0; i <= 10; ++i) {
        cout << i << "! = " << factorial(i) << endl;
    }
    return 0;
}
```

再看一个更实用的递归：二分查找。

```cpp
// 文件：examples/chapter7/recursion_binary_search.cpp
#include <iostream>

using namespace std;

int binarySearch(const int* data, int left, int right, int target) {
    if (data == nullptr || left > right) {
        return -1;
    }

    int mid = left + (right - left) / 2;
    if (data[mid] == target) {
        return mid;
    }
    if (data[mid] > target) {
        return binarySearch(data, left, mid - 1, target);
    }
    return binarySearch(data, mid + 1, right, target);
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int size = static_cast<int>(sizeof(arr) / sizeof(arr[0]));

    int target = 23;
    int index = binarySearch(arr, 0, size - 1, target);
    cout << "target index = " << index << endl;
    return 0;
}
```

---

### 1.10 指向函数的指针（Function Pointer）

函数指针可以把“行为”作为参数传入，实现策略切换。

```cpp
// 文件：examples/chapter7/function_pointer_basics.cpp
#include <iostream>

using namespace std;

double add(double a, double b) { return a + b; }
double subtract(double a, double b) { return a - b; }
double multiply(double a, double b) { return a * b; }

double calculate(double x, double y, double (*op)(double, double)) {
    if (op == nullptr) {
        return 0.0;
    }
    return op(x, y);
}

int main() {
    double a = 12.0;
    double b = 3.0;

    // 声明函数指针：返回值和参数列表必须完全匹配
    double (*func)(double, double) = add;
    cout << "add = " << func(a, b) << endl;

    func = subtract;
    cout << "sub = " << func(a, b) << endl;

    cout << "mul = " << calculate(a, b, multiply) << endl;
    return 0;
}
```

---

## 二、进阶应用 (Modern C++ Practice)

### 2.1 参数设计对照：值传递 / 指针 / 引用

| 场景 | 推荐写法 | 原因 |
| :--- | :--- | :--- |
| 小型基础类型 | `int x` | 拷贝成本低，语义直观 |
| 只读大对象 | `const std::string& s` | 避免拷贝，且不可改 |
| 可修改对象 | `T& obj` | 明确会修改调用方 |
| 可空输入 | `const T* p` | 支持 `nullptr` 语义 |

**原则映射**：

- **KISS**：优先让接口语义一眼可懂
- **YAGNI**：不用为“可能出现”的场景提前引入复杂抽象

---

### 2.2 用 `std::span` 改善数组函数接口（C++20）

传统数组参数需要“指针 + 长度”，`std::span` 可以统一表达连续内存视图。

```cpp
// 文件：examples/chapter7/span_array_api.cpp
#include <iostream>
#include <span>
#include <vector>

using namespace std;

double average(span<const double> values) {
    if (values.empty()) {
        return 0.0;
    }
    double sum = 0.0;
    for (double v : values) {
        sum += v;
    }
    return sum / values.size();
}

int main() {
    vector<double> data{80.0, 82.5, 95.0, 77.0};
    cout << "平均分 = " << average(data) << endl;
    return 0;
}
```

---

### 2.3 函数指针的现代替代：Lambda + `std::function`

函数指针只能指向“普通函数”；如果想传递带状态的行为，可以用 Lambda。

```cpp
// 文件：examples/chapter7/std_function_lambda.cpp
#include <iostream>
#include <functional>

using namespace std;

double calculate(double x, double y, const function<double(double, double)>& op) {
    if (!op) {
        return 0.0;
    }
    return op(x, y);
}

int main() {
    double rate = 0.1;
    auto withTax = [rate](double price, double) { return price * (1.0 + rate); };

    cout << "含税价格 = " << calculate(100.0, 0.0, withTax) << endl;
    return 0;
}
```

---

## 三、工程陷阱与避坑指南 (Engineering Pitfalls)

### 3.1 原型与定义不一致

**现象**：链接错误或调用结果异常。  
**原因**：声明和定义参数列表不一致。  
**解决方案**：声明和定义复制同一份签名；头文件统一维护。

```cpp
// 文件：examples/chapter7/pitfall_prototype_mismatch.cpp
// 声明：int sum(int, int);
// 定义：double sum(double, double);   // ❌ 不一致
```

---

### 3.2 误以为数组参数能推导长度

**现象**：循环越界或只处理部分元素。  
**原因**：函数参数里的数组已经退化为指针。  
**解决方案**：显式传长度，或使用 `std::array` / `std::vector` / `std::span`。

```cpp
// 文件：examples/chapter7/pitfall_array_decay.cpp
void printSize(int arr[]) {
    // arr 在这里是 int*，不是原始数组
}
```

---

### 3.3 返回局部变量地址

**现象**：野指针、随机崩溃。  
**原因**：函数返回后，局部变量已销毁。  
**解决方案**：返回值对象（推荐），或由调用方提供缓冲区。

```cpp
// 文件：examples/chapter7/pitfall_return_local_address.cpp
const char* bad() {
    char buffer[32] = "hello";
    return buffer;  // ❌ 返回悬空地址
}
```

---

### 3.4 递归缺少终止条件

**现象**：栈溢出（stack overflow）。  
**原因**：递归无法收敛。  
**解决方案**：先写终止条件，再写递推步骤；必要时改循环。

```cpp
// 文件：examples/chapter7/pitfall_infinite_recursion.cpp
int f(int n) {
    return f(n - 1) + 1;  // ❌ 没有终止条件
}
```

---

### 3.5 函数指针签名不匹配

**现象**：编译报错或强制转换后运行风险。  
**原因**：返回类型/参数列表不一致。  
**解决方案**：保持“完全匹配”，不要用 C 风格强转掩盖错误。

```cpp
// 文件：examples/chapter7/pitfall_function_pointer_signature.cpp
double add(double, double);
int (*p)(int, int) = add;  // ❌ 签名不匹配
```

---

## 四、面试高频考点 (Interview Focus)

### Q1: 按值传递、按引用传递、按指针传递有什么区别？

**答**：

- 按值：拷贝实参，安全但可能有拷贝成本
- 按引用：直接操作原对象，语法简洁，不可为空
- 按指针：可为空，需手动判空，语义更底层

---

### Q2: 为什么数组函数通常要传 `size`？

**答**：因为数组作为参数会退化为指针，函数拿不到原始数组长度；必须显式传递长度保证边界安全。

---

### Q3: `const char*` 和 `char* const` 的区别？

**答**：

- `const char* p`：不能通过 `p` 修改字符内容
- `char* const p`：`p` 不能改指向，但可改内容

---

### Q4: 递归一定比循环慢吗？

**答**：不一定。  
递归更易表达分治/树结构；循环更节省栈空间。实际选择看可读性与性能要求（KISS + YAGNI）。

---

### Q5: 函数指针的典型用途是什么？

**答**：把算法行为参数化，例如排序比较器、回调、策略切换。在现代 C++ 中也常被 Lambda / `std::function` 替代。

---

## 五、总结与回顾 (Summary & Review)

### 核心记忆点

1. **函数原型是契约**：先声明，后调用，便于编译期类型检查。
2. **按值传递是拷贝语义**：适合小对象，不影响调用方数据。
3. **数组参数会退化为指针**：必须额外传长度，或使用 `std::span`。
4. **`const` 参数是只读承诺**：提高接口安全性和可维护性。
5. **C 风格字符串依赖 `'\0'`**：注意越界与空指针。
6. **结构体与 string 推荐 `const &`**：降低拷贝成本。
7. **递归两要素**：终止条件 + 收敛递推。
8. **函数指针是行为抽象**：签名必须完全匹配。

### 函数设计检查清单

- 是否为每个公共函数提供了清晰原型？
- 是否根据“是否修改入参”选择了 `const`？
- 是否对指针参数做了空指针检查？
- 是否对数组/字符串处理做了边界控制？
- 递归函数是否可证明终止？
- 能否用更简单的接口达到同样效果（KISS）？

---

> **下一章预告**：第 8 章将进入**函数探幽**，我们会继续学习内联函数、引用参数、默认参数、函数重载、模板等更强大的函数机制。
