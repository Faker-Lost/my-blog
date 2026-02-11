import { streamText, tool, convertToCoreMessages } from 'ai';
import { z } from 'zod';
import { mockModel } from '@/lib/ai/mock-model';

// 允许 Edge Runtime 提升性能
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 使用自定义的 Mock Model 替代真实 API
  const result = streamText({
    model: mockModel,
    messages: convertToCoreMessages(messages),
    system: 'You are a helpful assistant.',
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          // 这里是工具的实际逻辑，但在 MockModel 中我们简化了调用过程
          // 正常情况下，模型会决定调用此工具，SDK 执行此函数，然后结果回传给模型
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
