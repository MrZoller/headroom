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

## 2026-08-15 — out-of-band CI fix (#217)

Synced the Dependabot guard from opencode-factory#8 into claude-code-review.yml: Dependabot-triggered runs get fork-class secret restrictions, so the job now skips on `github.actor == dependabot[bot]` instead of failing red on dep bumps. Rode the T1 ship/log/complete bookkeeping to origin (squash 31e93e9). Verification: `ruby -ryaml -e "YAML.load_file('.github/workflows/claude-code-review.yml')"`.

## 2026-08-15 — T2 trustworthy gpt-oss MXFP4 generation

- Established from pinned upstream evidence that `openai/gpt-oss-120b` still uses the original U8 MXFP4 block/scale shard layout at revision `b5c939de8f754692c1647ca79fbf85e8c1e70f8a`; Hugging Face's derived U8 summary changed independently from 33/32 of logical experts to 1x, while gpt-oss-20b still reports 33/32.
- Replaced summary-only trust with exact pinned-header validation: every layer must contain both expert projection block/scale pairs, 16 block bytes must encode 32 values, scales must match block prefixes, all packed tensors must be accounted for, and reconstructed/analytic counts must agree. Both observed API ratios are accepted only after that proof; unsafe tensor dimensions are refused.
- Updated `docs/ROADMAP.md` with the revision behavior, measured counts, and source links. Focused tests cover both summary conventions, incomplete or altered layouts, unrelated U8 tensors, count disagreements, and unsafe shapes. The generated catalog was reverted after verification to avoid committing unrelated live popularity churn.
- Acceptance evidence: `npm run catalog` completed 35 ok / 0 failed twice after the final implementation, retained `openai/gpt-oss-120b` at 116.8B, and wrote a complete catalog. Local correctness and security/tests review reached CLEAR; the verifier confirmed one safe-integer minor, it was fixed, and the re-panel verified the fix CLEAR.
- Verification: `npm test` (41 files, 1,504 tests passed); `npm run test:e2e` (170 passed); `npm run lint`; `npm run format:check`; `npm run build` (199 routes prerendered); `npm run catalog` (35/35).
- Opened held major-task PR #218. First shepherd pass found both CI build/browser runs still in progress, the Claude review workflow successful with no findings, Codex actively reviewing the verified head via a current 👀 reaction, and no comments or review threads. Task remains in review with `hold: true` for human approval and must not auto-merge.

## 2026-08-15 — T2 merged

- PR #218 was manually squash-merged at head `d8ee631dd9879432e0a62375a3d4732c91357326`; local `main` was synced to merge commit `b1815f2`.
- Both CI workflow runs passed (build and browser checks), the Claude review workflow completed successfully, and there are no PR comments, formal reviews, or review threads. No late-merge marker exists for this PR.
- Marked T2 complete and cleared its recorded task, branch, PR, and hold state.

## 2026-08-15 — T3 catalog refresh publication hardening

- Changed the refresh workflow to fetch current `origin/main`, preserve history only while an open refresh PR exists, rebuild stale no-PR state with an explicit force-with-lease, and reject any pre-push three-dot diff other than `src/data/models.generated.json`. Documented the branch lifecycle and two-dot/three-dot distinction in `docs/ROADMAP.md`.
- Acceptance evidence: workflow-dispatch run [31913354836](https://github.com/MrZoller/headroom/actions/runs/31913354836) completed successfully under read-only repository defaults and created catalog PR [#219](https://github.com/MrZoller/headroom/pull/219). The resulting `catalog/refresh` branch is one commit atop current `main`; `git diff --name-only origin/main...origin/catalog/refresh` returned only `src/data/models.generated.json`. Recorded the result on issue #193 and closed superseded PR #211.
- Verification: `npm run lint && npm run format:check && npm test && npm run build && npm run test:e2e` passed (41 files / 1,504 unit tests, 199 prerendered routes, 170 browser tests). The local correctness and security/tests panel and adversarial verifier returned CLEAR.
- Opened PR #220 at head `1cc9b2e0c87d96bbd54473f57b9c48e745638400`. First shepherd pass found build and browser CI, Claude review, and Codex review still pending; there are no comments, threads, labels, or hold. Task remains in review for the next shepherd pass.

## 2026-08-15 — T3 merged

- PR #220 squash-merged at verified head `1cc9b2e0c87d96bbd54473f57b9c48e745638400`; its branch was deleted and local `main` synced.
- Build, browser, and Claude Code Review checks passed on that head. Codex reviewed the same head. Both Codex findings were verified as real but non-blocking timing races and parked in the single rolling T9 review-minors batch; the repository ruleset requires thread resolution, so the disposition replies were recorded and both threads resolved.
- Marked T3 complete and cleared its recorded task, branch, PR, and hold state. The factory is idle because the remaining ad-hoc tasks require approvals; no refuted findings require a WORKLOG decision entry.
- Shepherd verification: `gh pr view 220 --json headRefOid,state,mergeStateStatus,statusCheckRollup,reviews`; `gh run list --workflow=claude-code-review.yml --commit 1cc9b2e0c87d96bbd54473f57b9c48e745638400`; `gh api repos/MrZoller/headroom/rules/branches/main`; `~/.config/opencode/bin/factory-git merge 220 1cc9b2e0c87d96bbd54473f57b9c48e745638400`.

## 2026-08-16 — T4 pinned-tensor host-KV fallback semantics

- Established from llama.cpp commit `ece963f` that shed layers execute on the CPU and their KV buffers follow them to host memory; transparent VRAM fallback is not assumed. Headroom now preserves pinned tensors, caps reported weight spill at repeating-layer bytes, and records the runnable mixed placement as `unpricedHostKv` rather than false OOM or ordinary priced offload.
- Workload verdicts explicitly say host RAM is unchecked and performance cannot be graded. llama-server and llama-bench commands remain available with matching launch guidance; the measured Llama 3.2 3B BF16 case on 4× RTX 5080 at 128K/4 users emits `-ngl 4`, with the output-only seeded card preserved.
- Acceptance evidence: focused regression tests cover the measured seeded-bin overflow and an ordinary weight-offload control. The local correctness and security/tests panel reached CLEAR after the verifier rejected one finding whose proposed `canOffload` guard was already present.
- Verification: `npm test` (41 files, 1,508 tests passed); `npm run lint`; `npm run format:check`; `npm run build` (199 routes plus 404.html, 162.5 MiB); `npm run test:e2e` (170 passed).
- Opened held major-task PR [#221](https://github.com/MrZoller/headroom/pull/221). Task remains in review with `hold: true` for human approval and must not auto-merge.
- First shepherd pass at head `a2eebca5d8d3afbd6686ce1ac484532d54d301fb`: PR CI run 31916998786 passed; push CI run 31916996714 and Claude review run 31916998836 remain in progress; Codex has an active 👀 reaction and no verdict yet. There are no comments, reviews, threads, or findings. After automation completes, this held major still requires human merge authority.

## 2026-08-16 — T4 merged

- Held major PR [#221](https://github.com/MrZoller/headroom/pull/221) was squash-merged at verified head `2e240ff41b7d62dc30537c5e67093a8b928276a2` as `3005b9c` and its branch was deleted.
- CI build and browser checks and the Claude Code Review workflow all passed on the merged head. Codex reviewed that exact head. There is no late-merge marker and no new bot verdict after the merge to triage.
- Marked T4 complete and cleared its recorded task, branch, PR, and hold state. No minors or refuted findings require post-merge entries.
- Shepherd verification: `gh pr view 221 --json state,mergedAt,headRefOid,statusCheckRollup,reviews,comments`; `gh run list --commit 2e240ff41b7d62dc30537c5e67093a8b928276a2`; `~/.config/opencode/bin/factory-git sync`.

## 2026-08-16 — T5 exact calibration placement validation

- Removed the legacy partial-placement tolerance: a prediction of `N` resident repeating layers now accepts only llama.cpp's `-ngl N+1`; zero accepts only `-ngl 0`, and an `L`-layer fully resident prediction requires at least `-ngl L+1` while retaining larger values that clamp to the same placement.
- Rejection copy now distinguishes the pasted `-ngl` slot value, the repeating layers it loads, the repeating layers Headroom priced, and the emitted value. Focused tests prove rejected partial and fully resident rows are filtered from the calibration submission corpus; the settled semantics are recorded in `docs/ROADMAP.md`.
- Verification: `npm run lint`; `npm run format:check`; `npm test` (41 files, 1,519 tests passed); `npm run build` (199 routes plus 404.html, 160.5 MiB); `npm run test:e2e` (170 passed). The local correctness and security/tests panel and adversarial verifier returned CLEAR.
- Opened held major-task PR [#223](https://github.com/MrZoller/headroom/pull/223). Task remains in review with `hold: true` for human approval and must not auto-merge.
- First shepherd pass at head `70d893d48548031360162660cb468e17fe1537d5`: build and browser CI plus Claude Code Review are in progress; Codex has an active 👀 reaction and no verdict yet. There are no comments, reviews, threads, or findings. The repository has no hold label, so durable `state.hold: true` and the major classification enforce the hold; human merge authority remains required after automation completes.

## 2026-08-16 — T5 merged

- Held major PR [#223](https://github.com/MrZoller/headroom/pull/223) was manually squash-merged at head `70d893d48548031360162660cb468e17fe1537d5` as `8e78c5f` and its branch was deleted.
- Both CI build/browser runs and the Claude Code Review workflow passed. Codex posted a clean `+1` reaction on the PR body; the PR had a single pushed head, so that verdict is attributable to the merged head. There are no review comments or threads, and no parked minors or refuted findings require follow-up.
- Marked T5 complete and cleared its recorded task, branch, PR, and hold state. Created the late-verdict cursor at count 0; it remains during the 30-minute post-merge window.
