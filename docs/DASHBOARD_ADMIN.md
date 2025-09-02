# Dashboard Admin

Dashboard completo para administradores da plataforma DevShaper, focado na criação e gerenciamento de challenges.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Criação de Challenges**: Formulário completo para criar novos challenges
- **Edição de Challenges**: Modificação de challenges existentes
- **Listagem de Challenges**: Visualização de todos os challenges com filtros visuais
- **Exclusão de Challenges**: Remoção segura de challenges
- **Sistema de Status**: Controle de rascunho, publicado e arquivado
- **Categorização**: Organização por categorias de algoritmos
- **Níveis de Dificuldade**: Fácil, médio e difícil
- **Interface Responsiva**: Design moderno e adaptável

### 🔮 Futuras Implementações
- **Analytics**: Métricas e insights da plataforma
- **Configurações**: Configurações gerais da plataforma
- **Testes Automatizados**: Sistema de testes para challenges
- **Gestão de Usuários**: Controle de usuários e permissões
- **Relatórios**: Relatórios detalhados de performance

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones
- **Sonner** para notificações toast

## 📁 Estrutura de Arquivos

```
DashboardAdmin/
├── DashboardAdmin.tsx    # Componente principal
├── types.ts             # Tipos TypeScript
├── index.ts             # Exportações
└── README.md            # Documentação
```

## 🎯 Como Usar

### Importação
```tsx
import { DashboardAdmin } from '@/components/organisms/DashboardAdmin'
```

### Uso Básico
```tsx
<DashboardAdmin />
```

## 📋 Campos do Challenge

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | ✅ | Título do challenge |
| `description` | string | ✅ | Descrição do problema |
| `difficulty` | enum | ❌ | Nível de dificuldade |
| `category` | string | ✅ | Categoria do algoritmo |
| `functionName` | string | ✅ | Nome da função a ser implementada |
| `status` | enum | ❌ | Status do challenge |

## 🎨 Categorias Disponíveis

- Arrays
- Strings
- Linked Lists
- Trees
- Graphs
- Dynamic Programming
- Sorting
- Searching
- Math
- Bit Manipulation
- Recursion
- Backtracking

## 🔧 Personalização

### Cores dos Badges
```typescript
// Dificuldade
easy: "bg-green-100 text-green-800"
medium: "bg-yellow-100 text-yellow-800"
hard: "bg-red-100 text-red-800"

// Status
draft: "bg-gray-100 text-gray-800"
published: "bg-blue-100 text-blue-800"
archived: "bg-orange-100 text-orange-800"
```

### Adicionar Novas Categorias
```typescript
// Em types.ts
export const CATEGORY_OPTIONS = [
  // ... categorias existentes
  "Nova Categoria"
] as const
```

## 🚨 Validações

- Todos os campos obrigatórios devem ser preenchidos
- Confirmação antes de excluir challenges
- Validação de tipos TypeScript
- Feedback visual para o usuário

## 🔗 Integração

O dashboard está preparado para integração com:
- APIs REST/GraphQL
- Sistemas de autenticação
- Bancos de dados
- Sistemas de notificação
- Analytics e métricas

## 📱 Responsividade

- Design mobile-first
- Grid responsivo para formulários
- Tabs adaptáveis
- Cards com layout flexível

## 🎉 Próximos Passos

1. **Integração com Backend**: Conectar com APIs reais
2. **Sistema de Autenticação**: Controle de acesso
3. **Persistência de Dados**: Salvar em banco de dados
4. **Upload de Arquivos**: Imagens e recursos
5. **Sistema de Testes**: Validação automática de soluções
6. **Analytics Reais**: Métricas de usuários e performance
7. **Notificações**: Sistema de alertas e updates
8. **Logs e Auditoria**: Rastreamento de mudanças
