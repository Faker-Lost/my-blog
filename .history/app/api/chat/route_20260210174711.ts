import { createDataStreamResponse } from 'ai';

// 允许 Edge Runtime 提升性能
export const runtime = 'edge';

// 模拟的黑客风格回复库
const MOCK_RESPONSES: Record<string, string> = {
  'default': 'System initialised. Accessing blog databases... \n\n你好，我是 Faker :: Lost 的守护者。由于目前云端链接协议波动（代码 404/402），我已进入**离线安全模式**。尽管如此，我依然可以探讨关于代码与现实的本质。你想聊点什么？',
  '内存对齐': '### 内存对齐 (Memory Alignment) 分析报告\n\n在 C++ 中，内存对齐是性能优化的核心。底层原理如下：\n1. **对齐模数 (Alignment Requirement)**：不同类型有不同的对齐要求（如 `int` 通常是 4 字节）。\n2. **结构体填充 (Padding)**：编译器为保证成员地址满足对齐要求，会插入空白字节。\n3. **`alignas` 与 `alignof`**：C++11 引入的关键字允许我们手动控制对齐方式。\n\n*Code is Reality. 这里的物理地址就是你的现实。*',
  'C++': 'C++ 是这个世界的底层脚本。从底层的 RAII 管理到高层的模板元编程，它在不断模糊物质与逻辑的界限。',
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // 提取用户输入
  const userText = lastMessage.parts?.find((p: any) => p.type === 'text')?.text || lastMessage.content || '';

  console.log('Mock Mode - User Input:', userText);

  // 匹配回复内容
  let responseText = MOCK_RESPONSES['default'];
  for (const key in MOCK_RESPONSES) {
    if (userText.toLowerCase().includes(key.toLowerCase())) {
      responseText = MOCK_RESPONSES[key];
      break;
    }
  }

  // 返回模拟的数据流
  return createDataStreamResponse({
    execute: (dataStream) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < responseText.length) {
          // 模拟流式输出，每次发送一小段
          dataStream.writeChunk({
            type: 'text-part',
            text: responseText.slice(index, index + 8)
          });
          index += 8;
        } else {
          clearInterval(interval);
          dataStream.writeChunk({
            type: 'finish-step',
            finishReason: 'stop',
            usage: { completionTokens: 0, promptTokens: 0 }
          });
        }
      }, 40);
    },
  });
}
