// Arquivo de teste para verificar o Dashboard Admin
// Use este componente para testar se o botão de mentoria está visível

import { DashboardAdmin } from './DashboardAdmin'

export function TestDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Teste do Dashboard Admin
        </h2>
        <DashboardAdmin />
      </div>
    </div>
  )
}

// Para usar em uma página:
// import { TestDashboard } from '@/components/organisms/DashboardAdmin/test-dashboard'
// <TestDashboard />
