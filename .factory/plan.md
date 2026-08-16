# Plan: (none yet)

No plan has been written. After the spec is approved, run `/plan`. Task
format and status marks (`[ ]` todo · `[~]` doing · `[R]` review · `[x]`
done · `[!]` blocked) are defined in the `factory-protocol` skill.

## Ad-hoc

<!-- user-requested tasks land here -->

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
- [~] T6 (standard) — Emit tensor splits for reproducibly even placements (Fixes #207)
  - acceptance: the population still reaching the even-split suppression gate is re-measured against current `main` and current llama.cpp behavior; `src/lib/launch.ts` emits `-ts` whenever omission would diverge from the engine's placement, using the current last-share output-slot rule; tests derive expected devices from engine accounting rather than restating emitter logic
  - deps: none
- [ ] T7 (major) — Define and surface honest device pricing (Fixes #205)
  - acceptance: device price semantics, date, source, USD/pre-tax labeling, multi-device presentation, and unavailable or stale cases are documented in the catalog contract; selected UI and prerender surfaces expose supported prices without implying a full-system or current street price; announced, rumored, discontinued, datacenter, and CPU-RAM rows have tested honest fallbacks; price-based ranking remains out of scope
  - deps: none
- [ ] T8 (major) — Remove the Matrix from prerendered route payloads safely (Fixes #195)
  - acceptance: server output and the client's first render omit the cross-catalog Matrix consistently, then populate it without hydration warnings or geometry regressions; raw route HTML retains the selected device-model fit, memory, prefill, and decode figures; build measurements demonstrate the expected per-page and total output reduction and existing prerender/e2e guards pass
  - deps: none
- [!] T9 (trivial) — parked review minors (batch)
  - Re-run the catalog generation and verification gate after selecting the current `origin/main` base, so a concurrent main change cannot combine a newly fetched base with a catalog generated and tested against an older checkout. [PR #220](https://github.com/MrZoller/headroom/pull/220#discussion_r3790503366)
  - Revalidate the refresh PR's open state after publication before choosing `gh pr edit`, handling a close/merge race rather than relying on the initial snapshot. [PR #220](https://github.com/MrZoller/headroom/pull/220#discussion_r3790503368)
