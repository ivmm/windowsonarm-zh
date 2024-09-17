import { NextRequest, NextResponse } from "next/server";
import { Client, TextChannel } from "discord.js";
import { z } from "zod";

export const runtime = "edge";

const DiscordMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.object({
    username: z.string(),
    avatar_url: z.string().nullable(),
  }),
  timestamp: z.number(),
});

const DiscordThreadResponseSchema = z.object({
  messages: z.array(DiscordMessageSchema),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = new Client({ intents: [] });
    await client.login(process.env.DISCORD_BOT_TOKEN);

    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID) as TextChannel;
    const thread = await channel.threads.fetch(params.id);

    const messages = await thread.messages.fetch({ limit: 100 });
    
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      author: {
        username: msg.author.username,
        avatar_url: msg.author.avatarURL(),
      },
      timestamp: msg.createdTimestamp,
    }));

    await client.destroy();

    const response = DiscordThreadResponseSchema.parse({ messages: formattedMessages });
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}