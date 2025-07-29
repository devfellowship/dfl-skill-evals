const http = require('http');

// Teste simples para verificar se o Judge0 está funcionando
async function testSimpleSubmission() {
    console.log('🧪 Testando submissão simples...');
    
    const simpleCode = `console.log("Hello World");`;
    
    const payload = {
        source_code: simpleCode,
        language_id: 63, // JavaScript
        stdin: "",
        cpu_time_limit: 3,
        memory_limit: 128000
    };
    
    console.log('📝 Código:', simpleCode);
    console.log('📏 Tamanho do código:', simpleCode.length, 'caracteres');
    console.log('📦 Tamanho do payload:', JSON.stringify(payload).length, 'caracteres');
    
    const postData = JSON.stringify(payload);
    
    const options = {
        hostname: 'localhost',
        port: 2358,
        path: '/submissions?base64_encoded=false&wait=true',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('📊 Status Code:', res.statusCode);
                console.log('📋 Headers:', res.headers);
                console.log('📥 Response:', data);
                
                if (res.statusCode === 200) {
                    try {
                        const result = JSON.parse(data);
                        console.log('✅ Sucesso!');
                        console.log('📤 Output:', result.stdout);
                        console.log('⏱️  Time:', result.time);
                        console.log('💾 Memory:', result.memory);
                        resolve(result);
                    } catch (e) {
                        console.log('❌ Erro ao parsear JSON:', e);
                        reject(e);
                    }
                } else {
                    console.log('❌ Erro HTTP:', res.statusCode);
                    console.log('📄 Response:', data);
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (e) => {
            console.log('❌ Erro de conexão:', e.message);
            reject(e);
        });
        
        req.write(postData);
        req.end();
    });
}

// Teste com código maior para verificar o limite
async function testLargeSubmission() {
    console.log('\n🧪 Testando submissão com código maior...');
    
    // Cria um código com 5000 caracteres
    const largeCode = `console.log("test");`.repeat(1000);
    
    const payload = {
        source_code: largeCode,
        language_id: 63, // JavaScript
        stdin: "",
        cpu_time_limit: 3,
        memory_limit: 128000
    };
    
    console.log('📝 Código tamanho:', largeCode.length, 'caracteres');
    console.log('📦 Payload tamanho:', JSON.stringify(payload).length, 'caracteres');
    
    const postData = JSON.stringify(payload);
    
    const options = {
        hostname: 'localhost',
        port: 2358,
        path: '/submissions?base64_encoded=false&wait=true',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('📊 Status Code:', res.statusCode);
                console.log('📥 Response:', data);
                
                if (res.statusCode === 200) {
                    try {
                        const result = JSON.parse(data);
                        console.log('✅ Sucesso com código grande!');
                        resolve(result);
                    } catch (e) {
                        console.log('❌ Erro ao parsear JSON:', e);
                        reject(e);
                    }
                } else {
                    console.log('❌ Erro HTTP:', res.statusCode);
                    console.log('📄 Response:', data);
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (e) => {
            console.log('❌ Erro de conexão:', e.message);
            reject(e);
        });
        
        req.write(postData);
        req.end();
    });
}

// Executa os testes
async function runTests() {
    try {
        console.log('🚀 Iniciando testes de submissão...\n');
        
        // Teste 1: Código simples
        await testSimpleSubmission();
        
        // Teste 2: Código maior
        await testLargeSubmission();
        
        console.log('\n✅ Todos os testes concluídos!');
        
    } catch (error) {
        console.error('❌ Erro nos testes:', error.message);
    }
}

runTests();