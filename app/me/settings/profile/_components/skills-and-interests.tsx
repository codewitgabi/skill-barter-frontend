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
import { X, Plus, Loader2 } from "lucide-react";
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

function SkillsAndInterests() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  // Convert skills/interests to strings (handle both string arrays and object arrays)
  const defaultSkills = useMemo(() => {
    if (!user?.skills) return [];
    return (user.skills as unknown[]).map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        const obj = item as { name?: string; skill?: string };
        return obj.name || obj.skill || "";
      }
      return "";
    }).filter(Boolean);
  }, [user?.skills]);

  const defaultInterests = useMemo(() => {
    if (!user?.interests) return [];
    return (user.interests as unknown[]).map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        const obj = item as { name?: string; skill?: string };
        return obj.name || obj.skill || "";
      }
      return "";
    }).filter(Boolean);
  }, [user?.interests]);

  const [skills, setSkills] = useState<string[]>(() => defaultSkills);
  const [interests, setInterests] = useState<string[]>(() => defaultInterests);
  const previousUserIdRef = useRef<string | null>(null);

  // Reset when user data changes
  useEffect(() => {
    if (user && previousUserIdRef.current !== user._id) {
      previousUserIdRef.current = user._id;
      startTransition(() => {
        setSkills(defaultSkills);
        setInterests(defaultInterests);
      });
    }
  }, [user?._id, defaultSkills, defaultInterests, user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        skills,
        interests,
      };

      const response = await apiPatch<UserResponseData>("/users/me", updateData);

      if (response.status === "success" && response.data) {
        const updatedUser = mapUserResponseToUser(response.data);
        setUser(updatedUser);
        toast.success("Skills and interests updated successfully");
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to update skills and interests", {
          description: errorResponse.error?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Failed to update skills and interests", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Interests</CardTitle>
        <CardDescription>
          Manage your skills and areas of interest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>Your Skills</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Skills you can teach to others
            </p>
            <div className="space-y-3">
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full hover:bg-destructive/20"
                        onClick={() => handleRemoveSkill(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Web Development, Photography"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Learning Interests</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Skills you want to learn
            </p>
            <div className="space-y-3">
              {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-sm"
                    >
                      <span>{interest}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full hover:bg-destructive/20"
                        onClick={() => handleRemoveInterest(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No interests added yet</p>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Cooking, Spanish Language"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddInterest} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
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
        </div>
      </CardContent>
    </Card>
  );
}

export default SkillsAndInterests;
