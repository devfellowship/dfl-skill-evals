import type { TestCase, TestResult, LanguageId } from '@/types/execution'
import { executeCode, listAvailableLanguages, testJudge0Connection } from './judge0-config'
import type { Judge0Result } from './judge0-config'

// Rate limiting map (em produção usar Redis)
const executionCounts = new Map<string, { count: number; resetTime: number }>()
const MAX_EXECUTIONS_PER_HOUR = 100
const HOUR_IN_MS = 60 * 60 * 1000

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = executionCounts.get(identifier)
  
  if (!entry || now > entry.resetTime) {
    executionCounts.set(identifier, {
      count: 1,
      resetTime: now + HOUR_IN_MS
    })
    return true
  }
  
  if (entry.count >= MAX_EXECUTIONS_PER_HOUR) {
    return false
  }
  
  entry.count++
  return true
}

export async function executeCodeWithJudge0(
  code: string,
  testCases: TestCase[],
  languageId: LanguageId,
  timeoutMs: number = 5000,
  functionName: string
): Promise<TestResult[]> {
  console.log('🚀 DEBUG JUDGE0 - Iniciando execução...')
  console.log('📋 Parâmetros:', { codeLength: code.length, testCasesCount: testCases.length, languageId, functionName })
  
  const results: TestResult[] = []
  
  // Verificar conexão com Judge0
  console.log('🔍 Verificando conexão com Judge0...')
  const isConnected = await testJudge0Connection()
  if (!isConnected) {
    console.error('❌ Judge0 não está disponível')
    throw new Error('Judge0 não está disponível. Verifique se os containers estão rodando.')
  }
  console.log('✅ Conexão com Judge0 estabelecida')
  
  // Descobrir ID correto da linguagem
  console.log('🔍 Descobrindo linguagem...')
  const languages = await listAvailableLanguages()
  console.log('📋 Linguagens disponíveis:', languages.length)
  
  // Procurar por TypeScript primeiro, depois JavaScript
  let targetLanguage = languages.find(lang => lang.id === 74) // TypeScript
  
  if (!targetLanguage) {
    targetLanguage = languages.find(lang => lang.id === 63) // JavaScript
  }
  
  if (!targetLanguage) {
    // Fallback: procurar por nome
    targetLanguage = languages.find(lang => {
      const langName = lang.name.toLowerCase()
      return langName.includes('typescript') || langName.includes('javascript') || langName.includes('node') || langName.includes('js')
    })
  }
  
  if (!targetLanguage) {
    console.error(`❌ JavaScript não encontrado no Judge0`)
    console.log('📋 Linguagens disponíveis:', languages.map(l => `${l.id}: ${l.name}`))
    throw new Error(`JavaScript não está disponível no Judge0. Linguagens disponíveis: ${languages.map(l => l.name).join(', ')}`)
  }
  
  console.log(`✅ Usando linguagem: ${targetLanguage.name} (ID: ${targetLanguage.id})`)
  
  for (const testCase of testCases) {
    const startTime = Date.now()
    
    try {
      console.log(`🧪 Executando teste: ${testCase.input}`)
      const result = await executeTestCase(code, testCase, targetLanguage.id, timeoutMs, functionName)
      results.push({
        ...result,
        executionTime: Date.now() - startTime
      })
      console.log(`✅ Teste concluído: ${result.status}`)
    } catch (error) {
      console.log('❌ ERRO no executeTestCase:', error)
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      })
    }
  }
  
  console.log('🎯 DEBUG JUDGE0 - Resultados finais:', {
    totalTests: results.length,
    passedTests: results.filter(r => r.status === 'passed').length,
    failedTests: results.filter(r => r.status === 'failed').length,
    errorTests: results.filter(r => r.status === 'error').length,
    results: results.map(r => ({
      input: r.input,
      expected: r.expectedOutput,
      actual: r.actualOutput,
      status: r.status,
      error: r.error
    }))
  })
  
  return results
}

async function executeTestCase(
  code: string,
  testCase: TestCase,
  languageId: number,
  timeoutMs: number,
  functionName: string
): Promise<Omit<TestResult, 'executionTime'>> {
  console.log('🧪 DEBUG EXECUTE TEST CASE ---');
  console.log('Input:', testCase.input);
  console.log('Expected:', testCase.expectedOutput);
  console.log('Function:', functionName);
  console.log('Language ID:', languageId);
  
  const executableCode = createExecutableCode(code, functionName, testCase.input);
  console.log('📝 Código executável:');
  console.log(executableCode);
  console.log('📏 Tamanho:', executableCode.length, 'caracteres');

  const payload = {
    source_code: executableCode,
    language_id: languageId,
    cpu_time_limit: 3,
    wall_time_limit: 3,
    memory_limit: 128000,
    stack_limit: 128000,
    max_file_size: 4096,
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
    number_of_runs: 1
  };

  console.log('📦 Payload enviado:');
  console.log(JSON.stringify(payload, null, 2));

  const result: Judge0Result = await executeCode(payload);
  
  console.log('📊 Resposta do Judge0:');
  console.log(JSON.stringify(result, null, 2));
  
  const parsedResult = parseJudge0Result(result, testCase);
  console.log('🎯 Resultado final:', parsedResult);
  console.log('--- FIM DEBUG EXECUTE TEST CASE ---');
  
  return parsedResult;
}

function parseJudge0Result(
  result: Judge0Result, 
  testCase: TestCase
): Omit<TestResult, 'executionTime'> {
  console.log('📊 DEBUG JUDGE0 - Response completa:', {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    compile_output: result.compile_output,
    time: result.time,
    memory: result.memory
  })
  
  const baseResult = {
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: result.stdout?.trim() || null,
    memory: result.memory ? parseInt(result.memory) : undefined,
  }
  
  // Status codes: https://github.com/judge0/judge0/blob/master/app/models/status.rb
  switch (result.status.id) {
    case 3: { // Accepted
      // O Judge0 executou com sucesso, agora vamos comparar
      const actual = result.stdout?.trim() || '';
      const expected = Array.isArray(testCase.expectedOutput)
        ? JSON.stringify(testCase.expectedOutput)
        : String(testCase.expectedOutput).trim();
    
      // Remove espaços e quebras de linha para comparação
      const actualNormalized = actual.replace(/\s/g, '');
      const expectedNormalized = expected.replace(/\s/g, '');
      const passed = actualNormalized === expectedNormalized;
      
      console.log('🔍 DEBUG JUDGE0 - Comparação:', {
        actual: actual,
        expected: expected,
        actualNormalized: actualNormalized,
        expectedNormalized: expectedNormalized,
        passed: passed
      })
      
      return {
        ...baseResult,
        status: passed ? 'passed' : 'failed',
      }
    }
    
    case 4: // Wrong Answer
      console.log('❌ DEBUG JUDGE0 - Wrong Answer')
      return {
        ...baseResult,
        status: 'failed',
      }
    
    case 5: // Time Limit Exceeded
      console.log('⏰ DEBUG JUDGE0 - Time Limit Exceeded')
      return {
        ...baseResult,
        status: 'timeout',
        error: 'Time limit exceeded',
      }
    
    case 6: // Compilation Error
      console.log('🔧 DEBUG JUDGE0 - Compilation Error:', result.compile_output)
      return {
        ...baseResult,
        status: 'error',
        error: result.compile_output || 'Compilation error',
      }
    
    default:
      console.log('❓ DEBUG JUDGE0 - Status desconhecido:', result.status.id, result.status.description)
      return {
        ...baseResult,
        status: 'error',
        error: `Unknown status: ${result.status.id} - ${result.status.description}`,
      }
  }
}

// Utility functions
export function isLanguageSupported(languageId: LanguageId): boolean {
  const supportedIds = [63, 74, 71, 62, 54, 50, 51, 60, 73] // Judge0 language IDs
  return supportedIds.includes(languageId)
}

export function getLanguageName(languageId: LanguageId): string {
  const languageMap: Record<number, string> = {
    63: 'JavaScript (Node.js 12.14.0)',
    74: 'TypeScript (3.7.4)',
    71: 'Python (3.8.1)',
    62: 'Java (OpenJDK 13.0.1)',
    54: 'C++ (GCC 9.2.0)',
    50: 'C (GCC 9.2.0)',
    51: 'C# (Mono 6.6.0.161)',
    60: 'Go (1.13.5)',
    73: 'Rust (1.40.0)',
  }
  
  return languageMap[languageId as number] || 'Unknown'
}

// Helper function to parse test case input
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

// Helper function to create executable code
function createExecutableCode(userCode: string, functionName: string, testInput: string): string {
  const params = parseTestCaseInput(testInput)
  const paramsString = params.map(p => JSON.stringify(p)).join(', ')
  
  // Código TypeScript/JavaScript - remove anotações de tipo
  const cleanCode = userCode
    .replace(/:\s*number\[\]/g, '') // Remove number[]
    .replace(/:\s*number/g, '') // Remove number
    .replace(/:\s*string/g, '') // Remove string
    .replace(/:\s*boolean/g, '') // Remove boolean
    .replace(/:\s*any/g, '') // Remove any
  
  return `// Código do usuário
${cleanCode}

// Teste
console.log(JSON.stringify(${functionName}(${paramsString})));`
}