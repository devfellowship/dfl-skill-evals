# MODULE FEDERATION - QUICK START GUIDE

> **Para IAs:** Este é um guia executivo para implementar Module Federation. Siga exatamente na ordem apresentada.

---

## 📦 NOVO REMOTE (MINI APP)

### Informações Necessárias

Antes de começar, defina:

```
REMOTE_NAME: _______________ (ex: reviews_app, tasks_app)
BASE_PATH: _______________ (ex: /reviews, /tasks)
EXPOSED_MODULE: _______________ (ex: ReviewRequests, TaskManager)
DEPLOY_URL: _______________ (ex: https://app.vercel.app)
```

### Comandos de Instalação

```bash
npm install @originjs/vite-plugin-federation --save-dev
npm install react@18.3.1 react-dom@18.3.1 --save-exact
npm install react-router-dom@6.26.2 --save-exact
npm install @tanstack/react-query@5.56.2 --save-exact
```

### Arquivos a Criar/Modificar

#### 1. `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 4173 },
  plugins: [
    react(),
    federation({
      name: "REMOTE_NAME",  // ⚠️ SUBSTITUIR
      filename: "remoteEntry.js",
      exposes: {
        "./EXPOSED_MODULE": "./src/remote-exports/main-export.tsx",  // ⚠️ SUBSTITUIR
      },
      shared: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
    }),
  ].filter(Boolean),
  build: { target: "es2022" },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
```

#### 2. `src/contexts/BasePathContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from 'react';

interface BasePathContextType {
  basePath: string;
  buildRoute: (path: string) => string;
}

const BasePathContext = createContext<BasePathContextType | undefined>(undefined);

export function BasePathProvider({ children, basePath = '/BASE_PATH' }: { children: ReactNode; basePath?: string }) {  // ⚠️ SUBSTITUIR
  const buildRoute = (path: string) => {
    if (path === '/' || path === '') return basePath;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${basePath}/${cleanPath}`;
  };
  return <BasePathContext.Provider value={{ basePath, buildRoute }}>{children}</BasePathContext.Provider>;
}

export function useBasePath() {
  const context = useContext(BasePathContext);
  if (context === undefined) {
    return { basePath: '', buildRoute: (path: string) => path.startsWith('/') ? path : `/${path}` };
  }
  return context;
}
```

#### 3. `src/contexts/LayoutContext.tsx`

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isCompact, setIsCompact] = useState(false);
  return <LayoutContext.Provider value={{ isCompact, setIsCompact }}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within LayoutProvider');
  return context;
}
```

#### 4. `src/remote-exports/shared-providers.tsx`

```typescript
import React, { ReactNode, useState, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BasePathProvider } from "@/contexts/BasePathContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
// ⚠️ ADICIONAR: Seus outros providers (AuthProvider, AppProvider, etc.)

interface RemoteProps {
  hideHeader?: boolean;
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
  basePath = "/BASE_PATH",  // ⚠️ SUBSTITUIR
  remoteProps,
}) => {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false },
      },
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RemotePropsContext.Provider value={remoteProps !== undefined ? remoteProps : {}}>
        <BasePathProvider basePath={basePath}>
          <LayoutProvider>
            {/* ⚠️ ADICIONAR: Outros providers aqui */}
            {children}
          </LayoutProvider>
        </BasePathProvider>
      </RemotePropsContext.Provider>
    </QueryClientProvider>
  );
};
```

#### 5. `src/remote-exports/create-remote-export.tsx`

```typescript
import React from "react";
import { RemoteProviderWrapper } from "./shared-providers";

interface RemoteExportProps {
  basePath?: string;
}

export function createRemoteExport(Component: React.ComponentType): React.FC<RemoteExportProps> {
  const RemoteExport: React.FC<RemoteExportProps> = ({ basePath = "/BASE_PATH", ...otherProps }) => {  // ⚠️ SUBSTITUIR
    return (
      <RemoteProviderWrapper basePath={basePath} remoteProps={otherProps}>
        <Component />
      </RemoteProviderWrapper>
    );
  };

  RemoteExport.displayName = `RemoteExport(${Component.displayName || Component.name || "Component"})`;
  return RemoteExport;
}
```

#### 6. `src/remote-exports/app-routes.tsx`

```typescript
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// ⚠️ SUBSTITUIR: Importar suas páginas
import HomePage from "@/pages/home";
import NotFound from "@/pages/NotFound";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ⚠️ SUBSTITUIR: Suas rotas */}
      <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
```

#### 7. `src/remote-exports/main-export.tsx`

```typescript
import { AppRoutes } from "./app-routes";
import { createRemoteExport } from "./create-remote-export";

export default createRemoteExport(AppRoutes);
```

#### 8. `src/federation.d.ts`

```typescript
/// <reference types="vite/client" />

declare module "REMOTE_NAME/EXPOSED_MODULE" {  // ⚠️ SUBSTITUIR
  import React from "react";

  interface ExposedModuleProps {  // ⚠️ SUBSTITUIR
    basePath?: string;
  }

  const ExposedModule: React.ComponentType<ExposedModuleProps>;  // ⚠️ SUBSTITUIR
  export default ExposedModule;
}
```

#### 9. `vercel.json` (ou netlify.toml)

**Vercel:**
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
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ],
  "rewrites": [
    { "source": "/(.*)\\.js", "destination": "/assets/$1.js" },
    { "source": "/assets/(.*)", "destination": "/assets/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify:**
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

#### 10. Adaptar Layout (Opcional)

```typescript
// src/components/layout/app-layout.tsx
import { useModuleFederation } from '@/remote-exports/shared-providers';

export function AppLayout({ children }) {
  const isInModuleFederation = useModuleFederation();

  return (
    <div className="min-h-screen bg-background">
      {!isInModuleFederation && <Header />}  {/* Condicional */}
      <main className={isInModuleFederation ? "px-8 py-12" : "container mx-auto px-10 py-12"}>
        {children}
      </main>
    </div>
  );
}
```

### Build e Deploy

```bash
npm run build
# Deploy para Vercel/Netlify
# ⚠️ Anotar URL: https://DEPLOY_URL/assets/remoteEntry.js
```

---

## 🏠 INTEGRAÇÃO NO HOST

### Informações Necessárias

```
REMOTE_NAME: _______________ (do remote)
EXPOSED_MODULE: _______________ (do remote)
BASE_PATH: _______________ (rota no host)
REMOTE_ENTRY_URL: _______________ (URL do remoteEntry.js)
```

### Comandos de Instalação

```bash
npm install @originjs/vite-plugin-federation --save-dev
npm install react@18.3.1 react-dom@18.3.1 --save-exact
npm install react-router-dom@6.26.2 --save-exact
npm install @tanstack/react-query@5.56.2 --save-exact
```

### Arquivos a Criar/Modificar

#### 1. `vite.config.ts` (adicionar remote)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  server: { host: "::", port: 5173 },
  plugins: [
    react(),
    federation({
      name: "host_app",
      remotes: {
        REMOTE_NAME: "REMOTE_ENTRY_URL",  // ⚠️ SUBSTITUIR
        // Exemplo: reviews_app: "https://reviews.vercel.app/assets/remoteEntry.js"
      },
      shared: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
    }),
  ],
  build: { target: "es2022" },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

#### 2. `src/federation.d.ts` (adicionar declaração)

```typescript
/// <reference types="vite/client" />

declare module "REMOTE_NAME/EXPOSED_MODULE" {  // ⚠️ SUBSTITUIR
  import React from "react";

  interface ModuleProps {  // ⚠️ SUBSTITUIR
    basePath?: string;
  }

  const Module: React.ComponentType<ModuleProps>;  // ⚠️ SUBSTITUIR
  export default Module;
}
```

#### 3. `src/App.tsx` (adicionar rota)

```typescript
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ⚠️ ADICIONAR: Lazy import do remote
const RemoteModule = lazy(() => import("REMOTE_NAME/EXPOSED_MODULE"));  // ⚠️ SUBSTITUIR

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas existentes */}
        <Route path="/" element={<HomePage />} />

        {/* ⚠️ ADICIONAR: Nova rota para o remote */}
        <Route
          path="/BASE_PATH/*"  // ⚠️ SUBSTITUIR (ex: /reviews/*)
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RemoteModule basePath="/BASE_PATH" />  // ⚠️ SUBSTITUIR
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 4. `src/components/LoadingFallback.tsx` (criar se não existe)

```typescript
export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading module...</p>
      </div>
    </div>
  );
}
```

#### 5. `src/components/RemoteErrorBoundary.tsx` (criar se não existe)

```typescript
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  remoteName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in remote "${this.props.remoteName}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Failed to load {this.props.remoteName || "module"}
          </h2>
          <p className="text-muted-foreground mb-4">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

#### 6. Usar Error Boundary (recomendado)

```typescript
// src/App.tsx
import { RemoteErrorBoundary } from "./components/RemoteErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";

<Route
  path="/BASE_PATH/*"  // ⚠️ SUBSTITUIR
  element={
    <RemoteErrorBoundary remoteName="REMOTE_NAME">  // ⚠️ SUBSTITUIR
      <Suspense fallback={<LoadingFallback />}>
        <RemoteModule basePath="/BASE_PATH" />  // ⚠️ SUBSTITUIR
      </Suspense>
    </RemoteErrorBoundary>
  }
/>
```

### Build e Deploy

```bash
npm run build
# Deploy do host
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Remote (Mini App)

- [ ] `@originjs/vite-plugin-federation` instalado
- [ ] `vite.config.ts` configurado com federation
- [ ] `build.target: "es2022"` definido
- [ ] `src/remote-exports/` criada com 4 arquivos:
  - [ ] `main-export.tsx`
  - [ ] `app-routes.tsx`
  - [ ] `create-remote-export.tsx`
  - [ ] `shared-providers.tsx`
- [ ] `src/contexts/BasePathContext.tsx` criado
- [ ] `src/contexts/LayoutContext.tsx` criado
- [ ] `src/federation.d.ts` criado
- [ ] `vercel.json` ou `netlify.toml` com CORS configurado
- [ ] Build executado: `npm run build`
- [ ] `dist/assets/remoteEntry.js` existe
- [ ] Deploy realizado
- [ ] URL do remoteEntry.js acessível e retorna CORS: `*`

### Host

- [ ] `@originjs/vite-plugin-federation` instalado
- [ ] Versões exatas de React instaladas (18.3.1)
- [ ] `vite.config.ts` atualizado com remote
- [ ] `src/federation.d.ts` atualizado com declaração
- [ ] `src/App.tsx` atualizado com rota
- [ ] Rota usa wildcard `/*`
- [ ] `basePath` prop corresponde à rota
- [ ] Lazy import implementado
- [ ] Suspense wrapper adicionado
- [ ] Error boundary adicionado (recomendado)
- [ ] Build executado: `npm run build`
- [ ] Deploy realizado
- [ ] Navegação funciona em produção

---

## 🧪 TESTES RÁPIDOS

### Testar Remote Standalone

```bash
cd remote-app
npm run build
npm run preview
# Abrir http://localhost:4173
# ✅ App deve funcionar normalmente
```

### Testar remoteEntry.js

```bash
curl -I https://seu-remote.vercel.app/assets/remoteEntry.js

# ✅ Deve retornar:
# HTTP/2 200
# access-control-allow-origin: *
# content-type: text/javascript
```

### Testar Host

```bash
cd host-app
npm run dev
# Navegar para http://localhost:5173/BASE_PATH
# ✅ Remote deve carregar
# ✅ Navegação interna deve funcionar
```

---

## 🚨 TROUBLESHOOTING RÁPIDO

| Erro | Solução |
|------|---------|
| "Cannot find module" | Verificar URL do remoteEntry.js e nome do módulo |
| "CORS blocked" | Adicionar headers CORS no vercel.json |
| "Version mismatch" | Instalar versões exatas: `npm install react@18.3.1 --save-exact` |
| "Routing 404" | Adicionar wildcard `/*` na rota e passar `basePath` prop |
| "Styles missing" | Verificar Tailwind config e import do index.css no remote |

---

## 📝 TEMPLATE DE SUBSTITUIÇÃO

Ao implementar, substitua:

```
REMOTE_NAME → Nome do remote (ex: reviews_app)
BASE_PATH → Caminho base (ex: /reviews)
EXPOSED_MODULE → Nome do módulo exposto (ex: ReviewRequests)
DEPLOY_URL → URL do deploy (ex: https://app.vercel.app)
REMOTE_ENTRY_URL → URL completa (ex: https://app.vercel.app/assets/remoteEntry.js)
```

---

## 📚 REFERÊNCIAS COMPLETAS

- Guia completo do Remote: `MODULE_FEDERATION_REMOTE_GUIDE.md`
- Guia completo do Host: `MODULE_FEDERATION_HOST_GUIDE.md`

---

**Versão:** 1.0.0
**Criado:** 11/12/2025
