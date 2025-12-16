import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useBasePath } from "@/contexts/BasePathContext"

import HomePage from "@/pages/HomePage"
import AdminPage from "@/pages/AdminPage"
import TeacherPage from "@/pages/TeacherPage"
import ProfilePage from "@/pages/ProfilePage"
import LoginPage from "@/pages/LoginPage"
import ResetPasswordPage from "@/pages/ResetPasswordPage"
import ChallengePage from "@/pages/ChallengePage"
import PreChallengePage from "@/pages/PreChallengePage"
import CreateChallengePage from "@/pages/CreateChallengePage"
import EditChallengePage from "@/pages/EditChallengePage"
import NotFoundPage from "@/pages/NotFoundPage"

export const AppRoutes: React.FC = () => {
  const { buildRoute } = useBasePath()
  return (
    <Routes>
      {/* Rotas relativas ao basePath do host (ex: /skill-evals/*) */}
      <Route index element={<HomePage />} />
      <Route path="admin/*" element={<AdminPage />} />
      <Route path="teacher/*" element={<TeacherPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="challenge/:id" element={<ChallengePage />} />
      <Route path="challenge/pre/:id" element={<PreChallengePage />} />
      <Route path="create" element={<CreateChallengePage />} />
      <Route path="edit/:id" element={<EditChallengePage />} />
      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={buildRoute("404")} replace />} />
    </Routes>
  )
}
