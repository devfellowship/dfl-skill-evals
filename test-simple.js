const http = require('http');

// Teste mais simples possível
const simpleCode = `console.log("Hello World");`;

async function testSimple() {
    console.log('🧪 Testando Judge0 com código simples...');
    console.log('📝 Código:', simpleCode);
    console.log('📏 Tamanho:', simpleCode.length, 'caracteres');
    
    const postData = JSON.stringify({
        source_code: simpleCode,
        language_id: 63 // JavaScript
    });

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
            console.log('📡 Status HTTP:', res.statusCode);
            
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('📥 Resposta completa:', data);
                
                try {
                    const result = JSON.parse(data);
                    
                    if (result.stdout) {
                        console.log('✅ SUCESSO! Saída:', result.stdout);
                    }
                    if (result.stderr) {
                        console.log('❌ Stderr:', result.stderr);
                    }
                    if (result.status) {
                        console.log('📊 Status:', result.status.id, '-', result.status.description);
                    }
                    if (result.compile_output) {
                        console.log('🔧 Compile output:', result.compile_output);
                    }
                    
                    resolve(result);
                } catch (error) {
                    console.error('❌ Erro ao parsear resposta:', error.message);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Erro de conexão:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

testSimple().catch(console.error); 