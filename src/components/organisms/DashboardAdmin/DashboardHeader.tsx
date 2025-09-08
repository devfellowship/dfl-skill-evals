import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"
import { DashboardHeaderButtons } from "@/components/atoms/DashboardHeaderButtons/DashboardHeaderButtons"
import { ConnectionStatus } from "@/components/atoms/ConnectionStatus/ConnectionStatus"

interface DashboardHeaderProps {
  broadcastWorking: boolean
  lastUpdate: Date
  searchQuery: string
  onSearch: (query: string) => void
  onCreateClick: () => void
  isSubmitting: boolean
}

export function DashboardHeader({
  broadcastWorking,
  lastUpdate,
  searchQuery,
  onSearch,
  onCreateClick,
  isSubmitting
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard Admin</h1>
        <p className="text-gray-500">Gerencie challenges e aprovações</p>
        <ConnectionStatus isConnected={broadcastWorking} lastUpdate={lastUpdate} />
      </div>
      <div className="flex items-center gap-3">
        <SearchButton 
          onSearch={onSearch}
          placeholder="Pesquisar challenges por título..."
          currentQuery={searchQuery}
        />
        <DashboardHeaderButtons
          onCreateClick={onCreateClick}
          createButtonText="Novo Desafio"
          isSubmitting={isSubmitting}
          showHomeButton={true}
          homeButtonText="Inicio"
        />
      </div>
    </div>
  )
}
