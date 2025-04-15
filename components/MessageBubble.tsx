'use client'
import { Message } from '@/types/message';
import classNames from 'classnames';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage?: boolean;
}

export default function MessageBubble({ message, isOwnMessage = false }: MessageBubbleProps) {
  return (
    <div
      className={classNames('flex', {
        'justify-end': isOwnMessage,
        'justify-start': !isOwnMessage,
      })}
    >
      <div
        className={classNames('max-w-[70%] rounded-lg p-3', {
          'bg-blue-500 text-white': isOwnMessage,
          'bg-gray-200': !isOwnMessage,
        })}
      >
        <p className="text-sm">{message.text}</p>
        <div
          className={classNames('text-xs mt-1', {
            'text-blue-100': isOwnMessage,
            'text-gray-500': !isOwnMessage,
          })}
        >
          {message.createdAt && format(new Date(message.createdAt), 'HH:mm')}
          {message.editedAt && ' (edited)'}
        </div>
      </div>
    </div>
  );
}
