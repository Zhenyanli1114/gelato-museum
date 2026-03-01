"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Detect which version we're in
  const version = pathname.startsWith("/v2") ? "v2" : "v1";
  const base = `/${version}`;

  const navLinks = [
    { href: base, label: "Home" },
    { href: `${base}/browse`, label: "Browse" },
    { href: `${base}/ai-finder`, label: "AI Finder" },
  ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={base} className="flex items-center gap-2 group">
          <span
            className="text-2xl font-serif font-bold tracking-tight group-hover:text-teal-600 transition-colors duration-200"
            style={{ color: "var(--ink)" }}
          >
            🍦 Gelato Museum
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Nav Links */}
          {navLinks.map((link) => {
            const isActive =
              link.href === base
                ? pathname === base
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? "var(--mint-dark)" : "var(--ink-light)",
                  backgroundColor: isActive ? "var(--mint-light)" : "transparent",
                  fontWeight: isActive ? "600" : "500",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Version Switcher */}
          <div
            className="ml-4 flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {(["v1", "v2"] as const).map((v) => (
              <Link
                key={v}
                href={`/${v}`}
                className="px-3 py-1.5 text-xs font-bold tracking-wider transition-all duration-150"
                style={{
                  backgroundColor: version === v ? "var(--mint)" : "var(--bg-card)",
                  color: version === v ? "var(--ink)" : "var(--ink-muted)",
                  borderRight: v === "v1" ? "1px solid var(--border)" : "none",
                }}
              >
                {v.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
