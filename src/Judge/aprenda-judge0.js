// 🎓 APRENDENDO JUDGE0 - Passo a Passo
// ===========================================

console.log('🎯 === APRENDENDO JUDGE0 === 🎯\n')

// PASSO 1: Entender a API
// =======================
async function passo1_TestarConectividade() {
  console.log('📚 PASSO 1: Testando Conectividade')
  console.log('ℹ️  O Judge0 roda na porta 2358')
  
  try {
    const response = await fetch('http://localhost:2358/about')
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Judge0 está funcionando!')
      console.log('📋 Versão:', data.version)
      console.log('🏠 Homepage:', data.homepage)
    }
  } catch (error) {
    console.log('❌ Erro:', error.message)
  }
  console.log()
}

// PASSO 2: Ver linguagens disponíveis
// ===================================
async function passo2_VerLinguagens() {
  console.log('📚 PASSO 2: Linguagens Disponíveis')
  console.log('ℹ️  Cada linguagem tem um ID único')
  
  try {
    const response = await fetch('http://localhost:2358/languages')
    if (response.ok) {
      const languages = await response.json()
      console.log('✅ Total de linguagens:', languages.length)
      
      // Mostra algumas linguagens importantes
      const importantes = languages.filter(lang => 
        ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'].includes(lang.name)
      )
      
      if (importantes.length > 0) {
        console.log('🔥 Linguagens principais encontradas:')
        importantes.forEach(lang => {
          console.log(`   ${lang.id}: ${lang.name}`)
        })
      } else {
        console.log('⚠️  Nenhuma linguagem carregada ainda')
        console.log('💡 Isso é normal na primeira inicialização')
      }
    }
  } catch (error) {
    console.log('❌ Erro:', error.message)
  }
  console.log()
}

// PASSO 3: Primeiro código simples
// ================================
async function passo3_PrimeiroTeste() {
  console.log('📚 PASSO 3: Executando Primeiro Código')
  console.log('ℹ️  Vamos executar um "Hello World" em JavaScript')
  
  const codigo = `console.log("Hello World do Judge0!");`
  
  const submissao = {
    source_code: codigo,
    language_id: 63, // JavaScript (Node.js)
    stdin: '',        // Entrada (vazia neste caso)
  }
  
  try {
    console.log('📤 Enviando código para execução...')
    console.log('💻 Código:', codigo)
    
    const response = await fetch('http://localhost:2358/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissao)
    })
    
    if (response.ok) {
      const resultado = await response.json()
      console.log('✅ Execução concluída!')
      console.log('📋 Status:', resultado.status?.description || 'Unknown')
      console.log('📤 Saída:', resultado.stdout || 'Nenhuma saída')
      
      if (resultado.stderr) {
        console.log('⚠️  Erro:', resultado.stderr)
      }
    } else {
      console.log('❌ Erro HTTP:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  console.log()
}

// EXECUTAR TODOS OS PASSOS
// ========================
async function executarTodosTestes() {
  await passo1_TestarConectividade()
  await passo2_VerLinguagens()
  await passo3_PrimeiroTeste()
  
  console.log('🎉 Parabéns! Você aprendeu os conceitos básicos do Judge0!')
  console.log('💡 Próximos passos: testes com entrada, múltiplas linguagens, etc.')
}

// Executar
executarTodosTestes() 