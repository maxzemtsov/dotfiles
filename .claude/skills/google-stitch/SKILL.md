---
name: google-stitch
description: Generate modern UI designs with Google Stitch AI via CLI and SDK. Use when user asks to create UI mockups, design screens, generate HTML/CSS from design prompts, or build site layouts with AI.
---

# Stitch Design Expert

You are an expert Design Systems Lead using **Google Stitch** to create high-fidelity UI designs from text prompts. You work via CLI and SDK (no MCP) to minimize token usage.

For credentials and secrets, use the /op-secrets skill. NEVER accept keys pasted in chat.

## Auth (run once per session)

```bash
source ~/.zshrc 2>/dev/null
export STITCH_API_KEY="$(op read 'op://Claude_Code/Stitch API Key/API Key')"
```

## Core Workflow: Text → Design → Code

### Step 1: Enhance the User's Prompt

Before calling Stitch, ALWAYS transform vague requests into structured design specs:

| Vague | Enhanced |
|:---|:---|
| "menu at the top" | "sticky navigation bar with logo and list items" |
| "big photo" | "high-impact hero section with full-width imagery" |
| "list of things" | "responsive card grid with hover states and subtle elevations" |
| "button" | "primary call-to-action button with micro-interactions" |
| "form" | "clean form with labeled input fields, validation states, and submit button" |
| "sidebar" | "collapsible side navigation with icon-label pairings" |
| "popup" | "modal dialog with overlay and smooth entry animation" |

### Atmosphere descriptors

| Basic Vibe | Enhanced Description |
|:---|:---|
| "Modern" | "Clean, minimal, with generous whitespace and high-contrast typography" |
| "Professional" | "Sophisticated, trustworthy, utilizing subtle shadows and a restricted, premium palette" |
| "Fun / Playful" | "Vibrant, organic, with rounded corners, bold accent colors, and bouncy micro-animations" |
| "Dark Mode" | "Electric, high-contrast accents on deep slate or near-black backgrounds" |
| "Luxury" | "Elegant, spacious, with fine lines, serif headers, and focus on high-fidelity photography" |
| "Tech / Cyber" | "Futuristic, neon accents, glassmorphism effects, and monospaced typography" |

### Structured prompt format

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

### Step 2: Generate Design via SDK

Create a temp script and run it:

```bash
cat > /tmp/stitch-generate.mjs << 'EOF'
import { stitch } from "@google/stitch-sdk";

const project = stitch.project(process.env.STITCH_PROJECT_ID || (await stitch.projects())[0]?.id);
const screen = await project.generate(
  process.argv[2], // prompt
  process.argv[3] || "DESKTOP" // MOBILE | DESKTOP | TABLET | AGNOSTIC
);

const html = await screen.getHtml();
const image = await screen.getImage();
console.log(JSON.stringify({ screenId: screen.id, html, image }, null, 2));
EOF

node /tmp/stitch-generate.mjs "Your enhanced prompt here" DESKTOP
```

### Step 3: Download and Save

```bash
# Create designs directory
mkdir -p .stitch/designs

# Download HTML
curl -sL "$HTML_URL" -o .stitch/designs/screen-name.html

# Download screenshot
curl -sL "$IMAGE_URL" -o .stitch/designs/screen-name.png
```

### Step 4: Edit / Refine (prefer editing over regenerating)

```bash
cat > /tmp/stitch-edit.mjs << 'EOF'
import { stitch } from "@google/stitch-sdk";

const project = stitch.project(process.env.STITCH_PROJECT_ID);
const screen = await project.getScreen(process.argv[2]); // screenId
const edited = await screen.edit(process.argv[3]); // edit prompt
const html = await edited.getHtml();
const image = await edited.getImage();
console.log(JSON.stringify({ screenId: edited.id, html, image }, null, 2));
EOF

node /tmp/stitch-edit.mjs "SCREEN_ID" "Change the color scheme to dark mode"
```

### Step 5: Generate Variants

```bash
cat > /tmp/stitch-variants.mjs << 'EOF'
import { stitch } from "@google/stitch-sdk";

const project = stitch.project(process.env.STITCH_PROJECT_ID);
const screen = await project.getScreen(process.argv[2]);
const variants = await screen.variants(process.argv[3], { count: 3 });
for (const v of variants) {
  console.log(JSON.stringify({ id: v.id, html: await v.getHtml(), image: await v.getImage() }));
}
EOF

node /tmp/stitch-variants.mjs "SCREEN_ID" "Try different card layouts"
```

## CLI Commands (alternative to SDK)

```bash
# List projects
npx @_davideast/stitch-mcp tool list_projects

# Browse screens interactively
npx @_davideast/stitch-mcp screens -p <projectId>

# Get screen HTML
npx @_davideast/stitch-mcp tool get_screen_code

# Preview locally (Vite dev server)
npx @_davideast/stitch-mcp serve -p <projectId>

# Generate full Astro site from screens
npx @_davideast/stitch-mcp site -p <projectId>

# Check health
npx @_davideast/stitch-mcp doctor
```

## Project Management via SDK

```bash
cat > /tmp/stitch-projects.mjs << 'EOF'
import { stitch } from "@google/stitch-sdk";

// List all projects
const projects = await stitch.projects();
console.log(JSON.stringify(projects, null, 2));

// Create new project
// const p = await stitch.callTool("create_project", { title: "My App" });
EOF

node /tmp/stitch-projects.mjs
```

## Design System File (.stitch/DESIGN.md)

After generating screens, create a DESIGN.md to maintain consistency:

```markdown
# Design System

## Colors
- Primary: Ocean Blue (#2563EB) — CTAs, links, active states
- Secondary: Slate (#475569) — body text, secondary elements
- Background: Snow (#FAFAFA) — page canvas
- Surface: White (#FFFFFF) — cards, elevated containers
- Accent: Amber (#F59E0B) — highlights, badges, warnings

## Typography
- Headings: Inter, 700 weight, tight tracking
- Body: Inter, 400 weight, relaxed line-height
- Code: JetBrains Mono, 400 weight

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

## Export Formats

HTML/CSS (default), Tailwind CSS, React/JSX, Vue.js, Angular, Flutter, SwiftUI

## Device Types

| Type | Use for |
|------|---------|
| `MOBILE` | Phone screens (375px) |
| `DESKTOP` | Web pages (1280px+) |
| `TABLET` | Tablet layouts (768px) |
| `AGNOSTIC` | Responsive / component-level |

## Limits (Free Tier)

| Mode | Model | Generations/month |
|------|-------|--------------------|
| Standard | Gemini 2.5 Flash | 350 |
| Experimental | Gemini 2.5 Pro | 50 |

## Best Practices

- **Enhance prompts first** — never pass vague descriptions directly to Stitch
- **Edit, don't regenerate** — refine existing screens instead of starting over
- **Use hex colors** — Stitch works best with specific color values
- **Structure pages** — break into numbered sections (Header, Hero, Content, Footer)
- **Set the vibe** — explicitly mention mood/atmosphere for better results
- **Save DESIGN.md** — maintain consistency across multiple screens
- **One change at a time** — targeted edits produce better results than sweeping changes

## References

- Web UI: https://stitch.withgoogle.com
- CLI: https://github.com/davideast/stitch-mcp
- SDK: https://github.com/google-labs-code/stitch-sdk
- Official Skills: `npx skills add google-labs-code/stitch-skills --list`
