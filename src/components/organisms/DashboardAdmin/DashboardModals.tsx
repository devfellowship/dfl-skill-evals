import { ChallengeComparisonModal } from "@/components/molecules/ChallengeComparisonModal/ChallengeComparisonModal"
interface DashboardModalsProps {
  comparisonModalOpen: boolean
  challengeToCompare: string | null
  onCloseComparison: () => void
  onApproveFromComparison: () => Promise<void>
  onRejectFromComparison: () => Promise<void>
}
export function DashboardModals({
  comparisonModalOpen,
  challengeToCompare,
  onCloseComparison,
  onApproveFromComparison,
  onRejectFromComparison
}: DashboardModalsProps) {
  if (!challengeToCompare) return null
  return (
    <ChallengeComparisonModal
      isOpen={comparisonModalOpen}
      onClose={onCloseComparison}
      challengeId={challengeToCompare}
      onApprove={onApproveFromComparison}
      onReject={onRejectFromComparison}
    />
  )
}