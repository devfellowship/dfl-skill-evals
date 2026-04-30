# Managed merge scaffold for dfl-skill-evals/CLAUDE.md
# Human edits belong only inside MANUAL blocks.

<!-- BEGIN GENERATED:claude/base -->
<!-- render-meta: repo=dfl-skill-evals; mode=merge; hash=b3fd400397c852e87411a55d0099becf65036c66f529884e2d6e26585ad8797e -->
# CLAUDE.md — dfl-skill-evals

## Quick Context
Coding challenge & technical assessment platform (aka "DevSharper"). Students solve challenges in-browser with live code execution via Judge0. Teachers create/manage challenges. Admins oversee all. Supports roles: student, teacher, admin.

- **Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Supabase
- **UI**: shadcn/ui + Radix + Tailwind CSS + Storybook 9
- **Code execution**: Judge0 (Docker-based, self-hosted)
- **Auth**: Supabase Auth with role-based guards (RoleGuard, AuthProvider)
- **Deploy**: Vercel (inferred) · GitHub Actions CI + deploy workflow

## Architecture
```
src/
├── app/
│   ├── page.tsx                    # Home — challenge grid
│   ├── challenge/[id]/             # Challenge execution page
│   ├── challenge/pre/[id]/         # Pre-challenge info page
│   ├── teacher/                    # Teacher dashboard, create/edit challenges
│   ├── admin/                      # Admin dashboard, challenge management
│   ├── auth/                       # Login, reset-password
│   ├── api/challenges/             # CRUD API routes
│   ├── api/execute-code/           # Code execution proxy to Judge0
│   └── api/admin/                  # Admin user management API
├── components/
│   ├── atoms/                      # Basic: Button, Input, Badge, AuthGuard etc.
│   ├── molecules/                  # Composite: ChallengeMenu, TestCaseManager, Hints etc.
│   ├── organisms/                  # Smart: ChallengePage, CodeEditor, DashboardAdmin, HomePage
│   ├── providers/                  # AuthProvider, RoleGuard, theme-provider
│   └── ui/                         # shadcn/ui primitives
├── hooks/                          # useChallenges, useTestRunner, useChallengeExecution etc.
├── lib/
│   ├── execution/                  # Judge0 pipeline: code-processor, executor, rate-limiter, result-parser
│   ├── supabase/                   # Server + client Supabase clients
│   ├── utils/                      # Slug gen, difficulty mapper, profile setup
│   └── validation/                 # Code validator
├── interface/                      # Core types: challenge, assessment, execution, user
├── types/                          # Nested types: challenges/, editor/, profile/, admin/
└── consts/                         # Form defaults, editor config, UI constants
```

## How to Work Here
- `npm run dev` — Next.js dev server
- `npm run lint` — ESLint
- `npm run build` — production build
- `npm run storybook` — component explorer
- Judge0 setup: `src/Judge0/docker-compose.yml` + `setup-judge0.sh`
- Code execution flow: UI → `/api/execute-code` → `lib/execution/` pipeline → Judge0

## Contracts
- **Supabase tables**: challenges (with soft delete), user profiles, assessment data
- **API routes**: `/api/challenges` (CRUD), `/api/execute-code` (POST), `/api/admin/users`
- **Judge0**: containerized code execution; config in `lib/judge0-config.ts`
- **Roles**: student (solve), teacher (create/edit own), admin (manage all + users)
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Judge0 config

## Ecosystem Context
- Part of DFL LMS — skill assessments complement course content
- Review flow (approve/reject) mirrors dfl-reviews patterns
- Shares Supabase project with common IAM schema
- GitHub CI: ci.yml + deploy.yml workflows

## Rules
- Atomic design: atoms → molecules → organisms — each in own folder
- All code execution goes through `lib/execution/` pipeline, never direct Judge0 calls
- Server-side Supabase client for API routes (`lib/supabase/server-clients.ts`)
- Soft delete pattern for challenges — preserve `deleted_at` column logic
- Rate limiting on code execution — respect `lib/execution/rate-limiter.ts`
- Role checks: use `RoleGuard` component or `useUserRole` hook
<!-- END GENERATED:claude/base -->

<!-- BEGIN MANUAL:repo/local-notes -->
<!-- repo-specific notes live here -->
<!-- END MANUAL:repo/local-notes -->## Edge Functions

Edge functions are owned by `dfl-schema`. Do NOT add or modify files under `supabase/functions/` in this repo.
Open your PR in [dfl-schema](https://github.com/devfellowship/dfl-schema) instead.
The `push-functions.yml` workflow auto-deploys on merge to main.
