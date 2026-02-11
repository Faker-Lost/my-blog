import { redirect } from 'next/navigation';

export default function AIStudioPage() {
  const newId = crypto.randomUUID();
  redirect(`/chat/${newId}`);
}
