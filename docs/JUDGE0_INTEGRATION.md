# Judge0 - Arquivos de Compilação e Execução

Este documento explica todos os arquivos relacionados ao sistema de execução de código Judge0 no projeto DevShaper.

## 📁 Estrutura dos Arquivos

### 🐳 **src/Judge0/docker-compose.yml**
Arquivo principal que define todos os serviços necessários:
- **PostgreSQL**: Banco de dados para submissões
- **Redis**: Cache e fila de processamento  
- **Server**: API principal do Judge0 (porta 2358)
- **Worker**: Processamento assíncrono de submissões

### ⚙️ **src/Judge0/judge0.conf**
Configurações do sistema Judge0:
- Limites de memória e CPU
- Configurações de segurança
- Timeouts de execução

### 📦 **src/Judge0/box/**
Diretório que contém os ambientes de execução:
- Imagens Docker para cada linguagem
- Configurações de isolamento
- Sandboxes de segurança

### 🔧 **src/Judge0/lib/judge.ts**
Interface TypeScript para comunicação com o Judge0:
- Funções para executar código
- Tratamento de respostas
- Gerenciamento de submissões

### 🚀 **src/Judge0/scripts/**
Scripts utilitários:
- `reset-judge0.sh`: Reinicia todos os containers
- `restart-judge0.ps1`: Script PowerShell para Windows
- `quick-test.sh`: Teste rápido da conexão

## 🔧 **Arquivos de Configuração (src/lib/)**

### **judge0-config.ts**
Configurações principais do Judge0:
- URLs da API
- IDs das linguagens suportadas
- Limites de execução
- Funções de descoberta automática de linguagens

### **judge0.ts**
Exportações principais do sistema:
- `executeCodeWithJudge0`
- `checkRateLimit`
- `isLanguageSupported`

### **execution/judge0-executor.ts**
Executor principal do código:
- Processamento de TypeScript → JavaScript
- Execução de casos de teste
- Tratamento de erros de compilação

### **execution/language-manager.ts**
Gerenciamento de linguagens:
- Cache de linguagens suportadas
- Verificação de compatibilidade
- Mapeamento de IDs

### **execution/code-processor.ts**
Processamento de código:
- Transpilação TypeScript
- Criação de código executável
- Adaptação para diferentes linguagens

### **execution/result-parser.ts**
Parser de resultados:
- Interpretação das respostas do Judge0
- Mapeamento de status
- Tratamento de erros

### **execution/rate-limiter.ts**
Controle de taxa de execução:
- Limitação de requisições
- Prevenção de spam
- Controle de uso

## 🚀 Como Usar

### 1. **Iniciar o Sistema**
```bash
cd src/Judge0
docker-compose up -d
```

### 2. **Verificar Status**
```bash
docker-compose ps
```

### 3. **Parar o Sistema**
```bash
docker-compose down -v
```

### 4. **Reiniciar (se necessário)**
```bash
./reset-judge0.sh  # Linux/Mac
./restart-judge0.ps1  # Windows
```

## 🔍 **Teste de Conexão**

```bash
curl http://localhost:2358/languages
```

Se retornar uma lista de linguagens, está funcionando! ✅

## ⚠️ **Problemas Comuns**

### Erro de pasta cgroup (Windows)
- Use WSL2 ou VM Linux
- O Docker no Windows pode ter problemas com isolamento

### Porta 2358 ocupada
```bash
netstat -ano | findstr :2358  # Windows
lsof -i :2358                 # Linux/Mac
```

### Container não inicia
```bash
docker-compose logs server
docker-compose logs worker
```

## 🌐 **URLs Importantes**

- **API Judge0**: `http://localhost:2358`
- **Health Check**: `http://localhost:2358/about`
- **Linguagens**: `http://localhost:2358/languages`

## 🔄 **Fluxo de Execução**

1. **Código enviado** → `judge0-executor.ts`
2. **Processamento** → `code-processor.ts` (se TypeScript)
3. **Execução** → API Judge0 via `judge0-config.ts`
4. **Resultado** → `result-parser.ts`
5. **Retorno** → Interface da aplicação

## 📚 **Recursos Adicionais**

- [Documentação Oficial Judge0](https://judge0.com/docs)
- [Docker Hub Judge0](https://hub.docker.com/r/judge0/judge0)
- [GitHub Judge0](https://github.com/judge0/judge0)

---

**💡 Dica**: O Judge0 é essencial para o funcionamento da aplicação. Sem ele, não é possível executar código dos desafios!
