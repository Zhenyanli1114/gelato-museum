"use client";

interface TagChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TagChip({ label, active = false, onClick, className = "" }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tag-chip ${active ? "active" : ""} ${className}`}
      style={
        active
          ? {
              backgroundColor: "var(--mint)",
              borderColor: "var(--mint-dark)",
              color: "var(--ink)",
            }
          : {}
      }
    >
      {label}
    </button>
  );
}
