"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getRecipeById } from "@/data/recipes";
import ReviewForm from "@/components/v1/ReviewForm";
import ReviewList from "@/components/v1/ReviewList";
import RatingStars from "@/components/v1/RatingStars";
import { Review, getReviews, addReview, getAverageRating, seedReviewsIfNeeded } from "@/lib/localStorage";

export default function V1ReviewsPage() {
  const params = useParams();
  const id = params.id as string;
  const recipe = getRecipeById(id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    seedReviewsIfNeeded();
    setIsClient(true);
    setReviews(getReviews(id));
    setAvgRating(getAverageRating(id));
  }, [id]);

  function handleSubmit(rating: number, text: string) {
    addReview(id, { rating, text, createdAt: new Date().toISOString() });
    setReviews(getReviews(id));
    setAvgRating(getAverageRating(id));
  }

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😢</p>
        <h1 className="font-serif text-3xl" style={{ color: "var(--ink)" }}>Recipe Not Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
        <Link href="/v1" className="hover:underline">Home</Link>{" / "}
        <Link href="/v1/browse" className="hover:underline">Browse</Link>{" / "}
        <Link href={`/v1/recipe/${id}`} className="hover:underline">{recipe.name}</Link>{" / "}
        <span style={{ color: "var(--ink)" }}>Reviews</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "var(--ink)" }}>Reviews — {recipe.name}</h1>
        {isClient && (
          <div className="flex items-center gap-4 flex-wrap">
            <RatingStars value={avgRating} size="md" />
            <span className="text-sm" style={{ color: "var(--ink-muted)" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
      <div className="mb-8"><ReviewForm onSubmit={handleSubmit} /></div>
      <div>
        <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Community Reviews</h2>
        {isClient ? <ReviewList reviews={reviews} /> : <div className="text-center py-8" style={{ color: "var(--ink-muted)" }}>Loading reviews…</div>}
      </div>
    </div>
  );
}
