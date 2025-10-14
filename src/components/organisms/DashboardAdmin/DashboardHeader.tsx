import { DashboardHeaderButtons } from "@/components/atoms/DashboardHeaderButtons/DashboardHeaderButtons"
import { ConnectionStatus } from "@/components/atoms/ConnectionStatus/ConnectionStatus"

interface DashboardHeaderProps {
  broadcastWorking: boolean
  lastUpdate: Date
  isSubmitting?: boolean
}

export function DashboardHeader({
  broadcastWorking,
  lastUpdate,
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
        <DashboardHeaderButtons
          createButtonHref="/create"
          createButtonText="Novo Desafio"
          isSubmitting={isSubmitting}
          showHomeButton={true}
          homeButtonText="Inicio"
        />
      </div>
    </div>
  )
}
