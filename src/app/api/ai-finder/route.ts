import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { recipes } from "@/data/recipes";
import { findMatches } from "@/lib/aiFinder";

// ─── Simple in-memory rate limiter (1 req/sec per IP) ────────────────────────
const lastRequestTime = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = lastRequestTime.get(ip) ?? 0;
  if (now - last < 1000) return true;
  lastRequestTime.set(ip, now);
  return false;
}

// ─── Recipe catalogue sent to the model ──────────────────────────────────────
const RECIPE_CATALOGUE = recipes
  .map((r) => `- id: "${r.id}" | name: "${r.name}" | tags: ${r.tags.join(", ")}`)
  .join("\n");

const VALID_IDS = new Set(recipes.map((r) => r.id));

// ─── Fallback: rule-based matcher ────────────────────────────────────────────
function fallbackMatches(query: string) {
  return findMatches(query).map((m) => ({
    id: m.recipe.id,
    reason: m.explanation,
    confidence: Math.min(1, m.matchScore / 10),
  }));
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // Parse body
  let query: string;
  try {
    const body = await req.json();
    query = typeof body.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: "query is required." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // ── If no key configured, use rule-based fallback ──────────────────────────
  if (!apiKey) {
    return NextResponse.json({
      recommendations: fallbackMatches(query),
      source: "fallback",
    });
  }

  // ── Try OpenAI ─────────────────────────────────────────────────────────────
  try {
    const client = new OpenAI({ apiKey });

    const systemPrompt = `You are a gelato sommelier. A customer describes their craving and you recommend gelato flavors ONLY from the provided catalogue.

CATALOGUE (choose only from these IDs):
${RECIPE_CATALOGUE}

RULES:
- Return ONLY valid JSON — no markdown, no explanation outside the JSON.
- Always pick exactly 3 recommendations (fewer only if catalogue has fewer than 3 items).
- Each "id" MUST exactly match one of the catalogue ids above.
- Each "reason" is ONE concise sentence (max 20 words) explaining why it matches the craving.
- "confidence" is a float 0.0–1.0 indicating match strength.

RESPONSE FORMAT (JSON only):
{
  "recommendations": [
    { "id": "recipe-id", "reason": "One sentence reason.", "confidence": 0.95 },
    { "id": "recipe-id", "reason": "One sentence reason.", "confidence": 0.82 },
    { "id": "recipe-id", "reason": "One sentence reason.", "confidence": 0.71 }
  ]
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Customer craving: "${query}"` },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Parse and validate
    let parsed: { recommendations: Array<{ id: string; reason: string; confidence: number }> };
    try {
      // Strip any accidental markdown fences
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[ai-finder] Failed to parse OpenAI response, using fallback.");
      return NextResponse.json({
        recommendations: fallbackMatches(query),
        source: "fallback",
      });
    }

    // Validate & filter: only keep ids that exist in our dataset
    const validated = (parsed.recommendations ?? [])
      .filter((r) => VALID_IDS.has(r.id) && typeof r.reason === "string")
      .slice(0, 3)
      .map((r) => ({
        id: r.id,
        reason: r.reason.slice(0, 200),
        confidence: Math.min(1, Math.max(0, Number(r.confidence) || 0.5)),
      }));

    // If OpenAI returned nothing valid, fall back
    if (validated.length === 0) {
      return NextResponse.json({
        recommendations: fallbackMatches(query),
        source: "fallback",
      });
    }

    return NextResponse.json({ recommendations: validated, source: "openai" });
  } catch (err) {
    console.error("[ai-finder] OpenAI error, using fallback:", (err as Error).message);
    return NextResponse.json({
      recommendations: fallbackMatches(query),
      source: "fallback",
    });
  }
}
