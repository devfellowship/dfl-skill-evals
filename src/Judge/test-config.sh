#!/bin/bash

echo "=== Testando configurações do Judge0 ==="

# Verifica se o docker-compose está rodando
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Containers não estão rodando. Iniciando..."
    docker-compose up -d
    echo "Aguardando containers iniciarem..."
    sleep 15
fi

# Aguarda os containers iniciarem completamente
echo "Aguardando containers iniciarem..."
sleep 10

# Testa se o Judge0 está respondendo
echo "Testando se o Judge0 está online..."
if curl -s http://localhost:2358/about > /dev/null; then
    echo "✅ Judge0 está online"
else
    echo "❌ Judge0 não está respondendo"
    echo "Verificando logs..."
    docker-compose logs server | tail -10
    exit 1
fi

# Testa com um código pequeno primeiro
echo "Testando com código pequeno..."
RESPONSE=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code":"console.log(2+3);","language_id":63,"stdin":""}')

echo "Resposta para código pequeno: $RESPONSE"

# Verifica se houve erro de tamanho
if echo "$RESPONSE" | grep -q "max_file_size"; then
    echo "❌ ERRO: Ainda há limite de tamanho de arquivo!"
    echo "Verificando configurações..."
    docker-compose exec server env | grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE)"
    exit 1
fi

# Testa com um código maior para verificar o limite
echo "Testando com código maior..."
LARGE_CODE=$(printf 'console.log("test");%.0s' {1..1000})
RESPONSE2=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d "{\"source_code\":\"$LARGE_CODE\",\"language_id\":63,\"stdin\":\"\"}")

echo "Resposta para código grande: $RESPONSE2"

# Testa com um código ainda maior (mais de 10KB)
echo "Testando com código muito grande (>10KB)..."
VERY_LARGE_CODE=$(printf 'console.log("test");%.0s' {1..5000})
RESPONSE3=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d "{\"source_code\":\"$VERY_LARGE_CODE\",\"language_id\":63,\"stdin\":\"\"}")

echo "Resposta para código muito grande: $RESPONSE3"

# Verifica logs dos containers
echo "=== Logs do container server ==="
docker-compose logs server | tail -10

echo "=== Logs do container workers ==="
docker-compose logs workers | tail -10

echo "=== Configurações atuais ==="
docker-compose exec server env | grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)"

echo "=== Tamanho dos códigos testados ==="
echo "Código pequeno: $(echo 'console.log(2+3);' | wc -c) bytes"
echo "Código grande: $(echo "$LARGE_CODE" | wc -c) bytes"
echo "Código muito grande: $(echo "$VERY_LARGE_CODE" | wc -c) bytes"

echo "=== Teste concluído ===" 