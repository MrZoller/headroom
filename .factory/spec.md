# Spec: Headroom issue backlog

Spec = the issue tracker for MrZoller/headroom; imported 2026-08-17; filter: none.

## Problem

Open repository issues are the maintained record of remaining Headroom work. Copying their full requirements into a second specification would create two sources of truth.

## Outcome

Every in-scope open issue not already covered by the factory plan is represented by one shippable plan task, and later backlog syncs append newly opened work without rewriting imported tasks.

## Scope

### In

- All open issues in `MrZoller/headroom`, with no label filter.
- Issue bodies and current tracker state as the external requirements source.
- Factory task linkage through `Fixes #N` in each imported task and eventual PR body.

### Out

- Closed issues, because they are not part of the open backlog.
- Rewording or resizing previously imported tasks, because the approved plan is their durable record.
- Work with no issue linkage, except the rolling parked-review-minors batch and explicitly requested ad-hoc tasks.

## Acceptance criteria

1. Every uncovered open issue is imported once with testable acceptance distilled from its body.
2. Existing tasks carrying the same `Fixes #N` linkage are not duplicated except through the defined reopen lifecycle.
3. A changed import waits at the plan approval gate before any task can run.

## Risks & constraints

- GitHub labels determine task size: `major`, `trivial`, or `standard` by default.
- Dependencies are imported only when issue prose establishes a semantic prerequisite.
- The issue tracker remains authoritative; this file records import scope rather than duplicating issue requirements.

## Open questions

None.
