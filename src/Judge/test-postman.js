// Exemplos de requisições para testar no Postman
// Configure a variável de ambiente JUDGE0_API_URL no seu .env ou use diretamente nas URLs

// ===============================
// 1. GET /languages - Listar linguagens suportadas
// ===============================
/*
GET https://judge0-ce.p.rapidapi.com/languages
Headers:
- Content-Type: application/json
- X-RapidAPI-Key: {{sua_chave}} (opcional para alguns endpoints)
*/

// ===============================
// 2. GET /statuses - Status de execução possíveis  
// ===============================
/*
GET https://judge0-ce.p.rapidapi.com/statuses
Headers:
- Content-Type: application/json
*/

// ===============================
// 3. GET /about - Informações da instância
// ===============================
/*
GET https://judge0-ce.p.rapidapi.com/about
Headers:
- Content-Type: application/json
*/

// ===============================
// 4. POST /submissions - Submeter código para execução
// ===============================
/*
POST https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true
Headers:
- Content-Type: application/json
- X-RapidAPI-Key: {{sua_chave}} (recomendado)

Body (JSON):
{
  "source_code": "console.log('Hello, World!');",
  "language_id": 63,
  "stdin": "",
  "cpu_time_limit": 2,
  "memory_limit": 64000
}
*/

// ===============================
// 5. GET /submissions/{token} - Buscar resultado por token
// ===============================
/*
GET https://judge0-ce.p.rapidapi.com/submissions/{{token}}?base64_encoded=false
Headers:
- Content-Type: application/json

Substitua {{token}} pelo token retornado da submissão
*/

// ===============================
// Códigos de Linguagem Principais:
// ===============================
/*
50  - C (GCC 9.2.0)
54  - C++ (GCC 9.2.0) 
62  - Java (OpenJDK 13.0.1)
63  - JavaScript (Node.js 12.14.0)
71  - Python (3.8.1)
74  - TypeScript (3.7.4)
*/

// ===============================
// Status IDs Principais:
// ===============================
/*
1  - In Queue
2  - Processing  
3  - Accepted
4  - Wrong Answer
5  - Time Limit Exceeded
6  - Compilation Error
7  - Runtime Error (SIGSEGV)
11 - Runtime Error (NZEC)
13 - Internal Error
*/ 