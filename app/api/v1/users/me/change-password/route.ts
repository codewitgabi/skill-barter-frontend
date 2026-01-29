import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
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
        { status: 401 },
      );
    }

    if (!API_BASE_URL) {
      return NextResponse.json(
        {
          statusCode: 500,
          status: "error",
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "API base URL not configured",
            details: [],
          },
        } as ErrorResponse,
        { status: 500 },
      );
    }

    const body: ChangePasswordRequest = await request.json();

    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: "error",
          error: {
            code: "BAD_REQUEST",
            message: "Current password and new password are required",
            details: [],
          },
        } as ErrorResponse,
        { status: 400 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/me/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
    });

    const data: SuccessResponse<null> | ErrorResponse = await response.json();

    if (response.ok && "status" in data && data.status === "success") {
      return NextResponse.json(data, { status: data.httpStatus || 200 });
    }

    return NextResponse.json(data, {
      status: "statusCode" in data ? data.statusCode : 500,
    });
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
