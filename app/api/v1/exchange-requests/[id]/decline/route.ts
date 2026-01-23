import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          status: "error",
          error: {
            code: "UNAUTHORIZED",
            message: "Access token not found",
            details: [],
          },
        } as ErrorResponse,
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/exchange-requests/${params.id}/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: SuccessResponse<unknown> | ErrorResponse = await response.json();

    if (response.ok && "status" in data && data.status === "success") {
      return NextResponse.json(data, { status: data.httpStatus || 200 });
    }

    return NextResponse.json(data, { status: "statusCode" in data ? data.statusCode : 500 });
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
      { status: 500 }
    );
  }
}
