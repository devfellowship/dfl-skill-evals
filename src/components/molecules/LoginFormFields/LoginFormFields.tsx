import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
interface LoginFormFieldsProps {
  email: string
  password: string
  isLoading: boolean
  error?: string | null
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (e: React.FormEvent) => void
  onForgotPassword?: () => void
}
export function LoginFormFields({
  email,
  password,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword
}: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}
       <div className="space-y-2">
         <Label htmlFor="email" className="text-sm font-semibold text-gray-200">
           Email
         </Label>
         <div className="relative group">
           <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
           <Input
             id="email"
             type="email"
             placeholder="seu@email.com"
             value={email}
             onChange={(e) => onEmailChange(e.target.value)}
             className="pl-12 h-14 border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-200 rounded-xl text-lg"
             required
           />
         </div>
       </div>
       <div className="space-y-2">
         <Label htmlFor="password" className="text-sm font-semibold text-gray-200">
           Senha
         </Label>
         <div className="relative group">
           <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
           <Input
             id="password"
             type={showPassword ? 'text' : 'password'}
             placeholder="Sua senha"
             value={password}
             onChange={(e) => onPasswordChange(e.target.value)}
             className="pl-12 pr-12 h-14 border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-200 rounded-xl text-lg"
             required
           />
           <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
           >
             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
           </button>
         </div>
       </div>
       <div className="flex items-center justify-between">
         <label className="flex items-center space-x-3 cursor-pointer group">
           <input
             type="checkbox"
             className="w-5 h-5 text-blue-400 border-2 border-gray-500 rounded focus:ring-blue-400 focus:ring-2 transition-all"
           />
           <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
             Lembrar de mim
           </span>
         </label>
         <button
           type="button"
           onClick={onForgotPassword}
           className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
         >
           Esqueceu a senha?
         </button>
       </div>
       <Button
         type="submit"
         disabled={isLoading}
         className="w-full h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
       >
         {isLoading ? (
           <div className="flex items-center space-x-3">
             <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
             <span>Entrando...</span>
           </div>
         ) : (
           <div className="flex items-center space-x-3">
             <span>Entrar</span>
             <ArrowRight className="w-5 h-5" />
           </div>
         )}
       </Button>
    </form>
  )
}