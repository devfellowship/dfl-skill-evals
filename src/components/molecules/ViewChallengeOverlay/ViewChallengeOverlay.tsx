"use client"
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/atoms/Separator/Separator'

interface ChallengeData {
  id: string
  title: string
  description: string
  difficulty: string
  category: string | string[]
  function_name: string
  initial_code: string
  testCases: any[]
  examples: any[]
  status: string
  mentor?: string
  createdAt?: string
  updatedAt?: string
}

interface ViewChallengeOverlayProps {
  challenge: ChallengeData
  isOpen: boolean
  onClose: () => void
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  expert: "bg-red-500/10 text-red-500 border-red-500/20"
}

const formatDate = (dateString?: string): string | null => {
  if (!dateString) return null
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return null
  }
}

export function ViewChallengeOverlay({ 
  challenge, 
  isOpen, 
  onClose 
}: ViewChallengeOverlayProps) {
  if (!isOpen) return null

  const categories = Array.isArray(challenge.category) 
    ? challenge.category 
    : [challenge.category]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">{challenge.title}</h2>
              <Badge 
                variant="outline" 
                className={DIFFICULTY_COLORS[challenge.difficulty] || ""}
              >
                {challenge.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>👤 {challenge.mentor || 'Usuário'}</span>
              {(() => {
                const createdDate = formatDate(challenge.createdAt)
                return createdDate ? (
                  <span>📅 Criado em: {createdDate}</span>
                ) : null
              })()}
              {(() => {
                const updatedDate = formatDate(challenge.updatedAt)
                const createdDate = formatDate(challenge.createdAt)
                return updatedDate && updatedDate !== createdDate ? (
                  <span>🔄 Atualizado em: {updatedDate}</span>
                ) : null
              })()}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{challenge.description}</p>
            </CardContent>
          </Card>

          {/* Categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Código Inicial */}
          <Card>
            <CardHeader>
              <CardTitle>Código Inicial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-md p-4">
                <p className="text-sm font-mono mb-2 text-primary">
                  <strong>Função:</strong> {challenge.function_name}
                </p>
                <Separator className="my-3" />
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>{challenge.initial_code || '// Código não definido'}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Casos de Teste */}
          <Card>
            <CardHeader>
              <CardTitle>
                Casos de Teste 
                {challenge.testCases && challenge.testCases.length > 0 && ` (${challenge.testCases.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenge.testCases && challenge.testCases.length > 0 ? (
                <div className="space-y-3">
                  {challenge.testCases.map((testCase: any, index: number) => (
                    <div 
                      key={index} 
                      className="bg-muted/30 rounded-md p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">
                          Caso {index + 1}
                        </span>
                        {testCase.hidden && (
                          <Badge variant="outline" className="text-xs">
                            Oculto
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Input:</p>
                          <code className="block bg-background/50 rounded px-2 py-1 font-mono text-xs">
                            {testCase.input}
                          </code>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Output Esperado:</p>
                          <code className="block bg-background/50 rounded px-2 py-1 font-mono text-xs">
                            {testCase.expectedOutput || testCase.expected_output}
                          </code>
                        </div>
                      </div>
                      {testCase.description && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {testCase.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">ℹ️ Nenhum caso de teste definido</p>
                  <p className="text-xs mt-1">Esta challenge não possui casos de teste configurados.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exemplos */}
          <Card>
            <CardHeader>
              <CardTitle>
                Exemplos
                {challenge.examples && challenge.examples.length > 0 && ` (${challenge.examples.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenge.examples && challenge.examples.length > 0 ? (
                <div className="space-y-3">
                  {challenge.examples.map((example: any, index: number) => (
                    <div 
                      key={index} 
                      className="bg-muted/30 rounded-md p-4 space-y-2"
                    >
                      <span className="text-sm font-semibold text-primary">
                        Exemplo {index + 1}
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Input:</p>
                          <code className="block bg-background/50 rounded px-2 py-1 font-mono text-xs">
                            {example.input}
                          </code>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Output:</p>
                          <code className="block bg-background/50 rounded px-2 py-1 font-mono text-xs">
                            {example.output}
                          </code>
                        </div>
                      </div>
                      {example.explanation && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Explicação:</strong> {example.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">ℹ️ Nenhum exemplo definido</p>
                  <p className="text-xs mt-1">Esta challenge não possui exemplos configurados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t bg-muted/50 flex-shrink-0">
          <Button
            type="button"
            variant="default"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}

