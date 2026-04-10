---
name: shadcn-ui
description: shadcn/ui CLI for initializing projects, adding components, searching registries, viewing docs, and applying presets. Use when user asks to add shadcn components, init a project with shadcn, search component registries, or get component docs/examples.
---

# shadcn/ui CLI

CLI tool for building component libraries with shadcn/ui. Add components, search registries, view docs — all from terminal.

Package: `shadcn` (v4+). Run via `npx shadcn@latest <command>`.

## Commands

### init — Initialize project

```bash
# Interactive setup
npx shadcn@latest init

# With template
npx shadcn@latest init -t next        # next | start | vite | react-router | laravel | astro

# With defaults (Next.js + base-nova preset)
npx shadcn@latest init -d

# Monorepo
npx shadcn@latest init --monorepo

# Init and add components in one step
npx shadcn@latest init button card dialog
```

### add — Add components

```bash
# Add by name
npx shadcn@latest add button
npx shadcn@latest add accordion card dialog

# Add all components
npx shadcn@latest add -a

# Add from URL (21st.dev, custom registry)
npx shadcn@latest add "https://21st.dev/r/shadcn/accordion"

# Add from local path
npx shadcn@latest add ./my-components/custom-button

# Overwrite existing
npx shadcn@latest add button -o

# Skip confirmation
npx shadcn@latest add button -y

# Custom output path
npx shadcn@latest add button -p src/ui

# Dry run (preview without writing)
npx shadcn@latest add button --dry-run

# Show diff for a component
npx shadcn@latest add button --diff
```

### search — Search registries

```bash
# Search default registry
npx shadcn@latest search @shadcn

# Search with query
npx shadcn@latest search @shadcn -q "date picker"

# Search 21st.dev registry
npx shadcn@latest search https://21st.dev

# Limit results
npx shadcn@latest search @shadcn -q "button" -l 10
```

### docs — Get component docs & examples

```bash
# Get docs for a component
npx shadcn@latest docs button

# Multiple components
npx shadcn@latest docs button card dialog

# Output as JSON
npx shadcn@latest docs button --json

# Choose base (radix or base)
npx shadcn@latest docs button -b radix
```

### view — View registry items

```bash
# View component details
npx shadcn@latest view button

# View from URL
npx shadcn@latest view "https://21st.dev/r/shadcn/accordion"
```

### apply — Apply presets/themes

```bash
# Apply a preset
npx shadcn@latest apply

# Apply specific preset
npx shadcn@latest apply --preset base-nova

# Skip confirmation
npx shadcn@latest apply -y
```

### registry — Manage registries

```bash
# Add a custom registry
npx shadcn@latest registry add https://21st.dev
```

### info — Project info

```bash
npx shadcn@latest info
```

### build — Build custom registry

```bash
# Build from registry.json
npx shadcn@latest build

# Custom paths
npx shadcn@latest build ./registry.json -o ./public/r
```

## Common Workflows

### New Next.js project with shadcn

```bash
npx shadcn@latest init -t next -d
npx shadcn@latest add button card input label
```

### Add components from 21st.dev

```bash
npx shadcn@latest search https://21st.dev -q "sidebar"
npx shadcn@latest add "https://21st.dev/r/{author}/{component}" -y
```

### Check what changed before updating

```bash
npx shadcn@latest add button --diff
```

### Get usage examples before adding

```bash
npx shadcn@latest docs accordion --json | jq
```

## Key Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--yes` | `-y` | Skip confirmation prompts |
| `--overwrite` | `-o` | Overwrite existing files |
| `--cwd` | `-c` | Working directory |
| `--dry-run` | | Preview without writing |
| `--diff` | | Show diff for component |
| `--silent` | `-s` | Mute output |
| `--all` | `-a` | Add all components |
| `--path` | `-p` | Custom output path |

## Templates

| Template | Framework |
|----------|-----------|
| `next` | Next.js |
| `start` | Start |
| `vite` | Vite + React |
| `react-router` | React Router |
| `laravel` | Laravel |
| `astro` | Astro |

## References

- Docs: https://ui.shadcn.com/docs
- CLI: https://ui.shadcn.com/docs/cli
- Components: https://ui.shadcn.com/docs/components
- Registry: https://21st.dev (community components)
