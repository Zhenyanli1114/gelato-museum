export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: string;
  name: string;
  shortDescription: string;
  imagePath: string;
  tags: string[];
  timeMin: number;
  difficulty: Difficulty;
  ingredients: string[];
  steps: string[];
  rating?: number;
}

export const recipes: Recipe[] = [
  {
    id: "pistachio-di-bronte",
    name: "Pistachio di Bronte",
    shortDescription:
      "Made with prized Sicilian Bronte pistachios, this emerald jewel is richly nutty with a gentle sweetness that lingers.",
    imagePath: "/gelato/pistachio-di-bronte.png",
    tags: ["nutty", "sicilian", "classic", "premium"],
    timeMin: 90,
    difficulty: "Medium",
    ingredients: [
      "200g Bronte pistachio paste",
      "500ml whole milk",
      "200ml heavy cream",
      "150g caster sugar",
      "4 egg yolks",
      "Pinch of sea salt",
      "50g roasted pistachios (for topping)",
    ],
    steps: [
      "Whisk egg yolks and sugar together until pale and thick, about 3–4 minutes.",
      "Heat milk and cream in a saucepan over medium heat until it just begins to steam.",
      "Slowly pour the hot milk mixture into the egg mixture, whisking constantly to temper.",
      "Return the mixture to the saucepan and cook over low heat, stirring continuously, until it thickens to coat a spoon (about 80°C).",
      "Remove from heat and stir in the pistachio paste and sea salt until fully combined.",
      "Strain through a fine mesh sieve, then chill the custard over an ice bath.",
      "Churn in an ice cream maker for 25–30 minutes, then transfer to a container.",
      "Freeze for at least 2 hours. Serve topped with roasted pistachios.",
    ],
  },
  {
    id: "stracciatella",
    name: "Stracciatella",
    shortDescription:
      "A creamy fior di latte base with fine ribbons of dark chocolate folded in — the original chocolate chip gelato.",
    imagePath: "/gelato/stracciatella.png",
    tags: ["chocolate", "classic", "crowd-pleaser", "roman"],
    timeMin: 75,
    difficulty: "Easy",
    ingredients: [
      "500ml whole milk",
      "200ml heavy cream",
      "140g caster sugar",
      "3 egg yolks",
      "1 tsp vanilla extract",
      "100g dark chocolate (70%), finely chopped",
      "1 tbsp neutral oil",
    ],
    steps: [
      "Make a classic custard: whisk yolks with sugar, heat milk and cream, temper together, and cook until thickened.",
      "Add vanilla extract, strain, and chill the base completely.",
      "Churn the custard in an ice cream maker for 25 minutes.",
      "Melt dark chocolate with neutral oil until smooth and pourable. Let it cool slightly.",
      "In the last 2 minutes of churning, drizzle the melted chocolate in a thin stream — it will solidify into fine shards.",
      "Transfer to a container and freeze for 2 hours before serving.",
    ],
  },
  {
    id: "cioccolato-fondente",
    name: "Cioccolato Fondente",
    shortDescription:
      "Intensely dark and bittersweet, this is chocolate gelato for those who take their cacao seriously.",
    imagePath: "/gelato/cioccolato-fondente.png",
    tags: ["chocolate", "intense", "dark", "vegan-optional"],
    timeMin: 80,
    difficulty: "Medium",
    ingredients: [
      "600ml whole milk",
      "200ml heavy cream",
      "180g dark chocolate (72%), chopped",
      "50g Dutch-process cocoa powder",
      "160g caster sugar",
      "3 egg yolks",
      "Pinch of fine salt",
    ],
    steps: [
      "Whisk cocoa powder into milk until smooth over medium heat.",
      "Add chopped chocolate and stir until fully melted.",
      "In a bowl, whisk yolks with sugar until pale.",
      "Slowly pour the hot chocolate milk into the yolk mixture, tempering carefully.",
      "Return to low heat and cook until thickened to coat a spoon.",
      "Add salt, strain through a sieve, and cool over an ice bath.",
      "Churn for 25–30 minutes, then freeze for 2 hours.",
    ],
  },
  {
    id: "tiramisu",
    name: "Tiramisù",
    shortDescription:
      "All the beloved flavors of the Italian classic — mascarpone, espresso, and ladyfinger — now in gelato form.",
    imagePath: "/gelato/tiramisu.png",
    tags: ["coffee", "mascarpone", "classic", "italian"],
    timeMin: 100,
    difficulty: "Hard",
    ingredients: [
      "250g mascarpone cheese",
      "400ml whole milk",
      "150ml heavy cream",
      "120g caster sugar",
      "3 egg yolks",
      "60ml strong espresso, cooled",
      "2 tbsp coffee liqueur (Kahlúa or similar)",
      "1 tsp vanilla extract",
      "Cocoa powder for dusting",
      "4 savoiardi (ladyfingers), crumbled",
    ],
    steps: [
      "Whisk egg yolks with sugar until light and fluffy.",
      "Heat milk and cream until steaming, then temper into the yolk mixture.",
      "Cook gently until thickened, then remove from heat.",
      "Whisk in mascarpone until smooth. Add espresso, coffee liqueur, and vanilla.",
      "Chill the base thoroughly over an ice bath.",
      "Churn for 25 minutes. In the last 5 minutes, add crumbled ladyfingers.",
      "Transfer to a container and dust with cocoa powder on top. Freeze 2 hours.",
    ],
  },
  {
    id: "fior-di-latte",
    name: "Fior di Latte",
    shortDescription:
      "The purest gelato: nothing but fresh whole milk, cream, and a whisper of sugar. The milk must be exceptional.",
    imagePath: "/gelato/fior-di-latte.png",
    tags: ["classic", "light", "pure", "milk"],
    timeMin: 60,
    difficulty: "Easy",
    ingredients: [
      "700ml whole milk (best quality)",
      "200ml heavy cream",
      "180g caster sugar",
      "30g skim milk powder",
      "1 tsp vanilla extract (optional)",
    ],
    steps: [
      "Warm milk and cream together gently over medium heat.",
      "Whisk in sugar and skim milk powder until fully dissolved.",
      "Add vanilla extract if using. Do not boil — just heat to dissolve.",
      "Cool the mixture completely in the refrigerator (at least 2 hours or overnight).",
      "Churn in an ice cream maker for 25–30 minutes.",
      "Transfer to a container and freeze for 1–2 hours. Serve fresh.",
    ],
  },
  {
    id: "fragola",
    name: "Fragola (Strawberry)",
    shortDescription:
      "Captured at peak ripeness: a vibrant, fruit-forward gelato that tastes like summer in a scoop.",
    imagePath: "/gelato/fragola.png",
    tags: ["fruit", "summer", "fresh", "light"],
    timeMin: 50,
    difficulty: "Easy",
    ingredients: [
      "600g ripe strawberries, hulled",
      "300ml whole milk",
      "150ml heavy cream",
      "150g caster sugar",
      "2 tbsp lemon juice",
      "Pinch of black pepper (optional, enhances flavor)",
    ],
    steps: [
      "Blend strawberries with lemon juice until smooth. Pass through a sieve to remove seeds.",
      "Mix milk, cream, and sugar, stirring until sugar dissolves.",
      "Combine strawberry purée with the milk mixture. Add black pepper if desired.",
      "Chill for 30 minutes in the refrigerator.",
      "Churn in an ice cream maker for 20–25 minutes.",
      "Freeze for at least 1.5 hours before serving.",
    ],
  },
  {
    id: "limone",
    name: "Limone (Lemon Sorbetto)",
    shortDescription:
      "Bright, tart, and refreshing — this Sicilian-style lemon sorbetto is the palate cleanser of the gods.",
    imagePath: "/gelato/limone.png",
    tags: ["citrus", "sorbet", "refreshing", "vegan", "summer"],
    timeMin: 45,
    difficulty: "Easy",
    ingredients: [
      "250ml fresh lemon juice (about 8 lemons)",
      "Zest of 4 lemons",
      "400ml water",
      "220g caster sugar",
      "Pinch of fine salt",
    ],
    steps: [
      "Combine water and sugar in a saucepan. Heat over medium until sugar dissolves to form a simple syrup.",
      "Remove from heat and let cool to room temperature.",
      "Stir in lemon juice, lemon zest, and salt.",
      "Chill in the refrigerator for 1 hour.",
      "Churn in an ice cream maker for 20–25 minutes until firm.",
      "Freeze for 1 hour. Serve in hollowed-out lemon shells for theatre.",
    ],
  },
  {
    id: "nocciola",
    name: "Nocciola (Hazelnut)",
    shortDescription:
      "A deep, roasted hazelnut gelato that draws on Piedmont's finest hazelnuts — earthy, warm, and utterly irresistible.",
    imagePath: "/gelato/nocciola.png",
    tags: ["nutty", "roasted", "rich", "classic", "piedmont"],
    timeMin: 90,
    difficulty: "Medium",
    ingredients: [
      "180g toasted hazelnuts",
      "500ml whole milk",
      "200ml heavy cream",
      "150g caster sugar",
      "4 egg yolks",
      "Pinch of sea salt",
    ],
    steps: [
      "Blend toasted hazelnuts in a food processor until a fine paste forms.",
      "Make a custard: whisk yolks with sugar, heat milk and cream, temper together, and cook until thickened.",
      "While warm, blend in the hazelnut paste until completely smooth.",
      "Add sea salt, strain through a fine sieve, and cool over an ice bath.",
      "Refrigerate for 2 hours or overnight for deepest flavor.",
      "Churn for 25–30 minutes, then freeze for 2 hours.",
    ],
  },
  {
    id: "amarena",
    name: "Amarena",
    shortDescription:
      "Sour Amarena cherries preserved in syrup swirled through a creamy vanilla base — dramatic and delicious.",
    imagePath: "/gelato/amarena.png",
    tags: ["cherry", "fruity", "classic", "seasonal"],
    timeMin: 85,
    difficulty: "Medium",
    ingredients: [
      "500ml whole milk",
      "200ml heavy cream",
      "140g caster sugar",
      "4 egg yolks",
      "1 tsp vanilla extract",
      "120g Amarena cherries in syrup, drained (reserve syrup)",
      "3 tbsp Amarena cherry syrup",
    ],
    steps: [
      "Make a classic vanilla custard base: whisk yolks and sugar, heat milk and cream, temper, and cook until thickened.",
      "Add vanilla extract, strain, and chill completely.",
      "Churn for 25 minutes in an ice cream maker.",
      "Layer the semi-frozen gelato with Amarena cherries and drizzle with cherry syrup.",
      "Fold gently 2–3 times to create swirl effect — do not over-mix.",
      "Freeze for 2 hours. Serve with an extra drizzle of Amarena syrup.",
    ],
  },
  {
    id: "caffe-espresso",
    name: "Caffè Espresso",
    shortDescription:
      "Bold, aromatic espresso concentrated into a silky gelato — a perfect mid-afternoon pick-me-up.",
    imagePath: "/gelato/caffe-espresso.png",
    tags: ["coffee", "bold", "italian", "afternoon"],
    timeMin: 75,
    difficulty: "Easy",
    ingredients: [
      "500ml whole milk",
      "200ml heavy cream",
      "100ml strong espresso, cooled",
      "150g caster sugar",
      "3 egg yolks",
      "1 tsp coffee extract",
    ],
    steps: [
      "Brew a very strong espresso and allow to cool completely.",
      "Whisk egg yolks with sugar until light.",
      "Heat milk and cream, then temper into the yolk mixture.",
      "Cook over low heat until thickened. Remove from heat.",
      "Stir in espresso and coffee extract. Strain and chill.",
      "Churn for 25 minutes, then freeze for 2 hours.",
    ],
  },
  {
    id: "menta",
    name: "Menta (Fresh Mint)",
    shortDescription:
      "Made with real steeped mint leaves — not artificial — this refreshingly cool gelato is the museum's signature.",
    imagePath: "/gelato/menta.png",
    tags: ["mint", "fresh", "herbal", "refreshing", "summer"],
    timeMin: 90,
    difficulty: "Medium",
    ingredients: [
      "80g fresh spearmint leaves",
      "500ml whole milk",
      "200ml heavy cream",
      "150g caster sugar",
      "4 egg yolks",
      "A few drops of natural green food coloring (optional)",
    ],
    steps: [
      "Tear mint leaves and steep them in warmed milk for 20 minutes. Strain and discard leaves.",
      "Make a custard: whisk yolks and sugar, add the mint-infused milk and cream, temper, and cook until thickened.",
      "Add food coloring if desired for that classic mint look.",
      "Strain, cool over an ice bath, then refrigerate for 2 hours.",
      "Churn for 25–30 minutes.",
      "Freeze for 2 hours. Garnish with a fresh mint sprig when serving.",
    ],
  },
  {
    id: "melone",
    name: "Melone (Cantaloupe)",
    shortDescription:
      "Sunshine in a scoop: ripe cantaloupe blended into a light, fragrant sorbetto that sings of Italian summers.",
    imagePath: "/gelato/melone.png",
    tags: ["fruit", "sorbet", "summer", "light", "vegan"],
    timeMin: 40,
    difficulty: "Easy",
    ingredients: [
      "800g ripe cantaloupe melon, cubed and chilled",
      "150g caster sugar",
      "200ml water",
      "2 tbsp lime juice",
      "Pinch of fine salt",
    ],
    steps: [
      "Make simple syrup: dissolve sugar in water over medium heat. Cool completely.",
      "Blend cantaloupe until completely smooth.",
      "Mix melon purée with cooled syrup, lime juice, and salt.",
      "Taste and adjust sweetness as needed. Chill for 30 minutes.",
      "Churn in an ice cream maker for 20–25 minutes.",
      "Serve immediately for a soft-serve texture, or freeze 1 hour for firmer scoop.",
    ],
  },
];

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.shortDescription.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.ingredients.some((i) => i.toLowerCase().includes(q))
  );
}

export function filterRecipes(options: {
  tags?: string[];
  difficulty?: Difficulty | "";
  maxTime?: number;
}): Recipe[] {
  return recipes.filter((r) => {
    if (
      options.tags &&
      options.tags.length > 0 &&
      !options.tags.some((t) => r.tags.includes(t))
    ) {
      return false;
    }
    if (options.difficulty && r.difficulty !== options.difficulty) {
      return false;
    }
    if (options.maxTime && r.timeMin > options.maxTime) {
      return false;
    }
    return true;
  });
}

export const ALL_TAGS = Array.from(
  new Set(recipes.flatMap((r) => r.tags))
).sort();
