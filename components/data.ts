export type WineId = "black" | "gold";

export interface Wine {
  id: WineId;
  name: string;
  notes: string;
  pairing: string;
  style: string;
  serve: string;
}

export const WINES: Record<WineId, Wine> = {
  black: {
    id: "black",
    name: "Bollicina Black Label DOCG",
    notes:
      "Fine, persistent perlage. Green apple, white peach and warm brioche crust, closing on a chalky, saline finish of remarkable length.",
    pairing:
      "Raw oysters and langoustine crudo; aged Parmigiano Reggiano; tempura of spring vegetables.",
    style: "Brut · DOCG",
    serve: "6–8 °C",
  },
  gold: {
    id: "gold",
    name: "Bollicina Gold Reserve",
    notes:
      "Extended ageing on the lees. Candied lemon, acacia honey and toasted hazelnut over a creamy mousse and a long mineral close.",
    pairing:
      "Butter-poached lobster; white truffle risotto; Comté aged 24 months; roasted Bresse chicken.",
    style: "Riserva · Extra Brut",
    serve: "8–10 °C",
  },
};

export const SENSORY_QUESTIONS = [
  { key: "structure", label: "Structure", options: ["Light", "Balanced", "Full"] },
  { key: "acidity", label: "Acidity", options: ["Crisp", "Harmonic", "Soft"] },
  { key: "note", label: "Dominant Note", options: ["Citrus", "Floral", "Mineral"] },
] as const;

export type SensoryKey = (typeof SENSORY_QUESTIONS)[number]["key"];

export const SENSORY_MAPPING = [
  { note: "Citrus", share: 54 },
  { note: "Floral", share: 30 },
  { note: "Mineral", share: 16 },
];

/** Mock concierge: keyword routing until a local LLM endpoint is wired in. */
export function conciergeReply(question: string, wine: Wine): string {
  const t = question.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has("sushi", "sashimi", "fish", "oyster", "seafood"))
    return "For raw fish I recommend the Black Label DOCG — its saline minerality and crisp acidity lift the delicacy of sashimi without overwhelming it. Avoid heavy soy; a touch of yuzu is sublime.";
  if (has("gold", "reserve"))
    return "The Gold Reserve craves richness: butter-poached lobster, a white truffle risotto, or a 24-month Comté. Its honeyed depth mirrors the fat, while the mousse keeps the palate bright.";
  if (has("temperat", "serve", "cold", "glass"))
    return "Serve the Black Label at 6–8 °C to preserve its tension; the Gold Reserve opens beautifully at 8–10 °C in a tulip glass rather than a flute.";
  if (has("dessert", "sweet", "chocolate"))
    return "Our cuvées are dry by design. With dessert, favour citrus tarts or almond pastries — the Gold Reserve will echo their nutty notes gracefully.";
  if (has("cheese"))
    return "Aged hard cheeses are a triumph with both cuvées: Parmigiano Reggiano with the Black Label, a nutty Comté with the Gold Reserve.";
  return `An excellent question. With the ${wine.name}, I would suggest: ${wine.pairing} Shall I tailor this to a specific occasion?`;
}
