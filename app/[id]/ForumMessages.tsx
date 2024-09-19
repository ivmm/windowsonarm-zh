import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from "@fluentui/react-components";
import { useDiscordForum } from "@/lib/hooks/useDiscordForum";
import GlobalMarkdown from "@/components/markdown";

const useStyles = makeStyles({
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  messageCard: {
    ...shorthands.overflow("hidden"),
  },
  messageContent: {
    padding: tokens.spacingHorizontalM,
    "& p": {
      margin: 0,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    "& a": {
      color: tokens.colorBrandBackground,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
  replyButton: {
    marginTop: tokens.spacingVerticalM,
  },
});

interface ForumMessagesProps {
  postId: string;
}

export default function ForumMessages({ postId }: ForumMessagesProps) {
  const classes = useStyles();
  const { messages, loading, error, discordUrl } = useDiscordForum(postId);

  const handleReplyClick = () => {
    if (discordUrl) {
      window.open(discordUrl, "_blank");
    }
  };

  if (loading) return <Text>Loading forum messages...</Text>;
  if (error) return <Text>Error loading forum messages: {error.message}</Text>;
  if (!messages || messages.length === 0)
    return <Text>No forum messages yet.</Text>;

  return (
    <div className={classes.messageContainer}>
      {messages.map((message) => (
        <Card key={message.id} className={classes.messageCard}>
          <CardHeader
            image={
              <Avatar
                image={{ src: message.author.avatar_url ?? undefined }}
                name={message.author.username}
                size={32}
              />
            }
            header={<Text weight="semibold">{message.author.username}</Text>}
            description={
              <Text size={200}>
                {new Date(message.timestamp).toLocaleString()}
              </Text>
            }
          />
          <div className={classes.messageContent}>
            <GlobalMarkdown>
              {message.content.replace(/\\n/g, "<br/>")}
            </GlobalMarkdown>
          </div>
        </Card>
      ))}
      {discordUrl && (
        <Button className={classes.replyButton} onClick={handleReplyClick}>
          Reply on Discord
        </Button>
      )}
    </div>
  );
}
