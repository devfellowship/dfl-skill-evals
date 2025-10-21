"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useChallengeOperations } from '@/hooks/useChallengeOperations'
import { useUserRole } from '@/hooks/useUserRole'
import { useChallengeForm } from '@/hooks/challenge/useChallengeForm'
import { ChallengeFormFields } from '@/components/molecules/ChallengeFormFields/ChallengeFormFields'
import { Button } from "@/components/atoms/Button/Button"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'

interface EditChallengeProps {
  challengeId: string
}

export function EditChallenge({ challengeId }: EditChallengeProps) {
  const router = useRouter()
  const { updateChallenge, isApproving } = useChallengeOperations()
  const { role, label, isAdmin } = useUserRole()
  const [isLoading, setIsLoading] = useState(true)
  const [challenge, setChallenge] = useState<any>(null)

  const {
    formData,
    testCases,
    examples,
    skills,
    constraints,
    hints,
    handleInputChange,
    handleCategoryChange,
    addTestCase,
    removeTestCase,
    addExample,
    removeExample,
    addSkill,
    removeSkill,
    addConstraint,
    removeConstraint,
    addHint,
    removeHint,
    validateForm,
    loadFormData
  } = useChallengeForm({ mode: 'edit' })

  useEffect(() => {
    if (challengeId) {
      loadChallenge()
    }
  }, [challengeId])

  const loadChallenge = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/challenges/${challengeId}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar challenge')
      }

      if (result.data) {
        const challengeData = result.data
        setChallenge(challengeData)
        
        loadFormData({
          title: challengeData.title || '',
          description: challengeData.description || '',
          difficulty: challengeData.difficulty === 1 ? 'easy' 
                     : challengeData.difficulty === 2 ? 'medium'
                     : challengeData.difficulty === 3 ? 'hard'
                     : challengeData.difficulty === 4 ? 'expert'
                     : 'easy',
          category: challengeData.category || [],
          function_name: challengeData.function_name || '',
          initial_code: challengeData.initial_code || '',
          skills: challengeData.skills || [],
          mentor: challengeData.mentor || '',
          trending: challengeData.trending || false,
          trending_priority: challengeData.trending_priority || null,
          test_cases: challengeData.challenge_test_cases || [],
          examples: challengeData.challenge_examples || [],
          constraints: challengeData.constraints || [],
          hints: challengeData.hints || []
        })
      }
    } catch (error) {
      toast.error('Erro ao carregar challenge')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const updateData = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      category: formData.category,
      function_name: formData.function_name,
      initial_code: formData.initial_code || "// Seu código aqui",
      skills: skills,
      mentor: formData.mentor || challenge?.mentor || 'default_mentor',
      trending: formData.trending,
      trending_priority: formData.trending_priority,
    }

    try {
      const result = await updateChallenge(challengeId, updateData)
      if (result) {
        toast.success('Challenge atualizada com sucesso!')
        router.push(role === 'admin' ? '/admin' : '/teacher')
      } else {
        toast.error('Erro ao atualizar challenge')
      }
    } catch (error) {
      toast.error('Erro ao atualizar challenge')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NotFoundState title="Challenge não encontrada" message="A challenge que você está procurando não existe ou foi removida." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Editar Challenge</h1>
              <p className="text-muted-foreground mt-2">
                Edite as informações da challenge "{challenge.title}"
              </p>
            </div>
            <Link href={role === 'admin' ? "/admin" : "/teacher"}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <ChallengeFormFields
              formData={formData}
              testCases={testCases}
              examples={examples}
              skills={skills}
              constraints={constraints}
              hints={hints}
              onInputChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onAddTestCase={addTestCase}
              onRemoveTestCase={removeTestCase}
              onAddExample={addExample}
              onRemoveExample={removeExample}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              onAddConstraint={addConstraint}
              onRemoveConstraint={removeConstraint}
              onAddHint={addHint}
              onRemoveHint={removeHint}
              disabled={!!isApproving}
              showAdminFields={isAdmin}
            />

            {/* Botões de Ação */}
            <div className="flex items-center justify-end gap-4 mt-8 p-6 bg-muted/30 border rounded-lg">
              <Link href={role === 'admin' ? "/admin" : "/teacher"}>
                <Button type="button" variant="outline" disabled={!!isApproving}>
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={!!isApproving}
                className="min-w-[150px]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isApproving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
