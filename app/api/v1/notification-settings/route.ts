import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SuccessResponse, ErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface NotificationSettingsData {
  email: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviewsAndRatings: boolean;
    achievements: boolean;
    securityAlerts: boolean;
  };
  push: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviewsAndRatings: boolean;
    achievements: boolean;
  };
  inApp: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviewsAndRatings: boolean;
    achievements: boolean;
  };
}

export async function GET() {
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

    const response = await fetch(`${API_BASE_URL}/notification-settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: SuccessResponse<NotificationSettingsData> | ErrorResponse =
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

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/notification-settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data: SuccessResponse<NotificationSettingsData> | ErrorResponse =
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
