"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const version = pathname.startsWith("/v2") ? "v2" : "v1";
  const base = `/${version}`;

  return (
    <footer
      className="mt-auto py-10 px-4"
      style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>
            Gelato Museum
          </p>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-muted)" }}>
            A curated collection of authentic Italian gelato recipes.
          </p>
        </div>

        <nav className="flex gap-6 text-sm" style={{ color: "var(--ink-light)" }}>
          <Link href={base} className="hover:text-teal-600 transition-colors">Home</Link>
          <Link href={`${base}/browse`} className="hover:text-teal-600 transition-colors">Browse</Link>
          <Link href={`${base}/ai-finder`} className="hover:text-teal-600 transition-colors">AI Finder</Link>
        </nav>

        <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
          © {new Date().getFullYear()} Gelato Museum. Made with care.
        </p>
      </div>
    </footer>
  );
}
