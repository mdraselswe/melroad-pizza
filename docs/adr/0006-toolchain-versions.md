# 6. Toolchain versions and modern React defaults

**Status:** accepted (reviewed 2026-11-06)

## Context

We keep every package on its latest version, but some latest majors don't work together yet. A version is only taken when its peers allow it and `npm run check` plus e2e pass.

## Decision

| Package     | Version | Why not newer                                                                            |
| ----------- | ------- | ---------------------------------------------------------------------------------------- |
| Node.js     | 24 LTS  | `.nvmrc`; CI and Vercel use it                                                           |
| TypeScript  | 6.0     | TS 7 (native) is out, but `typescript-eslint` supports `<6.1`                            |
| ESLint      | 9       | ESLint 10 is out, but `eslint-config-next` plugins (react, import, jsx-a11y) peer on ≤ 9 |
| @types/node | 24      | Matches the Node runtime, not the newest types                                           |

Next.js 16 features turned on:

- `reactCompiler: true`: components are memoised automatically. Don't add `useMemo`/`useCallback`/`memo` for performance; keep them only where identity matters (for example a value used by a non-React subscriber).
- `typedRoutes: true`: `<Link href>` and `router.push` are checked against real routes.
- `data-scroll-behavior="smooth"` on `<html>`: keeps instant scroll on route change while in-page anchors scroll smoothly.
- `useEffectEvent` instead of disabling `react-hooks/exhaustive-deps`.

## Consequences

- Dependabot opens weekly PRs; majors held back above are revisited when their peers catch up.
- Builds are a little slower (the compiler runs through Babel).
