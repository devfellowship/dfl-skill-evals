"use client"
import { DashboardAdmin } from "@/components/organisms/DashboardAdmin/DashboardAdmin"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
export function AdminPage() {
  return (
    <AdminRouteWrapper allowedRoles={['superadmin', 'admin']}>
      <AdminNavigation 
        items={[
          { label: "Dashboard Admin", href: "/admin" }
        ]}
        quickActions={[]}
        showUserInfo={true}
      />
      <DashboardAdmin />
    </AdminRouteWrapper>
  )
}