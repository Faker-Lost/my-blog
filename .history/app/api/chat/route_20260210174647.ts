import { streamText, tool, convertToCoreMessages } from 'ai';
import { z } from 'zod';
import { mockModel } from '@/lib/ai/mock-model';

// 允许 Edge Runtime 提升性能
export const runtime = 'edge';

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
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let index = 0;
      // 模拟流式输出
      function push() {
        if (index < responseText.length) {
          const chunk = responseText.slice(index, index + 5);
          // AI SDK 6 协议格式: 0:text_content\n
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
          index += 5;
          setTimeout(push, 30);
        } else {
          controller.close();
        }
      }
      push();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
