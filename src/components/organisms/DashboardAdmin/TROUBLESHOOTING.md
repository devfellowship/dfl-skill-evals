# 🔧 **Troubleshooting - Problemas de Conexão**

## ❌ **Problema: Challenges não aparecem nos Dashboards**

### **Sintomas:**
- Dashboard Admin mostra "Nenhum challenge encontrado"
- Dashboard Teacher mostra "Você ainda não criou nenhum challenge"
- Console mostra erros de conexão

### **Possíveis Causas:**

#### **1. Variáveis de Ambiente Faltando**
```bash
# Verificar se existe arquivo .env.local na raiz do projeto
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### **2. Configuração do Supabase Incorreta**
- URL do projeto incorreta
- Chave anônima inválida
- Projeto não ativo

#### **3. Problemas de Permissões no Banco**
- Tabela `challenges` não existe
- Políticas RLS muito restritivas
- Usuário não tem permissão para ler

#### **4. Problemas de Rede**
- Firewall bloqueando conexão
- DNS não resolvendo
- Supabase temporariamente indisponível

## 🔍 **Diagnóstico:**

### **1. Verificar Console do Navegador**
```javascript
// Abrir DevTools (F12) e verificar:
// - Erros de rede
// - Erros de JavaScript
// - Logs de conexão
```

### **2. Verificar Variáveis de Ambiente**
```bash
# No terminal, na raiz do projeto:
cat .env.local
# Deve mostrar:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **3. Testar Conexão Direta**
```javascript
// No console do navegador:
import { supabase } from '@/lib/supabase'

// Testar conexão básica
supabase.from('challenges').select('count').then(console.log)

// Verificar se retorna dados
supabase.from('challenges').select('*').limit(1).then(console.log)
```

## 🛠️ **Soluções:**

### **1. Criar/Corrigir Arquivo .env.local**
```bash
# Na raiz do projeto, criar arquivo .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### **2. Verificar Configuração do Supabase**
- Acessar [supabase.com](https://supabase.com)
- Verificar se o projeto está ativo
- Copiar URL e chave anônima corretas
- Verificar se a tabela `challenges` existe

### **3. Verificar Políticas RLS**
```sql
-- No SQL Editor do Supabase:
-- Verificar se a tabela challenges existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'challenges';

-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'challenges';

-- Se necessário, criar política permissiva para desenvolvimento:
CREATE POLICY "Allow all for development" ON challenges
FOR ALL USING (true);
```

### **4. Reiniciar Servidor de Desenvolvimento**
```bash
# Parar servidor (Ctrl+C)
# Limpar cache
rm -rf .next
# Reinstalar dependências
npm install
# Reiniciar servidor
npm run dev
```

## 🧪 **Teste de Funcionamento:**

### **1. Teste Básico de Conexão**
```javascript
// No console do navegador:
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('count')
    
    if (error) {
      console.error('❌ Erro de conexão:', error)
      return false
    }
    
    console.log('✅ Conexão OK:', data)
    return true
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
    return false
  }
}

testConnection()
```

### **2. Teste de Leitura de Dados**
```javascript
// Testar se consegue ler challenges:
const testReadChallenges = async () => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Erro ao ler challenges:', error)
      return false
    }
    
    console.log('✅ Challenges lidos:', data)
    return data.length
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
    return false
  }
}

testReadChallenges()
```

## 📋 **Checklist de Verificação:**

- [ ] Arquivo `.env.local` existe na raiz
- [ ] Variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão definidas
- [ ] URL do Supabase está correta e acessível
- [ ] Chave anônima está correta
- [ ] Projeto Supabase está ativo
- [ ] Tabela `challenges` existe no banco
- [ ] Políticas RLS permitem leitura
- [ ] Servidor foi reiniciado após mudanças
- [ ] Console do navegador não mostra erros de rede
- [ ] Teste de conexão direta funciona

## 🚨 **Se Nada Funcionar:**

### **1. Verificar Status do Supabase**
- [Status do Supabase](https://status.supabase.com/)
- Verificar se há manutenção programada

### **2. Criar Projeto Novo**
- Criar novo projeto no Supabase
- Copiar nova URL e chave
- Recriar tabelas necessárias

### **3. Usar Dados Mockados Temporariamente**
```javascript
// No DashboardAdmin, comentar a chamada real e usar dados mock:
const loadChallenges = async () => {
  // const dbChallenges = await getAllChallenges()
  
  // Dados mock para desenvolvimento
  const mockChallenges = [
    {
      id: '1',
      title: 'Two Sum',
      description: 'Encontre dois números que somem ao target',
      difficulty: 'easy',
      category: 'Arrays',
      functionName: 'twoSum',
      status: 'published',
      createdAt: '01/01/2024',
      updatedAt: '01/01/2024'
    }
  ]
  
  setChallenges(mockChallenges)
}
```

## 💡 **Prevenção:**

### **1. Sempre Verificar .env.local**
- Não commitar arquivo .env.local
- Documentar variáveis necessárias
- Usar .env.example como template

### **2. Testar Conexão Regularmente**
- Implementar health check
- Monitorar erros de conexão
- Logs detalhados para debug

### **3. Políticas RLS Desenvolvimento**
- Criar políticas permissivas para desenvolvimento
- Separar políticas de produção
- Documentar todas as políticas

**Siga este guia passo a passo para resolver problemas de conexão!** 🔧✨
