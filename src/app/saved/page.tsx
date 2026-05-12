"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, getAverageRating } from "@/lib/supabase-store";
import { getRecipeById, Recipe } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";

export default function SavedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const ids = await getFavorites();
      const found = ids.map((id) => getRecipeById(id)).filter(Boolean) as Recipe[];
      setRecipes(found);
      const r: Record<string, number> = {};
      await Promise.all(found.map(async (rec) => { r[rec.id] = await getAverageRating(rec.id); }));
      setRatings(r);
      setIsLoaded(true);
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "var(--ink)" }}>Saved Recipes</h1>
        {isLoaded && (
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
            {recipes.length} saved recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!isLoaded ? (
        <div className="text-center py-20" style={{ color: "var(--ink-muted)" }}>Loading…</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-5xl mb-4">🍦</p>
          <p className="font-serif text-xl mb-2" style={{ color: "var(--ink)" }}>No saved recipes yet</p>
          <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>Browse recipes and tap the bookmark icon to save them here.</p>
          <Link href="/browse"
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--mint)", color: "var(--ink)" }}>
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} averageRating={ratings[recipe.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
