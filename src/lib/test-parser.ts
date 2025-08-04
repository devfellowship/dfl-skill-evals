// Teste do parser de input
function parseTestCaseInput(input: string): any[] {
  try {
    const cleanInput = input.trim()
    
    // Para o caso específico do Two Sum: "[2,7,11,15], 9"
    // Precisamos dividir por vírgula fora dos colchetes
    const parts = []
    let current = ''
    let depth = 0
    let inString = false
    
    for (let i = 0; i < cleanInput.length; i++) {
      const char = cleanInput[i]
      
      if (char === '"' && (i === 0 || cleanInput[i-1] !== '\\')) {
        inString = !inString
      }
      
      if (!inString) {
        if (char === '[' || char === '{') depth++
        if (char === ']' || char === '}') depth--
        
        if (char === ',' && depth === 0) {
          parts.push(current.trim())
          current = ''
          continue
        }
      }
      
      current += char
    }
    
    if (current.trim()) {
      parts.push(current.trim())
    }
    
    // Parsear cada parte
    const result = parts.map(part => {
      try {
        return JSON.parse(part)
      } catch (error) {
        // Se não conseguir fazer parse como JSON, tratar como string
        return part.replace(/^"|"$/g, '') // Remove aspas se existirem
      }
    })
    
    return result
  } catch (error) {
    console.log('Error parsing input:', input, error)
    throw new Error(`Failed to parse test case input: ${input}`)
  }
}

// Testes
function testParser() {
  console.log('🧪 Testando parser de input...\n')
  
  const testCases = [
    '"[2,7,11,15], 9"',
    '"[3,2,4], 6"',
    '"[3,3], 6"',
    '"[1,2,3,4,5], 8"',
    '"[1,2,3]"',
    '"hello"',
    '123'
  ]
  
  testCases.forEach((input, index) => {
    try {
      const result = parseTestCaseInput(input)
      console.log(`✅ Teste ${index + 1}: "${input}" → ${JSON.stringify(result)}`)
    } catch (error) {
      console.log(`❌ Teste ${index + 1}: "${input}" → ERRO: ${error.message}`)
    }
  })
  
  console.log('\n🧪 Testando com inputs reais dos casos de teste...\n')
  
  const realTestCases = [
    '[2,7,11,15], 9',
    '[3,2,4], 6',
    '[3,3], 6',
    '[1,2,3,4,5], 8',
    '[-1,-2,-3,-4,-5], -8'
  ]
  
  realTestCases.forEach((input, index) => {
    try {
      const result = parseTestCaseInput(input)
      console.log(`✅ Teste Real ${index + 1}: "${input}" → ${JSON.stringify(result)}`)
    } catch (error) {
      console.log(`❌ Teste Real ${index + 1}: "${input}" → ERRO: ${error.message}`)
    }
  })
}

// Executar teste
testParser()