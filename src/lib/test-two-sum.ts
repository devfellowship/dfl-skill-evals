// Teste completo da função twoSum
import { executeCodeWithJudge0 } from './judge0'
import { JUDGE0_LANGUAGES } from '../types/execution'
import type { TestCase } from '../types/execution'

async function testTwoSum() {
  console.log('🧪 Testando Two Sum com Judge0...\n')
  
  // Código do Two Sum (solução correta)
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
}`
  
  // Test cases do Two Sum
  const testCases: TestCase[] = [
    { 
      input: "[2,7,11,15], 9", 
      expectedOutput: "[0,1]", 
      description: "Basic case with target found"
    },
    { 
      input: "[3,2,4], 6", 
      expectedOutput: "[1,2]", 
      description: "Another valid case"
    },
    { 
      input: "[3,3], 6", 
      expectedOutput: "[0,1]", 
      description: "Duplicate numbers"
    }
  ]
  
  try {
    console.log('📝 Executando Two Sum...')
    console.log('📋 Código:')
    console.log(twoSumCode)
    console.log('\n📋 Test Cases:')
    testCases.forEach((testCase, index) => {
      console.log(`   Teste ${index + 1}: ${testCase.input} → ${testCase.expectedOutput}`)
    })
    
    const results = await executeCodeWithJudge0(
      twoSumCode, 
      testCases, 
      JUDGE0_LANGUAGES.TYPESCRIPT, // TypeScript
      5000,
      'twoSum'
    )
    
    console.log('\n✅ Resultados:')
    results.forEach((result, index) => {
      console.log(`\n   Teste ${index + 1}: ${result.status}`)
      console.log(`   Input: ${result.input}`)
      console.log(`   Expected: ${result.expectedOutput}`)
      console.log(`   Got: ${result.actualOutput}`)
      console.log(`   Time: ${result.executionTime}ms`)
      if (result.error) console.log(`   Error: ${result.error}`)
    })
    
    const passedTests = results.filter(r => r.status === 'passed').length
    console.log(`\n📊 Resumo: ${passedTests}/${results.length} testes passaram`)
    
  } catch (error) {
    console.error('❌ Erro no teste Two Sum:', error)
  }
}

testTwoSum()