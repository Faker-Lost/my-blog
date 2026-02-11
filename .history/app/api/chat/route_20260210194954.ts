import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { deepseek, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';

// Use Node.js Runtime for better network compatibility and debugging
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert UI messages to CoreMessages
    // UI messages might contain `parts` which need to be processed
    const coreMessages = messages.map((m: any) => {
      return {
        role: m.role,
        content: m.content || m.parts.map((p: any) => p.text).join(''),
      };
    });

    console.log('Sending request to DeepSeek with messages count:', coreMessages.length);

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: FAKER_INSTRUCTIONS,
      messages: coreMessages,
      onFinish: () => {
        console.log('Stream finished successfully');
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to connect to AI service', details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
