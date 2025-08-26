"use client"

interface NotFoundStateProps {
  title: string
  message: string
}

export function NotFoundState({ title, message }: NotFoundStateProps) {
  return (
    <div className="flex h-screen flex-col bg-background items-center justify-center">
      <h1 className="text-2xl font-semibold text-red-500 mb-2">{title}</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  )
}
