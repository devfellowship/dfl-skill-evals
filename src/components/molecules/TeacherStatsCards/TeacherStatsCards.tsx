"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, TrendingUp } from "lucide-react"

interface TeacherStats {
  totalChallenges: number
  approvedChallenges: number
  toApproveChallenges: number
  totalSubmissions: number
}

interface TeacherStatsCardsProps {
  stats: TeacherStats
}

export function TeacherStatsCards({ stats }: TeacherStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meus Challenges</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalChallenges}</div>
          <p className="text-xs text-muted-foreground">
            {stats.approvedChallenges} aprovados, {stats.toApproveChallenges} a serem aprovados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.toApproveChallenges}</div>
          <p className="text-xs text-muted-foreground">Em revisão pelo admin</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Submissões</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          <p className="text-xs text-muted-foreground">
            De todos os seus challenges
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
