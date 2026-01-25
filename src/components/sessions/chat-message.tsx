'use client';

import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  personaName?: string;
}

export function ChatMessage({ role, content, isStreaming, personaName }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-orange-500 text-white'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
        )}
      >
        {!isUser && personaName && (
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
            {personaName}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </p>
      </div>
    </div>
  );
}
