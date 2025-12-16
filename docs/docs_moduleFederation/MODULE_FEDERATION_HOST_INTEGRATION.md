# INTEGRAÇÃO DO REMOTE: devshaper_app

## INFORMAÇÕES DO REMOTE

```
REMOTE_NAME: devshaper_app
EXPOSED_MODULE: Dashboard
BASE_PATH: /dashboard
REMOTE_ENTRY_URL (PROD): https://skillevals.devfellowship.com/assets/remoteEntry.js
REMOTE_ENTRY_URL (DEV): http://localhost:3000/assets/remoteEntry.js
URL_ORIGINAL: https://skillevals.devfellowship.com/
```

## CONFIGURAÇÃO NO HOST

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
        devshaper_app: process.env.NODE_ENV === 'production' 
          ? "https://skillevals.devfellowship.com/assets/remoteEntry.js"
          : "http://localhost:3000/assets/remoteEntry.js",
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

declare module "devshaper_app/Dashboard" {
  import React from "react";

  interface DashboardProps {
    basePath?: string;
  }

  const Dashboard: React.ComponentType<DashboardProps>;
  export default Dashboard;
}
```

#### 3. `src/App.tsx` (adicionar rota)

```typescript
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const RemoteDashboard = lazy(() => import("devshaper_app/Dashboard"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard/*"
          element={
            <Suspense fallback={<div>Carregando...</div>}>
              <RemoteDashboard basePath="/dashboard" />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## ROTAS DISPONÍVEIS

- `/` → HomePage
- `/admin` → AdminPage
- `/teacher` → TeacherDashboard
- `/profile` → ProfilePage
- `/auth/login` → LoginPage
- `/auth/reset-password` → ResetPasswordPage
- `/challenge/:id` → ChallengePage

Todas as rotas são relativas ao `basePath` configurado.

## VALIDAÇÃO

```bash
curl -I https://skillevals.devfellowship.com/assets/remoteEntry.js
```

Deve retornar: HTTP 200, `access-control-allow-origin: *`, `content-type: text/javascript`

## URLS

- **Produção:** https://skillevals.devfellowship.com/
- **Remote Entry (Prod):** https://skillevals.devfellowship.com/assets/remoteEntry.js
- **Localhost:** http://localhost:3000/
- **Remote Entry (Dev):** http://localhost:3000/assets/remoteEntry.js

