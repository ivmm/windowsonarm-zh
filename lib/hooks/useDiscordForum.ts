import { useState, useEffect } from "react";
import axios from "axios";

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    username: string;
    avatar_url: string | null;
  };
  timestamp: number;
}

interface DiscordForumResponse {
  messages: DiscordMessage[];
  discordUrl: string;
}

export function useDiscordForum(postId: string | null) {
  const [messages, setMessages] = useState<DiscordMessage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [discordUrl, setDiscordUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    async function fetchMessages() {
      try {
        const response = await axios.get<DiscordForumResponse>(
          `/api/v1/posts/${postId}/forum`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        setMessages(response.data.messages);
        setDiscordUrl(response.data.discordUrl);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [postId]);

  return { messages, loading, error, discordUrl };
}
