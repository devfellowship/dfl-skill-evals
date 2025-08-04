#!/bin/bash

echo "🧪 Teste simples do Judge0..."
echo "=============================="

# Teste 1: Código JavaScript simples
echo ""
echo "📝 Testando código JavaScript simples..."
SIMPLE_RESULT=$(curl -s -X POST "http://localhost:2358/submissions?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code": "console.log(\"Hello World\");", "language_id": 54}')

echo "Resultado simples:"
echo "$SIMPLE_RESULT" | grep -E '"status"|"stdout"|"stderr"|"compile_output"'

# Teste 2: Código com função
echo ""
echo "📝 Testando código com função..."
FUNCTION_RESULT=$(curl -s -X POST "http://localhost:2358/submissions?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"source_code": "function add(a, b) { return a + b; } console.log(add(2, 3));", "language_id": 54}')

echo "Resultado função:"
echo "$FUNCTION_RESULT" | grep -E '"status"|"stdout"|"stderr"|"compile_output"'

echo ""
echo "✅ Teste concluído!"