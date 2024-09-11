import { NextRequest } from "next/server";
import { Status } from "@prisma/client";
import DataResponse from "@/lib/backend/response/DataResponse";
import ErrorResponse from "@/lib/backend/response/ErrorResponse";
import { getRequestContext } from "@cloudflare/next-on-pages";
import getPrisma from "@/lib/db/prisma";

export const runtime = "edge";

export interface StatusWithPercentage extends Status {
  percentage: number;
}

export async function GET(request: NextRequest) {
  try {
    /*
    const posts = JSON.parse(dataString);

    const { env } = getRequestContext();

    const prisma = getPrisma(env.DB);

    for (const postData of posts) {
      // Upsert Category
      const category = await prisma.category.upsert({
        where: { id: postData.category.id },
        update: {},
        create: {
          id: postData.category.id,
          index: postData.category.index,
          name: postData.category.name,
          icon: postData.category.icon,
        },
      });

      // Upsert Status
      const status = await prisma.status.upsert({
        where: { id: postData.statusRel.id },
        update: {},
        create: {
          id: postData.statusRel.id,
          index: postData.statusRel.index,
          name: postData.statusRel.name,
          color: postData.statusRel.color,
          text: postData.statusRel.text,
          icon: postData.statusRel.icon,
        },
      });

      // Upsert Post
      const post = await prisma.post.upsert({
        where: { id: postData.id },
        update: {}, // You can add update logic here if needed
        create: {
          id: postData.id,
          categoryId: category.id,
          title: postData.title,
          company: postData.company,
          user_id: postData.user_id,
          status: status.id,
          status_hint: postData.status_hint,
          description: postData.description,
          app_url: postData.app_url,
          community_url: postData.community_url,
          banner_url: postData.banner_url,
          icon_url: postData.icon_url,
          created_at: new Date(postData.created_at),
          updated_at: new Date(postData.updated_at),
          update_description: postData.update_description,
        },
      });

      // Create Upvotes
      await prisma.upvote.createMany({
        data: Array(postData._count.upvotes).fill({ post_id: post.id }),
      });
    }*/

    const { env } = getRequestContext();

    const prisma = getPrisma(env.DB);

    const categories = await prisma.category.findMany();

    const status = await prisma.$queryRaw<StatusWithPercentage[]>`
        SELECT
            Status.id as id,
            Status.name,
            Status.color,
            Status."idx",
            ROUND(CAST(COUNT(*) AS FLOAT) * 100 / (SELECT COUNT(*) FROM Post), 2) AS percentage
        FROM Post
                 INNER JOIN Status ON Post.status = Status.id
        GROUP BY Status.id, Status."idx", Status.name, Status.color
        ORDER BY Status."idx" ASC
    `;

    const tagsRaw = await prisma.$queryRaw<Array<{ name: string }>>`
        SELECT DISTINCT Tag.name
        FROM Tag
                 INNER JOIN _PostToTag ON Tag.id = _PostToTag.B
        ORDER BY Tag.name
    `;

    const tags = tagsRaw.map((tag) => tag.name);

    return DataResponse.json({
      categories,
      status,
      tags,
    });
  } catch (error: any) {
    return ErrorResponse.json(error.message);
  }
}
