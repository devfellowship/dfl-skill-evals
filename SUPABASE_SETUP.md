# 🚀 Configuração do Supabase no DevShaper

## 📋 Pré-requisitos
- Conta no [Supabase](https://supabase.com)
- Projeto criado no Supabase
- Credenciais de API (URL e anon key)

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase
1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "devshaper")
6. Escolha uma senha forte para o banco
7. Escolha a região mais próxima
8. Clique em "Create new project"

### 2. Obter Credenciais
1. No seu projeto, vá em **Settings** > **API**
2. Copie a **Project URL**
3. Copie a **anon public** key

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Judge0 Configuration (manter o que já existe)
JUDGE0_API_URL=http://localhost:3000/api/judge0
NEXT_PUBLIC_JUDGE0_URL=http://localhost:3000/api/judge0
```

### 4. Criar Tabelas no Supabase

#### Tabela `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários editarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para usuários inserirem seu próprio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Tabela `challenges`
```sql
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5) NOT NULL,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  duration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Política para todos poderem ver desafios
CREATE POLICY "Anyone can view challenges" ON challenges
  FOR SELECT USING (true);

-- Política para admins criarem/editaram desafios (ajustar conforme necessário)
CREATE POLICY "Admins can manage challenges" ON challenges
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

#### Tabela `submissions`
```sql
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  challenge_id UUID REFERENCES challenges(id) NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  test_results JSONB,
  execution_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem suas próprias submissões
CREATE POLICY "Users can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias submissões
CREATE POLICY "Users can create own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários editarem suas próprias submissões
CREATE POLICY "Users can update own submissions" ON submissions
  FOR UPDATE USING (auth.uid() = user_id);
```

### 5. Configurar Funções de Banco (Opcional)

#### Função para atualizar `updated_at`
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger na tabela challenges
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger na tabela profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 6. Configurar Storage (Opcional)
Se quiser permitir upload de avatares:

1. Vá em **Storage** no seu projeto Supabase
2. Crie um bucket chamado `avatars`
3. Configure as políticas de acesso conforme necessário

### 7. Testar a Conexão
1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Verifique no console do navegador se não há erros de conexão
3. Teste se os dados estão sendo carregados do Supabase

## 🔍 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor após criar o arquivo

### Erro: "Invalid API key"
- Verifique se a anon key está correta
- Confirme se o projeto está ativo no Supabase

### Erro: "Table doesn't exist"
- Execute os comandos SQL para criar as tabelas
- Verifique se as políticas RLS estão configuradas

### Erro: "Permission denied"
- Verifique as políticas RLS das tabelas
- Confirme se o usuário está autenticado

## 📚 Próximos Passos

Após configurar o Supabase:

1. **Implementar autenticação completa** com páginas de login/registro
2. **Criar sistema de permissões** para diferentes tipos de usuário
3. **Implementar upload de arquivos** para avatares e materiais
4. **Configurar webhooks** para notificações em tempo real
5. **Implementar cache** para melhorar performance

## 🆘 Suporte

- [Documentação oficial do Supabase](https://supabase.com/docs)
- [Comunidade do Supabase](https://github.com/supabase/supabase/discussions)
- [Exemplos de código](https://github.com/supabase/examples)
