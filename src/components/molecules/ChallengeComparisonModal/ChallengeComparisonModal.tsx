"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, CheckCircle, XCircle, AlertTriangle, Code, TestTube, BookOpen, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ChallengeComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  challengeId: string
  onApprove?: () => void
  onReject?: () => void
}

interface ChallengeData {
  id: string
  title: string
  description: string
  difficulty: number
  category: string[]
  functionName: string
  initialCode: string
  testCases: any[]
  createdAt: string
  updatedAt: string
}

interface ComparisonResult {
  hasChanges: boolean
  changes: {
    title?: { old: string; new: string }
    description?: { old: string; new: string }
    difficulty?: { old: number; new: number }
    category?: { old: string[]; new: string[] }
    functionName?: { old: string; new: string }
    initialCode?: { old: string; new: string }
    testCases?: { old: any[]; new: any[] }
  }
}

export function ChallengeComparisonModal({ 
  isOpen, 
  onClose, 
  challengeId, 
  onApprove, 
  onReject 
}: ChallengeComparisonModalProps) {
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeData | null>(null)
  const [originalChallenge, setOriginalChallenge] = useState<ChallengeData | null>(null)
  const [comparison, setComparison] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && challengeId) {
      loadChallengeData()
    }
  }, [isOpen, challengeId])

  const loadChallengeData = async () => {
    try {
      setLoading(true)
      
      // Carregar challenge atual
      const { data: currentData, error: currentError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single()

      if (currentError) {
        return
      }

      if (currentData) {
        const adaptedCurrent: ChallengeData = {
          id: currentData.id,
          title: currentData.title,
          description: currentData.description,
          difficulty: currentData.difficulty,
          category: Array.isArray(currentData.category) ? currentData.category : [currentData.category || 'Algoritmos'],
          functionName: currentData.function_name,
          initialCode: currentData.initial_code || '',
          testCases: currentData.test_cases || [],
          createdAt: currentData.created_at,
          updatedAt: currentData.updated_at
        }
        setCurrentChallenge(adaptedCurrent)

        // Para este exemplo, vamos simular dados originais
        // Em um sistema real, você salvaria os dados originais quando aprovado
        const originalData: ChallengeData = {
          ...adaptedCurrent,
          title: adaptedCurrent.title + ' (versão original)',
          description: adaptedCurrent.description + '\n\n[Esta é uma versão simulada dos dados originais]',
          difficulty: Math.max(1, adaptedCurrent.difficulty - 1),
          category: ['Algoritmos'],
          initialCode: adaptedCurrent.initialCode + '\n// Código original modificado'
        }
        setOriginalChallenge(originalData)

        // Comparar as versões
        const comparisonResult = compareChallenges(originalData, adaptedCurrent)
        setComparison(comparisonResult)
      }
    } catch (err) {
      } finally {
      setLoading(false)
    }
  }

  const compareChallenges = (original: ChallengeData, current: ChallengeData): ComparisonResult => {
    const changes: ComparisonResult['changes'] = {}
    let hasChanges = false

    if (original.title !== current.title) {
      changes.title = { old: original.title, new: current.title }
      hasChanges = true
    }

    if (original.description !== current.description) {
      changes.description = { old: original.description, new: current.description }
      hasChanges = true
    }

    if (original.difficulty !== current.difficulty) {
      changes.difficulty = { old: original.difficulty, new: current.difficulty }
      hasChanges = true
    }

    if (JSON.stringify(original.category) !== JSON.stringify(current.category)) {
      changes.category = { old: original.category, new: current.category }
      hasChanges = true
    }

    if (original.functionName !== current.functionName) {
      changes.functionName = { old: original.functionName, new: current.functionName }
      hasChanges = true
    }

    if (original.initialCode !== current.initialCode) {
      changes.initialCode = { old: original.initialCode, new: current.initialCode }
      hasChanges = true
    }

    if (JSON.stringify(original.testCases) !== JSON.stringify(current.testCases)) {
      changes.testCases = { old: original.testCases, new: current.testCases }
      hasChanges = true
    }

    return { hasChanges, changes }
  }

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Fácil'
      case 2: return 'Médio'
      case 3: return 'Difícil'
      case 4: return 'Expert'
      default: return 'Fácil'
    }
  }

  const renderChange = (field: string, change: any) => {
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-sm capitalize">{field}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Versão Original</label>
                         <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-800">
               {typeof change.old === 'string' ? (
                 <pre className="whitespace-pre-wrap text-red-800 font-medium">{change.old}</pre>
               ) : Array.isArray(change.old) ? (
                 <div className="text-red-800 font-medium">{change.old.join(', ')}</div>
               ) : (
                 <div className="text-red-800 font-medium">{change.old}</div>
               )}
             </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Nova Versão</label>
                         <div className="bg-green-100 border border-green-300 rounded p-3 text-sm text-green-800">
               {typeof change.new === 'string' ? (
                 <pre className="whitespace-pre-wrap text-green-800 font-medium">{change.new}</pre>
               ) : Array.isArray(change.new) ? (
                 <div className="text-green-800 font-medium">{change.new.join(', ')}</div>
               ) : (
                 <div className="text-green-800 font-medium">{change.new}</div>
               )}
             </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Análise de Alterações - Challenge
          </DialogTitle>
          <DialogDescription>
            Revise as alterações feitas nesta challenge antes de aprovar ou rejeitar
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : comparison && currentChallenge ? (
          <div className="space-y-6">
            {/* Resumo das Alterações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {comparison.hasChanges ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Alterações Detectadas
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Nenhuma Alteração
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comparison.hasChanges ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Foram detectadas alterações nos seguintes campos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(comparison.changes).map((field) => (
                        <Badge key={field} variant="outline" className="capitalize">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma alteração foi detectada nesta challenge.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Detalhes das Alterações */}
            {comparison.hasChanges && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="code">Código</TabsTrigger>
                  <TabsTrigger value="tests">Testes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="space-y-4">
                    {comparison.changes.title && renderChange('Título', comparison.changes.title)}
                    {comparison.changes.difficulty && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Dificuldade</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted-foreground">Versão Original</label>
                                                         <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-800 font-medium">
                               {getDifficultyLabel(comparison.changes.difficulty.old)}
                             </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Nova Versão</label>
                                                         <div className="bg-green-100 border border-green-300 rounded p-3 text-sm text-green-800 font-medium">
                               {getDifficultyLabel(comparison.changes.difficulty.new)}
                             </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {comparison.changes.category && renderChange('Categoria', comparison.changes.category)}
                    {comparison.changes.functionName && renderChange('Nome da Função', comparison.changes.functionName)}
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  {comparison.changes.description && renderChange('Descrição', comparison.changes.description)}
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  {comparison.changes.initialCode && renderChange('Código Inicial', comparison.changes.initialCode)}
                </TabsContent>

                <TabsContent value="tests" className="space-y-4">
                  {comparison.changes.testCases && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Casos de Teste</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground">Versão Original</label>
                                                     <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-800">
                             <pre className="text-xs overflow-x-auto text-red-800 font-mono font-medium">
                               {JSON.stringify(comparison.changes.testCases.old, null, 2)}
                             </pre>
                           </div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Nova Versão</label>
                                                     <div className="bg-green-100 border border-green-300 rounded p-3 text-sm text-green-800">
                             <pre className="text-xs overflow-x-auto text-green-800 font-mono font-medium">
                               {JSON.stringify(comparison.changes.testCases.new, null, 2)}
                             </pre>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Fechar
              </Button>
              {onReject && (
                <Button variant="destructive" onClick={onReject}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeitar
                </Button>
              )}
              {onApprove && (
                <Button onClick={onApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Erro ao carregar dados da challenge</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

