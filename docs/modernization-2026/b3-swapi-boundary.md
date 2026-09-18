# B3 — SWAPI data boundary and error contracts

## Status

Closed on `modernize/2026-next-quality`.

B3 centralizes the external Star Wars API boundary without replacing SWAPI, adding a backend, or expanding the product.

## Starting point

B0 established that the historical application depended directly on `https://swapi.dev/api/` and behaved inconsistently when the upstream failed:

- list routes returned 500 on connection failure;
- detail routes returned 200 with local error UI;
- list routes could wait beyond the B0 8-second probe because no application timeout existed;
- four route modules owned independent fetch/error behavior;
- film detail performed direct character URL fetches.

B2 deliberately excluded SWAPI routes from its portability smoke so the external-data contract could be owned and tested independently here.

## Maintained SWAPI client

B3 introduces one boundary:

`src/lib/swapi.mjs`

The four maintained route modules no longer hardcode `swapi.dev` or call `fetch()` directly.

The client provides:

- one default SWAPI base URL;
- server runtime override through `SWAPI_BASE_URL`;
- optional public override through `NEXT_PUBLIC_SWAPI_BASE_URL`;
- application-level timeout/abort;
- origin/path validation for absolute resource URLs returned by SWAPI;
- JSON parsing validation;
- basic domain-shape validation.

The default timeout is 5000 ms. Tests can provide a shorter timeout or injected fetch implementation without changing production semantics.

## Stable failure classification

`SwapiError` exposes stable internal codes:

- `not_found`;
- `rate_limited`;
- `upstream`;
- `network`;
- `timeout`;
- `malformed`.

Raw network/upstream body details are not used as public UI copy.

### Route mapping

Dynamic detail routes:

- SWAPI 404 → Next `notFound` → HTTP 404;
- all other upstream/data failures → generic public error + HTTP 503.

List routes:

- upstream/network/rate-limit/timeout/malformed data → generic public error + HTTP 503.

Film detail remains all-or-nothing for its character data in B3: if one character dependency fails, the route does not render misleading partial character data. B4 may later improve request strategy/concurrency, but B3 establishes the correctness boundary first.

## Browser-side character loading

The historical character page fetched remaining SWAPI pages directly in the browser.

B3 routes those requests through the same maintained client and:

- applies the same timeout/error classification;
- stops additional loading on failure;
- shows a generic localized message instead of creating an unhandled rejection.

The broader all-pages client-fetch/pagination strategy remains B4 scope.

## Public error messages

New localized messages are added for:

- temporary data-source unavailability;
- partial additional-data loading failure;
- character not found;
- film not found.

No raw fetch/socket/upstream body is rendered.

## Hygiene contract

Permanent hygiene now requires:

- `src/lib/swapi.mjs` to exist;
- maintained character/film pages not to contain `swapi.dev`;
- maintained character/film pages not to call direct `fetch()`.

This prevents accidental fragmentation of the external API boundary after B3.

## Deterministic client tests

Permanent command:

```bash
npm run test:b3:swapi
```

Uses Node's built-in test runner with injected fetch mocks. No real SWAPI traffic is required.

Current suite: **9/9 passing**.

Contracts:

1. successful people page + URL composition;
2. 404 → `not_found`;
3. 429 → `rate_limited`;
4. 5xx → `upstream`;
5. network failure → `network` with sanitized public message;
6. abort deadline → `timeout`;
7. invalid JSON → `malformed`;
8. invalid domain payload → `malformed`;
9. absolute resource URL cannot escape the configured SWAPI origin.

## Deterministic production-route tests

Permanent command:

```bash
npm run test:b3:runtime
```

The runtime contract starts:

- a local mock SWAPI HTTP server;
- the built Next production server on a separate local port.

The Next server receives a server-only SWAPI base override and a short test timeout.

Verified routes/behavior:

### Success

- `/characters` → 200;
- `/films` → 200;
- `/characters/1` → 200;
- `/films/1` → 200.

Mock character/film content is asserted in rendered HTML.

### Not found

- missing character → 404;
- missing film → 404.

### Upstream failures

- upstream 5xx → 503;
- rate limit → 503;
- malformed payload → 503;
- timeout → 503.

The rendered upstream-error response contains the generic public message and does not contain the mock upstream's private failure detail.

The verified timeout path completed in **161 ms** with the test client configured to abort after 150 ms.

## CI integration

Permanent CI now runs, in order:

1. B1/B2 read-only quality;
2. B2 runtime/i18n contract;
3. B3 deterministic SWAPI client tests;
4. B3 production SWAPI route contract;
5. production audit debt inventory.

SWAPI availability is no longer required for CI.

## Final evidence

Validated candidate:

`07a68a64ba2979413b9e141de22cd2bcdcbb1b6f`

Run:

`35343545228` — success.

Observed:

- ESLint: **0 errors / 16 warnings**;
- Prettier debt: **34 files**;
- B2 runtime/i18n: success;
- B3 client tests: **9/9**;
- B3 route runtime: success;
- production audit still: 13 findings (4 moderate / 8 high / 1 critical).

Artifact:

- `10545757739`;
- digest `sha256:f468592ff86c042bacbaa21d6df3849b31a2ee13005c1d729f75b0f3b59b9ea3`.

The final B3 exact-head after this documentation/ratchet commit is recorded in issue #2 once its permanent CI run completes.

## Explicit non-adoptions

B3 does not:

- replace SWAPI;
- add a repository-owned backend/database/cache;
- add retry storms;
- add Redux/global data state;
- redesign route UX;
- fix pagination strategy;
- optimize film-detail N+1 beyond making it safe;
- fix the malformed character document title;
- upgrade framework/dependencies;
- hide the known production audit debt.

## Exit

B3 is complete when the final exact HEAD passes quality + B2 + both B3 contracts.

B4 owns route/data behavior truth: malformed title/dead state, character filtering/pagination strategy, film-detail request fan-out and explicit maintained route behavior.
