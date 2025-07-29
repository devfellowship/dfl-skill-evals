#!/bin/bash

echo "=== Reiniciando Judge0 com novas configurações ==="

# Para todos os containers
echo "Parando containers..."
docker-compose down

# Remove volumes para garantir configurações limpas
echo "Removendo volumes antigos..."
docker-compose down -v

# Reconstrói e inicia
echo "Reconstruindo e iniciando containers..."
docker-compose up -d --build

# Aguarda um pouco mais para garantir que tudo inicializou
echo "Aguardando inicialização completa..."
sleep 20

# Executa o teste
echo "Executando testes..."
./test-config.sh

echo "=== Processo concluído ===" 