export async function transpileTsToJs(code: string): Promise<string> {
  try {
    const ts = await import('typescript');

    const result = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2015,
        removeComments: true,
        strict: false,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
    });

    return result.outputText;
  } catch (error) {
    throw new Error(`TypeScript transpilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
function cleanUserCode(code: string, isPython: boolean = false): string {
  let cleaned = code

  if (isPython) {
    cleaned = cleaned.replace(/#.*$/gm, '')
    cleaned = cleaned.replace(/console\.(log|error|warn|info|debug)\([^)]*\);?/g, '')
    cleaned = cleaned.replace(/print\([^)]*\)(?!\s*$)/g, '')
  } else {
    cleaned = cleaned.replace(/\/\/.*$/gm, '')
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '')
    cleaned = cleaned.replace(/console\.(log|error|warn|info|debug)\([^)]*\);?/g, '')
  }

  const lines = cleaned.split('\n')
  const nonEmptyLines = lines.filter(line => line.trim().length > 0)

  if (nonEmptyLines.length === 0) return ''

  const minIndent = Math.min(
    ...nonEmptyLines.map(line => {
      const match = line.match(/^(\s*)/)
      return match ? match[1].length : 0
    })
  )

  const dedented = nonEmptyLines
    .map(line => (minIndent > 0 ? line.slice(minIndent) : line))
    .join('\n')

  return dedented.trim()
}

export function parseTestCaseInput(input: string): any[] {
  try {
    const cleanInput = input.trim()
    const jsonMatch = cleanInput.match(/^(\[.*\]|\{.*\}|".*"|'.*'|\d+(?:\.\d+)?|true|false|null)(?:\s*,\s*(.*))?$/)
    if (!jsonMatch) {
      throw new Error(`Invalid input format: ${input}`)
    }
    const result = []
    let remaining = cleanInput
    while (remaining.trim()) {
      const match = remaining.match(/^(\[.*?\]|\{.*?\}|"[^"]*"|'[^']*'|-?\d+(?:\.\d+)?|true|false|null)(?:\s*,\s*(.*))?/)
      if (!match) {
        break
      }
      try {
        const parsed = JSON.parse(match[1])
        result.push(parsed)
      } catch {
        if (match[1].startsWith('"') || match[1].startsWith("'")) {
          result.push(match[1].slice(1, -1))
        } else if (!isNaN(Number(match[1]))) {
          result.push(Number(match[1]))
        } else {
          result.push(match[1])
        }
      }
      remaining = match[2] || ''
    }
    if (result.length === 0) {
      try {
        return [JSON.parse(cleanInput)]
      } catch {
        return [cleanInput]
      }
    }
    return result
  } catch (error) {
    throw new Error(`Failed to parse test case input: ${input}`)
  }
}
export function createExecutableCode(userCode: string, functionName: string, testInput: string, languageId: number): string {
  const params = parseTestCaseInput(testInput)
  const paramsString = params.map(p => JSON.stringify(p)).join(', ')

  if (languageId === 74) {
    const cleanCode = cleanUserCode(userCode)
    const timestamp = Date.now()
    const executableCode = `${cleanCode}
try {
  const result_${timestamp} = ${functionName}(${paramsString});
  console.log(JSON.stringify(result_${timestamp}));
} catch (error_${timestamp}) {
  console.error(error_${timestamp});
}`
    return executableCode
  }

  if (languageId === 63) {
    let cleanCode = cleanUserCode(userCode)
    cleanCode = cleanCode
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
    const timestamp = Date.now()
    return `${cleanCode}
try {
  const result_${timestamp} = ${functionName}(${paramsString});
  console.log(JSON.stringify(result_${timestamp}));
} catch (error_${timestamp}) {
  console.error(error_${timestamp});
}`
  }

  if (languageId === 71) {
    const cleanCode = cleanUserCode(userCode, true)
    const timestamp = Date.now()
    const pythonParams = params.map(p => {
      if (typeof p === 'string') return `"${p.replace(/"/g, '\\"')}"`
      return JSON.stringify(p)
    }).join(', ')
    return `${cleanCode}
import json
try:
    result_${timestamp} = ${functionName}(${pythonParams})
    print(json.dumps(result_${timestamp}))
except Exception as error_${timestamp}:
    raise error_${timestamp}`
  }

  return `// Código do usuário
${userCode}
console.log(${functionName}(${paramsString}));`
}
