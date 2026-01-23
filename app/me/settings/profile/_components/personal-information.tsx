"use client";

import { useState, useMemo, useRef, useEffect, startTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
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
    language: data.language,
    timezone: data.timezone,
    website: data.website || "",
    deletedAt: null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function PersonalInformation() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultFormData = useMemo(() => {
    if (!user) {
      return {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        bio: "",
        location: "",
        website: "",
      };
    }
    const location = user.city && user.country 
      ? `${user.city}, ${user.country}` 
      : user.city || user.country || "";
    return {
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      username: user.username || "",
      bio: user.about || "",
      location,
      website: user.website || "",
    };
  }, [user]);

  // Use key-based reset pattern: reset state when user._id changes
  const [formData, setFormData] = useState(() => defaultFormData);
  const previousUserIdRef = useRef<string | null>(null);
  
  // Reset form when user data changes
  // Note: We use an effect here because React recommends using a key prop for this pattern,
  // but we can't control the key from inside the component. Using startTransition to
  // mark this as a non-urgent update, minimizing render blocking.
  useEffect(() => {
    if (user && previousUserIdRef.current !== user._id) {
      previousUserIdRef.current = user._id;
      startTransition(() => {
        setFormData(defaultFormData);
      });
    }
  }, [user?._id, defaultFormData, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Parse location into city and country
      // If location contains a comma, split it; otherwise use the whole value as city
      let city = "";
      let country = "";
      if (formData.location) {
        if (formData.location.includes(",")) {
          const locationParts = formData.location.split(",").map((part) => part.trim());
          city = locationParts[0] || "";
          country = locationParts[1] || "";
        } else {
          city = formData.location.trim();
        }
      }

      const updateData: Record<string, string> = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        about: formData.bio,
        city,
        country,
        website: formData.website || "",
      };

      const response = await apiPatch<UserResponseData>("/users/me", updateData);

      if (response.status === "success" && response.data) {
        const updatedUser = mapUserResponseToUser(response.data);
        setUser(updatedUser);
        toast.success("Personal information updated successfully");
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to update personal information", {
          description: errorResponse.error?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Failed to update personal information", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and how others see you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
            />
            <p className="text-xs text-muted-foreground">
              This is your unique identifier on the platform
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-muted-foreground">
              A brief description of yourself (max 160 characters)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PersonalInformation;
