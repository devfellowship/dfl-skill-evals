#!/bin/bash

echo "=== Verificando configurações do Judge0 ==="

# Verifica se os containers estão rodando
echo "Status dos containers:"
docker-compose ps

echo ""
echo "=== Configurações do arquivo judge0.conf ==="
grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)" judge0.conf

echo ""
echo "=== Configurações do docker-compose.yml ==="
grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)" docker-compose.yml

echo ""
echo "=== Configurações atuais dos containers ==="
if docker-compose ps | grep -q "Up"; then
    echo "Server container:"
    docker-compose exec server env | grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)"
    
    echo ""
    echo "Workers container:"
    docker-compose exec workers env | grep -E "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)"
else
    echo "❌ Containers não estão rodando"
fi

echo ""
echo "=== Teste rápido de API ==="
if curl -s http://localhost:2358/about > /dev/null; then
    echo "✅ API está respondendo"
    
    # Testa com um código pequeno
    RESPONSE=$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
      -H "Content-Type: application/json" \
      -d '{"source_code":"console.log(2+3);","language_id":63,"stdin":""}')
    
    if echo "$RESPONSE" | grep -q "max_file_size"; then
        echo "❌ ERRO: Ainda há limite de tamanho de arquivo!"
        echo "Resposta: $RESPONSE"
    else
        echo "✅ Teste básico passou"
        echo "Resposta: $RESPONSE"
    fi
else
    echo "❌ API não está respondendo"
fi 