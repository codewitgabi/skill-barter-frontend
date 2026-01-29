import { NextRequest, NextResponse } from "next/server";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface ResetPasswordRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: "error",
          error: {
            code: "BAD_REQUEST",
            message: "Email and password are required",
            details: [],
          },
        } as ErrorResponse,
        { status: 400 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: body.email, password: body.password }),
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
