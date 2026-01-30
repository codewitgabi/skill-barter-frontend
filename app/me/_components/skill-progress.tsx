"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

interface LearningProgressItem {
  skill: string;
  difficulty: string | null;
  completedSessions: number;
  totalSessions: number;
  percentComplete: number;
}

interface LearningProgressResponse {
  data: LearningProgressItem[];
}

function formatDifficulty(difficulty: string | null): string {
  if (!difficulty) return "Beginner";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function SkillProgressSkeleton() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>
          Track your progress in skills you&apos;re learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SkillProgressEmpty() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>
          Track your progress in skills you&apos;re learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No learning sessions yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start learning new skills to track your progress
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillProgress() {
  const [progress, setProgress] = useState<LearningProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLearningProgress() {
      try {
        const response = await apiGet<LearningProgressResponse["data"]>(
          "/sessions/learning-progress",
        );

        if (response.status === "success" && response.data) {
          setProgress(response.data);
        }
      } catch (error) {
        console.error("Error fetching learning progress:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLearningProgress();
  }, []);

  if (isLoading) {
    return <SkillProgressSkeleton />;
  }

  if (progress.length === 0) {
    return <SkillProgressEmpty />;
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>
          Track your progress in skills you&apos;re learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {progress.map((skill, index) => (
          <div key={index}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{skill.skill}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {formatDifficulty(skill.difficulty)}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                {skill.completedSessions}/{skill.totalSessions} sessions
              </span>
            </div>
            <Progress value={skill.percentComplete} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              {skill.percentComplete}% complete
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SkillProgress;
