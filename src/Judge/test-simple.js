// Teste simples para verificar conectividade com Judge0
async function testJudge0Connection() {
  console.log('🔍 Testando conexão com Judge0...')
  
  try {
    // Teste 1: GET /about (endpoint mais simples)
    console.log('📡 Testando GET /about...')
    const aboutResponse = await fetch('http://localhost:2358/about')
    console.log('Status /about:', aboutResponse.status)
    
    if (aboutResponse.ok) {
      const aboutData = await aboutResponse.json()
      console.log('✅ Dados /about:', aboutData)
    } else {
      console.log('❌ Erro /about:', aboutResponse.statusText)
    }
    
    // Teste 2: GET /languages
    console.log('\n📡 Testando GET /languages...')
    const languagesResponse = await fetch('http://localhost:2358/languages')
    console.log('Status /languages:', languagesResponse.status)
    
    if (languagesResponse.ok) {
      const languagesData = await languagesResponse.json()
      console.log('✅ Total de linguagens:', languagesData.length)
      console.log('✅ Primeiras 3 linguagens:', languagesData.slice(0, 3))
    } else {
      console.log('❌ Erro /languages:', languagesResponse.statusText)
    }
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message)
    console.log('\n🔧 Possíveis soluções:')
    console.log('1. Verifique sua conexão com a internet')
    console.log('2. Tente desabilitar antivírus/firewall temporariamente')
    console.log('3. Teste em outro navegador')
    console.log('4. Use VPN se houver bloqueio regional')
  }
}

// Executar teste
testJudge0Connection() 