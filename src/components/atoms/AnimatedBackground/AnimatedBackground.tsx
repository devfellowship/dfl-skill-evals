export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-600 via-red-700 to-orange-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-600 via-teal-700 to-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-3000"></div>
      
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-purple-400 rounded-full animate-float animation-delay-1000 opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-2000 opacity-40"></div>
      <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-indigo-400 rounded-full animate-float animation-delay-3000 opacity-40"></div>
      <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-teal-400 rounded-full animate-float animation-delay-4000 opacity-40"></div>
      <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-orange-400 rounded-full animate-float animation-delay-5000 opacity-40"></div>
      
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
    </div>
  )
}
