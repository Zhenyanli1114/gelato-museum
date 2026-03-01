import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <p className="text-6xl mb-6">🍦</p>
      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: "var(--ink)" }}>
        404 — Scoop Not Found
      </h1>
      <p className="text-lg mb-8" style={{ color: "var(--ink-light)" }}>
        This flavor seems to have melted away. Let&apos;s get you back to the museum.
      </p>
      <Link href="/" className="museum-btn-primary inline-block">
        Back to the Museum
      </Link>
    </div>
  );
}
