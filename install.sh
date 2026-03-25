#!/bin/bash
set -e

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing dotfiles from $DOTFILES_DIR..."

# Claude Code skills
mkdir -p ~/.claude/skills
for skill_dir in "$DOTFILES_DIR/.claude/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  ln -sf "$skill_dir" ~/.claude/skills/"$skill_name"
  echo "  ✓ skill: $skill_name"
done

echo "Done."
