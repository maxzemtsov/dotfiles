---
name: psych-driven-ui
description: Design psychology-first UI/UX by orchestrating ux-psychology (106 cognitive biases), ui-ux-pro-max (visual systems — styles, palettes, typography, layout), 21st-dev + aceternity-ui (production-grade React components), and google-stitch (high-fidelity HTML/CSS + screenshot mockups) into ONE cohesive workflow where every visual decision has a behavioral rationale. Use this skill whenever the user asks to design ANY UI surface — landing page, dashboard, pricing page, onboarding flow, signup form, modal, mobile screen, marketing site, app feature, settings page, profile page, checkout, paywall, empty state — especially when there's a behavior goal mentioned (convert, retain, engage, build trust, increase signups, reduce churn, activate, improve completion). Trigger even when the user says only "design a [thing]", "mockup a [page]", "build a [feature]", "create a UI for X", "how should this look", "lay out a [surface]", "I need a [page]", "сделай дизайн", "спроектируй UI", "сверстай интерфейс", "нарисуй макет" — without explicitly naming psychology. Beauty-only design misses behavior outcomes; this skill enforces the psychology lens FIRST. Do NOT trigger for single-component requests (use /21st-dev directly), pure principle questions (use /ux-psychology directly), or mockup-only with no rationale (use /google-stitch directly).
---

# Psychology-Driven UI Design

This skill is an **orchestrator**, not a designer-by-itself. It coordinates five existing skills into one psychology-first workflow:

| Stage | Sub-skill | What it contributes |
|---|---|---|
| Psychology audit | `/ux-psychology` | 106 cognitive biases → pick 5-10 that apply, with concrete design implications |
| Visual system | `/ui-ux-pro-max` | Style direction, color palette, typography, layout — aligned to the psych choices |
| Production components | `/21st-dev` | shadcn/ui registry (buttons, cards, forms, navigation, tables) |
| Effect components | `/aceternity-ui` | Bento grids, focus cards, sparkles, infinite-moving-cards, aurora, tracing-beam, etc. |
| Mockup | `/google-stitch` | High-fidelity HTML/CSS + PNG screenshot from a text brief |

The thesis: **psychology before aesthetics**. Every visual decision must answer the question "what user behavior does this serve?" Beauty without behavior is decoration; this skill refuses to produce decoration.

## When the skill fires

Triggers on any request to design a UI surface. The trigger list in the YAML description is intentionally broad so Claude doesn't undertrigger. If the user mentions:
- A surface type (landing page, dashboard, pricing, onboarding, form, modal, etc.)
- A design verb (design, mockup, build, lay out, спроектируй, сверстай, сделай)
- A behavior goal (convert, retain, engage, signup, trust, etc.)

...then this skill applies, even when only one of those signals is present.

Do NOT fire when:
- Just one component is needed → use `/21st-dev` directly
- Just psychology principles asked → use `/ux-psychology` directly
- Just a mockup with no rationale needed → use `/google-stitch` directly
- Implementing an already-designed surface (code-level work) → use the relevant component skill directly

## The six-phase workflow

### Phase 1 — Intent capture (you ask the user, briefly)

Before invoking sub-skills, get the essentials. Aim for 3-5 answers, not 12. If the user's original message already covered most of these, skip to phase 2.

1. **Surface** — what UI? (landing / dashboard / pricing / onboarding / form / modal / mobile screen / settings / paywall / empty state / etc.)
2. **Goal** — what user behavior is the target? (signup, purchase, retention, learning, trust, activation, completion, etc.)
3. **Audience** — psychographic context (new user / power user / paying customer / churn risk / etc.)
4. **Brand / tone** — playful / formal / premium / casual / clinical / friendly / etc. Existing brand colors or font system if available.
5. **Tech stack** — React+Tailwind+shadcn / Next.js / SwiftUI / React Native / plain HTML+CSS — drives component skill selection.

Designers earn trust by shipping quality early, not by interviewing exhaustively. If 3-4 of these are answered, proceed.

### Phase 2 — Psychology audit (mandatory)

Invoke `/ux-psychology` with the surface + goal + audience as context. Get back a ranked list of 5-10 cognitive principles that apply to THIS specific situation.

The output format you want from this stage:

```
| # | Principle | Design implication |
|---|-----------|---------------------|
| 22 | Centre-Stage Effect | Pricing page → put recommended tier in middle column with subtle scale-up |
| 65 | Loss Aversion | Cancel flow → frame as "you'll lose [things they have]" not "you're saving $X" |
| 26 | Spark Effect | Hero CTA → keep first action under 3 fields, defer the rest to phase 2 |
| ... | ... | ... |
```

**Important constraints from this phase:**
- Pick 5-10 max, not all 106. Cognitive Load #4: less is more. Eat your own dog food.
- Each principle must produce a CONCRETE design implication (where + what + why), not a vague "make it friendly".
- Flag dark-pattern risks explicitly. Loss Aversion #65 / Scarcity #31 / Reactance #69 are weapons-grade — surface ethical tradeoffs.

### Phase 3 — Visual system planning

Invoke `/ui-ux-pro-max` with the phase 2 psychology list as INPUT. Specifically ask it to:

1. **Pick a style direction** that *amplifies* the chosen biases. Examples:
   - Minimalism → amplifies Hick's Law #1 (fewer choices) and Cognitive Load #4
   - Bento grid → amplifies Chunking #95 (grouped info) and Law of Proximity #24
   - Brutalism → amplifies Von Restorff Effect #12 (stands out)
   - Glassmorphism → amplifies Aesthetic-Usability Effect #29 (premium feel)
   - Skeuomorphism → amplifies Familiarity Bias #34 and Mental Model #33

2. **Choose a 4-6 color palette** anchored to emotional outcomes for the goal:
   - Trust → navy blues, muted greens
   - Urgency → orange, warm reds (use sparingly per Banner Blindness #16)
   - Premium → muted neutrals + one accent
   - Playful → saturated complementary pairs
   - Clinical → high-contrast greys + functional accents

3. **Pick a font pairing** aligned with the tone. Avoid generic Inter/Roboto/Poppins unless tone explicitly demands it.

4. **Plan layout grid + visual hierarchy** — where Centre-Stage #22 anchors are, where Visual Anchors #11 guide, where Banner Blindness #16 is a risk.

### Phase 4 — Component sourcing (parallel)

Invoke `/21st-dev` and `/aceternity-ui` IN PARALLEL — they're independent. Pass each the visual system from phase 3 + the element list.

- **`/21st-dev`** for production-grade structural components: buttons, cards, forms, tables, navigation, dropdowns, dialogs, sheets, popovers. Get install commands + file paths.
- **`/aceternity-ui`** for effect/animation components where psychology calls for them:
  - `bento-grid` for Chunking #95 + Law of Proximity #24
  - `focus-cards` for Centre-Stage #22 + Attentional Bias #9
  - `sparkles` / `aurora-background` for Delighters #99
  - `infinite-moving-cards` for Social Proof #30
  - `tracing-beam` for Goal Gradient Effect #51 (scrollytelling progress)
  - `3d-card-effect` for Endowment Effect #94 (tactile sense of ownership)
  - `floating-dock` for Recognition Over Recall #101 + Fitts's Law #8

Output: a component manifest. Each row: design slot → component name → source → which principle it serves.

### Phase 5 — Mockup generation (optional but recommended)

If the user wants visual confirmation BEFORE writing code, invoke `/google-stitch` with a prompt synthesized from phases 2-4:
- Style + palette + typography from phase 3
- Element list from phase 3
- Component types from phase 4
- Annotated copy from phase 2 (where the psych principles dictate microcopy)

Output: HTML/CSS file + PNG screenshot saved to `.stitch/designs/<surface-name>.{html,png}`.

Skip phase 5 when:
- User explicitly says "no mockup, just plan"
- Iteration speed matters more than visual confirmation
- User has a working Figma / existing design and only wants the psychology + component layer

### Phase 6 — Synthesis deliverable

Produce ONE final document combining all phases. Use this exact template:

```markdown
# [Surface name] — Psychology-First Design

## Goal
[One sentence — what user behavior is the target]

## Psychology Stack (Phase 2)
| # | Principle | Design implication |
|---|-----------|---------------------|
| 22 | Centre-Stage | [concrete where + what] |
| 88 | IKEA Effect | [concrete where + what] |
| ... | ... | ... |

## Visual System (Phase 3)
- **Style:** [direction] — rationale: [which principle it amplifies]
- **Palette:** `#hex1` `#hex2` `#hex3` `#hex4` `#hex5` — emotional rationale per color
- **Typography:** [Heading font] / [Body font] — tone rationale
- **Layout:** [grid description, hierarchy notes]

## Component Manifest (Phase 4)
| Slot | Component | Install | Principle |
|------|-----------|---------|-----------|
| Hero CTA | shadcn Button | `npx shadcn@latest add button` | Spark Effect #26 |
| Pricing tier | aceternity 3d-card-effect | `npx shadcn@latest add "https://21st.dev/r/aceternity/3d-card-effect"` | Centre-Stage #22 |
| Social proof strip | aceternity infinite-moving-cards | `npx shadcn@latest add "https://21st.dev/r/aceternity/infinite-moving-cards"` | Social Proof #30 |
| ... | ... | ... | ... |

## Mockup (Phase 5)
[Link to .stitch/designs/<surface-name>.png; embed inline if rendering supports]

## Implementation TODO
- [ ] Run shadcn install commands (above table)
- [ ] Wire copy reflecting each principle's design implication (Phase 2)
- [ ] Verify accessibility (WCAG 2.1 AA: 4.5:1 contrast, semantic HTML, ARIA labels)
- [ ] A/B test against the goal where possible
- [ ] Re-audit for dark patterns before shipping (Loss Aversion / Scarcity / Reactance)

## Ethics check
[List any dark-pattern risks flagged in phase 2 + how the design addresses them]
```

Save the deliverable to `<project>/design/<surface-name>.md` if a project root exists, otherwise print inline. Always offer to save before just dumping into the chat — long markdown gets lost.

## How to invoke sub-skills

You're orchestrating, not implementing. Call sub-skills via the Skill tool:

```
Skill(skill: "ux-psychology", args: "Designing a [surface] for [audience] to [goal]. Tone is [tone]. Pick the 5-10 most relevant principles with concrete design implications. Flag any dark-pattern risks.")
```

```
Skill(skill: "ui-ux-pro-max", args: "plan visual system for [surface]. Stack: [tech]. Style must amplify these psychology principles: [list from phase 2]. Tone: [tone]. Pick style direction, 4-6 color palette with emotional rationale, font pairing, layout grid.")
```

```
Skill(skill: "21st-dev", args: "Need shadcn-style production components for [element list]. Project uses [Tailwind / shadcn style]. List install commands and file paths.")
```

```
Skill(skill: "aceternity-ui", args: "Need effect/animation components for these psych anchors: [list]. Suggest specific Aceternity components and install commands.")
```

```
Skill(skill: "google-stitch", args: "[detailed text description of the surface, including style direction, palette hex codes, element list, copy annotations]. Save to .stitch/designs/<surface-name>.{html,png}.")
```

Pass enough context so each sub-skill can do its job without re-asking. Your job is to weave their outputs into one coherent deliverable.

### Parallel vs sequential

Phases 2 → 3 → 4 → 5 are SEQUENTIAL — each output informs the next.

WITHIN phase 4, `/21st-dev` and `/aceternity-ui` run in PARALLEL (independent registries). Send both calls in the same Skill-tool turn if the harness supports it; otherwise back-to-back.

## Anti-patterns

DON'T skip phase 2 ("let's just design first, add psychology later"). Psychology after-the-fact is rationalization, not design. The whole point of this skill is to refuse that order.

DON'T pick visual style without psych justification. "It looks cool" is not a reason. "Bento amplifies Chunking #95 because the user is parsing 12 distinct trait scores and grouped containers reduce cognitive load" IS a reason.

DON'T use all 106 principles. Pick 5-10 most relevant. Hick's Law #1 says more options = harder decisions; if YOU list 30 principles, you've broken your own audit.

DON'T ship without ethics check. Loss Aversion #65 and Scarcity #31 are easy to weaponize ("don't lose your spot!", "only 2 left!"). Flag and discuss tradeoffs explicitly.

DON'T hide the "why" from the user. The final deliverable should make every design decision traceable back to a principle. Future engineers shouldn't have to reverse-engineer your reasoning.

DON'T ask 12 clarifying questions before starting. Get 3-4 essentials, draft phase 1-3, present, iterate. Designers earn trust by SHIPPING quality early, not by exhaustive interviewing.

## Tone for talking to the user

Be opinionated. The user invoked this skill because they want a confident designer who has a point of view grounded in evidence (psychology), not a sycophant who asks "what do you think?" at every step.

When phase 2 surfaces a non-obvious principle (e.g., "your onboarding should leverage IKEA Effect #88 by letting users customize ONE small thing in the first 60 seconds"), explain WHY in one sentence. The user learns the framework while getting their design.

When ethics tradeoffs come up (Loss Aversion vs. Honesty), present both sides plainly. Let the user decide; don't unilaterally rule out powerful principles, but also don't unilaterally apply them.

## Output deliverable: one file, not five fragments

Critical: the user should not get five separate sub-skill outputs glued together. They should get ONE design document that reads like a single designer wrote it, with phase outputs woven into the sections of the template above.

If a sub-skill returns lots of supplementary detail (e.g., `/ui-ux-pro-max` returns a 20-bullet style guide), distill it to what fits in the deliverable. Reference files for the user's later reading is fine; bloat in the main deliverable is not.
