import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, TestTube, CheckCircle, Archive, Trash2, Search } from "lucide-react"
import { Input } from "@/components/atoms/Input/Input"
import { ChallengeList } from "./ChallengeList"
import { PendingApprovalsList } from "./PendingApprovalsList"
import { ArchivedChallengesList } from "./ArchivedChallengesList"
import { DeletedChallengesList } from "./DeletedChallengesList"
import { AdminChallenge as Challenge, ChallengeFormData } from "@/types/admin/admin-dashboard"
import { NotificationBadge } from "@/components/atoms/NotificationBadge/NotificationBadge"

interface DashboardTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  published: Challenge[]
  pending: Challenge[]
  archived: Challenge[]
  deleted: Challenge[]
  isInitialLoading: boolean
  onEdit: (challenge: Challenge) => void
  onDelete: (id: string) => Promise<void>
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onArchive: (id: string) => Promise<void>
  onSendBackForReview: (id: string) => Promise<void>
  onRestore: (id: string) => Promise<void>
  onPermanentDelete: (id: string) => Promise<void>
  onCompare: (id: string) => void
  onCreateNew: () => void
  onTitleSearch: (query: string) => void
  searchQuery: string
  isDeleting: string | null
  isApproving: string | null
  isArchiving: string | null
  isRestoring: string | null
}

export function DashboardTabs({
  activeTab,
  onTabChange,
  published,
  pending,
  archived,
  deleted,
  isInitialLoading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onArchive,
  onSendBackForReview,
  onRestore,
  onPermanentDelete,
  onCompare,
  onCreateNew,
  onTitleSearch,
  searchQuery,
  isDeleting,
  isApproving,
  isArchiving,
  isRestoring
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="challenges" value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="challenges" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Challenges
        </TabsTrigger>
        <TabsTrigger value="approvals" className="flex items-center gap-2 relative">
          <CheckCircle className="w-4 h-4" />
          Aprovações
          {pending.length > 0 && (
            <NotificationBadge 
              count={pending.length} 
              variant="error"
            />
          )}
        </TabsTrigger>
        <TabsTrigger value="archived" className="flex items-center gap-2">
          <Archive className="w-4 h-4" />
          Arquivados
        </TabsTrigger>
        <TabsTrigger value="deleted" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Deletados
        </TabsTrigger>
      </TabsList>

      <TabsContent value="challenges" className="space-y-6">
        {/* Barra de busca para Challenges */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar challenges..."
            value={searchQuery}
            onChange={(e) => onTitleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
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

      <TabsContent value="deleted" className="space-y-6">
        <DeletedChallengesList
          challenges={deleted}
          isInitialLoading={isInitialLoading}
          onRestore={onRestore}
          onDelete={onDelete}
          onPermanentDelete={onPermanentDelete}
          isRestoring={isRestoring}
          isDeleting={isDeleting}
          searchQuery={searchQuery}
        />
      </TabsContent>
    </Tabs>
  )
}
