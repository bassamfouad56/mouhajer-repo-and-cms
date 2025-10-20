# Contributing

## Branching & Commits
- Branches: feat/*, fix/*, chore/*, docs/*
- Conventional Commits: feat:, fix:, chore:, docs:, refactor:

## Setup
1. Copy .env.example to .env.local and fill required values.
2. Install deps: npm i
3. Run: npm run dev

## Quality Gates
- Lint: npm run lint
- Typecheck: npm run typecheck
- Build: npm run build

## Principles
- No visual changes unless explicitly approved.
- Shared logic goes into shared/ (lib, hooks, seo, env, logger).
- Strict TypeScript; validate server inputs with Zod.

## PR Checklist
- [ ] Visual parity preserved
- [ ] Lint/type/build pass
- [ ] SEO tags unchanged or improved
- [ ] No bundle size regressions

