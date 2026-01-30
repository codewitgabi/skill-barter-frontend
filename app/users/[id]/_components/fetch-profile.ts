import { cookies } from "next/headers";
import type { UserProfile } from "./types";

const API_BASE_URL = process.env.V1_API_BASE_URL;

interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
  httpStatus: number;
}

export async function fetchUserProfile(
  userId: string
): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not configured");
      return { profile: null, error: "API not configured" };
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { profile: null, error: "User not found" };
      }
      return { profile: null, error: "Failed to fetch profile" };
    }

    const data: ProfileResponse = await response.json();

    if (data.status === "success" && data.data) {
      return { profile: data.data, error: null };
    }

    return { profile: null, error: "Failed to fetch profile" };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { profile: null, error: "Failed to fetch profile" };
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    if (!API_BASE_URL) {
      return null;
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status === "success" && data.data?.id) {
      return data.data.id;
    }

    return null;
  } catch {
    return null;
  }
}
