import { streamText } from 'ai';
import { deepseek, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';

// Use Edge Runtime for better performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Convert UI messages to CoreMessages
  // AI SDK 6 might send messages with `parts`, we need to ensure they are correctly formatted
  const coreMessages = messages.map((m: any) => {
    return {
      role: m.role,
      content: m.content || m.parts.map((p: any) => p.text).join(''),
    };
  });

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: FAKER_INSTRUCTIONS,
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
