"use client"
import { useDashboardAdmin } from "@/hooks/useDashboardAdmin"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardTabs } from "./DashboardTabs"
import { DashboardModals } from "./DashboardModals"
import { DeleteChallengeWrapper, useDeleteChallenge } from "@/components/organisms/DeleteChallengeWrapper/DeleteChallengeWrapper"
const DashboardAdminContent = () => {
  const {
    published,
    pending,
    archived,
    deleted,
    pendingChallenges, 
    isInitialLoading,
    lastUpdate,
    broadcastWorking,
    comparisonModalOpen,
    challengeToCompare,
    searchQuery,
    isCreating,
    editingChallenge,
    activeTab,
    isDeleting,
    isApproving,
    isArchiving,
    isRestoring,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDeleteWithOptimistic,
    handleApproveWithOptimistic,
    handleRejectWithOptimistic,
    handleArchiveWithOptimistic,
    handleSendBackWithOptimistic,
    handleRestoreWithOptimistic,
    handlePermanentDeleteWithOptimistic,
    handleOpenComparison,
    handleCloseComparison,
    handleApproveFromComparison,
    handleRejectFromComparison,
    handleTitleSearch,
    handleUpdatePendingChallenge, 
    handleApprovePendingChallenge,
    handleRejectPendingChallenge,
    setIsCreating,
    setActiveTab
  } = useDashboardAdmin()
  const { openDeleteModal } = useDeleteChallenge()
  const handleDeleteClick = (id: string, title: string) => {
    openDeleteModal(id, title)
  }
  const handleDeleteForTabs = async (id: string) => {
    const challenge = [...published, ...pending, ...archived].find(c => c.id === id)
    if (challenge) {
      openDeleteModal(id, challenge.title)
    }
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DashboardHeader
        broadcastWorking={broadcastWorking}
        lastUpdate={lastUpdate as Date}
      />
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        published={published}
        pending={pending}
        pendingChallenges={pendingChallenges || []} 
        archived={archived}
        deleted={deleted}
        isInitialLoading={isInitialLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteForTabs}
        onApprove={handleApproveWithOptimistic}
        onReject={handleRejectWithOptimistic}
        onArchive={handleArchiveWithOptimistic}
        onSendBackForReview={handleSendBackWithOptimistic}
        onRestore={handleRestoreWithOptimistic}
        onPermanentDelete={handlePermanentDeleteWithOptimistic}
        onCompare={handleOpenComparison}
        onCreateNew={() => window.location.href = '/create'}
        onTitleSearch={handleTitleSearch}
        searchQuery={searchQuery}
        isDeleting={isDeleting as string | null}
        isApproving={isApproving as string | null}
        isArchiving={isArchiving as string | null}
        isRestoring={isRestoring as string | null}
        onUpdatePendingChallenge={handleUpdatePendingChallenge}
        onApprovePendingChallenge={handleApprovePendingChallenge} 
        onRejectPendingChallenge={handleRejectPendingChallenge} 
      />
      <DashboardModals
        comparisonModalOpen={comparisonModalOpen}
        challengeToCompare={challengeToCompare}
        onCloseComparison={handleCloseComparison}
        onApproveFromComparison={handleApproveFromComparison}
        onRejectFromComparison={handleRejectFromComparison}
      />
    </div>
  )
}
export function DashboardAdmin() {
  return (
    <DeleteChallengeWrapper>
      <DashboardAdminContent />
    </DeleteChallengeWrapper>
  )
}