"use client";

import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/data/recipes";
import TagChip from "@/components/v1/TagChip";

interface RecipeCardProps {
  recipe: Recipe;
  averageRating?: number;
  layout?: "grid" | "list";
}

const difficultyColor: Record<string, string> = {
  Easy: "var(--mint-dark)",
  Medium: "#b45309",
  Hard: "#b91c1c",
};

export default function RecipeCard({ recipe, averageRating = 0, layout = "grid" }: RecipeCardProps) {
  if (layout === "list") {
    return (
      <Link href={`/v1/recipe/${recipe.id}`} className="block group">
        <article className="museum-card flex gap-4 p-4 cursor-pointer" style={{ backgroundColor: "var(--bg-card)" }}>
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={recipe.imagePath}
              alt={recipe.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="96px"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/96x96/ccfbef/0d9488?text=${encodeURIComponent(recipe.name.slice(0,2))}`; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-semibold truncate" style={{ color: "var(--ink)" }}>{recipe.name}</h3>
            <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--ink-light)" }}>{recipe.shortDescription}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs" style={{ color: "var(--ink-muted)" }}>⏱ {recipe.timeMin} min</span>
              <span className="text-xs font-medium" style={{ color: difficultyColor[recipe.difficulty] }}>{recipe.difficulty}</span>
              {averageRating > 0 && <span className="text-xs" style={{ color: "#f59e0b" }}>★ {averageRating.toFixed(1)}</span>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/v1/recipe/${recipe.id}`} className="block group">
      <article className="museum-card overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={recipe.imagePath}
            alt={recipe.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/ccfbef/0d9488?text=${encodeURIComponent(recipe.name)}`; }}
          />
          <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--bg-card)", color: difficultyColor[recipe.difficulty], border: "1px solid var(--border)" }}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-semibold leading-snug" style={{ color: "var(--ink)" }}>{recipe.name}</h3>
          <p className="text-sm mt-1.5 leading-relaxed flex-1 line-clamp-3" style={{ color: "var(--ink-light)" }}>{recipe.shortDescription}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: "var(--ink-muted)" }}>⏱ {recipe.timeMin} min</span>
            {averageRating > 0 && <span className="text-xs font-medium" style={{ color: "#f59e0b" }}>★ {averageRating.toFixed(1)}</span>}
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.tags.slice(0, 3).map((tag) => <TagChip key={tag} label={tag} />)}
          </div>
        </div>
      </article>
    </Link>
  );
}
