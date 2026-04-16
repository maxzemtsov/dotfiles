# dotfiles — maxzemtsov

Personal Claude Code skills and developer tooling.

## Quick install

```bash
git clone git@github.com:maxzemtsov/dotfiles.git ~/dotfiles
bash ~/dotfiles/install.sh
```

`install.sh` symlinks all skills into `~/.claude/skills/` so Claude Code picks them up automatically.

---

## Claude Code Skills

Skills load automatically. Invoke with `/<skill-name>` in any Claude Code session.

| Skill | Invoke | Description |
|-------|--------|-------------|
| `op-secrets` | `/op-secrets` | Secure secrets via 1Password CLI — fetch credentials without exposing them in chat. Use before any skill that needs API keys or tokens. |
| `aws-cli` | `/aws-cli` | AWS CLI setup and common commands. Credentials always via `/op-secrets`. |
| `render-deploy` | `/render-deploy` | Manage Render.com services — deploy, restart, logs, rollback. Configure your services in `personal/render-deploy/SKILL.md`. |
| `ux-psychology` | `/ux-psychology` | Apply 106 cognitive biases and UX psychology principles to product and UI design decisions. |
| `shadcn-ui` | `/shadcn-ui` | shadcn/ui CLI — init projects, add components, search registries, view docs. |
| `21st-dev` | `/21st-dev` | Install production-grade UI components from 21st.dev (1400+ React + Tailwind blocks). |
| `google-stitch` | `/google-stitch` | Generate UI designs with Google Stitch AI — mockups, HTML/CSS from prompts. |
| `add-skill` | `/add-skill` | Create a new Claude Code skill and publish it to this repo. |

### Secrets policy

Every skill that needs credentials **must** use `/op-secrets`. Never paste keys in chat.

---

## Architecture

```
~/.claude/skills/              ← symlinks created by install.sh
    op-secrets/   →  ~/dotfiles/.claude/skills/op-secrets/
    render-deploy/ → ~/dotfiles/.claude/skills/render-deploy/
    ux-psychology/ → ~/dotfiles/.claude/skills/ux-psychology/
    shadcn-ui/    →  ~/dotfiles/.claude/skills/shadcn-ui/
    21st-dev/     →  ~/dotfiles/.claude/skills/21st-dev/
    google-stitch/ → ~/dotfiles/.claude/skills/google-stitch/
    aws-cli/      →  ~/dotfiles/.claude/skills/aws-cli/
    add-skill/    →  ~/dotfiles/.claude/skills/add-skill/
```

### How `/op-secrets` works

```
1Password setup:
  Vault → Items (credentials) or Environments (.env-style secret sets)
  Service Account → scoped vault access → OP_SERVICE_ACCOUNT_TOKEN

Claude Code session:
  1. Inherits OP_SERVICE_ACCOUNT_TOKEN from ~/.zshrc
  2. Auto-discovers: op vault list → op item list → op environment list
  3. Semantically matches needed credential → shows NAME only (never value)
  4. User confirms → injects via subshell:
       export API_KEY="$(op read op://vault/item/field)"
     Value goes to env var — never appears in chat or logs
```

---

## Remote access from phone

Control Claude Code on your Mac remotely via SSH:

```bash
# 1. Install Tailscale on Mac
brew install tailscale
sudo tailscaled

# 2. Install Tailscale + Termius on iPhone
# 3. SSH into Mac via Tailscale IP → run `claude`
```

All skills and MCPs work over SSH — they run locally on the Mac.

---

## Installing on a new machine

```bash
git clone git@github.com:maxzemtsov/dotfiles.git ~/dotfiles
bash ~/dotfiles/install.sh
```

Optional dependencies by skill:

```bash
# /op-secrets — 1Password CLI beta
brew install --cask 1password-cli@beta
op --version  # should be 2.33.0-beta or newer

# /aws-cli
brew install awscli

# /shadcn-ui and /21st-dev — Node.js required
node --version
```

After install, create `~/dotfiles/personal/` with your private skill overrides (see Personal overrides above).

---

## Adding a new skill

Use `/add-skill` in Claude Code — it guides through creation and publishing.

Or manually:

```bash
mkdir -p ~/dotfiles/.claude/skills/my-skill
# write ~/dotfiles/.claude/skills/my-skill/SKILL.md

cd ~/dotfiles
git add .claude/skills/my-skill
git commit -m "add skill: my-skill"
git push
```
