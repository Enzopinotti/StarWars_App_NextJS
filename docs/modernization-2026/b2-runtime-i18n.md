# B2 — Runtime/config/i18n portability

## Status

Closed on `modernize/2026-next-quality`.

B2 removes development-origin assumptions from localization/config and gives Next locale routing one coherent authority without changing the app into a new product or upgrading framework/dependency majors.

## Starting point

B1 closed on:

- `65e2d6c4f5bd35b0711613f72cb5b3472f521b37`;
- Node 24.20.0 / npm 11.19.0;
- direct ESLint read-only gate;
- Prettier debt ratchet;
- permanent SHA-pinned quality CI.

B0 had already proven that the historical build embedded:

```text
http://localhost:3000//locales/
```

and that two PostCSS config files existed simultaneously.

## Changes

### One PostCSS authority

B2 keeps:

- `postcss.config.js`

and removes the duplicate:

- `postcss.config.mjs`.

The B1 hygiene contract is updated to require exactly the maintained JS authority and to reject the duplicate reappearing.

### Portable i18n resources

The maintained i18n runtime no longer uses:

- `i18next-http-backend` at runtime;
- browser language detection as a second routing authority;
- hardcoded `http://localhost:3000`;
- a double-slash locale resource path;
- development debug logging.

English and Spanish translation JSON are imported from the repository and supplied as deterministic i18next resources.

### Locale authority

Next.js locale routing is the authority:

- supported locales: `en`, `es`;
- default locale: `en`;
- locale auto-detection remains disabled;
- `_app.js` creates its i18n instance from `router.locale`;
- language controls keep the current route and call `router.push(..., { locale })`.

This removes the previous loosely coupled state between browser language detection and Next routing.

### Security headers

B2 retains:

- `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff`.

B2 removes obsolete:

- `X-XSS-Protection`.

This is an explicit maintained delivery contract rather than inherited header cargo-culting.

### Translation readiness

The old `_app.js` unused `ready` value and the films-page manual i18next loading state are removed because translations are now synchronously available from bundled resources.

## Runtime contract

Permanent command:

```bash
npm run test:b2:runtime
```

The runtime contract:

1. launches the **built** Next application directly on port `3210`;
2. proves the app does not require port 3000 for localization;
3. verifies:
   - `/` → 200;
   - `/en` → 200;
   - `/es` → 200;
   - English route renders an English translation marker;
   - Spanish route renders a Spanish translation marker;
   - locale JSON assets remain available;
   - unsupported locale `/fr` is a defined 404;
   - maintained security headers are present;
   - obsolete `X-XSS-Protection` is absent;
   - the production `.next` output no longer contains the historical localhost locale URL.
4. starts Next directly through its binary so the test server is terminated deterministically.

The B2 smoke intentionally excludes SWAPI-backed routes. SWAPI availability/error semantics belong to B3 and must be mocked/tested independently instead of making the i18n/config gate depend on an external service.

## Final evidence

Exact B2 HEAD:

`c477530bfb2960233563baeb78bfa47fdbd9b79b`

Quality run:

`35342586080` — success.

Observed final contract:

- ESLint: **0 errors / 17 warnings**;
- Prettier debt: **34 files**, improved from 35 at B1;
- B2 runtime/i18n: success;
- runtime origin: `http://127.0.0.1:3210`;
- locales: `en,es`;
- unsupported `/fr`: 404;
- maintained security headers: success.

Artifact:

- `10545359378`;
- digest `sha256:9fd8e5b4049bbf7c5b6d28a539047af9eb96508bbb943efa080cf1214a64d599`.

The production audit remains the known B0/B1 debt:

- 13 production vulnerabilities;
- 4 moderate;
- 8 high;
- 1 critical.

B2 does not hide or repair that dependency debt because B6 owns evidence-driven dependency/framework maintenance.

## Explicit non-adoptions

B2 does not:

- upgrade Next/React/i18next;
- add a custom localization server;
- enable locale auto-detection;
- change Pages Router;
- redesign language controls;
- address SWAPI failure behavior;
- mass-format the repository;
- suppress lint warnings;
- run forced audit fixes.

## Exit

B2 exit criteria are satisfied:

- one PostCSS config authority;
- no hardcoded localhost translation authority;
- EN/ES direct navigation is coherent with Next routing;
- debug/browser-detector/backend split removed from maintained i18n;
- production smoke works on a non-3000 port;
- missing/unsupported locale behavior is defined;
- maintained security headers are asserted;
- permanent CI executes the B2 contract.

B3 now owns the external SWAPI data boundary, timeout/abort behavior and deterministic failure classification.
