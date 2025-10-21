"use client"

import { UserOutputChallengePage } from "@/components/organisms/UserOutputChallengePage/UserOutputChallengePage"

export default function TestUserOutputPage() {
  const testChallengeId = "test-challenge"
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h1 className="text-lg font-semibold text-blue-800 mb-2">
            🧪 Teste: Outputs Reais do Usuário
          </h1>
          <p className="text-blue-700 text-sm">
            Esta é uma versão de teste que mostra outputs reais da execução do seu código 
            em vez de apenas seeds aleatórias. 
            <br />
            <strong>50% dos outputs mostram o resultado real do seu código, 50% são seeds para testes.</strong>
          </p>
        </div>
        
        <UserOutputChallengePage 
          challengeId={testChallengeId}
          showUserOutputs={true}
          userOutputRatio={0.5} // 50% outputs reais, 50% seeds
        />
      </div>
    </div>
  )
}

