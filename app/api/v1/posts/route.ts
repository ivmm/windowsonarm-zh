import { NextRequest } from "next/server";
import ErrorResponse from "@/lib/backend/response/ErrorResponse";
import DataResponse from "@/lib/backend/response/DataResponse";
import { FullPost } from "@/lib/types/prisma/prisma-types";
import { postRequest } from "@/components/contribute-button";
import getPrisma from "@/lib/db/prisma";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { auth, clerkClient, getAuth } from "@clerk/nextjs/server";
import axios from "axios";

export const runtime = "edge";

const POSTS_PER_PAGE = 40; // Number of posts to fetch per batch

export interface PostsResponse {
  category: string | null;
  posts: FullPost[];
  nextCursor: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuth(request);

    const cursor = request.nextUrl.searchParams.get("cursor") || "";
    const category = request.nextUrl.searchParams.get("category");
    let status = request.nextUrl.searchParams.get("status");
    const search = request.nextUrl.searchParams.get("search");

    if (status === "undefined") {
      status = null;
    }

    const { env } = getRequestContext();

    const prisma = getPrisma(env.DB);

    const posts = await prisma.post.findMany({
      take: POSTS_PER_PAGE,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        AND: [
          category ? { category: { id: category } } : {},
          status ? { status_id: parseInt(status) } : { status_id: { not: -1 } },
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                  { company: { contains: search } },
                ],
              }
            : {},
        ],
      },
      include: {
        status: true,
        upvotes: user.userId
          ? {
              where: {
                user_id: user.userId,
              },
              take: 1,
            }
          : false,
        category: true,
        _count: {
          select: { upvotes: true },
        },
      },
      skip: cursor ? 1 : 0,
      orderBy: [
        {
          upvotes: {
            _count: "desc",
          },
        },
        {
          title: "asc",
        },
      ],
    });

    const postsWithUpvoteStatus: FullPost[] = posts.map((post) => ({
      ...post,
      tags: [],
      userUpvoted: false,
      user: null,
    }));

    const userIds = postsWithUpvoteStatus
      .map((post) => post.user_id)
      .filter((userId) => userId) as string[];

    let users = await clerkClient().users.getUserList({
      userId: userIds,
      limit: 100,
    });

    // TODO: Important: don't show unneeded user data
    users.data.forEach((user) => {
      postsWithUpvoteStatus.forEach((post) => {
        if (post.user_id === user.id) {
          post.user = user;
        }
      });
    });

    users = await clerkClient().users.getUserList({
      externalId: userIds,
      limit: 100,
    });

    users.data.forEach((user) => {
      postsWithUpvoteStatus.forEach((post) => {
        if (post.user_id === user.externalId) {
          post.user = user;
        }
      });
    });

    const nextCursor =
      posts.length === POSTS_PER_PAGE ? posts[posts.length - 1]?.id : null;

    const response: PostsResponse = {
      category,
      posts: postsWithUpvoteStatus,
      nextCursor,
    };

    return DataResponse.json(response);
  } catch (error: any) {
    return ErrorResponse.json(error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const postRequest = (await request.json()) as postRequest & {
      tags: string[];
    };

    const userId = auth().userId;

    if (!userId) {
      return ErrorResponse.json("User not found");
    }

    const { env } = getRequestContext();

    const prisma = getPrisma(env.DB);

    const status = await prisma.status.findUnique({
      where: {
        id: -1,
      },
    });

    if (!status) {
      return ErrorResponse.json("Testing status (-1) not found");
    }

    // Create or find tags
    const tagObjects = postRequest.tags
      ? await Promise.all(
          postRequest.tags.map(async (tagName) => {
            const existingTag = await prisma.tag.findFirst({
              where: { name: tagName },
            });

            if (existingTag) {
              return existingTag;
            } else {
              return prisma.tag.create({
                data: { name: tagName },
              });
            }
          }),
        )
      : [];

    const post = await prisma.post.create({
      data: {
        title: postRequest.title,
        description: postRequest.description,
        company: postRequest.company,
        categoryId: postRequest.categoryId,
        app_url: postRequest.app_url,
        banner_url: postRequest.banner_url,
        icon_url: postRequest.icon_url,
        status_hint: postRequest.status_hint
          ? parseInt(postRequest.status_hint)
          : null,
        status_id: -1,
        user_id: userId,
        tags: {
          connect: tagObjects.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
      },
    });

    // Create a forum post using Discord API
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
          Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update post with Discord forum post info
    await prisma.post.update({
      where: { id: post.id },
      data: {
        discord_forum_post_id: forumPostResponse.data.id,
      },
    });

    return DataResponse.json(post);
  } catch (error: any) {
    console.error(error);
    return ErrorResponse.json(error.message);
  }
}
