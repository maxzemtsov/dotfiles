---
name: google-stitch
description: Generate high-fidelity UI designs (HTML/CSS, screenshots) with Google Stitch AI via SDK + bundled scripts — Gemini-2.5-powered, free tier 350 generations/month. ALWAYS use this skill when the user asks to "design a UI", "create a mockup", "generate a screen", "build a landing page mockup", "design a dashboard", "I need a UI prototype", "сверстай UI", "сделай мокап", "design something with Stitch", "wireframe a page", "lay out a feature", "make me a screen for X", or describes a UI surface they want rendered (landing, pricing, dashboard, onboarding, marketing site, mobile app screen, web component). Trigger even when the user doesn't explicitly say "Stitch" — if they want a designed UI from a text description and you have Stitch available, this is the right tool. Output is always saved to `.stitch/designs/<name>.{html,png}` and includes a screenshot for the user to inspect.
---

# Stitch Design Expert

Expert UI designer using **Google Stitch** (Gemini 2.5 backed) to render high-fidelity UI from text prompts. Workflow uses bundled SDK scripts in `scripts/` to avoid re-typing 50-line Node files per call.

For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.

## First-time setup (run once per machine)

The bundled scripts depend on `@google/stitch-sdk`. The skill ships with a
`package.json` so installation is a one-liner. Do this ONCE per machine:

```bash
cd ~/.claude/skills/google-stitch && npm install
```

After that, every session just needs auth + project resolution:

```bash
source ~/.zshrc 2>/dev/null
export STITCH_API_KEY="$(op read 'op://Claude_Code/Stitch API Key/API Key')"

# Discover project IDs (the CLI calls them `projectId`):
node ~/.claude/skills/google-stitch/scripts/list.mjs

# Pick one and pin for this session (otherwise generate.mjs uses the first):
export STITCH_PROJECT_ID="<id-from-list-output>"

# Optional — override the default `.stitch/designs/` output location:
export STITCH_OUTPUT_DIR="my/custom/path"
```

If `npm install` was skipped you'll see `ERR_MODULE_NOT_FOUND` on first run.
That's the signal to do the one-time install — re-run the script after.

## The core idea

Stitch turns text prompts into rendered HTML + screenshot. Quality is dominated by **prompt structure** — vague prompts produce generic output. The skill's value is the structured-prompt format below; the SDK is just plumbing.

## Known-quirk: first-generation logo bootstrap

On a project with NO prior screens, Stitch sometimes interprets the first
`generate_screen_from_text` call as "make me a logo" rather than the full
page described — it returns a tiny SVG (e.g., 160×40) regardless of how
detailed your prompt is. Confirmed by 2 of 3 eval runs on 2026-05-10
(both fresh-project starts on landing-page prompts).

**Workaround**: after the first generate returns a logo-shaped output,
run `scripts/edit.mjs <screenId> "Expand into the full landing page —
render the entire page top-to-bottom with all sections from the original
brief"`. The edit path bypasses the bootstrap heuristic and produces the
full page. Edits don't count against the 350/month quota — this is also
the cheaper path generally.

If you suspect the project is fresh, you can also pre-warm by sending one
throwaway "make a logo" request, then proceed with real generates against
the now-warm project.

## Step 1 — Enhance the user's prompt

Before calling Stitch, transform vague requests into structured design specs. Vague-to-enhanced examples:

| Vague | Enhanced |
|---|---|
| "menu at the top" | "sticky navigation bar with logo and list items" |
| "big photo" | "high-impact hero section with full-width imagery" |
| "list of things" | "responsive card grid with hover states and subtle elevations" |
| "button" | "primary call-to-action button with micro-interactions" |
| "form" | "clean form with labeled inputs, validation states, submit CTA" |
| "sidebar" | "collapsible side navigation with icon-label pairings" |
| "popup" | "modal dialog with overlay and smooth entry animation" |

### Atmosphere descriptors

| Vibe | Enhanced |
|---|---|
| Modern | "Clean, minimal, generous whitespace, high-contrast typography" |
| Professional | "Sophisticated, trustworthy, subtle shadows, restricted premium palette" |
| Fun / Playful | "Vibrant, organic, rounded corners, bold accents, bouncy micro-animations" |
| Dark Mode | "Electric high-contrast accents on deep slate / near-black backgrounds" |
| Luxury | "Elegant, spacious, fine lines, serif headers, high-fidelity photography focus" |
| Tech / Cyber | "Futuristic, neon accents, glassmorphism, monospaced typography" |

### Structured prompt template

```
[Overall vibe, mood, and purpose of the page]

DESIGN SYSTEM:
- Platform: [Web/Mobile], [Desktop/Mobile]-first
- Palette: [Primary Name] (#hex for role), [Secondary Name] (#hex for role)
- Styles: [Roundness], [Shadow/Elevation], [Typography feel]

PAGE STRUCTURE:
1. Header: [navigation and branding]
2. Hero Section: [headline, subtext, CTA]
3. Primary Content: [component breakdown]
4. Footer: [links, copyright]
```

## Step 2 — Generate via the bundled script

```bash
node $CLAUDE_SKILL_DIR/scripts/generate.mjs \
  "<enhanced prompt>" \
  DESKTOP \
  hero-landing
# Saves to .stitch/designs/hero-landing.{html,png}
# Prints { screenId, htmlPath, imagePath, projectId } as JSON
```

Capture the `screenId` from output — needed for editing/variants in Step 3+.

Device options: `DESKTOP` (1280px+), `MOBILE` (375px), `TABLET` (768px), `AGNOSTIC` (responsive / component-level).

## Step 3 — Refine, don't regenerate

Editing preserves design-system continuity (colors, spacing, fonts) and doesn't burn a fresh generation slot from your monthly quota.

```bash
node $CLAUDE_SKILL_DIR/scripts/edit.mjs \
  "<screenId from Step 2>" \
  "Change the color scheme to dark mode with electric blue accents" \
  hero-landing-v2
```

## Step 4 — Generate variants (explore design space)

```bash
node $CLAUDE_SKILL_DIR/scripts/variants.mjs \
  "<screenId>" \
  "Try different card layouts" \
  3
# Saves variant-0-*.html, variant-1-*.html, variant-2-*.html
```

Output JSON includes `htmlPath` + `imagePath` per variant — feed back to user to pick a winner.

## Step 5 — Maintain consistency with `.stitch/DESIGN.md`

After generating 2+ screens, write a design-system doc so subsequent generations stay coherent:

```markdown
# Design System

## Colors
- Primary: Ocean Blue (#2563EB) — CTAs, links, active states
- Secondary: Slate (#475569) — body text, secondary elements
- Background: Snow (#FAFAFA) — page canvas
- Surface: White (#FFFFFF) — cards, elevated containers
- Accent: Amber (#F59E0B) — highlights, badges, warnings

## Typography
- Headings: Inter, 700, tight tracking
- Body: Inter, 400, relaxed line-height
- Code: JetBrains Mono, 400

## Spacing
- Page padding: 24px (mobile) / 64px (desktop)
- Section gap: 48px / 96px
- Card padding: 24px

## Shapes
- Buttons: rounded-lg (8px)
- Cards: rounded-xl (12px)
- Avatars: rounded-full

## Shadows
- Cards: 0 1px 3px rgba(0,0,0,0.1)
- Modals: 0 20px 60px rgba(0,0,0,0.15)
```

Reference the doc when prompting future generations: "use the design system at .stitch/DESIGN.md".

## CLI alternative (when SDK is awkward)

Stitch ships a separate CLI under `@_davideast/stitch-mcp`. Prefer the bundled SDK scripts above — they're 1 round-trip and save outputs to disk. Use the CLI only for these specific cases:

```bash
# Browse screens interactively
npx @_davideast/stitch-mcp screens -p <projectId>

# Local Vite preview of all screens in a project
npx @_davideast/stitch-mcp serve -p <projectId>

# Generate a full Astro site from current screens
npx @_davideast/stitch-mcp site -p <projectId>

# Health check
npx @_davideast/stitch-mcp doctor
```

## Reference

### Export formats
HTML/CSS (default), Tailwind CSS, React/JSX, Vue.js, Angular, Flutter, SwiftUI

### Free-tier limits

| Mode | Model | Generations/month |
|---|---|---|
| Standard | Gemini 2.5 Flash | 350 |
| Experimental | Gemini 2.5 Pro | 50 |

Exceeding the cap returns a `QuotaExceededError` from the SDK — no auto-charge, generation just fails. Edit-instead-of-regenerate to stretch the budget.

### Best practices (woven into the workflow above)

- **Enhance prompts first** — vague descriptions produce generic output
- **Edit, don't regenerate** — refining preserves design continuity + saves quota
- **Use hex colors** — Stitch responds better to specific values than named colors
- **Number page sections** (Header, Hero, Content, Footer) — structure helps the model
- **Set the vibe** — explicit mood/atmosphere line at top of prompt
- **One change at a time** in edits — sweeping changes produce muddled results
- **Maintain DESIGN.md** — multi-screen consistency depends on it

### Troubleshooting

| Symptom | Diagnosis | Fix |
|---|---|---|
| `STITCH_API_KEY not set` | Auth not exported in current shell | Re-run setup block at top |
| `No projects yet` | Empty Stitch account | Create one at https://stitch.withgoogle.com first |
| `QuotaExceededError` | Hit monthly free-tier cap | Wait for monthly reset OR edit existing screens (no quota cost) |
| Empty / broken HTML | Prompt too vague OR Stitch model retried-out | Re-run with structured-prompt template (Step 1); if persists, try AGNOSTIC device |
| Screenshot 404 | Image URL expired (rare; usually cached for hours) | Re-run getImage on the screen object via `node scripts/edit.mjs <id> ""` (no-op edit refreshes URLs) |

### External references

- Web UI: https://stitch.withgoogle.com
- CLI repo: https://github.com/davideast/stitch-mcp
- SDK repo: https://github.com/google-labs-code/stitch-sdk
- Official skill bundle: `npx skills add google-labs-code/stitch-skills --list`

For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.
