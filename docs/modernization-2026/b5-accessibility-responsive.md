# B5 — Accessibility, responsive and browser behavior

## Status

Closed on `modernize/2026-next-quality` after exact-head CI.

B5 preserves the existing visual identity while removing browser-only layout assumptions and repairing interactive semantics. It does not redesign the application or introduce a component framework.

## Responsive authority

The historical header and navigation selected different React markup by reading `window.innerWidth` through `useWindowSize()`. The carousel also measured the browser width and stored pixel offsets.

B5 moves maintained responsive behavior to CSS:

- desktop/mobile navigation is rendered deterministically and selected by Tailwind/CSS breakpoints;
- the mobile menu remains stateful, but viewport width no longer determines the initial React tree;
- the carousel uses an active slide index and percentage transforms rather than `window.innerWidth`;
- the carousel keeps one stable SSR/client markup shape;
- the existing visual breakpoints and styling intent are preserved.

This removes a class of hydration/layout-shift risk without migrating router or UI architecture.

## Interactive semantics

B5 repairs controls that were visually interactive but semantically weak or invalid:

- navigation uses direct links instead of `Link > button`;
- active navigation links expose `aria-current="page"`;
- language controls remain native buttons and expose pressed state;
- hamburger control exposes `aria-expanded`, `aria-controls` and localized accessible names;
- character filter toggle is now a native button instead of a clickable image;
- filter dropdown toggles expose expanded state and controlled regions;
- filter options are buttons rather than clickable list items;
- removable filter pills expose localized button labels;
- pagination is a labelled navigation region;
- the current pagination page exposes `aria-current="page"`;
- pagination ellipses are inert text, not disabled buttons;
- carousel controls have localized accessible names;
- carousel links are direct links rather than links wrapping buttons;
- hidden carousel slides remove their links from sequential keyboard focus;
- social links respond to both pointer hover and keyboard focus.

## Accessible names and asset truth

B5 adds EN/ES strings for maintained accessible names and corrects misleading decorative alt text.

It also fixes case-sensitive asset paths that were easy to miss on macOS but fail on Linux:

- `Vision.png`;
- `SortDown.png`;
- `LinkedIn.png`;
- `LinkedIn_relleno.png`.

The permanent B5 semantics test asserts that these repository paths exist with the exact casing used by maintained code.

## Deterministic semantics contract

Permanent command:

```bash
npm run test:b5:semantics
```

The contract verifies:

1. maintained responsive navigation/carousel no longer branch on `window.innerWidth` or `useWindowSize`;
2. navigation/language controls avoid invalid nested interactive markup;
3. character filter controls use native keyboard-operable semantics;
4. pagination exposes current-page and labelled navigation behavior;
5. carousel behavior is SSR-safe and uses direct links;
6. social/card accessible names and case-sensitive assets match maintained content.

## Production runtime contract

Permanent command:

```bash
npm run test:b5:runtime
```

The contract starts a local mock SWAPI plus the real production server and verifies rendered HTML.

Observed candidate evidence:

- responsive authority: **CSS breakpoints**;
- accessible-name locales: **EN / ES**;
- interactive nesting: **clean**.

The runtime also verifies the mobile navigation control relationship, localized Spanish navigation/carousel names, character filter region and pagination semantics.

## CI evidence

Validated candidate:

`e869694221a3429b7b3fd31d26f03bebfd298507`

GitHub Actions run:

`35348367474` — success.

Artifact:

- id: `10548580427`;
- digest: `sha256:2c1a1997d638adbd402190adab957dc21ff285dbefef50e4bdf5676ab44a7007`.

The same run kept B2, B3 and B4 contracts green after the markup/responsive changes.

Quality metrics:

- ESLint: **0 errors / 13 warnings**;
- Prettier debt: **34 files**;
- B5 semantics contract: success;
- B5 production runtime: success.

The lint improvement is retained as a ratchet: the permanent ceiling moves from 15 warnings to **13**. Formatting did not improve in this block, so its ceiling remains 34.

## Dependency debt remains explicit

B5 deliberately does not alter framework/runtime dependencies.

The candidate install still reported 21 total vulnerabilities, while production-only audit remained at **13 findings (4 moderate / 8 high / 1 critical)**.

This is B6 scope. The behavioral net from B2–B5 now exists specifically so dependency/framework changes can be judged against concrete product contracts.

## Explicit non-adoptions

B5 does not:

- redesign the UI;
- add a component library;
- add client-side global state;
- replace Pages Router;
- add a backend/database/cache;
- migrate to TypeScript;
- change Next/React/Tailwind majors;
- claim browser automation coverage that is not present.

## Exit

B5 is complete when this documentation/ratchet exact head passes quality plus B2–B5 contracts.

B6 owns dependency/framework maintenance by support, security and compatibility evidence.
