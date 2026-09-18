# B0 — Reproducible 2024 baseline

## Status

Closed as an observational baseline. B0 does **not** change application behavior, dependency versions, routing, data fetching, localization or UI.

### Authorities

- final 2024 implementation authority: `6884c0bd33a38f7fcf258092dfca37da5163a920`;
- contextual README/current `main` at B0 start: `95a8372019faab3306ef1ddd87467959526c37ec`;
- work branch starts exactly from `95a8372019faab3306ef1ddd87467959526c37ec`;
- B0 measurement commit: `1410c0c8248c14f30bdfed6079dfd0c80a8c625c`;
- B0 workflow run: `35309647688`.

The measurement commit adds only the temporary B0 workflow. The application tree being measured is otherwise the same 2024 application represented by `main@95a83720...`.

## Reproduction runtimes

B0 deliberately measured both a conservative Node 20 runtime and the portfolio's current Node 24 maintenance runtime.

### Node 20

- Node: `v20.19.5`;
- npm: `10.8.2`;
- `npm ci`: exit 0;
- current `next lint`: exit 0;
- `next build`: exit 0.

### Node 24

- Node: `v24.20.0`;
- npm: `11.19.0`;
- `npm ci`: exit 0;
- current `next lint`: exit 0;
- `next build`: exit 0.

The same lockfile therefore reproduces successfully on both tested runtimes. B1 may select the maintained runtime explicitly; B0 does not alter package metadata.

## Current lint/build observations

The historical lint command succeeds, but it is not clean.

Observed warnings include:

- repeated `@next/next/no-img-element` warnings across multiple UI components/pages;
- `react-hooks/exhaustive-deps` for a missing `setCurrentPage` dependency;
- `react-hooks/exhaustive-deps` for a missing `currentPage` dependency in the character fetch callback.

The same warnings are surfaced again during `next build`.

The production build itself completes successfully:

- Next.js `14.2.3`;
- compilation succeeds;
- static page generation succeeds;
- page optimization/build trace collection succeeds.

These warnings are real maintenance debt, but B0 does not fix them.

## Dependency audit baseline

The audit result is identical on Node 20 and Node 24.

### Full dependency tree

- info: 0;
- low: 0;
- moderate: 5;
- high: 15;
- critical: 1;
- total: **21**.

### Production dependency tree

- info: 0;
- low: 0;
- moderate: 4;
- high: 8;
- critical: 1;
- total: **13**.

### Direct production findings

The captured npm audit identifies these direct boundaries:

- `next@14.2.3` — current audit severity reaches **critical**; npm reports a non-major repair path at `14.2.35`;
- `postcss` — production **high** finding in the installed graph, with npm associating the repair with the Next 14.2.35 graph;
- `i18next-http-backend@2.5.1` — direct **moderate** finding; npm reports `4.0.2` as the available fix and marks it as semver-major.

Important: B0 records audit evidence only. It does not run `npm audit fix`, `--force`, or change versions.

## Outdated inventory

`npm outdated --json` returns exit 1 because updates are available. The complete JSON is stored in the B0 artifacts.

Relevant current → wanted → latest values at the time of B0:

- `next`: 14.2.3 → 14.2.3 → 16.3.5;
- `react`: 18.3.1 → 18.3.1 → 19.3.0;
- `react-dom`: 18.3.1 → 18.3.1 → 19.3.0;
- `eslint`: 8.57.0 → 8.57.1 → 10.10.0;
- `eslint-config-next`: 14.2.3 → 14.2.3 → 16.3.5;
- `i18next`: 23.11.4 → 23.16.8 → 26.4.2;
- `i18next-browser-languagedetector`: 7.2.1 → 7.2.2 → 8.2.1;
- `i18next-http-backend`: 2.5.1 → 2.7.3 → 4.0.2;
- `tailwindcss`: 3.4.3 → 3.4.19 → 4.3.3;
- `tailwind-scrollbar`: 3.1.0 → 3.1.0 → 4.0.2;
- `postcss`: 8.4.38 → 8.5.28 → 8.5.28;
- `autoprefixer`: 10.4.19 → 10.6.1 → 10.6.1;
- `react-i18next`: 14.1.1 → 14.1.3 → 17.0.14.

This inventory is evidence for B6. It is not permission for a mass update.

## Production-start smoke

B0 built the application and ran `next start` on Node 20.19.5.

With normal network access:

- `/` → 200;
- `/characters` → 200;
- `/films` → 200;
- `/characters/1` → 200;
- `/films/1` → 200;
- `/es` → 200;
- `/es/characters` → 200;
- `/en/films` → 200;
- `/locales/en/translation.json` → 200;
- `/locales/es/translation.json` → 200;
- `/images/generic/img_generic_character.jpeg` → 200;
- direct `https://swapi.dev/api/people/1/` probe → 200.

This proves the historical application can currently build and serve its primary pages/assets when SWAPI is available.

## Localization portability finding

The built output contains the literal:

```text
http://localhost:3000//locales/
```

Therefore the current client localization contract is not origin-portable even though the locale JSON assets themselves are served correctly by the production build.

The source also contains:

- hardcoded `localhost:3000`;
- a double slash before `locales`;
- browser language detection/i18next state in addition to Next locale routing.

B2 owns the fix and the EN/ES authority decision.

## SWAPI availability boundary

The app talks directly to `https://swapi.dev/api/`; there is no repository-owned backend/cache authority.

B0 deliberately changed only the runner's host resolution to observe failure behavior.

### SWAPI connection refused

When `swapi.dev` resolves to local connection refusal:

- `/characters` → **500**;
- `/films` → **500**;
- `/characters/1` → 200 with the route's existing error UI;
- `/films/1` → 200 with the route's existing error UI.

This demonstrates inconsistent upstream-failure contracts between list and detail routes.

### SWAPI non-responsive

When `swapi.dev` resolves to a non-responsive address:

- `/characters` did not respond within the 8-second B0 probe;
- `/films` did not respond within the 8-second B0 probe;
- curl exited 28 for both probes.

The current application has no explicit repository-level timeout/abort contract around these upstream reads. B3 owns that boundary.

## Code observations confirmed by reproduction/source review

B0 confirms the issue's initial observations:

- `src/pages/characters/[id].js` has a malformed document-title template;
- `src/pages/_app.js` reads `ready` from `useTranslation()` without using it;
- route modules contain unused router/import state;
- character list starts with page 1 on SSR and then browser-fetches all remaining SWAPI people pages before local pagination/filtering;
- film detail performs one additional request per character URL;
- `postcss.config.js` and `postcss.config.mjs` both exist with equivalent plugin declarations;
- `next.config.mjs` still sends `X-XSS-Protection`;
- the project has no unit/integration/E2E test framework at this baseline;
- there is no permanent CI at the application baseline;
- current lint is delegated to `next lint`.

These are characterized debts, not B0 fixes.

## B0 evidence

Workflow run: `35309647688`.

Artifacts:

- Node 20 inventory: `10532768100`
  - digest `sha256:33a64c22f9b0ba4986df3b0c60356f7a3c54926b0ecf065edc745027475eea65`;
- Node 24 inventory: `10532822875`
  - digest `sha256:c6aa4584a2e44beeca217343380d89fa3d72e0f3845356a25679423c1c9f0926`;
- production/SWAPI smoke: `10533490312`
  - digest `sha256:20dd7959d885adb9ac6d2edddeed71957cb60c4e579cd53fd7dfaa45b1e851f5`.

The inventory artifacts retain the exact audit JSON, outdated JSON, lint/build output and dependency tree.

## B0 exit assessment

B0 passes its intended exit criteria:

- exact historical/contextual baseline identified;
- lockfile reproducible on two runtimes;
- lint behavior recorded without mutation;
- production build reproducible;
- production start and main route/assets/locales smoke reproduced;
- external SWAPI normal/unavailable/non-responsive behavior characterized;
- audit and outdated inventories captured;
- warnings/config debt separated from runtime/external failures;
- no application behavior or dependency version changed.

## Next block

B1 may now establish the maintained runtime/toolchain and a **read-only** permanent quality gate. Given that Node 24.20.0/npm 11.19.0 reproduces `npm ci`, lint and build successfully, it is a valid candidate for the maintained 2026 authority, but B1 must encode and verify that decision rather than assuming it.
