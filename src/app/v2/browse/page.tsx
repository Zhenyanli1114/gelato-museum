"use client";

import { useState, useEffect, useMemo } from "react";
import { recipes, filterRecipes, Difficulty } from "@/data/recipes";
import RecipeCard from "@/components/v2/RecipeCard";
import FilterBar, { FilterState } from "@/components/v2/FilterBar";
import { getAverageRating, seedReviewsIfNeeded } from "@/lib/localStorage";

const defaultFilters: FilterState = { tags: [], difficulty: "", maxTime: 0, sort: "name" };

export default function V2BrowsePage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    seedReviewsIfNeeded();
    const r: Record<string, number> = {};
    recipes.forEach((rec) => { r[rec.id] = getAverageRating(rec.id); });
    setRatings(r);
  }, []);

  const filtered = useMemo(() => {
    const base = filterRecipes({ tags: filters.tags, difficulty: filters.difficulty as Difficulty | "", maxTime: filters.maxTime || undefined });
    return [...base].sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "time") return a.timeMin - b.timeMin;
      if (filters.sort === "difficulty") { const order = { Easy: 0, Medium: 1, Hard: 2 }; return order[a.difficulty] - order[b.difficulty]; }
      return 0;
    });
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "var(--ink)" }}>Browse Recipes</h1>
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{filtered.length} of {recipes.length} gelato recipes</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="p-5 rounded-2xl sticky top-20" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-end gap-2 mb-4">
            <button type="button" onClick={() => setLayout("grid")} className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: layout === "grid" ? "var(--mint-light)" : "transparent", color: layout === "grid" ? "var(--mint-dark)" : "var(--ink-muted)", border: "1px solid var(--border)" }} aria-label="Grid view">⊞</button>
            <button type="button" onClick={() => setLayout("list")} className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: layout === "list" ? "var(--mint-light)" : "transparent", color: layout === "list" ? "var(--mint-dark)" : "var(--ink-muted)", border: "1px solid var(--border)" }} aria-label="List view">≡</button>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-5xl mb-4">🍦</p>
              <p className="font-serif text-xl mb-2" style={{ color: "var(--ink)" }}>No recipes match your filters</p>
              <button type="button" onClick={() => setFilters(defaultFilters)} className="museum-btn-outline">Clear All Filters</button>
            </div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} averageRating={ratings[recipe.id]} layout="grid" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} averageRating={ratings[recipe.id]} layout="list" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
