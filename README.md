# 🍦 Gelato Museum

A curated collection of authentic Italian gelato recipes — beautifully presented with a soft vintage watercolor aesthetic.

**Live:** [gelato-museum.vercel.app/v2](https://gelato-museum.vercel.app/v2)

---

## Features

- **12 authentic gelato recipes** from pistachio di Bronte to limone sorbetto
- **Origins map** — interactive Italy SVG with floating recipe cards pinned to their home regions
- **AI Flavor Finder** — describe your cravings, get matched recipes (OpenAI gpt-4o-mini, rule-based fallback)
- **Review & Rating system** — persisted via localStorage
- **Favorites** — save your preferred recipes
- **Filter & Sort** — by tags, difficulty, and time
- **Search** — full-text search across names, descriptions, tags, and ingredients
- **v1 / v2** — frozen v1 baseline + actively iterated v2, switchable via Navbar pill

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Fonts** — Playfair Display (serif) + Lato (sans-serif)
- **OpenAI gpt-4o-mini** — powers the v2 AI Flavor Finder (falls back to rule-based if key is absent)
- **localStorage** for reviews, ratings, and favorites (no backend needed)

---

## Routes

### v2 (current iteration)

| Route | Description |
|-------|-------------|
| `/v2` | Home — hero, featured cards, search |
| `/v2/browse` | Filter panel, sort dropdown, recipe grid |
| `/v2/search?q=mint` | Full-text search results |
| `/v2/origins` | Interactive Italy map with floating origin cards |
| `/v2/recipe/[id]` | Recipe detail — image, ingredients, steps, rating, favorite |
| `/v2/recipe/[id]/reviews` | Review form + list of reviews |
| `/v2/ai-finder` | AI Flavor Finder — describe cravings, get 3 matched recommendations |

### v1 (frozen baseline)

Same routes under `/v1/` prefix — kept intact for comparison.

### Recipe IDs

```
pistachio-di-bronte  stracciatella       cioccolato-fondente
tiramisu             fior-di-latte       fragola
limone               nocciola            amarena
caffe-espresso       menta               melone
```

---

## AI Flavor Finder — OpenAI Setup

The v2 AI Finder (`/v2/ai-finder`) calls OpenAI server-side via `/api/ai-finder`.
It **automatically falls back** to a rule-based matcher if no API key is configured.

### Local development

Add your key to `.env.local` (never committed — covered by `.gitignore`):

```bash
# .env.local
OPENAI_API_KEY=sk-proj-...
```

### Vercel (production)

1. Go to your project on [vercel.com](https://vercel.com)
2. **Settings → Environment Variables**
3. Add `OPENAI_API_KEY` → your OpenAI key → Environment: Production
4. Redeploy — the next build will pick it up automatically.

> **Security:** The key is read only in `src/app/api/ai-finder/route.ts` (server-side). It is never sent to the browser or included in client bundles.

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
cd GelatoMuseum
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build   # Production build
npm start       # Start production server (after build)
npm run lint    # ESLint
```

---

## Project Structure

```
GelatoMuseum/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts + globals, no Navbar)
│   │   ├── page.tsx                # Redirects / → /v2
│   │   ├── globals.css             # Design tokens + Tailwind base
│   │   ├── api/ai-finder/
│   │   │   └── route.ts            # Server-side OpenAI endpoint (with fallback)
│   │   ├── v1/                     # Frozen v1 routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── browse/
│   │   │   ├── search/
│   │   │   ├── recipe/[id]/
│   │   │   └── ai-finder/
│   │   └── v2/                     # Active iteration
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── browse/
│   │       ├── search/
│   │       ├── origins/            # Italy map + floating origin cards
│   │       ├── recipe/[id]/
│   │       └── ai-finder/
│   ├── components/
│   │   ├── Navbar.tsx              # Version-aware navbar (V1/V2 switcher pill)
│   │   ├── Footer.tsx
│   │   ├── v1/                     # Isolated v1 components
│   │   └── v2/                     # Isolated v2 components
│   │       ├── ItalyMap.tsx        # Inline SVG React component (144 paths)
│   │       ├── OriginCard.tsx      # Floating map pin cards
│   │       ├── RecipeCard.tsx
│   │       ├── TagChip.tsx
│   │       └── ...
│   ├── data/
│   │   └── recipes.ts              # 12 recipes + search/filter utils
│   └── lib/
│       ├── localStorage.ts         # Favorites, ratings, reviews, AI history
│       └── aiFinder.ts             # Rule-based flavor matcher (fallback)
├── public/
│   ├── gelato/                     # 12 recipe images (PNG, ~1.7MB each)
│   └── map/
│       └── italy-watercolor-bg.png # Watercolor hero background
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Deploying to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Push to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import repo.
3. Vercel auto-detects Next.js — click **Deploy**.
