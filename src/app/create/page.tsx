"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CustomRecipe, getCustomRecipes, saveCustomRecipe, deleteCustomRecipe } from "@/lib/supabase-store";
import TagChip from "@/components/TagChip";

interface GeneratedRecipe {
  name: string;
  shortDescription: string;
  tags: string[];
  timeMin: number;
  difficulty: string;
  ingredients: string[];
  steps: string[];
}

const SUGGESTIONS = [
  "Fresh strawberries and basil",
  "Espresso and cardamom",
  "Tropical mango with chili",
  "Smoky and unusual",
  "Lavender and honey",
];

const difficultyColor: Record<string, string> = {
  Easy: "var(--mint-dark)",
  Medium: "#b45309",
  Hard: "#b91c1c",
};

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ recipe: GeneratedRecipe; imageUrl: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [creations, setCreations] = useState<CustomRecipe[]>([]);

  useEffect(() => {
    getCustomRecipes().then(setCreations);
  }, []);

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setIsSaved(false);
    try {
      const res = await fetch("/api/create-gelato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!result || isSaved) return;
    await saveCustomRecipe({ ...result.recipe, imageUrl: result.imageUrl });
    setIsSaved(true);
    setCreations(await getCustomRecipes());
  }

  async function handleDelete(id: string) {
    await deleteCustomRecipe(id);
    setCreations(await getCustomRecipes());
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "var(--ink)" }}>Create Your Gelato</h1>
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          Describe ingredients you have or a flavor idea — AI will craft a unique recipe and image.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-2xl mb-8" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
          placeholder="e.g. I have fresh mangoes and coconut milk, or something with rose petals and pistachio..."
          rows={3}
          className="w-full resize-none rounded-xl p-3 text-sm outline-none"
          style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
        />
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => setPrompt(s)}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{ backgroundColor: "var(--mint)", color: "var(--ink)" }}>
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-3 rounded-xl font-medium text-sm transition-all"
          style={{
            backgroundColor: isGenerating || !prompt.trim() ? "var(--border)" : "var(--mint-dark)",
            color: isGenerating || !prompt.trim() ? "var(--ink-muted)" : "white",
            cursor: isGenerating || !prompt.trim() ? "not-allowed" : "pointer",
          }}>
          {isGenerating ? "✨ Crafting your gelato…" : "Generate Gelato"}
        </button>
        <p className="text-xs text-center mt-2" style={{ color: "var(--ink-muted)" }}>Takes ~20 seconds · uses gpt-image-1</p>
      </div>

      {/* Loading Skeleton */}
      {isGenerating && (
        <div className="mb-8 rounded-2xl overflow-hidden animate-pulse" style={{ border: "1px solid var(--border)" }}>
          {/* Animated image placeholder */}
          <div className="w-full aspect-[4/3] relative flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "var(--mint-light)" }}>
            {/* Shimmer sweep */}
            <div className="absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s infinite linear",
              }} />
            {/* Spinning gelato icon */}
            <div className="relative flex flex-col items-center gap-3">
              <span className="text-5xl" style={{ animation: "spin 2s linear infinite", display: "inline-block" }}>🍦</span>
              <p className="text-xs font-medium tracking-wide" style={{ color: "var(--mint-dark)" }}>
                Painting your illustration…
              </p>
            </div>
          </div>

          <style>{`
            @keyframes shimmer { from { background-position: -200% 0 } to { background-position: 200% 0 } }
            @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
          `}</style>

          <div className="p-6" style={{ backgroundColor: "var(--bg-card)" }}>
            <div className="h-7 w-2/3 rounded-lg mb-3" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-4 w-full rounded mb-1.5" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-4 w-4/5 rounded mb-4" style={{ backgroundColor: "var(--border)" }} />
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-5 w-16 rounded-full" style={{ backgroundColor: "var(--border)" }} />)}
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-5 w-24 rounded mb-3" style={{ backgroundColor: "var(--border)" }} />
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-3 rounded" style={{ backgroundColor: "var(--border)", width: `${70 + i * 5}%` }} />)}
              </div>
              <div className="space-y-2">
                <div className="h-5 w-16 rounded mb-3" style={{ backgroundColor: "var(--border)" }} />
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-3 rounded" style={{ backgroundColor: "var(--border)", width: `${65 + i * 7}%` }} />)}
              </div>
            </div>
            <p className="text-xs mt-6 text-center" style={{ color: "var(--ink-muted)" }}>
              Generating recipe and illustration…
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm" style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}>
          {error}
        </div>
      )}

      {/* Generated Result */}
      {result && (
        <div className="mb-12 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="relative w-full aspect-[4/3]">
            <Image src={result.imageUrl} alt={result.recipe.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
            <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--bg-card)", color: difficultyColor[result.recipe.difficulty] ?? "var(--ink)", border: "1px solid var(--border)" }}>
              {result.recipe.difficulty}
            </span>
          </div>
          <div className="p-6" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 className="font-serif text-2xl font-bold mb-1" style={{ color: "var(--ink)" }}>{result.recipe.name}</h2>
            <p className="text-sm mb-3" style={{ color: "var(--ink-light)" }}>{result.recipe.shortDescription}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {result.recipe.tags.map((tag) => <TagChip key={tag} label={tag} />)}
            </div>
            <p className="text-xs mb-6" style={{ color: "var(--ink-muted)" }}>⏱ {result.recipe.timeMin} min</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-serif font-semibold mb-2" style={{ color: "var(--ink)" }}>Ingredients</h3>
                <ul className="space-y-1">
                  {result.recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm flex gap-2" style={{ color: "var(--ink-light)" }}>
                      <span style={{ color: "var(--mint-dark)" }}>•</span>{ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2" style={{ color: "var(--ink)" }}>Steps</h3>
                <ol className="space-y-2">
                  {result.recipe.steps.map((step, i) => (
                    <li key={i} className="text-sm flex gap-2" style={{ color: "var(--ink-light)" }}>
                      <span className="font-bold flex-shrink-0" style={{ color: "var(--mint-dark)" }}>{i + 1}.</span>{step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: isSaved ? "var(--mint)" : "var(--mint-dark)",
                color: isSaved ? "var(--ink)" : "white",
                cursor: isSaved ? "default" : "pointer",
              }}>
              {isSaved ? "✓ Saved to My Creations" : "Save to My Creations"}
            </button>
          </div>
        </div>
      )}

      {/* My Creations */}
      {creations.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>My Creations</h2>
          <div className="flex flex-col gap-4">
            {creations.map((c) => (
              <div key={c.id} className="flex gap-4 p-4 rounded-2xl items-start"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image src={c.imageUrl} alt={c.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold" style={{ color: "var(--ink)" }}>{c.name}</p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--ink-light)" }}>{c.shortDescription}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--ink-muted)" }}>⏱ {c.timeMin} min · {c.difficulty}</p>
                </div>
                <button type="button" onClick={() => handleDelete(c.id)}
                  className="flex-shrink-0 text-xs px-3 py-1 rounded-lg transition-colors"
                  style={{ color: "#b91c1c", border: "1px solid #fca5a5" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
