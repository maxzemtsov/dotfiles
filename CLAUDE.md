# dotfiles — private notes for Claude Code

## Personal skill overrides

Skill `op-secrets` ships as a public template with placeholders.
Real project-specific config lives in `personal/` — gitignored, local only:

```
dotfiles/
  .claude/skills/
    op-secrets/SKILL.md        ← public template (Project1/Project2 placeholders)
  personal/                    ← gitignored, this machine only
    op-secrets/SKILL.md        ← real vault names, OP_SA_* token variables
```

`install.sh` installs public skills first, then overlays `personal/` — so
`/op-secrets` uses the private version locally.