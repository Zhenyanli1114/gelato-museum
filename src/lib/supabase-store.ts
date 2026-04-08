"use client";

import { supabase } from "./supabase";

export interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  userName: string | null;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getUserId(): string {
  if (!isBrowser()) return "anon";
  let id = localStorage.getItem("gelato_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("gelato_user_id", id);
  }
  return id;
}

// ─── Favorites ───────────────────────────────────────────────────────────────
export async function getFavorites(): Promise<string[]> {
  const userId = getUserId();
  const { data } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", userId);
  return (data ?? []).map((r) => r.recipe_id);
}

export async function toggleFavorite(id: string): Promise<boolean> {
  const userId = getUserId();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", id)
    .maybeSingle();

  if (data) {
    await supabase.from("favorites").delete().eq("id", data.id);
    return false;
  } else {
    await supabase.from("favorites").insert({ user_id: userId, recipe_id: id });
    return true;
  }
}

export async function isFavorite(id: string): Promise<boolean> {
  const userId = getUserId();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", id)
    .maybeSingle();
  return !!data;
}

// ─── Ratings ─────────────────────────────────────────────────────────────────
export async function getUserRating(recipeId: string): Promise<number> {
  const userId = getUserId();
  const { data } = await supabase
    .from("ratings")
    .select("score")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .maybeSingle();
  return data?.score ?? 0;
}

export async function setUserRating(recipeId: string, rating: number): Promise<void> {
  const userId = getUserId();
  await supabase.from("ratings").upsert(
    { user_id: userId, recipe_id: recipeId, score: rating },
    { onConflict: "user_id,recipe_id" }
  );
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
const SEED_ROWS = [
  { user_id: "__seed__", recipe_id: "pistachio-di-bronte", rating: 5, body: "Absolutely transcendent. The Bronte pistachios make all the difference — you can taste the terroir.", created_at: "2024-06-12T10:30:00Z" },
  { user_id: "__seed__", recipe_id: "pistachio-di-bronte", rating: 4, body: "Rich and nutty with a beautiful green hue. Takes patience to make but completely worth it.", created_at: "2024-07-03T14:15:00Z" },
  { user_id: "__seed__", recipe_id: "stracciatella", rating: 5, body: "The classic! Those paper-thin chocolate shards are addictive. I made a double batch.", created_at: "2024-05-20T09:00:00Z" },
  { user_id: "__seed__", recipe_id: "stracciatella", rating: 4, body: "Perfectly balanced — creamy base with just enough chocolate bite. A crowd-pleaser every time.", created_at: "2024-08-14T16:45:00Z" },
  { user_id: "__seed__", recipe_id: "cioccolato-fondente", rating: 5, body: "This is what chocolate gelato should taste like. Intense, dark, sophisticated.", created_at: "2024-06-30T11:20:00Z" },
  { user_id: "__seed__", recipe_id: "cioccolato-fondente", rating: 3, body: "Too bitter for my taste, but I know many people prefer it this way. Quality is undeniable.", created_at: "2024-09-01T18:00:00Z" },
  { user_id: "__seed__", recipe_id: "tiramisu", rating: 5, body: "Best of both worlds! All the tiramisu flavors in frozen form. The ladyfinger pieces are genius.", created_at: "2024-07-22T13:30:00Z" },
  { user_id: "__seed__", recipe_id: "tiramisu", rating: 4, body: "Complex and satisfying. The mascarpone gives it a lovely tang.", created_at: "2024-08-05T20:10:00Z" },
  { user_id: "__seed__", recipe_id: "fior-di-latte", rating: 5, body: "Simple perfection. Use the best milk you can find and this becomes magical.", created_at: "2024-05-15T12:00:00Z" },
  { user_id: "__seed__", recipe_id: "fior-di-latte", rating: 4, body: "Beautiful and clean. A great base for toppings or as a palate cleanser.", created_at: "2024-06-08T15:30:00Z" },
  { user_id: "__seed__", recipe_id: "fragola", rating: 5, body: "Made this in strawberry season and it was incredible. The lemon juice really brightens it.", created_at: "2024-06-25T10:45:00Z" },
  { user_id: "__seed__", recipe_id: "limone", rating: 5, body: "Zingy, tart perfection. Serving in lemon shells is a must for parties.", created_at: "2024-07-10T14:00:00Z" },
  { user_id: "__seed__", recipe_id: "limone", rating: 4, body: "So refreshing on a hot day. Pure and honest flavor.", created_at: "2024-08-20T16:20:00Z" },
  { user_id: "__seed__", recipe_id: "nocciola", rating: 5, body: "Piedmont hazelnuts are the star here. Deep, roasty, and absolutely dreamy.", created_at: "2024-09-10T11:00:00Z" },
  { user_id: "__seed__", recipe_id: "amarena", rating: 4, body: "The cherry swirl is visually stunning and the flavor contrast is delightful.", created_at: "2024-07-18T17:30:00Z" },
  { user_id: "__seed__", recipe_id: "amarena", rating: 5, body: "Amarena cherries are criminally underused. This recipe does them justice.", created_at: "2024-08-28T19:00:00Z" },
  { user_id: "__seed__", recipe_id: "caffe-espresso", rating: 5, body: "My daily gelato. Bold espresso flavor without any bitterness — perfect balance.", created_at: "2024-06-01T08:30:00Z" },
  { user_id: "__seed__", recipe_id: "menta", rating: 5, body: "Finally — real mint gelato made with actual mint leaves, not toothpaste flavor. Gorgeous.", created_at: "2024-07-05T12:00:00Z" },
  { user_id: "__seed__", recipe_id: "menta", rating: 4, body: "The mint steeping technique is brilliant. So much more nuanced than extract.", created_at: "2024-08-12T14:30:00Z" },
  { user_id: "__seed__", recipe_id: "melone", rating: 5, body: "Summer in a scoop. Used Charentais melons and it was absolutely divine.", created_at: "2024-07-30T13:15:00Z" },
];

export async function seedReviewsIfNeeded(): Promise<void> {
  const { count } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;
  await supabase.from("reviews").insert(SEED_ROWS);
}

export async function getReviews(recipeId: string): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    text: r.body,
    createdAt: r.created_at,
    userName: r.user_name ?? null,
  }));
}

export async function addReview(recipeId: string, review: Omit<Review, "id">): Promise<Review | null> {
  const userId = getUserId();
  const { data } = await supabase
    .from("reviews")
    .insert({ user_id: userId, recipe_id: recipeId, rating: review.rating, body: review.text, created_at: review.createdAt, user_name: review.userName })
    .select()
    .single();
  if (!data) return null;
  return { id: data.id, rating: data.rating, text: data.body, createdAt: data.created_at, userName: data.user_name ?? null };
}

export async function getAverageRating(recipeId: string): Promise<number> {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("recipe_id", recipeId);
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / data.length) * 10) / 10;
}

// ─── Custom Recipes ───────────────────────────────────────────────────────────
export interface CustomRecipe {
  id: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
  tags: string[];
  timeMin: number;
  difficulty: string;
  ingredients: string[];
  steps: string[];
  createdAt: string;
}

export async function getCustomRecipes(): Promise<CustomRecipe[]> {
  const userId = getUserId();
  const { data } = await supabase
    .from("custom_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    shortDescription: r.short_description,
    imageUrl: r.image_url,
    tags: r.tags,
    timeMin: r.time_min,
    difficulty: r.difficulty,
    ingredients: r.ingredients,
    steps: r.steps,
    createdAt: r.created_at,
  }));
}

export async function saveCustomRecipe(recipe: Omit<CustomRecipe, "id" | "createdAt">): Promise<void> {
  const userId = getUserId();
  await supabase.from("custom_recipes").insert({
    user_id: userId,
    name: recipe.name,
    short_description: recipe.shortDescription,
    image_url: recipe.imageUrl,
    tags: recipe.tags,
    time_min: recipe.timeMin,
    difficulty: recipe.difficulty,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  });
}

export async function deleteCustomRecipe(id: string): Promise<void> {
  await supabase.from("custom_recipes").delete().eq("id", id);
}
