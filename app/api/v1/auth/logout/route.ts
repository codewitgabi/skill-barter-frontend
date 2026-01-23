import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          status: "error",
          error: {
            code: "UNAUTHORIZED",
            message: "Refresh token not found",
            details: [],
          },
        } as ErrorResponse,
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data: SuccessResponse<null> | ErrorResponse = await response.json();

    if (response.ok && "status" in data && data.status === "success") {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

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
