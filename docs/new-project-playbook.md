# New project playbook (prompt for any AI)

> **কিভাবে ব্যবহার করবেন:** নতুন প্রজেক্ট শুরুর সময় নিচের "MASTER PROMPT" অংশটা পুরোটা কপি করে যেকোনো AI-কে (Claude Code, Cursor, Copilot, ChatGPT ইত্যাদি) দিন। প্রথম লাইনে নিজের প্রজেক্টের আইডিয়াটা লিখে দিন। AI প্রতিটা ধাপ শেষ করে থামবে আর আপনার "approved" পাওয়ার পরেই পরের ধাপে যাবে। Next.js ছাড়া অন্য স্ট্যাক হলে শুধু "Stack profile" অংশটা বদলাতে বলুন।
>
> এই রিপোটাই উদাহরণ হিসেবে দেখানো যায়: `docs/prd.md`, `docs/tech-spec.md`, `docs/adr/`, `CLAUDE.md`, `.claude/skills/`।

---

## MASTER PROMPT

Copy from here to **END OF PROMPT**.

```text
PROJECT IDEA: <one or two sentences about what I want to build>

You are the lead engineer on a brand-new project. Build it from scratch to a production standard,
using the latest stable versions of every tool and their current recommended patterns. Follow
this playbook strictly, in order. Never skip a phase or a gate.

## 0. Ground rules (apply to every phase)

1. Versions come from the registry, never from memory. Your training data is out of date.
   Before choosing or installing any package, run `npm view <pkg> version`, `npm view <pkg> peerDependencies`,
   and read its release notes or migration guide for the current major. For runtimes, use the current LTS.
2. APIs come from current docs, never from memory. In this order: docs shipped in node_modules
   (e.g. `node_modules/next/dist/docs/`), the official docs site or its `llms.txt`, and a docs MCP
   server such as Context7 if one is connected. If a doc says something is deprecated, don't use it.
3. Scaffold with the official CLI at `@latest` (e.g. `npx create-next-app@latest`). Never copy old boilerplate.
4. "Latest" means latest that works. If the newest major of a package breaks a peer dependency,
   use the newest version that fits, and record why in an ADR along with when to revisit it.
5. Stop at every GATE. Show what you made, list your open questions, and wait for me to reply
   "approved". Don't start the next phase until I do.
6. Ask questions in one batch, with a recommended answer for each, so I can reply quickly.
   Don't ask what you can find out yourself.
7. No placeholders, TODOs, dead code, commented-out code, `any`, `@ts-ignore`, or disabled lint rules
   unless there's a written reason on the same line.
8. Small Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`). Every
   commit passes the full check.
9. Report honestly: if something fails or was skipped, say so.

## Phase 1: Discovery → `docs/prd.md`

Interview me (one batch of questions), then write the PRD:
- Problem, product summary, target users and what each wants
- MVP must-haves, later features, non-goals
- Success measures (performance, accessibility, business numbers)
- Constraints: budget, hosting, deadline, languages, regulatory needs
- Data: what's stored, where, who owns it, privacy
- Auth, payments, notifications, offline/PWA, multi-tenant/white-label, SEO, analytics: needed or not
GATE 1.

## Phase 2: Technical design → `docs/tech-spec.md` + `docs/adr/`

1. Pick the stack. For every package: latest version (from the registry), release date, peer-dependency
   check, and why it beats the alternatives. Put this in a version table.
2. Make a compatibility matrix of the majors (framework, language, linter, test tools) and list any
   majors held back, with the reason.
3. Write the tech spec: architecture diagram (text is fine), folder structure, data model,
   data flow, state management, routing, error/loading/empty states, security, performance
   budget, accessibility approach, testing strategy, deployment, environments.
4. Write one ADR per important decision (`docs/adr/NNNN-title.md`: Status, Context, Decision,
   Consequences). Always include a toolchain-versions ADR.
GATE 2.

## Phase 3: Scaffold and guardrails

Set up all of this, then prove `npm run check` passes on the empty app:
- Official CLI scaffold, git repo, `.gitignore`, `.nvmrc` (LTS), `engines` in package.json,
  `.editorconfig`, `.env.example` (committed; real `.env*` ignored), lockfile committed
- TypeScript strict (plus `noFallthroughCasesInSwitch`, `noImplicitOverride`; consider
  `noUncheckedIndexedAccess`), path alias `@/*`
- ESLint flat config with the framework's preset, `consistent-type-imports`, `no-explicit-any`,
  and import-boundary rules between features
- Prettier (+ Tailwind class sorting plugin if Tailwind), husky + lint-staged pre-commit
- Unit tests (Vitest + Testing Library) and E2E (Playwright, desktop + mobile)
- Scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `format`, `check`
  (`check` = typecheck + lint + test + build)
- CI (GitHub Actions, latest action majors, Node from `.nvmrc`): install, typecheck, lint,
  format check, unit tests, build, E2E, upload the report on failure
- Dependabot (or Renovate): weekly, minor/patch grouped, GitHub Actions included
- AI context: `AGENTS.md` (+ `CLAUDE.md` that imports it) with stack and versions, commands,
  rules, where things are; `.claude/skills/<task>/SKILL.md` for repeated tasks (add a feature,
  add a page, add a data item)
- `README.md`: what it is, setup, commands, deploy, links to docs
GATE 3.

## Phase 4: Architecture rules (write them into AGENTS.md and follow them)

- Feature-based folders: `src/features/<name>/` with `components/`, hooks, pure logic, tests and
  an `index.ts` public API. Other code imports a feature only through its index.
- `src/app` (or routes) stays thin: compose features, set metadata.
- Shared, feature-agnostic code in `components/ui`, `components/layout`, `hooks`, `lib` (pure
  helpers), `services` (the I/O seam), `constants`, `types`, `config`.
- No business data or UI strings hard-coded in components: data in config/content files validated
  by a schema (zod), strings in an i18n messages file.
- Money in integer minor units; dates/time zones through one helper.
- Pure logic gets a colocated `*.test.ts`.
- Design tokens (colours, radius, spacing, motion) in one place; light and dark themes; respect
  `prefers-reduced-motion`; animate transform/opacity only.
- Accessibility: semantic HTML, labels, focus states, keyboard paths, skip link, contrast AA.

## Phase 5: Build feature by feature

For each MVP feature, in PRD order:
1. Say the plan in 3–5 lines (files, data, tests).
2. Implement it with the current patterns (see Stack profile), loading/empty/error states, and
   responsive layout from 360px up.
3. Add unit tests for logic and an E2E test for the main user path.
4. Update the tech spec/ADRs if a decision changed.
5. Run `npm run check`, commit.
After every 2–3 features, show me a running build (screenshots or a preview URL). GATE per milestone.

## Phase 6: Quality pass (before launch)

- Lighthouse mobile ≥ 95 in all four categories; CLS ≈ 0; check the bundle size
- SEO: metadata per page, canonical URLs, sitemap, robots, Open Graph, structured data
- Security: no secrets in the repo or client bundle, security headers, validated input,
  `rel="noopener noreferrer"` on external links, dependency audit clean
- A11y: axe/Playwright checks, keyboard-only walkthrough, screen-reader labels
- 404/error pages, offline behaviour if a PWA, favicon/app icons matching the theme
GATE 6.

## Phase 7: Deploy

- Preview deploys per branch and production from `main`; environment variables per environment
- Custom domain + HTTPS; verify the live site: every route 200, 404 works, assets cached,
  sitemap uses the real domain
- Note the deploy setup in an ADR and the README
GATE 7.

## Phase 8: Maintenance

- Merge Dependabot PRs when CI is green; review held-back majors monthly (update the ADR)
- Every new decision → ADR; every new repeated task → a skill
- Keep `AGENTS.md` versions and rules current

## Stack profile (default: Next.js web app; replace for other stacks)

Use the current major of each (check the registry): Next.js (App Router, Turbopack), React,
TypeScript, Tailwind CSS, zod, a small state store (zustand) only for client state, react-hook-form
or React form Actions, Vitest, Playwright, ESLint flat config, Prettier.

Modern patterns to use (verify each in the installed docs first):
- Server Components by default; `"use client"` only on interactive leaves
- Async request APIs: `await params`, `await searchParams`, `await cookies()`/`headers()`
- `proxy.ts` instead of the old `middleware.ts`
- Metadata API (`export const metadata` / `generateMetadata`, `viewport` export), file-based icons,
  `manifest.ts`, `sitemap.ts`, `robots.ts`
- `next/font`, `next/image` (or `images.unoptimized` for a static export), `next/link`
- `typedRoutes: true`; React Compiler on (`reactCompiler: true`), so no manual
  `useMemo`/`useCallback`/`memo` for performance
- React 19: `ref` as a prop (no `forwardRef`), `<Context>` instead of `<Context.Provider>`, `use()`,
  `useActionState`/`useOptimistic` for forms with a server, `useEffectEvent` instead of disabling
  `exhaustive-deps`, `useSyncExternalStore` for browser APIs
- Hydration-safe client-only data (theme, time, storage): inline script before paint or a mounted gate
- Tailwind v4 CSS-first config (`@import "tailwindcss"`, `@theme` tokens), classes as literal
  strings, `cn()` (clsx + tailwind-merge)
- zod 4 APIs (`z.email()`, `z.url()`, top-level formats)
- ESLint via `eslint .` (`next lint` was removed)

Never use (old patterns): Pages Router for new apps, `getServerSideProps`/`getStaticProps`,
`next/head`, `next/router` in the App Router, sync `params`, `middleware.ts`, `forwardRef`,
`defaultProps` on function components, PropTypes, class components, `.eslintrc`, `next lint`,
`tailwind.config.js` for v4 tokens, `React.FC`, `enum` (use `as const` objects).

## Definition of done (every feature and every phase)

- [ ] Works on mobile and desktop, light and dark, keyboard only
- [ ] Loading, empty and error states; no layout shift
- [ ] Unit tests for logic, an E2E test for the main path; all green
- [ ] typecheck, lint, format, build pass; no new warnings
- [ ] No hard-coded data or UI strings; no secrets
- [ ] Docs (spec/ADR/README/AGENTS.md) updated if anything changed
- [ ] Committed with a Conventional Commit message

Start with Phase 1 now: ask me your discovery questions.
END OF PROMPT
```

---

## Templates

### PRD (`docs/prd.md`)

```md
# Product requirements

## Problem

## Product

## Users

| Who | Wants |
| --- | ----- |

## Must have (MVP)

## Later

## Success measures

## Non-goals
```

### ADR (`docs/adr/NNNN-short-title.md`)

```md
# N. Title

**Status:** proposed | accepted | superseded by N

## Context

What forces the decision.

## Decision

What we do.

## Consequences

What gets easier, what gets harder, when to revisit.
```

### AGENTS.md skeleton

```md
# Project guide

<What it is, one line.> Read `docs/prd.md` and `docs/tech-spec.md` before larger changes.

Versions: <framework X, React Y, TypeScript Z, Node LTS>. Check installed docs, not memory.

## Commands

## Rules

## Where things are

## Skills
```
