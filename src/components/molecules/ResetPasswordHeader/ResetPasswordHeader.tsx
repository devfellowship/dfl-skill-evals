import { KeyRound } from 'lucide-react'

export function ResetPasswordHeader() {
  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="p-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl blur opacity-30 -z-10"></div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Recuperar Senha
          </h1>
          <p className="text-lg text-gray-300 font-medium">DevShapper</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Esqueceu sua senha?
        </h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>
    </div>
  )
}
