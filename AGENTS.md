# Headroom

Headroom models VRAM capacity, decode speed, and time‑to‑first‑token for a variety of open‑weight LLMs across discrete GPUs, unified‑memory SoCs, and CPU‑RAM systems. It provides a web UI for exploring model‑device trade‑offs and emits runnable placement commands for llama.cpp.

Read `docs/ROADMAP.md` before making changes. It records settled decisions and derivations that are easy to get subtly wrong.

## Commands

- **setup:** `npm install`
- **test:** `npm test`
- **test:e2e:** `npm run test:e2e`
- **lint:** `npm run lint`
- **format:** `npm run format`
- **run (dev server):** `npm run dev`
- **build:** `npm run build`
- **catalog (regen models catalog):** `npm run catalog`

Commands `npm install`, `npm test`, `npm run lint`, and `npm run format:check` have been executed locally and succeeded; other commands are defined but not yet verified in this session.

## Stack & layout

- **Language & runtime:** TypeScript 6 (strict) running on Node 20, React 19, Vite 8, Tailwind v4, Zustand 5.
- `src/engine/` – pure math and placement logic, no React imports. Core objects: `Placement`, `Verdict`, `Measure`, `Speed`, `KV`, `Matrix`.
- `src/data/` – curated data (`devices.json`), generated catalog (`models.generated.json`), quant/runtimes definitions (`quants.ts`, `runtimes.ts`), route map (`routes.ts`).
- `src/prerender/` – build‑only scripts that compose static HTML pages and `sitemap.xml` using the Vite SSR bundle.
- `src/lib/` – non‑engine helpers used by UI: `detect.ts` (browser I/O seam), `launch.ts`, `calibrate.ts` (pure), plus assorted utilities.
- `src/components/` – UI panels (Bench, Envelope, Matrix, Detect, Recommend, Launch, Calibrate) built with React.
- `src/store/` – Zustand store and URL sync logic.
- `scripts/` – auxiliary tooling: `build-catalog.ts` (regenerates `models.generated.json`), `prerender.ts` (static site generation), test helpers.
- `src/main.tsx` – Vite entry point for development server.
- `src/entry-server.tsx` – SSR entry point used by prerendering.

## Conventions

- **Naming:** Files use kebab‑case; React components are PascalCase. Test files mirror source files with a `.test` suffix (e.g. `placement.test.ts`).
- **Error handling:** Engine functions throw typed `Error` objects; UI layers catch and surface errors via the `CopyButton`/alert pattern.
- **Testing idiom:** Unit tests run in Vitest (`npm test`), covering pure engine and lib code. End‑to‑end tests run in Playwright (`npm run test:e2e`) for browser‑only behaviours (layout, scrolling, canvas). Canvas‑related tests emit “Not implemented: HTMLCanvasElement.getContext()” warnings in the Node environment but are treated as expected.
- **Imports:** Use the `@/` alias for the `src/` root (configured in `vite.config.ts`).
- **Formatting/Linting:** Enforced via ESLint (`npm run lint`) and Prettier (`npm run format`). CI checks `format:check`.

## Factory

This repository is on the software-factory line. Load the `factory-protocol` skill before factory work; durable task state lives in `.factory/`.

## Gotchas

- Node test environment lacks a real canvas implementation; `npm test` prints a series of “Not implemented: HTMLCanvasElement.getContext()” messages – they are harmless and expected.
- The `devices.json` order is significant: UI renders rows in file order; do not sort the file.
- `models.generated.json` is derived; never edit manually – run `npm run catalog` to refresh.
- Some lint rules (`eslint-plugin-react-hooks`) require React hooks to follow the Rules of Hooks; violations will cause CI failures.
