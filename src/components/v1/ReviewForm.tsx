"use client";

import { useState } from "react";
import RatingStars from "@/components/v1/RatingStars";

interface ReviewFormProps {
  onSubmit: (rating: number, text: string) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (text.trim().length < 10) { setError("Please write at least 10 characters."); return; }
    setError("");
    onSubmit(rating, text.trim());
    setRating(0);
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <h3 className="font-serif text-xl mb-4" style={{ color: "var(--ink)" }}>Write a Review</h3>
      {submitted && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "var(--mint-light)", color: "var(--mint-dark)", border: "1px solid var(--border-mint)" }}>
          ✓ Your review has been added. Thank you!
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-light)" }}>Your Rating</label>
        <RatingStars value={rating} interactive onChange={setRating} size="lg" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-light)" }}>Your Review</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
          placeholder="Share your experience with this recipe…" className="museum-input resize-none"
          style={{ minHeight: "100px" }} />
      </div>
      {error && <p className="text-sm mb-3" style={{ color: "#b91c1c" }}>{error}</p>}
      <button type="submit" className="museum-btn-primary">Submit Review</button>
    </form>
  );
}
