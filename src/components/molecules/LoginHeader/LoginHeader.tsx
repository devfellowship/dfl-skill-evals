import { Code } from 'lucide-react'

export function LoginHeader() {
  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Code className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-30 -z-10"></div>
        </div>
        
                 <div className="space-y-2">
           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
             DevShapper
           </h1>
           <p className="text-lg text-gray-300 font-medium">Challenge Platform</p>
         </div>
       </div>

       <div className="space-y-2">
         <p className="text-gray-300 max-w-md mx-auto">
           Faça login para acessar sua conta para se desafiar com os desafios de programação.
         </p>
       </div>
    </div>
  )
}
