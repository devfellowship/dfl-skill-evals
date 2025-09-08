"use client"

import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { ChallengeCreateForm } from "@/components/organisms/ChallengeCreateForm/ChallengeCreateForm"
import { Users, BookOpen } from "lucide-react"

export default function CreateChallengePage() {
  return (
    <AdminRouteWrapper allowedRoles={['admin', 'mentor']}>
      <div className="min-h-screen bg-background">
        <AdminNavigation
          items={[
            { label: "Dashboard Teacher", href: "/teacher" },
            { label: "Criar Challenge", href: "/teacher/create" }
          ]}
          quickActions={[]}
          showBackButton={true}
          backHref="/teacher"
          backLabel="Voltar ao Dashboard"
          userName="Professor"
          userRole="Teacher"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Criar Novo Desafio</h1>
            <p className="text-muted-foreground mt-2">
              Crie um novo desafio para seus alunos resolverem
            </p>
          </div>

          <ChallengeCreateForm />
        </div>
      </div>
    </AdminRouteWrapper>
  )
}