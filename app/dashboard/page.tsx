"use client"

import { TrendingUp, Target, Clock, Trophy, Calendar, Code, BookOpen, Award, Users, Home, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"

const dashboardData = {
  user: {
    name: "Alex Chen",
    level: "Intermediate",
    streak: 7,
    totalAssessments: 12,
  },
  skillProgress: [
    { skill: "JavaScript", level: 85, trend: "+5" },
    { skill: "React", level: 78, trend: "+8" },
    { skill: "Node.js", level: 72, trend: "+3" },
    { skill: "Python", level: 65, trend: "+12" },
    { skill: "System Design", level: 58, trend: "+15" },
  ],
  recentAssessments: [
    {
      title: "Full-Stack JavaScript Challenge",
      score: 85,
      date: "2 days ago",
      difficulty: "Hard",
      status: "completed",
    },
    {
      title: "Python Data Structures",
      score: 92,
      date: "1 week ago",
      difficulty: "Medium",
      status: "completed",
    },
    {
      title: "React Advanced Patterns",
      score: 78,
      date: "2 weeks ago",
      difficulty: "Hard",
      status: "completed",
    },
  ],
  achievements: [
    { title: "Problem Solver", description: "Solved 50+ problems", icon: "🧩", unlocked: true },
    { title: "Speed Demon", description: "Completed assessment in under 30 min", icon: "⚡", unlocked: true },
    { title: "Perfectionist", description: "Scored 100% on an assessment", icon: "💯", unlocked: false },
    { title: "Consistent", description: "7-day streak", icon: "🔥", unlocked: true },
  ],
  recommendations: [
    {
      title: "Advanced Algorithms",
      description: "Improve your algorithm optimization skills",
      estimatedTime: "2-3 weeks",
      priority: "high",
    },
    {
      title: "Database Design",
      description: "Learn database modeling and optimization",
      estimatedTime: "1-2 weeks",
      priority: "medium",
    },
  ],
}

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your progress and improve your skills</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Alex Chen</p>
              <p className="text-xs text-muted-foreground">Software Engineer</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Welcome back, {dashboardData.user.name}!</h2>
              <p className="text-muted-foreground">You're on a {dashboardData.user.streak}-day streak 🔥</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{dashboardData.user.totalAssessments}</div>
              <div className="text-sm text-muted-foreground">Assessments Completed</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm text-muted-foreground">Percentile</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">45m</div>
                    <div className="text-sm text-muted-foreground">Avg Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-yellow-500/10 p-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardData.user.streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Skill Progress */}
            <div className="lg:col-span-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skill Progress
                  </CardTitle>
                  <CardDescription>Your improvement across different technologies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {dashboardData.skillProgress.map((skill) => (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-green-600">
                            {skill.trend}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                      </div>
                      <Progress value={skill.level} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Your coding milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      achievement.unlocked ? "bg-muted/50 hover:bg-muted/70" : "bg-muted/20 opacity-50"
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.unlocked && <Award className="h-4 w-4 text-yellow-500" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Assessments */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Assessments
                </CardTitle>
                <CardDescription>Your latest assessment results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recentAssessments.map((assessment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{assessment.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{assessment.date}</span>
                        <Users className="h-3 w-3" />
                        <span>Assessment</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          assessment.difficulty === "Easy"
                            ? "secondary"
                            : assessment.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {assessment.difficulty}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold">{assessment.score}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Recommendations */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Learning
                </CardTitle>
                <CardDescription>Personalized skill improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>{rec.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <div className="text-xs text-muted-foreground">Estimated time: {rec.estimatedTime}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
