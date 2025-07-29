import type { TestCase, TestResult, LanguageId } from '@/types/execution'

// Judge0 API Configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY

// Rate limiting map (em produção usar Redis)
const executionCounts = new Map<string, { count: number; resetTime: number }>()
const MAX_EXECUTIONS_PER_HOUR = 100
const HOUR_IN_MS = 60 * 60 * 1000

export interface Judge0Submission {
  source_code: string
  language_id: LanguageId
  stdin?: string
  expected_output?: string
  cpu_time_limit?: number
  memory_limit?: number
}

export interface Judge0Response {
  token: string
  status: {
    id: number
    description: string
  }
  stdout?: string
  stderr?: string
  compile_output?: string
  time?: string
  memory?: number
}

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
  const results: TestResult[] = []
  
  for (const testCase of testCases) {
    const startTime = Date.now()
    
    try {
      const result = await executeTestCase(code, testCase, languageId, timeoutMs, functionName)
      results.push({
        ...result,
        executionTime: Date.now() - startTime
      })
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
  languageId: LanguageId,
  timeoutMs: number,
  functionName: string
): Promise<Omit<TestResult, 'executionTime'>> {
  // 1. Tamanho do código original
  console.log('--- DEBUG SIZE ---');
  console.log('Tamanho do userCode:', code.length, 'caracteres');
  // 2. Tamanho do input do teste
  console.log('Tamanho do testInput:', testCase.input.length, 'caracteres');

  const executableCode = createExecutableCode(code, functionName, testCase.input);

  // 3. Tamanho do código que será enviado ao Judge0
  console.log('Tamanho do executableCode:', executableCode.length, 'caracteres');

  const payload = {
    source_code: executableCode,
    language_id: 63, // JavaScript (Node.js 12.14.0)
    cpu_time_limit: 3, // 3 segundos
    wall_time_limit: 3, // 3 segundos (dentro do limite de 150)
    memory_limit: 128000,
    stack_limit: 128000,
    max_file_size: 10485760, // 1KB (dentro do limite)
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
    number_of_runs: 1
  };

  // 4. Tamanho total do JSON enviado ao Judge0
  console.log('Tamanho do payload (JSON):', JSON.stringify(payload).length, 'caracteres');
  console.log('--- FIM DEBUG SIZE ---');

  const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log('❌ Judge0 Error Response:', errorText);
    throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`);
  }

  const result: Judge0Response = await response.json();
  return parseJudge0Result(result, testCase);
}

function parseJudge0Result(
  result: Judge0Response, 
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
    memory: result.memory,
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
  const languageMap: Record<LanguageId, string> = {
    63: 'JavaScript',
    74: 'TypeScript',
    71: 'Python',
    62: 'Java',
    54: 'C++',
    50: 'C',
    51: 'C#',
    60: 'Go',
    73: 'Rust',
  }
  
  return languageMap[languageId] || 'Unknown'
}

// Helper function to parse test case input
function parseTestCaseInput(input: string): any[] {
  try {
    // Remove outer brackets and split by comma, handling nested arrays/objects
    const cleanInput = input.trim()
    if (cleanInput.startsWith('[') && cleanInput.endsWith(']')) {
      // It's an array - parse it directly
      return [JSON.parse(cleanInput)]
    } else {
      // It's multiple parameters - split by comma at top level
      const params = []
      let current = ''
      let depth = 0
      let inString = false
      let escapeNext = false
      
      for (let i = 0; i < cleanInput.length; i++) {
        const char = cleanInput[i]
        
        if (escapeNext) {
          current += char
          escapeNext = false
          continue
        }
        
        if (char === '\\') {
          escapeNext = true
          current += char
          continue
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString
        }
        
        if (!inString) {
          if (char === '[' || char === '{') depth++
          if (char === ']' || char === '}') depth--
          
          if (char === ',' && depth === 0) {
            params.push(JSON.parse(current.trim()))
            current = ''
            continue
          }
        }
        
        current += char
      }
      
      if (current.trim()) {
        params.push(JSON.parse(current.trim()))
      }
      
      return params
    }
  } catch (error) {
    console.log('Error parsing input:', input, error)
    throw new Error(`Failed to parse test case input: ${input}`)
  }
}

// Helper function to create executable code
function createExecutableCode(userCode: string, functionName: string, testInput: string): string {
  const params = parseTestCaseInput(testInput)
  const paramsString = params.map(p => JSON.stringify(p)).join(', ')
  
  // Código ultra-compacto para evitar erro max_file_size
  return `${userCode}console.log(JSON.stringify(${functionName}(${paramsString})));`.trim()
} 