"use client";

import { Review } from "@/lib/localStorage";
import RatingStars from "@/components/v1/RatingStars";

interface ReviewListProps {
  reviews: Review[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch { return iso; }
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="text-4xl mb-3">✍️</p>
        <p className="font-serif text-lg" style={{ color: "var(--ink)" }}>No reviews yet</p>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>Be the first to share your experience!</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <article key={review.id} className="p-5 rounded-2xl"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <RatingStars value={review.rating} size="sm" />
            <time className="text-xs flex-shrink-0" style={{ color: "var(--ink-muted)" }}>{formatDate(review.createdAt)}</time>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{review.text}</p>
        </article>
      ))}
    </div>
  );
}
