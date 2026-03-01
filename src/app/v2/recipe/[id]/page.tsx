"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getRecipeById } from "@/data/recipes";
import TagChip from "@/components/v2/TagChip";
import RatingStars from "@/components/v2/RatingStars";
import { seedReviewsIfNeeded, isFavorite, toggleFavorite, getAverageRating } from "@/lib/localStorage";

const difficultyColor: Record<string, string> = { Easy: "#0d9488", Medium: "#b45309", Hard: "#b91c1c" };

export default function V2RecipePage() {
  const params = useParams();
  const id = params.id as string;
  const recipe = getRecipeById(id);
  const [favorited, setFavorited] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    seedReviewsIfNeeded();
    setIsClient(true);
    setFavorited(isFavorite(id));
    setAvgRating(getAverageRating(id));
  }, [id]);

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😢</p>
        <h1 className="font-serif text-3xl mb-2" style={{ color: "var(--ink)" }}>Recipe Not Found</h1>
        <Link href="/v2/browse" className="museum-btn-primary inline-block mt-4">Browse All Recipes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
        <Link href="/v2" className="hover:underline">Home</Link>{" / "}
        <Link href="/v2/browse" className="hover:underline">Browse</Link>{" / "}
        <span style={{ color: "var(--ink)" }}>{recipe.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <Image src={recipe.imagePath} alt={recipe.name} fill className="object-cover" priority
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/600x600/ccfbef/0d9488?text=${encodeURIComponent(recipe.name)}`; }} />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {recipe.tags.map((tag) => <TagChip key={tag} label={tag} />)}
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>{recipe.name}</h1>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--ink-light)" }}>{recipe.shortDescription}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--ink-muted)" }}>Time</span>
                <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>⏱ {recipe.timeMin} min</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--ink-muted)" }}>Difficulty</span>
                <span className="font-medium text-sm" style={{ color: difficultyColor[recipe.difficulty] }}>{recipe.difficulty}</span>
              </div>
              {isClient && avgRating > 0 && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--ink-muted)" }}>Rating</span>
                  <RatingStars value={avgRating} size="sm" />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button type="button" onClick={isClient ? () => setFavorited(toggleFavorite(id)) : undefined}
              className="museum-btn-outline flex items-center gap-2"
              style={favorited ? { borderColor: "#e11d48", color: "#e11d48", backgroundColor: "#fff1f2" } : {}}>
              {favorited ? "♥ Saved" : "♡ Save Recipe"}
            </button>
            <Link href={`/v2/recipe/${id}/reviews`} className="museum-btn-primary flex items-center gap-2">★ Reviews</Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 py-2 text-sm" style={{ borderBottom: "1px solid var(--border)", color: "var(--ink-light)" }}>
                <span style={{ color: "var(--mint-dark)", fontWeight: "600", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                {ing}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Method</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ backgroundColor: "var(--mint-light)", color: "var(--mint-dark)", border: "1px solid var(--border-mint)" }}>{i + 1}</span>
                <p className="text-sm leading-relaxed pt-0.5" style={{ color: "var(--ink-light)" }}>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-10 p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4"
        style={{ backgroundColor: "var(--mint-light)", border: "1px solid var(--border-mint)" }}>
        <div>
          <p className="font-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>Made this recipe?</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-light)" }}>Share your experience and help others discover great gelato.</p>
        </div>
        <Link href={`/v2/recipe/${id}/reviews`} className="museum-btn-primary">Write a Review →</Link>
      </div>
    </div>
  );
}
