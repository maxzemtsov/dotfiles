# Information Biases — How Users Filter What They See

Users filter out a lot of the information that they receive, even when it could be important. These 29 principles govern how users perceive, process, and selectively attend to information in your product.

## 1. Hick's Law
**More options leads to harder decisions.**

The time to make a decision increases logarithmically with the number of choices. Every additional option adds cognitive overhead.

**Apply when:** Designing menus, settings pages, pricing tiers, navigation, feature selection, search filters.

**Design tips:**
- Limit choices to 3-5 options where possible
- Use progressive disclosure to reveal options in stages
- Group related options into categories
- Highlight a recommended/default option
- Remove options that fewer than 5% of users choose

**Example:** Instead of showing 12 plan features side-by-side, show 3 plans with a "Compare all features" expandable section.

---

## 2. Confirmation Bias
**People look for evidence that confirms what they think.**

Users selectively notice information that reinforces their existing beliefs and ignore contradictory evidence.

**Apply when:** Writing product descriptions, designing search results, creating onboarding surveys, presenting analytics.

**Design tips:**
- Present balanced information early before users form opinions
- Use progressive onboarding questions to understand users' mental models
- Design A/B tests that challenge internal assumptions
- Show diverse testimonials and use cases

---

## 3. Priming
**Previous stimuli influence users' decisions.**

What users see, read, or experience immediately before a decision point subconsciously influences that decision.

**Apply when:** Designing pre-purchase flows, crafting landing page narratives, ordering feature presentations, building wizard flows.

**Design tips:**
- Show success stories before asking users to sign up
- Prime with positive emotions before asking for reviews
- Use appropriate imagery that sets the right context
- Order screens so each primes the user for the next decision

**Example:** Show a customer testimonial video right before the pricing page.

---

## 4. Cognitive Load
**Total mental effort required to complete a task.**

Working memory is limited. When tasks demand too much cognitive effort, users make errors, abandon tasks, or feel frustrated.

**Apply when:** Any complex interaction — forms, dashboards, multi-step processes, data-heavy screens.

**Design tips:**
- Break complex tasks into smaller steps
- Remove unnecessary fields and options
- Use sensible defaults to reduce decisions
- Show progress indicators for multi-step flows
- Offload information to the interface (labels, tooltips, inline validation)
- Use whitespace generously — visual clutter = cognitive clutter

---

## 5. Anchoring Bias
**Users rely heavily on the first piece of information they see.**

The first number, price, or piece of data becomes the reference point for all subsequent judgments.

**Apply when:** Pricing pages, discount displays, feature comparisons, progress indicators, negotiation flows.

**Design tips:**
- Show the most expensive plan first (left to right or top to bottom)
- Display original price crossed out next to sale price
- Show "was $99, now $49" rather than just "$49"
- Present the ideal plan first, then alternatives
- In analytics, show the most impactful metric first

---

## 6. Nudge
**Subtle hints can affect users' decisions.**

Small environmental cues can significantly influence behavior without restricting choice.

**Apply when:** Default selections, button styling, placeholder text, empty states, feature adoption prompts.

**Design tips:**
- Pre-select the recommended option
- Use larger/colored CTAs for desired actions
- Add subtle directional cues (arrows, eye-line in images)
- Frame choices in terms of what users gain, not what they pay
- Use social proof nudges ("1,247 people chose this today")

---

## 7. Progressive Disclosure
**Users are less overwhelmed if exposed to complex features later.**

Show only what's necessary at each step. Reveal complexity gradually as the user needs it.

**Apply when:** Settings pages, feature-rich applications, onboarding, complex forms, documentation.

**Design tips:**
- Start with the most common 20% of features
- Use "Advanced options" expandable sections
- Implement tiered settings (basic/advanced/expert)
- Reveal tooltip help on hover, not by default
- Design empty states that teach one feature at a time

---

## 8. Fitts's Law
**Large and close elements are easier to interact with.**

The time to reach a target is a function of distance to and size of the target. Critical actions need large, accessible tap/click targets.

**Apply when:** Button sizing, touch targets, navigation placement, CTA positioning, mobile design.

**Design tips:**
- Make primary CTAs at least 44x44px (mobile) or 32x32px (desktop)
- Place frequently used actions in thumb-reach zones on mobile
- Keep destructive and confirm buttons far apart
- Use full-width buttons on mobile for important actions
- Position key actions near the user's current focus area

---

## 9. Attentional Bias
**Users' thoughts filter what they pay attention to.**

People notice things related to what's already on their mind and filter out the rest.

**Apply when:** Context-aware content, personalization, targeted messaging, search results.

**Design tips:**
- Surface contextually relevant features based on user behavior
- Time notifications to when users are thinking about related topics
- Customize empty states based on user's current task
- Use language that matches the user's current mindset

---

## 10. Empathy Gap
**People underestimate how much emotions influence user behaviors.**

Users in a calm state can't predict how they'll behave when frustrated, excited, or stressed. Design for emotional states.

**Apply when:** Error states, loading screens, payment flows, cancellation flows, support touchpoints.

**Design tips:**
- Design for the frustrated user, not just the happy path
- Add empathetic microcopy in error states ("We know this is frustrating")
- Don't ask for important decisions during high-stress moments
- Provide cooling-off periods before irreversible actions
- Test your product when you're tired/frustrated — that's closer to real usage

---

## 11. Visual Anchors
**Elements used to guide users' eyes.**

Strategic visual elements direct attention through the interface in the intended order.

**Apply when:** Landing pages, dashboards, onboarding flows, key conversion screens.

**Design tips:**
- Use images of people looking toward the CTA
- Create visual paths with color, size, and contrast
- Place anchor elements at natural scanning entry points (top-left for LTR)
- Use directional arrows or lines sparingly but effectively

---

## 12. Von Restorff Effect (Isolation Effect)
**People notice items that stand out more.**

When multiple similar objects are present, the one that differs from the rest is most likely to be remembered.

**Apply when:** Highlighting recommended plans, emphasizing new features, drawing attention to important actions.

**Design tips:**
- Make the recommended pricing tier visually distinct (color, size, badge)
- Use a different color for the primary CTA among secondary actions
- Add "NEW" or "POPULAR" badges to stand-out items
- Break visual patterns strategically to draw attention

---

## 13. Visual Hierarchy
**The order in which people perceive what they see.**

Users scan interfaces in predictable patterns. Size, color, contrast, and position determine what gets noticed first.

**Apply when:** Every screen. This is a foundational principle.

**Design tips:**
- Make the most important element the largest
- Use high contrast for primary content, lower for secondary
- Follow F-pattern (content pages) or Z-pattern (landing pages) layouts
- Limit the number of visual priority levels to 3-4
- Use typography scale consistently (headings > subheadings > body > caption)

---

## 14. Selective Attention
**People filter out things from their environment when in focus.**

When users are focused on a task, they literally don't see unrelated elements — even obvious ones.

**Apply when:** In-context help, feature discovery, notification design, cross-selling.

**Design tips:**
- Don't rely on sidebar promotions reaching focused users
- Use inline contextual tips instead of global announcements
- Time feature discovery prompts to natural pauses, not mid-task
- Make critical alerts interrupt the current flow (modals, not banners)

---

## 15. Survivorship Bias
**People neglect things that don't make it past a selection process.**

Teams often study successful users and ignore those who churned, leading to flawed product decisions.

**Apply when:** User research, feature prioritization, analytics interpretation, success metrics.

**Design tips:**
- Study churned users as much as retained ones
- Track where users drop off, not just where they convert
- Don't assume power users represent all users
- Include failed search queries in search analytics

---

## 16. Banner Blindness
**Users tune out stuff they get repeatedly exposed to.**

Users learn to ignore anything that looks like an ad or a repeated notification.

**Apply when:** Promotions, feature announcements, upgrade prompts, notification design.

**Design tips:**
- Don't place important content in ad-like positions or formats
- Vary the visual format of recurring messages
- Embed key information in the content flow, not in banners
- Use inline content promotion over top/side banners
- Limit notification frequency — repetition breeds blindness

---

## 17. Juxtaposition
**Elements close and similar are perceived as a single unit.**

Proximity and similarity cause the brain to group elements automatically.

**Apply when:** Card layouts, form grouping, feature comparisons, navigation design.

**Design tips:**
- Group related controls and information visually
- Use consistent spacing within groups, larger spacing between groups
- Ensure compared items are visually parallel
- Place labels adjacent to their controls, not far away

---

## 18. Signifiers
**Elements that communicate what they will do.**

Signifiers tell users what actions are possible and how to perform them.

**Apply when:** Buttons, interactive elements, affordances, touch targets, gestures.

**Design tips:**
- Make clickable elements look clickable (contrast, cursor changes, hover states)
- Use conventional icons with text labels for critical actions
- Add hover states that preview the action's outcome
- Avoid "mystery meat" navigation — every interactive element should signal its purpose

---

## 19. Contrast
**Users' attention is drawn to higher visual weights.**

Elements with higher contrast naturally attract more attention.

**Apply when:** CTAs, warnings, data visualization, content hierarchy.

**Design tips:**
- Primary CTA: high contrast. Secondary: lower contrast
- Use color contrast to differentiate states (active/inactive, success/error)
- Maintain WCAG contrast ratios for accessibility (4.5:1 for text)
- Use contrast sparingly — when everything is bold, nothing is

---

## 20. External Trigger
**When the information on what to do next is within the prompt itself.**

External triggers tell users what action to take next through explicit cues in the environment.

**Apply when:** Push notifications, email campaigns, in-app messages, CTAs, tooltips.

**Design tips:**
- Include a clear, single action in every trigger
- Make triggers contextually relevant to the user's current state
- Pair the trigger with motivation (why should they act?)
- Reduce friction between the trigger and the action (deep links, pre-filled forms)

---

## 21. Decoy Effect
**Create a new option that's easy to discard.**

Adding an asymmetrically dominated option makes another option look more attractive.

**Apply when:** Pricing tiers, plan comparisons, subscription options.

**Design tips:**
- Add a "decoy" plan that makes the target plan look like the best deal
- The decoy should be close in price but clearly inferior to the target option
- Use ethically — the target option should genuinely serve the user well

---

## 22. Centre-Stage Effect
**People tend to choose the middle option in a set of items.**

When presented with a horizontal row of options, people gravitate toward the center.

**Apply when:** Pricing pages, product comparisons, plan selection, gallery displays.

**Design tips:**
- Place the recommended plan in the center position
- Use odd numbers of options (3 or 5) to create a clear center
- Combine with visual emphasis for strongest effect

---

## 23. Framing
**The way information is presented affects how users make decisions.**

The same information can drive different decisions depending on whether it's framed positively or negatively.

**Apply when:** Feature descriptions, pricing display, error messages, product positioning.

**Design tips:**
- Frame benefits as gains: "Save 2 hours/week" vs "Reduce wasted time"
- For risk-averse decisions, frame as loss prevention: "Don't lose your progress"
- Show "95% uptime" not "5% downtime"
- Frame pricing per day when annual: "$2.70/day" instead of "$999/year"

---

## 24. Law of Proximity
**Elements close to each other are usually considered related.**

Spatial proximity creates implicit grouping in users' minds.

**Apply when:** Form layout, button placement, label-input relationships, dashboard widgets.

**Design tips:**
- Place labels closer to their fields than to adjacent fields
- Group related form fields with visible or spatial boundaries
- Position error messages directly next to the relevant input
- Keep actions near the content they affect

---

## 25. Tesler's Law (Law of Conservation of Complexity)
**If you simplify too much, you'll transfer complexity to the users.**

Every process has inherent complexity that cannot be eliminated — only moved between system and user.

**Apply when:** Simplification projects, wizard flows, automation features, API design.

**Design tips:**
- Absorb complexity in the backend rather than pushing it to the UI
- Smart defaults handle complexity for 80% of users
- For power users, reveal complexity through progressive disclosure
- Don't over-simplify to the point where users lose control

---

## 26. Spark Effect
**Users are more likely to take action when the effort is small.**

Low-friction entry points dramatically increase the likelihood of engagement.

**Apply when:** Sign-up flows, first-time user actions, feature adoption, upgrade prompts.

**Design tips:**
- Minimize steps to first value (time-to-first-Aha!)
- Offer one-click actions where possible
- Pre-fill forms with available data
- Start with small asks, escalate later (foot-in-the-door technique)

---

## 27. Feedback Loop
**When users take action, feedback communicates what happened.**

Immediate, clear feedback confirms actions and guides next steps.

**Apply when:** Form submissions, button clicks, state changes, loading states, async operations.

**Design tips:**
- Provide instant visual feedback for every user action (< 100ms)
- Use micro-animations for state transitions
- Show progress for operations longer than 1 second
- Confirm destructive actions before executing
- Make success and error states visually distinct

---

## 28. Expectations Bias
**People tend to be influenced by their own expectations.**

Prior experiences and branding shape how users perceive your product's quality and usability.

**Apply when:** Brand design, onboarding messaging, beta/launch communications.

**Design tips:**
- Set accurate expectations in marketing — overpromise leads to disappointment
- Match the quality of your UI to the quality you claim
- Use testimonials and previews to set positive but realistic expectations
- Frame limitations honestly rather than hiding them

---

## 29. Aesthetic-Usability Effect
**People perceive designs with great aesthetics as easier to use.**

Beautiful interfaces are perceived as more usable, even when objectively they're not. Aesthetics create positive emotional responses that increase tolerance for usability issues.

**Apply when:** Visual design decisions, MVP design, redesign prioritization.

**Design tips:**
- Invest in visual polish — it's not vanity, it's perceived usability
- Consistent visual design creates a feeling of reliability
- Beautiful error states are more forgiving than ugly ones
- But never sacrifice actual usability for aesthetics — the effect has limits
