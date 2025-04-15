'use client'
import { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Message } from '@/types/message';
import { User } from '@/types/user';

interface ChatWindowProps {
  chatId: string;
  user: User;
}

export default function ChatWindow({ chatId, user }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!user) return; // Don't connect if not authenticated

    // Connect with auth token
    socket.auth = { userId: user.id };
    socket.connect();

    socket.on('message:receive', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('typing:start', () => setIsTyping(true));
    socket.on('typing:stop', () => setIsTyping(false));

    // Load previous messages
    socket.emit('messages:get', { chatId }, (messages: Message[]) => {
      setMessages(messages);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, chatId]);

  const handleSendMessage = (text: string) => {
    if (!user) return; // Don't send if not authenticated

    const message = {
      text,
      chatId,
      senderId: user.id
    };
    
    socket.emit('message:send', message);
    setMessages(prev => [...prev, message as Message]);
  };

  if (!user) {
    return <div className="flex items-center justify-center h-full">Please sign in to chat</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <MessageBubble 
            key={message.id || i} 
            message={message} 
            isOwnMessage={message.senderId === user.id}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
