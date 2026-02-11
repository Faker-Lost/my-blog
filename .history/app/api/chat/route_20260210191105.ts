import { streamText } from 'ai';
import { deepseek, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';

// Use Edge Runtime for better performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: FAKER_INSTRUCTIONS,
    messages,
  });

  return result.toDataStreamResponse();
}
