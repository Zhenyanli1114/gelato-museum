"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { findMatches } from "@/lib/aiFinder";
import { Recipe } from "@/data/recipes";
import TagChip from "@/components/TagChip";
import { getAiHistory, addAiHistory, seedReviewsIfNeeded } from "@/lib/localStorage";

interface Match {
  recipe: Recipe;
  explanation: string;
  matchScore: number;
}

const SUGGESTIONS = [
  "something creamy and nutty",
  "chocolate and mint",
  "fruity and refreshing",
  "rich coffee flavor",
  "light summer sorbet",
  "classic Italian",
];

export default function AiFinderPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Match[] | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    seedReviewsIfNeeded();
    setIsClient(true);
    setHistory(getAiHistory());
  }, []);

  async function handleSearch(query: string) {
    if (!query.trim()) return;
    setPrompt(query);
    setLoading(true);
    setResults(null);

    // Simulate AI thinking delay (600ms–1.2s)
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const matches = findMatches(query);
    setResults(matches);
    setLoading(false);

    addAiHistory(query);
    setHistory(getAiHistory());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch(prompt);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-3xl"
          style={{ backgroundColor: "var(--mint-light)", border: "1px solid var(--border-mint)" }}>
          ✨
        </div>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "var(--ink)" }}>
          AI Flavor Finder
        </h1>
        <p className="text-base max-w-md mx-auto" style={{ color: "var(--ink-light)" }}>
          Describe what you&apos;re craving and we&apos;ll match you with the perfect gelato.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. &quot;mint and chocolate&quot;, &quot;fruity and light&quot;…"
            className="museum-input text-base"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="museum-btn-primary whitespace-nowrap"
            style={{ opacity: loading || !prompt.trim() ? 0.6 : 1 }}
          >
            {loading ? "Thinking…" : "Find →"}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      {!results && !loading && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>
            Try a suggestion
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSearch(s)}
                className="tag-chip"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      {isClient && history.length > 0 && !loading && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSearch(h)}
                className="museum-btn-outline text-sm py-1 px-3"
              >
                ↩ {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-4xl mb-4 animate-spin inline-block">🍦</div>
          <p className="font-serif text-xl mb-1" style={{ color: "var(--ink)" }}>
            Analyzing your cravings…
          </p>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
            Searching through our museum of flavors
          </p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--ink)" }}>
              Perfect matches for &ldquo;{prompt}&rdquo;
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-5xl mb-4">🤔</p>
              <p className="font-serif text-xl" style={{ color: "var(--ink)" }}>No matches found</p>
              <p className="text-sm mt-2 mb-6" style={{ color: "var(--ink-muted)" }}>
                Try different keywords or browse our full collection.
              </p>
              <Link href="/browse" className="museum-btn-outline inline-block">
                Browse All Recipes
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {results.map(({ recipe, explanation }, idx) => (
                <article
                  key={recipe.id}
                  className="museum-card flex gap-5 p-5"
                >
                  {/* Rank */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold"
                    style={{
                      backgroundColor: idx === 0 ? "var(--mint)" : "var(--mint-light)",
                      color: "var(--mint-dark)",
                      border: "1px solid var(--border-mint)",
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={recipe.imagePath}
                      alt={recipe.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/80x80/ccfbef/0d9488?text=${encodeURIComponent(recipe.name.slice(0, 2))}`;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>
                        {recipe.name}
                      </h3>
                      <Link
                        href={`/recipe/${recipe.id}`}
                        className="museum-btn-primary text-xs py-1 px-3 flex-shrink-0"
                      >
                        View →
                      </Link>
                    </div>

                    {/* AI Explanation */}
                    <p
                      className="text-sm italic mb-2 leading-relaxed"
                      style={{
                        color: "var(--mint-dark)",
                        backgroundColor: "var(--mint-light)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-mint)",
                        display: "inline-block",
                      }}
                    >
                      ✨ {explanation}
                    </p>

                    <p className="text-sm line-clamp-2 mt-1.5" style={{ color: "var(--ink-light)" }}>
                      {recipe.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {recipe.tags.slice(0, 4).map((tag) => (
                        <TagChip key={tag} label={tag} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Try again */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => { setResults(null); setPrompt(""); }}
              className="museum-btn-outline"
            >
              Search Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
