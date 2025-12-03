🚀 DevSharper — Plataforma de Desafios, Avaliações Técnicas e Execução de Código

DevSharper é uma plataforma completa para criação, execução e avaliação de desafios técnicos — utilizada dentro do ecossistema DevFellowship e projetada para funcionar também como produto white-label para empresas, bootcamps e times de tecnologia.

A aplicação conecta módulos de coding challenges, entregas, revisões estruturadas e um pipeline de execução de código com Judge0, permitindo testar habilidades técnicas de forma prática, guiada e totalmente automatizada.

🧩 Principais Funcionalidades
✔️ Challenges (Coding Tasks)

Sistema completo de desafios com enunciado, exemplos e testes automatizados.

Suporte a múltiplas linguagens via Judge0 (docker + worker + rate-limit seguro).

Execução isolada de código com retornos padronizados (stdout, stderr, compile_output, status).

Feedback visual e execução em tempo real.

✔️ Entregas & Revisões (Review Requests)

Entrega de tarefas com autoavaliação baseada em assessment items.

Reavaliação através de “Refazer”, com:

título automático (Título Original / reavaliação N);

descrição vazia,

tags/tipo/link herdados da entrega original,

autoavaliação pré-marcada e editável.

Suporte a múltiplos tipos de entrega (código, documentação, fluxos n8n etc.).

Fluxo interno semelhante a Pull Request:

approve_review_request

reject_review_request

Segurança com RLS e RPCs seguras.

✔️ Judge0 Integration (Local / VPS)

Setup completo automatizado com:

setup-judge0.sh

quick-test.sh

test-languages.js

docker-compose com Redis + Postgres + Judge0 latest-extra

Config centralizada em judge0-config.ts

Endpoint /api/execute-code delegando toda lógica para lib/judge.ts

✔️ Arquitetura com Next.js + TypeScript

App Router

API interna

TailwindCSS

Componentes reusáveis para UI/UX

Mock local para desafios e integração real com DB quando necessário

🛠️ Stack Tecnológica

Frontend: Next.js + React + TypeScript + Tailwind

Backend: Next.js API Routes / Supabase

Database: Supabase (Postgres) com schemas dedicados

Auth: Supabase Auth

Code Engine: Judge0

Infra: Docker, SSH Deploy, Traefik (VPS)

CI/CD: GitHub Actions

🗂️ Estrutura de Pastas (Resumo)
devsharper-app/
 ├── src/
 │   ├── Judge/              # Endpoints e abstrações do Judge0
 │   ├── lib/judge.ts        # Lógica principal de execução
 │   ├── app/challenge/[id]  # Página de execução de desafios
 │   ├── components/         # Componentes UI
 │   └── ...
 ├── docker-compose.yml
 ├── setup-judge0.sh
 ├── quick-test.sh
 ├── test-languages.js
 └── README.md

🧪 Fluxo de Execução de Código

Usuário escreve o código na UI do challenge

Front chama /api/execute-code

O endpoint delega para lib/judge.ts

A lib monta o payload conforme opções do Judge0

Execução ocorre no container isolado

Resposta padronizada retorna para o front com:

status (Accepted, Wrong Answer, Compilation Error etc.)

stdout, stderr, output, logs

tempo de execução e memória

🔐 Segurança & Boas Práticas

RLS em todas as tabelas de entrega, revisão e assessment

RPCs idempotentes e seguras

Nenhuma chave sensível exposta no front

Execução de código totalmente isolada

Validação de payloads antes de enviar ao Judge0

🧩 Uso como White-Label (para empresas)

O DevSharper foi projetado para ser facilmente adaptado:

Branding customizável

Challenges ilimitados

Fluxo de avaliação configurável

Fácil integração com LMS, HR-Tech ou onboarding técnico

Pronto para demonstrações em 24h

🧱 Roadmap (próximos passos)

Painel de empresas com criação de trilhas customizadas

Ranking e gamificação

Sistema de badges e progresso

Versão com WebAssembly para execução local (fallback offline)

Nova UI com framer-motion + componentes próprios

Exportação de desafios para JSON + import via painel admin

👤 Autor

Samuel Stefano
Desenvolvedor JavaScript & Web3
Criador do ecossistema DevFellowship / SkillEvals / DevSharper
Apaixonado por criar plataformas educacionais e ferramentas dev-first.

📜 Licença

Este projeto utiliza uma licença permissiva (MIT) — pode ser adaptado, modificado ou estendido conforme necessário.

Projeto publicado em 202512031525.
