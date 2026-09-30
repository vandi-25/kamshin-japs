/**
 * Sample Kamshin fragrance catalogue.
 *
 * Used by the design preview (no database needed) and by prisma/seed.ts, so the
 * real database starts with the same catalogue. All prices are integer kobo.
 * Product names are original — not real designer brands.
 */

export type BottleShape = "classic" | "tall" | "round";

export type Category = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceKobo: number;
  compareAtPriceKobo: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  sizeMl: number;
  concentration: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  /** Preview-only: liquid colour and silhouette for the placeholder bottle art. */
  tone: string;
  bottle: BottleShape;
  createdAt: string;
};

export const categories: Category[] = [
  { id: "cat_women", name: "For Her", slug: "for-her", tagline: "Florals, musks and luminous woods" },
  { id: "cat_men", name: "For Him", slug: "for-him", tagline: "Leather, vetiver and warm spice" },
  { id: "cat_unisex", name: "Unisex", slug: "unisex", tagline: "Shared scents, no rules" },
  { id: "cat_oud", name: "Oud & Oriental", slug: "oud-oriental", tagline: "Deep, resinous and unforgettable" },
];

const naira = (amount: number) => amount * 100;

export const products: Product[] = [
  {
    id: "p_oud_royale",
    name: "Oud Royale",
    slug: "oud-royale",
    description:
      "A regal composition of aged oud and Bulgarian rose, softened by saffron and a trail of warm amber. Made for evenings that deserve to be remembered.",
    priceKobo: naira(185_000),
    compareAtPriceKobo: naira(210_000),
    stock: 14,
    isActive: true,
    isFeatured: true,
    categoryId: "cat_oud",
    sizeMl: 100,
    concentration: "Extrait de Parfum",
    topNotes: ["Saffron", "Pink Pepper"],
    heartNotes: ["Bulgarian Rose", "Oud"],
    baseNotes: ["Amber", "Sandalwood", "Musk"],
    tone: "#5A1422",
    bottle: "classic",
    createdAt: "2026-09-20T09:00:00Z",
  },
  {
    id: "p_rose_minuit",
    name: "Rose de Minuit",
    slug: "rose-de-minuit",
    description:
      "Midnight rose wrapped in velvet plum and dark patchouli. Romantic, a little mysterious, and impossible to forget.",
    priceKobo: naira(128_000),
    compareAtPriceKobo: null,
    stock: 22,
    isActive: true,
    isFeatured: true,
    categoryId: "cat_women",
    sizeMl: 75,
    concentration: "Eau de Parfum",
    topNotes: ["Plum", "Bergamot"],
    heartNotes: ["Damask Rose", "Peony"],
    baseNotes: ["Patchouli", "Vanilla"],
    tone: "#8C2F45",
    bottle: "round",
    createdAt: "2026-09-18T09:00:00Z",
  },
  {
    id: "p_ambre_dore",
    name: "Ambre Doré",
    slug: "ambre-dore",
    description:
      "Golden amber warmed with tonka bean and a hint of honeyed tobacco. A glowing, skin-close scent that lingers beautifully.",
    priceKobo: naira(142_000),
    compareAtPriceKobo: null,
    stock: 9,
    isActive: true,
    isFeatured: true,
    categoryId: "cat_unisex",
    sizeMl: 100,
    concentration: "Eau de Parfum",
    topNotes: ["Mandarin", "Cardamom"],
    heartNotes: ["Honey", "Tobacco Leaf"],
    baseNotes: ["Amber", "Tonka Bean", "Benzoin"],
    tone: "#C08A2E",
    bottle: "tall",
    createdAt: "2026-09-15T09:00:00Z",
  },
  {
    id: "p_santal_blanc",
    name: "Santal Blanc",
    slug: "santal-blanc",
    description:
      "Creamy sandalwood and white musk with a whisper of fig. Clean, soft and quietly luxurious — an everyday signature.",
    priceKobo: naira(96_000),
    compareAtPriceKobo: naira(110_000),
    stock: 30,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_unisex",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    topNotes: ["Fig Leaf", "Cardamom"],
    heartNotes: ["Iris", "Violet"],
    baseNotes: ["Sandalwood", "White Musk", "Cedar"],
    tone: "#D8C6B4",
    bottle: "classic",
    createdAt: "2026-09-12T09:00:00Z",
  },
  {
    id: "p_velours_noir",
    name: "Velours Noir",
    slug: "velours-noir",
    description:
      "Black velvet in a bottle: smoky incense, dark leather and a heart of spiced rum. Bold, confident and made to be noticed.",
    priceKobo: naira(158_000),
    compareAtPriceKobo: null,
    stock: 11,
    isActive: true,
    isFeatured: true,
    categoryId: "cat_men",
    sizeMl: 100,
    concentration: "Eau de Parfum",
    topNotes: ["Black Pepper", "Elemi"],
    heartNotes: ["Spiced Rum", "Incense"],
    baseNotes: ["Leather", "Labdanum", "Vetiver"],
    tone: "#2A1A1C",
    bottle: "tall",
    createdAt: "2026-09-10T09:00:00Z",
  },
  {
    id: "p_jardin_lagos",
    name: "Jardin de Lagos",
    slug: "jardin-de-lagos",
    description:
      "A sunlit garden after the rain — frangipani, neroli and fresh green leaves over soft musk. Bright, joyful and effortlessly elegant.",
    priceKobo: naira(88_000),
    compareAtPriceKobo: null,
    stock: 26,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_women",
    sizeMl: 75,
    concentration: "Eau de Parfum",
    topNotes: ["Neroli", "Green Leaves"],
    heartNotes: ["Frangipani", "Jasmine Sambac"],
    baseNotes: ["Soft Musk", "Driftwood"],
    tone: "#E3C59B",
    bottle: "round",
    createdAt: "2026-09-08T09:00:00Z",
  },
  {
    id: "p_cuir_imperial",
    name: "Cuir Impérial",
    slug: "cuir-imperial",
    description:
      "Supple leather, birch smoke and a touch of saffron. Polished and powerful, like a perfectly tailored suit.",
    priceKobo: naira(172_000),
    compareAtPriceKobo: null,
    stock: 4,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_men",
    sizeMl: 100,
    concentration: "Extrait de Parfum",
    topNotes: ["Saffron", "Bergamot"],
    heartNotes: ["Birch Smoke", "Violet Leaf"],
    baseNotes: ["Leather", "Oakmoss", "Cedar"],
    tone: "#6B3A2A",
    bottle: "classic",
    createdAt: "2026-09-05T09:00:00Z",
  },
  {
    id: "p_fleur_soie",
    name: "Fleur de Soie",
    slug: "fleur-de-soie",
    description:
      "Silk-soft white florals — tuberose, orange blossom and a veil of powdery iris. Graceful and luminous from morning to night.",
    priceKobo: naira(112_000),
    compareAtPriceKobo: naira(125_000),
    stock: 18,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_women",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    topNotes: ["Pear", "Pink Pepper"],
    heartNotes: ["Tuberose", "Orange Blossom"],
    baseNotes: ["Iris", "Cashmeran"],
    tone: "#EBD3D0",
    bottle: "round",
    createdAt: "2026-09-02T09:00:00Z",
  },
  {
    id: "p_vetiver_sauvage",
    name: "Vétiver Sauvage",
    slug: "vetiver-sauvage",
    description:
      "Earthy Haitian vetiver sharpened with grapefruit and ginger. Fresh, green and endlessly wearable in the heat.",
    priceKobo: naira(94_000),
    compareAtPriceKobo: null,
    stock: 0,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_men",
    sizeMl: 75,
    concentration: "Eau de Toilette",
    topNotes: ["Grapefruit", "Ginger"],
    heartNotes: ["Geranium", "Clary Sage"],
    baseNotes: ["Vetiver", "Ambroxan"],
    tone: "#8A8A5C",
    bottle: "tall",
    createdAt: "2026-08-28T09:00:00Z",
  },
  {
    id: "p_nuit_or",
    name: "Nuit d'Or",
    slug: "nuit-dor",
    description:
      "A golden night of oud, dark vanilla and smoked cinnamon. Opulent and enveloping — our most indulgent blend.",
    priceKobo: naira(245_000),
    compareAtPriceKobo: null,
    stock: 6,
    isActive: true,
    isFeatured: true,
    categoryId: "cat_oud",
    sizeMl: 100,
    concentration: "Extrait de Parfum",
    topNotes: ["Cinnamon", "Clove"],
    heartNotes: ["Oud", "Dark Vanilla"],
    baseNotes: ["Myrrh", "Agarwood", "Amber"],
    tone: "#3A0E17",
    bottle: "classic",
    createdAt: "2026-08-25T09:00:00Z",
  },
  {
    id: "p_musc_celeste",
    name: "Musc Céleste",
    slug: "musc-celeste",
    description:
      "An airy cloud of white musk, pear and soft cotton flowers. Like fresh linen and warm skin — comforting and serene.",
    priceKobo: naira(78_000),
    compareAtPriceKobo: null,
    stock: 40,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_unisex",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    topNotes: ["Pear", "Aldehydes"],
    heartNotes: ["Cotton Flower", "Lily of the Valley"],
    baseNotes: ["White Musk", "Ambrette"],
    tone: "#E9E1D6",
    bottle: "round",
    createdAt: "2026-08-20T09:00:00Z",
  },
  {
    id: "p_encens_sacre",
    name: "Encens Sacré",
    slug: "encens-sacre",
    description:
      "Sacred frankincense and myrrh over cool papyrus and smoked woods. Meditative, resinous and deeply calming.",
    priceKobo: naira(134_000),
    compareAtPriceKobo: null,
    stock: 12,
    isActive: true,
    isFeatured: false,
    categoryId: "cat_oud",
    sizeMl: 75,
    concentration: "Eau de Parfum",
    topNotes: ["Elemi", "Pink Pepper"],
    heartNotes: ["Frankincense", "Papyrus"],
    baseNotes: ["Myrrh", "Guaiac Wood"],
    tone: "#7A5A48",
    bottle: "tall",
    createdAt: "2026-08-15T09:00:00Z",
  },
];

export function categoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
