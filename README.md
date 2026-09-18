# Star Wars App — Next.js

Historical frontend-learning project built with **Next.js 14 + React 18** around a Star Wars themed interface.

The repository uses the Next.js Pages Router structure under `src/pages`, reusable components/hooks, internationalization support and Tailwind-related styling. This README replaces the default `create-next-app` text so the repository describes the actual project and its place in the portfolio.

## Stack

- Next.js 14.2
- React 18
- JavaScript
- i18next / react-i18next
- browser language detection + HTTP translation backend
- Tailwind CSS 3
- ESLint 8 (direct CLI) + Prettier 3.9.8

## Project structure

The source is organized around:

- `src/pages/` — routed pages;
- `src/components/` — reusable UI;
- `src/hooks/` — shared frontend behavior;
- `src/i18n/` — translation/internationalization setup;
- `src/styles/` — project styling;
- `public/` — static assets.

## Reproducible toolchain

The 2026 maintenance lane is verified on:

- Node `v24.20.0`;
- npm `11.19.0`.

The authority is encoded in `.nvmrc`, `package.json#engines`, `packageManager` and `.npmrc` with `engine-strict=true`.

Install from the committed lockfile:

```bash
nvm use
npm ci
```

B0 also reproduced the historical project on Node 20.19.5, but Node 24 is the maintained 2026 authority.

## Local development

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

Build and run the production bundle:

```bash
npm run build
npm start
```

Quality commands are intentionally split between read-only checks and explicit writers:

```bash
npm run lint
npm run lint:fix
npm run format:check
npm run format:write
npm run quality
```

`npm run quality` never edits files. B1 preserves the historical debt with non-regression ceilings of **0 lint errors / 17 warnings** and **35 Prettier-different files** while later blocks repair behavior under tests.

The production dependency audit is visible in CI but remains non-blocking in B1 because B0 measured **13 production findings including 1 critical**. Dependency repair belongs to the evidence-driven dependency block, not to the toolchain setup.

## Portfolio status

This repository is preserved as a **Next.js/framework learning project**. It is not currently presented as a production Star Wars product and it does not need speculative features to justify its place in the portfolio.

The active 2026 maintenance lane preserves the original learning intent. B0 reproduced the real 2024 app and B1 established the deterministic toolchain/quality gate. The next block owns **runtime/config/i18n portability**: the hardcoded localhost translation URL, duplicate PostCSS authority and locale/security-header contract.

Modernization evidence:

- [B0 — reproducible 2024 baseline](docs/modernization-2026/b0-baseline.md)
- [B1 — reproducible toolchain and read-only quality](docs/modernization-2026/b1-toolchain-quality.md)

Portfolio coordination: [`Enzopinotti/Enzopinotti#19`](https://github.com/Enzopinotti/Enzopinotti/issues/19)

## Author

Enzo Pinotti
