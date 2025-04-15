'use client'
import { useState, useRef } from 'react';
import socket from '@/lib/socket';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Handle typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    socket.emit('typing:start');
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      socket.emit('typing:stop');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </form>
  );
}