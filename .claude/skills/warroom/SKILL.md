---
name: warroom
description: Assemble a comprehensive project status report — what's done, what's stuck, what's left, dependencies, constraints, recommended next-step priority. Invoke when starting a session on a multi-week project, before a major decision/cutover, or when handing off to another contributor. Pulls from cutover/release-readiness docs, git log, CI history, open todos, parallel-session notes.
---

# /warroom — Comprehensive project status assembly

When invoked, produce a single structured report covering "where we stand" on a multi-week project. The output is tuned for projects that have a release-readiness or cutover doc (e.g. `docs/PROD_CUTOVER_READINESS_*.md`), parallel sessions/contributors, and ops gates that mix code + manual actions.

## When to use

- Starting a new session on a project with a backlog ≥ 20 items
- Before a major decision (cutover, prod-promotion, sprint-end review)
- Handing off to another contributor (paired with `/remember`)
- Mid-sprint sanity check: "are we tracking the right things?"
- After a marathon of commits — confirm progress + spot regressions

NOT for: trivial tasks, single-feature work, anything that fits in one paragraph.

## What to assemble

A `/warroom` report has 6 fixed sections. Adapt content to project but keep section order.

### 1. State (one paragraph)

Branch HEAD sha + 1-line summary of recent work + top non-obvious gotcha. Mirrors `remember.md` State section but adds the operational context (CI green? deploys live? known regressions?).

### 2. Что сделано — Done table

| Gate / item | Status | Verification |
|---|---|---|

Closed items only. "Verification" column is the proof: live URL probe, DB query, CI workflow status, doc cross-link. If unverifiable, mark `claimed-not-verified`.

### 3. Что застряло — Blocked

| Item | Blocker | Owner | Estimated unblock |
|---|---|---|---|

Items where the path forward exists but waits on someone/something. Be specific about the blocker:
- "CTO must complete Stripe business identity verification on dashboard.stripe.com"
- "User must click verify link in inbox X"
- "Awaiting parallel session N to finish on file Y"

### 4. Что осталось — Open work

Priority-ordered. For each:
- Item ID + 1-line description
- Estimate (S/M/L or hours/days)
- Files/surfaces touched (so reader can spot conflicts)
- Dependencies (must finish X first)
- Suitable agent (foreground / sub-agent / sub-agent pair / human-only)

### 5. Connections + dependencies map

A small ASCII map or list showing which items must wait on which. Format:

```
A → B (B unblocks once A merges)
A ‖ C (parallel, no conflict)
A ⨯ D (CONFLICT — same files, sequence required)
```

Highlight CONFLICT-PARK items explicitly — these are open but should NOT be touched until something else clears.

### 6. Constraints + don't-touch zones

- Parallel session boundaries (which files/tables another session owns)
- Carte-blanche scope (what's permitted vs not)
- Paid-op gates (what costs money + threshold to ask)
- Production-tier guardrails (no DNS swap without consent, etc.)
- Branch policies (alpha-only, no main pushes, etc.)

### 7. Recommended next 3 actions

NOT a long list. EXACTLY 3 actions, ranked. For each: why this one before others, expected outcome, ETA. Choose by leverage × unblock × low-conflict.

## How to gather material

Inputs to read in priority order:

1. **`.remember/remember.md`** at project root — the most-recent handoff
2. **`docs/PROD_CUTOVER_READINESS_*.md`** or equivalent release-readiness doc — gate inventory
3. **`git log --oneline -20`** — what's shipped recently
4. **`gh run list --limit 10`** — CI state
5. **TodoWrite list** — in-flight session tasks
6. **`docs/PIPELINE_STATUS_*.md`** or similar — workstream snapshot
7. Any `*_AUDIT_*.md` / `*_REVIEW_*.md` / `*_MONITORS_*.md` doc landed recently — outstanding findings

For ops state (cutover-flavoured projects):

8. Live probe: `curl -sI <staging-url>` for headers + `gh run list --branch <branch>` for CI
9. AWS / Cloud state: budget alarms, deployments, env vars on each env
10. Sentry / observability: alert rule count, monitor health, recent issue volume
11. Database: spot-check schema sanity (key tables exist, recent migrations applied)

Don't probe production unless the report asks for prod-state. Default to staging.

## Format rules

- Tables for inventory (sections 2, 3, 4) — scannable
- Prose for state + constraints — context-rich
- Specific paths + commit shas + line numbers — never vague
- Length cap: ≤ 300 lines for the rendered report. Trim ruthlessly.
- Russian + English mix is fine when project uses both — match user register

## Anti-patterns

- Don't pad section 4 with items already in section 2 (closed) — those go in Done only
- Don't recommend more than 3 next-actions — overwhelming
- Don't claim items are "done" without proof in section 2's Verification column
- Don't skip the Constraints section — that's where session-pair conflicts and budget gates live; missing it leads to redundant work
- Don't include LLM-cost-burn estimates as "free" — surface real costs (Bedrock spend, Stripe fees, paid plan upgrades)

## Examples — see prior usage in TraitTune project

Sessions on 2026-05-09 + 2026-05-10 produced multi-section warroom checkpoints in chat. The pattern shipped 19 gates across 16 commits in one day by maintaining strict gate-tracking. Re-read those messages for tone-of-voice (concise, table-heavy, action-oriented).

## Related skills

- `/remember:remember` — short-form handoff (≤ 20 lines), pairs with /warroom (long-form context)
- `/op-secrets` — for any secret reads needed during status check (NEVER accept keys pasted in chat)

## Output template

```md
# War Room — <project> — <date>

## State
<1 paragraph>

## Что сделано
| Gate | Status | Verification |
|---|---|---|
...

## Что застряло
| Item | Blocker | Owner | Unblock ETA |
|---|---|---|---|
...

## Что осталось
1. **<ID>** <one-line> — <S/M/L> — files: <list> — depends-on: <prereq> — suitable: <agent type>
2. ...

## Connections + conflicts
- A → B
- A ‖ C
- A ⨯ D (CONFLICT — sequence required)

## Constraints
- <parallel session zones>
- <carte-blanche limits>
- <paid-op gates>
- <branch policies>

## Recommended next 3
1. <highest-leverage> — why first — outcome — ETA
2. ...
3. ...
```

For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.
