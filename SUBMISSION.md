# UI/UX Design Project — Submission

## Prototype Links

| Version | URL |
|---------|-----|
| **v1** | https://gelato-museum.vercel.app/v1 |
| **v2** | https://gelato-museum.vercel.app/v2 |

---

## AI Usage

| Tool | How it was used |
|------|----------------|
| **Claude Code** (claude-sonnet-4-6) | Primary prototyping tool — built all screens, components, routing, styling, and interactions from scratch |
| **OpenAI gpt-4o-mini** | Powers the AI Flavor Finder feature in v2 — accepts a natural-language craving description and returns ranked recipe recommendations with confidence scores and explanations |

All recipe photos were real images provided by the user (not AI-generated). All interface components (typography, layout, buttons, inputs, cards, forms) were structurally constructed in code — no flat generated images.

---

## The Problem

**Who is this for?**
Gelato enthusiasts — people who love Italian gelato but often default to the same 2–3 flavors they already know. They want to discover new flavors but lack the vocabulary or context to explore.

**What needs are we solving?**
1. Discovery — "I don't know where to start" → Browse by tags, difficulty, or search
2. Curation — "Which flavor is right for my mood?" → AI Flavor Finder
3. Context — "Why is this flavor special?" → Origins map + recipe provenance
4. Trust — "Is this actually good?" → Community ratings and reviews

---

## Core User Workflow

1. Land on **Home** → see featured gelato cards, search bar, and category chips
2. Use **Browse** to filter by tag (e.g., vegan, fruity, classic) or sort by difficulty/time
3. Or use **Search** to find a specific flavor by name or ingredient
4. Or use **AI Finder** — type a craving ("something creamy and nutty"), get 3 AI-matched recommendations with reasons and confidence bars
5. Tap a recipe card → **Recipe Detail** — view image, full ingredients, step-by-step method, rate and favorite
6. Go to **Reviews** — read community reviews, submit your own with a star rating and text
7. Visit **Origins** (v2) — explore an interactive Italy map showing where each gelato was born
8. Visit **Chef** (v2) — meet Chef François, read his biography, credentials, and philosophy

---

## Iteration: v1 → v2

### What changed and why

| Area | v1 | v2 | Reason for change |
|------|----|----|-------------------|
| **AI Finder** | Rule-based keyword matching only, runs client-side | OpenAI gpt-4o-mini server-side, with rule-based fallback | v1 felt mechanical — results lacked natural language reasoning and confidence context |
| **AI results** | Plain list, no source transparency | Confidence bar per result, "✨ AI-powered" / "Rule-based" badge, search history | Users couldn't tell how confident the system was or whether AI was actually running |
| **Origins** | Not present | Full interactive Italy map with floating recipe origin cards + editorial strip | Added storytelling layer — gelato is inseparable from its geography |
| **Chef page** | Not present | Portrait, credential chips, biography, quote, CTAs to Origins and AI Finder | Added curator identity — gives the collection a human voice and authority |
| **Navigation** | Home, Browse, AI Finder | Home, Browse, **Origins**, **Chef**, AI Finder | Added entry points for the two new screens |
| **Card density** | Heavier shadows, larger cards | Lighter shadows, compact cards, `backdrop-blur-sm`, semi-transparent white | Visual weight reduced for a more editorial, museum-like feel |
| **Color palette** | Bright saturated mint (`#5eead4`) | Muted sage green (`#BBDAC7`) with deep teal hover | Softer palette aligns better with the vintage/museum aesthetic |

---

## Evaluation Criteria — How the Project Addresses Each

### Prioritization of User Needs
The core loop (discover → explore → learn → review) is front and center. We said no to authentication, social features, purchasing, and complex onboarding. Every screen serves one of the four identified needs.

### UX Workflows to Achieve User Goals
All primary flows are fully interactive end-to-end:
- Search → results → recipe detail
- Browse (filter/sort) → recipe detail → reviews
- AI Finder → enter prompt → ranked results → recipe detail
- Origins map → hover card → "View Recipe →" → recipe detail
Every screen has navigation back to the main flow via the persistent Navbar.

### Iteration
v2 introduced the Origins map (new screen), upgraded the AI Finder from rule-based to real OpenAI, added confidence bars and source transparency, reduced visual weight on cards, and improved pin spacing on the map.

### Onboarding
The Home page acts as implicit onboarding — hero text, category chips, and a search bar teach the mental model without an explicit tutorial. The AI Finder shows suggestion chips ("Try: something creamy and nutty") so users immediately understand the interaction paradigm.

### Accessibility
- Consistent color contrast: ink `#2c2c2c` on cream `#FAF7F0` and white
- Mint accent `#0d9488` / `#4DB6AC` used only for decorative labels, never as the sole carrier of critical information
- All images use `alt` text
- All interactive elements are keyboard-accessible links or `<button>` elements
- `aria-hidden="true"` on purely decorative background layers (Origins watercolor)
- `role="img"` + `aria-label` on the ItalyMap SVG

### Retention
- **Favorites** — heart toggle on every recipe, persisted in localStorage
- **Star ratings** — users can rate recipes, scores persist across sessions
- **Reviews** — users see community reviews and can contribute their own
- **AI search history** — past AI Finder queries are saved and shown as one-click replay buttons
- **Origins map** — editorial, museum-quality content gives a reason to return beyond pure utility

### Design Patterns
- Persistent sticky Navbar with active-state highlighting on every page
- Consistent `museum-card` component used across Browse, Search, and AI Finder results
- Uniform `TagChip` component for all flavor tags
- `museum-btn-primary` / `museum-btn-outline` button hierarchy used throughout
- Forms (Review, Search, AI Finder) all follow the same input + submit pattern

### Design Principles
- **Hierarchy**: Playfair Display serif for headings, Lato for body — clear typographic scale
- **Color**: Mint-green as the single accent color, cream/warm-white backgrounds, dark ink for text — no competing hues
- **Layout**: Max-width containers (`max-w-6xl`) with generous padding; cards breathe with consistent gap spacing
- **Focus direction**: On every page, the primary CTA is visually dominant (size, color, placement)

### Application Principles
- Navigation is always visible and always contextual (active link highlighted, v1/v2 switcher always present)
- Forms are minimal: label → input → submit, no unnecessary fields
- Error states are handled (AI Finder: 429 rate limit, parse failure, no results)
- Loading states are explicit ("Thinking…" button, spinning gelato icon)
- Every page has an escape path — no dead ends

---

## Aspirational Items Achieved

| Item | Status |
|------|--------|
| **Motion / microinteractions** | ✓ Card hover lift, pin dot scale, button active states, tag chip transitions |
| **Responsive layout** | ✓ All screens mobile-responsive; Origins map collapses to stacked list on mobile |
| **Data persistence** | ✓ localStorage for favorites, ratings, reviews, and AI history — state survives page refresh |
| Dark Mode | — Not implemented |
| Authentication | — Not implemented (out of scope) |
