// Test simple Python execution
const http = require('http');

const pythonCode = `print("[0, 1]")`;

async function testPython() {
    console.log('Testing Python code:', pythonCode);
    console.log('Code length:', pythonCode.length);
    
    const postData = JSON.stringify({
        source_code: pythonCode,
        language_id: 71 // Python
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
            console.log('HTTP Status:', res.statusCode);
            
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('Raw response:', data);
                
                try {
                    const result = JSON.parse(data);
                    
                    if (result.stdout) {
                        console.log('✅ SUCCESS! Output:', result.stdout);
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
                    console.error('Parse error:', error.message);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Request error:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

testPython().catch(console.error); 