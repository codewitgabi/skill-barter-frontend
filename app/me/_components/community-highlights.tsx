import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Users, Award } from "lucide-react";
import type { ICommunityHighlights } from "@/types/dashboard";

const highlights: ICommunityHighlights = {
  "most-exchanged": "Web Development",
  "active-members": 234,
  "top-rated": 4.9,
};

function CommunityHighlights() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Community Highlights</CardTitle>
        <CardDescription>
          What&apos;s trending in the skill exchange community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
            <p className="font-semibold mb-1">Most Exchanged</p>
            <p className="text-sm text-muted-foreground">
              {highlights["most-exchanged"]}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <p className="font-semibold mb-1">Active Members</p>
            <p className="text-sm text-muted-foreground">
              {highlights["active-members"]} online now
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <Award className="h-8 w-8 text-purple-500 mb-2" />
            <p className="font-semibold mb-1">Top Rated</p>
            <p className="text-sm text-muted-foreground">
              {highlights["top-rated"]} avg rating
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CommunityHighlights;
