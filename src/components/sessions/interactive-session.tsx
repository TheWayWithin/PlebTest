'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './chat-message';
import { PersonaPanel } from './persona-panel';
import { Send, Square, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface SessionData {
  id: string;
  status: string;
  mode: string;
  persona: {
    id: string;
    name: string;
    demographics?: Record<string, unknown>;
    psychographics?: Record<string, unknown>;
    skepticism_level?: string;
  };
  proposal: {
    problem: string;
    solution: string;
    hypotheses: string;
  };
  pushbackPreset: string;
  validationMode: string;
}

interface InteractiveSessionProps {
  sessionId: string;
  initialData: {
    session: SessionData;
    messages: Message[];
  };
}

export function InteractiveSession({ sessionId, initialData }: InteractiveSessionProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialData.messages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const session = initialData.session;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setIsLoading(true);
    setStreamingContent('');

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();
      let assistantMessageId: string | null = null;
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const event = line.slice(7);
            continue;
          }
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              if (parsed.messageId && !assistantMessageId) {
                assistantMessageId = parsed.messageId;
              }

              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingContent(fullContent);
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      // Add final assistant message
      if (fullContent) {
        const assistantMessage: Message = {
          id: assistantMessageId || `assistant-${Date.now()}`,
          role: 'assistant',
          content: fullContent,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setStreamingContent('');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endSession = async () => {
    if (!confirm('Are you sure you want to end this session?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to complete session');
      }

      const data = await response.json();

      // Show completion message briefly before redirect
      if (data.testComplete) {
        alert('All sessions complete! Report generation will begin shortly.');
      }

      router.push(`/ideas`);
    } catch (err) {
      console.error('Error ending session:', err);
      setError(err instanceof Error ? err.message : 'Failed to end session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Left sidebar - Persona info */}
      <div className="w-80 shrink-0 overflow-y-auto">
        <PersonaPanel
          persona={session.persona}
          pushbackPreset={session.pushbackPreset}
        />

        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <h4 className="font-medium text-sm text-zinc-700 dark:text-zinc-300 mb-2">
            Session Tips
          </h4>
          <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
            <li>- Ask about their past experiences with this problem</li>
            <li>- Probe for specific costs and time impacts</li>
            <li>- Listen for emotional signals and follow up</li>
            <li>- Don't pitch - ask questions instead</li>
          </ul>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={endSession}
        >
          <Square className="w-4 h-4 mr-2" />
          End Session
        </Button>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        {/* Chat header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Validation Session with {session.persona.name}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {session.validationMode === 'interactive' ? 'Interactive' : 'Spectator'} Mode
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !streamingContent && (
            <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              <p className="mb-2">Start the conversation by introducing your idea.</p>
              <p className="text-sm">
                Remember: Ask questions about their experiences, don't just pitch.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              personaName={message.role === 'assistant' ? session.persona.name : undefined}
            />
          ))}

          {streamingContent && (
            <ChatMessage
              role="assistant"
              content={streamingContent}
              isStreaming
              personaName={session.persona.name}
            />
          )}

          {error && (
            <div className="text-center text-red-500 text-sm py-2">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
