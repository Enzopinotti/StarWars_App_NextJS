# B6 — Dependency and framework maintenance

## Status

B6 consolidates dependency/framework maintenance after B2–B5 established deterministic product contracts.

The selected target preserves the Pages Router application and its visible behavior while moving the runtime/tooling graph away from the original 2024 dependency set.

## Starting point

B5 closed on:

`ee2ba26367c5dd62e5ba25d886d920a041852649`

Its dependency authority still declared:

- Next.js `14.2.3`;
- React / ReactDOM `^18`;
- i18next `^23.11.4`;
- react-i18next `^14.1.1`;
- browser language detector + HTTP backend even though B2 no longer used them;
- ESLint 8 + `eslint-config-next@14.2.3`;
- `tailwind-scrollbar` as a production dependency.

B5 evidence also recorded 13 production audit findings:

- 4 moderate;
- 8 high;
- 1 critical.

## Evidence-driven upgrade sequence

B6 used `modernize/b6-deps` as a disposable dependency laboratory. Changes were tested in small groups rather than accepted as one blind upgrade.

### B6.1 — remove dead i18n packages and refresh maintained ranges

Removed:

- `i18next-browser-languagedetector`;
- `i18next-http-backend`.

The production audit improved from 13 findings to 9 before changing the framework major.

### B6.2 — Next 14 security backport

Next `14.2.35` kept all behavioral contracts green but the production audit remained at 9 findings, including one critical.

This proved that staying on the Next 14 line did not satisfy the B6 security target.

### B6.3 — Next 15 compatibility step

Next `15.5.25` passed quality and B2–B5 after making the B4 title assertion markup-tolerant instead of requiring an exact literal `<title>` tag shape.

The product title value remained unchanged.

This step removed the critical production finding.

### B6.4 — Next 16 + ESLint flat config

The maintained candidate moved to:

- Next `16.3.5`;
- `eslint-config-next@16.3.5`;
- ESLint flat config via `eslint.config.mjs`.

A trial with ESLint 10 produced peer overrides inside the stable Next ESLint plugin graph. It was rejected.

The accepted tooling line is ESLint `9.39.5`, which installs without peer overrides with the selected `eslint-config-next`.

The obsolete `.eslintrc.json` authority is removed.

### B6.5 — React 19

React and ReactDOM moved together to `19.3.0`.

Build and all B2–B5 contracts remained green.

### B6.6 — maintained i18n runtime

The runtime moved to:

- `i18next@26.4.2`;
- `react-i18next@17.0.14`.

The production audit improved to 5 findings.

### B6.8 — dependency classification

The five remaining production findings were traced to Tailwind 3 build tooling.

`tailwind-scrollbar` was incorrectly classified as a production dependency. Its Tailwind peer therefore kept the Tailwind toolchain inside `npm audit --omit=dev`.

Moving `tailwind-scrollbar` to `devDependencies` made the production audit clean without changing CSS behavior or migrating Tailwind majors.

### B6.9 / B6.10 — non-breaking transitive remediation

A non-forced `npm audit fix --package-lock-only` updated compatible transitive packages and reduced the full audit from 5 findings to one high-severity `brace-expansion@1.x` finding.

The remaining vulnerable package was owned by `minimatch@3.1.5`, whose accepted range includes newer `brace-expansion@1.x`.

B6 therefore uses one narrow override:

```json
{
  "overrides": {
    "minimatch@3.1.5": {
      "brace-expansion": "1.1.18"
    }
  }
}
```

The override is intentionally scoped to the old minimatch branch. It does not replace the independent brace-expansion 2.x/5.x branches.

Final laboratory run:

- run `35356512583`;
- candidate commit `46262483ef0f8ae2cb44a3252e27da2abeaa322d`;
- generated validated lock head `1c7cdf2324a17cec9f05c04b83e77cbeea4ab1e7`;
- quality: success;
- B2–B5 contracts: success;
- production audit: **0 findings**;
- complete audit: **0 findings**;
- ESLint baseline: **0 errors / 13 warnings**;
- Prettier baseline: **34 files**.

## Final dependency authority

Runtime dependencies:

- `next@16.3.5`;
- `react@19.3.0`;
- `react-dom@19.3.0`;
- `i18next@26.4.2`;
- `react-i18next@17.0.14`.

Build/dev tooling keeps Tailwind 3 rather than mixing a CSS framework migration into B6.

The existing Node/npm authority remains:

- Node `24.20.0`;
- npm `11.19.0`.

## Permanent contracts

B6 adds:

```bash
npm run test:b6:deps
npm run audit:prod
npm run audit:all
```

The deterministic dependency contract protects:

1. selected direct runtime versions;
2. package-lock resolution of those versions;
3. absence of dead i18n packages;
4. flat ESLint config and removal of legacy `.eslintrc`;
5. Tailwind scrollbar remaining dev-only;
6. exact scoped `brace-expansion` override;
7. removal of `swcMinify` from the Next 16 config.

Both audit commands are blocking in permanent CI. B6 does not accept a security exception because the validated tree is clean.

## Explicit non-adoptions

B6 does not:

- migrate Pages Router to App Router;
- migrate Tailwind 3 to Tailwind 4;
- use `--force`;
- use `--legacy-peer-deps`;
- accept peer overrides as the maintained install strategy;
- add a backend, database, state framework or new product feature;
- redesign the application.

## Exit

B6 is complete when the consolidated exact head on `modernize/2026-next-quality` passes:

- existing quality;
- B2–B5 deterministic/runtime contracts;
- B6 dependency contract;
- production audit;
- complete audit.

B7 owns final README/review/merge hygiene and post-merge verification.
