// Teste direto do Judge0
async function testJudge0Direct() {
  console.log('🧪 Testando Judge0 diretamente...\n')
  
  try {
    // Teste 1: Verificar se está respondendo
    console.log('📡 Testando conectividade...')
    const languagesResponse = await fetch('http://localhost:2358/languages')
    if (!languagesResponse.ok) {
      throw new Error(`HTTP ${languagesResponse.status}: ${languagesResponse.statusText}`)
    }
    const languages = await languagesResponse.json()
    console.log(`✅ Judge0 está respondendo! ${languages.length} linguagens disponíveis`)
    
    // Teste 2: Executar código simples
    console.log('\n📝 Testando execução de código...')
    const testCode = 'console.log("Hello World");'
    const submissionResponse = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: testCode,
        language_id: 63, // JavaScript
      }),
    })
    
    if (!submissionResponse.ok) {
      throw new Error(`HTTP ${submissionResponse.status}: ${submissionResponse.statusText}`)
    }
    
    const result = await submissionResponse.json()
    console.log('📊 Resultado:', JSON.stringify(result, null, 2))
    
    if (result.status?.id === 3) {
      console.log('✅ Código executado com sucesso!')
      console.log(`📤 Output: ${result.stdout}`)
    } else {
      console.log(`❌ Erro na execução: ${result.status?.description}`)
      console.log(`🔧 Compile output: ${result.compile_output}`)
      console.log(`⚠️  Stderr: ${result.stderr}`)
      console.log(`💬 Message: ${result.message}`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

// Teste específico do Two Sum
async function testTwoSumDirect() {
  console.log('\n🧪 Testando Two Sum diretamente...\n')
  
  try {
    const twoSumCode = `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

console.log(JSON.stringify(twoSum([2,7,11,15], 9)));`
    
    console.log('📝 Enviando código Two Sum...')
    const submissionResponse = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: twoSumCode,
        language_id: 63, // JavaScript
      }),
    })
    
    if (!submissionResponse.ok) {
      throw new Error(`HTTP ${submissionResponse.status}: ${submissionResponse.statusText}`)
    }
    
    const result = await submissionResponse.json()
    console.log('📊 Resultado Two Sum:', JSON.stringify(result, null, 2))
    
    if (result.status?.id === 3) {
      console.log('✅ Two Sum executado com sucesso!')
      console.log(`📤 Output: ${result.stdout}`)
      console.log(`⏱️  Time: ${result.time}ms`)
      console.log(`💾 Memory: ${result.memory}KB`)
    } else {
      console.log(`❌ Erro na execução: ${result.status?.description}`)
      console.log(`🔧 Compile output: ${result.compile_output}`)
      console.log(`⚠️  Stderr: ${result.stderr}`)
      console.log(`💬 Message: ${result.message}`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

// Executar testes
testJudge0Direct().then(() => {
  testTwoSumDirect()
})