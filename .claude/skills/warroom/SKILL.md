---
name: warroom
description: Assemble a comprehensive situation-room status report for ANY project or initiative — what's done, what's stuck, what's left, dependencies between items, constraints, and the recommended next 3 actions. Pulls signal from whatever sources exist: docs, git, CI, issue trackers, analytics, runbooks, conversation history. ALWAYS invoke when user asks "where do we stand", "what's next", "что осталось", "что застряло", "warroom", "war room", "сitrep", "status check", "let's regroup", "before we launch", "before the cutover", "decision time", or asks for a comprehensive picture of a multi-part initiative. Also invoke when handing off, when starting a session on a complex initiative ≥ 20 moving parts, or after a marathon of work needs spot-checking. Works for software projects, marketing campaigns, research efforts, ops migrations, M&A workstreams, board meetings, anything with > 20 moving parts.
---

# /warroom — Situation-room information assembly

The "war room" name refers to the leadership pattern: a focused room where decision-makers see the full landscape — done, in-flight, blocked, dependencies, constraints — and pick the next 3 moves. This skill produces that view from whatever artifacts the project has.

It's deliberately generic. Same output structure works for software cutovers, ad campaigns, research projects, ops migrations, board meetings, anything.

## When to invoke

- Starting a session on a complex initiative ≥ 20 moving parts
- Before any major decision (launch, cutover, sprint commit, budget allocation, contract sign-off)
- Handing off to another contributor / agent / team
- After a marathon of work — confirm progress + spot regressions
- When stuck and need to step back: "what should I actually do next?"
- User explicitly says: "warroom", "war room", "where do we stand", "что осталось", "что застряло", "что дальше", "decision time", "before launch"

NOT for:
- Trivial single-task work, or anything that fits in 3 paragraphs of context
- Post-mortems (different framework — focus on root cause + lessons, not next-3-moves)
- New-feature scoping (use a PRD format instead — what + why + design, not where + blocked + next)
- Pure status updates with no decision pending (use `/remember:remember` for trail-marker handoffs)

## Output structure (7 sections, fixed order)

Rendered report has these sections in this order. Skip a section only if genuinely empty (and surface that — empty Blocked is a finding, not a gap).

### 1. State — one paragraph

Where things stand RIGHT NOW. Concrete: branch sha + recent shipped work for software; campaign metrics + ad spend for marketing; current page count + outstanding citations for research. End with the top non-obvious gotcha (the thing that surprised someone in the last week). Aim for 3-5 sentences.

### 2. Done

What's complete + verifiable. Table format:

| Item | Status | Verification |
|---|---|---|

"Verification" is the proof: live URL, deploy log, signed contract, paid invoice, peer-reviewed citation, screenshot, query result. If unverifiable, mark `claimed-not-verified` and treat as in-flight, not done. This column is what stops the report from being self-congratulatory fiction.

### 3. Blocked

What's stuck behind a known blocker. Table:

| Item | Blocker | Owner | Estimated unblock |
|---|---|---|---|

Be specific: a person, an external party, a credential, a regulatory wait, a technical dependency. "Person Y must do X" or "FDA approval expected by date Z" or "awaiting payment from vendor B". Empty Blocked is itself a finding — surface it.

### 4. Open work

Priority-ordered (highest leverage first). For each:
- Item ID/name + 1-line description
- Estimate (S/M/L or hours/days/weeks — match the project's time-scale)
- Surfaces touched (files, ad accounts, customers, regions — whatever moves)
- Dependencies (must finish X first; or runs parallel to Y)
- Suitable executor (self / agent / sub-agent pair / contractor / team-member-X)

### 5. Connections + conflicts

Plain-language list of dependencies + parallel-safe items + conflicts. Use whatever notation reads clearest, but make sure these three categories are distinct:

- **Sequential**: "Item B unblocks once Item A merges"
- **Parallel-safe**: "Items A and C can run together — no shared resources"
- **CONFLICT — wait**: "Items A and D both write to the same surface; sequence required, do A first"

The CONFLICT items are crucial — they're "open but don't touch yet". Highlighting them prevents the next-actions list from accidentally telling someone to grab a CONFLICT item.

### 6. Constraints + boundaries

Things that bound the decision space — what NOT to do, equally important as what to do:

- Permissions / scope ("permitted to act except for X")
- Cost / budget gates ("ask before spending > $Y")
- Confidentiality / NDA boundaries
- Parallel-actor zones ("Team B owns this surface, don't touch")
- Time / regulatory windows ("must close before date Z")
- Reversibility ("this action is one-way; double-check before triggering")

### 7. Recommended next 3 actions

EXACTLY 3 (unless the user asked for more). Ranked by leverage × unblock-impact × low-conflict.

For each:
- **What** (one-line action)
- **Why this before others** (the leverage reason)
- **Expected outcome** (concrete signal of success)
- **ETA / effort**
- **Who executes** (self / agent / human / contractor)

Each action must be self-contained enough that the reader can say "go do #1" without asking follow-up questions. If you find yourself writing "explore X" or "research Y", that's not actionable — sharpen it to a concrete deliverable.

3 actions because human attention is bounded. A list of 12 things "to maybe do" doesn't drive decisions.

## How to gather signal — fan out, don't serial

For projects with substantive history, signal collection serially (one source at a time) takes 5+ minutes. **Always fan out**: spawn parallel reads via concurrent tool calls or sub-agents whenever you have 3+ independent sources to inspect. Then synthesize after all return.

Adapt sources to project type:

### Software / engineering project
- `.remember/remember.md` if exists
- Release-readiness or cutover docs (`docs/CUTOVER*.md`, `docs/RELEASE*.md`, `docs/PROD_*.md`)
- `git log --oneline -30`
- `gh run list --limit 15` (CI)
- `gh issue list` / `gh pr list`
- TodoWrite list (current session)
- Recent audit / review docs (`*_AUDIT_*.md`, `*_REVIEW_*.md`)
- Live probes if web app: HTTP response codes, deployed bundle inspection, DB sanity query

### Marketing / growth project
- Campaign briefs + creative calendar
- Ad account spend reports (Google Ads, Meta, LinkedIn)
- Analytics platform (PostHog, GA4, Mixpanel)
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

### When signal is sparse

If after fan-out you have < 3 reliable sources, do NOT produce a half-empty report — that wastes the reader's time and creates false confidence. Instead, produce a **signal gap report**:

```md
# War Room — <project> — sparse-signal mode

I gathered signal from <list>. The data is too thin for a useful war room.

## What's missing
- <e.g., no backlog file; only verbal commitments in the last 2 meetings>
- <e.g., no CI history because workflows aren't wired>

## What I'd ask you to produce before the next /warroom run
1. <specific artifact — e.g., "a backlog.md with Status column">
2. <specific artifact>

## What I CAN tell you from current signal (1-2 paragraphs)
<the partial picture>
```

This tells the user "your project state is invisible to me; here's how to make it visible". More valuable than padding.

## Output destination

**Default**: render to chat as markdown, all 7 sections. Best for in-session decision-making.

**If user asks "save it" or "write it to a doc" or "I want to share this"**: write to `docs/WARROOM_<YYYY-MM-DD>.md` (or whatever the project's docs convention is). Mention the file path in chat so user can find it.

**If invoked at session start as orientation**: ALSO summarize the 3 recommended actions at the very top in 3 sentences, BEFORE the full report. The user reads section 7 first if they're in a hurry; full report is for when they have time.

## Format rules

- Tables for inventory (sections 2, 3) — scannable
- Numbered list for Open work (section 4) — priority order matters
- Prose for state + constraints — context-rich
- Specifics over abstractions: file paths, sha, dates, dollar amounts, named people
- Length cap: ≤ 5 minutes of reading time. Roughly: ≤ 300 lines / ≤ 2,500 words for the rendered report. Trim ruthlessly.
- Match the user's working language (English / Russian / mixed — whatever the project uses)

## Anti-patterns

- **Padding section 4 with items already in section 2** — closed items go in Done only
- **More than 3 next-actions** — overwhelming, not decision-driving. If you have 7 candidates, that's a sign the prioritization isn't done; do it.
- **Claiming "done" without proof** — if Verification column is empty or vague, the item belongs in Open
- **Skipping the Constraints section** — that's where conflict-zones, parallel-actor boundaries, and budget gates live. Missing it leads to recommended actions that crash into other people's work.
- **Underreporting friction/cost** — surface real costs (LLM tokens, ad spend, contractor hours, opportunity cost). "Free" / "$0" claims when there's any meaningful spend hide tradeoffs.
- **Assuming a project is software just because the project root looks like a repo** — research projects, marketing initiatives, and operational workstreams can live in a git repo too. Always check what KIND of project this is before picking signal sources.
- **"Explore X" or "Research Y" in section 7** — those are not actions, they're avoidance. Sharpen to a concrete deliverable.
- **Producing a hollow report when signal is genuinely thin** — better to surface the signal gap (see "When signal is sparse" above) than fake completeness.

## Output template (universal)

```md
# War Room — <project> — <YYYY-MM-DD>

## State
<3-5 sentences: where we stand + non-obvious gotcha>

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
- Sequential: <Item A blocks Item B>
- Parallel-safe: <A and C can run together>
- CONFLICT (wait): <D conflicts with A — sequence required>

## Constraints
- <permissions / scope>
- <cost gates>
- <parallel-actor zones>
- <time windows>
- <reversibility flags>

## Recommended next 3
1. **<action>** — why first — outcome — ETA — who
2. ...
3. ...
```

## Concrete example (software cutover)

A real warroom output, abbreviated:

```md
# War Room — TraitTune v2 alpha→main cutover — 2026-05-10

## State
Alpha HEAD `151f4c6`. Today shipped 19 War-Room gates across 9 commits including SES API migration, CSP headers, PostHog wire, Sentry alerts, RLS gap fixes, audit docs. PostHog now ACTIVE with key on alpha + main. main branch added to v2 Amplify with auto-build OFF (cutover-ready, no traffic). Top gotcha: parallel TT-Pro session owns `deep-reread-icon.tsx` + `trait-accordion.tsx` — touching them silently merge-conflicts.

## Done
| Item | Status | Verification |
|---|---|---|
| G2.13 Email SES API | shipped | Edge Function env shows AWS_ACCESS_KEY_ID set; commit `9930c00` deployed |
| G6.4 PostHog wire | active | API key `phc_x5...` live on Amplify; bundle grep returns 1 chunk |
| G5.2 RLS gap fixes | applied | `archived_responses` RLS-on confirmed via REST query |
| 16 more rows... | | |

## Blocked
| Item | Blocker | Owner | Unblock ETA |
|---|---|---|---|
| G3.x Stripe live | Business identity verification on dashboard.stripe.com | CTO | 1-2 days CTO ops |
| Cron monitor #2 + #3 | Sentry plan upgrade ($26/mo) | CTO | Decision pending |

## Open
1. **QA T1 regression** — verify "0/15 dims after completion" bug — S — surfaces: `.qa-playwright/comprehensive-qa.spec.ts` — depends-on: nothing — suitable: foreground or sub-agent
2. **CSP worker-src #2** — separate CloudWatch RUM SSL_PROTOCOL_ERROR fix — M — surfaces: AWS RUM config — depends-on: nothing — suitable: ops sweep
3. ...

## Connections + conflicts
- Sequential: G3.x Stripe live → main branch env vars (live keys must exist before paste)
- Parallel-safe: PostHog activation ‖ Sentry monitor wiring (different surfaces)
- CONFLICT (wait): G2.5 trait UX fixes ⨯ Deep Re-read parallel session (same files)

## Constraints
- Carte-blanche scope: do everything except actual alpha→main merge (cutover trigger)
- Parallel-actor zone: TT-Pro session owns deep-reread* files — DO NOT touch
- Cost gate: paid ops > $100 require approval (per CLAUDE.md §7)
- Reversibility: alpha→main DNS swap is one-way; rollback playbook in docs/CUTOVER_INFRA_PREP

## Recommended next 3
1. **Run T1+T2 of comprehensive-qa.spec.ts** — verify CTO's 0/15-dims regression hypothesis. Outcome: clear yes/no on whether the bug exists. ETA: 25 min wall + ~$0.05 LLM. Who: foreground or sub-agent.
2. **Send 30-sec test email to support@traittune.com** — confirms Google Workspace forwarding works pre-cutover. Outcome: live email roundtrip success. ETA: 1 min. Who: CTO (only CTO has Gmail inbox access).
3. **Sentry plan upgrade decision** — $26/mo unblocks cron monitors #2 + #3 (HNSW + DB backup). Outcome: yes/no decision. ETA: 5 min. Who: CTO.
```

This is what a complete report looks like. Note how every Done item has Verification proof, how Blocked names a specific owner + unblock signal, how Recommended next 3 are atomic actions with clear outcomes.

## Pairs with

- `/remember:remember` — short-form handoff (≤ 20 lines). /warroom = long-form context, /remember = trail-marker. Run both at end of session for full coverage.
- `/op-secrets` — for any credential reads needed during status check (NEVER accept keys pasted in chat).

## Spirit of the skill

A war room isn't a status report. A status report says "here's what we did this week." A war room says "here's the current map of the initiative — these are the moves with leverage right now, and these are the constraints — pick three." The skill is about helping someone decide, not just summarizing.

Bias toward giving the reader an actionable picture in under 5 minutes of reading. If your output takes longer than that, you've missed the point — trim until it fits.

For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.
