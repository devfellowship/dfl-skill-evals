"use client"

import { ProfilePage } from '@/components/organisms/ProfilePage/ProfilePage'
import { AuthGuard } from '@/components/atoms/AuthGuard/AuthGuard'

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  )
}



