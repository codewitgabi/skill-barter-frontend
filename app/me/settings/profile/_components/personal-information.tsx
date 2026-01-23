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
import { useAuth } from "@/hooks/use-auth";

function PersonalInformation() {
  const { user } = useAuth();
  
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
      website: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Profile updated:", formData);
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PersonalInformation;
