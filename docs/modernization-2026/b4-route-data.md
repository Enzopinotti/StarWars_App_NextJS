# B4 — Route/data behavior truth

## Status

Closed on `modernize/2026-next-quality` after exact-head CI.

B4 keeps the Pages Router and the existing visible product, but makes character pagination/filtering and film-detail fan-out truthful, bounded and directly testable.

## Character route

The historical character screen loaded SWAPI page 1 during SSR and then fetched every remaining people page in the browser before applying local filters and pagination.

B4 changes that boundary:

- the browser no longer refills itself with the complete SWAPI people catalog;
- SSR owns catalog collection through the maintained SWAPI client;
- upstream people pages are fetched with bounded concurrency (default 3);
- an unexpected catalog larger than 20 SWAPI pages is rejected as malformed instead of creating an unbounded request pattern;
- global eye-color and gender filtering semantics are preserved on the server;
- pagination/filter state is represented in the URL query;
- only the current 10-character page is serialized into the route response;
- invalid page values fall back to page 1 and oversized page values clamp to the final page;
- filter facets are small string lists rather than the full character dataset.

This is intentionally not a new backend or cache layer. Each SSR request remains explicit and deterministic while avoiding the previous browser-side all-pages download.

## Character rendering cleanup

The old `CharacterList` used `window.innerWidth` to remove cards from incomplete responsive rows. That could hide valid characters merely because the viewport column count changed.

B4 removes that data truncation. CSS grid owns responsive layout and every character in the selected page is rendered.

The malformed character document title is also repaired:

`<character name> | Star Wars`

## Film detail fan-out

Film detail previously owned an unbounded `Promise.all()` across every character URL.

B4 moves this behavior into `getCharactersByUrls()`:

- duplicate URLs are requested once;
- original film order is preserved;
- default character concurrency is capped at 4;
- failures continue to use the B3 all-or-nothing route contract, so misleading partial film-character data is not rendered.

No repository-owned cache, queue, backend or database was introduced.

## Deterministic tests

Permanent command:

```bash
npm run test:b4:data
```

Current suite: **4/4 passing**.

It verifies:

1. global filtering while returning only the current browser page;
2. invalid/oversized page normalization;
3. bounded people-catalog collection with each upstream page requested once;
4. deduplicated, ordered, concurrency-limited film-character fan-out.

## Production route contract

Permanent command:

```bash
npm run test:b4:runtime
```

The test starts a local mock SWAPI and a real `next start` production server.

Verified behavior:

- `/characters` renders characters 1–10 and does not serialize page-2 characters;
- `/characters?page=2` renders the second page only;
- `/characters?eyeColor=blue` preserves matches located on later upstream pages;
- `/characters?page=99` clamps to the final page;
- `/characters/1` emits the corrected document title;
- `/films/1` renders all eight mock characters;
- film character requests are unique and bounded to concurrency 4.

Observed runtime evidence:

- browser character page size: **10**;
- mock upstream people pages per route request: **3**;
- global filters: **preserved server-side**;
- maximum film-character concurrency: **4**.

## CI evidence

Validated candidate:

`044f2a0af93ff027ea79cd74427d12c0246386f4`

GitHub Actions run:

`35347068257` — success.

Artifact:

- id: `10547592362`;
- digest: `sha256:d213621bd468592cba1fc898b6f0a36b6cfd73696f06846433a0cdec08f8e17f`.

The same run also kept B1–B3 contracts green.

Quality metrics:

- ESLint: **0 errors / 15 warnings**;
- Prettier debt: **34 files**;
- B4 data tests: **4/4**;
- B4 production runtime: success.

The lint improvement is retained as a ratchet: the permanent ceiling moves from 16 warnings to **15**. Formatting did not improve in this block, so its ceiling remains 34.

## Known dependency debt

B4 does not hide or auto-fix dependency debt.

The candidate install inventory reported 21 total vulnerabilities, while the production-only audit remained at **13 findings (4 moderate / 8 high / 1 critical)**. Framework/dependency remediation remains B6 scope, after B5 finishes the behavioral/accessibility net.

## Explicit non-adoptions

B4 does not:

- replace SWAPI;
- add a custom API, database or distributed cache;
- move to App Router;
- change framework/dependency majors;
- redesign the application;
- convert the project to TypeScript;
- silently accept partial film-character data;
- remove the existing EN/ES behavior.

## Exit

B4 is complete when the documentation/ratchet exact head passes quality plus B2, B3 and both B4 contracts.

B5 owns accessibility, semantic controls, responsive behavior and remaining browser-only layout assumptions without redesigning the visual identity.
