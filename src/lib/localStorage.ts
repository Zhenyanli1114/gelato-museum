"use client";

export interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
}

type ReviewStore = Record<string, Review[]>;
type RatingStore = Record<string, number>;
type FavoritesStore = string[];

const KEYS = {
  favorites: "gelato_favorites",
  ratings: "gelato_ratings",
  reviews: "gelato_reviews",
  aiHistory: "gelato_ai_history",
  reviewsSeeded: "gelato_reviews_seeded",
};

function isBrowser() {
  return typeof window !== "undefined";
}

// ─── Favorites ───────────────────────────────────────────────────────────────
export function getFavorites(): FavoritesStore {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.favorites) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
    localStorage.setItem(KEYS.favorites, JSON.stringify(favs));
    return true;
  } else {
    favs.splice(idx, 1);
    localStorage.setItem(KEYS.favorites, JSON.stringify(favs));
    return false;
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

// ─── Ratings ─────────────────────────────────────────────────────────────────
export function getRatings(): RatingStore {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.ratings) || "{}");
  } catch {
    return {};
  }
}

export function getUserRating(recipeId: string): number {
  return getRatings()[recipeId] || 0;
}

export function setUserRating(recipeId: string, rating: number) {
  const ratings = getRatings();
  ratings[recipeId] = rating;
  localStorage.setItem(KEYS.ratings, JSON.stringify(ratings));
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
const SEED_REVIEWS: ReviewStore = {
  "pistachio-di-bronte": [
    {
      id: "seed-1",
      rating: 5,
      text: "Absolutely transcendent. The Bronte pistachios make all the difference — you can taste the terroir.",
      createdAt: "2024-06-12T10:30:00Z",
    },
    {
      id: "seed-2",
      rating: 4,
      text: "Rich and nutty with a beautiful green hue. Takes patience to make but completely worth it.",
      createdAt: "2024-07-03T14:15:00Z",
    },
  ],
  stracciatella: [
    {
      id: "seed-3",
      rating: 5,
      text: "The classic! Those paper-thin chocolate shards are addictive. I made a double batch.",
      createdAt: "2024-05-20T09:00:00Z",
    },
    {
      id: "seed-4",
      rating: 4,
      text: "Perfectly balanced — creamy base with just enough chocolate bite. A crowd-pleaser every time.",
      createdAt: "2024-08-14T16:45:00Z",
    },
  ],
  "cioccolato-fondente": [
    {
      id: "seed-5",
      rating: 5,
      text: "This is what chocolate gelato should taste like. Intense, dark, sophisticated.",
      createdAt: "2024-06-30T11:20:00Z",
    },
    {
      id: "seed-6",
      rating: 3,
      text: "Too bitter for my taste, but I know many people prefer it this way. Quality is undeniable.",
      createdAt: "2024-09-01T18:00:00Z",
    },
  ],
  tiramisu: [
    {
      id: "seed-7",
      rating: 5,
      text: "Best of both worlds! All the tiramisu flavors in frozen form. The ladyfinger pieces are genius.",
      createdAt: "2024-07-22T13:30:00Z",
    },
    {
      id: "seed-8",
      rating: 4,
      text: "Complex and satisfying. The mascarpone gives it a lovely tang.",
      createdAt: "2024-08-05T20:10:00Z",
    },
  ],
  "fior-di-latte": [
    {
      id: "seed-9",
      rating: 5,
      text: "Simple perfection. Use the best milk you can find and this becomes magical.",
      createdAt: "2024-05-15T12:00:00Z",
    },
    {
      id: "seed-10",
      rating: 4,
      text: "Beautiful and clean. A great base for toppings or as a palate cleanser.",
      createdAt: "2024-06-08T15:30:00Z",
    },
  ],
  fragola: [
    {
      id: "seed-11",
      rating: 5,
      text: "Made this in strawberry season and it was incredible. The lemon juice really brightens it.",
      createdAt: "2024-06-25T10:45:00Z",
    },
  ],
  limone: [
    {
      id: "seed-12",
      rating: 5,
      text: "Zingy, tart perfection. Serving in lemon shells is a must for parties.",
      createdAt: "2024-07-10T14:00:00Z",
    },
    {
      id: "seed-13",
      rating: 4,
      text: "So refreshing on a hot day. Pure and honest flavor.",
      createdAt: "2024-08-20T16:20:00Z",
    },
  ],
  nocciola: [
    {
      id: "seed-14",
      rating: 5,
      text: "Piedmont hazelnuts are the star here. Deep, roasty, and absolutely dreamy.",
      createdAt: "2024-09-10T11:00:00Z",
    },
  ],
  amarena: [
    {
      id: "seed-15",
      rating: 4,
      text: "The cherry swirl is visually stunning and the flavor contrast is delightful.",
      createdAt: "2024-07-18T17:30:00Z",
    },
    {
      id: "seed-16",
      rating: 5,
      text: "Amarena cherries are criminally underused. This recipe does them justice.",
      createdAt: "2024-08-28T19:00:00Z",
    },
  ],
  "caffe-espresso": [
    {
      id: "seed-17",
      rating: 5,
      text: "My daily gelato. Bold espresso flavor without any bitterness — perfect balance.",
      createdAt: "2024-06-01T08:30:00Z",
    },
  ],
  menta: [
    {
      id: "seed-18",
      rating: 5,
      text: "Finally — real mint gelato made with actual mint leaves, not toothpaste flavor. Gorgeous.",
      createdAt: "2024-07-05T12:00:00Z",
    },
    {
      id: "seed-19",
      rating: 4,
      text: "The mint steeping technique is brilliant. So much more nuanced than extract.",
      createdAt: "2024-08-12T14:30:00Z",
    },
  ],
  melone: [
    {
      id: "seed-20",
      rating: 5,
      text: "Summer in a scoop. Used Charentais melons and it was absolutely divine.",
      createdAt: "2024-07-30T13:15:00Z",
    },
  ],
};

export function seedReviewsIfNeeded() {
  if (!isBrowser()) return;
  const seeded = localStorage.getItem(KEYS.reviewsSeeded);
  if (seeded) return;
  localStorage.setItem(KEYS.reviews, JSON.stringify(SEED_REVIEWS));
  localStorage.setItem(KEYS.reviewsSeeded, "true");
}

export function getReviews(recipeId: string): Review[] {
  if (!isBrowser()) return [];
  try {
    const store: ReviewStore = JSON.parse(
      localStorage.getItem(KEYS.reviews) || "{}"
    );
    return store[recipeId] || [];
  } catch {
    return [];
  }
}

export function addReview(recipeId: string, review: Omit<Review, "id">) {
  if (!isBrowser()) return;
  try {
    const store: ReviewStore = JSON.parse(
      localStorage.getItem(KEYS.reviews) || "{}"
    );
    const existing = store[recipeId] || [];
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    store[recipeId] = [newReview, ...existing];
    localStorage.setItem(KEYS.reviews, JSON.stringify(store));
    return newReview;
  } catch {
    return null;
  }
}

export function getAverageRating(recipeId: string): number {
  const reviews = getReviews(recipeId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// ─── AI History ──────────────────────────────────────────────────────────────
export function getAiHistory(): string[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.aiHistory) || "[]");
  } catch {
    return [];
  }
}

export function addAiHistory(prompt: string) {
  const history = getAiHistory();
  const updated = [prompt, ...history.filter((h) => h !== prompt)].slice(0, 5);
  localStorage.setItem(KEYS.aiHistory, JSON.stringify(updated));
}
