"use client"

import { DashboardAdmin } from "@/components/organisms/DashboardAdmin/DashboardAdmin"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { BarChart3, Users, BookOpen, Plus } from "lucide-react"

export default function AdminPage() {
  return (
    <AdminRouteWrapper>
      <AdminNavigation 
        items={[
          { label: "Dashboard Admin", href: "/admin" }
        ]}
        quickActions={[
          {
            label: "Dashboard Teacher",
            href: "/teacher",
            icon: <Users className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "Criar Challenge",
            href: "/teacher/create",
            icon: <Plus className="h-4 w-4" />,
            variant: "default"
          }
        ]}
        showUserInfo={true}
        userName="Administrador"
        userRole="Admin"
      />
      <DashboardAdmin />
    </AdminRouteWrapper>
  )
}
