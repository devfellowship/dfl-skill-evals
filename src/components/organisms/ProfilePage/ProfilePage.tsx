'use client'
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardHeader, CardTitle } from '@devfellowship/components';
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { useProfile } from '@/hooks/useProfile'


import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { ProfileEditForm } from '@/components/molecules/ProfileEditForm/ProfileEditForm'
import { AdminNavigation } from '@/components/atoms/AdminNavigation/AdminNavigation'
import { User, Mail, Calendar, Shield, LogOut, Settings, Plus, Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { getUserDisplayName, getUserInitials } from '@/lib/utils/profile-utils'
export function ProfilePage() {
  const { user, signOut } = useAuth()
  const { role, label, color, isAdmin, isMentor, canCreateChallenges, isLoading: roleLoading } = useUserRole()
  const { profile } = useProfile()
  const router = useRouter()
  const [showEditForm, setShowEditForm] = useState(false)
  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      router.push('/')
    } catch {
      toast.error('Erro ao fazer logout')
    }
  }
  const [displayName, setDisplayName] = useState('')
  const [userInitials, setUserInitials] = useState('')
  useEffect(() => {
    const name = getUserDisplayName(user, profile as any)
    const initials = getUserInitials(name)
    setDisplayName(name)
    setUserInitials(initials)
  }, [user, profile])
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation 
        items={[]}
        showUserInfo={false}
        quickActions={[]}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Gerencie suas informações pessoais e acesse suas funcionalidades
            </p>
          </div>
          <Card className="border shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-8">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={displayName} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white text-2xl font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {displayName}
                  </h2>
                  <Badge className={`${color} text-white px-4 py-2 text-sm font-medium shadow-md`}>
                    <Shield className="w-4 h-4 mr-2" />
                    {label}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-primary font-medium">Email</p>
                    <p className="font-semibold text-foreground">{user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}</span>
                </div>
              </div>
              {!roleLoading && canCreateChallenges && (
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Ações Rápidas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="justify-start h-12 border-2 hover:border-primary/50 hover:bg-primary/5">
                      <Link href="/teacher/create" className="flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Criar Challenge</span>
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button asChild variant="outline" className="justify-start h-12 border-2 hover:border-purple-500/50 hover:bg-purple-500/5">
                        <Link href="/admin" className="flex items-center gap-3">
                          <Settings className="w-5 h-5" />
                          <span className="font-medium">Painel Admin</span>
                        </Link>
                      </Button>
                    )}
                    {isMentor && (
                      <Button asChild variant="outline" className="justify-start h-12 border-2 hover:border-primary/50 hover:bg-primary/5">
                        <Link href="/teacher" className="flex items-center gap-3">
                          <User className="w-5 h-5" />
                          <span className="font-medium">Painel Mentor</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <Button 
                  onClick={() => setShowEditForm(!showEditForm)}
                  variant="outline"
                  className="flex items-center gap-3 h-12 border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 font-medium"
                >
                  <Edit3 className="w-5 h-5" />
                  {showEditForm ? 'Cancelar Edição' : 'Editar Perfil'}
                </Button>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="flex items-center gap-3 h-12 border-2 border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sair da Conta
                </Button>
              </div>
            </CardContent>
          </Card>
          {showEditForm && (
            <div className="mt-8">
              <ProfileEditForm onClose={() => setShowEditForm(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}