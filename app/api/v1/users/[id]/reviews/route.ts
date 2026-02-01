import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.V1_API_BASE_URL;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        {
          status: "error",
          message: "API base URL not configured",
        },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          status: "error",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { skill, rating, comment } = body;

    if (!skill || typeof skill !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "Skill is required",
        },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          status: "error",
          message: "Rating must be a number between 1 and 5",
        },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 10) {
      return NextResponse.json(
        {
          status: "error",
          message: "Comment must be at least 10 characters",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        skill,
        rating,
        comment: comment.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to submit review",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
