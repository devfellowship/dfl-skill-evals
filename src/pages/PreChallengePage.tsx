import { useParams } from 'react-router-dom'
import { UnifiedChallengePage } from "@/components/organisms/UnifiedChallengePage/UnifiedChallengePage"

export default function PreChallengePage() {
  const { id } = useParams<{ id: string }>()

  return <UnifiedChallengePage mode="pre-challenge" challengeId={id || ''} />
}
