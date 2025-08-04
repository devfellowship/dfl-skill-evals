const fetch = require('node-fetch');

async function testJudge0Languages() {
  console.log('🔍 Testando configuração do Judge0...\n');
  
  try {
    // 1. Verificar se o servidor está rodando
    console.log('📡 Verificando se o servidor está rodando...');
    const healthResponse = await fetch('http://localhost:2358/health');
    if (healthResponse.ok) {
      console.log('✅ Servidor está rodando!');
    } else {
      console.log('❌ Servidor não está respondendo');
      return;
    }
    
    // 2. Listar todas as linguagens disponíveis
    console.log('\n📋 Listando linguagens disponíveis...');
    const languagesResponse = await fetch('http://localhost:2358/languages');
    const languages = await languagesResponse.json();
    
    console.log('✅ Linguagens disponíveis:');
    languages.forEach(lang => {
      console.log(`   ID ${lang.id}: ${lang.name} (${lang.extension})`);
    });
    
    // 3. Testar Python (ID 71)
    console.log('\n🐍 Testando Python (ID 71)...');
    const pythonTest = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: 'print("Hello World")',
        language_id: 71
      })
    });
    
    const pythonResult = await pythonTest.json();
    console.log('Resultado Python:', pythonResult);
    
    // 4. Testar JavaScript (ID 54)
    console.log('\n🟨 Testando JavaScript (ID 54)...');
    const jsTest = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: 'console.log("Hello World");',
        language_id: 54
      })
    });
    
    const jsResult = await jsTest.json();
    console.log('Resultado JavaScript:', jsResult);
    
    // 5. Encontrar o ID correto do JavaScript
    console.log('\n🔍 Procurando JavaScript...');
    const jsLanguage = languages.find(lang => 
      lang.name.toLowerCase().includes('javascript') || 
      lang.name.toLowerCase().includes('node')
    );
    
    if (jsLanguage) {
      console.log(`✅ JavaScript encontrado: ID ${jsLanguage.id} - ${jsLanguage.name}`);
    } else {
      console.log('❌ JavaScript não encontrado na lista');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testJudge0Languages();