---
name: google-stitch
description: Generate modern UI designs with Google Stitch AI via CLI and SDK. Use when user asks to create UI mockups, design screens, generate HTML/CSS from design prompts, or build site layouts with AI.
---

# Google Stitch — AI UI Design via CLI & SDK

Generate high-fidelity UI designs from text prompts using Google Stitch (Google Labs). Export as HTML/CSS, Tailwind, React, Vue, Angular, Flutter, or SwiftUI.

For credentials and secrets, use the /op-secrets skill. NEVER accept keys pasted in chat.

## Setup

```bash
# First-time auth (interactive — opens browser for Google OAuth)
npx @_davideast/stitch-mcp init

# Or use API key (store in 1Password, vault: Claude_Code)
export STITCH_API_KEY="$(op read 'op://Claude_Code/Stitch API Key/API Key')"
```

### Environment variables

| Variable | Purpose |
|----------|---------|
| `STITCH_API_KEY` | Direct API key auth (skip OAuth) |
| `STITCH_ACCESS_TOKEN` | Pre-existing access token |
| `STITCH_PROJECT_ID` | Default project ID |
| `STITCH_USE_SYSTEM_GCLOUD` | Use system gcloud (`1` to enable) |

## CLI Commands

All via `npx @_davideast/stitch-mcp <command>`:

| Command | What it does |
|---------|-------------|
| `init` | Auth setup + config wizard |
| `doctor` | Verify configuration health |
| `screens -p <projectId>` | Browse project screens interactively |
| `serve -p <projectId>` | Local Vite dev server preview |
| `site -p <projectId>` | Generate full Astro project from screens |
| `view` | Interactive resource browser (copy/preview/open) |
| `snapshot` | Save screen state to file |
| `tool <toolName>` | Invoke specific tool from CLI |
| `logout` | Revoke credentials |

### Generate a site from Stitch designs

```bash
# Generate Astro site with routes mapped to screens
npx @_davideast/stitch-mcp site -p <projectId>

# Preview locally
npx @_davideast/stitch-mcp serve -p <projectId>
```

### Get screen HTML code

```bash
npx @_davideast/stitch-mcp tool get_screen_code
```

## SDK — Programmatic Access

Install: `npm install @google/stitch-sdk`

### Generate UI from prompt

```typescript
import { stitch } from "@google/stitch-sdk";

const project = stitch.project("your-project-id");

// Generate a screen
const screen = await project.generate(
  "A modern dashboard with sidebar navigation, analytics cards, and a chart",
  "DESKTOP"  // MOBILE | DESKTOP | TABLET | AGNOSTIC
);

// Get HTML
const htmlUrl = await screen.getHtml();

// Get screenshot
const imageUrl = await screen.getImage();
```

### Edit existing screen

```typescript
const edited = await screen.edit("Change the color scheme to dark mode and add a user avatar in the header");
const html = await edited.getHtml();
```

### Generate variants

```typescript
const variants = await screen.variants("Try different card layouts", { count: 3 });
for (const v of variants) {
  console.log(await v.getHtml());
}
```

### List projects and screens

```typescript
const projects = await stitch.projects();
const screens = await stitch.project("id").screens();
const screen = await stitch.project("id").getScreen("screenId");
```

### Call tools directly (agent pattern)

```typescript
const result = await stitch.callTool("create_project", { title: "My App" });
```

## Workflow: Design to Code

1. **Create designs on stitch.withgoogle.com** or via SDK `project.generate()`
2. **Browse screens**: `npx @_davideast/stitch-mcp screens -p <id>`
3. **Get HTML/CSS**: `npx @_davideast/stitch-mcp tool get_screen_code` or SDK `screen.getHtml()`
4. **Integrate into project**: copy HTML into your components, adapt to your framework
5. **Generate full site**: `npx @_davideast/stitch-mcp site -p <id>` for Astro project

### Tips for good prompts

- Be specific: "A settings page with dark mode toggle, notification preferences, and account deletion button"
- Reference styles: "Material Design 3 style login form with Google sign-in"
- Specify layout: "Two-column layout with sidebar on the left, content area on the right"
- Include state: "An e-commerce product page showing a sneaker, with size selector, add-to-cart button, and reviews section"

## Export Formats

Stitch can export to:
- HTML/CSS (default)
- Tailwind CSS
- React/JSX
- Vue.js components
- Angular templates
- Flutter widgets
- SwiftUI views
- Figma (via "Copy to Figma" button in web UI)

## Device Types

| Type | Use for |
|------|---------|
| `MOBILE` | Phone app screens (375px) |
| `DESKTOP` | Web app pages (1280px+) |
| `TABLET` | Tablet layouts (768px) |
| `AGNOSTIC` | Responsive / component-level |

## Limits (Free Tier)

| Mode | Model | Generations/month |
|------|-------|--------------------|
| Standard | Gemini 2.5 Flash | 350 |
| Experimental | Gemini 2.5 Pro | 50 |

No credit card required. Google account only.

## References

- Web UI: https://stitch.withgoogle.com
- CLI: https://github.com/davideast/stitch-mcp
- SDK: https://github.com/google-labs-code/stitch-sdk
