"use client"
import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { toast } from 'sonner'
import { useChallengeForm } from '@/hooks/challenge/useChallengeForm'
import { ChallengeFormFields } from '@/components/molecules/ChallengeFormFields/ChallengeFormFields'

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

interface EditChallengeOverlayProps {
  challenge: ChallengeData
  isOpen: boolean
  onClose: () => void
  onSave: (updatedChallenge: ChallengeData) => void
}

export function EditChallengeOverlay({ 
  challenge, 
  isOpen, 
  onClose, 
  onSave 
}: EditChallengeOverlayProps) {
  const [isLoading, setIsLoading] = useState(false)

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
  } = useChallengeForm({
    initialData: challenge,
    mode: 'edit'
  })

  useEffect(() => {
    if (isOpen && challenge) {
      loadFormData(challenge)
    }
  }, [isOpen, challenge, loadFormData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const updatedChallenge: ChallengeData = {
        id: challenge.id,
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        function_name: formData.function_name,
        initial_code: formData.initial_code || '',
        testCases: testCases,
        examples: examples,
        status: formData.status || challenge.status,
        mentor: formData.mentor || challenge.mentor || 'Usuário',
        createdAt: challenge.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await onSave(updatedChallenge)
      toast.success("Challenge atualizada com sucesso!")
      onClose()
    } catch (error) {
      toast.error("Erro ao salvar challenge")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-primary">Editar Challenge</h2>
            <p className="text-muted-foreground">Edite os detalhes da challenge pendente</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
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
            disabled={isLoading}
            showAdminFields={false}
            showExtraFields={false}
          />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/50 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            Garanta que antes de salvar a challenge, você editou corretamente.
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Challenge"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
