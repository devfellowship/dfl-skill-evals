import { submitToJudge0, Judge0Submission, getLanguages, getSubmission, getStatuses, getAbout } from '../services/judge.service.js'

async function testSubmission() {
  console.log('🔍 Testando submissão Judge0...')
  
  const payload: Judge0Submission = {
    source_code: `function soma(a, b) { return a + b; }\nconsole.log(soma(2, 3));`,
    language_id: 63, // 63 = JavaScript (Node.js) no Judge0
    stdin: '',
    expected_output: '5\n',
    cpu_time_limit: 2,
    memory_limit: 64000,
  }

  try {
    const result = await submitToJudge0(payload)
    console.log('Resultado Judge0:', result)
    return result.token
  } catch (error) {
    console.error('Erro ao enviar para Judge0:', error)
    return null
  }
}

async function testGetLanguages() {
  console.log('🌐 Buscando linguagens suportadas...')
  try {
    const languages = await getLanguages()
    console.log('Linguagens disponíveis:', languages.length)
    console.log('Primeiras 5 linguagens:', languages.slice(0, 5))
  } catch (error) {
    console.error('Erro ao buscar linguagens:', error)
  }
}

async function testGetStatuses() {
  console.log('📊 Buscando status de execução...')
  try {
    const statuses = await getStatuses()
    console.log('Status disponíveis:', statuses)
  } catch (error) {
    console.error('Erro ao buscar status:', error)
  }
}

async function testGetAbout() {
  console.log('ℹ️ Buscando informações da instância Judge0...')
  try {
    const about = await getAbout()
    console.log('Informações Judge0:', about)
  } catch (error) {
    console.error('Erro ao buscar informações:', error)
  }
}

async function testGetSubmission(token: string) {
  console.log(`🔎 Buscando submissão ${token}...`)
  try {
    const submission = await getSubmission(token)
    console.log('Detalhes da submissão:', submission)
  } catch (error) {
    console.error('Erro ao buscar submissão:', error)
  }
}

async function main() {
  console.log('🚀 Iniciando testes Judge0...\n')
  
  // Teste 1: Informações da instância
  await testGetAbout()
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Teste 2: Linguagens suportadas
  await testGetLanguages()
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Teste 3: Status disponíveis
  await testGetStatuses()
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Teste 4: Submissão de código
  const token = await testSubmission()
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Teste 5: Busca detalhes da submissão (se token estiver disponível)
  if (token) {
    await testGetSubmission(token)
  }
  
  console.log('\n✅ Testes concluídos!')
}

main()
