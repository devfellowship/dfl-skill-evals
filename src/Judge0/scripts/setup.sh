#!/bin/bash

# Script de configuração do Judge0
echo "Configurando Judge0..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "Erro: Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "Parando containers existentes..."
docker-compose down

# Construir e iniciar os containers
echo "Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar o Judge0 estar pronto
echo "Aguardando Judge0 estar pronto..."
sleep 30

# Verificar se o Judge0 está respondendo
echo "Verificando se Judge0 está funcionando..."
curl -f http://localhost:2358/ || echo "Aviso: Judge0 pode não estar totalmente pronto ainda"

echo "Configuração concluída!"
echo "Judge0 deve estar disponível em: http://localhost:2358"







