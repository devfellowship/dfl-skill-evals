import { useParams } from 'react-router-dom'
import { EditChallenge } from "@/components/organisms/EditChallenge/EditChallenge"

export default function EditChallengePage() {
  const { id } = useParams<{ id: string }>()

  return <EditChallenge challengeId={id || ''} />
}
