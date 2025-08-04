// Teste de conectividade com Judge0
export async function testJudge0Connection(userCode?: string, functionName?: string, testInput?: string) {
  console.log('🔍 Testando conectividade com Judge0...')
  
  try {
    // Teste 1: Verificar se o servidor está respondendo
    const response = await fetch('http://localhost:2358/languages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('❌ Judge0 não está respondendo:', response.status, response.statusText)
      return false
    }
    
    const languages = await response.json()
    console.log('✅ Judge0 está funcionando! Linguagens disponíveis:', languages.length)
    
    // Teste 2: Executar código real se fornecido, senão usar teste simples
    let testCode: string
    let languageId: number = 63 // JavaScript padrão
    
    if (userCode && functionName && testInput) {
      // Usar código real do usuário
      testCode = `${userCode}\nconsole.log(JSON.stringify(${functionName}(${testInput})));`
      console.log('🧪 Usando código real do usuário para teste')
    } else {
      // Usar código de teste simples
      testCode = 'console.log("Hello World");'
      console.log('🧪 Usando código de teste simples')
    }
    
    const testResponse = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: testCode,
        language_id: languageId,
      }),
    })
    
    if (!testResponse.ok) {
      console.error('❌ Erro ao executar código de teste:', testResponse.status)
      return false
    }
    
    const result = await testResponse.json()
    console.log('✅ Execução de teste bem-sucedida:', result)
    
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar com Judge0:', error)
    return false
  }
}

// Função para verificar se o Docker está rodando
export async function checkDockerStatus() {
  try {
    // Tentar fazer uma requisição para verificar se o Docker está rodando
    const response = await fetch('http://localhost:2358/about', {
      method: 'GET',
    })
    
    return response.ok
  } catch (error) {
    console.error('❌ Docker não está rodando ou Judge0 não está disponível')
    return false
  }
}