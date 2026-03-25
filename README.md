# dotfiles — maxzemtsov

Personal dotfiles and Claude Code skills for TraitTune, Inc.

## Install on a new machine

```bash
git clone git@github.com:maxzemtsov/dotfiles.git ~/dotfiles
bash ~/dotfiles/install.sh
```

## Skills

| Skill | Description |
|-------|-------------|
| `aws-cli-traittune` | AWS CLI setup and management for TraitTune, Inc. |

## Add a new skill

```bash
cp -r ~/.claude/skills/my-skill ~/dotfiles/.claude/skills/
cd ~/dotfiles
git add . && git commit -m "add my-skill"
git push
```
