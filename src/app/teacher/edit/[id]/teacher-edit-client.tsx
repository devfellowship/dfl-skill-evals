"use client"
import { useParams } from "next/navigation"
import { EditChallenge } from "@/components/organisms/EditChallenge/EditChallenge"
import { useUserRole } from "@/hooks/useUserRole"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
export default function TeacherEditClient() {
  const params = useParams()
  const { isLoading, isAdmin, isMentor } = useUserRole()
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
  return <EditChallenge challengeId={params.id as string} />
}
