"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  Target,
  Activity,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - replace with real data from your API
const stats = {
  totalExchanges: 24,
  activeSessions: 3,
  rating: 4.8,
  skillsLearned: 8,
  skillsTaught: 12,
};

const upcomingSessions = [
  {
    id: 1,
    type: "Learning",
    skill: "Photography",
    with: "Sarah Johnson",
    time: "Today, 2:00 PM",
    avatar: "/placeholder-avatar.jpg",
  },
  {
    id: 2,
    type: "Teaching",
    skill: "Web Development",
    with: "Mike Chen",
    time: "Tomorrow, 10:00 AM",
    avatar: "/placeholder-avatar.jpg",
  },
  {
    id: 3,
    type: "Learning",
    skill: "Spanish",
    with: "Maria Garcia",
    time: "Dec 28, 4:00 PM",
    avatar: "/placeholder-avatar.jpg",
  },
];

const recentExchanges = [
  {
    id: 1,
    type: "Completed",
    skill: "UI/UX Design",
    partner: "Alex Thompson",
    date: "2 days ago",
    rating: 5,
    avatar: "/placeholder-avatar.jpg",
    status: "completed",
  },
  {
    id: 2,
    type: "Completed",
    skill: "Guitar Lessons",
    partner: "David Lee",
    date: "5 days ago",
    rating: 5,
    avatar: "/placeholder-avatar.jpg",
    status: "completed",
  },
  {
    id: 3,
    type: "In Progress",
    skill: "Data Science",
    partner: "Emma Wilson",
    date: "Started 1 week ago",
    rating: null,
    avatar: "/placeholder-avatar.jpg",
    status: "active",
    progress: 65,
  },
];

const exchangeRequests = [
  {
    id: 1,
    from: "John Smith",
    skill: "Graphic Design",
    wantsToLearn: "React Development",
    message: "I'd love to exchange graphic design skills for React development!",
    avatar: "/placeholder-avatar.jpg",
    time: "2 hours ago",
  },
  {
    id: 2,
    from: "Lisa Park",
    skill: "Korean Language",
    wantsToLearn: "Cooking",
    message: "Looking to teach Korean in exchange for cooking lessons.",
    avatar: "/placeholder-avatar.jpg",
    time: "5 hours ago",
  },
];

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

const recentActivity = [
  {
    id: 1,
    type: "review",
    message: "Sarah Johnson left you a 5-star review",
    skill: "Web Development",
    time: "1 hour ago",
  },
  {
    id: 2,
    type: "exchange",
    message: "New exchange request from John Smith",
    skill: "Graphic Design",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "session",
    message: "Session scheduled with Mike Chen",
    skill: "Web Development",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "achievement",
    message: "You completed 10 sessions!",
    skill: "Photography",
    time: "2 days ago",
  },
];

function Page() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar - Sticky */}
        <aside className="w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Quick Stats */}
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

            {/* Upcoming Sessions */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled exchanges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.avatar} alt={session.with} />
                      <AvatarFallback>
                        {session.with.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={session.type === "Learning" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {session.type}
                        </Badge>
                        <span className="text-sm font-medium truncate">{session.skill}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{session.with}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{session.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-full cursor-pointer" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-2xl" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Exchange Request
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Find Skills to Learn
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Update My Skills
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your skill exchanges
            </p>
          </div>

          {/* Recent Exchanges */}
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Exchanges</CardTitle>
                  <CardDescription>Your latest skill exchange activities</CardDescription>
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={exchange.avatar} alt={exchange.partner} />
                    <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                      {exchange.partner.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{exchange.partner}</span>
                          <Badge
                            variant={exchange.status === "completed" ? "default" : "secondary"}
                          >
                            {exchange.status === "completed" ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{exchange.skill}</p>
                      </div>
                      {exchange.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{exchange.rating}</span>
                        </div>
                      )}
                    </div>
                    {exchange.progress && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{exchange.progress}%</span>
                        </div>
                        <Progress value={exchange.progress} className="h-2" />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{exchange.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Exchange Requests */}
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exchange Requests</CardTitle>
                  <CardDescription>People interested in exchanging skills with you</CardDescription>
                </div>
                <Badge variant="destructive" className="ml-2">
                  {exchangeRequests.length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {exchangeRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.avatar} alt={request.from} />
                    <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                      {request.from.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold">{request.from}</span>
                        <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{request.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        Teaching: {request.skill}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Learning: {request.wantsToLearn}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="rounded-full w-max">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full w-max">
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Progress */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your progress in skills you&apos;re learning</CardDescription>
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

          {/* Recent Activity */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    activity.type === "review" && "bg-green-100 dark:bg-green-900/20",
                    activity.type === "exchange" && "bg-blue-100 dark:bg-blue-900/20",
                    activity.type === "session" && "bg-purple-100 dark:bg-purple-900/20",
                    activity.type === "achievement" && "bg-yellow-100 dark:bg-yellow-900/20",
                  )}>
                    {activity.type === "review" && <Star className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {activity.type === "exchange" && <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {activity.type === "session" && <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                    {activity.type === "achievement" && <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.message}</span>
                      {activity.skill && (
                        <span className="text-muted-foreground"> - {activity.skill}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Highlights */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Community Highlights</CardTitle>
              <CardDescription>What&apos;s trending in the skill exchange community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                  <p className="font-semibold mb-1">Most Exchanged</p>
                  <p className="text-sm text-muted-foreground">Web Development</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="font-semibold mb-1">Active Members</p>
                  <p className="text-sm text-muted-foreground">1,234 online now</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Award className="h-8 w-8 text-purple-500 mb-2" />
                  <p className="font-semibold mb-1">Top Rated</p>
                  <p className="text-sm text-muted-foreground">4.9 avg rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default Page;
