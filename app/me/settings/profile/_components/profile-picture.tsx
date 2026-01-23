"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { apiPatch } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { User } from "@/stores/auth/auth.types";

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
  language: string;
  timezone: string;
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
    language: data.language,
    timezone: data.timezone,
    deletedAt: null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function ProfilePicture() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPG, PNG, or GIF).",
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 2MB.",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profile-pictures");

      const uploadResponse = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (uploadData.status !== "success" || !uploadData.data?.url) {
        throw new Error(uploadData.error?.message || "Upload failed");
      }

      // Step 2: Update user profile with new picture URL
      const response = await apiPatch<UserResponseData>("/users/me", {
        profile_picture: uploadData.data.url,
      });

      if (response.status === "success" && response.data) {
        const updatedUser = mapUserResponseToUser(response.data);
        setUser(updatedUser);
        toast.success("Profile picture updated successfully");
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to update profile picture", {
          description: errorResponse.error?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Failed to update profile picture", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await apiPatch<UserResponseData>("/users/me", {
        profile_picture: "",
      });

      if (response.status === "success" && response.data) {
        const updatedUser = mapUserResponseToUser(response.data);
        setUser(updatedUser);
        toast.success("Profile picture removed successfully");
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to remove profile picture", {
          description: errorResponse.error?.message || "Please try again.",
        });
      }
    } catch {
      toast.error("Failed to remove profile picture", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return "JD";
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your profile picture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profile_picture || "/placeholder-avatar.jpg"} alt="Profile" />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white text-2xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || isRemoving}
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size of 2MB.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || isRemoving}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload New"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading || isRemoving || !user?.profile_picture}
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove"
                )}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePicture;
