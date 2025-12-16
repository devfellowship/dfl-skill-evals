# MIGRAÇÃO NEXT.JS → VITE - DEVSHAPER APP

**Branch:** `Samuel/Vite_config`
**Data:** 15/12/2024
**Status:** Em progresso

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Motivação](#motivação)
3. [Arquivos a Excluir](#arquivos-a-excluir)
4. [Arquivos a Modificar](#arquivos-a-modificar)
5. [Arquivos a Criar](#arquivos-a-criar)
6. [Mudanças de Código](#mudanças-de-código)
7. [Correções no Atomic Design](#correções-no-atomic-design)
8. [Abstrações e Melhorias](#abstrações-e-melhorias)
9. [Dependências](#dependências)
10. [Configurações](#configurações)
11. [Checklist Final](#checklist-final)

---

## 🎯 VISÃO GERAL

**Objetivo:** Migrar de Next.js 15 (App Router) para Vite + React Router 6

**Razões:**
- Projeto é 100% SPA (não usa SSR/SSG)
- Module Federation não funciona com Next.js App Router
- Builds mais rápidos (10-20x)
- HMR instantâneo
- Menos overhead desnecessário

**Escopo:**
- 278 arquivos TypeScript
- 22 páginas
- 119 diretórios de componentes
- 6 API routes

---

## 💡 MOTIVAÇÃO

### Problemas Identificados no Next.js

1. **Uso incorreto do framework**
   - App é SPA puro
   - Não usa SSR, SSG, ISR
   - Next.js é overhead desnecessário

2. **Module Federation incompatível**
   - `@module-federation/nextjs-mf` não suporta App Router
   - Pasta `remotes/` criada mas não funcional

3. **Builds lentos**
   - Dev server lento
   - HMR demorado
   - Build de produção desnecessariamente pesado

4. **Estrutura híbrida confusa**
   - `src/app/` (App Router)
   - `pages/` (Pages Router legado)
   - `remotes/` (não funciona)

### Benefícios do Vite

1. **Performance**
   - Build 10-20x mais rápido
   - HMR em <100ms
   - Dev server instantâneo

2. **Module Federation**
   - Funciona nativamente com `@originjs/vite-plugin-federation`
   - Documentação em `docs/docs_moduleFederation/` é para Vite

3. **Simplicidade**
   - Configuração clara e direta
   - Sem abstrações desnecessárias
   - SPA puro como deveria ser

4. **DX (Developer Experience)**
   - Feedback instantâneo
   - Menos bugs de build
   - Mais controle

---

## 🗑️ ARQUIVOS A EXCLUIR

### Configurações Next.js

```bash
next.config.js
next-env.d.ts
.next/
```

### Páginas Next.js (App Router)

```bash
src/app/
  ├── layout.tsx
  ├── page.tsx
  ├── admin/
  ├── auth/
  ├── challenge/
  ├── create/
  ├── edit/
  ├── profile/
  ├── teacher/
  ├── test-user-output/
  └── api/
```

### Páginas Legado (Pages Router)

```bash
pages/
  ├── _app.tsx
  └── _document.tsx
```

### Pasta Remotes (não funcional)

```bash
remotes/
  ├── remote-exports/
  ├── contexts/
  └── federation.d.ts
```

### Variável de Ambiente Next.js

```bash
.env.local (se tiver NEXT_PRIVATE_LOCAL_WEBPACK)
```

---

## 📝 ARQUIVOS A MODIFICAR

### 1. package.json

**Remover:**
```json
"next": "15.2.4",
"eslint-config-next": "15.5.2",
"@module-federation/nextjs-mf": "^8.8.49"
```

**Adicionar:**
```json
"vite": "^5.4.11",
"@vitejs/plugin-react-swc": "^3.7.1",
"@originjs/vite-plugin-federation": "^1.3.6",
"react-router-dom": "6.26.2"
```

**Scripts:**
```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview",
"start": "vite preview"
```

### 2. tsconfig.json

**Antes:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    ...
  }
}
```

**Depois:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. .gitignore

**Remover:**
```
/.next/
/out/
```

**Adicionar:**
```
/dist/
```

### 4. vercel.json

**Mudar para configuração de SPA:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 5. Variáveis de Ambiente

**Renomear todas as variáveis:**
```bash
NEXT_PUBLIC_SUPABASE_URL → VITE_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY → VITE_SUPABASE_ANON_KEY
JUDGE0_API_URL → VITE_JUDGE0_API_URL
```

---

## 🆕 ARQUIVOS A CRIAR

### 1. index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevShaper - Technical Assessments</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  server: {
    host: '::',
    port: 5173,
    proxy: {
      '/api/judge0': {
        target: process.env.VITE_JUDGE0_API_URL || 'https://judge0.devfellowship.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/judge0/, ''),
      },
    },
  },
  plugins: [
    react(),
    federation({
      name: 'devshaper_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/remote-exports/Dashboard.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '6.26.2',
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: '^5.56.2',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
})
```

### 3. tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### 4. src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

### 5. src/App.tsx

```typescript
import { Routes, Route } from 'react-router-dom'
import { AuthGuardProvider } from '@/providers/AuthGuard'
import { ConditionalFooter } from '@/components/organisms/Footer/ConditionalFooter'

import HomePage from '@/pages/HomePage'
import AdminPage from '@/pages/AdminPage'
import TeacherPage from '@/pages/TeacherPage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ChallengePage from '@/pages/ChallengePage'
import PreChallengePage from '@/pages/PreChallengePage'
import CreateChallengePage from '@/pages/CreateChallengePage'
import EditChallengePage from '@/pages/EditChallengePage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <AuthGuardProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/teacher/*" element={<TeacherPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/challenge/pre/:id" element={<PreChallengePage />} />
            <Route path="/create" element={<CreateChallengePage />} />
            <Route path="/edit/:id" element={<EditChallengePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <ConditionalFooter />
      </div>
    </AuthGuardProvider>
  )
}
```

### 6. Nova estrutura de pastas

```
src/
├── main.tsx                     # Entry point
├── App.tsx                      # Router principal
├── vite-env.d.ts               # Types do Vite
├── pages/                       # Páginas (migradas de src/app)
│   ├── HomePage.tsx
│   ├── AdminPage.tsx
│   ├── TeacherPage.tsx
│   ├── ProfilePage.tsx
│   ├── LoginPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── ChallengePage.tsx
│   ├── PreChallengePage.tsx
│   ├── CreateChallengePage.tsx
│   ├── EditChallengePage.tsx
│   └── NotFoundPage.tsx
├── components/                  # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── providers/                   # Providers (não são atoms!)
│   └── AuthGuard.tsx
├── lib/                         # Utilities
│   ├── supabase.ts
│   ├── execution/
│   └── validation/
├── config/                      # Configurações centralizadas
│   ├── routes.ts
│   └── env.ts
├── hooks/                       # Custom hooks
├── types/                       # TypeScript types
├── styles/                      # CSS global
├── contexts/                    # React contexts
└── remote-exports/              # Module Federation
    ├── Dashboard.tsx
    └── shared-providers.tsx
```

---

## 🔄 MUDANÇAS DE CÓDIGO

### 1. Substituição de Imports

**next/navigation → react-router-dom:**

```typescript
// ANTES
import { useRouter, usePathname } from 'next/navigation'
const router = useRouter()
const pathname = usePathname()
router.push('/path')
router.replace('/path')

// DEPOIS
import { useNavigate, useLocation } from 'react-router-dom'
const navigate = useNavigate()
const location = useLocation()
navigate('/path')
navigate('/path', { replace: true })
```

**next/link → react-router-dom:**

```typescript
// ANTES
import Link from 'next/link'
<Link href="/path">Text</Link>

// DEPOIS
import { Link } from 'react-router-dom'
<Link to="/path">Text</Link>
```

**next/image → img:**

```typescript
// ANTES
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={100} height={100} />

// DEPOIS
<img src="/logo.png" alt="Logo" className="w-[100px] h-[100px]" />
```

### 2. Variáveis de Ambiente

```typescript
// ANTES
process.env.NEXT_PUBLIC_SUPABASE_URL

// DEPOIS
import.meta.env.VITE_SUPABASE_URL
```

### 3. Metadata (Next.js) → HTML direto

```typescript
// ANTES (src/app/layout.tsx)
export const metadata: Metadata = {
  title: "DevShaper",
  description: "..."
}

// DEPOIS (index.html)
<head>
  <title>DevShaper - Technical Assessments</title>
  <meta name="description" content="..." />
</head>
```

### 4. API Routes → Proxy no Vite

**Judge0 (mantém proxy):**

```typescript
// ANTES: src/app/api/judge0/:path*/route.ts
// DEPOIS: vite.config.ts proxy (já configurado acima)
```

**Supabase (chama direto):**

```typescript
// ANTES: src/app/api/challenges/route.ts
export async function GET(request: NextRequest) {
  const { data } = await supabase.from('challenges').select('*')
  return NextResponse.json({ data })
}

// DEPOIS: Chama direto no componente/hook
import { supabase } from '@/lib/supabase'

const { data } = await supabase
  .from('challenges')
  .select('*')
```

---

## 🎨 CORREÇÕES NO ATOMIC DESIGN

### Problema 1: GlobalAuthGuard não é Atom

**ANTES:**
```
src/components/atoms/GlobalAuthGuard/GlobalAuthGuard.tsx
```

**DEPOIS:**
```
src/providers/AuthGuard.tsx
```

```typescript
import { useEffect, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/components/providers/AuthProvider'
import { ROUTES } from '@/config/routes'

interface AuthGuardProviderProps {
  children: ReactNode
}

export function AuthGuardProvider({ children }: AuthGuardProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()

  const isPublicRoute = ROUTES.PUBLIC.some(route =>
    location.pathname === route || location.pathname.startsWith(route)
  )

  const isAssetRoute =
    location.pathname.startsWith('/assets/') ||
    location.pathname.endsWith('.js') ||
    location.pathname.endsWith('.css') ||
    location.pathname.endsWith('.json')

  useEffect(() => {
    if (!loading && !user && !isPublicRoute && !isAssetRoute) {
      navigate(`/auth/login?from=${encodeURIComponent(location.pathname)}`, { replace: true })
    }
  }, [loading, user, navigate, location.pathname, isPublicRoute, isAssetRoute])

  if (loading && !isPublicRoute && !isAssetRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user && !isPublicRoute && !isAssetRoute) {
    return null
  }

  return <>{children}</>
}
```

### Problema 2: AuthGuard duplicado

**Consolidar:**
- `src/components/atoms/AuthGuard/AuthGuard.tsx` (componente interno)
- `src/providers/AuthGuard.tsx` (provider global)

Manter apenas o necessário.

### Problema 3: AdminRouteWrapper é Guard, não Atom

**ANTES:**
```
src/components/atoms/AdminRouteWrapper/AdminRouteWrapper.tsx
```

**DEPOIS:**
```
src/components/guards/AdminRouteWrapper.tsx
```

---

## 🚀 ABSTRAÇÕES E MELHORIAS

### 1. Centralizar Configurações

**src/config/routes.ts:**

```typescript
export const ROUTES = {
  PUBLIC: [
    '/login',
    '/auth/login',
    '/reset-password',
    '/auth/reset-password',
  ],
  PROTECTED: [
    '/',
    '/profile',
    '/challenge',
  ],
  ADMIN: [
    '/admin',
    '/teacher',
    '/create',
    '/edit',
  ],
} as const

export const isPublicRoute = (pathname: string): boolean => {
  return ROUTES.PUBLIC.some(route => pathname === route || pathname.startsWith(route))
}

export const isAdminRoute = (pathname: string): boolean => {
  return ROUTES.ADMIN.some(route => pathname.startsWith(route))
}

export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname)
}
```

**src/config/env.ts:**

```typescript
const getEnv = (key: string): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const ENV = {
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('VITE_SUPABASE_ANON_KEY'),
  JUDGE0_API_URL: import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0.devfellowship.com',
} as const
```

**src/lib/supabase.ts (atualizar):**

```typescript
import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/config/env'

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY)
```

### 2. Abstrair Navegação com Type Safety

**src/hooks/useTypedNavigate.ts:**

```typescript
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

type AppRoute =
  | '/'
  | '/admin'
  | '/teacher'
  | '/profile'
  | '/auth/login'
  | '/reset-password'
  | `/challenge/${string}`
  | `/edit/${string}`

export function useTypedNavigate() {
  const navigate = useNavigate()

  return useCallback((to: AppRoute, options?: { replace?: boolean; state?: unknown }) => {
    navigate(to, options)
  }, [navigate])
}
```

### 3. Abstrair Loading States

**src/components/ui/LoadingScreen.tsx:**

```typescript
interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}
```

Usar em:
- AuthGuardProvider
- Lazy loading de páginas
- Data fetching

### 4. Remover Código Duplicado

**Contextos duplicados:**
- Verificar `remotes/contexts/` vs `src/contexts/`
- Consolidar em um único lugar

**Componentes similares:**
- Revisar atoms duplicados
- Consolidar lógica similar

---

## 📦 DEPENDÊNCIAS

### Remover

```bash
npm uninstall next eslint-config-next @module-federation/nextjs-mf
```

### Instalar

```bash
npm install -D vite@^5.4.11 @vitejs/plugin-react-swc@^3.7.1 @originjs/vite-plugin-federation@^1.3.6
npm install react-router-dom@6.26.2
```

### Manter (já instaladas)

```json
"react": "^19",
"react-dom": "^19",
"@tanstack/react-query": "^5.56.2",
"@supabase/supabase-js": "^2.55.0",
"tailwindcss": "^3.4.17"
```

---

## ⚙️ CONFIGURAÇÕES

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // suas customizações
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## ✅ CHECKLIST FINAL

### Configuração
- [ ] Branch `Samuel/Vite_config` criada
- [ ] Dependências Next.js removidas
- [ ] Dependências Vite instaladas
- [ ] `vite.config.ts` criado e configurado
- [ ] `tsconfig.json` atualizado
- [ ] `index.html` criado
- [ ] Scripts do package.json atualizados

### Estrutura
- [ ] `src/main.tsx` criado
- [ ] `src/App.tsx` criado
- [ ] `src/pages/` criada e populada
- [ ] `src/providers/` criada
- [ ] `src/config/` criada com routes e env
- [ ] `src/remote-exports/` reorganizada
- [ ] `pages/` deletada
- [ ] `remotes/` deletada
- [ ] `src/app/` deletada

### Código
- [ ] Todos `useRouter` → `useNavigate`
- [ ] Todos `usePathname` → `useLocation`
- [ ] Todos `next/link` → `react-router-dom`
- [ ] Todos `next/image` → `img`
- [ ] Variáveis `NEXT_PUBLIC_*` → `VITE_*`
- [ ] API routes refatoradas (Judge0 proxy, Supabase direto)
- [ ] GlobalAuthGuard movido para providers
- [ ] AdminRouteWrapper movido para guards

### Melhorias
- [ ] Configurações centralizadas (routes, env)
- [ ] Loading states abstraídos
- [ ] Type safety em navegação
- [ ] Código duplicado removido
- [ ] Atomic Design corrigido
- [ ] Comentários desnecessários removidos

### Module Federation
- [ ] Plugin configurado no vite.config.ts
- [ ] `remoteEntry.js` exposto
- [ ] Shared dependencies configuradas
- [ ] Dashboard export testado

### Testes
- [ ] `npm run dev` funciona
- [ ] `npm run build` funciona
- [ ] `npm run preview` funciona
- [ ] Todas as rotas navegam corretamente
- [ ] Autenticação funciona
- [ ] Judge0 proxy funciona
- [ ] Module Federation carrega

---

## 📚 ORDEM DE EXECUÇÃO

1. **Configuração inicial**
   - Criar branch
   - Atualizar package.json
   - Instalar/remover dependências

2. **Criar arquivos base**
   - index.html
   - vite.config.ts
   - tsconfig.json e tsconfig.node.json
   - src/main.tsx
   - src/App.tsx

3. **Migrar páginas**
   - Criar src/pages/
   - Mover componentes de src/app/
   - Ajustar imports

4. **Refatorar código**
   - Substituir hooks do Next.js
   - Atualizar imports
   - Criar configurações centralizadas

5. **Corrigir estrutura**
   - Mover GlobalAuthGuard
   - Reorganizar Atomic Design
   - Limpar duplicações

6. **Deletar obsoleto**
   - pages/
   - remotes/
   - src/app/
   - next.config.js

7. **Testar**
   - Build
   - Dev server
   - Navegação
   - Funcionalidades

---

## 🎯 RESULTADO ESPERADO

**Estrutura final:**

```
devshaper-app/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── vercel.json
├── .gitignore
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── pages/
│   ├── components/
│   ├── providers/
│   ├── guards/
│   ├── config/
│   ├── hooks/
│   ├── lib/
│   ├── contexts/
│   ├── types/
│   ├── styles/
│   └── remote-exports/
└── docs/
    └── MIGRATION_NEXTJS_TO_VITE.md
```

**Performance esperada:**
- Dev server: <1s para iniciar
- HMR: <100ms
- Build: ~30-60s (vs 2-5min no Next.js)
- Bundle: ~500KB inicial (vs 1-2MB no Next.js)

---

**Status:** Documentação completa ✅
**Próximo passo:** Executar migração seguindo esta documentação
