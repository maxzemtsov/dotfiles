---
name: posthog
description: Manage PostHog from the terminal with zero MCP overhead. Use for ANY PostHog analytics/admin task — read insights, run HogQL/funnel/trend/retention queries, inspect cohorts and feature-flag state, AND create/edit dashboards, insights, cohorts, experiments. Triggers on "PostHog", analytics, insight, HogQL, funnel, retention, cohort, feature flag, dashboard, experiment, "check the funnel", "состояние флага", "сделай дашборд". Auth is automatic from 1Password — never ask for or accept pasted keys.
---

# PostHog operator CLI

A thin wrapper over the official [`@posthog/cli`](https://www.npmjs.com/package/@posthog/cli)
`api` surface. **Registers zero MCP tools** — invoked only from the shell, so it
costs no session context (the PostHog MCP server otherwise registers ~330 tools).
Auth is pulled from 1Password automatically; no secret lives in this repo.

**The wrapper:** `~/.claude/skills/posthog/scripts/ph` (call it as `ph`).

## Setup (one-time, per machine)

Credentials and secrets go through the **/op-secrets** skill — never paste a key
in chat or commit one. This skill only needs the *coordinates* of where your
PostHog **personal** API key (`phx_...`) lives in 1Password.

1. In 1Password, store a PostHog **personal API key** (`phx_...`, from PostHog →
   Settings → Personal API keys) with the scopes you want (read-only, or
   read-write for full automation). This is distinct from the project ingestion
   key (`phc_...`), which is write-only events and useless for management.
2. Copy the skill's `config.example.env` to `~/.config/posthog-cli-skill/config.env`
   and fill in YOUR vault / item / field names + project id (no secret values):

   ```bash
   mkdir -p ~/.config/posthog-cli-skill
   cp ~/.claude/skills/posthog/config.example.env ~/.config/posthog-cli-skill/config.env
   # then edit it: PH_OP_VAULT, PH_OP_ITEM, PH_OP_FIELD, POSTHOG_CLI_PROJECT_ID, PH_OP_TOKEN_ENV
   $EDITOR ~/.config/posthog-cli-skill/config.env
   ```
3. Ensure your 1Password service-account token is available — either exported as
   `OP_SERVICE_ACCOUNT_TOKEN`, or in a project-scoped var whose name you put in
   `PH_OP_TOKEN_ENV`. (See /op-secrets.)

The wrapper fetches only the key field, one `op` call per invocation, and sets
`POSTHOG_CLI_API_KEY` / `POSTHOG_CLI_PROJECT_ID` / `POSTHOG_CLI_HOST` for the CLI.

## Golden path — discovery-first, never guess tool ids

The CLI mirrors PostHog's whole REST API as ~400 generated tools. Don't hardcode
tool ids from memory; discover them:

```bash
ph api tools                       # full catalog (huge — prefer search)
ph api search feature-flag         # find tool id(s) for a resource (regex)
ph api info  feature-flag-get-all  # description + input schema for one tool
ph api schema dashboard-create tiles  # drill into a nested schema field
ph api call  feature-flag-get-all  # invoke (read, no body)
```

**Calls with a body** take a positional JSON string:

```bash
ph api call dashboard-create '{"name":"Weekly funnels"}'        # create (autonomous)
ph api call dashboard-create '{"name":"x"}' --dry-run           # validate body, change nothing
ph api call execute-sql '{"query":"SELECT count() FROM events WHERE timestamp > now() - INTERVAL 7 DAY"}'  # HogQL
```

- **Always `--dry-run` a mutation first.** It returns `valid`, the parsed
  `input`, and `destructiveHint` / `destructiveConfirmationRequired` so you know
  whether the tool needs `--confirm`.
- Output is a compact text/YAML-ish format (dry-run returns JSON). `grep`/`awk`
  the keys you need.
- The wrapper auto-strips the CLI's harmless telemetry-flush line, so **stderr is
  clean** — a non-empty stderr or non-zero exit is a *real* error.

## ⛔ Guardrail — two classes need the user's OK first

Everything is full read-write (subject to your key's scopes), **but stop and ask
the user before**:

| Operation | Rule |
|---|---|
| Read — insights, HogQL/trends/funnels/retention, cohorts, flag *state* | autonomous |
| Create / edit — dashboards, insights, cohorts, draft experiments | autonomous |
| **`DELETE` of any resource** | **ask first** — irreversible |
| **Enable / disable a feature flag** | **ask first** — may flip a LIVE prod surface |

Feature flags often gate live application behaviour, so toggling one here can
change the product for real users instantly — treat it as a production change.

**Two independent safety layers:**

1. **CLI native** — any tool with `destructiveHint: true` refuses to run without
   `--confirm`. Non-destructive writes need nothing extra.
2. **Wrapper backstop** — the `ph` wrapper *additionally* fails closed with
   `REFUSED` (exit 3, before any network call) on a real `api call` whose args
   contain `delete`, or a `feature`+`active`/`enable`/`disable` write. Discovery
   and `--dry-run` are never blocked. Lift it only after the user OKs, by
   prefixing `PH_CONFIRM=1`.

A user-approved flag flip needs both flags:

```bash
PH_CONFIRM=1 ph api call update-feature-flag '{"id":123,"active":false}' --confirm
```

## Notes

- `@posthog/cli` ships almost daily (`api` surface added v0.7.23, June 2026); the
  wrapper pins `@latest`. If a tool id 404s, re-run `ph api search` — ids
  occasionally get renamed.
- US vs EU: set `POSTHOG_CLI_HOST` to `https://us.posthog.com` or
  `https://eu.posthog.com`. The *ingestion* host (`*.i.posthog.com`) is NOT the
  API host — don't use it here.
