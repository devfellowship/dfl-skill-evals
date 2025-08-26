// Exemplo de uso do DashboardAdmin
// Este arquivo demonstra como integrar o dashboard em uma página

import { DashboardAdmin } from './DashboardAdmin'

// Exemplo 1: Uso básico
export function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardAdmin />
    </div>
  )
}

// Exemplo 2: Com layout personalizado
export function AdminPageWithLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header personalizado */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DevShaper Admin</h1>
              <p className="text-sm text-gray-500">Painel de controle da plataforma</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin</span>
              <button className="text-sm text-red-600 hover:text-red-800">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main>
        <DashboardAdmin />
      </main>
    </div>
  )
}

// Exemplo 3: Com controle de acesso
export function ProtectedAdminPage() {
  const isAdmin = true // Simular verificação de admin
  const isLoading = false // Simular estado de carregamento

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return <DashboardAdmin />
}

// Exemplo 4: Com contexto de dados
export function AdminPageWithContext() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar de navegação */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md">
                Dashboard
              </a>
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                Usuários
              </a>
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                Relatórios
              </a>
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                Configurações
              </a>
            </div>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1">
          <DashboardAdmin />
        </main>
      </div>
    </div>
  )
}

// Exemplo 5: Com breadcrumbs
export function AdminPageWithBreadcrumbs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Home
            </a>
            <span className="text-gray-400">/</span>
            <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
              Admin
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-900">
              Dashboard
            </span>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <DashboardAdmin />
    </div>
  )
}
