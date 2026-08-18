# Plan: Headroom issue backlog

## Approach

Treat the open GitHub issue tracker as the external specification and import one independently shippable task per uncovered issue. Keep prior factory-completed work and ad-hoc review debt intact, while using `Fixes #N` as the durable issue-to-task link. Ground each new task in the existing engine, component, browser-test, or workflow surface named by the issue; do not infer ordering where the issue does not establish a prerequisite. Future syncs append new work without resizing, rewording, or renumbering these tasks. The rolling parked-review-minors batch remains blocked until its normal drain trigger.

## Tasks

- [x] T10 (standard) — Speed model prices all KV reads at device bandwidth even when shed layers hold their KV in host RAM (Fixes #222)
  - acceptance: `src/engine/speed.ts` prices KV reads for shed llama.cpp layers at host offload bandwidth while preserving device-bandwidth pricing for resident-layer KV; focused `src/engine/speed.test.ts` coverage proves resident estimates are unchanged and partial-offload decode slows with host-resident KV, context growth, and constrained host bandwidth
  - pr: 227
- [x] T11 (standard) — Matrix ranking blurb asserts on text hidden at 320px viewport (Fixes #216)
  - acceptance: the 320px Matrix Playwright coverage in `e2e/matrix-readout.spec.ts` selects and asserts the brief readout that is actually visible at that viewport, while continuing to prove the visible ranking text fits its reservation without panel or document horizontal overflow
  - pr: 229
- [!] T12 (standard) — Catalog-refresh PRs never trigger the Claude review workflow (Fixes #215)
  - acceptance: catalog PR creation and later refresh pushes trigger Claude review for the opened and synchronized heads; `.github/workflows/catalog-refresh.yml` and `.github/workflows/claude-code-review.yml` retain their existing fork, draft, Dependabot, and least-privilege safeguards; live workflow evidence verifies both creation and update paths and `docs/ROADMAP.md` records the resulting publication/review contract
- [x] T13 (standard) — Reopened #193: catalog refresh: the weekly PR never opens, so fresh figures strand on a branch (Fixes #193)
  - acceptance: repository workflow defaults remain read-only while Actions PR creation stays enabled; a substantive manual or scheduled refresh opens or updates a non-destructive `catalog/refresh` PR based on current `main`, and live run plus three-dot-diff evidence records that fresh figures are published rather than stranded
  - pr: 230

## Risks

- T10 changes performance estimates across every partially offloaded llama.cpp placement; if the placement data cannot identify the host-resident KV fraction without changing the engine contract, stop and ask rather than approximate it from unrelated bytes.
- T11 must test responsive visibility in Playwright rather than treating jsdom text presence as layout evidence.
- T12 crosses a privileged workflow boundary; if neither a narrowly scoped non-suppressed credential nor a trusted two-stage workflow can preserve current untrusted-PR safeguards, stop for a security design decision.
- T13 represents an open issue already covered by factory-completed T3; per the reopen rule its new task must assess the issue's current state without reviving or rewriting T3's shipped merge.

## Ad-hoc

The T1–T8 backlog imports below were requested directly by Chris
(2026-08-15) and are ad-hoc pre-approved at their recorded sizes per
factory-protocol — the request is the approval; the spec/plan approval
gates do not apply to them. (Recorded after a cycle went idle reading
those gates literally.)

- [x] T1 (trivial) — Decouple Matrix tests from generated catalog order (Fixes #197)
  - acceptance: `src/components/Matrix.test.tsx` derives first-cell names and figures from the current catalog or a deliberately stable fixture; a repository-wide test sweep finds no assertions that depend accidentally on generated popularity order; Matrix tests pass after catalog rows are reordered
  - deps: none
- [x] T2 (major) — Restore trustworthy gpt-oss-120b catalog generation (Fixes #199)
  - acceptance: the current upstream `openai/gpt-oss-120b` tensor layout and revision behavior are documented from source evidence; `scripts/build-catalog.ts` models that layout without weakening the MXFP4 safety invariant or dropping the default model; `npm run catalog` regenerates all seeded models and focused tests guard the resolved packing rule
  - deps: T1
- [x] T3 (standard) — Verify and harden automated catalog refresh publication (Fixes #193)
  - acceptance: with repository workflow defaults still least-privilege, a manual or scheduled refresh completes through creation or update of a non-destructive PR based on current `main`; obsolete `catalog/refresh` state cannot invite a destructive manual merge; the successful run and resulting PR are recorded
  - deps: T2
- [x] T4 (major) — Resolve pinned-tensor placement floor semantics (Fixes #210)
  - acceptance: `src/engine/placement.ts`, verdict copy, and launch guidance implement and document one evidence-backed treatment for a seeded device whose pinned tensors, KV, and activations exceed its ceiling; the UI neither falsely claims an OOM nor silently prices an unmodeled host-KV placement; tests cover the measured seeded-bin overflow and ordinary offload cases
  - deps: none
- [x] T5 (major) — Reject calibration runs from unpriced layer placements (Fixes #208)
  - acceptance: `describeMismatch` accepts only the explicitly documented llama.cpp placement spellings, including a correct zero-GPU case and any justified legacy tolerance; fully resident and partially resident mismatches cannot enter the calibration submission corpus unnoticed; rejection copy distinguishes `-ngl` slot values from repeating-layer counts and focused tests cover both arms
  - deps: none
- [x] T6 (standard) — Emit tensor splits for reproducibly even placements (Fixes #207)
  - acceptance: the population still reaching the even-split suppression gate is re-measured against current `main` and current llama.cpp behavior; `src/lib/launch.ts` emits `-ts` whenever omission would diverge from the engine's placement, using the current last-share output-slot rule; tests derive expected devices from engine accounting rather than restating emitter logic
  - deps: none
- [x] T7 (major) — Define and surface honest device pricing (Fixes #205)
  - acceptance: device price semantics, date, source, USD/pre-tax labeling, multi-device presentation, and unavailable or stale cases are documented in the catalog contract; selected UI and prerender surfaces expose supported prices without implying a full-system or current street price; announced, rumored, discontinued, datacenter, and CPU-RAM rows have tested honest fallbacks; price-based ranking remains out of scope
  - deps: none
- [x] T8 (major) — Remove the Matrix from prerendered route payloads safely (Fixes #195)
  - acceptance: server output and the client's first render omit the cross-catalog Matrix consistently, then populate it without hydration warnings or geometry regressions; raw route HTML retains the selected device-model fit, memory, prefill, and decode figures; build measurements demonstrate the expected per-page and total output reduction and existing prerender/e2e guards pass
  - deps: none
  - pr: 226
- [x] T9 (standard) — parked review minors (batch) — released 2026-08-17: Chris greenlit working the full backlog; the batch drains with it
  - Re-run the catalog generation and verification gate after selecting the current `origin/main` base, so a concurrent main change cannot combine a newly fetched base with a catalog generated and tested against an older checkout. [PR #220](https://github.com/MrZoller/headroom/pull/220#discussion_r3790503366)
  - Revalidate the refresh PR's open state after publication before choosing `gh pr edit`, handling a close/merge race rather than relying on the initial snapshot. [PR #220](https://github.com/MrZoller/headroom/pull/220#discussion_r3790503368)
  - Add typo-rejection regressions for invalid device-price `unit`, `availability`, and `reason` values. [PR #225](https://github.com/MrZoller/headroom/pull/225#discussion_r3791993851)
  - pr: 231
- [!] T14 (trivial) — parked review minors (batch)
  - Select the current `main` checkout before installing dependencies in catalog refresh, so catalog generation cannot use current-main source with stale dependencies. [PR #231](https://github.com/MrZoller/headroom/pull/231#discussion_r3799405985)
  - Update the catalog-refresh deployment contract for the post-publication PR-query revalidation. [PR #231](https://github.com/MrZoller/headroom/pull/231#discussion_r3799405992)
  - (moved from completed T9's record 2026-08-17 — they were parked there after its merge; the rolling batch re-seeds here since re-sync never does)
