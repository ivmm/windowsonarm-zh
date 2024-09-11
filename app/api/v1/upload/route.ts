// app/api/get-upload-url/route.ts
/*import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DataResponse from "@/lib/backend/response/DataResponse";
import ErrorResponse from "@/lib/backend/response/ErrorResponse";

export const runtime = "edge";

interface UploadRequestBody {
  filename: string;
  contentType: string;
}

interface UploadResponse {
  url: string;
  fields: {
    key: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext();

    const body: UploadRequestBody = await request.json();

    // Configure the S3 client to use Cloudflare R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    });

    console.log(env.CLOUDFLARE_R2_ENDPOINT);
    console.log(env.CLOUDFLARE_R2_ACCESS_KEY_ID);
    console.log(env.CLOUDFLARE_R2_SECRET_ACCESS_KEY);

    if (!body.filename || !body.contentType) {
      return NextResponse.json(
        { error: "Filename and content type are required" },
        { status: 400 },
      );
    }

    // Random string
    const random = Math.random().toString(36).substring(7);

    // Generate a unique key for the file
    const fileKey = `uploads/${Date.nprismaow()}-${random}-${body.filename}`;

    console.log(env.CLOUDFLARE_R2_BUCKET_NAME);

    // Create the command to put an object in the bucket
    const putObjectCommand = new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileKey,
    });

    // Generate a pre-signed URL for the command
    const preSignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600,
    }); // URL expires in 1 hour

    // Return the pre-signed URL and any necessary form fields
    return DataResponse.json({
      url: preSignedUrl,
      fields: {
        key: fileKey,
      },
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return ErrorResponse.json("Failed to generate upload URL");
  }
}
*/
