import Image from "next/image";
import Link from "next/link";

export interface OriginCardProps {
  recipeId: string;
  name: string;
  region: string;
  shortDescription: string;
  imagePath: string;
  /** Percentage from left edge of the map container */
  left: string;
  /** Percentage from top edge of the map container */
  top: string;
}

export default function OriginCard({
  recipeId,
  name,
  region,
  shortDescription,
  imagePath,
  left,
  top,
}: OriginCardProps) {
  return (
    <div
      className="absolute z-20 w-44 group"
      style={{ left, top }}
    >
      {/* Pin dot */}
      <div
        className="w-2.5 h-2.5 rounded-full mb-1 mx-auto ring-2 ring-white group-hover:scale-125 transition-transform duration-200"
        style={{ backgroundColor: "#4DB6AC", boxShadow: "0 0 5px rgba(77,182,172,0.4)" }}
      />

      {/* Card */}
      <div
        className="rounded-xl p-2.5 flex gap-2 items-start backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1"
        style={{
          backgroundColor: "rgba(255,255,255,0.90)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
          border: "1px solid rgba(226,221,208,0.7)",
        }}
      >
        {/* Image */}
        <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={imagePath}
            alt={name}
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#4DB6AC" }}>
            {region}
          </p>
          <p className="font-serif text-xs font-semibold leading-snug mb-1" style={{ color: "#2c2c2c" }}>
            {name}
          </p>
          <p className="text-[10px] leading-snug line-clamp-2 mb-1.5" style={{ color: "#5a5a5a" }}>
            {shortDescription}
          </p>
          <Link
            href={`/v2/recipe/${recipeId}`}
            className="text-[10px] font-medium transition-colors duration-150"
            style={{ color: "#0d9488" }}
          >
            View Recipe →
          </Link>
        </div>
      </div>
    </div>
  );
}
