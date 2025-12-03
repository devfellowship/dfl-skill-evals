"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/atoms/Button/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

interface UserProfile {
  id: string
  full_name: string
  role: string
  avatar_url?: string
}

export function ProfileSelector() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfileLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setProfile(data)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  if (loading || profileLoading) {
    return <div className="text-xs text-muted-foreground">Carregando...</div>
  }

  if (!user || !profile) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/login" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Login
        </Link>
      </Button>
    )
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrador',
      'superadmin': 'Super Admin',
      'mentor': 'Mentor',
      'teacher': 'Professor',
      'community_member': 'Comunidade',
    }
    return roleMap[role] || role
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="text-xs bg-blue-600 text-white">
              {profile.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-xs">{profile.full_name}</span>
          <span className="text-xs text-muted-foreground">({getRoleLabel(profile.role)})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-foreground">
          Perfil Atual
        </div>
        <div className="px-2 py-1 text-xs text-muted-foreground">
          {profile.full_name}
        </div>
        <div className="px-2 py-1 text-xs font-medium text-blue-600">
          {getRoleLabel(profile.role)}
        </div>
        <div className="my-2 h-px bg-border" />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            Editar Perfil
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
