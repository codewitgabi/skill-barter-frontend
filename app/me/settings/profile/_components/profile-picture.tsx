"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function ProfilePicture() {
  const { user } = useAuth();

  const handleUpload = () => {
    // Handle upload logic
    console.log("Uploading new profile picture...");
  };

  const handleRemove = () => {
    // Handle remove logic
    console.log("Removing profile picture...");
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
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size of 2MB.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUpload}>
                Upload New
              </Button>
              <Button variant="outline" size="sm" onClick={handleRemove}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePicture;
