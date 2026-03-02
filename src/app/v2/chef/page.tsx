import Link from "next/link";
import CredentialChip from "@/components/v2/CredentialChip";

const CREDENTIALS = [
  "Milan",
  "Michelin ★★★",
  "Le Cordon Bleu Paris",
  "World-renowned Gelato King",
];

export default function ChefPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ── Left: Portrait ── */}
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <div
              className="w-full overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "3 / 4",
                boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid var(--border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/chef/chef-francois.jpg"
                alt="Chef François"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* ── Right: Text ── */}
          <div className="flex-1 lg:pt-2">

            {/* Credential chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CREDENTIALS.map((c) => (
                <CredentialChip key={c} label={c} />
              ))}
            </div>

            {/* Eyebrow */}
            <p
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
              style={{ color: "var(--mint-dark)" }}
            >
              Chef-Owner · Curator of Gelato Museum
            </p>

            {/* Name */}
            <h1
              className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: "var(--ink)" }}
            >
              Chef<br />
              <span style={{ color: "#0d9488" }}>Fran&ccedil;ois</span>
            </h1>

            {/* Divider */}
            <div
              className="w-12 h-px mb-8"
              style={{ backgroundColor: "var(--mint-dark)", opacity: 0.4 }}
            />

            {/* Body copy */}
            <div
              className="space-y-4 text-base leading-relaxed mb-8"
              style={{ color: "var(--ink-light)" }}
            >
              <p>
                Chef Fran&ccedil;ois is the chef-owner of a three-star Michelin restaurant
                in Milan and a graduate of Le Cordon Bleu Paris. Internationally
                celebrated as the Gelato King, he is known for transforming traditional
                Italian flavors into refined, modern expressions of craft.
              </p>
              <p>
                His philosophy is simple: exceptional ingredients, balanced sweetness,
                and texture that melts like velvet. Every gelato is designed with
                precision — honoring regional heritage while elevating it through
                technique.
              </p>
              <p>
                Gelato Museum serves as his curated collection — a digital exhibition
                of flavors, origins, and the artistry behind each scoop.
              </p>
            </div>

            {/* Quote */}
            <blockquote
              className="rounded-xl px-6 py-5 mb-10"
              style={{
                backgroundColor: "var(--mint-light)",
                border: "1px solid var(--border-mint)",
              }}
            >
              <p
                className="font-serif text-xl italic leading-relaxed mb-2"
                style={{ color: "var(--ink)" }}
              >
                &ldquo;A perfect gelato is not loud. It is precise.&rdquo;
              </p>
              <p
                className="text-sm font-semibold tracking-wide"
                style={{ color: "var(--mint-dark)" }}
              >
                — Chef Fran&ccedil;ois
              </p>
            </blockquote>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/v2/origins" className="museum-btn-primary">
                Explore Flavor Origins →
              </Link>
              <Link href="/v2/ai-finder" className="museum-btn-outline">
                Try AI Flavor Finder →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
