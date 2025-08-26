export function transpileTsToJs(code: string): string {
  try {
    return code
      .replace(/:\s*number\[\]/g, '')
      .replace(/:\s*string\[\]/g, '')
      .replace(/:\s*boolean\[\]/g, '')
      .replace(/:\s*any\[\]/g, '')
      .replace(/:\s*\w+\[\]/g, '')
      .replace(/:\s*number\b/g, '')
      .replace(/:\s*string\b/g, '')
      .replace(/:\s*boolean\b/g, '')
      .replace(/:\s*any\b/g, '')
      .replace(/:\s*void\b/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/!\s*([,;\)\]])/g, '$1')
      .replace(/!\s*$/gm, '')
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
      .replace(/export\s+/g, '')
      .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/\(\s*,/g, '(')
      .replace(/,\s*\)/g, ')')
      .trim()
  } catch (error) {
    throw new Error(`Erro na transpilação TypeScript para JavaScript: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
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
    const timestamp = Date.now()
    
    const executableCode = `// Código do usuário - Execução ${timestamp}
${userCode}

// Teste - ${timestamp}
try {
  const result_${timestamp} = ${functionName}(${paramsString});
  console.log(JSON.stringify(result_${timestamp}));
} catch (error_${timestamp}) {
  console.log("ERROR: " + error_${timestamp}.message);
}`
    
    return executableCode
  }
  
  if (languageId === 63) {
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
    
    const timestamp = Date.now()
    return `// Código do usuário - Execução ${timestamp}
${cleanCode}

// Teste - ${timestamp}
try {
  const result_${timestamp} = ${functionName}(${paramsString});
  console.log(JSON.stringify(result_${timestamp}));
} catch (error_${timestamp}) {
  console.log("ERROR: " + error_${timestamp}.message);
}`
  }
  
  return `// Código do usuário
${userCode}

// Teste
console.log(JSON.stringify(${functionName}(${paramsString})));`
}
