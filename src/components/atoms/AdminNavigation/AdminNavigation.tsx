"use client"

import { ReactNode, useState, useRef, useEffect } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, ChevronRight, ArrowLeft, User, Settings, BarChart3, Users, BookOpen, Plus, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { useProfile } from '@/hooks/useProfile'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getUserDisplayName, getUserInitials } from '@/lib/utils/profile-utils'

export interface NavigationItem {
  label: string
  href: string
  icon?: ReactNode
}

export interface QuickAction {
  label: string
  href: string
  icon?: ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}

interface AdminNavigationProps {
  items: NavigationItem[]
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  className?: string
  quickActions?: QuickAction[]
  showUserInfo?: boolean
  userName?: string
  userRole?: string
}

export function AdminNavigation({ 
  items = [], 
  showBackButton = false, 
  backHref, 
  backLabel = "Voltar",
  className = "",
  quickActions = [],
  showUserInfo = true,
  userName,
  userRole
}: AdminNavigationProps) {
  const { user, signOut } = useAuth()
  const { label: roleLabel, isLoading: roleLoading } = useUserRole()
  const { profile } = useProfile()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [displayName, setDisplayName] = useState('')
  const [userInitials, setUserInitials] = useState('')

  const getDisplayName = () => {
    if (userName) return userName
    return getUserDisplayName(user, profile as any)
  }

  useEffect(() => {
    const name = getDisplayName()
    const initials = getUserInitials(name)
    setDisplayName(name)
    setUserInitials(initials)
    
  }, [user, profile, userName])

  const getUserRoleDisplay = () => {
    if (userRole) return userRole
    
    if (roleLoading) return 'Carregando...'
    
    return roleLabel || 'Usuário'
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className={`bg-background/95 backdrop-blur border-b border-border/50 relative z-[9997] ${className}`}>
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-primary/5 text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground/60 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-primary/5 text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Link href={item.href}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {quickActions.length > 0 && (
            <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-border/30">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  asChild
                  className="text-sm rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <Link href={action.href}>
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {showBackButton && backHref && quickActions.length === 0 && (
              <Button 
                variant="outline" 
                asChild 
                size="sm"
                className="rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Link href={backHref}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backLabel}
                </Link>
              </Button>
            )}

            {showUserInfo && (
              <div className="relative z-[9998]" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/40 hover:border-border/60 transition-all duration-200 hover:scale-105 group cursor-pointer"
                >
                  <Avatar className="w-9 h-9 border-2 border-primary/20 group-hover:border-primary/30 transition-all duration-200">
                    <AvatarImage 
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url} 
                      alt={displayName} 
                    />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-sm">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {displayName}
                    </div>
                    <div className="text-xs text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-200">
                      {getUserRoleDisplay()}
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/95 backdrop-blur border border-slate-700/50 rounded-lg shadow-lg py-2 z-[9999]">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        handleSignOut()
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
