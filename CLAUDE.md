# dotfiles — private notes for Claude Code

## Personal skill overrides

Skills `op-secrets` and `render-deploy` ship as public templates with placeholders.
Real project-specific config lives in `personal/` — gitignored, local only:

```
dotfiles/
  .claude/skills/
    op-secrets/SKILL.md        ← public template (Project1/Project2 placeholders)
    render-deploy/SKILL.md     ← public template (generic setup)
  personal/                    ← gitignored, this machine only
    op-secrets/SKILL.md        ← real vault names, OP_SA_* token variables
    render-deploy/SKILL.md     ← real service IDs and production URLs
```

`install.sh` installs public skills first, then overlays `personal/` — so
`/op-secrets` and `/render-deploy` use private versions locally.

## Git authorship

Always commit as Max Zemtsov:
```bash
git config user.name "Max Zemtsov"
git config user.email "14141103+maxzemtsov@users.noreply.github.com"
```
