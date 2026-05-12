"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/origins", label: "Origins" },
  { href: "/chef", label: "Chef" },
  { href: "/ai-finder", label: "AI Finder" },
  { href: "/create", label: "Create" },
  { href: "/saved", label: "Saved" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-2xl font-serif font-bold tracking-tight group-hover:text-teal-600 transition-colors duration-200"
            style={{ color: "var(--ink)" }}
          >
            🍦 Gelato Museum
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Nav Links */}
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? "var(--ink)" : "var(--ink-light)",
                  backgroundColor: isActive ? "var(--mint)" : "transparent",
                  fontWeight: isActive ? "600" : "500",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth */}
          <div className="ml-3 flex items-center">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
                  style={{ backgroundColor: "var(--mint)", color: "var(--ink)" }}
                >
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>
    </header>
  );
}
