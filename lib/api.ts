import { auth, clerkClient } from "@clerk/nextjs/server";
import { FullPost } from "@/lib/types/prisma/prisma-types";
import getPrisma from "@/lib/db/prisma";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const getAppById = async (id: string): Promise<FullPost | null> => {
  const userId = auth().userId;

  const { env } = getRequestContext();

  const prisma = getPrisma(env.DB);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        status: true,
        tags: true,
        upvotes: userId
          ? {
              where: {
                user_id: userId,
              },
              take: 1,
            }
          : false,
        category: true,
        _count: {
          select: { upvotes: true },
        },
      },
    });

    if (!post) {
      return null;
    }

    let fullPost: FullPost = {
      ...post,
      userUpvoted: post.upvotes?.length > 0,
      user: null,
    };

    if (post.user_id) {
      const user = await clerkClient().users.getUserList({
        userId: [post.user_id],
      });

      if (user.data.length > 0) {
        fullPost.user = user.data[0];
      }

      const externalId = await clerkClient().users.getUserList({
        externalId: [post.user_id],
      });

      if (externalId.data.length > 0) {
        fullPost.user = externalId.data[0];
      }
    }

    return fullPost;
  } catch (error) {
    console.error("Error fetching app by ID:", error);
    return null;
  }
};
