const fetch = require('node-fetch');

async function testSimpleJudge0() {
  console.log('🧪 Teste simples do Judge0...\n');
  
  try {
    // Teste 1: Código JavaScript simples
    console.log('📝 Testando código JavaScript simples...');
    const simpleTest = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: 'console.log("Hello World");',
        language_id: 54
      })
    });
    
    const simpleResult = await simpleTest.json();
    console.log('Resultado simples:', simpleResult);
    
    // Teste 2: Código com função
    console.log('\n📝 Testando código com função...');
    const functionTest = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: `
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
`,
        language_id: 54
      })
    });
    
    const functionResult = await functionTest.json();
    console.log('Resultado função:', functionResult);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testSimpleJudge0();