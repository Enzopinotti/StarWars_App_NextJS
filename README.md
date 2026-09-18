# Star Wars App — Next.js

Historical frontend-learning project built around a Star Wars interface and maintained in 2026 without rewriting its original product scope.

The application remains a small **Next.js Pages Router** project. The modernization work focused on reproducibility, localization portability, an explicit SWAPI boundary, truthful pagination/filtering behavior, accessibility/responsive semantics, supported framework maintenance and permanent CI.

## Stack

- Next.js `16.3.5`;
- React / ReactDOM `19.3.0`;
- JavaScript;
- Pages Router under `src/pages`;
- i18next `26.4.2` + react-i18next `17.0.14`;
- Tailwind CSS 3;
- ESLint 9 flat config;
- Prettier 3.9.8;
- Node `v24.20.0`;
- npm `11.19.0`.

## Routes

Maintained routes:

- `/`;
- `/characters`;
- `/characters/[id]`;
- `/films`;
- `/films/[id]`.

Supported locales are English and Spanish. Next.js locale routing is the authority and the translation resources are bundled from `public/locales/en` and `public/locales/es`.

## Reproducible setup

Runtime/package-manager authority is encoded in:

- `.nvmrc`;
- `package.json#engines`;
- `package.json#packageManager`;
- `.npmrc` with `engine-strict=true`;
- the committed `package-lock.json`.

Install exactly from the lockfile:

```bash
nvm use
npm ci
```

Run development:

```bash
npm run dev
```

Build and run the production bundle:

```bash
npm run build
npm start
```

## SWAPI boundary

SWAPI remains an external dependency; this repository does not replace it with a custom backend.

The maintained client lives in `src/lib/swapi.mjs` and owns:

- base URL selection;
- timeout/abort behavior;
- payload validation;
- origin/path validation for resource URLs;
- bounded people/character concurrency;
- error classification for not-found, rate-limit, upstream, malformed, network and timeout failures.

Defaults:

- base URL: `https://swapi.dev/api/`;
- timeout: `5000 ms`.

Optional overrides:

- server: `SWAPI_BASE_URL`, `SWAPI_TIMEOUT_MS`;
- public/client: `NEXT_PUBLIC_SWAPI_BASE_URL`, `NEXT_PUBLIC_SWAPI_TIMEOUT_MS`.

Route behavior distinguishes a real upstream 404 from external-service failure. Maintained dynamic routes map missing resources to HTTP 404 and upstream/data failures to a generic HTTP 503 response.

CI does **not** depend on live SWAPI availability; deterministic local HTTP mocks own the external-data tests.

## Localization

Localization no longer depends on an absolute localhost URL, browser language detection or runtime HTTP translation loading.

The app creates one i18next instance from the active Next locale:

- locales: `en`, `es`;
- default: `en`;
- fallback: `en`;
- automatic locale detection: disabled;
- language controls preserve the current route while changing the Next locale.

## Quality and tests

Read-only quality:

```bash
npm run quality
```

Explicit writers remain separate:

```bash
npm run lint:fix
npm run format:write
```

Behavioral contracts:

```bash
npm run test:b2:runtime
npm run test:b3:swapi
npm run test:b3:runtime
npm run test:b4:data
npm run test:b4:runtime
npm run test:b5:semantics
npm run test:b5:runtime
npm run test:b6:deps
```

Dependency security:

```bash
npm run audit:prod
npm run audit:all
```

Both dependency audits are blocking in CI. B6 closed with **0 production findings and 0 complete-tree findings**.

The repository still carries bounded historical formatting/lint debt under non-regression guards:

- ESLint ceiling: **0 errors / 13 warnings**;
- Prettier ceiling: **34 different files**.

These ceilings may only move downward.

## Permanent CI

`.github/workflows/quality.yml` runs on pull requests to `main`, pushes to the maintenance branch/main, and manual dispatch.

The gate verifies:

1. exact Node/npm identity;
2. lockfile install;
3. read-only quality/build;
4. B2 localization/runtime contract;
5. B3 SWAPI client + production route contracts;
6. B4 route/data unit + runtime contracts;
7. B5 accessibility/responsive contracts;
8. B6 dependency/framework contract;
9. production dependency audit;
10. complete dependency audit;
11. uploaded SHA-specific evidence.

## Modernization decisions

The 2026 lane intentionally does **not**:

- migrate Pages Router to App Router merely for fashion;
- migrate Tailwind 3 as part of the framework upgrade;
- add a backend, database, auth, CMS or global state framework;
- replace SWAPI;
- accept `--force` or `--legacy-peer-deps` as dependency strategy;
- redesign the UI into a different product.

The goal is a truthful, small, reproducible learning project whose behavior is tested.

## Modernization evidence

- [B0 — reproducible 2024 baseline](docs/modernization-2026/b0-baseline.md)
- [B1 — reproducible toolchain and read-only quality](docs/modernization-2026/b1-toolchain-quality.md)
- [B2 — runtime/config/i18n portability](docs/modernization-2026/b2-runtime-i18n.md)
- [B3 — SWAPI boundary and error contracts](docs/modernization-2026/b3-swapi-boundary.md)
- [B4 — route/data behavior](docs/modernization-2026/b4-route-data.md)
- [B5 — accessibility/responsive behavior](docs/modernization-2026/b5-accessibility-responsive.md)
- [B6 — dependency/framework maintenance](docs/modernization-2026/b6-dependencies-framework.md)

Portfolio coordination: [`Enzopinotti/Enzopinotti#19`](https://github.com/Enzopinotti/Enzopinotti/issues/19)

## Author

Enzo Pinotti
