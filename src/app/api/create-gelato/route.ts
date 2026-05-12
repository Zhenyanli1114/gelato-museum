import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { File as NodeFile } from "node:buffer";
if (!globalThis.File) (globalThis as unknown as Record<string, unknown>).File = NodeFile;
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// ─── Rate limiter (1 req / 15 sec per IP — DALL-E is expensive) ───────────────
const lastRequestTime = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = lastRequestTime.get(ip) ?? 0;
  if (now - last < 15000) return true;
  lastRequestTime.set(ip, now);
  return false;
}

const SYSTEM_PROMPT = `You are a master Italian gelato chef. Given a user's description (ingredients or flavor idea), invent an original artisan gelato recipe.

Return ONLY valid JSON — no markdown, no text outside the JSON:
{
  "name": "Italian-style gelato name (2-4 words)",
  "shortDescription": "One evocative sentence (max 20 words)",
  "tags": ["tag1", "tag2", "tag3"],
  "timeMin": 90,
  "difficulty": "Easy",
  "ingredients": ["250ml whole milk", "..."],
  "steps": ["Step description", "..."]
}

Rules:
- name: authentically Italian-sounding
- tags: 3-5 lowercase single-word flavor/texture/origin descriptors
- timeMin: realistic 60–180
- difficulty: exactly "Easy", "Medium", or "Hard"
- ingredients: 6-10 items with quantities
- steps: 5-8 clear steps`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait a moment before generating another recipe." },
      { status: 429 }
    );
  }

  let prompt: string;
  try {
    const body = await req.json();
    prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured." }, { status: 500 });
  }

  const client = new OpenAI({ apiKey });

  // ── Step 1: Generate recipe text ──────────────────────────────────────────
  let recipe: {
    name: string;
    shortDescription: string;
    tags: string[];
    timeMin: number;
    difficulty: string;
    ingredients: string[];
    steps: string[];
  };

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 700,
      temperature: 0.75,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a gelato recipe based on: "${prompt}"` },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    recipe = JSON.parse(cleaned);
  } catch (err) {
    console.error("[create-gelato] Recipe generation failed:", err);
    return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 });
  }

  // ── Step 2: Generate image with gpt-image-1 using reference image ────────
  let imageUrl: string;
  try {
    const refPath = path.join(process.cwd(), "public/gelato/pistachio-di-bronte.png");

    const imageFile = await toFile(fs.createReadStream(refPath), "reference.png", { type: "image/png" });

    const imageResponse = await client.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: `A single scoop of artisan gelato called "${recipe.name}" in a waffle cone, illustrated in exactly the same style as the reference image. ${recipe.shortDescription}. Same colored-pencil and watercolor technique, same fine outlines, same off-white cream background, isolated centered subject, no text, no labels, no shadows.`,
      n: 1,
      size: "1024x1024",
    });

    // gpt-image-1 returns base64 directly (no temporary URL)
    const b64 = imageResponse.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image data returned from gpt-image-1");
    const imgBuffer = Buffer.from(b64, "base64");

    // ── Step 3: Upload to Supabase Storage for permanent URL ─────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;

    const { error: uploadError } = await supabase.storage
      .from("gelato-images")
      .upload(fileName, imgBuffer, { contentType: "image/png", upsert: false });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("gelato-images")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  } catch (err) {
    console.error("[create-gelato] Image generation failed:", err);
    return NextResponse.json({ error: "Failed to generate image. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ recipe, imageUrl });
}
