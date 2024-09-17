import { Client, TextChannel } from "discord.js";

const client = new Client({ intents: [] });

export async function createDiscordThread(messageId: string, name: string) {
  await client.login(process.env.DISCORD_BOT_TOKEN);
  const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID) as TextChannel;
  const thread = await channel.threads.create({
    name,
    startMessage: messageId,
  });
  await client.destroy();
  return thread;
}