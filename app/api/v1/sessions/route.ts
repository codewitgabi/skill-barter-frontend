import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface Session {
  id: string;
  userRole: string;
  instructor: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  learner: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  skill: string;
  type: string;
  status: string;
  scheduledDate: string;
  duration: number;
  description: string | null;
  location: string;
  meetingLink: string | null;
  address: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SessionsData {
  sessions: Session[];
  dashboard: {
    total: number;
    active: number;
    scheduled: number;
    completed: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();

    if (searchParams.get("page")) {
      queryParams.append("page", searchParams.get("page")!);
    }
    if (searchParams.get("limit")) {
      queryParams.append("limit", searchParams.get("limit")!);
    }
    if (searchParams.get("status")) {
      queryParams.append("status", searchParams.get("status")!);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/sessions${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: SuccessResponse<SessionsData> | ErrorResponse =
      await response.json();

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
