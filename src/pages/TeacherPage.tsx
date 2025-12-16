import { TeacherDashboard } from "@/components/organisms/TeacherDashboard/TeacherDashboard"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"

export default function TeacherPage() {
  return (
    <AdminRouteWrapper allowedRoles={['superadmin', 'admin', 'mentor']}>
      <TeacherDashboard />
    </AdminRouteWrapper>
  )
}
