"use client"
import { BrandLogo } from "@/components/atoms/Logo/Logo"
import { Button } from "@/components/atoms/Button/Button"
import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"
import { MainSortButton } from "@/components/atoms/MainSortButton/MainSortButton"
import { User, LogOut, ArrowUpDown, Hash, Calendar, Zap, Star, Users, ArrowUp, ArrowDown } from "lucide-react"
import { Link } from 'react-router-dom'
import type { MainSortType } from "@/lib/main-challenge-sorter"
import { useAuth } from "@/components/providers/AuthProvider"
import { useUserRole } from "@/hooks/useUserRole"
import { useProfile } from "@/hooks/useProfile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/atoms/Badge/Badge"
import { MAIN_SORT_OPTIONS } from "@/consts/main-header"
const getIcon = (iconName: string) => {
  const icons = {
    Hash: <Hash className="w-4 h-4" />,
    Calendar: <Calendar className="w-4 h-4" />,
    Zap: <Zap className="w-4 h-4" />,
    Star: <Star className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
    ArrowUp: <ArrowUp className="w-4 h-4" />,
    ArrowDown: <ArrowDown className="w-4 h-4" />
  }
  return icons[iconName as keyof typeof icons] || <Hash className="w-4 h-4" />
}
interface MainHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
  sortBy: MainSortType
  onSortChange: (sort: MainSortType) => void
  showNavigation?: boolean
}
export function MainHeader({ 
  searchQuery, 
  onSearch, 
  sortBy, 
  onSortChange, 
  showNavigation = true 
}: MainHeaderProps) {
  const { user, signOut } = useAuth()
  const { isAdmin, isMentor, canCreateChallenges, isLoading: roleLoading } = useUserRole()
  const { profile } = useProfile()
  const currentOption = MAIN_SORT_OPTIONS.find(option => option.value === sortBy) || MAIN_SORT_OPTIONS[0]
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      }
  }
  const getUserDisplayName = () => {
    if (!user) return 'Usuário'
    if (profile?.full_name) {
      return profile.full_name
    }
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user.email) {
      return user.email.split('@')[0]
    }
    return 'Usuário'
  }
  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  const displayName = getUserDisplayName()
  const userInitials = getUserInitials()
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BrandLogo />
            <span className="text-foreground font-bold text-xl">Devfellowship</span>
          </Link>
        </div>
        {showNavigation && (
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="w-full max-w-md">
              <SearchButton 
                onSearch={onSearch}
                placeholder="Pesquisar challenges..."
                currentQuery={searchQuery}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">Ordem</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {MAIN_SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {getIcon(option.iconName)}
                    <span>{option.label}</span>
                    {sortBy === option.value && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Ativo
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className="flex items-center gap-4">
          {showNavigation && !roleLoading && (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button 
                  asChild 
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  <Link to="/admin">
                    Admin
                  </Link>
                </Button>
              )}
              {isMentor && (
                <Button 
                  asChild 
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  <Link to="/teacher">
                    Mentor
                  </Link>
                </Button>
              )}
              {canCreateChallenges && (
                <Button 
                  asChild 
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  <Link to="/create">
                    Criar
                  </Link>
                </Button>
              )}
            </div>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={displayName} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">
                      {displayName}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/auth/login">
                <User className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}