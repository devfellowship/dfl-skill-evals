# GUIA COMPLETO: MODULE FEDERATION REMOTE (MINI APP)

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração Inicial](#configuração-inicial)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Implementação Passo a Passo](#implementação-passo-a-passo)
6. [Configuração de Deploy](#configuração-de-deploy)
7. [Testes e Validação](#testes-e-validação)
8. [Checklist Final](#checklist-final)

---

## 🎯 VISÃO GERAL

Este guia descreve como transformar uma aplicação React + Vite em um **Module Federation Remote** que pode ser consumido por uma aplicação host.

### Conceitos Chave

- **Remote**: Mini app que expõe componentes/funcionalidades
- **Host**: Aplicação principal que consome o remote
- **Module Federation**: Tecnologia que permite compartilhar código entre aplicações em runtime
- **remoteEntry.js**: Arquivo principal que o host usa para carregar o remote

### Arquitetura do DevFellowship Reviews App

```
┌─────────────────────────────────────────────────────────────┐
│                        HOST APP                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Router (BrowserRouter)                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │   Route: /reviews/*                             │  │  │
│  │  │   ┌─────────────────────────────────────────┐   │  │  │
│  │  │   │    REMOTE: reviews_app                  │   │  │  │
│  │  │   │    (Lazy loaded via Module Federation)  │   │  │  │
│  │  │   │                                          │   │  │  │
│  │  │   │  ┌────────────────────────────────────┐ │   │  │  │
│  │  │   │  │  RemoteProviderWrapper             │ │   │  │  │
│  │  │   │  │  - QueryClient                     │ │   │  │  │
│  │  │   │  │  - AuthContext                     │ │   │  │  │
│  │  │   │  │  - AppContext                      │ │   │  │  │
│  │  │   │  │  - BasePathContext (/reviews)      │ │   │  │  │
│  │  │   │  │                                    │ │   │  │  │
│  │  │   │  │  ┌──────────────────────────────┐ │ │   │  │  │
│  │  │   │  │  │  ReviewRequestsApp (Routes)  │ │ │   │  │  │
│  │  │   │  │  │  - /                         │ │ │   │  │  │
│  │  │   │  │  │  - /new-review-request       │ │ │   │  │  │
│  │  │   │  │  │  - /review-requests/:id      │ │ │   │  │  │
│  │  │   │  │  │  - /templates                │ │ │   │  │  │
│  │  │   │  │  └──────────────────────────────┘ │ │   │  │  │
│  │  │   │  └────────────────────────────────────┘ │   │  │  │
│  │  │   └─────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ PRÉ-REQUISITOS

### Tecnologias Obrigatórias

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "@tanstack/react-query": "^5.56.2",
  "vite": "^5.4.0",
  "typescript": "^5.5.3"
}
```

### Estrutura de Projeto Esperada

```
mini-app/
├── src/
│   ├── pages/               # Páginas do mini app
│   ├── components/          # Componentes reutilizáveis
│   ├── contexts/            # Contexts React
│   ├── hooks/               # Custom hooks
│   └── App.tsx              # App standalone
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 CONFIGURAÇÃO INICIAL

### PASSO 1: Instalar Dependências

```bash
npm install @originjs/vite-plugin-federation --save-dev
```

### PASSO 2: Configurar vite.config.ts

**Arquivo:** `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4173,  // IMPORTANTE: Porta para preview do build
  },
  plugins: [
    react(),
    federation({
      name: "SEU_REMOTE_NAME",           // ⚠️ SUBSTITUIR: Nome único do remote
      filename: "remoteEntry.js",         // ⚠️ NÃO ALTERAR: Nome padrão
      exposes: {
        "./MainExport": "./src/remote-exports/main-export.tsx",  // ⚠️ SUBSTITUIR: Seu export principal
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query"
      ],
    }),
  ].filter(Boolean),
  build: {
    target: "es2022",  // ⚠️ OBRIGATÓRIO: ES2022 para Module Federation
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // ⚠️ OBRIGATÓRIO: Alias para imports
    },
  },
}));
```

**Variáveis a Substituir:**

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `SEU_REMOTE_NAME` | `reviews_app` | Nome único do remote (snake_case) |
| `./MainExport` | `./ReviewRequests` | Nome do módulo exposto |
| `./src/remote-exports/main-export.tsx` | Caminho do arquivo de export | |

### PASSO 3: Atualizar package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:federation": "vite build --mode federation",
    "build:dev": "vite build --mode development",
    "preview": "vite preview"
  }
}
```

### PASSO 4: Configurar TypeScript

**Arquivo:** `tsconfig.json`

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
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // ⚠️ OBRIGATÓRIO: Path alias
    }
  },
  "include": ["src"]
}
```

---

## 📁 ESTRUTURA DE ARQUIVOS

### Estrutura Completa Obrigatória

```
src/
├── remote-exports/                              # ⚠️ PASTA OBRIGATÓRIA
│   ├── main-export.tsx                          # Export principal
│   ├── app-routes.tsx                           # Componente de rotas
│   ├── create-remote-export.tsx                 # HOC wrapper
│   └── shared-providers.tsx                     # Provider wrapper
├── contexts/
│   ├── BasePathContext.tsx                      # ⚠️ OBRIGATÓRIO
│   ├── LayoutContext.tsx                        # ⚠️ OBRIGATÓRIO
│   └── [outros contexts]
├── components/
│   └── layout/
│       └── app-layout.tsx                       # Layout com suporte MF
├── pages/
│   └── [suas páginas]
├── federation.d.ts                              # ⚠️ OBRIGATÓRIO: Types
└── App.tsx                                      # App standalone
```

---

## 🔨 IMPLEMENTAÇÃO PASSO A PASSO

### ETAPA 1: Criar BasePathContext

**Arquivo:** `src/contexts/BasePathContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from 'react';

interface BasePathContextType {
  basePath: string;
  buildRoute: (path: string) => string;
}

const BasePathContext = createContext<BasePathContextType | undefined>(undefined);

export function BasePathProvider({
  children,
  basePath = '/SEU_BASE_PATH'  // ⚠️ SUBSTITUIR: ex: '/reviews'
}: {
  children: ReactNode;
  basePath?: string
}) {
  const buildRoute = (path: string) => {
    if (path === '/' || path === '') {
      return basePath;
    }

    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${basePath}/${cleanPath}`;
  };

  return (
    <BasePathContext.Provider value={{ basePath, buildRoute }}>
      {children}
    </BasePathContext.Provider>
  );
}

export function useBasePath() {
  const context = useContext(BasePathContext);
  if (context === undefined) {
    return {
      basePath: '',
      buildRoute: (path: string) => path.startsWith('/') ? path : `/${path}`,
    };
  }
  return context;
}
```

**Uso:**
```typescript
const { basePath, buildRoute } = useBasePath();
navigate(buildRoute('/page'));  // Torna-se /seu-base-path/page
```

---

### ETAPA 2: Criar LayoutContext

**Arquivo:** `src/contexts/LayoutContext.tsx`

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <LayoutContext.Provider value={{ isCompact, setIsCompact }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
}
```

---

### ETAPA 3: Criar Shared Providers

**Arquivo:** `src/remote-exports/shared-providers.tsx`

```typescript
import React, { ReactNode, useState, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BasePathProvider } from "@/contexts/BasePathContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
// ⚠️ ADICIONAR: Imports dos seus contexts específicos

interface RemoteProps {
  hideHeader?: boolean;
  // ⚠️ ADICIONAR: Outras props que o host pode passar
}

const RemotePropsContext = createContext<RemoteProps | null | undefined>(undefined);

export function useRemoteProps(): RemoteProps | null {
  return useContext(RemotePropsContext);
}

export function useModuleFederation(): boolean {
  const remoteProps = useContext(RemotePropsContext);
  return remoteProps !== undefined;
}

interface RemoteProviderWrapperProps {
  children: ReactNode;
  basePath?: string;
  remoteProps?: RemoteProps;
}

export const RemoteProviderWrapper: React.FC<RemoteProviderWrapperProps> = ({
  children,
  basePath = "/SEU_BASE_PATH",  // ⚠️ SUBSTITUIR: ex: '/reviews'
  remoteProps,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RemotePropsContext.Provider value={remoteProps !== undefined ? remoteProps : {}}>
        <BasePathProvider basePath={basePath}>
          <LayoutProvider>
            {/* ⚠️ ADICIONAR: Seus outros providers aqui */}
            {/* Exemplo: <AuthProvider>, <AppProvider>, etc. */}
            {children}
          </LayoutProvider>
        </BasePathProvider>
      </RemotePropsContext.Provider>
    </QueryClientProvider>
  );
};
```

**Contextos Obrigatórios:**
1. ✅ QueryClientProvider - TanStack Query
2. ✅ BasePathProvider - Routing dinâmico
3. ✅ LayoutProvider - Estado de layout
4. ⚠️ [Seus contexts específicos] - Auth, App State, etc.

---

### ETAPA 4: Criar HOC de Export

**Arquivo:** `src/remote-exports/create-remote-export.tsx`

```typescript
import React from "react";
import { RemoteProviderWrapper } from "./shared-providers";

interface RemoteExportProps {
  basePath?: string;
  // ⚠️ ADICIONAR: Outras props que o host pode passar
}

export function createRemoteExport(
  Component: React.ComponentType,
): React.FC<RemoteExportProps> {
  const RemoteExport: React.FC<RemoteExportProps> = ({
    basePath = "/SEU_BASE_PATH",  // ⚠️ SUBSTITUIR
    ...otherProps
  }) => {
    return (
      <RemoteProviderWrapper basePath={basePath} remoteProps={otherProps}>
        <Component />
      </RemoteProviderWrapper>
    );
  };

  RemoteExport.displayName = `RemoteExport(${
    Component.displayName || Component.name || "Component"
  })`;

  return RemoteExport;
}
```

---

### ETAPA 5: Criar Componente de Rotas

**Arquivo:** `src/remote-exports/app-routes.tsx`

```typescript
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// ⚠️ SUBSTITUIR: Imports das suas páginas
import HomePage from "@/pages/home";
import DetailPage from "@/pages/detail";
import NotFound from "@/pages/NotFound";

// ⚠️ OPCIONAL: Adicionar proteção de rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ⚠️ SUBSTITUIR: Suas rotas */}
      <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="detail/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
```

**Padrão de Rotas:**
- `/` → Rota raiz (index)
- `/page` → Rotas diretas
- `/:id` → Rotas dinâmicas
- `/404` → Página não encontrada
- `/*` → Fallback para 404

---

### ETAPA 6: Criar Export Principal

**Arquivo:** `src/remote-exports/main-export.tsx`

```typescript
import { AppRoutes } from "./app-routes";
import { createRemoteExport } from "./create-remote-export";

export default createRemoteExport(AppRoutes);
```

**Este é o arquivo exposto no vite.config.ts!**

---

### ETAPA 7: Criar Type Declarations

**Arquivo:** `src/federation.d.ts`

```typescript
/// <reference types="vite/client" />

declare module "SEU_REMOTE_NAME/MainExport" {  // ⚠️ SUBSTITUIR
  import React from "react";

  interface MainExportProps {
    basePath?: string;
    // ⚠️ ADICIONAR: Outras props
  }

  const MainExport: React.ComponentType<MainExportProps>;
  export default MainExport;
}
```

**Exemplo Real:**
```typescript
declare module "reviews_app/ReviewRequests" {
  import React from "react";

  interface ReviewRequestsProps {
    basePath?: string;
  }

  const ReviewRequests: React.ComponentType<ReviewRequestsProps>;
  export default ReviewRequests;
}
```

---

### ETAPA 8: Adaptar Layout para Module Federation

**Arquivo:** `src/components/layout/app-layout.tsx`

```typescript
import { ReactNode } from 'react';
import { useModuleFederation } from '@/remote-exports/shared-providers';
import { useLayout } from '@/contexts/LayoutContext';
import Header from './Header';  // ⚠️ Seu componente de header

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCompact } = useLayout();
  const isInModuleFederation = useModuleFederation();

  return (
    <div className="min-h-screen bg-background">
      {/* ⚠️ IMPORTANTE: Renderizar header apenas em standalone */}
      {!isInModuleFederation && <Header />}

      <main
        className={
          isInModuleFederation
            ? isCompact ? "px-10 py-12" : "px-8 py-12"
            : isCompact ? "container mx-auto px-6 py-12" : "container mx-auto px-10 py-12"
        }
      >
        {children}
      </main>
    </div>
  );
}
```

**Lógica:**
- `isInModuleFederation === true` → Rodando como remote no host
- `isInModuleFederation === false` → Rodando standalone

---

## 🚀 CONFIGURAÇÃO DE DEPLOY

### PASSO 1: Criar vercel.json (ou equivalente)

**Arquivo:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)\\.js",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Content-Type", "value": "text/javascript" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)\\.js", "destination": "/assets/$1.js" },
    { "source": "/assets/(.*)", "destination": "/assets/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**⚠️ CRÍTICO: CORS Headers**

Os headers `Access-Control-Allow-Origin: *` são **OBRIGATÓRIOS** para Module Federation funcionar. Sem eles, o host não conseguirá carregar o remoteEntry.js.

**Alternativa para Netlify:**

**Arquivo:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### PASSO 2: Configurar Variáveis de Ambiente

**Arquivo:** `.env.example`

```env
# ⚠️ SUBSTITUIR com suas variáveis
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=your_api_url
```

**No Vercel/Netlify:**
1. Adicionar as mesmas variáveis no dashboard
2. Garantir que começam com `VITE_` para serem expostas

### PASSO 3: Build e Deploy

```bash
# Build local
npm run build

# Verificar dist/
# Deve conter:
# - dist/assets/remoteEntry.js  ⚠️ ARQUIVO CRÍTICO
# - dist/assets/__federation_*.js
# - dist/index.html

# Deploy
git push origin main  # Ou deploy manual
```

### PASSO 4: Verificar Deploy

**URL do remoteEntry.js:**
```
https://seu-dominio.com/assets/remoteEntry.js
```

**Teste:**
```bash
curl -I https://seu-dominio.com/assets/remoteEntry.js

# Deve retornar:
# HTTP/2 200
# access-control-allow-origin: *
# content-type: text/javascript
```

---

## ✅ TESTES E VALIDAÇÃO

### Teste 1: Build Local

```bash
npm run build
npm run preview

# Abrir http://localhost:4173
# ✅ App deve funcionar standalone
```

### Teste 2: Verificar remoteEntry.js

```bash
# Após build
cat dist/assets/remoteEntry.js | head -n 20

# Deve conter:
# - exports: get, init, dynamicLoadingCss
# - Referência ao módulo exposto
```

### Teste 3: Verificar Shared Dependencies

```bash
ls -la dist/assets/__federation_shared_*

# Deve listar:
# - __federation_shared_react-*.js
# - __federation_shared_react-dom-*.js
# - __federation_shared_react-router-dom-*.js
# - __federation_shared_@tanstack/react-query-*.js
```

### Teste 4: Module Federation Detection

**Adicionar log temporário:**

```typescript
// Em algum componente
const isInMF = useModuleFederation();
console.log('Module Federation:', isInMF);

// Standalone: false
// No host: true
```

---

## 📝 CHECKLIST FINAL

### Configuração

- [ ] ✅ `@originjs/vite-plugin-federation` instalado
- [ ] ✅ `vite.config.ts` configurado com federation plugin
- [ ] ✅ `build.target` definido como `"es2022"`
- [ ] ✅ Alias `@` configurado no vite e tsconfig
- [ ] ✅ Scripts de build adicionados ao package.json

### Estrutura de Arquivos

- [ ] ✅ `src/remote-exports/` criado
- [ ] ✅ `main-export.tsx` implementado
- [ ] ✅ `app-routes.tsx` implementado
- [ ] ✅ `create-remote-export.tsx` implementado
- [ ] ✅ `shared-providers.tsx` implementado
- [ ] ✅ `src/federation.d.ts` criado

### Contexts

- [ ] ✅ `BasePathContext.tsx` implementado
- [ ] ✅ `LayoutContext.tsx` implementado
- [ ] ✅ `useModuleFederation()` hook disponível
- [ ] ✅ `useBasePath()` hook disponível

### Layout

- [ ] ✅ Layout adaptado para detectar Module Federation
- [ ] ✅ Header condicional (não mostra no remote)
- [ ] ✅ Padding/espaçamento ajustado para MF

### Deploy

- [ ] ✅ CORS headers configurados
- [ ] ✅ Variáveis de ambiente definidas
- [ ] ✅ Build executado com sucesso
- [ ] ✅ `remoteEntry.js` acessível publicamente
- [ ] ✅ URL do remote documentada

### Testes

- [ ] ✅ App funciona standalone (`npm run dev`)
- [ ] ✅ Build gera artifacts corretos
- [ ] ✅ remoteEntry.js retorna CORS correto
- [ ] ✅ Shared dependencies estão no build

---

## 🎓 EXEMPLO COMPLETO: REVIEWS APP

### Configuração Real

```typescript
// vite.config.ts
federation({
  name: "reviews_app",
  filename: "remoteEntry.js",
  exposes: {
    "./ReviewRequests": "./src/remote-exports/review-requests-export.tsx",
  },
  shared: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
})
```

### Type Declaration Real

```typescript
// src/federation.d.ts
declare module "reviews_app/ReviewRequests" {
  import React from "react";
  interface ReviewRequestsProps {
    basePath?: string;
  }
  const ReviewRequests: React.ComponentType<ReviewRequestsProps>;
  export default ReviewRequests;
}
```

### URL do Remote

```
https://reviews-devfellowship.vercel.app/assets/remoteEntry.js
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Cannot find module 'remote/Module'"

**Causa:** remoteEntry.js não acessível ou CORS bloqueado

**Solução:**
1. Verificar URL do remoteEntry.js
2. Verificar headers CORS
3. Verificar build gerou o arquivo

### Erro: "Shared module version mismatch"

**Causa:** Versões diferentes de React/React-DOM entre host e remote

**Solução:**
```bash
# Alinhar versões no package.json
npm install react@18.3.1 react-dom@18.3.1 --save-exact
```

### Erro: "Cannot read property 'init' of undefined"

**Causa:** Build target não é ES2022

**Solução:**
```typescript
// vite.config.ts
build: {
  target: "es2022"  // OBRIGATÓRIO
}
```

### Layout Quebrado no Remote

**Causa:** Header aparecendo quando não deveria

**Solução:**
```typescript
const isInMF = useModuleFederation();
{!isInMF && <Header />}  // Condicional
```

---

## 📚 REFERÊNCIAS

- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [DevFellowship Reviews App](https://github.com/seu-repo/reviews-devfellowship)

---

## 📞 SUPORTE

Para integração com o host, consulte: `MODULE_FEDERATION_HOST_GUIDE.md`

---

**Versão:** 1.0.0
**Última Atualização:** 11/12/2025
**Autor:** DevFellowship Team
