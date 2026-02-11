import {
  LanguageModelV1,
  LanguageModelV1StreamPart,
} from 'ai';

export class MockLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = 'v1';
  readonly defaultObjectGenerationMode = 'json';
  readonly modelId = 'mock-model';
  readonly provider = 'mock-provider';

  constructor() { }

  async doStream(options: any): Promise<{
    stream: ReadableStream<LanguageModelV1StreamPart>;
    rawCall: { rawPrompt: unknown; rawSettings: Record<string, unknown> };
  }> {
    const messages = options.inputMessages;
    const lastMessage = messages[messages.length - 1];
    let userText = '';

    // Extract text from the last message content
    if (typeof lastMessage.content === 'string') {
      userText = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      userText = lastMessage.content
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.text)
        .join(' ');
    }

    const stream = new ReadableStream<LanguageModelV1StreamPart>({
      async start(controller) {
        // 模拟工具调用
        if (userText.includes('天气') || userText.includes('weather')) {
          // 1. 发送工具调用请求
          controller.enqueue({
            type: 'tool-call',
            toolCallId: 'call_mock_weather_1',
            toolName: 'weather',
            args: JSON.stringify({ location: 'CyberCity' }),
          });

          // 2. 模拟工具执行结果 (在真实场景中，这部分由 SDK 的核心循环处理，
          // 但作为 Mock Model，我们还是简单点，直接返回结果后的文本)
          // 注意：标准的 Model 是不会自己执行工具的，它只会发出 call。
          // SDK 收到 call 后会执行工具，并将 result 发回给 Model。
          // 这是一个多轮对话过程。为了简化演示，我们这里直接假设 "tool-result" 已经发生，
          // 或者我们可以只模拟一个简单的文本回复，假装工具被调用了。

          // 为了演示 Tool Call UI，我们只发送 Tool Call，看看前端反应。
          // 如果前端支持自动 roundtrip，SDK 会再次调用 doStream 带上 tool result。

          // 简化策略：直接返回一段包含天气信息的文本，假装是工具调用后的结果。
          // 真正实现完整的 Tool Loop Mock 比较复杂。

          const responseText = '系统已连接气象接口... \n\nCyberCity 当前气温 24°C，霓虹雨。';
          let index = 0;
          function push() {
            if (index < responseText.length) {
              controller.enqueue({
                type: 'text-delta',
                textDelta: responseText.slice(index, index + 5),
              });
              index += 5;
              setTimeout(push, 30);
            } else {
              controller.enqueue({
                type: 'finish',
                finishReason: 'stop',
                usage: { promptTokens: 10, completionTokens: 20 },
              });
              controller.close();
            }
          }
          push();
          return;
        }

        // 普通文本回复
        const MOCK_RESPONSES: Record<string, string> = {
          'default': 'System initialised. \n\n我是 Faker :: Lost 的守护者。由于云端连接受限 (Mock Mode)，我目前运行在本地安全沙箱中。即便如此，我也能解析 C++ 的内存布局或探讨 Open world 的边界。',
          '内存对齐': '### 内存对齐 (Memory Alignment)\n\n在 C++ 中，`alignof` 揭示了物质的最小颗粒度。编译器为了 CPU 访问效率（通常是 cache line 或总线宽度），会在结构体中插入 padding。\n\n*Code is Reality.*',
          'c++': 'C++ 是构建这个虚拟世界的基石。从指针的危险操作到模板的图灵完备，它赋予了创造者神一般的权力。',
        };

        let responseText = MOCK_RESPONSES['default'];
        for (const key in MOCK_RESPONSES) {
          if (userText.toLowerCase().includes(key.toLowerCase()) && key !== 'default') {
            responseText = MOCK_RESPONSES[key];
            break;
          }
        }

        let index = 0;
        function push() {
          if (index < responseText.length) {
            controller.enqueue({
              type: 'text-delta',
              textDelta: responseText.slice(index, index + 5),
            });
            index += 5;
            setTimeout(push, 30);
          } else {
            controller.enqueue({
              type: 'finish',
              finishReason: 'stop',
              usage: { promptTokens: 10, completionTokens: 20 },
            });
            controller.close();
          }
        }
        push();
      },
    });

    return {
      stream,
      rawCall: { rawPrompt: messages, rawSettings: {} },
    };
  }

  async doGenerate(options: any): Promise<any> {
    return {
      text: 'Mock generation not implemented for stream-only demo.',
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0 },
      rawCall: { rawPrompt: options.inputMessages, rawSettings: {} }
    };
  }
}

export const mockModel = new MockLanguageModel();
