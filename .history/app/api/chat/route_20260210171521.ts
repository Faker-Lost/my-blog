import { streamText, convertToModelMessages } from 'ai';
import { ark, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';

// 允许 Edge Runtime 提升性能
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 使用 streamText 结合 Volcengine 模型
  const result = streamText({
    model: ark('ep-202502101650-jklmn'), // 注意：火山引擎通常需要 endpoint ID
    system: FAKER_INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
