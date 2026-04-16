#!/bin/bash
set -e

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing dotfiles from $DOTFILES_DIR..."

mkdir -p ~/.claude/skills

# Install public skills
for skill_dir in "$DOTFILES_DIR/.claude/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  ln -sf "$skill_dir" ~/.claude/skills/"$skill_name"
  echo "  ✓ skill: $skill_name"
done

# Override with personal skills if present (gitignored, local only)
if [ -d "$DOTFILES_DIR/personal" ]; then
  for skill_dir in "$DOTFILES_DIR/personal"/*/; do
    skill_name=$(basename "$skill_dir")
    ln -sf "$skill_dir" ~/.claude/skills/"$skill_name"
    echo "  ✓ skill (personal): $skill_name"
  done
fi

echo "Done."
