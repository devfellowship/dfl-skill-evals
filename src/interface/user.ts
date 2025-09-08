export interface User {
  id: string
  email: string
  role?: string
  name?: string
  avatar_url?: string
}

export interface AuthUser extends User {
  profile?: any
}

export interface UserManagementProps {
  users: User[]
  onUserUpdate: (userId: string, updates: Partial<User>) => void
  onUserDelete: (userId: string) => void
}

export interface ProfileInfoProps {
  user: User
  size?: "sm" | "md" | "lg"
}

export interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}
