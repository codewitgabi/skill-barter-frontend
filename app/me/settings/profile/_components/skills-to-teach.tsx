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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { apiPatch } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { User, SkillItem } from "@/stores/auth/auth.types";

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
  skillsToTeach: SkillItem[];
  skillsToLearn: SkillItem[];
  language: string;
  timezone: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

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

function SkillsToTeach() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Get skillsToTeach from user data
  const defaultSkills = useMemo((): SkillItem[] => {
    if (!user?.skillsToTeach) return [];
    return user.skillsToTeach
      .map((item) => ({
        name: item.name || "",
        difficulty: item.difficulty || "beginner",
      }))
      .filter((item) => item.name);
  }, [user?.skillsToTeach]);

  const [skills, setSkills] = useState<SkillItem[]>(() => defaultSkills);
  const previousUserIdRef = useRef<string | null>(null);

  // Reset when user data changes
  useEffect(() => {
    if (user && previousUserIdRef.current !== user._id) {
      previousUserIdRef.current = user._id;
      startTransition(() => {
        setSkills(defaultSkills);
      });
    }
  }, [user?._id, defaultSkills, user]);

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.some((s) => s.name === trimmedSkill)) {
      setSkills([...skills, { name: trimmedSkill, difficulty: "beginner" }]);
      setNewSkill("");
      setApiError(null);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    setApiError(null);
  };

  const handleUpdateDifficulty = (
    index: number,
    difficulty: SkillItem["difficulty"],
  ) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], difficulty };
    setSkills(updated);
    setApiError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setApiError(null);

    try {
      const response = await apiPatch<UserResponseData>("/users/me", {
        skillsToTeach: skills,
      });

      if (response.status === "success" && response.data) {
        const updatedUser = mapUserResponseToUser(response.data);
        setUser(updatedUser);
        toast.success("Skills to teach updated successfully");
      } else {
        const errorResponse = response as { error: { message: string } };
        const errorMessage =
          errorResponse.error?.message || "Please try again.";
        setApiError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      setApiError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills to Teach</CardTitle>
        <CardDescription>
          Add skills you can teach to others and your proficiency level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* API Error Alert */}
          {apiError && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Failed to save skills</p>
                <p className="text-sm opacity-90">{apiError}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {skills.length > 0 ? (
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{skill.name}</p>
                    </div>
                    <Select
                      value={skill.difficulty}
                      onValueChange={(value) =>
                        handleUpdateDifficulty(
                          index,
                          value as SkillItem["difficulty"],
                        )
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSkill(index)}
                      className="hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                No skills added yet. Add skills you can teach to others.
              </p>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Web Development, Photography, Guitar"
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
            <p className="text-xs text-muted-foreground">
              Press Enter or click Add. New skills default to Beginner level -
              you can change the level after adding.
            </p>
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

export default SkillsToTeach;
