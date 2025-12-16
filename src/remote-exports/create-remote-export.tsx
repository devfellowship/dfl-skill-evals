import React from "react"
import { useInRouterContext } from "react-router-dom"
import { RemoteProviderWrapper } from "./shared-providers"

interface RemoteExportProps {
  basePath?: string
  hideHeader?: boolean
}

function RouterGuard({ children }: { children: React.ReactNode }) {
  // O Router deve existir apenas no HOST. Se o host não estiver fornecendo Router
  // (ou estiver usando outra instância de react-router-dom), evitamos crash e
  // mostramos uma mensagem explícita.
  const inRouter = useInRouterContext()

  if (!inRouter) {
    return (
      <div style={{ padding: 16 }}>
        <strong>Integração inválida:</strong> este remote precisa ser renderizado dentro de um{" "}
        <code>BrowserRouter</code> no host <em>e</em> usar a <strong>mesma instância</strong> de{" "}
        <code>react-router-dom</code> (shared via Module Federation).
        <div style={{ marginTop: 8, opacity: 0.9 }}>
          <div>
            - Verifique se o host compartilha: <code>react</code>, <code>react-dom</code>,{" "}
            <code>react-router-dom</code>, <code>@tanstack/react-query</code>
          </div>
          <div>
            - Versões recomendadas: <code>react@18.3.1</code>, <code>react-dom@18.3.1</code>,{" "}
            <code>react-router-dom@6.26.2</code>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function createRemoteExport(
  Component: React.ComponentType,
): React.FC<RemoteExportProps> {
  const RemoteExport: React.FC<RemoteExportProps> = ({
    basePath = "/dashboard",
    ...otherProps
  }) => {
    return (
      <RemoteProviderWrapper basePath={basePath} remoteProps={otherProps}>
        <RouterGuard>
          <Component />
        </RouterGuard>
      </RemoteProviderWrapper>
    )
  }

  RemoteExport.displayName = `RemoteExport(${
    Component.displayName || Component.name || "Component"
  })`

  return RemoteExport
}
