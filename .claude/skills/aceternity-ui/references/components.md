# Aceternity UI — component index

Full catalog from `https://ui.aceternity.com/components`. Names are the canonical registry slugs used with `npx shadcn@latest add @aceternity/<name>`.

## Backgrounds & visual effects
- aurora-background
- background-beams
- background-beams-with-collision
- background-boxes
- background-gradient
- background-lines
- canvas-reveal-effect
- glowing-stars
- google-gemini-effect
- grid-and-dot-backgrounds
- lamp-effect
- meteors
- multi-step-loader
- shooting-stars
- sparkles
- spotlight
- stars-background
- vortex
- wavy-background

## Cards & containers
- 3d-card-effect
- bento-grid
- card-hover-effect
- card-stack
- cover
- direction-aware-hover
- evervault-card
- focus-cards
- following-pointer
- glare-card
- infinite-moving-cards
- layout-grid
- parallax-scroll
- pin-container
- sticky-scroll-reveal
- wobble-card

## Text animation
- colourful-text
- flip-words
- hero-highlight
- hero-parallax
- moving-border
- placeholders-and-vanish-input
- text-generate-effect
- text-hover-effect
- text-reveal-card
- typewriter-effect

## Navigation
- animated-tabs
- floating-dock
- floating-navbar
- link-preview
- navbar-menu
- resizable-navbar
- sidebar

## Showcases / hero patterns
- apple-cards-carousel
- code-block
- compare
- container-scroll-animation
- expandable-card
- feature-sections
- file-upload
- github-globe
- google-gemini-effect
- hero-scroll-animation
- macbook-scroll
- signup-form
- tabs
- timeline
- tracing-beam
- world-map

## Utilities
- cn (utility)
- container
- tooltip

## Install cheat-sheet

Namespaced (preferred — requires `@aceternity` alias in `components.json`):

```bash
npx shadcn@latest add @aceternity/focus-cards
npx shadcn@latest add @aceternity/bento-grid
npx shadcn@latest add @aceternity/aurora-background
```

Direct URL (no config):

```bash
npx shadcn@latest add https://ui.aceternity.com/registry/<name>.json
```

Search:

```bash
npx shadcn@latest search @aceternity/<term>
```

## Note on staleness

This list was captured 2026-04-23. The registry ships new components regularly. When the user names a component not in this list, try the install anyway — `@aceternity/<name>` will 404 cleanly if the slug doesn't exist, and the error message in the installer is explicit.

For the up-to-date index, fetch https://ui.aceternity.com/components and read the component tiles.
