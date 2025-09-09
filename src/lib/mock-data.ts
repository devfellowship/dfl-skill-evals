
import type { UserRole } from './supabase'

export interface MockUser {
  id: string
  email: string
  password: string
  full_name: string
  role: UserRole
  institution?: string
  bio?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
}

function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'mock-admin-001',
    email: 'admin@devsharper.com',
    password: simpleHash('Admin123'),
    full_name: 'Administrador DevSharper',
    role: 'admin',
    institution: 'DevSharper',
    bio: 'Administrador principal do sistema',
    avatar_url: '/images/avatars/admin.jpg',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-mentor-001',
    email: 'mentor@devsharper.com',
    password: simpleHash('Admin123'),
    full_name: 'Mentor DevSharper',
    role: 'mentor',
    institution: 'DevSharper',
    bio: 'Mentor de programação',
    avatar_url: '/images/avatars/mentor.jpg',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-student-001',
    email: 'student@devsharper.com',
    password: simpleHash('Admin123'),
    full_name: 'Estudante DevSharper',
    role: 'student',
    institution: 'DevSharper',
    bio: 'Estudante de programação',
    avatar_url: '/images/avatars/student.jpg',
    is_active: true,
    created_at: new Date().toISOString()
  }
]

export function isMockEmail(email: string): boolean {
  return MOCK_USERS.some(user => user.email === email)
}

export function getMockUserByEmail(email: string): MockUser | null {
  return MOCK_USERS.find(user => user.email === email) || null
}

export function verifyMockPassword(email: string, password: string): boolean {
  const user = getMockUserByEmail(email)
  if (!user) return false
  
  const hashedPassword = simpleHash(password)
  return user.password === hashedPassword
}

export function getMockProfile(email: string) {
  const user = getMockUserByEmail(email)
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    institution: user.institution,
    bio: user.bio,
    avatar_url: user.avatar_url,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.created_at
  }
}

export const MOCK_EMAILS = MOCK_USERS.map(user => ({
  email: user.email,
  role: user.role,
  full_name: user.full_name
}))

export const MOCK_INSTRUCTIONS = `🔐 DADOS MOCK PARA TESTE DE ROLES

📧 Emails disponíveis:
• admin@devsharper.com (admin)
• mentor@devsharper.com (mentor)
• student@devsharper.com (student)

🔑 Senha para todos os usuários: Admin123

⚠️ IMPORTANTE:
- Estes dados são apenas para desenvolvimento
- Não use em produção
- As senhas são hasheadas de forma simples (não é criptografia real)
- Para testar, use qualquer um dos emails acima com a senha "Admin123"

🎯 Como testar:
1. Acesse a página de login
2. Use qualquer email da lista acima
3. Use a senha "Admin123"
4. O sistema irá redirecionar baseado na role do usuário`