"use client"
import { useParams } from "next/navigation"
import { EditChallenge } from "@/components/organisms/EditChallenge/EditChallenge"
import { useUserRole } from "@/hooks/useUserRole"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
export default function EditChallengeClient() {
  const params = useParams()
  const id = params.id as string
  const { role, isLoading, isAdmin, isMentor } = useUserRole()
  if (isLoading) {
    return <LoadingState message="Verificando permissões..." />
  }
  if (!isAdmin && !isMentor) {
    return (
      <NotFoundState
        title="Acesso Negado"
        message="Você precisa ser um administrador ou mentor para editar challenges."
      />
    )
  }
  return <EditChallenge challengeId={id} />
}
