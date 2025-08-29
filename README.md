# DevShaper App

Uma aplicação de desafios de programação com sistema de execução de código em tempo real.

> 📋 **Arquitetura do Projeto**: Visualize a estrutura completa e fluxo de dados no [Miro Board](https://miro.com/welcomeonboard/Rng0RnppYVRoQ0tKMG0yZlBXNDZ3N2JKeC9scWxWMGRpRFFyMUhJQnZ6cWtDUzBOVVA3aWRlc2VGd1NiZUp0MXdRL0FqbVZ4SzdQZkVNakRtenQrazdhYnEvdWNySjJWbUVFTWhvMVdOcGJUOHphcXhra1NUd0dPeWZLNTdwZ3lyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=774742529010)

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, Shadcn/ui
- **Backend**: Supabase (banco de dados e autenticação)
- **Execução de Código**: Judge0 (sistema de sandbox para execução segura)
- **Gerenciador de Pacotes**: pnpm

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm
- **Docker** (necessário para Judge0 local) ou **VM Linux** (alternativa para Windows)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd devshaper-app
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

# Judge0 (obrigatório)
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=sua_chave_api
```

## 🚀 Como Executar

### Desenvolvimento
```bash
pnpm run dev
```
A aplicação estará disponível em `http://localhost:3000`

### Build de Produção
```bash
pnpm run build
pnpm start
```

## ⚡ Judge0 - Sistema de Execução de Código

O Judge0 é responsável por executar e avaliar o código dos usuários de forma segura. **É essencial para o funcionamento da aplicação**, pois sem ele não é possível executar e testar o código dos desafios.

### Configuração Local (Docker)
### Para iniciar o Juge precisa estar na pasta dele, fiz dessa forma para não estragar o projeto quando ainda estava entendendo como ele funcionava.
### Se estiver no Linux o comando correto é: docker compose ; Se estiver no Windows: docker-compose ; No mac ainda não tenho informação.

1. Navegue para a pasta Judge0:
```bash
cd src/Judge0
```

2. Execute o Docker Compose:
```bash
docker-compose up -d 
```
### Para parar os containeres 

```bash
docker-compose down -v
```
### Para verificar se tem containeres rodando:
```bash
docker-compose ps
```

O Judge0 estará disponível em `http://localhost:2358`

### Configuração em VM (Recomendado para Windows)
### Isso só vai precisa ser feito caso o Judge0 dê o erro da pasta cgroup.
Devido a problemas de compatibilidade com Docker no Windows, é recomendado executar o Judge0 em uma VM Linux:

1. Configure uma VM com Ubuntu/Debian
2. Instale Docker e Docker Compose
3. Execute o `docker-compose.yml` na VM
4. Configure a URL do Judge0 no `.env.local` para apontar para o IP da VM

**⚠️ Importante**: O Judge0 é obrigatório para o funcionamento da aplicação. Sem ele, as funcionalidades de execução de código não funcionarão.

### Estrutura do Judge0

- **PostgreSQL**: Banco de dados para armazenar submissões
- **Redis**: Cache e fila de processamento
- **Server**: API principal do Judge0
- **Worker**: Processamento assíncrono de submissões

### Linguagens Suportadas

- JavaScript (Node.js)
- Python
- Java
- C/C++
- C#
- Go
- Rust
+60 outras

## 🏗️ Estrutura do Projeto

```
src/
├── app/                 # Páginas da aplicação (Next.js App Router)
├── components/          # Componentes React organizados por atomic design
│   ├── atoms/          # Componentes básicos (Button, Input, etc.)
│   ├── molecules/      # Componentes compostos
│   └── organisms/      # Componentes complexos
├── lib/                # Utilitários e configurações
├── hooks/              # Custom hooks React
├── types/              # Definições TypeScript
└── Judge0/             # Configuração do sistema de execução
```

## 🔧 Scripts Disponíveis

- `pnpm dev` - Servidor de desenvolvimento
- `pnpm build` - Build de produção
- `pnpm start` - Servidor de produção
- `pnpm lint` - Verificação de código
- `pnpm storybook` - Storybook para componentes

## 📝 Funcionalidades

- ✅ Sistema de autenticação com Supabase
- ✅ Criação e edição de desafios
- ✅ Editor de código integrado
- ✅ Execução de código em tempo real
- ✅ Sistema de avaliação automática
- ✅ Dashboard administrativo
- ✅ Interface responsiva

## 🐛 Solução de Problemas

### Judge0 não conecta
- Verifique se o Docker está rodando
- Confirme se a porta 2358 está livre
- Teste a conexão: `curl http://localhost:2358/languages`

### Erro de build
- Limpe o cache: `pnpm clean`
- Reinstale dependências: `rm -rf node_modules && pnpm install`

## 📚 Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Judge0](https://judge0.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
