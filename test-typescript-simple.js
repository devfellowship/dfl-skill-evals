const http = require('http');

async function testTypeScript() {
  console.log('🧪 Testando TypeScript no Judge0...\n');
  
  const simpleCode = `function add(a: number, b: number): number {
    return a + b;
}

console.log(add(5, 3));`;

  const payload = {
    source_code: simpleCode,
    language_id: 74, // TypeScript
    stdin: "",
    cpu_time_limit: 3,
    wall_time_limit: 3,
    memory_limit: 128000,
    stack_limit: 128000,
    max_file_size: 4096,
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
    number_of_runs: 1
  };

  const postData = JSON.stringify(payload);

  const options = {
    hostname: 'localhost',
    port: 2358,
    path: '/submissions?wait=true',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  try {
    console.log('📝 Código TypeScript:');
    console.log(simpleCode);
    console.log('\n📦 Enviando para Judge0...');
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          console.log('\n📊 Resposta do Judge0:');
          console.log(JSON.stringify(result, null, 2));
          
          if (result.status.id === 3) {
            console.log('\n✅ Sucesso! TypeScript está funcionando.');
            console.log('📤 Output:', result.stdout);
          } else {
            console.log('\n❌ Erro de compilação ou execução.');
            console.log('🔧 Compile output:', result.compile_output);
            console.log('❌ Error:', result.stderr);
          }
        } catch (error) {
          console.error('❌ Erro ao parsear resposta:', error);
          console.log('📄 Resposta bruta:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição:', error);
    });

    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testTypeScript(); 