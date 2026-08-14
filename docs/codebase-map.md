# Headroom – Codebase Map

_Generated on 2026‑08‑14 for onboarding agents. Keep this file in sync with any structural changes._

## 1. Repository layout

```
/ (repo root)
├─ AGENTS.md                ← operational guide for agents (see file)
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ README.md
├─ docs/
│   ├─ ROADMAP.md          ← high‑level roadmap (human‑authored)
│   └─ codebase-map.md     ← **you are reading this file**
├─ src/
│   ├─ main.tsx            ← Vite dev server entry point (client)
│   ├─ entry-server.tsx    ← SSR entry point used by prerendering
│   ├─ components/         ← React UI panels (Bench, Envelope, Matrix, Detect, Recommend, Launch, Calibrate)
│   ├─ engine/             ← Pure TypeScript engine – no React imports
│   │   ├─ index.ts        ← public API (evaluate, types, etc.)
│   │   ├─ placement.ts
│   │   ├─ speed.ts
│   │   ├─ verdict.ts
│   │   ├─ matrix.ts
│   │   └─ … (kv, activations, weights, etc.)
│   ├─ data/               ← static data
│   │   ├─ devices.json    ← curated hardware list (order matters)
│   │   ├─ models.generated.json ← **generated** model catalog (regenerated via `npm run catalog`)
│   │   ├─ quants.ts
│   │   ├─ runtimes.ts
│   │   └─ routes.ts       ← route map for prerendering
│   ├─ lib/                ← UI‑side helpers (detect, launch, calibrate, format utilities)
│   ├─ store/              ← Zustand store + URL sync (`config.ts`, `url.ts`)
│   ├─ prerender/          ← Build‑only scripts that create static HTML pages and `sitemap.xml`
│   └─ test/               ← shared test helpers
├─ scripts/
│   ├─ build-catalog.ts    ← generates `models.generated.json`
│   └─ prerender.ts        ← runs the prerenderer to emit `dist/` and `sitemap.xml`
├─ e2e/                    ← Playwright end‑to‑end specs (run via `npm run test:e2e`)
└─ .gitignore, eslint.config.js, .prettierrc.json, playwright.config.ts, etc.
```

## 2. Core data flow (UI → Engine → Results)

1. UI components dispatch actions to the **Zustand store** (`src/store/config.ts`).
2. Store changes are **synced to the URL** (`src/store/url.ts`) for deep‑linking.
3. UI builds a **Scenario** object (model, quant, usage, rig, runtime) and calls `engine.evaluate(scenario)` (public API from `src/engine/index.ts`).
4. `evaluate` normalises inputs, computes placement (`planPlacement`), speed estimates (`estimateDecode`, `estimatePrefill`), KV costs, and context limits, returning an **Evaluation** object.
5. UI renders the verdict, matrix, and benchmark panels using the data returned.
6. For _Launch_ and _Calibrate_ actions, helpers in `src/lib/` construct llama‑cpp command strings based on the `Placement` result.

## 3. Generated vs curated artefacts

| Path                             | Type              | How it is produced                                                                                                   |
| -------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `src/data/devices.json`          | Curated           | Edited manually – **order matters** for UI row order.                                                                |
| `src/data/models.generated.json` | Generated         | Produced by `npm run catalog` → `scripts/build-catalog.ts`. Never edit directly.                                     |
| `dist/` (static site)            | Generated         | `npm run build` → Vite client + SSR bundle → `scripts/prerender.ts` writes HTML files and `sitemap.xml`.             |
| `dist/sitemap.xml`               | Generated         | Same prerender step as above.                                                                                        |
| `src/data/routes.ts`             | Curated (derived) | Defines the static routes for device‑ and model‑specific pages; used by both the browser router and the prerenderer. |

## 4. CI / test configuration (as coded)

- **Lint** – `npm run lint` (ESLint). Enforces `eslint-plugin-react-hooks` rules.
- **Format check** – `npm run format:check` (Prettier) – CI fails on mismatches.
- **Unit tests** – `npm test` (Vitest). Config in `vite.config.ts`:
  - `testTimeout: 30_000` (30 s per test).
  - Excludes `node_modules/**`, `dist/**`, `e2e/**`, `.claude/worktrees/**`.
  - Coverage includes `src/engine/**`, `src/store/**`, `src/lib/**`, `src/data/**`.
- **End‑to‑end tests** – `npm run test:e2e` (Playwright) – specs live under `e2e/`.
- **Build** – `npm run build` runs `tsc -b`, Vite client build, Vite SSR build, then `scripts/prerender.ts`.
- **Catalog regeneration** – `npm run catalog` runs `scripts/build-catalog.ts`.

## 5. Known risks / oddities (gotchas)

- **Canvas warnings** – Unit tests emit “Not implemented: HTMLCanvasElement.getContext()” warnings; they are harmless.
- **`devices.json` order** – UI preserves file order; do not sort the file.
- **Generated catalog** – Manual edits to `models.generated.json` will be overwritten; always regenerate via `npm run catalog`.
- **ESLint React‑hooks rule** – Violations cause CI failures; ensure hooks are not called conditionally.
- **Test suite duration** – The Matrix grid tests are heavy; the 30 s per‑test timeout is tuned for CI.
- **Worktree `.gitignore` nuance** – `node_modules/` matches a directory, not a symlink; in a worktree a symlinked `node_modules` can be mistakenly staged. The repo already contains fixes, but verify when creating new worktrees.
- **`BASE_PATH` / `SITE_ORIGIN` env vars** – Required for correct static‑site URLs on custom domains; defaults are safe for local dev but must be set in production CI.
- **Factory state is durable** – Factory decisions, blockers, plans, and task status belong in `.factory/`, not only in conversation history.
- **High‑severity npm vulnerabilities** – Reported by `npm install`; assess them in a separate dependency-maintenance change.

---

_End of `docs/codebase-map.md`._
