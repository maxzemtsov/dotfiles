---
name: warroom
description: Assemble a comprehensive situation-room status report for ANY project or initiative — what's done, what's stuck, what's left, dependencies between items, constraints, and the recommended next 3 actions. Pulls signal from whatever sources exist: docs, git, CI, issue trackers, analytics, runbooks, conversation history. Invoke when starting a session on a complex initiative, before a major decision, when handing off, or when you need a clean "where we stand" picture before recommending action. Works for software projects, marketing campaigns, research efforts, ops migrations, M&A workstreams, anything with > 20 moving parts.
---

# /warroom — Situation-room information assembly

The "war room" name refers to the leadership pattern: a focused room where decision-makers see the full landscape — done, in-flight, blocked, dependencies, constraints — and pick the next 3 moves. This skill produces that view from whatever artifacts the project has.

It's deliberately generic. Same 6-section structure works for software cutovers, ad campaigns, research projects, ops migrations, board meetings, anything.

## When to invoke

- Starting a session on a complex initiative ≥ 20 moving parts
- Before any major decision (launch, cutover, sprint commit, budget allocation, contract sign-off)
- Handing off to another contributor / agent / team
- After a marathon of work — confirm progress + spot regressions
- When stuck and need to step back: "what should I actually do next?"

NOT for: trivial single-task work, anything that fits in 3 paragraphs of context.

## The 6 fixed sections

Same order, every time. Skip a section only if genuinely empty.

### 1. State — one paragraph

Where things stand RIGHT NOW. Branch sha + recent shipped work for software; campaign metrics + ad spend for marketing; current page count + outstanding citations for research. End with the top non-obvious gotcha (the thing that surprised someone in the last week).

### 2. Done

What's complete + verifiable. Table format:

| Item | Status | Verification |
|---|---|---|

"Verification" is the proof: live URL, deploy log, signed contract, paid invoice, peer-reviewed citation. If unverifiable, mark `claimed-not-verified` and treat as in-flight, not done.

### 3. Blocked

What's stuck behind a known blocker. Table:

| Item | Blocker | Owner | Estimated unblock |
|---|---|---|---|

Be specific about blocker: a person, an external party, a credential, a regulatory wait, a technical dependency. "Person Y must do X" or "regulatory approval expected by date Z".

### 4. Open work

Priority-ordered. For each:
- Item ID/name + 1-line description
- Estimate (S/M/L or hours/days/weeks — match the project's time-scale)
- Surfaces touched (files, ad accounts, customers, regions — whatever moves)
- Dependencies (must finish X first; or runs parallel to Y)
- Suitable executor (self / agent / sub-agent pair / contractor / team-member-X)

### 5. Connections + conflicts

ASCII map or short list showing dependencies + conflicts:

```
A → B    (B unblocks once A completes)
A ‖ C    (parallel, no conflict)
A ⨯ D    (CONFLICT — same resource, sequence required)
```

Highlight CONFLICT items explicitly. These are open-but-don't-touch-yet (waiting on something to clear).

### 6. Constraints + boundaries

Things that bound the decision space:
- Permissions / scope ("permitted to act except for X")
- Cost / budget gates ("ask before spending > $Y")
- Confidentiality / NDA boundaries
- Parallel-actor zones ("Team B owns this, don't touch")
- Time / regulatory windows ("must close before date Z")
- Reversibility ("this action is one-way; double-check before triggering")

Constraints often surface what NOT to do — equally important as what to do.

### 7. Recommended next 3 actions

EXACTLY 3 (unless the user asked for more). Ranked by leverage × unblock-impact × low-conflict.

For each: 
- Why this before others
- Expected outcome
- ETA / effort
- Who executes

3 actions because human attention is bounded. A list of 12 things "to maybe do" doesn't drive decisions.

## How to gather signal — adapt to project type

The skill is signal-agnostic. Use what exists. Common patterns:

### Software / engineering project
- `.remember/remember.md` if exists
- Release-readiness or cutover docs (`docs/CUTOVER*.md`, `docs/RELEASE*.md`)
- `git log --oneline -30`
- `gh run list --limit 15` (CI)
- `gh issue list` / `gh pr list` 
- TodoWrite list (current session)
- Recent audit / review docs (`*_AUDIT_*.md`, `*_REVIEW_*.md`)
- Live probes if web app: response codes, deployed bundle inspection, DB sanity

### Marketing / growth project
- Campaign briefs + creative calendar
- Ad account spend reports (Google Ads, Meta, LinkedIn)
- Analytics platform data (PostHog, GA4, Mixpanel)
- A/B test results
- Content publication schedule
- Influencer / partnership pipeline

### Operations / migration project
- Runbooks + standard operating procedures
- Ticket backlog (Linear, Jira, GitHub Issues)
- On-call rotation + handoff notes
- Incident postmortems (recent)
- Vendor contracts + SLA terms

### Research / academic project
- Lit-review notes, outstanding citations
- Outline / chapter status
- Outstanding interviews / experiments
- Reviewer feedback unaddressed
- Submission deadlines

### Cross-functional initiative (M&A, product launch, regulatory)
- Decision log (D-1, D-2... per the standard format)
- Stakeholder map + their unresolved positions
- Cross-team dependencies
- External party commitments + risks
- Critical-path Gantt or equivalent

### Anything else
- READMEs, project wikis, pinned messages
- Recent meeting notes
- Conversation transcripts (if accessible)
- Any "status" or "weekly update" doc

When sources are sparse, surface that explicitly: "Section 4 sparse — only signals available are git log + Slack pins. Recommend producing a backlog file before next /warroom run."

## Format rules

- Tables for inventory (sections 2, 3, 4) — scannable
- Prose for state + constraints — context-rich
- Specifics over abstractions: file paths, sha, dates, dollar amounts, named people
- Length cap: ≤ 300 lines for the rendered report. Trim ruthlessly.
- Match the user's working language (English / Russian / mixed — whatever the project uses)

## Anti-patterns

- Padding section 4 with items already in section 2 — closed items go in Done only
- Recommending more than 3 next-actions — overwhelming, not decision-driving
- Claiming "done" without proof in the Verification column
- Skipping the Constraints section — that's where conflict-zones and budget gates live
- "Free" / "$0" claims when there are real costs (LLM tokens, ad spend, contractor hours, opportunity cost)
- Assuming a project is software just because the project root looks like a repo — research projects, marketing initiatives, and operational workstreams can live in a git repo too. Always check what KIND of project this is before picking signal sources.

## Output template (universal)

```md
# War Room — <project> — <date>

## State
<1 paragraph — where we stand + non-obvious gotcha>

## Done
| Item | Status | Verification |
|---|---|---|
...

## Blocked
| Item | Blocker | Owner | Unblock ETA |
|---|---|---|---|
...

## Open
1. **<ID>** <one-line> — <effort> — surfaces: <list> — depends-on: <prereq> — suitable: <executor>
2. ...

## Connections + conflicts
- A → B
- A ‖ C
- A ⨯ D (CONFLICT — sequence required)

## Constraints
- <permissions / scope>
- <cost gates>
- <parallel-actor zones>
- <time windows>
- <reversibility flags>

## Recommended next 3
1. <highest-leverage> — why first — outcome — ETA — who
2. ...
3. ...
```

## Pairs with

- `/remember:remember` — short-form handoff (≤ 20 lines). /warroom = long-form context, /remember = trail-marker.
- `/op-secrets` — for any credential reads needed during status check (NEVER accept keys pasted in chat).

## Spirit of the skill

A war room isn't a status report. A status report says "here's what we did this week." A war room says "here's the current map of the initiative — these are the moves with leverage right now, and these are the constraints — pick three." The skill is about helping someone decide, not just summarizing.

Bias toward giving the reader an actionable picture in under 5 minutes of reading. If your output takes longer to read, you've missed the point.

For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.
