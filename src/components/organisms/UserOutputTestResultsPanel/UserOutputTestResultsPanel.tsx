"use client"
import { useState, useEffect } from "react"
import { Progress } from "@/components/atoms/Progress/Progress"
import { UserOutputTestResultCard } from "@/components/molecules/UserOutputTestResultCard/UserOutputTestResultCard"
import { 
  generateUserOutputTestCases, 
  combineUserAndSeedOutputs,
  UserOutputTestCase,
  UserOutputResult 
} from "@/lib/execution/user-output-processor"
interface UserOutputTestResultsPanelProps {
  results: any
  passedTests: number
  totalTests: number
  userCode: string
  functionName: string
  testCases: UserOutputTestCase[]
  languageId?: number
  showUserOutputs?: boolean // Flag para ativar/desativar outputs reais do usuário
  userOutputRatio?: number // Proporção de outputs reais vs seeds (0.0 a 1.0)
}
export function UserOutputTestResultsPanel({ 
  results, 
  passedTests, 
  totalTests, 
  userCode,
  functionName,
  testCases,
  languageId = 74,
  showUserOutputs = true,
  userOutputRatio = 0.5
}: UserOutputTestResultsPanelProps) {
  const [userOutputResults, setUserOutputResults] = useState<UserOutputResult[]>([])
  const [combinedResults, setCombinedResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (showUserOutputs && userCode && functionName && testCases.length > 0) {
      generateUserOutputs()
    } else {
      setCombinedResults(results?.details || [])
    }
  }, [userCode, functionName, testCases, showUserOutputs, userOutputRatio, results])
  const generateUserOutputs = async () => {
    setLoading(true)
    try {
      const userResults = await generateUserOutputTestCases(
        userCode,
        functionName,
        testCases,
        languageId
      )
      const combined = combineUserAndSeedOutputs(
        userResults,
        results?.details || [],
        userOutputRatio
      )
      setUserOutputResults(userResults)
      setCombinedResults(combined)
    } catch (error) {
      console.error('Erro ao gerar outputs do usuário:', error)
      setCombinedResults(results?.details || [])
    } finally {
      setLoading(false)
    }
  }
  const userOutputCount = combinedResults.filter(r => r.isUserOutput).length
  const seedOutputCount = combinedResults.filter(r => !r.isUserOutput).length
  return (
    <div className="w-[20%] border-l border-border/40 overflow-auto bg-background">
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Test Results</h3>
            <div className="text-xs text-muted-foreground">
              {passedTests}/{totalTests} passed
            </div>
          </div>
          <Progress value={(passedTests / totalTests) * 100} className="h-2" />
          {showUserOutputs && (
            <div className="mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {userOutputCount} outputs reais
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  {seedOutputCount} seeds
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Gerando outputs reais...
            </div>
          ) : combinedResults.length > 0 ? (
            <>
              {combinedResults.map((result: any, index: number) => (
                <UserOutputTestResultCard
                  key={index}
                  result={result}
                  index={index}
                  isHidden={index >= 3}
                />
              ))}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              Run your code to see test results
            </div>
          )}
        </div>
        {showUserOutputs && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-700">
              <div className="font-medium mb-1">💡 Outputs Reais do Usuário</div>
              <div className="text-blue-600">
                {userOutputRatio * 100}% dos outputs mostram o resultado real da execução do seu código.
                Os demais são seeds aleatórias para testes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}