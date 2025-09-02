"use client"

import { Wifi, WifiOff, RefreshCw } from "lucide-react"

interface ConnectionStatusProps {
  isConnected: boolean
  lastUpdate: Date
}

export function ConnectionStatus({ isConnected, lastUpdate }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span>Tempo real ativo</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-yellow-500" />
          <span>Polling ativo</span>
        </>
      )}
      <span>•</span>
      <span>Atualizado: {lastUpdate.toLocaleTimeString()}</span>
    </div>
  )
}
