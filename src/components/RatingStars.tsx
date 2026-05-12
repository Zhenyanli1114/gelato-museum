"use client";

import { useState } from "react";

interface RatingStarsProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export default function RatingStars({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = "md",
}: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`} role="group" aria-label="Star rating">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hovered || value);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`transition-transform duration-100 ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            style={{ background: "none", border: "none", padding: "0 1px" }}
          >
            <span style={{ color: isFilled ? "#f59e0b" : "var(--border)", transition: "color 0.15s ease" }}>★</span>
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-1.5 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
