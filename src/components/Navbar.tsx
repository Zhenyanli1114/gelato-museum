"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/ai-finder", label: "AI Finder" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-2xl font-serif font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            🍦{" "}
            <span
              className="group-hover:text-teal-600 transition-colors duration-200"
              style={{ color: "var(--ink)" }}
            >
              Gelato Museum
            </span>
          </span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    color: isActive ? "var(--mint-dark)" : "var(--ink-light)",
                    backgroundColor: isActive
                      ? "var(--mint-light)"
                      : "transparent",
                    fontWeight: isActive ? "600" : "500",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
