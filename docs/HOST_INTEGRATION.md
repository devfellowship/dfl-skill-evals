# ­ƒöù HOST INTEGRATION - DevShaper App

## ­ƒôï CONFIGURA├ç├âO R├üPIDA

### URL do Remote Entry
```
PRODU├ç├âO: https://skillevals.devfellowship.com/assets/remoteEntry.js
DESENVOLVIMENTO: http://localhost:5173/assets/remoteEntry.js
```

### 1. Instalar depend├¬ncias no host
```bash
npm install @originjs/vite-plugin-federation --save-dev
npm install react react-dom react-router-dom @tanstack/react-query --save-exact
# Vers├Áes exatas ser├úo determinadas pelo host
```

**Importante (evitar tela branca / erro $$typeof):** host e remote precisam usar **a mesma vers├úo do React**.

- **Recomendado**: `react@18.3.1` e `react-dom@18.3.1`

embr**Importante (evitar erro do Router / "Integra├º├úo inv├ílida"):** host e remote precisam compartilhar a **mesma inst├óncia** de `react-router-dom`.

- **Recomendado**: `react-router-dom@6.26.2`
- No host, garanta `shared` incluindo `react-router-dom` (n├úo pode ficar ÔÇ£s├│ no hostÔÇØ sem federation).

Exemplo no **host** (Vite + `@originjs/vite-plugin-federation`):

```typescript
federation({
  name: 'host_app',
  remotes: {
    devshaper_app: 'http://localhost:4175/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
})
```

### 2. Configurar vite.config.ts do host
```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'host_app',
      remotes: {
        devshaper_app: process.env.NODE_ENV === 'production'
          ? 'https://skillevals.devfellowship.com/assets/remoteEntry.js'
          : 'http://localhost:5173/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
    })
  ]
})
```

### 3. Declarar tipos (federation.d.ts)
```typescript
declare module 'devshaper_app/Dashboard' {
  import React from 'react'
  const Dashboard: React.ComponentType<{ basePath?: string }>
  export default Dashboard
}
```

### 4. Usar no componente do host
```typescript
import { lazy, Suspense } from 'react'
const RemoteDashboard = lazy(() => import('devshaper_app/Dashboard'))

<Suspense fallback={<div>Carregando...</div>}>
  <RemoteDashboard basePath="/dashboard" />
</Suspense>
```

## Ô£à VALIDA├ç├âO

Testar se o remote est├í acess├¡vel:
```bash
curl -I http://localhost:5173/assets/remoteEntry.js
```

Deve retornar HTTP 200.

## ­ƒÜÇ COMANDOS

- **Dev:** `npx vite` (porta 5173)
- **Build:** `npx vite build`
- **Preview:** `npx vite preview` (porta 4175)

## ÔÜá´©Å NOTAS

- Porta do dev server: **5173** (n├úo 3000)
- **Shared dependencies flex├¡veis**: Aceita qualquer vers├úo das libs compartilhadas
- **React eager loading**: Carregado imediatamente para evitar conflitos
- O remote exp├Áe apenas o m├│dulo `Dashboard`
- Dashboard atual: **vers├úo sem CSS/Tailwind** (usa apenas inline styles)
- **CSS isolado**: N├úo compartilha estilos para evitar conflitos
- **React.createElement**: Usa API imperativa para m├íxima compatibilidade
