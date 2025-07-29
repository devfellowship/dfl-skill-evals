# Judge0 Setup e Configuração

## Problema Resolvido
O erro `"max_file_size":["must be less than or equal to 4096"]` foi corrigido através das seguintes alterações:

### 1. Arquivo `judge0.conf`
- ✅ `MAX_FILE_SIZE=10485760` (10MB)
- ✅ `MAX_OUTPUT_SIZE=10485760` (10MB)
- ✅ `ENABLE_ADDITIONAL_FILES=true`
- ✅ Removido duplicação de configurações

### 2. Arquivo `docker-compose.yml`
- ✅ Adicionado `env_file: - ./judge0.conf`
- ✅ Corrigido versão da imagem para `v1.13.0-extra`
- ✅ Adicionado volume para arquivo de configuração
- ✅ Removido erro de sintaxe

## Scripts Disponíveis

### 1. `restart-and-test.sh`
Reinicia completamente o Judge0 e executa testes:
```bash
chmod +x restart-and-test.sh
./restart-and-test.sh
```

### 2. `test-config.sh`
Testa as configurações atuais:
```bash
chmod +x test-config.sh
./test-config.sh
```

### 3. `check-config.sh`
Verifica configurações sem reiniciar:
```bash
chmod +x check-config.sh
./check-config.sh
```

## Como Usar

### Passo 1: Tornar scripts executáveis
```bash
cd src/Judge
chmod +x *.sh
```

### Passo 2: Reiniciar e testar
```bash
./restart-and-test.sh
```

### Passo 3: Verificar se funcionou
```bash
./check-config.sh
```

## Teste Manual

Para testar manualmente:
```bash
curl -i -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code":"console.log(2+3);","language_id":63,"stdin":""}'
```

## Troubleshooting

### Se ainda houver erro de tamanho:
1. Verifique se os containers foram reiniciados: `docker-compose ps`
2. Verifique as configurações: `./check-config.sh`
3. Force reinicialização: `docker-compose down -v && docker-compose up -d --build`

### Se a API não responder:
1. Verifique logs: `docker-compose logs server`
2. Aguarde mais tempo para inicialização
3. Verifique se a porta 2358 está livre

## Configurações Atuais
- **MAX_FILE_SIZE**: 10MB (10485760 bytes)
- **MAX_OUTPUT_SIZE**: 10MB (10485760 bytes)
- **ENABLE_ADDITIONAL_FILES**: true
- **Versão**: v1.13.0-extra 