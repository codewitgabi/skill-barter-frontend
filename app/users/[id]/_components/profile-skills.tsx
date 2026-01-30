import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen } from "lucide-react";
import type { UserSkill } from "./types";

interface ProfileSkillsProps {
  skillsToTeach: UserSkill[];
  skillsToLearn: UserSkill[];
}

function getLevelColor(level: string) {
  switch (level) {
    case "beginner":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "intermediate":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "advanced":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    default:
      return "";
  }
}

function SkillCard({ skill }: { skill: UserSkill }) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border bg-linear-to-r from-background to-muted/30 hover:bg-accent/50 transition-colors">
      <span className="font-medium">{skill.name}</span>
      <Badge variant="outline" className={`${getLevelColor(skill.level)} border`}>
        {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
      </Badge>
    </div>
  );
}

function ProfileSkills({ skillsToTeach, skillsToLearn }: ProfileSkillsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Skills to Teach */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            Skills to Teach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {skillsToTeach.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </CardContent>
      </Card>

      {/* Skills to Learn */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            Skills to Learn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {skillsToLearn.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSkills;
