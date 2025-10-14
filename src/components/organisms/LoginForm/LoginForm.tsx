'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { LoginHeader } from '@/components/molecules/LoginHeader/LoginHeader'
import { LoginFormFields } from '@/components/molecules/LoginFormFields/LoginFormFields'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signIn } = useAuth()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { error: authError } = await signIn(email, password)
      if (authError) {
        if (authError.message.includes('Invalid login credentials') || 
            authError.message.includes('Email not confirmed') ||
            authError.message.includes('Invalid email or password') ||
            authError.message.includes('Email não encontrado nos dados mock') ||
            authError.message.includes('Senha incorreta')) {
          setError('Email ou senha incorretos')
          toast.error('Email ou senha incorretos')
        } else {
          setError('Erro ao fazer login. Tente novamente.')
          toast.error('Erro ao fazer login. Tente novamente.')
        }
      } else {
        toast.success('Login realizado com sucesso!')
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const isAdmin = false
          if (isAdmin) {
            router.push('/admin')
          } else {
            router.push('/')
          }
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.')
      toast.error('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }
  const handleForgotPassword = () => {
    router.push('/reset-password')
  }
  return (
    <div className="space-y-8">
      <LoginHeader />
      <Card className="border-0 shadow-2xl bg-gray-800/90 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <LoginFormFields
            email={email}
            password={password}
            isLoading={isLoading}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
          />
        </CardContent>
      </Card>
      <div className="text-center">
        <p className="text-gray-300">
          Não tem uma conta?{' '}
          <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline">
            Entre em contato conosco
          </button>
        </p>
      </div>
    </div>
  )
}