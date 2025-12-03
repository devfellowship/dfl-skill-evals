const DANGEROUS_PATTERNS = [
  /\beval\s*\(/i,
  /\bexec\s*\(/i,
  /\brequire\s*\(/i,
  /\bimport\s+.*\s+from\s+['"]fs['"]/i,
  /\bimport\s+.*\s+from\s+['"]child_process['"]/i,
  /\bimport\s+.*\s+from\s+['"]path['"]/i,
  /\bimport\s+.*\s+from\s+['"]os['"]/i,
  /\bimport\s+.*\s+from\s+['"]crypto['"]/i,
  /\bimport\s+.*\s+from\s+['"]http['"]/i,
  /\bimport\s+.*\s+from\s+['"]net['"]/i,
  /\bprocess\.env/i,
  /\bfs\.readFile/i,
  /\bfs\.writeFile/i,
  /\bfs\.unlink/i,
  /\bchild_process\./i,
  /\bglobal\./i,
  /\b__dirname/i,
  /\b__filename/i,
  /\bsetTimeout\s*\(\s*eval/i,
  /\bsetInterval\s*\(\s*eval/i,
  /\bFunction\s*\(/i,
  /\bnew\s+Function/i,
];

export function detectMaliciousCode(code: string, _languageId: number): { isMalicious: boolean; patterns: string[] } {
  const detected: string[] = [];

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      detected.push(pattern.source);
    }
  }

  return {
    isMalicious: detected.length > 0,
    patterns: detected,
  };
}

export function validateCodeBeforeExecution(code: string, functionName: string, languageId: number): { valid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Código não pode estar vazio' };
  }

  if (code.length > 50000) {
    return { valid: false, error: 'Código excede o tamanho máximo permitido (50KB)' };
  }

  if (!functionName || functionName.trim().length === 0) {
    return { valid: false, error: 'Nome da função é obrigatório' };
  }

  const functionNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  if (!functionNameRegex.test(functionName)) {
    return { valid: false, error: 'Nome de função inválido' };
  }

  const { isMalicious, patterns } = detectMaliciousCode(code, languageId);
  if (isMalicious) {
    return {
      valid: false,
      error: `Código contém operações não permitidas: ${patterns.slice(0, 3).join(', ')}`,
    };
  }

  return { valid: true };
}
