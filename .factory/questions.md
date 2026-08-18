# Questions

Open blockers for the human. Agents append per the `factory-protocol` skill;
answers go inline under each question after `**A:**` (or answer in chat via
`/blocked`). Entries are never deleted — mark the heading `answered` once
acted on.

---

## Q1 (task T12, answered) — Which trusted credential should publish catalog PRs?

Context: GitHub now creates `GITHUB_TOKEN`-authored `pull_request` runs in an approval-required state, so PR #219's Claude run had zero jobs and concluded `action_required`. The preferred minimal fix needs a repository-only GitHub App installation token, but no App client ID/private key is configured; work is parked on `factory/t12-trigger-claude-review`, and live creation/update evidence also requires managing the existing catalog PR and waiting for two substantive catalog heads.
Options considered: A — create and install a Headroom-only GitHub App with Contents and Pull requests read/write, then provide a repository variable `CATALOG_APP_CLIENT_ID` and secret `CATALOG_APP_PRIVATE_KEY` (preferred: short-lived, narrowly scoped); B — provide a repository-scoped fine-grained PAT (simpler, but long-lived and human-owned); C — explicitly approve a larger trusted two-stage workflow design that reviews catalog heads without a new publisher credential.
**A:** Option A (Chris, 2026-08-17). Repo-only GitHub App `headroom-catalog-publisher` is created; repository variable `CATALOG_APP_CLIENT_ID` and secret `CATALOG_APP_PRIVATE_KEY` are both set on MrZoller/headroom. Mint short-lived installation tokens in the catalog workflow via `actions/create-github-app-token` (client-id from the variable, private-key from the secret), keeping scope Contents + Pull requests read/write on this repo only. Installation on the repo could not be verified from the CLI — if token minting reports the App not installed, surface that as its own blocker rather than working around it.
