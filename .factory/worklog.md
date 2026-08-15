# Worklog

Append-only. One entry per task cycle or session: date (UTC), task id, what
happened, decisions and why, verification commands run, follow-ups. Newest
at the bottom.

---

## 2026-08-15 — Issue triage and ad-hoc planning

- Reviewed all eight open GitHub issues against their current comments, the roadmap, and the codebase; all retain actionable work.
- Added T1–T8 under `## Ad-hoc`, ordering the catalog test, generator repair, and workflow verification by dependency.
- Classified design-sensitive placement, calibration, pricing, catalog-correctness, and hydration work as major so their PRs require human review.
- Verification: `gh issue list --limit 100 --state open --json number,title,body,labels,assignees,url`; `gh issue view` for issues #193, #195, #197, #199, #205, #207, #208, and #210; `gh api repos/MrZoller/headroom/actions/permissions/workflow`; targeted source searches.

## 2026-08-15 — T1 catalog-order-independent Matrix tests

- Replaced Matrix assertions tied to Qwen3 8B's current popularity rank with expectations derived from `comparisonGrid()`, and selected the dense fixture row by its catalog property.
- Updated the narrow-readout browser test to measure the longest current accessible sentence instead of assuming the last popularity-sorted row provides it. A repository-wide audit found no other accidental hardcoded popularity-order assertions; intentional catalog-order contract tests remain unchanged.
- Acceptance evidence: temporarily reversed the bounded fixture's model rows, ran `npm test -- src/components/Matrix.test.tsx` (60 passed), then restored the fixture. The local correctness and security/tests panel verified CLEAR with no confirmed findings.
- Verification: `npm test` (41 files, 1,495 tests passed); `npm run test:e2e` (170 passed); `npm run lint`; `npm run format:check`; `npm run build`.
- Opened PR #213. First shepherd pass found CI runs 31889315584 and 31889314017 still in progress and no Codex verdict yet for head `8ccbcfd6a6d927011a66ebb1724a39f31091a113`; no review comments or threads. Task remains in review for the next shepherd pass.

## 2026-08-15 — T1 merged

- PR #213 squash-merged at head `8ccbcfd6a6d927011a66ebb1724a39f31091a113`; its branch was deleted and local `main` synced.
- Both CI workflow runs passed (build and browser checks). There were no review comments or threads. Codex has no activity on the repository's recent PRs and the Claude review workflow is not configured, so neither was a merge condition.
- Marked T1 complete and cleared its recorded task, branch, PR, and hold state.
