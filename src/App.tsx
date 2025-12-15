import { Routes, Route } from 'react-router-dom'
import { AuthGuardProvider } from '@/providers/AuthGuard'
import { ConditionalFooter } from '@/components/organisms/Footer/ConditionalFooter'

import HomePage from '@/pages/HomePage'
import AdminPage from '@/pages/AdminPage'
import TeacherPage from '@/pages/TeacherPage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ChallengePage from '@/pages/ChallengePage'
import PreChallengePage from '@/pages/PreChallengePage'
import CreateChallengePage from '@/pages/CreateChallengePage'
import EditChallengePage from '@/pages/EditChallengePage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <AuthGuardProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/teacher/*" element={<TeacherPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/challenge/pre/:id" element={<PreChallengePage />} />
            <Route path="/create" element={<CreateChallengePage />} />
            <Route path="/edit/:id" element={<EditChallengePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <ConditionalFooter />
      </div>
    </AuthGuardProvider>
  )
}
