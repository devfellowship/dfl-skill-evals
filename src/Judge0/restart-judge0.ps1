# Script para reiniciar os containers do Judge0
Write-Host "🔄 Reiniciando containers do Judge0..." -ForegroundColor Yellow

# Parar containers
Write-Host "⏹️  Parando containers..." -ForegroundColor Cyan
wsl docker-compose -f /mnt/c/Users/Samuel\ Stefano/Desktop/devshaper-app/src/Judge0/docker-compose.yml down

# Remover volume problemático
Write-Host "🗑️  Removendo volume problemático..." -ForegroundColor Cyan
wsl docker volume rm judge0_judge0-box 2>$null

# Iniciar containers
Write-Host "▶️  Iniciando containers..." -ForegroundColor Cyan
wsl docker-compose -f /mnt/c/Users/Samuel\ Stefano/Desktop/devshaper-app/src/Judge0/docker-compose.yml up -d

# Aguardar containers iniciarem
Write-Host "⏳ Aguardando containers iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar status
Write-Host "📊 Verificando status dos containers..." -ForegroundColor Cyan
wsl docker-compose -f /mnt/c/Users/Samuel\ Stefano/Desktop/devshaper-app/src/Judge0/docker-compose.yml ps

Write-Host "✅ Reinicialização concluída!" -ForegroundColor Green
Write-Host "🧪 Teste o botão 'Run Code' agora!" -ForegroundColor Green 