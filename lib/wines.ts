import type { L10n } from "./i18n";

export type WineId =
  | "audace"
  | "valdobbiadene"
  | "bio"
  | "medea"
  | "frizzante"
  | "soe"
  | "chardonnay"
  | "ice"
  | "zero";

export type Aroma = "flowers" | "apple" | "yellowFruit" | "mineral";

export const AROMAS: Record<Aroma, L10n> = {
  flowers: { it: "Fiori bianchi", en: "White flowers" },
  apple: { it: "Mela", en: "Apple" },
  yellowFruit: { it: "Frutta gialla", en: "Yellow fruit" },
  mineral: { it: "Sapido, minerale", en: "Saline, mineral" },
};

export interface Wine {
  id: WineId;
  name: string;
  style: L10n;
  denomination: string;
  grapes: string;
  abv: number;
  sugar: [number, number];
  serve: string;
  aromas: Aroma[];
  badge?: L10n;
  pitch: L10n;
  image: string;
  accent: string;
}

// All figures come from Serena Wines 1881 technical sheets (2025).
export const WINES: Record<WineId, Wine> = {
  audace: {
    id: "audace",
    name: "Audace",
    style: { it: "Extra Brut Millesimato 2021", en: "Extra Brut Vintage 2021" },
    denomination: "Prosecco DOC Trieste",
    grapes: "Glera",
    abv: 12,
    sugar: [6, 6],
    serve: "6–8 °C",
    aromas: ["mineral", "flowers", "apple"],
    badge: { it: "6.492 bottiglie · affinato sotto il mare", en: "6,492 bottles · aged under the sea" },
    pitch: {
      it: "Affinato oltre quattro mesi a 20 metri di profondità nel Golfo di Trieste. Secco, sapido, di una mineralità mai sentita.",
      en: "Aged over four months, 20 metres deep in the Gulf of Trieste. Dry, saline, with a minerality you have never tasted.",
    },
    image: "/wines/audace-photo.webp",
    accent: "#3E8C8F",
  },
  valdobbiadene: {
    id: "valdobbiadene",
    name: "Valdobbiadene",
    style: { it: "Prosecco Superiore DOCG Brut", en: "Prosecco Superiore DOCG Brut" },
    denomination: "Valdobbiadene DOCG",
    grapes: "85% Glera · Chardonnay, Pinot Bianco",
    abv: 11,
    sugar: [9, 11],
    serve: "5–7 °C",
    aromas: ["flowers", "apple", "yellowFruit"],
    badge: { it: "DOCG · la collina", en: "DOCG · the hills" },
    pitch: {
      it: "Rosa e gelsomino, mela verde e ananas. Elegante, sapido, persistente.",
      en: "Rose and jasmine, green apple and pineapple. Elegant, saline, long.",
    },
    image: "/wines/valdobbiadene.webp",
    accent: "#A796D6",
  },
  bio: {
    id: "bio",
    name: "Prosecco Biologico",
    style: { it: "Prosecco DOC Brut", en: "Prosecco DOC Brut" },
    denomination: "Prosecco DOC",
    grapes: "85% Glera · Chardonnay, Pinot Bianco, Pinot Grigio",
    abv: 11,
    sugar: [8, 10],
    serve: "6–7 °C",
    aromas: ["flowers", "apple"],
    badge: { it: "Biologico · vegan friendly", en: "Organic · vegan friendly" },
    pitch: {
      it: "Fiori d'acacia e mela gialla. Fresco, armonico, da agricoltura biologica.",
      en: "Acacia blossom and yellow apple. Fresh, harmonious, organically farmed.",
    },
    image: "/wines/bio.webp",
    accent: "#7DB57A",
  },
  medea: {
    id: "medea",
    name: "Medea",
    style: { it: "Prosecco DOC Treviso Extra Dry", en: "Prosecco DOC Treviso Extra Dry" },
    denomination: "Prosecco DOC Treviso",
    grapes: "85% Glera · Chardonnay, Pinot Bianco, Pinot Grigio",
    abv: 11,
    sugar: [15, 17],
    serve: "6–7 °C",
    aromas: ["flowers", "apple"],
    pitch: {
      it: "Giovane ed euforico. Fiori bianchi e mela golden, morbido ed elegante.",
      en: "Young and exciting. White flowers and golden apple, soft and elegant.",
    },
    image: "/wines/medea.webp",
    accent: "#C99A6E",
  },
  frizzante: {
    id: "frizzante",
    name: "Prosecco Frizzante",
    style: { it: "Prosecco DOC Treviso Frizzante", en: "Prosecco DOC Treviso Frizzante" },
    denomination: "Prosecco DOC Treviso",
    grapes: "85% Glera · Chardonnay, Pinot Bianco, Pinot Grigio",
    abv: 10.5,
    sugar: [15, 18],
    serve: "7–9 °C",
    aromas: ["apple", "yellowFruit"],
    badge: { it: "Bollicina delicata", en: "Gentle bubbles" },
    pitch: {
      it: "Ricorda l'antica versione sur lie. Fruttato, fresco, armonico, con una bollicina gentile.",
      en: "Recalls the old sur lie style. Fruity, fresh, harmonious, with gentle bubbles.",
    },
    image: "/wines/frizzante.webp",
    accent: "#D9CDA2",
  },
  soe: {
    id: "soe",
    name: "Soe",
    style: { it: "Brut Millesimato", en: "Brut Vintage" },
    denomination: "Vino spumante",
    grapes: "51% Ribolla Gialla · 49% Chardonnay",
    abv: 11.5,
    sugar: [9, 9],
    serve: "6–8 °C",
    aromas: ["yellowFruit", "flowers"],
    badge: { it: "Non è un Prosecco", en: "Not a Prosecco" },
    pitch: {
      it: "Ribolla Gialla e Chardonnay. Mela golden, banana, glicine e iris. Fresco e morbido.",
      en: "Ribolla Gialla and Chardonnay. Golden apple, banana, wisteria and iris. Fresh and soft.",
    },
    image: "/wines/soe.webp",
    accent: "#C8A04A",
  },
  chardonnay: {
    id: "chardonnay",
    name: "Chardonnay",
    style: { it: "Vino Frizzante", en: "Sparkling Chardonnay" },
    denomination: "Vino frizzante",
    grapes: "Chardonnay",
    abv: 10.5,
    sugar: [14, 16],
    serve: "7–9 °C",
    aromas: ["apple", "mineral"],
    pitch: {
      it: "Crosta di pane e mela verde. Asciutto, sapido, di buona freschezza.",
      en: "Bread crust and green apple. Dry-tasting, saline, nicely fresh.",
    },
    image: "/wines/chardonnay.webp",
    accent: "#7DB6DE",
  },
  ice: {
    id: "ice",
    name: "Serena ICE",
    style: { it: "Spumante dolce", en: "Sweet sparkling" },
    denomination: "Vino spumante",
    grapes: "Selezione di uve bianche",
    abv: 10.5,
    sugar: [35, 39],
    serve: "6–7 °C",
    aromas: ["yellowFruit"],
    pitch: {
      it: "Pesca e albicocca. Dolce, armonico, fresco. Con i dolci o con formaggi piccanti.",
      en: "Peach and apricot. Sweet, harmonious, fresh. With desserts or spicy cheese.",
    },
    image: "/wines/ice.webp",
    accent: "#9ED3E6",
  },
  zero: {
    id: "zero",
    name: "Serena 0.0",
    style: { it: "Dealcolato Demi-Sec", en: "Alcohol-free Demi-Sec" },
    denomination: "Vino dealcolato",
    grapes: "Vino bianco UE",
    abv: 0,
    sugar: [44, 49],
    serve: "6–8 °C",
    aromas: ["yellowFruit", "flowers"],
    badge: { it: "0,0% alcol", en: "0.0% alcohol" },
    pitch: {
      it: "Perlage fine e persistente, bouquet delicato e fruttato. Tutto il brindisi, zero alcol.",
      en: "Fine, lasting bubbles and a delicate, fruity bouquet. The whole toast, zero alcohol.",
    },
    image: "/wines/zero.webp",
    accent: "#E0D46A",
  },
};

export const WINE_IDS = Object.keys(WINES) as WineId[];

const GLASS_ML = 125;

export function sugarMid(w: Wine) {
  return (w.sugar[0] + w.sugar[1]) / 2;
}

/** Grams of sugar in a 125 ml glass. */
export function sugarPerGlass(w: Wine) {
  return (sugarMid(w) * GLASS_ML) / 1000;
}

/** Estimated kcal in a 125 ml glass from alcohol (7 kcal/g) and sugar (4 kcal/g). */
export function kcalPerGlass(w: Wine) {
  const alcoholGrams = GLASS_ML * (w.abv / 100) * 0.789;
  return Math.round(alcoholGrams * 7 + sugarPerGlass(w) * 4);
}

/**
 * Real sweetness on the same 1–5 scale guests use, from residual sugar.
 * Logarithmic, because perceived sweetness grows roughly with the log of sugar.
 */
export function realSweetness(w: Wine) {
  return sweetnessFromSugar(sugarMid(w));
}

export function sweetnessFromSugar(gramsPerLitre: number) {
  const lo = Math.log(5);
  const hi = Math.log(47);
  const s = 1 + (4 * (Math.log(Math.max(1, gramsPerLitre)) - lo)) / (hi - lo);
  return Math.min(5, Math.max(1, s));
}

/** Same estimate as kcalPerGlass, for a wine that doesn't exist yet. */
export function kcalFor(abv: number, sugarGramsPerLitre: number) {
  return Math.round(GLASS_ML * (abv / 100) * 0.789 * 7 + ((sugarGramsPerLitre * GLASS_ML) / 1000) * 4);
}

/** Fixed decimals with IT/EN separators, built by hand so server and browser always agree. */
export function fmt(n: number, lang: "it" | "en", digits = 1) {
  const [whole, dec] = Math.abs(n).toFixed(digits).split(".");
  const sign = n < 0 && Number(n.toFixed(digits)) !== 0 ? "-" : "";
  return sign + int(Number(whole), lang) + (dec ? (lang === "it" ? "," : ".") + dec : "");
}

/** Integer with a thousands separator, identical on server and client (ICU builds differ). */
export function int(n: number, lang: "it" | "en") {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, lang === "it" ? "." : ",");
}

/** EU sparkling-wine sweetness category for a residual sugar level. */
export function dosage(gramsPerLitre: number) {
  if (gramsPerLitre <= 6) return "Extra Brut";
  if (gramsPerLitre <= 12) return "Brut";
  if (gramsPerLitre <= 17) return "Extra Dry";
  if (gramsPerLitre <= 32) return "Dry";
  return "Demi-Sec";
}
