import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface LoginResponseData {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    about: string;
    city: string;
    country: string;
    profile_picture: string;
    weekly_availability: number;
    skills: unknown[];
    interests: unknown[];
    skillsToTeach: {
      name: string;
      difficulty: "beginner" | "intermediate" | "advanced";
    }[];
    skillsToLearn: {
      name: string;
      difficulty: "beginner" | "intermediate" | "advanced";
    }[];
    language: string;
    timezone: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: SuccessResponse<LoginResponseData> | ErrorResponse =
      await response.json();

    if (
      response.ok &&
      "status" in data &&
      data.status === "success" &&
      data.data
    ) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY) || 60 * 15,
      });

      cookieStore.set("refreshToken", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY) || 60 * 60 * 24 * 7,
      });

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
