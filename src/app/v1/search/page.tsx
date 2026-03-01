"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { searchRecipes, Recipe } from "@/data/recipes";
import RecipeCard from "@/components/v1/RecipeCard";
import { getAverageRating, seedReviewsIfNeeded } from "@/lib/localStorage";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Recipe[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    seedReviewsIfNeeded();
    setIsClient(true);
    const found = searchRecipes(query);
    setResults(found);
    const r: Record<string, number> = {};
    found.forEach((rec) => { r[rec.id] = getAverageRating(rec.id); });
    setRatings(r);
  }, [query]);

  if (!isClient) return null;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-1" style={{ color: "var(--ink)" }}>
          {query ? `Results for "${query}"` : "Search Gelato"}
        </h1>
        {query && <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{results.length} recipe{results.length !== 1 ? "s" : ""} found</p>}
      </div>
      {!query && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-serif text-xl" style={{ color: "var(--ink)" }}>Enter a search term</p>
          <p className="text-sm mt-2" style={{ color: "var(--ink-muted)" }}>
            Try a flavor, ingredient, or tag like &ldquo;mint&rdquo;, &ldquo;chocolate&rdquo;, or &ldquo;vegan&rdquo;.
          </p>
        </div>
      )}
      {query && results.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-5xl mb-4">😔</p>
          <p className="font-serif text-xl mb-2" style={{ color: "var(--ink)" }}>No gelato found for &ldquo;{query}&rdquo;</p>
          <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>Try different keywords — perhaps a flavor, ingredient, or tag.</p>
          <a href="/v1/browse" className="museum-btn-outline inline-block">Browse All Recipes</a>
        </div>
      )}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} averageRating={ratings[recipe.id]} />)}
        </div>
      )}
    </>
  );
}

export default function V1SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Suspense fallback={<div className="text-center py-20"><p className="text-5xl mb-4">⏳</p><p className="font-serif text-xl" style={{ color: "var(--ink)" }}>Searching…</p></div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
