import { Card, CardContent } from "@devfellowship/components";interface ChallengeRightSidebarProps {
  problem: any
}
export function ChallengeRightSidebar({ problem }: ChallengeRightSidebarProps) {
  return (
    <div className="space-y-6">
      {}
      {problem.examples && problem.examples.length > 0 && (
        <Card className="bg-gray-900 text-white border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Exemplos</h3>
            <div className="space-y-4">
              {problem.examples.map((example: any, index: number) => (
                <div key={index} className="bg-gray-800 p-3 rounded border border-gray-600">
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Input:</span>
                    <div className="font-mono text-green-400 mt-1">{example.input}</div>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Output:</span>
                    <div className="font-mono text-blue-400 mt-1">{example.output}</div>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="text-gray-400 text-sm">Explicação:</span>
                      <div className="text-gray-300 mt-1 text-sm">{example.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {}
      {problem.hints && problem.hints.length > 0 && (
        <Card className="bg-gray-900 text-white border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-white">💡 Dicas</h3>
            <div className="space-y-3">
              {problem.hints.map((hint: string, index: number) => (
                <div key={index} className="bg-yellow-900/20 border border-yellow-700/30 p-3 rounded">
                  <div className="text-yellow-200 text-sm">
                    <span className="font-medium text-yellow-300">Dica {index + 1}:</span> {hint}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {}
      <Card className="bg-gray-900 text-white border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-4 text-white">📋 Detalhes</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Dificuldade:</span>
              <span className="text-white">{problem.difficulty === 1 ? 'Fácil' : problem.difficulty === 2 ? 'Médio' : 'Difícil'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Função:</span>
              <span className="text-white font-mono">{problem.functionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Testes:</span>
              <span className="text-white">{problem.testCases?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
