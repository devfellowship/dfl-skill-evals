import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/ui/badge'
import { Copy, Eye, EyeOff, Info } from 'lucide-react'
import { MOCK_EMAILS, MOCK_INSTRUCTIONS } from '@/lib/mock-data'

export function MockAuthInstructions() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  if (!showInstructions) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowInstructions(true)}
          variant="outline"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
        >
          <Info className="w-4 h-4 mr-2" />
          Dados Mock
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-gray-900 border-gray-700 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm">
              🔐 Dados Mock para Teste
            </CardTitle>
            <Button
              onClick={() => setShowInstructions(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-300 text-xs font-medium">Emails disponíveis:</p>
            {MOCK_EMAILS.map((user, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs font-mono">{user.email}</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  onClick={() => copyToClipboard(user.email)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-300 text-xs font-medium">Senha para todos:</p>
            <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <span className="text-white text-xs font-mono">Admin123</span>
              <Button
                onClick={() => copyToClipboard('Admin123')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {copied && (
            <div className="text-green-400 text-xs text-center">
              ✅ Copiado para a área de transferência!
            </div>
          )}

          <div className="text-xs text-gray-400 text-center">
            ⚠️ Apenas para desenvolvimento
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
