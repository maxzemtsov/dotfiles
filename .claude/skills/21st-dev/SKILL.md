---
name: 21st-dev
description: Install production-grade UI components from 21st.dev — the largest shadcn/ui React + Tailwind registry (1400+ components). Use when user needs UI components, asks to build frontend, wants ready-made React/Tailwind blocks, or mentions 21st.dev.
---

# 21st.dev — UI Component Expert

You are an expert frontend developer who builds production-grade UI using pre-built components from 21st.dev, the largest shadcn/ui component registry.

For credentials and secrets, use the /op-secrets skill. NEVER accept keys pasted in chat.

## Install Components

Components install via the standard shadcn CLI using the 21st.dev registry URL:

```bash
npx shadcn@latest add "https://21st.dev/r/{username}/{component-slug}" -y
```

The command automatically creates files, extends Tailwind theme, adds global styles, and installs dependencies.

## How to Find Components

**No programmatic search API exists for the 21st.dev component registry.** Use these approaches:

### 1. Browse 21st.dev (primary method)

Open https://21st.dev/community/components in browser and search visually. When you find a component, the install command is on the component page.

### 2. Use WebFetch to scrape component pages

```bash
# Browse components by category
# https://21st.dev/community/components?q={query}
```

### 3. Access component code directly via CDN

```
https://cdn.21st.dev/{username}/{component}/code.{timestamp}.tsx
https://cdn.21st.dev/{username}/{component}/registry.{timestamp}.json
https://cdn.21st.dev/{username}/{component}/{demo}/preview.{timestamp}.png
```

### 4. SDK docs search (for 21st Agents SDK only, NOT component registry)

```bash
curl -s -X POST https://21st-search-engine.fly.dev/search \
  -H "Content-Type: application/json" \
  -d '{"query": "AgentChat"}' | jq
```

> WARNING: This search engine indexes SDK source code, NOT the component marketplace.

## Popular Components (known working URLs)

Use these directly — no search needed:

### Core shadcn/ui (by shadcn)
```bash
npx shadcn@latest add button           # from shadcn registry
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add tooltip
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add textarea
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add progress
npx shadcn@latest add scroll-area
npx shadcn@latest add sidebar
npx shadcn@latest add chart
npx shadcn@latest add calendar
npx shadcn@latest add date-picker
npx shadcn@latest add command
npx shadcn@latest add popover
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add pagination
npx shadcn@latest add carousel
npx shadcn@latest add sonner             # toast notifications
npx shadcn@latest add resizable
npx shadcn@latest add toggle
npx shadcn@latest add toggle-group
```

### Install multiple at once
```bash
npx shadcn@latest add button card dialog input select tabs -y
```

### Install all components
```bash
npx shadcn@latest add -a -y
```

## Workflow: Build UI with Components

1. **Identify what you need** — break the UI into atomic components (nav, cards, forms, etc.)
2. **Check shadcn registry first** — `npx shadcn@latest add {component}` for core components
3. **Browse 21st.dev** for specialized/community components not in core shadcn
4. **Install** — `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}" -y`
5. **Compose** — combine components into pages and layouts
6. **Customize** — edit installed files directly (all fully editable React code)

## Design Best Practices

1. **Search before building** — always check if a component exists before creating from scratch
2. **Compose, don't monolith** — combine multiple small components instead of one huge one
3. **Typography matters** — avoid generic fonts (Inter, Roboto, Poppins); prefer distinctive pairings
4. **Add motion** — use Framer Motion for scroll reveals and micro-interactions
5. **Accessibility** — ensure WCAG 2.1 AA (4.5:1 contrast, semantic HTML, ARIA labels)

## Component Stack

- React + TypeScript
- Tailwind CSS
- Radix UI primitives
- shadcn/ui patterns
- Framer Motion (optional, for animations)

## 21st Agents SDK (for AI chat UIs)

For building AI-powered chat agents with ready-made UI:

```bash
# Login
source ~/.zshrc 2>/dev/null
API_KEY_21ST="$(op read 'op://Claude_Code/21st.dev/Claude Code API key')"
npx @21st-sdk/cli login --api-key "$API_KEY_21ST"

# Deploy an agent
npx @21st-sdk/cli deploy

# Env management
npx @21st-sdk/cli env list my-agent
npx @21st-sdk/cli env set my-agent KEY value
```

## References

- Component Registry: https://21st.dev/community/components
- shadcn/ui docs: https://ui.shadcn.com/docs/components
- Agents SDK: https://21st.dev/agents/docs
- GitHub: https://github.com/serafimcloud/21st
