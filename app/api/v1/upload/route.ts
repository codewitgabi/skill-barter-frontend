import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string | null;
    const resourceType = (formData.get("resourceType") as string) || "auto";

    if (!file) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: "error",
          error: {
            code: "INVALID_REQUEST",
            message: "File is required",
            details: [],
          },
        } as ErrorResponse,
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadOptions: Record<string, unknown> = {
      resource_type: resourceType,
      quality: "auto",
      fetch_format: "auto",
    };

    if (folder) {
      uploadOptions.folder = folder;
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(
      {
        status: "success",
        message: "File uploaded successfully",
        data: {
          url: (result as { secure_url: string }).secure_url,
          publicId: (result as { public_id: string }).public_id,
        },
        httpStatus: 200,
      } as SuccessResponse<{ url: string; publicId: string }>,
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        statusCode: 500,
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          details: [],
        },
      } as ErrorResponse,
      { status: 500 },
    );
  }
}
