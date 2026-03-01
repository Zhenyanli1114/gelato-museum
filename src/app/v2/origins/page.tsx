import Image from "next/image";
import ItalyMap from "@/components/v2/ItalyMap";
import OriginCard from "@/components/v2/OriginCard";
import { getRecipeById } from "@/data/recipes";

/* ─── Pin data: 4 cards across northern + central Italy ─── */
const ORIGIN_PINS = [
  {
    recipeId: "nocciola",
    region: "Piedmont",
    /** upper-left: Piedmont Langhe, northwest Italy */
    left: "14%",
    top: "6%",
  },
  {
    recipeId: "pistachio-di-bronte",
    region: "Piedmont",
    /** lower-left: anchored to western edge, well below nocciola */
    left: "2%",
    top: "30%",
  },
  {
    recipeId: "tiramisu",
    region: "Veneto / Lombardy",
    /** upper-right: northeast Italy */
    left: "53%",
    top: "10%",
  },
  {
    recipeId: "stracciatella",
    region: "Emilia-Romagna",
    /** center: Po Valley, well below the northern cards */
    left: "34%",
    top: "43%",
  },
];

export default function OriginsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>

      {/* ── Hero section ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "90vh" }}>

        {/* Watercolor background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/map/italy-watercolor-bg.png')" }}
          aria-hidden="true"
        />

        {/* Soft cream overlay to blend with site palette */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(253,249,237,0.72) 0%, rgba(253,249,237,0.30) 60%, rgba(253,249,237,0.10) 100%)" }}
          aria-hidden="true"
        />

        {/* Content grid: text left, map right */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12 min-h-[90vh]">

          {/* ── Left: Text panel ── */}
          <div className="lg:w-2/5 flex-shrink-0 text-center lg:text-left">
            {/* Eyebrow */}
            <p
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
              style={{ color: "#4DB6AC" }}
            >
              From the Regions of Italy
            </p>

            <h1
              className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: "#2c2c2c" }}
            >
              Where Every<br />
              Scoop Was<br />
              <em className="not-italic" style={{ color: "#0d9488" }}>Born</em>
            </h1>

            <p
              className="text-base lg:text-lg leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0"
              style={{ color: "#5a5a5a" }}
            >
              Italian gelato is inseparable from its geography. Each region
              gifted the world a flavor shaped by its soil, climate, and
              centuries of craft. Explore the origins.
            </p>

            {/* Subtle divider line */}
            <div
              className="w-16 h-px mb-8 mx-auto lg:mx-0"
              style={{ backgroundColor: "#4DB6AC", opacity: 0.5 }}
            />

            {/* Region count chips */}
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              {["Piedmont", "Lombardy", "Veneto", "Sicily", "Campania"].map((r) => (
                <span
                  key={r}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(204,251,239,0.6)",
                    color: "#0d9488",
                    border: "1px solid rgba(153,246,224,0.6)",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Map + floating cards ── */}
          <div className="lg:w-3/5 w-full flex-1 relative" style={{ minHeight: "600px" }}>

            {/* Map wrapper — relative anchor for absolute cards */}
            <div className="relative w-full h-full" style={{ minHeight: "600px" }}>

              {/* Italy SVG map */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-80"
                style={{ filter: "drop-shadow(0 8px 32px rgba(77,182,172,0.15))" }}
              >
                <ItalyMap className="w-full h-full max-h-[680px] object-contain" />
              </div>

              {/* Floating OriginCards — hidden on mobile, shown md+ */}
              <div className="hidden md:block absolute inset-0">
                {ORIGIN_PINS.map((pin) => {
                  const recipe = getRecipeById(pin.recipeId);
                  if (!recipe) return null;
                  return (
                    <OriginCard
                      key={pin.recipeId}
                      recipeId={recipe.id}
                      name={recipe.name}
                      region={pin.region}
                      shortDescription={recipe.shortDescription}
                      imagePath={recipe.imagePath}
                      left={pin.left}
                      top={pin.top}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile recipe list (shown instead of floating cards) ── */}
      <section className="md:hidden max-w-xl mx-auto px-4 py-10">
        <h2 className="font-serif text-2xl font-semibold mb-6 text-center" style={{ color: "#2c2c2c" }}>
          Featured Origins
        </h2>
        <div className="flex flex-col gap-4">
          {ORIGIN_PINS.map((pin) => {
            const recipe = getRecipeById(pin.recipeId);
            if (!recipe) return null;
            return (
              <div
                key={pin.recipeId}
                className="rounded-xl p-4 flex gap-4"
                style={{ backgroundColor: "#FAF7F0", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={recipe.imagePath} alt={recipe.name} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#4DB6AC" }}>{pin.region}</p>
                  <p className="font-serif text-base font-semibold mb-1" style={{ color: "#2c2c2c" }}>{recipe.name}</p>
                  <a href={`/v2/recipe/${recipe.id}`} className="text-xs font-medium" style={{ color: "#0d9488" }}>View Recipe →</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom editorial strip ── */}
      <section
        className="py-14 px-4"
        style={{ backgroundColor: "rgba(204,251,239,0.15)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="font-serif text-2xl md:text-3xl font-semibold mb-3"
            style={{ color: "#2c2c2c" }}
          >
            Every flavor has a story.
          </p>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: "#5a5a5a" }}>
            The Bronte pistachio grows only on the slopes of Etna. Hazelnuts
            from Piedmont&apos;s Langhe are protected by EU origin status.
            Amarena cherries hail from Bologna. Gelato is edible geography.
          </p>
          <a
            href="/v2/browse"
            className="museum-btn-primary inline-block"
          >
            Browse All Recipes →
          </a>
        </div>
      </section>
    </div>
  );
}
