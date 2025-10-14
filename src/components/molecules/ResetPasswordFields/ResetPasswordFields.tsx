import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, Send } from 'lucide-react'
interface ResetPasswordFieldsProps {
  email: string
  isLoading: boolean
  error?: string | null
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBackToLogin: () => void
}
export function ResetPasswordFields({
  email,
  isLoading,
  error,
  onEmailChange,
  onSubmit,
  onBackToLogin
}: ResetPasswordFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}
      {}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-200">
          Email
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-400 transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-12 h-14 border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 transition-all duration-200 rounded-xl text-lg"
            required
          />
        </div>
      </div>
      {}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span>Enviando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <span>Enviar Link de Recuperação</span>
            <Send className="w-5 h-5" />
          </div>
        )}
      </Button>
      {}
      <Button
        type="button"
        onClick={onBackToLogin}
        variant="outline"
        className="w-full h-12 border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 rounded-xl"
      >
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao Login</span>
        </div>
      </Button>
    </form>
  )
}