"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recipes } from "@/data/recipes";
import { ALL_TAGS } from "@/data/recipes";
import RecipeCard from "@/components/v1/RecipeCard";
import TagChip from "@/components/v1/TagChip";
import { getAverageRating, seedReviewsIfNeeded } from "@/lib/localStorage";

const FEATURED_IDS = [
  "pistachio-di-bronte",
  "stracciatella",
  "tiramisu",
  "limone",
  "menta",
  "nocciola",
];

export default function V1HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    seedReviewsIfNeeded();
    const r: Record<string, number> = {};
    recipes.forEach((rec) => { r[rec.id] = getAverageRating(rec.id); });
    setRatings(r);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push(`/v1/search?q=${encodeURIComponent(search.trim())}`);
  }

  const featuredRecipes = recipes.filter((r) => FEATURED_IDS.includes(r.id));
  const displayedRecipes = activeTag ? recipes.filter((r) => r.tags.includes(activeTag)) : featuredRecipes;
  const DISPLAY_TAGS = ALL_TAGS.slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <section className="text-center mb-14">
        <div className="inline-block mb-4"><span className="text-6xl">🍦</span></div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4" style={{ color: "var(--ink)" }}>
          Gelato Museum
        </h1>
        <p className="text-lg max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "var(--ink-light)" }}>
          A curated collection of authentic Italian gelato recipes — from sun-drenched Sicily to the hills of Piedmont.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes, flavors, ingredients…" className="museum-input" />
          <button type="submit" className="museum-btn-primary whitespace-nowrap">Search</button>
        </form>
      </section>

      {/* Category Chips */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          <button type="button" onClick={() => setActiveTag(null)} className={`tag-chip ${activeTag === null ? "active" : ""}`}>All</button>
          {DISPLAY_TAGS.map((tag) => (
            <TagChip key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} />
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{activeTag ? `#${activeTag}` : "Featured Flavors"}</h2>
          <a href="/v1/browse" className="text-sm font-medium" style={{ color: "var(--mint-dark)" }}>View all →</a>
        </div>
        {displayedRecipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-serif text-xl" style={{ color: "var(--ink)" }}>No recipes found for #{activeTag}</p>
            <button type="button" onClick={() => setActiveTag(null)} className="museum-btn-outline mt-4">Clear filter</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} averageRating={ratings[recipe.id]} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 text-center py-12 rounded-3xl" style={{ backgroundColor: "var(--mint-light)", border: "1px solid var(--border-mint)" }}>
        <p className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Not sure what to make?</p>
        <p className="text-sm mb-6" style={{ color: "var(--ink-light)" }}>Describe your cravings and let our AI Flavor Finder guide you.</p>
        <a href="/v1/ai-finder" className="museum-btn-primary inline-block">Try the AI Finder →</a>
      </section>
    </div>
  );
}
