import { recipes, Recipe } from "@/data/recipes";

interface AiMatch {
  recipe: Recipe;
  explanation: string;
  matchScore: number;
}

const KEYWORD_MAP: Record<string, string[]> = {
  chocolate: ["chocolate", "dark", "cioccolato", "stracciatella"],
  nut: ["nutty", "pistachio", "hazelnut", "nocciola", "almond"],
  pistachio: ["pistachio", "sicilian", "premium"],
  hazelnut: ["nutty", "nocciola", "roasted", "piedmont"],
  coffee: ["coffee", "espresso", "caffe", "tiramisu", "bold", "afternoon"],
  espresso: ["coffee", "espresso", "bold", "italian"],
  mint: ["mint", "menta", "fresh", "herbal", "refreshing"],
  fresh: ["fresh", "light", "summer", "refreshing"],
  summer: ["summer", "fruit", "refreshing", "light", "citrus"],
  fruit: ["fruit", "summer", "fragola", "limone", "melone", "cherry"],
  strawberry: ["fruit", "summer", "fresh", "fragola"],
  lemon: ["citrus", "sorbet", "refreshing", "vegan", "summer"],
  citrus: ["citrus", "sorbet", "refreshing", "lemon"],
  cherry: ["cherry", "fruity", "amarena", "seasonal"],
  vanilla: ["classic", "milk", "pure", "light"],
  cream: ["classic", "milk", "pure", "mascarpone"],
  rich: ["rich", "intense", "premium", "nutty"],
  light: ["light", "sorbet", "refreshing", "vegan", "fruit"],
  vegan: ["vegan", "sorbet", "fruit", "light"],
  italian: ["italian", "classic", "roman", "sicilian"],
  classic: ["classic", "crowd-pleaser", "pure"],
  intense: ["intense", "dark", "bold", "rich"],
  sweet: ["classic", "fruit", "milk", "crowd-pleaser"],
  refreshing: ["refreshing", "citrus", "mint", "summer", "sorbet"],
  melon: ["fruit", "summer", "light", "vegan", "melone"],
  cantaloupe: ["fruit", "summer", "light", "vegan"],
  tiramisu: ["coffee", "mascarpone", "classic", "italian"],
  mascarpone: ["mascarpone", "tiramisu", "rich"],
  sorbet: ["sorbet", "vegan", "light", "fruit"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function findTags(tokens: string[]): string[] {
  const tags = new Set<string>();
  for (const token of tokens) {
    const mapped = KEYWORD_MAP[token];
    if (mapped) mapped.forEach((t) => tags.add(t));
    // Direct partial match on recipe tags
    for (const recipe of recipes) {
      for (const tag of recipe.tags) {
        if (tag.includes(token) || token.includes(tag)) tags.add(tag);
      }
    }
  }
  return Array.from(tags);
}

function scoreRecipe(recipe: Recipe, searchTags: string[], tokens: string[]): number {
  let score = 0;
  for (const tag of searchTags) {
    if (recipe.tags.includes(tag)) score += 2;
  }
  for (const token of tokens) {
    if (recipe.name.toLowerCase().includes(token)) score += 3;
    if (recipe.shortDescription.toLowerCase().includes(token)) score += 1;
    if (recipe.id.includes(token)) score += 2;
  }
  return score;
}

function generateExplanation(recipe: Recipe, tokens: string[]): string {
  const matchedTags = recipe.tags.filter((tag) =>
    tokens.some((t) => tag.includes(t) || KEYWORD_MAP[t]?.includes(tag))
  );

  if (matchedTags.length > 0) {
    return `Matches your craving for ${tokens.slice(0, 2).join(" and ")} — this gelato is known for being ${matchedTags.slice(0, 2).join(" and ")}.`;
  }
  return `Based on your taste profile, ${recipe.name} would be a delightful discovery for you.`;
}

export function findMatches(prompt: string): AiMatch[] {
  const tokens = tokenize(prompt);
  const searchTags = findTags(tokens);

  const scored = recipes.map((recipe) => ({
    recipe,
    score: scoreRecipe(recipe, searchTags, tokens),
    explanation: generateExplanation(recipe, tokens),
  }));

  const results = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => ({
      recipe: s.recipe,
      explanation: s.explanation,
      matchScore: s.score,
    }));

  // If nothing matches, return top 3 popular ones
  if (results.length === 0) {
    return recipes.slice(0, 3).map((recipe) => ({
      recipe,
      explanation: `A beloved classic that gelato enthusiasts consistently enjoy.`,
      matchScore: 1,
    }));
  }

  return results;
}
