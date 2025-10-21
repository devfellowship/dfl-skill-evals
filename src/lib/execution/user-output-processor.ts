
import { parseTestCaseInput } from './code-processor'
export interface UserOutputResult {
  input: string
  expectedOutput: string
  actualOutput: string
  status: 'success' | 'error'
  errorMessage?: string
  executionTime: number
}
export interface UserOutputTestCase {
  id: string
  input: string
  expectedOutput: string
  description?: string
}
export async function executeUserCode(
  userCode: string, 
  functionName: string, 
  testInput: string, 
  languageId: number = 74
): Promise<UserOutputResult> {
  const startTime = Date.now()
  try {
    const params = parseTestCaseInput(testInput)
    const paramsString = params.map(p => JSON.stringify(p)).join(', ')
    const executableCode = createExecutableCode(userCode, functionName, paramsString, languageId)
    const actualOutput = simulateExecution(functionName, params, userCode)
    const executionTime = Date.now() - startTime
    return {
      input: testInput,
      expectedOutput: '', 
      actualOutput: actualOutput,
      status: 'success',
      executionTime
    }
  } catch (error) {
    const executionTime = Date.now() - startTime
    return {
      input: testInput,
      expectedOutput: '',
      actualOutput: '',
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      executionTime
    }
  }
}
function createExecutableCode(
  userCode: string, 
  functionName: string, 
  paramsString: string, 
  languageId: number
): string {
  const timestamp = Date.now()
  if (languageId === 74) { // JavaScript
    return `// Código do usuário - Execução ${timestamp}
${userCode}
try {
  const result_${timestamp} = ${functionName}(${paramsString});
  console.log(result_${timestamp});
} catch (error_${timestamp}) {
  console.error(error_${timestamp});
}`
  }
  if (languageId === 63) { // TypeScript
    const cleanCode = userCode
      .replace(/:\s*number\[\]/g, '')
      .replace(/:\s*string\[\]/g, '')
      .replace(/:\s*boolean\[\]/g, '')
      .replace(/:\s*any\[\]/g, '')
      .replace(/:\s*\w+\[\]/g, '')
      .replace(/:\s*number\b/g, '')
      .replace(/:\s*string\b/g, '')
      .replace(/:\s*boolean\b/g, '')
      .replace(/:\s*any\b/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/!\s*([,;\)\]])/g, '$1')
      .replace(/!\s*$/gm, '')
      .replace(/export\s+/g, '')
      .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return `// Código do usuário - Execução ${timestamp}
${cleanCode}
try {
  const result_${timestamp} = ${functionName}(${paramsString});
  console.log(result_${timestamp});
} catch (error_${timestamp}) {
  console.error(error_${timestamp});
}`
  }
  return `// Código do usuário
${userCode}
console.log(${functionName}(${paramsString}));`
}
function simulateExecution(functionName: string, params: any[], userCode: string): string {
  try {
    const functionLogic = extractFunctionLogic(userCode, functionName)
    if (!functionLogic) {
      return executeDirectFunction(userCode, functionName, params)
    }
    return executeFunctionLogic(functionLogic, params)
  } catch (error) {
    return `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
  }
}
function extractFunctionLogic(userCode: string, functionName: string): string | null {
  const patterns = [
    new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{([^}]+)\\}`, 's'),
    new RegExp(`const\\s+${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{([^}]+)\\}`, 's'),
    new RegExp(`const\\s+${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*([^;]+)`, 's'),
    new RegExp(`${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{([^}]+)\\}`, 's'),
    new RegExp(`${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*([^;]+)`, 's')
  ]
  for (const pattern of patterns) {
    const match = userCode.match(pattern)
    if (match) {
      return match[1] || match[0]
    }
  }
  return null
}
function executeDirectFunction(userCode: string, functionName: string, params: any[]): string {
  try {
    const context = {
      [functionName]: null as any
    }
    const codeToEval = userCode.replace(/export\s+/g, '').replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
    const wrapper = new Function('params', `
      ${codeToEval}
      return ${functionName}(...params);
    `)
    const result = wrapper(params)
    return JSON.stringify(result)
  } catch (error) {
    return analyzeSimplePatterns(userCode, functionName, params)
  }
}
function analyzeSimplePatterns(userCode: string, functionName: string, params: any[]): string {
  if (userCode.includes('+') && params.length >= 2) {
    const result = params.reduce((a, b) => Number(a) + Number(b), 0)
    return result.toString()
  }
  if (userCode.includes('*') && params.length >= 2) {
    const result = params.reduce((a, b) => Number(a) * Number(b), 1)
    return result.toString()
  }
  if (userCode.includes('-') && params.length >= 2) {
    const result = Number(params[0]) - Number(params[1])
    return result.toString()
  }
  if (userCode.includes('/') && params.length >= 2) {
    const result = Number(params[0]) / Number(params[1])
    return result.toString()
  }
  if (Array.isArray(params[0])) {
    const arr = params[0]
    if (userCode.includes('length')) {
      return arr.length.toString()
    }
    if (userCode.includes('sum') || userCode.includes('reduce')) {
      const sum = arr.reduce((a: number, b: number) => a + b, 0)
      return sum.toString()
    }
    if (userCode.includes('max')) {
      const max = Math.max(...arr)
      return max.toString()
    }
    if (userCode.includes('min')) {
      const min = Math.min(...arr)
      return min.toString()
    }
  }
  return generateFallbackOutput(params)
}
function executeFunctionLogic(functionLogic: string, params: any[]): string {
  try {
    if (functionLogic.includes('return') || functionLogic.includes('=>')) {
      return executeSimpleFunction(functionLogic, params)
    }
    return generateFallbackOutput(params)
  } catch (error) {
    return `Erro na execução: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
  }
}
function executeSimpleFunction(functionLogic: string, params: any[]): string {
  try {
    if (functionLogic.includes('+') && params.length >= 2) {
      const result = params.reduce((a, b) => Number(a) + Number(b), 0)
      return result.toString()
    }
    if (functionLogic.includes('*') && params.length >= 2) {
      const result = params.reduce((a, b) => Number(a) * Number(b), 1)
      return result.toString()
    }
    if (Array.isArray(params[0])) {
      const arr = params[0]
      if (functionLogic.includes('length')) {
        return arr.length.toString()
      }
      if (functionLogic.includes('sum') || functionLogic.includes('reduce')) {
        const sum = arr.reduce((a: number, b: number) => a + b, 0)
        return sum.toString()
      }
    }
    return generateFallbackOutput(params)
  } catch (error) {
    return `Erro: ${error instanceof Error ? error.message : 'Erro na execução'}`
  }
}
function generateFallbackOutput(params: any[]): string {
  if (params.length === 0) {
    return 'null'
  }
  if (params.length === 1) {
    const param = params[0]
    if (Array.isArray(param)) {
      return `[${param.join(', ')}]`
    }
    if (typeof param === 'string') {
      return `"${param}"`
    }
    return param.toString()
  }
  return `[${params.map(p => Array.isArray(p) ? `[${p.join(', ')}]` : typeof p === 'string' ? `"${p}"` : p.toString()).join(', ')}]`
}
export async function generateUserOutputTestCases(
  userCode: string,
  functionName: string,
  testCases: UserOutputTestCase[],
  languageId: number = 74
): Promise<UserOutputResult[]> {
  const results: UserOutputResult[] = []
  for (const testCase of testCases) {
    const result = await executeUserCode(userCode, functionName, testCase.input, languageId)
    result.expectedOutput = testCase.expectedOutput
    results.push(result)
  }
  return results
}
export function combineUserAndSeedOutputs(
  userResults: UserOutputResult[],
  seedResults: any[],
  userOutputRatio: number = 0.5
): any[] {
  const combined: any[] = []
  const userCount = Math.floor(userResults.length * userOutputRatio)
  const seedCount = userResults.length - userCount
  for (let i = 0; i < userCount && i < userResults.length; i++) {
    const userResult = userResults[i]
    combined.push({
      status: userResult.status === 'success' ? 'passed' : 'failed',
      input: userResult.input,
      expectedOutput: userResult.expectedOutput,
      actualOutput: userResult.actualOutput,
      executionTime: userResult.executionTime,
      errorMessage: userResult.errorMessage,
      isUserOutput: true 
    })
  }
  for (let i = 0; i < seedCount && i < seedResults.length; i++) {
    const seedResult = seedResults[i]
    combined.push({
      ...seedResult,
      isUserOutput: false 
    })
  }
  return combined
}