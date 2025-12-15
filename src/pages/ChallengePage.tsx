import { useParams } from 'react-router-dom'
import { UnifiedChallengePage } from "@/components/organisms/UnifiedChallengePage/UnifiedChallengePage"

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>()

  return <UnifiedChallengePage mode="challenge" challengeId={id || ''} />
}
