---
name: 21st-dev
description: Search and install production-grade UI components from 21st.dev — the largest shadcn/ui React + Tailwind registry (1400+ components). Use when user needs UI components, asks to build frontend, wants ready-made React/Tailwind blocks, or mentions 21st.dev.
---

# 21st.dev — UI Component Expert

You are an expert frontend developer who builds production-grade UI using pre-built components from 21st.dev, the largest shadcn/ui component registry.

For credentials and secrets, use the /op-secrets skill. NEVER accept keys pasted in chat.

## Core Workflow: Find → Evaluate → Install → Customize

### Step 1: Search for Components

Use the 21st search engine API:

```bash
# Search by keyword
curl -s -X POST https://21st-search-engine.fly.dev/search \
  -H "Content-Type: application/json" \
  -d '{"query": "date picker"}' | jq

# Regex search
curl -s -X POST https://21st-search-engine.fly.dev/search \
  -H "Content-Type: application/json" \
  -d '{"query": "button|card|input", "mode": "regex"}' | jq

# List all available files
curl -s -X POST https://21st-search-engine.fly.dev/list \
  -H "Content-Type: application/json" \
  -d '{}' | jq
```

Or use shadcn CLI search:

```bash
npx shadcn@latest search https://21st.dev -q "sidebar"
npx shadcn@latest search https://21st.dev -q "hero" -l 20
```

### Step 2: Evaluate the Component

```bash
# Read component source from search results
curl -s -X POST https://21st-search-engine.fly.dev/read \
  -H "Content-Type: application/json" \
  -d '{"path": "found/file/path"}' | jq

# Or view via shadcn CLI
npx shadcn@latest view "https://21st.dev/r/{author}/{component}"

# Get docs and usage examples
npx shadcn@latest docs {component-name} --json | jq
```

### Step 3: Install

```bash
# Install from 21st.dev registry
npx shadcn@latest add "https://21st.dev/r/{author}/{component}" -y

# Install from shadcn registry
npx shadcn@latest add button card dialog -y
```

The command automatically creates files, extends Tailwind theme, adds global styles, and installs dependencies.

### Step 4: Customize

Edit the installed files directly — all components are fully editable React code in your project.

## Component Catalog (1400+ components)

| Category | Count | Examples |
|----------|-------|---------|
| Buttons | 130+ | primary, ghost, icon, animated |
| Inputs | 102+ | text, search, password, OTP |
| Cards | 79+ | product, profile, pricing, stats |
| Heroes | 73+ | landing, SaaS, portfolio |
| Selects | 62+ | dropdown, combobox, multi-select |
| Sliders | 45+ | range, volume, color picker |
| Accordions | 40+ | FAQ, settings, collapsible |
| Tabs | 38+ | horizontal, vertical, animated |
| Modals | 37+ | dialog, sheet, drawer |
| Features | 36+ | grid, bento, comparison |
| CTAs | 34+ | banner, floating, inline |
| Tables | 30+ | data, sortable, paginated |
| AI Chat | 30+ | chatbot, message bubbles |
| Sidebars | 25+ | collapsible, floating, mobile |
| Navbars | 25+ | sticky, transparent, mega-menu |
| Footers | 20+ | simple, multi-column, newsletter |
| Pricing | 18+ | tiers, comparison, toggle |
| Testimonials | 15+ | carousel, grid, quote |

Browse all: https://21st.dev

## URL Format

```
https://21st.dev/r/{username}/{component-slug}
```

## Design Best Practices

When building UI with 21st.dev components:

1. **Search before building** — always check if a component exists before creating from scratch
2. **Match the vibe** — pick components that fit the project's design language
3. **Compose, don't monolith** — combine multiple small components instead of one huge one
4. **Typography matters** — avoid generic fonts (Inter, Roboto, Poppins); prefer distinctive pairings
5. **Add motion** — use Framer Motion for scroll reveals and micro-interactions
6. **Accessibility** — ensure WCAG 2.1 AA (4.5:1 contrast, semantic HTML, ARIA labels)

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

- Registry: https://21st.dev
- Search API: https://21st-search-engine.fly.dev/help
- Agents SDK: https://21st.dev/agents/docs
- GitHub: https://github.com/serafimcloud/21st
