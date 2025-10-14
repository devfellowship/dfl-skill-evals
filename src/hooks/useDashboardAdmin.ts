import { useState } from "react"
import { AdminChallenge as Challenge, ChallengeFormData } from "@/types/admin/admin-dashboard"
import { useChallengesGlobal } from "@/hooks/useChallengesGlobal"
import { useChallengeOperations } from "@/hooks/useChallengeOperations"

export function useDashboardAdmin() {
  const { 
    published, 
    pending, 
    archived, 
    isInitialLoading, 
    lastUpdate,
    broadcastWorking,
    updateChallengeInList,
    removeChallengeFromList,
    loadAllChallenges
  } = useChallengesGlobal()

  const {
    isDeleting,
    isApproving,
    isArchiving,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    approveChallenge,
    rejectChallenge,
    archiveChallenge,
    sendBackForReview
  } = useChallengeOperations()

  const [comparisonModalOpen, setComparisonModalOpen] = useState(false)
  const [challengeToCompare, setChallengeToCompare] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [activeTab, setActiveTab] = useState<string>("challenges")

  const handleSubmit = async (formData: ChallengeFormData) => {
    if (editingChallenge) {
      const updateData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        function_name: formData.functionName,
        initial_code: formData.initialCode || "// Seu código aqui",
        test_cases: formData.testCases || [],
        status: formData.status,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      
      updateChallengeInList(editingChallenge.id, {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        status: formData.status
      })
      
      const result = await updateChallenge(editingChallenge.id, updateData)
      
      if (!result) {
        loadAllChallenges()
      }
    } else {
      const createData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        function_name: formData.functionName,
        initial_code: formData.initialCode || "// Seu código aqui",
        test_cases: formData.testCases || []
      }
      await createChallenge(createData)
    }
    
    setIsCreating(false)
    setEditingChallenge(null)
  }

  const handleEdit = (challenge: Challenge) => {
    window.location.href = `/edit/${challenge.id}`
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingChallenge(null)
  }

  const handleDeleteWithOptimistic = async (id: string) => {
    removeChallengeFromList(id)
    const result = await deleteChallenge(id)
    if (!result) {
      loadAllChallenges()
    }
  }

  const handleApproveWithOptimistic = async (id: string) => {
    updateChallengeInList(id, { status: 'published' as any })
    const result = await approveChallenge(id)
    if (!result) {
      loadAllChallenges()
    }
  }

  const handleRejectWithOptimistic = async (id: string) => {
    updateChallengeInList(id, { status: 'draft' as any })
    const reason = prompt("Motivo da rejeição (opcional):")
    const result = await rejectChallenge(id)
    if (!result) {
      loadAllChallenges()
    }
  }

  const handleArchiveWithOptimistic = async (id: string) => {
    updateChallengeInList(id, { status: 'archived' as any })
    const result = await archiveChallenge(id)
    if (!result) {
      loadAllChallenges()
    }
  }

  const handleSendBackWithOptimistic = async (id: string) => {
    updateChallengeInList(id, { status: 'draft' as any })
    const result = await sendBackForReview(id)
    if (!result) {
      loadAllChallenges()
    }
  }

  const handleOpenComparison = (challengeId: string) => {
    setChallengeToCompare(challengeId)
    setComparisonModalOpen(true)
  }

  const handleCloseComparison = () => {
    setComparisonModalOpen(false)
    setChallengeToCompare(null)
  }

  const handleApproveFromComparison = async () => {
    if (challengeToCompare) {
      try {
        await approveChallenge(challengeToCompare)
        handleCloseComparison()
      } catch (error) {
        }
    }
  }

  const handleRejectFromComparison = async () => {
    if (challengeToCompare) {
      try {
        await rejectChallenge(challengeToCompare)
        handleCloseComparison()
      } catch (error) {
        }
    }
  }

  const handleTitleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return {
    published,
    pending,
    archived,
    isInitialLoading,
    lastUpdate: lastUpdate as Date,
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
  }
}
