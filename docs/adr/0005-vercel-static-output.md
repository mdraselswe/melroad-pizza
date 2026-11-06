# 5. Deploy `out/` to Vercel as plain static files

**Status:** accepted

## Context

With the Next.js framework preset, Vercel deploys from Next's own build output and ignores files that `postbuild` writes into `out/`. The generated `sw.js` was missing in production.

## Decision

`vercel.json` sets `"framework": null`, `"buildCommand": "npm run build"` and `"outputDirectory": "out"`. `sw.js` and the manifest are served with `max-age=0, must-revalidate`.

## Consequences

- What runs locally from `out/` is exactly what is deployed.
- Vercel-only Next features (image optimisation, ISR, middleware) are unavailable, which the static export already rules out (ADR 1).
- Any static host (Netlify, Cloudflare Pages, S3) works the same way.
