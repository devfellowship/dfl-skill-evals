'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/atoms/Badge/Badge'
import { Input } from '@/components/atoms/Input/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { UserRole, supabase } from '@/lib/supabase'
import { Loader2, Users, Search, Pencil } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  phone?: string | null
  created_at: string
  updated_at: string
}

const roleLabels: Record<UserRole, string> = {
  superadmin: 'Super Administrador',
  admin: 'Administrador',
  community_member: 'Membro da Comunidade',
}

const roleColors: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800',
  community_member: 'bg-blue-100 text-blue-800',
}

export function UserManagement() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [q, setQ] = useState('')
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [selected, setSelected] = useState<User | null>(null)
  const [credSaving, setCredSaving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {}
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`

      const sp = new URLSearchParams()
      if (q) sp.set('q', q)
      if (from) sp.set('from', from)
      if (to) sp.set('to', to)

      const res = await fetch(`/api/admin/users?${sp.toString()}`, { headers })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao buscar usuários')
      }
      const data = await res.json()
      setUsers(data.users || [])
    } catch (e: any) {
      toast.error(e.message || 'Erro ao buscar usuários')
    } finally {
      setLoading(false)
    }
  }

  const counts = useMemo(() => {
    const acc: Record<UserRole, number> = { superadmin: 0, admin: 0, community_member: 0 }
    users.forEach(u => { acc[u.role]++ })
    return acc
  }, [users])

  function openUser(u: User) {
    setSelected(u)
    setFormData({ ...u })
  }

  async function saveProfile() {
    if (!selected) return
    
    try {
      setSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`

      const res = await fetch(`/api/admin/users`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          userId: selected.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          is_active: formData.is_active,
        }),
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao salvar perfil')
      }
      
      const data = await res.json()
      setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u))
      toast.success('Perfil atualizado com sucesso!')
      setSelected(null)
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  async function resetPassword() {
    if (!selected) return
    
    try {
      setCredSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`

      // Gerar uma senha temporária mais segura
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + '!'
      
      const res = await fetch(`/api/admin/users/${selected.id}/credentials`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          password: tempPassword,
        }),
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao resetar senha')
      }
      
      const result = await res.json()
      
      toast.success(`Senha resetada! Nova senha temporária: ${tempPassword}`)
    } catch (e: any) {
      toast.error(e.message || 'Erro ao resetar senha')
    } finally {
      setCredSaving(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-blue-600">Gerenciar Usuários</h2>
            <p className="text-gray-500">Busque e edite perfis; alterações são logadas.</p>
          </div>
        </div>
        <Button onClick={fetchUsers} variant="outline">Atualizar</Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr,160px,160px,120px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              className="pl-8"
              placeholder="Buscar por nome, email, telefone…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          <Input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          <Button onClick={fetchUsers}>Pesquisar</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(Object.keys(roleLabels) as UserRole[]).map(role => (
          <Card key={role} className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">{roleLabels[role]}</div>
            <div className="text-2xl font-bold">{counts[role]}</div>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando…</span>
        </div>
      ) : users.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">Nenhum usuário</Card>
      ) : (
        <div className="space-y-4">
          {users.map(u => (
            <Card key={u.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {u.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    
                    {/* Informações principais */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{u.full_name}</h3>
                        <Badge className={roleColors[u.role]}>{roleLabels[u.role]}</Badge>
                        {u.is_active ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inativo
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Email:</span> {u.email}
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span> {u.phone || 'Não informado'}
                        </div>
                        <div>
                          <span className="font-medium">ID:</span> {u.id.slice(0, 8)}...
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Criado em {new Date(u.created_at).toLocaleDateString('pt-BR')} às {new Date(u.created_at).toLocaleTimeString('pt-BR')}
                        {u.updated_at !== u.created_at && (
                          <span className="ml-4">
                            Atualizado em {new Date(u.updated_at).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Botão de ação */}
                <div className="ml-4">
                  <Button onClick={() => openUser(u)} className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Gerenciar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de gerenciamento */}
      <Dialog open={!!selected} onOpenChange={(v)=>!v && setSelected(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {selected?.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              Gerenciar Usuário: {selected?.full_name}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-8 bg-background p-6 rounded-lg">
              {/* Formulário de Edição */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-6">Editar Informações do Usuário</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name" className="text-sm font-medium text-foreground">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role" className="text-sm font-medium text-foreground">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(roleLabels) as UserRole[]).map(role => (
                            <SelectItem key={role} value={role}>
                              {roleLabels[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="is_active" className="text-sm font-medium text-foreground">Status</Label>
                      <Select
                        value={formData.is_active ? 'active' : 'inactive'}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === 'active' }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-foreground">ID do Usuário</Label>
                      <p className="text-sm text-muted-foreground font-mono mt-1 bg-muted p-2 rounded">{selected.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Criado em:</span> {new Date(selected.created_at).toLocaleDateString('pt-BR')} às {new Date(selected.created_at).toLocaleTimeString('pt-BR')}
                    </div>
                    {selected.updated_at !== selected.created_at && (
                      <div>
                        <span className="font-medium">Última atualização:</span> {new Date(selected.updated_at).toLocaleDateString('pt-BR')} às {new Date(selected.updated_at).toLocaleTimeString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações Administrativas */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Ações Administrativas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium text-foreground">Resetar Senha</h4>
                      <p className="text-sm text-muted-foreground">O usuário será solicitado a criar uma nova senha no próximo login</p>
                    </div>
                    <Button 
                      onClick={resetPassword} 
                      disabled={credSaving}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {credSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Resetar Senha
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  ⚠️ Esta ação irá forçar o usuário a criar uma nova senha no próximo login.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="bg-transparent -mx-6 -mb-6 px-6 py-4">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={()=>setSelected(null)}>Cancelar</Button>
              <Button 
                onClick={saveProfile} 
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}