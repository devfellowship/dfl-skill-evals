"use client"

import { useDashboardAdmin } from "@/hooks/useDashboardAdmin"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardTabs } from "./DashboardTabs"
import { DashboardModals } from "./DashboardModals"
import { DeleteChallengeWrapper, useDeleteChallenge } from "@/components/organisms/DeleteChallengeWrapper/DeleteChallengeWrapper"

// Componente interno que usa o hook de exclusão
const DashboardAdminContent = () => {
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

  const { openDeleteModal } = useDeleteChallenge()

  // Wrapper para o handleDelete que abre o modal
  const handleDeleteClick = (id: string, title: string) => {
    openDeleteModal(id, title)
  }

  // Wrapper que converte a assinatura para o DashboardTabs
  const handleDeleteForTabs = async (id: string) => {
    // Buscar o título da challenge para mostrar no modal
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
        searchQuery={searchQuery}
        onSearch={handleTitleSearch}
      />

      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        published={published}
        pending={pending}
        archived={archived}
        isInitialLoading={isInitialLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteForTabs}
        onApprove={handleApproveWithOptimistic}
        onReject={handleRejectWithOptimistic}
        onArchive={handleArchiveWithOptimistic}
        onSendBackForReview={handleSendBackWithOptimistic}
        onCompare={handleOpenComparison}
        onCreateNew={() => window.location.href = '/create'}
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

// Componente principal com wrapper
export function DashboardAdmin() {
  return (
    <DeleteChallengeWrapper>
      <DashboardAdminContent />
    </DeleteChallengeWrapper>
  )
}