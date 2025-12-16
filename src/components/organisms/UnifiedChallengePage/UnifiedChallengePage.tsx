import { ChallengePage } from "@/components/organisms/ChallengePage/ChallengePage"
import { PreChallengePage } from "@/components/organisms/PreChallengePage/PreChallengePage"
interface UnifiedChallengePageProps {
  mode: 'pre-challenge' | 'challenge'
  challengeId: string
}
export function UnifiedChallengePage({ mode, challengeId }: UnifiedChallengePageProps) {
  if (mode === 'pre-challenge') {
    return <PreChallengePage challengeId={challengeId} />
  }
  return <ChallengePage challengeId={challengeId} />
}