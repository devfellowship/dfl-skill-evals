#!/bin/bash

echo "=== DEBUG JUDGE0 - Verificando configurações ==="

# 1. Verifica se o Judge0 está rodando
echo "1. Verificando se o Judge0 está online..."
if curl -s http://localhost:2358/about > /dev/null; then
    echo "✅ Judge0 está online"
else
    echo "❌ Judge0 não está respondendo"
    exit 1
fi

# 2. Verifica as configurações atuais
echo ""
echo "2. Verificando configurações do Judge0..."
curl -s http://localhost:2358/about | jq '.' 2>/dev/null || echo "Resposta do /about: $(curl -s http://localhost:2358/about)"

# 3. Testa submissão simples
echo ""
echo "3. Testando submissão simples..."
SIMPLE_RESPONSE=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code":"console.log(2+3);","language_id":63,"stdin":""}')

echo "Resposta simples: $SIMPLE_RESPONSE"

# 4. Testa submissão com código maior
echo ""
echo "4. Testando submissão com código maior..."
LARGE_CODE=$(printf 'console.log("test");%.0s' {1..2000})
LARGE_RESPONSE=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d "{\"source_code\":\"$LARGE_CODE\",\"language_id\":63,\"stdin\":\"\"}")

echo "Resposta código grande: $LARGE_RESPONSE"

# 5. Verifica logs dos containers
echo ""
echo "5. Verificando logs do container server..."
docker-compose logs server | tail -5

echo ""
echo "6. Verificando logs do container workers..."
docker-compose logs workers | tail -5

# 7. Verifica variáveis de ambiente
echo ""
echo "7. Verificando variáveis de ambiente..."
docker-compose exec server env | grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)" || echo "Container não está rodando"

# 8. Testa com payload completo como o judge0.ts
echo ""
echo "8. Testando com payload completo..."
COMPLETE_PAYLOAD='{
  "source_code": "function soma(a, b) { return a + b; }console.log(JSON.stringify(soma(2, 3)));",
  "language_id": 63,
  "cpu_time_limit": 3,
  "wall_time_limit": 3,
  "memory_limit": 128000,
  "stack_limit": 128000,
  "max_file_size": 10485760,
  "enable_per_process_and_thread_time_limit": false,
  "enable_per_process_and_thread_memory_limit": false,
  "number_of_runs": 1
}'

COMPLETE_RESPONSE=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d "$COMPLETE_PAYLOAD")

echo "Resposta payload completo: $COMPLETE_RESPONSE"

echo ""
echo "=== DEBUG CONCLUÍDO ==="