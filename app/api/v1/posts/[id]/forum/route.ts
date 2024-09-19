import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getPrisma from "@/lib/db/prisma";
import { getRequestContext } from "@cloudflare/next-on-pages";
import ErrorResponse from "@/lib/backend/response/ErrorResponse";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const appId = params.id;
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);
    const discordToken = env.DISCORD_BOT_TOKEN;
    const guildId = env.DISCORD_GUILD_ID;

    // Fetch the post to get the Discord forum post ID
    const post = await prisma.post.findUnique({
      where: { id: appId },
      select: { discord_forum_post_id: true, title: true, description: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    let forumPostId = post.discord_forum_post_id;

    // If there's no forum post ID, create one
    if (!forumPostId) {
      const forumPostData = {
        name: `Discussion for ${post.title}`,
        auto_archive_duration: 10080, // 7 days
        message: {
          content: `A new app has been added: ${post.title}\n\nDescription: ${post.description}\n\nDiscuss this app here!`,
        },
      };

      const forumPostResponse = await axios.post(
        `https://discord.com/api/v10/channels/${env.DISCORD_FORUM_CHANNEL_ID}/threads`,
        forumPostData,
        {
          headers: {
            Authorization: `Bot ${discordToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      forumPostId = forumPostResponse.data.id;

      // Update post with Discord forum post info
      await prisma.post.update({
        where: { id: appId },
        data: { discord_forum_post_id: forumPostId },
      });
    }

    // From here, the code is similar to the original route
    const headers = {
      Authorization: `Bot ${discordToken}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    };

    // Fetch the thread information
    const threadResponse = await axios.get(
      `https://discord.com/api/v10/channels/${forumPostId}`,
      { headers },
    );

    const threadData = threadResponse.data;

    if (![10, 11, 12].includes(threadData.type)) {
      throw new Error("The provided ID does not correspond to a thread.");
    }

    // Unarchive the thread if necessary
    if (threadData.thread_metadata?.archived) {
      await axios.patch(
        `https://discord.com/api/v10/channels/${forumPostId}`,
        { archived: false },
        { headers },
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Add a unique timestamp to the API request
    const timestamp = Date.now();
    const response = await axios.get(
      `https://discord.com/api/v10/channels/${forumPostId}/messages?timestamp=${timestamp}`,
      {
        headers,
        params: {
          limit: 100,
        },
      },
    );

    const messagesData = response.data;

    // Format messages
    const formattedMessages = messagesData.map((msg: any) => ({
      id: msg.id,
      content: msg.content.replace(/\n/g, "\\n"), // Escape newline characters
      author: {
        username: msg.author.username,
        avatar_url: msg.author.avatar
          ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
          : null,
      },
      timestamp: new Date(msg.timestamp).getTime(),
    }));

    const nextResponse = NextResponse.json({
      messages: formattedMessages,
      discordUrl: `https://discord.com/channels/${guildId}/${forumPostId}`,
    });

    // Set cache control headers
    nextResponse.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    nextResponse.headers.set("Pragma", "no-cache");
    nextResponse.headers.set("Expires", "0");
    nextResponse.headers.set("Surrogate-Control", "no-store");

    return nextResponse;
  } catch (error) {
    return ErrorResponse.json((error as Error).message, {
      status: 500,
    });
  }
}
