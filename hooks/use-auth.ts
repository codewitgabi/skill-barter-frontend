import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { User } from "@/stores/auth/auth.types";
import type { ErrorResponse } from "@/types/api-response";

interface UserResponseData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  about: string;
  city: string;
  country: string;
  location: string;
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
  website: string;
  createdAt: string;
  updatedAt: string;
}

function mapUserResponseToUser(data: UserResponseData): User {
  return {
    _id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    email: data.email,
    about: data.about,
    city: data.city,
    country: data.country,
    profile_picture: data.profile_picture,
    weekly_availability: data.weekly_availability,
    skills: data.skills,
    interests: data.interests,
    skillsToTeach: data.skillsToTeach || [],
    skillsToLearn: data.skillsToLearn || [],
    language: data.language,
    timezone: data.timezone,
    website: data.website || "",
    deletedAt: null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const response = await apiGet<UserResponseData>("/users/me");

          if (response.status === "success" && response.data) {
            const userData = mapUserResponseToUser(response.data);
            setUser(userData);
          } else {
            const errorResponse = response as ErrorResponse;
            if (errorResponse.statusCode === 401) {
              router.push("/auth/signin");
            }
          }
        } catch {
          router.push("/auth/signin");
        }
      };

      fetchUser();
    }
  }, [user, setUser, router]);

  return { user };
}
