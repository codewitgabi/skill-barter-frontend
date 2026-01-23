import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface Connection {
  id: string;
  avatarUrl: string;
  initials: string;
  name: string;
  location: string;
  rating: number;
  numberOfReviews: number;
  bio: string;
  teachingSkills: string[];
  learningSkills: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ConnectionsResponseData {
  connections: Connection[];
  pagination: Pagination;
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
        { status: 401 }
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
    if (searchParams.get("search")) {
      queryParams.append("search", searchParams.get("search")!);
    }
    if (searchParams.get("skill")) {
      queryParams.append("skill", searchParams.get("skill")!);
    }
    if (searchParams.get("location")) {
      queryParams.append("location", searchParams.get("location")!);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/connections${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: SuccessResponse<ConnectionsResponseData> | ErrorResponse = await response.json();

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
