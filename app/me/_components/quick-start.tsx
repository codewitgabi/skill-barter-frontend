"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, BookOpen, Award, Activity, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api-client";

interface StatsData {
  exchanges: number;
  active: number;
  rating: number;
  learned: number;
  taught: number;
}

function QuickStart() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<StatsData>("/users/me/stats");

        if (response.status === "success" && response.data) {
          setStats(response.data);
        }
      } catch {
        // Silently fail for dashboard component
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayStats = stats || {
    exchanges: 0,
    active: 0,
    rating: 0,
    learned: 0,
    taught: 0,
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Exchanges</span>
          </div>
          <span className="font-semibold">{displayStats.exchanges}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <span className="font-semibold">{displayStats.active}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">
              {displayStats.rating > 0 ? displayStats.rating.toFixed(1) : "0.0"}
            </span>
            {displayStats.rating > 0 && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Learned</span>
          </div>
          <span className="font-semibold">{displayStats.learned}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Taught</span>
          </div>
          <span className="font-semibold">{displayStats.taught}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickStart;
