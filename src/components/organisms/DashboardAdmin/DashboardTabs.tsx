import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, TestTube, CheckCircle, Archive } from "lucide-react"
import { ChallengeList } from "./ChallengeList"
import { PendingApprovalsList } from "./PendingApprovalsList"
import { ArchivedChallengesList } from "./ArchivedChallengesList"
import { AdminChallenge as Challenge, ChallengeFormData } from "@/types/admin/admin-dashboard"

interface DashboardTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  published: Challenge[]
  pending: Challenge[]
  archived: Challenge[]
  isInitialLoading: boolean
  onEdit: (challenge: Challenge) => void
  onDelete: (id: string) => Promise<void>
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onArchive: (id: string) => Promise<void>
  onSendBackForReview: (id: string) => Promise<void>
  onCompare: (id: string) => void
  onCreateNew: () => void
  searchQuery: string
  isDeleting: string | null
  isApproving: string | null
  isArchiving: string | null
}

export function DashboardTabs({
  activeTab,
  onTabChange,
  published,
  pending,
  archived,
  isInitialLoading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onArchive,
  onSendBackForReview,
  onCompare,
  onCreateNew,
  searchQuery,
  isDeleting,
  isApproving,
  isArchiving
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="challenges" value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="challenges" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Challenges
        </TabsTrigger>
        <TabsTrigger value="approvals" className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Aprovações
        </TabsTrigger>
        <TabsTrigger value="archived" className="flex items-center gap-2">
          <Archive className="w-4 h-4" />
          Arquivados
        </TabsTrigger>
      </TabsList>

      <TabsContent value="challenges" className="space-y-6">
        <ChallengeList
          challenges={published}
          isInitialLoading={isInitialLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onSendBackForReview={onSendBackForReview}
          onArchive={onArchive}
          isDeleting={isDeleting}
          isArchiving={isArchiving}
          onCreateNew={onCreateNew}
          searchQuery={searchQuery}
        />
      </TabsContent>

      <TabsContent value="approvals" className="space-y-6">
        <PendingApprovalsList
          challenges={pending}
          isInitialLoading={isInitialLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onReject={onReject}
          onArchive={onArchive}
          onCompare={onCompare}
          isDeleting={isDeleting}
          isApproving={isApproving}
          isArchiving={isArchiving}
          searchQuery={searchQuery}
        />
      </TabsContent>

      <TabsContent value="archived" className="space-y-6">
        <ArchivedChallengesList
          challenges={archived}
          isInitialLoading={isInitialLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onSendBackForReview={onSendBackForReview}
          isDeleting={isDeleting}
          isApproving={isApproving}
        />
      </TabsContent>
    </Tabs>
  )
}
