# DevShaper - Plataforma de Desafios de Programação

Uma plataforma moderna para resolver desafios de programação com suporte a múltiplas linguagens usando Judge0.

## 🚀 Configuração com VM Ubuntu

### Pré-requisitos
- VM Ubuntu com Docker instalado
- Judge0 rodando na porta 2358
- Rede configurada entre host e VM

### Configuração Rápida

#### No Windows (PowerShell):
```powershell
.\setup-vm-connection.ps1
```

#### No Linux/Mac:
```bash
chmod +x setup-vm-connection.sh
./setup-vm-connection.sh
```

### Configuração Manual

1. **Descubra o IP da sua VM:**
   ```bash
   # Na VM Ubuntu
   ip addr show
   ```

2. **Crie o arquivo `.env.local`:**
   ```env
   JUDGE0_API_URL=http://SEU_IP_DA_VM:2358
   NEXT_PUBLIC_JUDGE0_URL=http://SEU_IP_DA_VM:2358
   ```

3. **Teste a conexão:**
   ```bash
   export VM_IP=SEU_IP_DA_VM
   node test-vm-connection.js
   ```

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Testar conexão com Judge0
node test-vm-connection.js
```

## 📁 Estrutura do Projeto

- `src/app/api/execute-code/` - API para execução de código
- `src/lib/judge0-config.ts` - Configuração do Judge0
- `src/Judge0/` - Configurações do Docker para Judge0
- `test-vm-connection.js` - Script para testar conexão

## 🔧 Troubleshooting

### Problemas de Conexão
1. Verifique se a VM está rodando
2. Confirme o IP da VM
3. Teste se a porta 2358 está aberta
4. Verifique se o Judge0 está rodando na VM

### Comandos Úteis na VM
```bash
# Verificar se Judge0 está rodando
docker ps

# Ver logs do Judge0
docker logs judge0-server

# Reiniciar Judge0
docker-compose restart
```

## 📝 Licença

MIT