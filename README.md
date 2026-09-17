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
- ESLint / Next lint

## Project structure

The source is organized around:

- `src/pages/` — routed pages;
- `src/components/` — reusable UI;
- `src/hooks/` — shared frontend behavior;
- `src/i18n/` — translation/internationalization setup;
- `src/styles/` — project styling;
- `public/` — static assets.

## Local development

Install dependencies:

```bash
npm install
```

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

Lint the current codebase:

```bash
npm run lint
```

## Portfolio status

This repository is preserved as a **Next.js/framework learning project**. It is not currently presented as a production Star Wars product and it does not need speculative features to justify its place in the portfolio.

A future maintenance lane should focus on:

- upgrading Next/React only after verifying behavior and compatibility;
- checking the current data/API assumptions used by the UI;
- testing the internationalization and navigation paths;
- cleaning duplicate or obsolete configuration where appropriate;
- adding targeted tests and CI if the project remains part of the public portfolio;
- preserving the original learning intent instead of turning it into an unrelated application.

Portfolio coordination: [`Enzopinotti/Enzopinotti#19`](https://github.com/Enzopinotti/Enzopinotti/issues/19)

## Author

Enzo Pinotti
