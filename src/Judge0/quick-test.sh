#!/bin/bash

echo "🧪 Teste Rápido do Judge0"
echo "=========================="

# Testar se o servidor está rodando
echo "1. Verificando se o servidor está rodando..."
if curl -s http://localhost:2358/health > /dev/null; then
    echo "✅ Servidor está rodando!"
else
    echo "❌ Servidor não está respondendo"
    echo "   Execute: docker-compose up -d"
    exit 1
fi

# Listar linguagens
echo ""
echo "2. Listando linguagens disponíveis..."
LANGUAGES=$(curl -s http://localhost:2358/languages)
echo "Total de linguagens: $(echo "$LANGUAGES" | grep -o '"id"' | wc -l)"
echo "Primeiras 5 linguagens:"
echo "$LANGUAGES" | grep -E '"id"|"name"' | head -10

# Testar Python
echo ""
echo "3. Testando Python (ID 71)..."
PYTHON_RESULT=$(curl -s -X POST "http://localhost:2358/submissions?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code": "print(\"Hello World\")", "language_id": 71}')

echo "Status Python:"
echo "$PYTHON_RESULT" | grep -E '"status"|"stdout"|"stderr"' | head -6

# Testar JavaScript (tentar diferentes IDs)
echo ""
echo "4. Testando JavaScript..."
echo "Tentando ID 54..."
JS_RESULT_54=$(curl -s -X POST "http://localhost:2358/submissions?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code": "console.log(\"Hello World\");", "language_id": 54}')

echo "Status JavaScript (ID 54):"
echo "$JS_RESULT_54" | grep -E '"status"|"stdout"|"stderr"' | head -6

echo ""
echo "Tentando ID 63..."
JS_RESULT_63=$(curl -s -X POST "http://localhost:2358/submissions?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code": "console.log(\"Hello World\");", "language_id": 63}')

echo "Status JavaScript (ID 63):"
echo "$JS_RESULT_63" | grep -E '"status"|"stdout"|"stderr"' | head -6

echo ""
echo "✅ Teste concluído!"
echo ""
echo "💡 Para ver resultados completos, instale jq:"
echo "   sudo apt-get install jq"