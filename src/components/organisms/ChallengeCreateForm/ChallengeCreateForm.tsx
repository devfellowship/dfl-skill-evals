"use client"
import { useRouter } from "next/navigation"
import { useChallengeOperations } from "@/hooks/useChallengeOperations"
import { useUserRole } from "@/hooks/useUserRole"
import { usePendingChallengeCreation } from "@/hooks/usePendingChallengeCreation"
import { useChallengeForm } from "@/hooks/challenge/useChallengeForm"
import { ChallengeFormFields } from "@/components/molecules/ChallengeFormFields/ChallengeFormFields"
import { Button } from "@/components/atoms/Button/Button"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function ChallengeCreateForm() {
  const router = useRouter()
  const { createChallenge, isDeleting } = useChallengeOperations()
  const { createPendingChallenge } = usePendingChallengeCreation()
  const { isAdmin } = useUserRole()
  
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
    validateForm
  } = useChallengeForm({
    initialData: {
      status: isAdmin ? "draft" : "to_approve"
    },
    mode: 'create'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (isAdmin) {
        const result = await createChallenge(formData)
        if (result) {
          toast.success("Challenge criada com sucesso!")
          router.push("/admin")
        }
      } else {
        const success = createPendingChallenge(formData)
        if (success) {
          toast.success("Challenge enviada para aprovação!")
          router.push("/teacher")
        } else {
          toast.error("Erro ao criar challenge pendente")
        }
      }
    } catch (error) {
      toast.error("Erro ao criar challenge")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Criar Novo Challenge</h1>
              <p className="text-muted-foreground mt-2">
                Preencha os dados para criar um novo challenge
              </p>
            </div>
            <Link href={isAdmin ? "/admin" : "/teacher"}>
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
              disabled={!!isDeleting}
              showAdminFields={isAdmin}
            />

            {/* Botões de Ação */}
            <div className="flex items-center justify-end gap-4 mt-8 p-6 bg-muted/30 border rounded-lg">
              <Link href={isAdmin ? "/admin" : "/teacher"}>
                <Button type="button" variant="outline" disabled={!!isDeleting}>
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={!!isDeleting}
                className="min-w-[150px]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isDeleting ? "Salvando..." : "Criar Challenge"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
