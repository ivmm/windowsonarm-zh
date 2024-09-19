import axios from "axios";
import { PrismaClient } from "@prisma/client";

const BATCH_SIZE = 5;
const DELAY_MS = 5000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function processBatch(posts: any[], env: any, prisma: any) {
  const results = await Promise.all(
    posts.map(async (post) => {
      const forumPostData = {
        name: `Discussion for ${post.title}`,
        auto_archive_duration: 10080,
        message: {
          content: `An app has been added: ${post.title}\n\nDescription: ${post.description}\n\nDiscuss this app here!`,
        },
      };

      try {
        const forumPostResponse = await axios.post(
          `https://discord.com/api/v10/channels/${env.DISCORD_FORUM_CHANNEL_ID}/threads`,
          forumPostData,
          {
            headers: {
              Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        await prisma.post.update({
          where: { id: post.id },
          data: {
            discord_forum_post_id: forumPostResponse.data.id,
          },
        });

        return { id: post.id, success: true };
      } catch (error) {
        console.error(
          `Failed to create forum post for post ${post.id}:`,
          error
        );
        return { id: post.id, success: false };
      }
    })
  );

  return results;
}

async function createForumPostsForExistingApps() {
  try {
    const prisma = new PrismaClient();

    const posts = await prisma.post.findMany({
      where: {
        discord_forum_post_id: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    let createdForumPosts = [];
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch = posts.slice(i, i + BATCH_SIZE);
      const batchResults = await processBatch(batch, process.env, prisma);
      createdForumPosts.push(...batchResults);

      if (i + BATCH_SIZE < posts.length) {
        await delay(DELAY_MS);
      }
    }

    const successCount = createdForumPosts.filter((p) => p.success).length;
    const failureCount = createdForumPosts.length - successCount;

    console.log({
      message: `Created forum posts for existing apps`,
      totalProcessed: createdForumPosts.length,
      successCount,
      failureCount,
    });

    await prisma.$disconnect();
  } catch (error: any) {
    console.error("Error creating forum posts:", error.message);
  }
}

createForumPostsForExistingApps();
