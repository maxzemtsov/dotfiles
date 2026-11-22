# mcp-code-mode

A skill for coding agents (Claude Code, Codex) that applies the Cloudflare "Code
Mode" idea to any MCP server: tool definitions stay out of the context window, and
the model **searches** for a tool, **describes** one schema, and **calls** it through
the terminal. `scripts/mcpx` is a ~400-line Node wrapper over
[`mcporter`](https://github.com/openclaw/mcporter) with no dependencies of its own.

```bash
mcpx search "feature flag"                 # names + one-line descriptions
mcpx describe aws-mcp.aws___search_documentation
mcpx call aws-mcp.aws___search_documentation '{"search_phrase":"Lambda timeout"}'
mcpx audit --live                          # what your harness loads, what could move
```

Install: `npm install -g mcporter` (Node 24+), then copy this folder to
`~/.claude/skills/` (Claude Code) and `~/.agents/skills/` (Codex). Usage and safety
rules are in [SKILL.md](SKILL.md).

## The honest summary

Measured on one developer machine on 2026-11-22 (Claude Code 2.1.307, Sonnet 5.5,
subscription, headless `claude -p`; Codex CLI 0.170.0). Two runs per cell, so treat
differences under ~15% as noise.

1. **Claude Code already solves the definitions problem.** Its built-in tool search
   defers every MCP tool. On a real setup with 157 MCP tools it cut their definitions
   from 148,037 tokens to about 6,600 — a 95.5% reduction, better than the 85% the
   vendor claims. Moving servers behind this skill can only win back part of the
   remaining 6,600.
2. **Codex did not pay for them either.** Disabling four MCP servers changed the
   first-turn input from 41,004 to 40,995 tokens.
3. **For a single lookup the skill is worse.** Same answer, but 4–5 model requests
   instead of 3, about 50% more tokens processed and 15 seconds slower.
4. **For chains it is better.** The script pattern ended with 13,000 fewer tokens in
   context than native tool calls, and it counted correctly where a native run miscounted.
5. **It unlocks servers you never have to install in the harness.** One 141-tool
   server (about 50,000 tokens of definitions) is fully usable through `mcpx` at zero
   standing cost.
6. **Some servers cannot move.** claude.ai connectors keep their auth inside
   claude.ai. Figma's remote server rejected mcporter's OAuth client registration
   (HTTP 403), so it only works from pre-approved clients.

So: do not expect the 94–99.9% headline here. That number compares against loading
every definition upfront, which neither harness does any more.

## Session start: tokens before the first word

Context size of the first request, same prompt (`Reply with the single word: ok`).

| Setup | Tokens | MCP share |
|---|---:|---:|
| No MCP servers at all | 52,905 | 0 |
| Real setup, 157 MCP tools, tool search on (default) | 59,364 – 59,680 | ~6,600 |
| Real setup, tool search off | 223,029 | 148,037 |
| No MCP servers, tool search off (control) | 74,992 | 0 |

The control row matters: turning tool search off also loads 22,087 tokens of Claude
Code's own deferred built-in tools, so the MCP share is 223,029 − 74,992, not
223,029 − 52,905.

Per server, isolated (`--strict-mcp-config`):

| Server | Tools | Definitions upfront | Deferred (names + instructions) |
|---|---:|---:|---:|
| AWS MCP | 8 | 6,066 | 1,367 |
| PostHog MCP (already one `exec` meta-tool) | 1 | 16,449 | 814 |
| Whole setup | 157 | 148,037 (943 per tool) | ~6,600 |

PostHog is worth a look: the vendor already shipped its own code mode, and its single
tool description alone costs 16,449 tokens when loaded.

## Three tasks, before and after

Arms: **A** = server loaded in Claude Code with tool search (today's default);
**B** = server loaded, tool search off (the "before" of the vendor claims);
**C** = no server in the harness, this skill; **D** = a purpose-built CLI skill.
All arms returned the same correct answer unless noted.

- *requests* — model round trips. *end context* — tokens in the window after the
  task; this is what the rest of the session carries. *processed* — input tokens
  summed over all requests, mostly cache reads of the ~53k base prompt.

**Task 1 — one lookup** (find the Lambda maximum timeout in the AWS docs)

| Arm | Requests | End context | Processed | Wall time |
|---|---:|---:|---:|---:|
| A native + tool search | 3 | 57,677 | 168,305 | 28 s |
| B native, all upfront | 2–3 | 83,832 | 206,305 | 29 s |
| C skill (`mcpx`) | 4–5 | 58,128 | 252,353 | 44 s |

Worse for the skill: +50% processed, +15 s, same context at the end.

**Task 2 — query analytics** (count events in the last 24 hours in PostHog)

| Arm | Requests | End context | Processed | Wall time |
|---|---:|---:|---:|---:|
| A native + tool search | 3–4 | 80,525 | 247,180 | 27 s |
| B native, all upfront | 3–4 | 103,615 | 344,583 | 29 s |
| C skill (`mcpx`) | 7–10 | 61,916 | 492,568 | 58 s |
| D purpose-built CLI (`ph`) | 7–8 | 57,654 | 420,103 | 52 s |

Mixed: the skill leaves 18,600 fewer tokens in context than native (the 16k tool
description never loads), but takes twice the requests and twice the time. The
purpose-built CLI is leaner than the generic skill on both counts.

**Task 3 — a chain** (search the docs, open the top 3 pages, count a word on each)

| Arm | Requests | End context | Processed | Wall time | Correct |
|---|---:|---:|---:|---:|---|
| A native + tool search | 4 | 72,152 | 242,924 | 35 s | 2 of 2 |
| B native, all upfront | 3 | 96,962 | 262,376 | 32 s | 1 of 2 |
| C skill, one script | 4–5 | 59,087 | 256,346 | 45 s | 2 of 2 |

Better for the skill: three pages never enter the context (13,000 tokens saved against
A, 38,000 against B), and the count is computed, not eyeballed — one native run
reported 10 where the page has 12.

Not benchmarked, and why:

- **ClickUp** — this setup uses a CLI, not an MCP server, so there is no "before".
- **Figma** — the remote server refused mcporter's client registration, so there is
  no "after". It stays in the harness.

## When to use it

| Situation | Verdict |
|---|---|
| Claude Code, server used often, single calls | Keep it native. The skill is slower. |
| Claude Code, server used rarely | Move it. Saves 800–1,400 tokens per session each, costs nothing until used. |
| A server you would otherwise have to add (many tools) | Use the skill and never add it. |
| Chains, bulk reads, large results | Use the skill's script pattern. |
| Harness or client with no deferred tool loading | Use the skill; this is the 85–99% case. |
| A good purpose-built CLI exists | Use that CLI. |

## How it compares

| Tool | Checked | Notes |
|---|---|---|
| `mcporter` 0.17.1 (used here) | hands-on | MIT, active (release 2026-11-16). Imports Claude Code, Claude Desktop, Codex, Cursor, Windsurf, OpenCode, VS Code configs. OAuth with its own vault, `${ENV}` placeholders, typed client generation. Does not import Claude Code plugin servers or claude.ai connectors. |
| `apify/mcpc` | docs only | OAuth 2.1 with OS keychain; no Codex import listed. Strongest alternative. |
| FastMCP client CLI | docs only | Python; OAuth; discovers Claude and Cursor configs. |
| MCP Inspector `--cli` | docs only | A testing tool; verbose output. |
| `mcp2cli`, `mcp-cli`, `mcptools` | docs only | No config import or stale. |
| Claude Code tool search | measured | Built in. Defers all MCP tools; 95.5% reduction here. |
| Cloudflare Code Mode | docs only | The 99.9% figure counts definition tokens only (1.17M → ~1k for 2,500 endpoints), not task cost. |
| Anthropic "code execution with MCP" | docs only | The 98.7% figure (150k → 2k) is an illustrative scenario, not a benchmark. |

## Reproduce

```bash
cd bench
export BENCH_OUT=$PWD/out
./run.sh S-none     $PWD/mcp-none.json on  "Bash" "Reply with the single word: ok"
./run.sh S-aws-off  $PWD/mcp-aws.json  off "Bash" "Reply with the single word: ok"
python3 summarize.py "$BENCH_OUT/*.jsonl"
```

`run.sh` unsets any API key so the run bills the subscription. Raw rows from the
runs above are in [`bench/results-2026-11-22.tsv`](bench/results-2026-11-22.tsv).
The whole benchmark was about 30 short headless runs.

## Limits

- Two runs per cell, one machine, one model. Request counts vary run to run.
- `mcpx audit` token figures marked `~` are tool count × 940 (the measured average);
  unmarked ones are computed from real schemas at 2.3 characters per token, which
  was within about 20% of measurement for the two servers checked.
- The destructive-call guard matches tool names. It cannot see inside meta-tools
  such as `exec`; those rely on the rule in SKILL.md.
- OAuth tokens in mcporter's vault are stored in a local file. Set
  `MCPORTER_VAULT_PASSWORD` to encrypt it.
