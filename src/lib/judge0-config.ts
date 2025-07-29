// Configurações do Judge0
export const JUDGE0_CONFIG = {
  // IDs das linguagens (serão atualizados conforme a versão)
  LANGUAGES: {
    JAVASCRIPT: 54, // Será atualizado conforme a resposta da API
    PYTHON: 71,
    JAVA: 62,
    CPP: 54,
    C: 50,
    CSHARP: 51,
    GO: 60,
    RUST: 73,
  },
  
  // Configurações de execução
  EXECUTION: {
    CPU_TIME_LIMIT: 3,
    MEMORY_LIMIT: 128000,
    TIMEOUT_MS: 5000,
  },
  
  // URLs
  API_URL: process.env.JUDGE0_API_URL || 'http://localhost:2358',
  API_KEY: process.env.JUDGE0_API_KEY,
  
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
    const languages = await response.json();
    
    const language = languages.find((lang: any) => 
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
    const languages = await response.json();
    
    // Atualiza o mapa de linguagens
    languages.forEach((lang: any) => {
      JUDGE0_CONFIG.LANGUAGE_MAP[lang.id] = lang.name;
    });
    
    // Atualiza a lista de IDs suportados
    (JUDGE0_CONFIG.SUPPORTED_LANGUAGES as any) = languages.map((lang: any) => lang.id);
    
    // Atualiza o ID do JavaScript especificamente
    const jsLanguage = languages.find((lang: any) => 
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