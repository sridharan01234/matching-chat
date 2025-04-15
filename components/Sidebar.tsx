'use client'
import { User } from '@/types/user';
import Link from 'next/link';

interface SidebarProps {
  chats: Array<{
    id: string;
    participants: User[];
    lastMessage?: string;
  }>;
}

export default function Sidebar({ chats }: SidebarProps) {
  return (
    <div className="w-64 border-r h-full bg-gray-50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="block p-4 hover:bg-gray-100 border-b"
          >
            <div className="font-medium">
              {chat.participants.map(p => p.name).join(', ')}
            </div>
            {chat.lastMessage && (
              <div className="text-sm text-gray-500 truncate">
                {chat.lastMessage}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}