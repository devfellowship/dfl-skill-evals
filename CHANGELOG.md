# Changelog

All notable changes to dfl-skill-evals will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Playwright E2E smoke test for critical user paths
- Expanded repo-contract.yaml with full API surface, schema details, RPC functions, views, and risk classification
- Expanded .claude/manifest.yaml with richer metadata (roles, API surface, table/view inventory)
- Expanded .env.example with optional vars and section comments
- CHANGELOG.md for change risk tracking

### Infrastructure
- AQS (Agent Quality Score) infrastructure improvements targeting 75+ (Blue band)
- No application logic changes

## [0.1.0] — 2026-03-15

### Added
- Initial DevSharper platform release
- Challenge CRUD with soft-delete support
- Judge0 code execution pipeline with rate limiting
- Role-based access: student, teacher, admin
- Teacher dashboard for challenge authoring
- Admin dashboard with user management and soft-delete audit
- Storybook component explorer
- Vitest unit test infrastructure
- AQS documentation verification tests
- CI/CD via GitHub Actions (ci.yml + deploy.yml)
