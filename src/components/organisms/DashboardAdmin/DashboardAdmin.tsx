"use client"

import { useDashboardAdmin } from "@/hooks/useDashboardAdmin"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardTabs } from "./DashboardTabs"
import { DashboardModals } from "./DashboardModals"

export function DashboardAdmin() {
  const {
    published,
    pending,
    archived,
    isInitialLoading,
    lastUpdate,
    broadcastWorking,
    comparisonModalOpen,
    challengeToCompare,
    searchQuery,
    isCreating,
    editingChallenge,
    activeTab,
    isSubmitting,
    isDeleting,
    isApproving,
    isArchiving,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDeleteWithOptimistic,
    handleApproveWithOptimistic,
    handleRejectWithOptimistic,
    handleArchiveWithOptimistic,
    handleSendBackWithOptimistic,
    handleOpenComparison,
    handleCloseComparison,
    handleApproveFromComparison,
    handleRejectFromComparison,
    handleTitleSearch,
    setIsCreating,
    setActiveTab
  } = useDashboardAdmin()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DashboardHeader
        broadcastWorking={broadcastWorking}
        lastUpdate={lastUpdate as Date}
        searchQuery={searchQuery}
        onSearch={handleTitleSearch}
        onCreateClick={() => setIsCreating(true)}
        isSubmitting={isSubmitting}
      />

      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCreating={isCreating}
        editingChallenge={editingChallenge}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        published={published}
        pending={pending}
        archived={archived}
        isInitialLoading={isInitialLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteWithOptimistic}
        onApprove={handleApproveWithOptimistic}
        onReject={handleRejectWithOptimistic}
        onArchive={handleArchiveWithOptimistic}
        onSendBackForReview={handleSendBackWithOptimistic}
        onCompare={handleOpenComparison}
        onCreateNew={() => setIsCreating(true)}
        searchQuery={searchQuery}
        isDeleting={isDeleting as string | null}
        isApproving={isApproving as string | null}
        isArchiving={isArchiving as string | null}
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