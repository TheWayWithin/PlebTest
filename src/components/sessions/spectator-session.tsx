'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { PersonaPanel } from './persona-panel';
import { Play, Pause, SkipForward, Square, Loader2 } from 'lucide-react';

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

interface SpectatorSessionProps {
  sessionId: string;
  initialData: {
    session: SessionData;
    messages: Message[];
  };
}

const POLL_INTERVAL = 2000; // Poll every 2 seconds

export function SpectatorSession({ sessionId, initialData }: SpectatorSessionProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialData.messages);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(initialData.session.status === 'completed');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const session = initialData.session;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isPaused) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isPaused]);

  // Fetch latest messages
  const fetchMessages = useCallback(async () => {
    if (isPaused) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}/stream`);
      if (!response.ok) return;

      const data = await response.json();

      // Update messages
      setMessages(data.messages || []);

      // Check if session is complete
      if (data.session?.status === 'completed' || data.session?.status === 'abandoned') {
        setIsComplete(true);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [sessionId, isPaused]);

  // Start/stop polling
  useEffect(() => {
    if (isComplete || isPaused) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    // Start polling
    fetchMessages();
    pollIntervalRef.current = setInterval(fetchMessages, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchMessages, isComplete, isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const skipToEnd = async () => {
    // Fetch final state
    await fetchMessages();
    setIsPaused(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const endSession = async () => {
    if (!confirm('Are you sure you want to leave this session?')) return;
    router.push(`/ideas`);
  };

  // Calculate progress
  const progressPercent = Math.min((messages.length / 16) * 100, 100); // Assuming max ~16 messages (8 exchanges * 2)

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
            Spectator Mode
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            Watch the AI interviewer validate your idea with this persona. The conversation will progress automatically.
          </p>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span>Progress</span>
              <span>{messages.length} messages</span>
            </div>
            <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePause}
              disabled={isComplete}
              className="flex-1"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={skipToEnd}
              disabled={isComplete}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={endSession}
        >
          <Square className="w-4 h-4 mr-2" />
          Leave Session
        </Button>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        {/* Chat header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Validation Session with {session.persona.name}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Spectator Mode - AI-to-AI Interview
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isComplete ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                  Complete
                </span>
              ) : isPaused ? (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                  Paused
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  In Progress
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Waiting for conversation to start...</p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              personaName={message.role === 'assistant' ? session.persona.name : 'Interviewer'}
            />
          ))}

          {!isComplete && !isPaused && messages.length > 0 && (
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Conversation in progress...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 text-sm py-2">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer - read-only indicator */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            {isComplete
              ? 'Session complete. View the report to see validation results.'
              : 'Watching AI-to-AI interview. You cannot send messages in spectator mode.'}
          </p>
        </div>
      </div>
    </div>
  );
}
