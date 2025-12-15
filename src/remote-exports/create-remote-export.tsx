import React from "react"
import { RemoteProviderWrapper } from "./shared-providers"

interface RemoteExportProps {
  basePath?: string
  hideHeader?: boolean
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
        <Component />
      </RemoteProviderWrapper>
    )
  }

  RemoteExport.displayName = `RemoteExport(${
    Component.displayName || Component.name || "Component"
  })`

  return RemoteExport
}
