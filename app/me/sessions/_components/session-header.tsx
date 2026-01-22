import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, Play } from "lucide-react";

interface SessionHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  stats: {
    total: number;
    active: number;
    scheduled: number;
    completed: number;
  };
}

function SessionHeader({ activeTab, onTabChange, stats }: SessionHeaderProps) {
  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Sessions</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your learning and teaching sessions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-1">
            <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-xs sm:text-sm text-muted-foreground">Active</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.active}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm text-muted-foreground">Scheduled</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.scheduled}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs sm:text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="mb-4 sm:mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 sm:flex-initial">
            Active ({stats.active})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex-1 sm:flex-initial">
            Scheduled ({stats.scheduled})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-initial">
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}

export default SessionHeader;
