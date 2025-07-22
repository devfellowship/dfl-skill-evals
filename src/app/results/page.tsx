"use client"

import { Trophy, Clock, Target, TrendingUp, Code, CheckCircle, XCircle, ArrowRight, RotateCcw, Home, ChevronRight, LogOut, User } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/atoms/Progress/Progress"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const results = {
  overallScore: 85,
  percentile: 78,
  totalTime: "67 min",
  problemsCompleted: 4,
  totalProblems: 5,
  skillBreakdown: [
    { skill: "Algorithms", score: 90, maxScore: 100, improvement: "+5" },
    { skill: "Data Structures", score: 85, maxScore: 100, improvement: "+8" },
    { skill: "Problem Solving", score: 80, maxScore: 100, improvement: "+3" },
    { skill: "Code Quality", score: 88, maxScore: 100, improvement: "+12" },
  ],
  problemResults: [
    {
      title: "Two Sum",
      status: "completed",
      score: 100,
      timeSpent: "8 min",
      difficulty: "Easy",
      testsPassed: 3,
      totalTests: 3,
    },
    {
      title: "Binary Tree Traversal",
      status: "completed",
      score: 85,
      timeSpent: "15 min",
      difficulty: "Medium",
      testsPassed: 4,
      totalTests: 5,
    },
    {
      title: "API Design",
      status: "completed",
      score: 90,
      timeSpent: "22 min",
      difficulty: "Medium",
      testsPassed: 5,
      totalTests: 5,
    },
    {
      title: "Database Query Optimization",
      status: "completed",
      score: 75,
      timeSpent: "18 min",
      difficulty: "Hard",
      testsPassed: 3,
      totalTests: 4,
    },
    {
      title: "System Design",
      status: "incomplete",
      score: 0,
      timeSpent: "4 min",
      difficulty: "Hard",
      testsPassed: 0,
      totalTests: 3,
    },
  ],
}

export default function Results() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
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
                  <BreadcrumbPage>Results</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold">Assessment Results</h1>
            <p className="text-sm text-muted-foreground">Full-Stack JavaScript Challenge • Completed</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Assessment
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Hero Section - Overall Score */}
          <div className="text-center">
            <div className="relative mx-auto mb-6 h-32 w-32">
              <svg className="h-32 w-32 -rotate-90 transform">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.overallScore / 100)}`}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{results.overallScore}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Great Performance!</h2>
            <p className="text-lg text-muted-foreground mb-4">
              You scored better than {results.percentile}% of candidates
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Completed in {results.totalTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>
                  {results.problemsCompleted}/{results.totalProblems} Problems
                </span>
              </div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Skill Breakdown */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Skill Performance
                </CardTitle>
                <CardDescription>Your performance across different skill areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.skillBreakdown.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-green-600">
                          {skill.improvement}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {skill.score}/{skill.maxScore}
                        </span>
                      </div>
                    </div>
                    <Progress value={(skill.score / skill.maxScore) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
                <CardDescription>Summary of your assessment performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{results.overallScore}</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{results.percentile}%</div>
                    <div className="text-sm text-muted-foreground">Percentile</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{results.totalTime}</div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {results.problemsCompleted}/{results.totalProblems}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Problem-by-Problem Analysis */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Problem Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of each problem attempt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.problemResults.map((problem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {problem.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">{problem.title}</span>
                      </div>
                      <Badge
                        variant={
                          problem.difficulty === "Easy"
                            ? "secondary"
                            : problem.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{problem.score}%</div>
                        <div className="text-muted-foreground">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{problem.timeSpent}</div>
                        <div className="text-muted-foreground">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">
                          {problem.testsPassed}/{problem.totalTests}
                        </div>
                        <div className="text-muted-foreground">Tests</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Assessment
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
