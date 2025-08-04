import { executeCode, listAvailableLanguages, testJudge0Connection } from './src/lib/judge0-config'
import { JUDGE0_LANGUAGES } from './src/types/execution'
import type { TestCase } from './src/types/execution'

async function testJudge0() {
  console.log('🧪 Testando integração Judge0...\n')
  
  // Teste 1: Verificar conexão
  console.log('📡 Verificando conexão com Judge0...')
  const isConnected = await testJudge0Connection()
  if (!isConnected) {
    console.log('❌ Não foi possível conectar com Judge0')
    console.log('   Verifique se os containers estão rodando: docker-compose ps')
    return
  }
  console.log('✅ Conexão estabelecida!')
  
  // Teste 2: Listar linguagens
  console.log('\n📋 Listando linguagens disponíveis...')
  const languages = await listAvailableLanguages()
  
  // Teste 3: JavaScript simples
  const testCases: TestCase[] = [
    {
      input: '2 3',
      expectedOutput: '5',
      description: 'Soma simples'
    }
  ]
  
  const jsCode = `
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.on('line', (input) => {
      const [a, b] = input.split(' ').map(Number);
      console.log(a + b);
      rl.close();
    });
  `
  
  try {
    console.log('\n📝 Testando código JavaScript...')
    
    // Descobrir ID correto do JavaScript
    const jsLanguage = languages.find(lang => 
      lang.name.toLowerCase().includes('javascript') || 
      lang.name.toLowerCase().includes('node')
    )
    
    if (!jsLanguage) {
      console.log('❌ JavaScript não encontrado na lista de linguagens')
      return
    }
    
    console.log(`✅ Usando JavaScript: ID ${jsLanguage.id} - ${jsLanguage.name}`)
    
    const result = await executeCode({
      source_code: jsCode,
      language_id: jsLanguage.id,
      stdin: testCases[0].input
    })
    
    console.log('✅ Resultado da execução:')
    console.log(`   Status: ${result.status.description}`)
    console.log(`   Output: ${result.stdout || 'Nenhum'}`)
    console.log(`   Error: ${result.stderr || 'Nenhum'}`)
    console.log(`   Time: ${result.time || 'N/A'}ms`)
    console.log(`   Memory: ${result.memory || 'N/A'}KB`)
    
    // Verificar se o resultado está correto
    const actualOutput = result.stdout?.trim()
    const expectedOutput = testCases[0].expectedOutput
    
    if (actualOutput === expectedOutput) {
      console.log('✅ Teste passou! Output correto.')
    } else {
      console.log('❌ Teste falhou!')
      console.log(`   Esperado: "${expectedOutput}"`)
      console.log(`   Obtido: "${actualOutput}"`)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testJudge0() 