# ChallengePage Components

## Visão Geral

Este diretório contém os componentes componentizados para a página de challenge, substituindo a estrutura anterior de pasta única.

## Componentes

### ChallengePage.tsx
Componente principal que gerencia o estado e lógica da página de challenge.

**Props:**
- `challengeId: string` - ID do challenge a ser exibido

**Funcionalidades:**
- Gerencia estado do código e linguagem
- Integra com hooks de challenge e execução
- Renderiza estados de loading e erro
- Adapta dados do banco para o formato dos componentes

### ChallengeLayout.tsx
Componente de layout que organiza a estrutura visual da página.

**Props:**
- `title: string` - Título do challenge
- `problem: ChallengeProblem` - Dados do problema
- `code: string` - Código atual
- `language: string` - Linguagem selecionada
- `compilationError: string | null` - Erro de compilação
- `isLoading: boolean` - Estado de carregamento
- `progress: number` - Progresso dos testes
- `results: ChallengeResults` - Resultados dos testes
- Callbacks para mudanças de código, execução, etc.

## Estrutura de Arquivos

```
ChallengePage/
├── ChallengePage.tsx      # Componente principal
├── ChallengeLayout.tsx    # Layout da página
├── index.ts              # Exportações
└── README.md             # Esta documentação
```

## Uso

```tsx
import { ChallengePage } from '@/components/organisms/ChallengePage'

// Em uma rota
<ChallengePage challengeId="two-sum" />

// Ou usando o layout diretamente
<ChallengeLayout
  title="Two Sum"
  problem={problemData}
  code={code}
  // ... outras props
/>
```

## Vantagens da Componentização

1. **Separação de Responsabilidades**: Cada componente tem uma função específica
2. **Reutilização**: Componentes podem ser usados em outras páginas
3. **Manutenibilidade**: Fácil de modificar e testar
4. **Consistência**: Segue o padrão do resto da aplicação
5. **Tipagem**: Interfaces TypeScript bem definidas
