'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@devfellowship/components';
import { toast } from 'sonner'
import { ResetPasswordHeader } from '@/components/molecules/ResetPasswordHeader/ResetPasswordHeader'
import { ResetPasswordFields } from '@/components/molecules/ResetPasswordFields/ResetPasswordFields'
import { useAuth } from '@/hooks/useAuth'
export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { resetPassword } = useAuth()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { error: resetError } = await resetPassword(email)
      if (resetError) {
        setError('Erro ao enviar email de recuperação. Tente novamente.')
        toast.error('Erro ao enviar email de recuperação. Tente novamente.')
      } else {
        setIsEmailSent(true)
        toast.success('Email de recuperação enviado com sucesso!')
      }
    } catch (error) {
      setError('Erro ao enviar email de recuperação. Tente novamente.')
      toast.error('Erro ao enviar email de recuperação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }
  const handleBackToLogin = () => {
    router.push('/login')
  }
  const handleResendEmail = () => {
    setIsEmailSent(false)
    setEmail('')
    setError(null)
  }
  return (
    <div className="space-y-8">
      <ResetPasswordHeader />
      <Card className="border-0 shadow-2xl bg-gray-800/90 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          {isEmailSent ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Email Enviado!</h2>
                <p className="text-gray-300">
                  Enviamos um link de recuperação para <strong className="text-white">{email}</strong>
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleResendEmail}
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Enviar Novamente
                  </button>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Voltar ao Login
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ResetPasswordFields
              email={email}
              isLoading={isLoading}
              error={error}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
              onBackToLogin={handleBackToLogin}
            />
          )}
        </CardContent>
      </Card>
      <div className="text-center">
        <p className="text-sm text-gray-300">
          Lembrou da senha?{' '}
          <button 
            onClick={handleBackToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
          >
            Voltar ao login
          </button>
        </p>
      </div>
    </div>
  )
}
