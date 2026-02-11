'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { chats, messages } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export async function getChats() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.user.id))
    .orderBy(desc(chats.createdAt));

  return userChats;
}

export async function getChat(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, id),
  });

  if (!chat || chat.userId !== session.user.id) {
    return null;
  }

  const chatMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, id))
    .orderBy(asc(messages.createdAt));

  return {
    ...chat,
    messages: chatMessages,
  };
}

export async function removeChat(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership
  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, id),
  });

  if (!chat || chat.userId !== session.user.id) {
    return { error: 'Unauthorized' };
  }

  await db.delete(chats).where(eq(chats.id, id));
  revalidatePath('/');
  revalidatePath('/chat');
  redirect('/');
}

export async function saveChat({
  id,
  messages: newMessages,
  userId,
}: {
  id: string;
  messages: any[];
  userId: string;
}) {
  // Check if chat exists
  const existingChat = await db.query.chats.findFirst({
    where: eq(chats.id, id),
  });

  if (!existingChat) {
    // Generate title from first message
    const title = newMessages[0]?.content.substring(0, 100) || 'New Chat';

    await db.insert(chats).values({
      id,
      userId,
      title,
      createdAt: new Date(),
      path: `/chat/${id}`,
    });
  }

  // Save messages (this might be heavy if saving all every time, 
  // usually we save only new ones or use the API route for incremental save.
  // This action might be used for updating title or other metadata)
}
