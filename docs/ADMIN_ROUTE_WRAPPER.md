# AdminRouteWrapper

## 📋 **Descrição**

O `AdminRouteWrapper` é um componente de proteção de rotas que controla o acesso às páginas administrativas e de professores da plataforma DevShaper.

## 🚀 **Como Usar**

### **Importação:**
```typescript
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper"
```

### **Uso Básico:**
```typescript
export default function AdminPage() {
  return (
    <AdminRouteWrapper>
      <DashboardAdmin />
    </AdminRouteWrapper>
  )
}
```

### **Com Fallback Personalizado:**
```typescript
export default function TeacherPage() {
  return (
    <AdminRouteWrapper 
      fallback={<div>Você não tem permissão para acessar esta página</div>}
    >
      <TeacherDashboard />
    </AdminRouteWrapper>
  )
}
```

## 🔧 **Funcionalidades**

### **1. Proteção de Rotas:**
- **Verificação de permissões** antes de renderizar o conteúdo
- **Redirecionamento automático** para página principal se não autorizado
- **Loading state** durante verificação de permissões

### **2. Estados de Renderização:**
- **Loading**: Mostra spinner enquanto verifica permissões
- **Autorizado**: Renderiza o conteúdo protegido
- **Não Autorizado**: Redireciona ou mostra fallback

### **3. Configuração Flexível:**
- **Fallback opcional**: Componente personalizado para usuários não autorizados
- **Redirecionamento padrão**: Para página principal se não autorizado

## 📱 **Interface**

### **Props:**
```typescript
interface AdminRouteWrapperProps {
  children: ReactNode        // Conteúdo a ser protegido
  fallback?: ReactNode       // Componente alternativo (opcional)
}
```

### **Estados Visuais:**
- **⏳ Loading**: Spinner com texto "Verificando permissões..."
- **✅ Autorizado**: Renderiza children
- **❌ Não Autorizado**: Redireciona ou mostra fallback

## 🛡️ **Segurança**

### **Atual (Desenvolvimento):**
- **Sem autenticação**: Todas as rotas são acessíveis
- **Preparado para futuro**: Estrutura pronta para implementar verificação real

### **Futuro (Produção):**
- **Verificação de token**: JWT ou similar
- **Validação de roles**: Admin, Teacher, Student
- **Middleware de segurança**: Verificação em nível de API

## 📍 **Rotas Protegidas**

### **Admin Dashboard:**
```typescript
// src/app/admin/page.tsx
<AdminRouteWrapper>
  <DashboardAdmin />
</AdminRouteWrapper>
```

### **Teacher Dashboard:**
```typescript
// src/app/teacher/page.tsx
<AdminRouteWrapper>
  <TeacherDashboard />
</AdminRouteWrapper>
```

### **Create Challenge:**
```typescript
// src/app/teacher/create/page.tsx
<AdminRouteWrapper>
  <CreateChallenge />
</AdminRouteWrapper>
```

## 🔮 **Implementação Futura**

### **1. Autenticação Real:**
```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setIsAuthorized(false)
        return
      }
      
      const response = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const user = await response.json()
        setIsAuthorized(user.role === 'admin' || user.role === 'teacher')
      } else {
        setIsAuthorized(false)
      }
    } catch (error) {
      setIsAuthorized(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  checkAuth()
}, [])
```

### **2. Middleware de Rota:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')
  
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}
```

## 💡 **Exemplos de Uso**

### **Página Simples:**
```typescript
export default function SimpleAdminPage() {
  return (
    <AdminRouteWrapper>
      <div>
        <h1>Página Administrativa</h1>
        <p>Conteúdo protegido aqui...</p>
      </div>
    </AdminRouteWrapper>
  )
}
```

### **Com Layout Personalizado:**
```typescript
export default function AdminWithLayout() {
  return (
    <AdminRouteWrapper>
      <AdminLayout>
        <AdminContent />
      </AdminLayout>
    </AdminRouteWrapper>
  )
}
```

### **Com Fallback Personalizado:**
```typescript
export default function TeacherPage() {
  return (
    <AdminRouteWrapper 
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você precisa ser um professor para acessar esta página.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar ao início
          </Link>
        </div>
      }
    >
      <TeacherDashboard />
    </AdminRouteWrapper>
  )
}
```

## 🎯 **Resumo**

O `AdminRouteWrapper` é uma solução elegante para:

- **Proteger rotas** administrativas e de professores
- **Controlar acesso** baseado em permissões
- **Preparar para futuro** com autenticação real
- **Manter código limpo** e reutilizável

**Use em todas as rotas que precisam de acesso especial!** 🚀
