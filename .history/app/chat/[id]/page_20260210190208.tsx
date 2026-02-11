import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getChat } from '@/lib/actions/chat';
import AIChat from '@/components/ai/AIChat';
import { nanoid } from 'ai';

export interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`);
  }

  const chat = await getChat(params.id);

  if (!chat) {
    notFound();
  }

  // Convert DB messages to UI messages (if needed)
  // or pass as is if compatible. db messages have { role, content, id } which is compatible.

  return (
    <div className="flex-1 overflow-hidden h-full">
      <AIChat chatId={chat.id} initialMessages={chat.messages} />
    </div>
  );
}
