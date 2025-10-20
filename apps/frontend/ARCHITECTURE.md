# Architecture

- app/: App Router routes, layouts, and server components by locale.
- entities/: Core domain types and models (to be introduced progressively).
- features/: Use-case oriented modules composing UI + logic.
- services/: External integrations (Sanity, email, analytics, etc.).
- shared/: Reusable ui, hooks, lib, config, seo, env, logger, rate limiters.
- assets/: Static assets such as 3D models, textures, and fonts.

Rendering: Prefer RSC for reads; client islands for interactivity. Heavy modules (swiper, three) lazy loaded on viewport.

Caching: Sanity via CDN in prod; preview client for drafts; tag-based revalidation.

SEO: Defaults and JSON‑LD generators in shared/seo; per-route generateMetadata.

Performance: Lazy hydration; Next/Image wrapper; font preloads; R3F preload and DPR caps.

Security: Zod validation; structured logs; IP rate limiting; security headers in next.config.mjs.

Testing/CI: ESLint, Prettier, typecheck. Lighthouse and SEO snapshots planned.

