# DevShaper Design System

Este é o Design System do DevShaper, construído usando Atomic Design e Storybook.

## Estrutura

O Design System é organizado seguindo a metodologia Atomic Design:

```
components/
├── atoms/          # Componentes básicos e indivisíveis
├── molecules/      # Composições de átomos
└── organisms/      # Composições complexas de moléculas e átomos
```

### Átomos

Componentes básicos e indivisíveis:

- `Avatar`: Avatares de usuário com fallback
- `Button`: Botões com diferentes variantes e estados
- `Input`: Campos de entrada de texto
- `Label`: Rótulos para campos de formulário
- `Badge`: Badges e tags
- `Checkbox`: Caixas de seleção
- `Switch`: Interruptores de alternância
- `Slider`: Controles deslizantes
- `Progress`: Barras de progresso
- `Separator`: Separadores e divisores
- `Textarea`: Áreas de texto
- `Toggle`: Botões de alternância
- `Tooltip`: Dicas e tooltips

### Moléculas

Composições de átomos:

- `Card`: Cards e containers
- `Form`: Elementos de formulário
- `Select`: Campos de seleção
- `Tabs`: Abas e navegação
- `Breadcrumb`: Navegação em migalhas
- `Pagination`: Controles de paginação
- `Alert`: Alertas e notificações
- `AlertDialog`: Diálogos de alerta
- `HoverCard`: Cards que aparecem ao passar o mouse
- `Popover`: Popovers e tooltips avançados
- `Table`: Tabelas e grids
- `InputOTP`: Campos de entrada OTP

### Organismos

Composições complexas:

- `SearchDialog`: Diálogo avançado de pesquisa
- `Sidebar`: Barras laterais
- `Navigation Menu`: Menus de navegação
- `Dropdown Menu`: Menus suspensos
- `Context Menu`: Menus de contexto
- `Command`: Paletas de comando
- `Dialog`: Diálogos e modais
- `Drawer`: Gavetas e painéis laterais
- `Sheet`: Folhas e painéis
- `Carousel`: Carrosséis e sliders
- `Chart`: Gráficos e visualizações
- `MenuBar`: Barras de menu

## Uso

Cada componente está em sua própria pasta com a seguinte estrutura:

```
ComponentName/
├── ComponentName.tsx     # Implementação do componente
├── ComponentName.stories.tsx  # Stories do Storybook
└── index.ts             # Arquivo de exportação
```

Para usar um componente:

```tsx
import { Button, Avatar, Card } from "@/components"

function MyComponent() {
  return (
    <Card>
      <Avatar>
        <AvatarImage src="/user.jpg" />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Button>Click me</Button>
    </Card>
  )
}
```

## Storybook

O Storybook é usado para documentar e testar os componentes. Para executar:

```bash
pnpm run storybook
```

## Arquitetura

O projeto segue a arquitetura Atomic Design com:

- **Consistência**: Todos os componentes seguem o mesmo padrão de estrutura
- **Reutilização**: Átomos são compostos em moléculas e organismos
- **Manutenibilidade**: Cada componente é isolado e testável
- **Tipagem**: TypeScript estrito em todos os componentes

## Contribuindo

1. Crie uma nova branch para suas alterações
2. Siga a estrutura de pastas existente
3. Adicione stories para novos componentes
4. Atualize a documentação quando necessário
5. Faça um pull request

## Tecnologias

- React
- TypeScript
- Tailwind CSS
- Radix UI
- Storybook
- shadcn/ui 