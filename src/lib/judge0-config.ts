// Tipos para o Judge0
export interface Judge0Language {
  id: number;
  name: string;
  extension: string;
}

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0Result {
  id: string;
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: string;
}

// Configurações do Judge0
export const JUDGE0_CONFIG = {
  // IDs das linguagens (serão atualizados conforme a resposta da API)
  LANGUAGES: {
    JAVASCRIPT: 54, // Será atualizado conforme a resposta da API
    PYTHON: 71,
    JAVA: 62,
    CPP: 54,
    C: 50,
    CSHARP: 51,
    GO: 60,
    RUST: 73,
  } as const,
  
  // Configurações de execução
  EXECUTION: {
    CPU_TIME_LIMIT: 3,
    MEMORY_LIMIT: 128000,
    TIMEOUT_MS: 5000,
  } as const,
  
  // URLs
  API_URL: process.env.JUDGE0_API_URL || 'http://localhost:3000/api/judge0',
  API_KEY: process.env.JUDGE0_API_KEY,
  
  // Fallback URLs para diferentes configurações
  FALLBACK_URLS: [
    process.env.JUDGE0_API_URL || 'http://localhost:3000/api/judge0',
    'http://localhost:3000/api/judge0',
    'http://localhost:2358',
    'http://judge0-ce:2358',
    'https://judge0-ce.p.rapidapi.com'
  ] as const,
  
  // Lista de IDs suportados (será atualizada dinamicamente)
  SUPPORTED_LANGUAGES: [54, 71, 62, 50, 51, 60, 73] as const,
  
  // Mapa de nomes das linguagens (será atualizado dinamicamente)
  LANGUAGE_MAP: {
    54: 'JavaScript',
    71: 'Python',
    62: 'Java',
    50: 'C',
    51: 'C#',
    60: 'Go',
    73: 'Rust',
  } as Record<number, string>,
} as const;

// Função para descobrir o ID correto da linguagem
export async function discoverLanguageId(languageName: string): Promise<number | null> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/languages`);
    const languages: Judge0Language[] = await response.json();
    
    const language = languages.find((lang) => 
      lang.name.toLowerCase().includes(languageName.toLowerCase())
    );
    
    return language ? language.id : null;
  } catch (error) {
    console.error('Erro ao descobrir ID da linguagem:', error);
    return null;
  }
}

// Função para atualizar configurações dinamicamente
export async function updateLanguageIds(): Promise<void> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/languages`);
    const languages: Judge0Language[] = await response.json();
    
    // Atualiza o mapa de linguagens
    languages.forEach((lang) => {
      (JUDGE0_CONFIG.LANGUAGE_MAP as any)[lang.id] = lang.name;
    });
    
    // Atualiza a lista de IDs suportados
    (JUDGE0_CONFIG.SUPPORTED_LANGUAGES as any) = languages.map((lang) => lang.id);
    
    // Atualiza o ID do JavaScript especificamente
    const jsLanguage = languages.find((lang) => 
      lang.name.toLowerCase().includes('javascript')
    );
    
    if (jsLanguage) {
      (JUDGE0_CONFIG.LANGUAGES as any).JAVASCRIPT = jsLanguage.id;
      console.log('✅ ID do JavaScript atualizado para:', jsLanguage.id);
    }
    
    console.log('✅ Configurações de linguagens atualizadas');
  } catch (error) {
    console.error('Erro ao atualizar IDs das linguagens:', error);
  }
}

// Função para testar a conexão com o Judge0
export async function testJudge0Connection(): Promise<boolean> {
  try {
    // Tentar diferentes endpoints que existem no Judge0
    const endpoints = ['/languages', '/about', '/submissions']
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${JUDGE0_CONFIG.API_URL}${endpoint}`)
        if (response.ok) {
          console.log(`✅ Judge0 conectado via ${endpoint}`)
          return true
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} falhou:`, error)
      }
    }
    
    console.error('❌ Não foi possível conectar com Judge0 em nenhum endpoint')
    return false
  } catch (error) {
    console.error('Erro ao conectar com Judge0:', error)
    return false
  }
}

// Função para listar todas as linguagens disponíveis
export async function listAvailableLanguages(): Promise<Judge0Language[]> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/languages`);
    const languages: Judge0Language[] = await response.json();
    
    console.log('📋 Linguagens disponíveis no Judge0:');
    languages.forEach((lang) => {
      console.log(`   ID ${lang.id}: ${lang.name} (${lang.extension})`);
    });
    
    return languages;
  } catch (error) {
    console.error('Erro ao listar linguagens:', error);
    return [];
  }
}

// Função para executar código
export async function executeCode(submission: Judge0Submission): Promise<Judge0Result> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions?wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao executar código:', error);
    throw error;
  }
}

// Função para obter resultado de uma submissão
export async function getSubmissionResult(submissionId: string): Promise<Judge0Result> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions/${submissionId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter resultado da submissão:', error);
    throw error;
  }
}

// Re-exportar executeCodeWithJudge0 do judge0.ts para evitar importações circulares
export { executeCodeWithJudge0 } from './judge0'