import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  Star,
  GraduationCap,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import type { UserStats } from "./types";

interface ProfileStatsProps {
  stats: UserStats;
}

interface StatConfig {
  key: keyof UserStats;
  label: string;
  icon: LucideIcon;
  gradient: string;
  format?: (value: number) => string;
}

const statConfig: StatConfig[] = [
  {
    key: "totalSessions",
    label: "Total Sessions",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    key: "completedSessions",
    label: "Completed",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    key: "averageRating",
    label: "Avg Rating",
    icon: Star,
    gradient: "from-yellow-500 to-orange-500",
    format: (value: number) => value.toFixed(1),
  },
  {
    key: "skillsTaught",
    label: "Skills Taught",
    icon: GraduationCap,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    key: "skillsLearned",
    label: "Skills Learned",
    icon: BookOpen,
    gradient: "from-pink-500 to-rose-500",
  },
];

function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const value = stats[stat.key];
        const displayValue = stat.format ? stat.format(value) : value;

        return (
          <Card key={stat.key} className="shadow-none overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center mb-3`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{displayValue}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default ProfileStats;
