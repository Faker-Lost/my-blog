import { auth } from '@/auth';
import { getChats } from '@/lib/actions/chat';
import AISidebar from '@/components/ai/AISidebar';
import { redirect } from 'next/navigation';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Enforce auth?
  /*
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/chat');
  }
  */

  const chats = await getChats();

  return (
    <div className="flex w-full h-full bg-[#050508] text-white overflow-hidden">
      <AISidebar chats={chats} user={session?.user} />
      <div className="flex-1 h-full relative">
        {children}
      </div>
    </div>
  );
}
