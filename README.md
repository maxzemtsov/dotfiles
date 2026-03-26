# dotfiles — maxzemtsov

Personal dotfiles, Claude Code skills, and developer tooling.

## Quick install

```bash
git clone git@github.com:maxzemtsov/dotfiles.git ~/dotfiles
bash ~/dotfiles/install.sh
```

`install.sh` symlinks all skills into `~/.claude/skills/` so Claude Code picks them up automatically.

## Remote access from phone

Keep Mac always on, control Claude Code remotely:

```bash
# 1. Install Tailscale on Mac
brew install tailscale
sudo tailscaled

# 2. Install Tailscale + Termius on iPhone
# 3. SSH into Mac via Tailscale IP → run `claude`
```

All skills, plugins, and MCPs work over SSH — they run locally on the Mac.

---

## Claude Code Skills

Skills are loaded automatically by Claude Code. Invoke with `/<skill-name>` in any session.

| Skill | Invoke | Description |
|-------|--------|-------------|
| `op-secrets` | `/op-secrets` | Secure secrets via 1Password CLI — fetch credentials without exposing them in chat. Always use this before any other skill that needs API keys or tokens. |
| `aws-cli` | `/aws-cli` | AWS CLI setup and common commands. Credentials always via `/op-secrets`. |
| `add-skill` | `/add-skill` | Create a new Claude Code skill and publish it to this dotfiles repo. |

### Secrets policy

Every skill that needs credentials **must** use `/op-secrets`. Never paste keys in chat.

---

## Architecture

```
~/.claude/skills/          ← symlinks (created by install.sh)
    op-secrets/  →  ~/dotfiles/.claude/skills/op-secrets/SKILL.md
    aws-cli/     →  ~/dotfiles/.claude/skills/aws-cli/SKILL.md
    add-skill/   →  ~/dotfiles/.claude/skills/add-skill/SKILL.md
```

### How `/op-secrets` works

```
User sets up in 1Password (web app):
  Vault → Items (credentials) or Environments (.env-style secret sets)
  Service Account → scoped access → OP_SERVICE_ACCOUNT_TOKEN

Claude Code session:
  1. Receives OP_SERVICE_ACCOUNT_TOKEN (the only secret passed directly)
  2. Auto-discovers: op vault list → op item list → op environment list
  3. Semantically matches needed credentials → shows NAME only (never values)
  4. User confirms → injects via subshell:
       export AWS_ACCESS_KEY_ID="$(op read op://vault/item/field)"
     Value goes directly to env var — never appears in chat or logs
```

---

## Adding a new skill

Use `/add-skill` in Claude Code — it guides through creation and publishing.

Or manually:

```bash
# Create skill
mkdir -p ~/.claude/skills/my-skill
# write ~/.claude/skills/my-skill/SKILL.md

# Publish to dotfiles
cp -r ~/.claude/skills/my-skill ~/dotfiles/.claude/skills/
cd ~/dotfiles
git add . && git commit -m "add skill: my-skill"
git push
```

## Installing on a new machine

```bash
git clone git@github.com:maxzemtsov/dotfiles.git ~/dotfiles
bash ~/dotfiles/install.sh

# Install 1Password CLI beta (required for /op-secrets)
brew install --cask 1password-cli@beta
op --version  # should be 2.33.0-beta or newer

# Install AWS CLI (for /aws-cli)
brew install awscli
```
