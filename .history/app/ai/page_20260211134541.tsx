'use client';

import AIChat from '@/components/ai/AIChat';
import AISidebar from '@/components/ai/AISidebar';
import { useState, useEffect } from 'react';
import { generateId } from 'ai';

interface ChatHistoryItem {
  id: string;
  title: string;
  date: number;
  messages?: any[];
}

const STORAGE_KEY = 'faker_ai_chat_history';

export default function AIStudioPage() {
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.sort((a: any, b: any) => b.date - a.date));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    // Start a new chat if no history or just default
    handleNewChat();
  }, []);

  const handleNewChat = () => {
    const newId = generateId();
    setCurrentChatId(newId);
    setInitialMessages([]);
  };

  const handleSelectChat = (id: string) => {
    const chat = history.find(h => h.id === id);
    if (chat) {
      setCurrentChatId(id);
      setInitialMessages(chat.messages || []);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      handleNewChat();
    }
  };

  const handleChatFinish = (messages: any[]) => {
    if (messages.length === 0) return;

    // Generate a title from the first message if it's the first turn
    const firstMessage = messages.find(m => m.role === 'user');
    let title = 'New Conversation';
    if (firstMessage) {
      title = firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
    }

    const updatedHistory = [...history];
    const existingIndex = updatedHistory.findIndex(h => h.id === currentChatId);

    const newItem: ChatHistoryItem = {
      id: currentChatId,
      title: existingIndex >= 0 ? updatedHistory[existingIndex].title : title,
      date: Date.now(),
      messages: messages
    };

    if (existingIndex >= 0) {
      updatedHistory[existingIndex] = newItem;
    } else {
      updatedHistory.unshift(newItem);
    }

    // Sort by date desc
    updatedHistory.sort((a, b) => b.date - a.date);

    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  return (
    <div className="flex w-full h-full bg-zinc-50">
      {/* Sidebar */}
      <AISidebar
        onNewChat={handleNewChat}
        history={history}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onClearHistory={handleClearHistory}
      />

      {/* Main Chat Area */}
      <section className="flex-1 h-full relative overflow-hidden bg-zinc-100">
        {/* Pass key to force re-mount on chat switch to reset useChat state */}
        <AIChat
          key={currentChatId}
          chatId={currentChatId}
          initialMessages={initialMessages}
          onFinish={handleChatFinish}
        />
      </section>
    </div>
  );
}
