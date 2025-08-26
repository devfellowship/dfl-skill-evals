# AdminNavigation

## 📋 **Descrição**

O `AdminNavigation` é um componente de navegação sequencial (breadcrumb) para as páginas administrativas da plataforma DevShaper. Ele fornece uma navegação clara e intuitiva entre diferentes níveis de acesso, incluindo ações rápidas e informações do usuário.

## 🚀 **Como Usar**

### **Importação:**
```typescript
import { AdminNavigation } from "@/components/atoms/AdminNavigation"
```

### **Uso Básico:**
```typescript
export default function AdminPage() {
  return (
    <AdminRouteWrapper>
      <AdminNavigation 
        items={[
          { label: "Dashboard Admin", href: "/admin" }
        ]}
        showUserInfo={true}
        userName="Administrador"
        userRole="Admin"
      />
      <DashboardAdmin />
    </AdminRouteWrapper>
  )
}
```

### **Com Quick Actions:**
```typescript
export default function AdminPage() {
  return (
    <AdminRouteWrapper>
      <AdminNavigation 
        items={[
          { label: "Dashboard Admin", href: "/admin" }
        ]}
        quickActions={[
          {
            label: "Dashboard Teacher",
            href: "/teacher",
            icon: <Users className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "Criar Challenge",
            href: "/teacher/create",
            icon: <Plus className="h-4 w-4" />,
            variant: "default"
          }
        ]}
        showUserInfo={true}
        userName="Administrador"
        userRole="Admin"
      />
      <DashboardAdmin />
    </AdminRouteWrapper>
  )
}
```

### **Com Navegação Sequencial e Botão Voltar:**
```typescript
export default function CreateChallengePage() {
  return (
    <AdminRouteWrapper>
      <AdminNavigation 
        items={[
          { label: "Dashboard Teacher", href: "/teacher" },
          { label: "Criar Challenge", href: "/teacher/create" }
        ]}
        quickActions={[
          {
            label: "Dashboard Admin",
            href: "/admin",
            icon: <BarChart3 className="h-4 w-4" />,
            variant: "outline"
          }
        ]}
        showUserInfo={true}
        userName="Professor"
        userRole="Teacher"
      />
      <CreateChallenge />
    </AdminRouteWrapper>
  )
}
```

## 🔧 **Funcionalidades**

### **1. Navegação Sequencial (Breadcrumb):**
- **Botão Home** sempre visível para voltar ao dashboard principal
- **Navegação hierárquica** com setas entre níveis
- **Posicionamento à esquerda** para fácil acesso

### **2. Quick Actions (Centro):**
- **Botões de acesso rápido** para outras seções
- **Ícones personalizáveis** para cada ação
- **Variantes de estilo** (default, outline, ghost)
- **Posicionamento central** para destaque

### **3. User Info (Direita):**
- **Avatar do usuário** com ícone personalizado
- **Nome e função** do usuário atual
- **Menu de configurações** para ações do usuário
- **Sempre visível** para identificação

### **4. Botão de Voltar:**
- **Opcional** e inteligente
- **Só aparece** quando não há quick actions
- **Posicionamento à direita** para não interferir na navegação

## 📱 **Interface**

### **Props:**
```typescript
interface AdminNavigationProps {
  items: NavigationItem[]        // Array de itens de navegação
  showBackButton?: boolean       // Mostra botão de voltar (opcional)
  backHref?: string             // Link para voltar
  backLabel?: string            // Texto do botão voltar
  className?: string            // Classes CSS adicionais
  quickActions?: QuickAction[]  // Ações rápidas no centro
  showUserInfo?: boolean        // Mostra informações do usuário
  userName?: string             // Nome do usuário
  userRole?: string             // Função do usuário
}

interface NavigationItem {
  label: string                 // Texto do botão
  href: string                 // Link de destino
  icon?: ReactNode             // Ícone opcional
}

interface QuickAction {
  label: string                 // Texto do botão
  href: string                 // Link de destino
  icon?: ReactNode             // Ícone opcional
  variant?: 'default' | 'outline' | 'ghost'  // Estilo do botão
}
```

### **Estrutura Visual:**
```
🏠 Dashboard > Dashboard Admin                    [Quick Actions]                    👤 Admin
🏠 Dashboard > Dashboard Teacher > Criar Challenge  [Quick Actions]                  👤 Professor
```

## 📍 **Exemplos de Uso**

### **Dashboard Admin:**
```typescript
<AdminNavigation 
  items={[
    { label: "Dashboard Admin", href: "/admin" }
  ]}
  quickActions={[
    {
      label: "Dashboard Teacher",
      href: "/teacher",
      icon: <Users className="h-4 w-4" />,
      variant: "outline"
    },
    {
      label: "Criar Challenge",
      href: "/teacher/create",
      icon: <Plus className="h-4 w-4" />,
      variant: "default"
    },
    {
      label: "Mentoria",
      href: "/mentoria",
      icon: <BookOpen className="h-4 w-4" />,
      variant: "outline"
    }
  ]}
  showUserInfo={true}
  userName="Administrador"
  userRole="Admin"
/>
```

### **Dashboard Teacher:**
```typescript
<AdminNavigation 
  items={[
    { label: "Dashboard Teacher", href: "/teacher" }
  ]}
  quickActions={[
    {
      label: "Dashboard Admin",
      href: "/admin",
      icon: <BarChart3 className="h-4 w-4" />,
      variant: "outline"
    },
    {
      label: "Criar Challenge",
      href: "/teacher/create",
      icon: <Plus className="h-4 w-4" />,
      variant: "default"
    }
  ]}
  showUserInfo={true}
  userName="Professor"
  userRole="Teacher"
/>
```

### **Criar Challenge:**
```typescript
<AdminNavigation 
  items={[
    { label: "Dashboard Teacher", href: "/teacher" },
    { label: "Criar Challenge", href: "/teacher/create" }
  ]}
  quickActions={[
    {
      label: "Dashboard Admin",
      href: "/admin",
      icon: <BarChart3 className="h-4 w-4" />,
      variant: "outline"
    },
    {
      label: "Dashboard Teacher",
      href: "/teacher",
      icon: <Users className="h-4 w-4" />,
      variant: "outline"
    }
  ]}
  showUserInfo={true}
  userName="Professor"
  userRole="Teacher"
/>
```

## 🎨 **Estilos e Cores**

### **Layout:**
- **Esquerda**: Breadcrumb navigation (🏠 Dashboard > Nível Atual)
- **Centro**: Quick Actions (botões de acesso rápido)
- **Direita**: User Info (avatar, nome, função, menu)

### **Botões de Navegação:**
- **Variant**: `ghost` (transparente)
- **Size**: `sm` (compacto)
- **Hover**: `hover:bg-primary/10` (fundo sutil)
- **Text**: `text-primary` (cor primária)

### **Quick Actions:**
- **Variant**: Personalizável (`default`, `outline`, `ghost`)
- **Size**: `sm` (compacto)
- **Ícones**: Personalizáveis para cada ação
- **Posição**: Centro da barra para destaque

### **User Info:**
- **Avatar**: Círculo com ícone de usuário
- **Background**: `bg-muted/50` (sutil)
- **Texto**: Nome em negrito, função em texto menor
- **Menu**: Botão de configurações com ícone

## 💡 **Boas Práticas**

### **1. Navegação Lógica:**
- **Sempre inclua** o botão Home
- **Mantenha a hierarquia** clara e lógica
- **Use labels descritivos** para cada nível

### **2. Quick Actions:**
- **Inclua ações relevantes** para o contexto atual
- **Use ícones intuitivos** para cada ação
- **Mantenha o número** de ações razoável (3-5)
- **Destaque ações principais** com `variant="default"`

### **3. User Info:**
- **Sempre mostre** informações do usuário
- **Use nomes reais** quando possível
- **Funções claras** (Admin, Teacher, Student)
- **Mantenha consistente** em todas as páginas

### **4. Responsividade:**
- **Teste em diferentes tamanhos** de tela
- **Mantenha o espaçamento** consistente
- **Evite textos muito longos** nos labels
- **Quick actions responsivos** para mobile

## 🔮 **Futuras Melhorias**

### **1. Ícones Personalizados:**
```typescript
items={[
  { 
    label: "Dashboard Admin", 
    href: "/admin",
    icon: <AdminIcon className="h-4 w-4" />
  }
]}
```

### **2. Navegação Dinâmica:**
```typescript
// Baseado no estado atual da aplicação
const navigationItems = getCurrentNavigationPath()
const quickActions = getAvailableQuickActions(userRole)
```

### **3. Breadcrumb Collapsible:**
```typescript
// Para navegações muito longas
showCollapsible={true}
maxVisibleItems={3}
```

### **4. User Menu Dropdown:**
```typescript
// Menu expandido com opções
showUserMenu={true}
userMenuItems={[
  { label: "Perfil", href: "/profile" },
  { label: "Configurações", href: "/settings" },
  { label: "Sair", href: "/logout" }
]}
```

## 🎯 **Resumo**

O `AdminNavigation` é uma solução completa para:

- **Navegação hierárquica** clara e intuitiva
- **Acesso rápido** a outras seções importantes
- **Identificação do usuário** sempre visível
- **UX consistente** em todas as páginas administrativas
- **Layout responsivo** e profissional

**Use em todas as páginas administrativas para uma navegação completa e intuitiva!** 🚀
