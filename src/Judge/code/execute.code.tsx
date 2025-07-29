// Função para criar código executável combinando código do usuário com testes
function createExecutableCode(userCode: string, functionName: string, testInput: string): string {
  // Remove espaços em branco desnecessários
  const cleanUserCode = userCode.trim();
  const cleanTestInput = testInput.trim();
  
  // Cria o código executável combinando o código do usuário com a chamada da função
  const executableCode = `${cleanUserCode}\nconsole.log(JSON.stringify(${functionName}(${cleanTestInput})));`;
  
  return executableCode;
}

// Exemplo de uso
const testUserCode = "function soma(a, b) { return a + b; }";
const functionName = "soma";
const testInput = "[3, 2]";

const executableCode = createExecutableCode(testUserCode, functionName, testInput);

console.log('ExecutableCode:', executableCode);
console.log('Tamanho em bytes:', Buffer.byteLength(executableCode, 'utf-8'));

// Função para validar se o código é seguro para execução
function validateCode(code: string): boolean {
  // Lista de palavras-chave perigosas que não devem estar no código
  const dangerousKeywords = [
    'eval', 'Function', 'setTimeout', 'setInterval', 'process', 'require',
    'import', 'export', 'global', 'window', 'document', 'localStorage',
    'sessionStorage', 'fetch', 'XMLHttpRequest', 'fetch', 'fetch',
    'exec', 'spawn', 'execSync', 'spawnSync', 'child_process'
  ];
  
  const lowerCode = code.toLowerCase();
  
  for (const keyword of dangerousKeywords) {
    if (lowerCode.includes(keyword.toLowerCase())) {
      return false;
    }
  }
  
  return true;
}

// Função para executar código de forma segura
async function executeCodeSafely(code: string): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    // Valida se o código é seguro
    if (!validateCode(code)) {
      return {
        success: false,
        error: 'Código contém elementos perigosos e não pode ser executado'
      };
    }
    
    // Aqui você pode integrar com o Judge0 API
    // Por enquanto, retornamos um mock
    return {
      success: true,
      output: 'Código executado com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro na execução: ${error}`
    };
  }
}

// Função para formatar entrada de teste
function formatTestInput(input: string): string {
  try {
    // Tenta fazer parse do JSON para validar
    JSON.parse(input);
    return input;
  } catch {
    // Se não for JSON válido, trata como string
    return `"${input}"`;
  }
}

// Função principal para criar e executar código
async function createAndExecuteCode(
  userCode: string, 
  functionName: string, 
  testInput: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    const formattedInput = formatTestInput(testInput);
    const executableCode = createExecutableCode(userCode, functionName, formattedInput);
    
    console.log('Código executável gerado:', executableCode);
    console.log('Tamanho em bytes:', Buffer.byteLength(executableCode, 'utf-8'));
    
    return await executeCodeSafely(executableCode);
  } catch (error) {
    return {
      success: false,
      error: `Erro ao criar código executável: ${error}`
    };
  }
}

export { createExecutableCode, validateCode, executeCodeSafely, createAndExecuteCode };
