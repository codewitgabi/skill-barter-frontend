import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, BookOpen, Award, Activity } from "lucide-react";

const stats = {
  totalExchanges: 24,
  activeSessions: 3,
  rating: 4.8,
  skillsLearned: 8,
  skillsTaught: 12,
};

function QuickStart() {
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
          <span className="font-semibold">{stats.totalExchanges}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <span className="font-semibold">{stats.activeSessions}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{stats.rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Learned</span>
          </div>
          <span className="font-semibold">{stats.skillsLearned}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Taught</span>
          </div>
          <span className="font-semibold">{stats.skillsTaught}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickStart;
