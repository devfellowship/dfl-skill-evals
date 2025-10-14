"use client"
import { RefreshCw, Square } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Progress } from "@/components/atoms/Progress/Progress"
interface ExecutionControlsProps {
  isLoading: boolean
  progress: number
  onCancel: () => void
}
export function ExecutionControls({ isLoading, progress, onCancel }: ExecutionControlsProps) {
  return (
    <div className="border-t border-border/40 p-4 bg-muted/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Executando testes determinísticos...</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          className="h-8"
        >
          <Square className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}