"use client"

import { useState, use } from "react"
import { CheckCircle, AlertCircle, Monitor, Wifi, Clock, Star, Home, ChevronRight, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function PreAssessment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [systemChecks, setSystemChecks] = useState({
    browser: true,
    internet: true,
  })

  const assessment = {
    title: "Full-Stack JavaScript Challenge",
    description: "Test your React, Node.js, and database skills with real-world scenarios",
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    difficulty: 4,
    duration: "90 min",
    rating: 4.8,
  }


  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                  <BreadcrumbPage>{assessment.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
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
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Assessment Overview - Left Side */}
            <div className="lg:col-span-2">
              <Card className="border-border/40">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{assessment.title}</CardTitle>
                      <CardDescription className="mt-2">{assessment.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{assessment.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Skills */}
                  <div>
                    <h4 className="mb-2 font-medium">Skills Tested</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessment.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Assessment Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{assessment.duration}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Difficulty */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-2 rounded-full ${
                              level <= assessment.difficulty ? "bg-orange-500" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Environment Setup - Right Side */}
            <div className="lg:col-span-3">
              <div className="space-y-6">

                {/* System Check */}
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">System Check</CardTitle>
                    <CardDescription>Ensure your system is ready for the assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                        <span>Browser Compatibility</span>
                      </div>
                      {systemChecks.browser ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-muted-foreground" />
                        <span>Internet Connection</span>
                      </div>
                      {systemChecks.internet ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                  </CardContent>
                </Card>

                {/* Start Button */}
                <div className="flex gap-4">
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1"
                    disabled={!systemChecks.browser || !systemChecks.internet}
                  >
                    <Link href={`/assessment/${id}`}>Begin Assessment</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
