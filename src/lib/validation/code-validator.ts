export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
export function validateCodeStructure(code: string, functionName: string): ValidationResult {
  const hasFunctionDecl = new RegExp(`(?:export\\s+default\\s+|export\\s+)?function\\s+${functionName}\\s*\\(`)
  const hasVarFunction = new RegExp(`(?:const|let|var)\\s+${functionName}\\s*=\\s*(?:async\\s*)?function\\s*\\(`)
  const hasArrowFunction = new RegExp(`(?:const|let|var)\\s+${functionName}\\s*=\\s*(?:async\\s*)?\\([^)]*\\)\\s*=>\\s*{`)
  if (!(hasFunctionDecl.test(code) || hasVarFunction.test(code) || hasArrowFunction.test(code))) {
    return {
      isValid: false,
      error: `Função '${functionName}' não foi encontrada`
    }
  }
  return { isValid: true }
}
export function validateNoExtraCode(code: string, functionName: string): ValidationResult {
  const extraAfter = extractCodeAfterFunction(code, functionName)
  if (extraAfter && extraAfter.trim().length > 0) {
    return {
      isValid: false,
      error: 'Código extra detectado fora do bloco da função. Remova conteúdo após \'}\'.'
    }
  }
  return { isValid: true }
}
export function validateFunctionBody(code: string, functionName: string): ValidationResult {
  const bodyCode = extractFunctionBody(code, functionName)
  if (bodyCode !== null) {
    const cleaned = sanitizeForCheck(bodyCode)
    const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean)
    const invalidLines = lines.filter(l => {
      const okStarts = /^(const|let|var|if|for|while|return|switch|case|break|continue|try|catch|throw|function|else)\b/
      const okEnds = /[;})]$/
      const hasOperator = /[=+\-*/<>!&|?:.]/
      const justBraces = /^[{}()\[\]]+$/
      const isLikelyValid = okStarts.test(l) || okEnds.test(l) || hasOperator.test(l) || justBraces.test(l)
      return !isLikelyValid
    })
    if (invalidLines.length > 0) {
      return {
        isValid: false,
        error: `Código inválido detectado. A linha '${invalidLines[0]}' não é uma instrução JavaScript válida.`
      }
    }
  }
  return { isValid: true }
}
function extractFunctionBody(code: string, functionName: string): string | null {
  const startRegex = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*{`)
  const startMatch = startRegex.exec(code)
  if (!startMatch) return null
  let brace = 1
  let pos = startMatch.index + startMatch[0].length
  let body = ''
  while (pos < code.length && brace > 0) {
    const ch = code[pos]
    if (ch === '{') brace++
    else if (ch === '}') brace--
    if (brace > 0) body += ch
    pos++
  }
  return body
}
function extractCodeAfterFunction(code: string, functionName: string): string | null {
  const startRegex = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*{`)
  const startMatch = startRegex.exec(code)
  if (!startMatch) return null
  let brace = 1
  let pos = startMatch.index + startMatch[0].length
  while (pos < code.length && brace > 0) {
    const ch = code[pos]
    if (ch === '{') brace++
    else if (ch === '}') brace--
    pos++
  }
  return code.substring(pos).trim()
}
function sanitizeForCheck(code: string): string {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
}