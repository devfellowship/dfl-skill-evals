import { Button } from "@/components/atoms/Button/Button"
import { Link } from 'react-router-dom'
import { useBasePath } from "@/contexts/BasePathContext"
interface PreChallengeActionsProps {
  challengeId: string
  systemChecks: {
    browser: boolean
    internet: boolean
  }
}
export function PreChallengeActions({ challengeId, systemChecks }: PreChallengeActionsProps) {
  const { buildRoute } = useBasePath()
  const isSystemReady = systemChecks.browser && systemChecks.internet
  return (
    <div className="flex gap-4">
      <Button variant="outline" asChild className="flex-1 bg-transparent">
        <Link to={buildRoute("/")}>Cancel</Link>
      </Button>
      <Button
        asChild
        className="flex-1"
        disabled={!isSystemReady}
      >
        <Link to={buildRoute(`/challenge/${challengeId}`)}>Begin Assessment</Link>
      </Button>
    </div>
  )
}