"use client"

import { TeacherDashboardClient } from "./TeacherDashboardClient"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"

export default function TeacherDashboard() {
  return (
    <AdminRouteWrapper allowedRoles={['mentor']}>
      <TeacherDashboardClient />
    </AdminRouteWrapper>
  )
}