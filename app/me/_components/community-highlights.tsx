"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Users, Award, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api-client";

interface CommunityHighlightsData {
  mostExchanged: string;
  activeMembers: number;
  topRated: number;
}

function CommunityHighlights() {
  const [highlights, setHighlights] = useState<CommunityHighlightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<CommunityHighlightsData>(
          "/stats/community-highlights",
        );

        if (response.status === "success" && response.data) {
          setHighlights(response.data);
        }
      } catch {
        // Silently fail for dashboard component
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  const displayHighlights = highlights || {
    mostExchanged: "N/A",
    activeMembers: 0,
    topRated: 0,
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Community Highlights</CardTitle>
        <CardDescription>
          What&apos;s trending in the skill exchange community
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <p className="font-semibold mb-1">Most Exchanged</p>
              <p className="text-sm text-muted-foreground">
                {displayHighlights.mostExchanged}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <p className="font-semibold mb-1">Active Members</p>
              <p className="text-sm text-muted-foreground">
                {displayHighlights.activeMembers} online now
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <Award className="h-8 w-8 text-purple-500 mb-2" />
              <p className="font-semibold mb-1">Top Rated</p>
              <p className="text-sm text-muted-foreground">
                {displayHighlights.topRated > 0
                  ? `${displayHighlights.topRated.toFixed(1)} avg rating`
                  : "No ratings yet"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CommunityHighlights;
