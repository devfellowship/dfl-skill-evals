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

export const JUDGE0_CONFIG = {
  LANGUAGES: {
    JAVASCRIPT: 54,
    PYTHON: 71,
    JAVA: 62,
    CPP: 54,
    C: 50,
    CSHARP: 51,
    GO: 60,
    RUST: 73,
  } as const,

  EXECUTION: {
    CPU_TIME_LIMIT: 3,
    MEMORY_LIMIT: 128000,
    TIMEOUT_MS: 5000,
  } as const,

  API_URL: process.env.JUDGE0_API_URL || 'http://localhost:3000/api/judge0',
  API_KEY: process.env.JUDGE0_API_KEY,

  FALLBACK_URLS: [
    process.env.JUDGE0_API_URL || 'http://localhost:3000/api/judge0',
    'http://localhost:3000/api/judge0',
    'http://localhost:2358',
    'http://judge0-ce:2358',
    'https://judge0-ce.p.rapidapi.com'
  ] as const,

  SUPPORTED_LANGUAGES: [54, 71, 62, 50, 51, 60, 73] as const,

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

export async function discoverLanguageId(languageName: string): Promise<number | null> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/languages`);
    const languages: Judge0Language[] = await response.json();
    
    const language = languages.find((lang) => 
      lang.name.toLowerCase().includes(languageName.toLowerCase())
    );
    
    return language ? language.id : null;
  } catch (error) {
    return null;
  }
}

export async function updateLanguageIds(): Promise<void> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/languages`);
    const languages: Judge0Language[] = await response.json();

    languages.forEach((lang) => {
      (JUDGE0_CONFIG.LANGUAGE_MAP as any)[lang.id] = lang.name;
    });

    (JUDGE0_CONFIG.SUPPORTED_LANGUAGES as any) = languages.map((lang) => lang.id);

    const jsLanguage = languages.find((lang) => 
      lang.name.toLowerCase().includes('javascript')
    );
    
    if (jsLanguage) {
      (JUDGE0_CONFIG.LANGUAGES as any).JAVASCRIPT = jsLanguage.id;
    }
  } catch (error) {
    }
}

export async function testJudge0Connection(): Promise<boolean> {
  try {
    const endpoints = ['/languages', '/about', '/submissions']
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${JUDGE0_CONFIG.API_URL}${endpoint}`)
        if (response.ok) {
  
          return true
        }
      } catch (error) {

      }
    }
    
    return false
  } catch (error) {
    return false
  }
}

export async function listAvailableLanguages(): Promise<Judge0Language[]> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/languages`);
    const languages: Judge0Language[] = await response.json();

    return languages;
  } catch (error) {
    return [];
  }
}

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
    throw error;
  }
}

export async function getSubmissionResult(submissionId: string): Promise<Judge0Result> {
  try {
    const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions/${submissionId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export { executeCodeWithJudge0 } from './judge0'