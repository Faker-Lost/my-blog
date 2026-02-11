import { streamText, convertToModelMessages } from 'ai';
import { deepseek, FAKER_INSTRUCTIONS } from '@/lib/ai/agents';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { chats, messages as dbMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'ai';

// Switched to nodejs for Postgres compatibility
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await auth();

  // Optional: Require auth to chat? 
  // For now, if no user, we just stream without saving.
  // Or strict: if (!session) return new Response('Unauthorized', { status: 401 });

  const { messages, id } = await req.json();

  console.log('Incoming messages for chat:', id);

  const coreMessages = convertToModelMessages(messages);

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: FAKER_INSTRUCTIONS,
    messages: coreMessages,
    onFinish: async ({ text }) => {
      if (session?.user?.id && id) {
        try {
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
              createdAt: new Date(),
              path: `/chat/${id}`,
            });
          }

          // 2. Save User Message (the last one)
          const lastUserMessage = messages[messages.length - 1];
          if (lastUserMessage && lastUserMessage.role === 'user') {
            await db.insert(dbMessages).values({
              id: nanoid(),
              chatId: id,
              role: 'user',
              content: lastUserMessage.content,
              createdAt: new Date(),
            });
          }

          // 3. Save AI Response
          await db.insert(dbMessages).values({
            id: nanoid(),
            chatId: id,
            role: 'assistant',
            content: text,
            createdAt: new Date(),
          });
        } catch (error) {
          console.error('Failed to save chat history:', error);
        }
      }
    },
  });

  return result.toDataStreamResponse();
}
