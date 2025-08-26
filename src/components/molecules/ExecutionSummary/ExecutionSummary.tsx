"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"

interface ExecutionSummaryProps {
  results: {
    passCount: number
    failCount: number
    totalExecutionTime: number
  }
  onReset: () => void
}

export function ExecutionSummary({ results, onReset }: ExecutionSummaryProps) {
  return (
    <div className="border-t border-border/40 p-4 bg-muted/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Resultado dos Testes Determinísticos</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="h-8"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{results.passCount}</div>
          <div className="text-muted-foreground">Passaram</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{results.failCount}</div>
          <div className="text-muted-foreground">Falharam</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{results.totalExecutionTime}ms</div>
          <div className="text-muted-foreground">Tempo Total</div>
        </div>
      </div>
    </div>
  )
}
