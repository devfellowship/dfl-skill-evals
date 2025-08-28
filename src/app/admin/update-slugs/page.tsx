"use client"

import { useState } from 'react'
import { useChallengeManagement } from '@/hooks/useChallengeManagement'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/atoms/Button/Button'
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function UpdateSlugsPage() {
  const { updateExistingChallengesWithSlugs, loading } = useChallengeManagement()
  const [result, setResult] = useState<{ updated: number; message: string } | null>(null)

  const handleUpdateSlugs = async () => {
    try {
      const result = await updateExistingChallengesWithSlugs()
      setResult(result)
      
      if (result.updated > 0) {
        toast.success(result.message)
      } else {
        toast.info(result.message)
      }
    } catch (error) {
      toast.error('Erro ao atualizar slugs')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Atualizar Slugs das Challenges</h1>
            <p className="text-gray-600 mt-2">
              Esta página atualiza todas as challenges existentes com slugs baseados no título
            </p>
          </div>
        </div>

        {/* Card Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Atualização de Slugs</CardTitle>
            <CardDescription>
              Clique no botão abaixo para atualizar todas as challenges existentes que não possuem slugs.
              Os slugs serão gerados automaticamente baseados no título de cada challenge.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Botão de Atualização */}
            <div className="flex justify-center">
              <Button 
                onClick={handleUpdateSlugs} 
                disabled={loading}
                size="lg"
                className="min-w-[200px]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar Slugs
                  </>
                )}
              </Button>
            </div>

            {/* Resultado */}
            {result && (
              <div className={`p-4 rounded-lg border ${
                result.updated > 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-3">
                  {result.updated > 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {result.updated > 0 ? 'Slugs Atualizados!' : 'Nenhuma Atualização Necessária'}
                    </h4>
                    <p className="text-gray-700 mt-1">{result.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Como funciona:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• As challenges existentes serão atualizadas com slugs únicos</li>
                <li>• Os slugs são baseados no título da challenge</li>
                <li>• Se houver conflitos, números serão adicionados automaticamente</li>
                <li>• Após a atualização, as URLs funcionarão como /challenges/{slug}</li>
              </ul>
            </div>

            {/* Exemplos */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Exemplos de URLs:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• "Two Sum" → /challenges/two-sum</p>
                <p>• "Valid Parentheses" → /challenges/valid-parentheses</p>
                <p>• "Merge Two Sorted Lists" → /challenges/merge-two-sorted-lists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

