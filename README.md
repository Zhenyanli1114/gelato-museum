# 🍦 Gelato Museum

A curated collection of authentic Italian gelato recipes — beautifully presented with a soft vintage watercolor aesthetic.

## Features

- **12 authentic gelato recipes** from pistachio di Bronte to limone sorbetto
- **AI Flavor Finder** — describe your cravings, get matched recipes
- **Review & Rating system** — persisted via localStorage
- **Favorites** — save your preferred recipes
- **Filter & Sort** — by tags, difficulty, and time
- **Search** — full-text search across names, descriptions, tags, and ingredients
- Soft mint-green watercolor aesthetic with paper-texture background

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Fonts** — Playfair Display (serif) + Lato (sans-serif)
- **OpenAI gpt-4o-mini** — powers the v2 AI Flavor Finder (falls back to rule-based if key is absent)
- **localStorage** for reviews, ratings, and favorites (no backend needed)

---

## AI Flavor Finder — OpenAI Setup

The v2 AI Finder (`/v2/ai-finder`) calls OpenAI server-side via `/api/ai-finder`.
It **automatically falls back** to the rule-based matcher if no API key is configured.

### Local development

Add your key to `.env.local` (never committed — covered by `.gitignore`):

```bash
# .env.local
OPENAI_API_KEY=sk-proj-...
```

### Vercel (production)

1. Go to your project on [vercel.com](https://vercel.com)
2. **Settings → Environment Variables**
3. Add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** your OpenAI key
   - **Environment:** Production (and Preview if you want)
4. Redeploy — the next build will pick it up automatically.

> **Security:** The key is read only in `src/app/api/ai-finder/route.ts` (server-side). It is never sent to the browser or included in client bundles.

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone or open the project directory
cd GelatoMuseum

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
# Build for production
npm run build

# Start production server (after build)
npm start

# Run ESLint
npm run lint
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home / Gallery — logo, search, category chips, featured gelato cards |
| `/browse` | Filter panel, sort dropdown, grid/list of all recipes |
| `/search?q=mint` | Search results for a query (try `mint`, `chocolate`, `vegan`) |
| `/recipe/[id]` | Recipe detail — image, ingredients, steps, rating, favorite |
| `/recipe/[id]/reviews` | Review form + list of reviews (persisted in localStorage) |
| `/ai-finder` | AI Flavor Finder — enter cravings, get 3 matched recommendations |

### Recipe IDs

```
pistachio-di-bronte  stracciatella       cioccolato-fondente
tiramisu             fior-di-latte       fragola
limone               nocciola            amarena
caffe-espresso       menta               melone
```

Example: `/recipe/menta` or `/recipe/menta/reviews`

---

## Adding Real Images

Replace the SVG placeholder files in `public/gelato/` with real photos:

```
public/gelato/
├── pistachio-di-bronte.jpg   (or .png, .webp)
├── stracciatella.jpg
├── cioccolato-fondente.jpg
├── tiramisu.jpg
├── fior-di-latte.jpg
├── fragola.jpg
├── limone.jpg
├── nocciola.jpg
├── amarena.jpg
├── caffe-espresso.jpg
├── menta.jpg
└── melone.jpg
```

Then update the `imagePath` field in `src/data/recipes.ts` from `.svg` to your new extension.

---

## Deploying to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will auto-detect Next.js and configure the build.

### Option 2: GitHub + Vercel Dashboard

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel will auto-detect Next.js — click **Deploy**.

No environment variables are required (all data is local/static).

---

## Project Structure

```
GelatoMuseum/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Global layout (Navbar + Footer)
│   │   ├── globals.css         # Design tokens + Tailwind base
│   │   ├── page.tsx            # Home / Gallery
│   │   ├── not-found.tsx       # 404 page
│   │   ├── browse/
│   │   │   └── page.tsx        # Browse with filters
│   │   ├── search/
│   │   │   └── page.tsx        # Search results
│   │   ├── recipe/[id]/
│   │   │   ├── page.tsx        # Recipe detail
│   │   │   └── reviews/
│   │   │       └── page.tsx    # Reviews + rating
│   │   └── ai-finder/
│   │       └── page.tsx        # AI Flavor Finder
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── TagChip.tsx
│   │   ├── RatingStars.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   └── FilterBar.tsx
│   ├── data/
│   │   └── recipes.ts          # All 12 recipes + search/filter utils
│   └── lib/
│       ├── localStorage.ts     # Favorites, ratings, reviews, AI history
│       └── aiFinder.ts         # Rule-based flavor matcher
├── public/
│   └── gelato/                 # Placeholder images (replace with real photos)
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Customization

### Adding a New Recipe

Edit `src/data/recipes.ts` and add a new entry to the `recipes` array following the existing schema. Add a matching image to `public/gelato/`.

### Changing the Color Theme

Edit `src/app/globals.css` — look for the `:root` block with CSS variables like `--mint`, `--bg`, `--ink`, etc.

### Styling

Tailwind classes are used throughout, extended with custom CSS via the `museum-card`, `museum-input`, `museum-btn-*`, and `tag-chip` utility classes defined in `globals.css`.
