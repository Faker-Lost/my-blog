import { streamText } from 'ai';
import { deepseek, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';

// Use Edge Runtime for better performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const coreMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.content || m.text, // Handle potential text property
  }));

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: FAKER_INSTRUCTIONS,
    messages: coreMessages,
  });

  return result.toTextStreamResponse();
}
