# 🗑️ Sistema de Soft Delete com Auditoria

Este sistema implementa soft delete completo com auditoria para challenges, permitindo rastrear quem deletou o quê e quando.

## 📁 Arquivos Criados

### 1. `database/soft-delete-audit.sql`
- **SQL para executar no Supabase**
- Adiciona colunas: `deleted_at`, `deleted_by`, `deletion_reason`
- Configura políticas RLS
- Inclui queries úteis para auditoria

### 2. `src/hooks/useSoftDeleteAudit.ts`
- **Hook principal** com todas as funções de soft delete
- Funções: `deleteChallenge`, `restoreChallenge`, `fetchDeletedChallenges`
- Estatísticas: `getDeletionStats`, `getDeletionReasonStats`
- Deletar permanentemente: `permanentDeleteChallenge`

### 3. `src/components/organisms/DeletedChallengesPanel/DeletedChallengesPanel.tsx`
- **Componente React** para gerenciar challenges deletadas
- Interface para admins visualizarem e gerenciarem exclusões
- Estatísticas de auditoria
- Botões para restaurar ou deletar permanentemente

## 🚀 Como Implementar

### Passo 1: Executar SQL no Supabase
```sql
-- Copie e cole o conteúdo de database/soft-delete-audit.sql
-- no SQL Editor do Supabase
```

### Passo 2: Atualizar useChallengeOperations.ts
```typescript
// Substitua a função deleteChallenge existente por:
import { useSoftDeleteAudit } from '@/hooks/useSoftDeleteAudit'

// No componente:
const { deleteChallenge } = useSoftDeleteAudit()

// Use: deleteChallenge(id, 'Motivo da exclusão')
```

### Passo 3: Adicionar Painel de Auditoria (Opcional)
```tsx
// Em uma página de admin:
import { DeletedChallengesPanel } from '@/components/organisms/DeletedChallengesPanel/DeletedChallengesPanel'

<DeletedChallengesPanel />
```

## ✨ Funcionalidades

### 🔒 Soft Delete
- **Não deleta** realmente do banco
- **Marca** como deletada com `deleted_at`
- **Registra** quem deletou (`deleted_by`)
- **Solicita** motivo obrigatório (`deletion_reason`)

### 📊 Auditoria Completa
- **Histórico** de todas as exclusões
- **Estatísticas** por usuário
- **Motivos** mais comuns de exclusão
- **Datas** de exclusão e restauração

### 🔄 Restauração
- **Apenas admins** podem restaurar
- **Remove** marcação de deletada
- **Limpa** dados de auditoria

### ⚠️ Deletar Permanentemente
- **Apenas admins** podem deletar permanentemente
- **Remove** definitivamente do banco
- **Ação irreversível**

## 🎯 Políticas RLS

- **Usuários normais**: Veem apenas challenges não deletadas
- **Admins**: Veem challenges deletadas e podem restaurar
- **Criadores**: Podem deletar suas próprias challenges
- **Admins**: Podem deletar qualquer challenge

## 📈 Queries Úteis

### Ver Challenges Deletadas
```sql
SELECT 
  c.id,
  c.title,
  c.deleted_at,
  c.deletion_reason,
  p.full_name as deleted_by_name
FROM skill_evals.challenges c
LEFT JOIN public.profiles p ON c.deleted_by = p.id
WHERE c.deleted_at IS NOT NULL
ORDER BY c.deleted_at DESC;
```

### Estatísticas de Exclusão
```sql
SELECT 
  p.full_name as deleted_by_name,
  COUNT(*) as total_deletions
FROM skill_evals.challenges c
LEFT JOIN public.profiles p ON c.deleted_by = p.id
WHERE c.deleted_at IS NOT NULL
GROUP BY p.full_name
ORDER BY total_deletions DESC;
```

## 🔧 Configuração

1. **Execute o SQL** no Supabase
2. **Importe o hook** onde precisar
3. **Substitua** a função de delete existente
4. **Adicione** o painel de auditoria (opcional)

## ⚡ Benefícios

- ✅ **Rastreabilidade** completa
- ✅ **Recuperação** de dados
- ✅ **Auditoria** para compliance
- ✅ **Segurança** com políticas RLS
- ✅ **Performance** com índices otimizados
- ✅ **Interface** amigável para admins

---

**Pronto para usar!** 🚀
