# 4. PWA with a generated service worker

**Status:** accepted

## Context

The site should install as an app and keep working offline. Next.js documents PWAs (`app/manifest.ts`, a hand-written `public/sw.js`) but has no built-in precaching. Plugins such as `next-pwa`/Serwist add a webpack/Turbopack dependency and lag behind Next releases.

## Decision

- Manifest and icons are Next metadata routes built from the tenant config.
- After `next build`, `scripts/build-sw.mjs` lists every file in `out/` and fills `scripts/sw.template.js` into `out/sw.js`. The cache version is a hash of the build.
- No PWA library.

## Consequences

- Every deploy precaches the whole site (about 100 files) and drops the old cache.
- The worker strategy is ours to maintain (see the tech spec's PWA section); it is ~90 lines.
- The host must serve `out/` as built (see ADR 5).
