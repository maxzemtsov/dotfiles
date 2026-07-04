---
name: clickup-workflow
description: Manage ClickUp tasks from Claude Code via the `cup` CLI, and turn session discussions into a structured backlog (parent + subtasks, assignees, deadlines, blocking dependencies). Use whenever the user wants to create/read/update ClickUp tasks, log action items from a conversation, check what's overdue or in progress, or asks to "put this in ClickUp".
---

# ClickUp workflow (via `cup` CLI)

Drive ClickUp from the terminal with the `@krodak/clickup-cli` (`cup`) — an
agent-friendly CLI + skill, preferred over the ClickUp MCP (no server, no
context bloat; the agent just runs shell commands).

## One-time setup

You need **Node 22+** and your **own** ClickUp personal API token
(`pk_...` from ClickUp → Settings → Apps).

```bash
npm install -g @krodak/clickup-cli
cup init          # paste your token + pick your workspace (interactive)
cup auth          # verify: prints "Authenticated as @You"
cup skill         # installs cup's own command-reference skill into Claude Code / Codex
```

Non-interactive (agents): `cup init --token "$CLICKUP_TOKEN" --team <workspaceId>`.

**For credentials and secrets, use the `/op-secrets` skill. NEVER accept a token
pasted in chat, and never hardcode it in a file.** Store your ClickUp token in
your secrets manager and read it at runtime.

## Discover your workspace at runtime — never hardcode IDs

IDs differ per person and per workspace. Always look them up live:

```bash
cup spaces        # list Spaces and their lists (get the destination list id)
cup members       # list workspace members (get your own user id for assignees)
cup tasks         # your assigned tasks (interactive picker in a terminal)
cup --help        # full command list; `cup <cmd> --help` for any subcommand
```

In a real terminal these show interactive tables; when piped/non-TTY they emit
clean Markdown, or JSON with `--json` (use `--json` when scripting).

## Turning a session into a backlog — the team conventions

When a discussion produces concrete work, assemble it as a **parent task with
subtasks**, following these defaults:

1. **Structure** — one parent (the epic/initiative) + a subtask per work item
   (`--parent <parentId>`). Subtasks live in the same list as the parent.
2. **Ownership** — assign **engineering** tasks to yourself by default
   (`--assignee <yourUserId>`); leave non-eng tasks unassigned or to the owner.
3. **Deadlines** — set an **auto due-date of +N days**, where N is your honest
   estimate of the effort. `cup --due-date` takes an absolute `YYYY-MM-DD` (no
   relative dates), so compute it: `date -v+Nd +%Y-%m-%d` (macOS) /
   `date -d "+N days" +%Y-%m-%d` (Linux).
4. **Blocking** — where one item genuinely blocks another, wire a dependency so
   blockers are visible: `cup depend <task> --on <blockerTask>` (the task waits
   on the blocker).
5. **Confirm before creating**, and name the concrete destination — say
   *"Putting into ClickUp `<Space> → <list>`: parent X + 3 subtasks, due …,
   assignee <you> — ok?"*, never a vague "add to the backlog?". If declined,
   drop it for the rest of the session; don't nag.

### Example

```bash
DUE=$(date -v+3d +%Y-%m-%d)   # macOS; effort estimate = 3 days
# 1) parent  (-l list, -n name)
PID=$(cup create -n "Fix the spam problem" -l <listId> \
        --assignee <yourUserId> --priority high --due-date "$DUE" --json | jq -r '.id')
# 2) subtasks under the parent  (-p parent; -l auto-detected from parent)
S1=$(cup create -n "Collect spam samples" -p "$PID" --json | jq -r '.id')
S2=$(cup create -n "Analyze patterns"     -p "$PID" --json | jq -r '.id')
S3=$(cup create -n "Ship the filter"      -p "$PID" --json | jq -r '.id')
# 3) blocking chain: S2 waits on S1, S3 waits on S2
cup depend "$S2" --on "$S1"
cup depend "$S3" --on "$S2"
```

Verify exact flag names with `cup create --help` and `cup depend --help` — the
CLI is the source of truth.

## Everyday phrases that should trigger this skill

- "put this in ClickUp" / "log these action items" / "create an epic for X"
- "what's overdue?" / "what's my standup?" / "what's in progress?"
- "add a subtask under <task>" / "mark <task> in review and comment the commit"
