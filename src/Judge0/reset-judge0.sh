#!/bin/bash

echo "=== RESET COMPLETO DO JUDGE0 ==="
echo "Parando todos os containers..."

# Parar todos os containers
docker-compose down

echo "Removendo volumes antigos..."
# Remover volumes problemáticos
docker volume rm judge0_judge0-box 2>/dev/null || true
docker volume rm judge0_judge0-db 2>/dev/null || true
docker volume rm judge0_judge0-redis 2>/dev/null || true

echo "Removendo containers antigos..."
# Remover containers antigos
docker rm -f $(docker ps -aq --filter "name=judge0") 2>/dev/null || true

echo "Criando novos volumes..."
# Criar novos volumes
docker volume create judge0_judge0-box
docker volume create judge0_judge0-db
docker volume create judge0_judge0-redis

echo "Configurando permissões do volume box..."
# Configurar permissões do volume box
docker run --rm -v judge0_judge0-box:/box alpine sh -c "
  mkdir -p /box &&
  chown -R 1000:1000 /box &&
  chmod -R 777 /box
"

echo "Iniciando containers..."
# Iniciar containers
docker-compose up -d

echo "Aguardando containers ficarem prontos..."
sleep 30

echo "Verificando status dos containers..."
docker-compose ps

echo "=== RESET CONCLUÍDO ==="
echo "Teste o Judge0 agora!"