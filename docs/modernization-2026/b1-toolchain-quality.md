# B1 — Reproducible toolchain and read-only quality

## Status

B1 establishes the maintained 2026 toolchain and the first permanent quality gate. It does not change Star Wars application behavior, Next/React/i18n versions, routing, SWAPI access or UI semantics.

## Evidence used from B0

B0 proved the committed 2024 lockfile installs, lints and builds successfully on both Node 20.19.5 and Node 24.20.0.

The maintained authority selected for 2026 is:

- Node `v24.20.0`;
- npm `11.19.0`.

This is encoded rather than left as tribal knowledge.

## Runtime/package-manager authority

B1 adds:

- `.nvmrc` → `v24.20.0`;
- `.npmrc` → `engine-strict=true`;
- `package.json#engines.node` → `>=24.20.0 <25`;
- `package.json#engines.npm` → `>=11.19.0 <12`;
- `packageManager` → `npm@11.19.0`.

npm remains the package manager because the repository already has a valid npm lockfile. No package-manager migration is introduced for aesthetics.

## Read-only lint contract

The historical script delegated to `next lint`.

B1 replaces that public command with direct ESLint:

```bash
npm run lint
```

The writer is explicit and separate:

```bash
npm run lint:fix
```

The B1 probe showed direct ESLint reproduces the maintained rule set with:

- **0 errors**;
- **17 warnings**.

The warnings are primarily `@next/next/no-img-element`, plus two `react-hooks/exhaustive-deps` findings.

`quality:lint-baseline` caps the maintained debt at **0 errors / 17 warnings**. Improvements are allowed; regressions are not.

## Formatting contract

B1 adds Prettier `3.9.8` as an exact development dependency.

Read-only:

```bash
npm run format:check
```

Writer:

```bash
npm run format:write
```

The B1 probe found **35** files outside Prettier formatting.

B1 deliberately does not mass-format application code because no behavioral test net exists yet. `quality:format-baseline` caps the debt at 35 files, so future changes may reduce but not increase it.

## Hygiene contract

`quality:hygiene` protects:

- private-package status;
- Node/npm/packageManager authority;
- read-only lint/format/quality scripts;
- absence of tracked `.next`, `node_modules`, `out` and coverage output;
- presence of the npm lockfile and ESLint config.

The two historical PostCSS configs are explicitly recorded as **known B2 debt**. B1 does not pick an authority without testing runtime/i18n/config behavior first.

## Permanent quality command

```bash
npm run quality
```

runs:

1. hygiene;
2. lint non-regression;
3. formatting non-regression;
4. production build;
5. clean tracked working-tree check.

It never invokes `--fix` or `--write`.

The build still logs i18next backend connection failures while generating pages because the historical i18n loader points to `localhost:3000` when no server is listening. The Next build nevertheless exits successfully. This is a characterized B2 portability defect, not hidden by B1.

## Permanent CI

`.github/workflows/quality.yml` runs on:

- pull requests to `main`;
- pushes to `main`;
- the modernization branch;
- manual dispatch.

The workflow uses:

- SHA-pinned checkout/setup-node/upload-artifact actions;
- minimum `contents: read` permissions;
- timeout;
- per-ref concurrency;
- exact runtime identity verification;
- `npm ci`;
- blocking `npm run quality`.

The production audit remains an explicit **non-blocking debt inventory** in B1 because B0 already measured 13 production findings including one critical. B1 does not make a knowingly red security inventory look green by deleting it or running a blind force fix.

## Probe/materialization evidence

### Quality probe

Run `35309971699`:

- direct ESLint: exit 0;
- 0 errors / 17 warnings;
- Prettier: 35 different files;
- both PostCSS config files confirmed present.

Artifact `10533166432`:

- digest `sha256:92a78b61512bb673fc3b45e78977adab12d1aa97ac8629ae8d8b22a45b1642de`.

### Validated graph materialization

Run `35310580856`:

- baseline `npm ci`: success;
- generated graph `npm ci`: success;
- hygiene/lint/format ratchets: success;
- production build: success;
- direct lint/format behavior verified;
- non-workflow package/lock/tooling contract committed as `22a47ca65e1065ecdcedd802c657b229fad5f7ff`.

Validated candidate artifact `10533027822`:

- digest `sha256:3c13b4c23a4a84c1a913be40f41fb18a63b34a802a85d332efa87b3a3c4a6709`.

The exact final permanent-workflow run is recorded in repository issue #2 after this document is committed, avoiding a self-referential documentation commit.

## Explicit non-adoptions

B1 does not:

- upgrade Next or React;
- introduce TypeScript;
- rewrite Pages Router/App Router;
- fix SWAPI behavior;
- change localization semantics;
- remove either PostCSS config;
- mass-format 35 files;
- suppress the 17 lint warnings;
- run `npm audit fix --force`;
- hide the critical production audit finding.

## Exit

B1 is complete only when a fresh checkout of the final B1 HEAD passes the permanent workflow with:

- exact Node/npm identity;
- `npm ci`;
- read-only quality green;
- audit debt still visible.

B2 owns runtime/config/i18n portability.
