import { executeCodeWithJudge0 } from './src/lib/judge0'
import { JUDGE0_LANGUAGES } from './src/types/execution'
import type { TestCase } from './src/types/execution'

async function testJudge0() {
  console.log('🧪 Testando integração Judge0...\n')
  
  // Teste 1: JavaScript simples
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
    console.log('📝 Testando código JavaScript...')
    const results = await executeCodeWithJudge0(
      jsCode, 
      testCases, 
      JUDGE0_LANGUAGES.JAVASCRIPT, 
      5000
    )
    
    console.log('✅ Resultados do teste:')
    results.forEach((result, index) => {
      console.log(`   Teste ${index + 1}: ${result.status}`)
      console.log(`   Input: ${result.input}`)
      console.log(`   Expected: ${result.expectedOutput}`)
      console.log(`   Got: ${result.actualOutput}`)
      console.log(`   Time: ${result.executionTime}ms`)
      if (result.error) console.log(`   Error: ${result.error}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testJudge0() 