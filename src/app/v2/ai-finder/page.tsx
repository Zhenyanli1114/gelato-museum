"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRecipeById } from "@/data/recipes";
import TagChip from "@/components/v2/TagChip";
import { getAiHistory, addAiHistory, seedReviewsIfNeeded } from "@/lib/localStorage";

interface Recommendation {
  id: string;
  reason: string;
  confidence: number;
}

interface ApiResponse {
  recommendations: Recommendation[];
  source: "openai" | "fallback";
}

const SUGGESTIONS = [
  "something creamy and nutty",
  "chocolate and mint",
  "fruity and refreshing",
  "rich coffee flavor",
  "light summer sorbet",
  "classic Italian",
];

export default function V2AiFinderPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      const res = await fetch("/api/ai-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (res.status === 429) {
        setError("Please wait a moment before searching again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResults(data);
      addAiHistory(query);
      setHistory(getAiHistory());
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Resolve recommendation ids to full recipe objects
  const resolvedResults = results?.recommendations
    .map((rec) => {
      const recipe = getRecipeById(rec.id);
      return recipe ? { recipe, reason: rec.reason, confidence: rec.confidence } : null;
    })
    .filter(Boolean) as Array<{ recipe: NonNullable<ReturnType<typeof getRecipeById>>; reason: string; confidence: number }> | undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-3xl"
          style={{ backgroundColor: "var(--mint-light)", border: "1px solid var(--border-mint)" }}
        >
          ✨
        </div>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "var(--ink)" }}>
          AI Flavor Finder
        </h1>
        <p className="text-base max-w-md mx-auto" style={{ color: "var(--ink-light)" }}>
          Describe what you&apos;re craving and our AI will match you with the perfect gelato.
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(prompt); }}
        className="mb-8"
      >
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
      {!results && !loading && !error && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>
            Try a suggestion
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => handleSearch(s)} className="tag-chip">{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Recent history */}
      {isClient && history.length > 0 && !loading && !results && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button key={h} type="button" onClick={() => handleSearch(h)} className="museum-btn-outline text-sm py-1 px-3">
                ↩ {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-4xl mb-4 animate-spin inline-block">🍦</div>
          <p className="font-serif text-xl mb-1" style={{ color: "var(--ink)" }}>Analyzing your cravings…</p>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Consulting our gelato AI</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-10 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-serif text-lg mb-4" style={{ color: "var(--ink)" }}>{error}</p>
          <button type="button" onClick={() => setError(null)} className="museum-btn-outline">Try Again</button>
        </div>
      )}

      {/* Results */}
      {results && !loading && resolvedResults && (
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--ink)" }}>
              Perfect matches for &ldquo;{prompt}&rdquo;
            </h2>
            {results.source === "fallback" && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "var(--paper-200)", color: "var(--ink-muted)", border: "1px solid var(--border)" }}
              >
                Rule-based results
              </span>
            )}
            {results.source === "openai" && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "var(--mint-light)", color: "var(--mint-dark)", border: "1px solid var(--border-mint)" }}
              >
                ✨ AI-powered
              </span>
            )}
          </div>

          {resolvedResults.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-5xl mb-4">🤔</p>
              <p className="font-serif text-xl" style={{ color: "var(--ink)" }}>No matches found</p>
              <Link href="/v2/browse" className="museum-btn-outline inline-block mt-6">Browse All Recipes</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {resolvedResults.map(({ recipe, reason, confidence }, idx) => (
                <article key={recipe.id} className="museum-card flex gap-5 p-5">
                  {/* Rank */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold"
                    style={{ backgroundColor: idx === 0 ? "var(--mint)" : "var(--mint-light)", color: "var(--mint-dark)", border: "1px solid var(--border-mint)" }}
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
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x80/ccfbef/0d9488?text=${encodeURIComponent(recipe.name.slice(0, 2))}`; }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>{recipe.name}</h3>
                      <Link href={`/v2/recipe/${recipe.id}`} className="museum-btn-primary text-xs py-1 px-3 flex-shrink-0">
                        View →
                      </Link>
                    </div>

                    {/* AI reason */}
                    <p
                      className="text-sm italic mb-2 leading-relaxed"
                      style={{ color: "var(--mint-dark)", backgroundColor: "var(--mint-light)", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-mint)", display: "inline-block" }}
                    >
                      ✨ {reason}
                    </p>

                    <p className="text-sm line-clamp-2 mt-1.5" style={{ color: "var(--ink-light)" }}>
                      {recipe.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 4).map((tag) => <TagChip key={tag} label={tag} />)}
                      </div>
                      {/* Confidence bar */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.round(confidence * 100)}%`, backgroundColor: "var(--mint-dark)" }}
                          />
                        </div>
                        <span className="text-xs" style={{ color: "var(--ink-muted)" }}>{Math.round(confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button type="button" onClick={() => { setResults(null); setPrompt(""); setError(null); }} className="museum-btn-outline">
              Search Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
