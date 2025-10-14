"use client"
interface LoadingStateProps {
  title?: string
  message?: string
}
export function LoadingState({ 
  title = "Carregando...", 
  message = "Aguarde um momento." 
}: LoadingStateProps) {
  return (
    <div className="flex h-screen flex-col bg-background items-center justify-center">
      <h1 className="text-2xl font-semibold text-primary mb-2">{title}</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  )
}