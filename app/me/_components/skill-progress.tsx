import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const skillProgress = [
  {
    skill: "Photography",
    level: "Intermediate",
    progress: 75,
    sessionsCompleted: 6,
    totalSessions: 8,
  },
  {
    skill: "Spanish",
    level: "Beginner",
    progress: 40,
    sessionsCompleted: 4,
    totalSessions: 10,
  },
  {
    skill: "Data Science",
    level: "Advanced",
    progress: 65,
    sessionsCompleted: 13,
    totalSessions: 20,
  },
];
function SkillProgress() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>
          Track your progress in skills you&apos;re learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {skillProgress.map((skill, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold">{skill.skill}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {skill.level}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {skill.sessionsCompleted}/{skill.totalSessions} sessions
              </span>
            </div>
            <Progress value={skill.progress} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              {skill.progress}% complete
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SkillProgress;
