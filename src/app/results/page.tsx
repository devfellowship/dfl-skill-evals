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
import { mockAssessments } from "@/consts"
import { BREADCRUMB_LABELS, UI_MESSAGES } from "@/consts/ui"
import { mockResults, type SkillBreakdown, type ProblemResult } from "@/consts/results"

export default function Results() {
  const assessment = mockAssessments.find(a => a.id === 1) || mockAssessments[0]
  
  return (
    <div className="flex h-screen flex-col bg-background">
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
                  <BreadcrumbLink asChild>
                    <Link href="/pre-assessment/1">{BREADCRUMB_LABELS.PRE_ASSESSMENT}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/assessment/1">{BREADCRUMB_LABELS.ASSESSMENT}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{BREADCRUMB_LABELS.RESULTS}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
        <div className="text-center py-12 mb-12">
          <h1 className="text-2xl font-semibold text-primary mb-2">{UI_MESSAGES.RESULTS.TITLE}</h1>
          <p className="text-lg text-muted-foreground font-medium">{assessment.title}</p>
        </div>
        
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - mockResults.overallScore / 100)}`}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{mockResults.overallScore}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Great Performance!</h2>
            <p className="text-lg text-muted-foreground mb-4">
              You scored better than {mockResults.percentile}% of candidates
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Completed in {mockResults.totalTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>
                  {mockResults.problemsCompleted}/{mockResults.totalProblems} Problems
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Skill Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockResults.skillBreakdown.map((skill: SkillBreakdown) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {skill.score}/{skill.maxScore}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.improvement}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(skill.score / skill.maxScore) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{mockResults.overallScore}</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{mockResults.percentile}%</div>
                    <div className="text-sm text-muted-foreground">Percentile</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{mockResults.totalTime}</div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {mockResults.problemsCompleted}/{mockResults.totalProblems}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Problem-by-Problem Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResults.problemResults.map((problem: ProblemResult, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      {problem.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{problem.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{problem.difficulty}</span>
                          <span>{problem.timeSpent}</span>
                          <span>
                            {problem.testsPassed}/{problem.totalTests} tests passed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{problem.score}%</div>
                      <Badge
                        variant={problem.status === "completed" ? "secondary" : "destructive"}
                      >
                        {problem.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/assessment">
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Assessment
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
