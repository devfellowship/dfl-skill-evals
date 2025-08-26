// Teste simples para verificar se o botão aparece
import { Button } from "@/components/atoms/Button/Button"
import { Users } from "lucide-react"

export function SimpleTest() {
  const handleClick = () => {
    alert("Botão clicado!")
    console.log("Botão clicado!")
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Teste Simples</h1>
      
      <div className="max-w-md mx-auto space-y-4">
        <Button 
          onClick={handleClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 font-bold text-xl shadow-lg border-2 border-purple-800 w-full"
        >
          <Users className="w-6 h-6 mr-3" />
          TESTE MENTORIA
        </Button>
        
        <Button 
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium text-lg w-full"
        >
          Botão Azul
        </Button>
        
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600">
            Se você conseguir ver estes botões, o problema não está nos componentes Button.
          </p>
        </div>
      </div>
    </div>
  )
}
