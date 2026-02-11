import { streamText } from 'ai';
import { deepseek, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { chats, messages as dbMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Switched to nodejs for Postgres compatibility
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await auth();

  // Optional: Require auth to chat? 
  // For now, if no user, we just stream without saving.
  // Or strict: if (!session) return new Response('Unauthorized', { status: 401 });

  const { messages, id } = await req.json();

  console.log('Incoming messages for chat:', id);

  // Manual conversion to CoreMessage to avoid type issues with convertToModelMessages
  const coreMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.content,
  }));

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: FAKER_INSTRUCTIONS,
    messages: coreMessages,
    onFinish: async ({ text }) => {
      if (session?.user?.id && id) {
        try {
          const createdAt = new Date();
          // 1. Ensure chat exists
          const existingChat = await db.query.chats.findFirst({
            where: eq(chats.id, id),
          });

          if (!existingChat) {
            const title = messages[0]?.content.substring(0, 50) || 'New Chat';
            await db.insert(chats).values({
              id,
              userId: session.user.id,
              title,
              createdAt,
              path: `/chat/${id}`,
            });
          }

          // 2. Save User Message (the last one)
          const lastUserMessage = messages[messages.length - 1];
          if (lastUserMessage && lastUserMessage.role === 'user') {
            await db.insert(dbMessages).values({
              id: crypto.randomUUID(),
              chatId: id,
              role: 'user',
              content: lastUserMessage.content,
              createdAt,
            });
          }

          // 3. Save AI Response
          await db.insert(dbMessages).values({
            id: crypto.randomUUID(),
            chatId: id,
            role: 'assistant',
            content: text,
            createdAt,
          });
        } catch (error) {
          console.error('Failed to save chat history:', error);
        }
      }
    },
  });

  return result.toDataStreamResponse();
}
