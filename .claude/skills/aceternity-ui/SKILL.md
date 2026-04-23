---
name: aceternity-ui
description: Install Aceternity UI components (focus-cards, bento-grid, aurora-background, sparkles, 3d-card-effect, typewriter-effect, infinite-moving-cards, background-beams, tracing-beam, floating-dock, timeline, world-map, etc.) into a Next.js/shadcn project via shadcn@latest CLI. Use when user asks to add Aceternity components, references ui.aceternity.com, or wants any component from that registry.
---

# Aceternity UI — install components

Aceternity publishes via the shadcn registry, so use `npx shadcn@latest` as the installer (not the legacy `npx aceternity` CLI).

## Prerequisites (check first)

- `components.json` exists at project root (or web app root like `frontend/`). If not, run `npx shadcn@latest init` first.
- Deps typically required: `motion` or `framer-motion`, `clsx`, `tailwind-merge`, `class-variance-authority`, `@tabler/icons-react`, `lucide-react`. Most shadcn projects already have all of these.

## Path A — namespaced registry (recommended, one-time setup)

Add an alias to `components.json` so installs read `@aceternity/<component>`:

```json
{
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

Then:

```bash
# install one
npx shadcn@latest add @aceternity/focus-cards

# search within the registry
npx shadcn@latest search @aceternity/card

# list everything published
npx shadcn@latest list @aceternity
```

## Path B — direct URL (no config)

```bash
npx shadcn@latest add https://ui.aceternity.com/registry/focus-cards.json
```

Works without editing `components.json`. Good for one-off trial installs.

## Path C — legacy native CLI (less flexible, avoid unless needed)

```bash
npx aceternity init       # one-time: touches tailwind config + cn util + css vars
npx aceternity add focus-cards
```

The legacy CLI is lighter-weight but doesn't support namespaced registries, search, or list. It predates shadcn@3 and is mostly maintained for historical reasons.

## Known components (partial — see `references/components.md` for full index)

**Cards & containers.** focus-cards · bento-grid · 3d-card-effect · card-hover-effect · infinite-moving-cards · layout-grid
**Backgrounds & effects.** aurora-background · background-beams · sparkles · wavy-background · lamp-effect · tracing-beam · meteors
**Text.** text-generate-effect · typewriter-effect · flip-words · text-reveal
**Nav.** floating-dock · floating-navbar · tabs
**Showcase.** timeline · world-map · github-globe · compare · macbook-scroll · container-scroll-animation

## Workflow — add focus-cards (full example)

```bash
# 1. Verify registry alias (add it to components.json if missing — see Path A)
grep -q '"@aceternity"' frontend/components.json \
  || echo "Add registries.@aceternity to components.json first."

# 2. Install
cd frontend
npx shadcn@latest add @aceternity/focus-cards

# 3. Verify the file landed at the ui/ alias
ls src/components/ui/focus-cards.tsx

# 4. Check what new deps slipped in
git diff package.json
```

## Gotchas

- **Overwrites.** If project already has a file at the same path (e.g., from magicui or a prior shadcn install), the installer will prompt. Pass `-o/--overwrite` or `-y/--yes` only if you've audited the diff.
- **Motion import drift.** Some components import from `framer-motion`, others from `motion/react` (motion v12+). If your project standardized on one, quick-find-replace after install.
- **Tailwind v4.** `@tailwindcss/postcss` projects work, but a few components assume CSS variables from the legacy `init`. If colors look off, diff the generated file against the registry source and port any `@layer base` additions manually.
- **Heavy deps.** `world-map`, `github-globe`, `meteors`, `macbook-scroll` pull three.js, d3-geo, or large SVG payloads. Always `git diff package.json` and `du -sh node_modules/three 2>/dev/null` before committing.
- **Client components.** Most aceternity components need `'use client'` at the top. The installer sets this, but if a component ends up in a server-rendered page, wrap it in a `'use client'` shim.
- **Dark mode.** Aceternity components are designed dark-first. If your project is light-first, override `bg-black`/`text-white` defaults and test both themes before shipping.

## References

- CLI docs: https://ui.aceternity.com/docs/cli
- Component catalog: https://ui.aceternity.com/components
- Component registry JSON (for Path B direct-URL installs):
  `https://ui.aceternity.com/registry/<name>.json`

For the full component index with preview URLs, see `references/components.md` in this skill.

For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat. (Aceternity registry is public — no credentials needed for install, but note this for projects pulling components from private registries.)
