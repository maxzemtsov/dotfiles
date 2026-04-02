---
name: op-secrets
description: Secure secrets management via 1Password CLI for Claude Code sessions and Dispatch agents. Use this skill whenever credentials, API keys, tokens, or any secrets are needed. Invoke with /op-secrets or automatically when another skill needs credentials.
---

# 1Password Secrets for Claude Code

Secure delivery of secrets (API keys, credentials, tokens) to Claude Code sessions and Dispatch agents **without exposing them in chat or logs**.

## ⛔ ABSOLUTE RULES — Never Violate

1. **NEVER run `op signin` or `eval $(op signin)`** — this gives full personal account access. Forbidden for any agent.
2. **NEVER request the user's personal 1Password master password or account credentials**
3. **NEVER store, copy, or embed SA tokens (`ops_...`) ANYWHERE** — not in chat, logs, databases, config files, API payloads, `adapterConfig.env`, issue comments, git commits, environment files, or any other persistent storage where they could be read by others or leaked via export/backup. Tokens must ONLY exist in the shell environment inherited from `~/.zshrc`.
4. **ONLY** use Service Account tokens (`ops_...`) with scoped vault access
5. **Token delivery**: user sets `export OP_SERVICE_ACCOUNT_TOKEN="..."` in `~/.zshrc` → the server process inherits it → all agents inherit it automatically → no need to copy or inject tokens anywhere

## 1. Installation

Check if 1Password CLI beta is installed:

```bash
op --version
# Expected: 2.33.0-beta or newer
```

If not installed:

```bash
brew install --cask 1password-cli@beta
```

## 2. Core Concepts

| Concept | What it is |
|---------|-----------|
| **Vault** | A container for secrets (like a folder). Names are arbitrary. |
| **Item** | A single secret entry in a Vault (login, API key, etc.). Names are arbitrary. |
| **Secret Reference** | URI to a specific field: `op://<vault>/<item>/[section/]<field>` |
| **Environment** | (Beta) A collection of env vars stored in 1Password, like a `.env` file but secure. |
| **Service Account** | A non-human identity with scoped access to specific Vaults/Environments. |
| **OP_SERVICE_ACCOUNT_TOKEN** | The active token that grants a Service Account access. Set automatically or manually before any `op` command. |

## 2.5 Secrets Architecture

### Two-layer structure

| Layer | What it stores | How to access |
|-------|---------------|---------------|
| **Vault** (e.g. `Claude_Code`, `TraitTune`, `IronBall`) | Logins, passwords, credentials, metadata, **Environment IDs** | `op read "op://VaultName/ItemName/FieldName"` |
| **Environment** (beta) | **API keys and secret values** as env vars (like a secure `.env` file) | `op run --environment <ENV_ID> -- <command>` |

**Key architecture:**
- **API keys and secret values** live in **Environments** (not Vaults)
- **Logins, passwords, metadata, and Environment IDs** live in **Vault Items**
- To get API keys: first find the Environment ID from the Vault, then use `op run --environment` to inject them

### Discovery workflow (CORRECT order)

```bash
# 1. List available vaults
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op vault list --format=json

# 2. List items in a vault — find Environment IDs, logins, credentials
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op item list --vault "TraitTune" --format=json

# 3. Read a specific vault item (e.g. get an Environment ID or login)
ENV_ID="$(OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op read "op://TraitTune/Environment/id")"

# 4. List environments to discover available env var sets
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op environment list --format=json

# 5. Run a command with API keys injected from an environment
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op run --environment "$ENV_ID" -- your_command

# 6. Or read a single env var from an environment into a shell variable
export NEON_API_KEY="$(OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op run --environment "$ENV_ID" -- printenv NEON_API_KEY)"
```

### For one-off secret reads from Vault items

```bash
# Read a password or credential stored as a Vault Item
export DB_PASSWORD="$(OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op read "op://TraitTune/Database/password")"
```

### NEVER do this

- `op environment read <env-id>` — exposes ALL values in plain text
- `op item get <item> --reveal` without piping to a variable — leaks to stdout/logs
- Guess vault, item, or environment names — ALWAYS discover first with `op vault list` → `op item list`

## 2.6 Project-Scoped Service Accounts

Per-project service account tokens are stored in the shell environment via `~/.zshrc`:

| Variable | Project | Vault Access |
|----------|---------|-------------|
| `OP_SA_IRONBALL` | Iron Ball Bot | IronBall vault |
| `OP_SA_TRAITTUNE` | TraitTune | TraitTune vault |
| `OP_SERVICE_ACCOUNT_TOKEN` | Default / fallback | Claude_Code vault |

### Token Selection Rule

Before ANY `op` command, select the correct token based on your current project context:

```bash
# Iron Ball Bot work — prefix each op command:
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_IRONBALL" op vault list --format=json

# TraitTune work — prefix each op command:
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op vault list --format=json

# General / cross-project — use default (already set in env):
op vault list --format=json
```

### Practical examples

```bash
# Get Neon DB connection string for TraitTune
export DATABASE_URL="$(OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op read "op://TraitTune/Neon/connection_string")"

# Get Stripe API key for Iron Ball
export STRIPE_KEY="$(OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_IRONBALL" op read "op://IronBall/Stripe/secret_key")"

# Run a command with all env vars from an environment
OP_SERVICE_ACCOUNT_TOKEN="$OP_SA_TRAITTUNE" op run --environment "<ENV_ID>" -- python script.py
```

### Agent Rules

- **Project-scoped agents** (engineers assigned to Iron Ball or TraitTune): ALWAYS use the matching project token
- **Cross-project agents** (CEO, CTO, CISO): Select token based on the task's project context
- **If unsure which project**: Use `OP_SERVICE_ACCOUNT_TOKEN` (default fallback)
- **ALWAYS discover first**: Run `op vault list` then `op item list --vault <name>` before trying to read specific secrets
- All three tokens are inherited from `~/.zshrc` — NEVER paste tokens in chat or logs

## 3. Connection Workflow

### Step 1: Receive the Service Account Token

The user provides `OP_SERVICE_ACCOUNT_TOKEN`. This is the **only secret** that needs to be passed directly.

```bash
export OP_SERVICE_ACCOUNT_TOKEN="<token from user>"
```

### Step 2: Auto-Discovery

Once the token is set, discover all accessible resources:

```bash
# List all accessible vaults
op vault list --format=json

# List items in each vault (names and IDs only, NOT values)
op item list --vault <vault-name> --format=json

# List accessible environments (beta)
op environment list --format=json
```

The token already defines the scope of access — no need to know vault/environment names in advance.

### Step 3: Read a specific secret (NEVER display the value)

```bash
# Read into an env var via subshell — value never appears in chat output
export MY_SECRET="$(op read "op://vault-name/item-name/field-name")"
```

## 4. Secret Discovery Workflow

When a task requires a secret (e.g., "set up AWS access"):

### Phase 1: Automatic Search

1. Run `op vault list` and `op item list` to see all available secrets
2. Semantically match item names/fields against what's needed
3. If a likely match is found → go to Phase 2

### Phase 2: Confirmation

Show the user the **NAME only** (never the value):

> Found item **'aws-prod'** in vault **'DevOps'** with fields: `access-key-id`, `secret-access-key`. Use this?

- **User confirms** → proceed, remember this mapping for the session
- **User declines** → go to Phase 3

### Phase 3: Manual Selection

Display a full list of available items (names only, NO values):

```
Available secrets:
  Vault: DevOps
    - aws-prod (fields: access-key-id, secret-access-key, region)
    - stripe-live (fields: secret-key, publishable-key)
  Vault: AI-Services
    - openai-key (fields: credential)
    - anthropic-key (fields: api-key)
```

Ask the user to choose.

### Phase 4: Hints When Not Found

If no matching secret exists, tell the user **exactly what's needed** with examples:

> I need AWS credentials but couldn't find them in your accessible Vaults. Please add an item with these fields:
> - `access-key-id` (e.g., `AKIAIOSFODNN7EXAMPLE`)
> - `secret-access-key` (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
> - `region` (e.g., `us-east-1`)

## 5. Secret Injection Methods

### Method 1: `op read` via subshell (recommended for single secrets)

```bash
export AWS_ACCESS_KEY_ID="$(op read "op://DevOps/aws-prod/access-key-id")"
export AWS_SECRET_ACCESS_KEY="$(op read "op://DevOps/aws-prod/secret-access-key")"
```

The `$(...)` subshell ensures the value goes directly into the env var. Claude Code sees only the command text, NOT the secret value.

### Method 2: `op run` with env file (recommended for multiple secrets)

Create a reference file (contains references, NOT actual secrets):

```bash
# File: /tmp/aws-secrets.env
AWS_ACCESS_KEY_ID=op://DevOps/aws-prod/access-key-id
AWS_SECRET_ACCESS_KEY=op://DevOps/aws-prod/secret-access-key
AWS_DEFAULT_REGION=op://DevOps/aws-prod/region
```

Run a command with all secrets injected:

```bash
op run --env-file /tmp/aws-secrets.env -- aws sts get-caller-identity
```

### Method 3: `op run --environment` (beta — for 1Password Environments)

```bash
op run --environment "traittune-dev" -- aws sts get-caller-identity
```

### Method 4: `op environment read` (beta — inspect environment variables)

```bash
op environment read "traittune-dev" --format=json
```

## 6. Integration with Other Skills

**For skill authors**: Any skill that needs secrets should include this instruction:

```
For credentials and secrets, use the `/op-secrets` skill.
Do NOT ask the user to paste secrets in chat.
Do NOT hardcode secrets in commands or files.
```

**For Dispatch agents**: Include in the agent's system prompt:

```
For all secrets and credentials, use the op-secrets skill.
Never accept secrets pasted in chat — always use 1Password CLI.
```

**op-secrets is installed on the machine via dotfiles** → any agent or session on this machine can use it.

## 7. Security Rules

### MANDATORY — NEVER violate these rules:

1. **NEVER** display a secret value in chat text or response
2. **NEVER** run `echo`, `cat`, `printenv`, `env | grep` on secret env vars without **explicit user approval**
3. **NEVER** write secret values to files (use `op://` references instead)
4. **NEVER** include secret values in git commits
5. **ALWAYS** use `$(op read ...)` subshell injection — value stays in the process env
6. **ALWAYS** show only NAMES of secrets when listing, never values
7. If the agent or any tool attempts to display a secret → **BLOCK and ask for user confirmation first**

### What IS safe:

- Showing vault names, item names, field names — these are metadata, not secrets
- Running `op read` inside `$(...)` — the value goes to env var, not to chat
- Running `op run -- <command>` — secrets are injected into the child process only

## 8. Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `not authorized` | Token lacks access to this vault | Admin: grant vault access to the Service Account |
| `vault not found` | Vault name is wrong or not accessible | Run `op vault list` to see accessible vaults |
| `item not found` | Item name is wrong | Run `op item list --vault <name>` to list items |
| `could not resolve secret reference` | Wrong `op://` path format | Check: `op://<vault>/<item>/[section/]<field>` |
| `OP_SERVICE_ACCOUNT_TOKEN not set` | Token not exported | `export OP_SERVICE_ACCOUNT_TOKEN="<token>"` |
| `environment not found` | Environment name wrong or Environments beta not available | Check `op environment list` — requires CLI beta 2.33+ |
| `expired token` | Service Account token expired | Admin: create a new token in 1Password |

### Debug commands

```bash
# Check which account the token authenticates as
op whoami

# List all accessible vaults
op vault list

# List items in a vault (names only)
op item list --vault <vault-name>

# Check CLI version (Environments require 2.33.0-beta+)
op --version
```
