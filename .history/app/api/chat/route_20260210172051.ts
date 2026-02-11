import { streamText, convertToModelMessages } from 'ai';
import { ark, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';

// 允许 Edge Runtime 提升性能
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 将 UIMessage 转换为 CoreMessage (AI SDK 6 协议)
  const coreMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('\n'),
  }));

  // 使用 streamText 结合 Volcengine 模型
  const result = streamText({
    model: ark('ep-202502101650-jklmn'),
    system: FAKER_INSTRUCTIONS,
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
