Write-Host "=== Testando configurações do Judge0 ===" -ForegroundColor Green

# Aguarda os containers iniciarem
Write-Host "Aguardando containers iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Testa se o Judge0 está respondendo
Write-Host "Testando se o Judge0 está online..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:2358/about" -Method Get
    Write-Host "✅ Judge0 está online" -ForegroundColor Green
} catch {
    Write-Host "❌ Judge0 não está respondendo" -ForegroundColor Red
    exit 1
}

# Testa com um código pequeno primeiro
Write-Host "Testando com código pequeno..." -ForegroundColor Yellow
$body = @{
    source_code = "console.log(2+3);"
    language_id = 63
    stdin = ""
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:2358/submissions?base64_encoded=false&wait=true" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Resposta: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "Erro na primeira requisição: $($_.Exception.Message)" -ForegroundColor Red
}

# Testa com um código maior para verificar o limite
Write-Host "Testando com código maior..." -ForegroundColor Yellow
$largeCode = "console.log('test');" * 1000
$body2 = @{
    source_code = $largeCode
    language_id = 63
    stdin = ""
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:2358/submissions?base64_encoded=false&wait=true" -Method Post -Body $body2 -ContentType "application/json"
    Write-Host "Resposta para código grande: $($response2 | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "Erro na segunda requisição: $($_.Exception.Message)" -ForegroundColor Red
}

# Verifica logs dos containers
Write-Host "=== Logs do container server ===" -ForegroundColor Green
docker-compose logs server | Select-Object -Last 10

Write-Host "=== Logs do container workers ===" -ForegroundColor Green
docker-compose logs workers | Select-Object -Last 10

Write-Host "=== Configurações atuais ===" -ForegroundColor Green
docker-compose exec server env | Select-String -Pattern "(MAX_FILE_SIZE|MAX_OUTPUT_SIZE|ENABLE_ADDITIONAL_FILES)" 