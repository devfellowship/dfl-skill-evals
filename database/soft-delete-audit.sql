-- =====================================================
-- SOFT DELETE E AUDITORIA PARA CHALLENGES
-- =====================================================
-- Este arquivo implementa soft delete com auditoria completa
-- para a tabela skill_evals.challenges

-- 1. Adicionar colunas de auditoria para soft delete
ALTER TABLE skill_evals.challenges 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN deleted_by UUID REFERENCES public.profiles(id),
ADD COLUMN deletion_reason TEXT;

-- 2. Criar índices para performance
CREATE INDEX idx_challenges_deleted_at ON skill_evals.challenges(deleted_at);
CREATE INDEX idx_challenges_deleted_by ON skill_evals.challenges(deleted_by);

-- 3. Atualizar a política RLS para considerar soft delete
DROP POLICY IF EXISTS "Permitir leitura de challenges públicos e próprios" ON skill_evals.challenges;

CREATE POLICY "Permitir leitura de challenges públicos e próprios" 
ON skill_evals.challenges FOR SELECT 
TO authenticated 
USING (
  deleted_at IS NULL AND (
    is_public = true 
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'admin' = ANY(roles)
    )
    OR EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'superadmin' = ANY(roles)
    )
  )
);

-- 4. Política para admins verem challenges deletadas
CREATE POLICY "Permitir admins verem challenges deletadas" 
ON skill_evals.challenges FOR SELECT 
TO authenticated 
USING (
  deleted_at IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'admin' = ANY(roles)
    )
    OR EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'superadmin' = ANY(roles)
    )
  )
);

-- 5. Política para permitir soft delete (apenas criador ou admin)
CREATE POLICY "Permitir soft delete de challenges" 
ON skill_evals.challenges FOR UPDATE 
TO authenticated 
USING (
  deleted_at IS NULL AND (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'admin' = ANY(roles)
    )
    OR EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'superadmin' = ANY(roles)
    )
  )
);

-- 6. Política para permitir restauração (apenas admin)
CREATE POLICY "Permitir restauração de challenges" 
ON skill_evals.challenges FOR UPDATE 
TO authenticated 
USING (
  deleted_at IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'admin' = ANY(roles)
    )
    OR EXISTS (
      SELECT 1 FROM public.users_with_roles 
      WHERE id = auth.uid() 
      AND 'superadmin' = ANY(roles)
    )
  )
);

-- =====================================================
-- QUERIES ÚTEIS PARA AUDITORIA
-- =====================================================

-- Ver challenges deletadas com detalhes
-- SELECT 
--   c.id,
--   c.title,
--   c.deleted_at,
--   c.deletion_reason,
--   p.full_name as deleted_by_name,
--   p.email as deleted_by_email
-- FROM skill_evals.challenges c
-- LEFT JOIN public.profiles p ON c.deleted_by = p.id
-- WHERE c.deleted_at IS NOT NULL
-- ORDER BY c.deleted_at DESC;

-- Ver estatísticas de exclusões
-- SELECT 
--   p.full_name as deleted_by_name,
--   COUNT(*) as total_deletions,
--   MIN(c.deleted_at) as first_deletion,
--   MAX(c.deleted_at) as last_deletion
-- FROM skill_evals.challenges c
-- LEFT JOIN public.profiles p ON c.deleted_by = p.id
-- WHERE c.deleted_at IS NOT NULL
-- GROUP BY p.full_name, p.id
-- ORDER BY total_deletions DESC;

-- Ver motivos mais comuns de exclusão
-- SELECT 
--   deletion_reason,
--   COUNT(*) as frequency
-- FROM skill_evals.challenges 
-- WHERE deleted_at IS NOT NULL 
-- AND deletion_reason IS NOT NULL
-- GROUP BY deletion_reason
-- ORDER BY frequency DESC;
