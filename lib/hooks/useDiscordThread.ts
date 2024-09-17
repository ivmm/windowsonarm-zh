import { useState, useEffect } from 'react';
import axios from 'axios';

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    username: string;
    avatar_url: string;
  };
  timestamp: string;
}

interface DiscordThreadResponse {
  messages: DiscordMessage[];
}

export function useDiscordThread(threadId: string | null) {
  const [messages, setMessages] = useState<DiscordMessage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!threadId) {
      setLoading(false);
      return;
    }

    async function fetchMessages() {
      try {
        const response = await axios.get<DiscordThreadResponse>(`/api/v1/discord/thread/${threadId}`);
        setMessages(response.data.messages);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [threadId]);

  return { messages, loading, error };
}