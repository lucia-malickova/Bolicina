import type { L10n } from "./i18n";
import type { Company, Moment, Mood, Persona } from "./personas";
import { WINES, realSweetness } from "./wines";
import type { WineId } from "./wines";

export interface Recommendation {
  wine: WineId;
  also?: WineId;
  reply: L10n;
}

// Stand-in for the fine-tuned model: keyword routing over IT/EN free text.
// Checked on the raw text: here a negation is the wish itself ("senza alcol", "non troppo dolce").
const NO_ALCOHOL = /guid|driv|incint|pregnan|analcol|alcohol.?free|(no|senza|without|zero).?alcol|non bevo|don'?t drink|sober/i;
const NOT_SWEET = /\b(non|no|not|niente|nothing|senza|without|poco|less)\b[^.,;!?]{0,25}(dolc|sweet|zuccher|sugar)/i;
// Everything else: drop the few words after a negation so "non sono stanca" doesn't read as "stanca".
const NEGATED = /\b(non|no|not|senza|without|niente|nothing|never|mai|don'?t)\b[^.,;!?]{0,25}/gi;

const RULES: { re: RegExp; wine: WineId; also?: WineId }[] = [
  { re: /vegan|biolog|organic|\bbio\b/i, wine: "bio" },
  { re: /calori|zuccher|sugar|sport|palestr|gym|dieta|diet|allen|train/i, wine: "audace", also: "zero" },
  { re: /festa|festegg|celebrat|party|amici|friends|compleanno|birthday/i, wine: "ice", also: "zero" },
  { re: /dessert|dolce|sweet|torta|cake|pasticc/i, wine: "ice" },
  { re: /romant|anniversar|stupir|surprise|impress/i, wine: "audace", also: "ice" },
  { re: /pesce|fish|crud|seafood|ostric|oyster|sushi|asia|\bmare\b|\bsea\b/i, wine: "audace" },
  { re: /divers|different|nuov|\bnew\b|curios|scopr|discover/i, wine: "soe" },
  { re: /stanc|tired|divano|sofa|couch|relax|piedi|feet/i, wine: "frizzante" },
  { re: /pranzo|lunch|lavoro|work|client|meeting|riunion/i, wine: "zero" },
  { re: /venerd|friday|regalo|gift|meglio|best|classic|speciale|special/i, wine: "valdobbiadene" },
  { re: /aperitiv|stuzzic|nibble|snack/i, wine: "medea" },
];

const MOOD_WINE: Record<Mood, WineId> = {
  tired: "frizzante",
  relaxed: "medea",
  festive: "ice",
  focused: "zero",
  curious: "soe",
  active: "audace",
  romantic: "audace",
};

export function recommend(
  text: string,
  mood: Mood | undefined,
  company: Company | undefined,
  moment: Moment | undefined,
  persona: Persona | undefined,
): Recommendation {
  if (persona && text.trim() === persona.message.it.trim()) return persona;
  if (persona && text.trim() === persona.message.en.trim()) return persona;

  const positive = text.replace(NEGATED, " ");
  const rule = NO_ALCOHOL.test(text)
    ? { wine: "zero" as WineId, also: undefined }
    : NOT_SWEET.test(text)
      ? { wine: "audace" as WineId, also: undefined }
      : RULES.find((r) => r.re.test(positive));
  let wine: WineId = rule?.wine ?? (mood ? MOOD_WINE[mood] : "medea");
  let also = rule?.also;
  if (!rule && moment === "dinner" && company === "couple") {
    wine = "audace";
    also = "ice";
  }
  if (!rule && moment === "party") {
    wine = "ice";
    also = "zero";
  }
  if (!rule && moment === "lunch" && company === "work") wine = "zero";

  const w = WINES[wine];
  const who = persona ? `, ${persona.name}` : "";
  const alsoLine = also
    ? {
        it: ` E per chi vuole altro: ${WINES[also].name}.`,
        en: ` And for anyone after something else: ${WINES[also].name}.`,
      }
    : { it: "", en: "" };
  return {
    wine,
    also,
    reply: {
      it: `Ti consiglio ${w.name}${who}. ${w.pitch.it} Servilo a ${w.serve}.${alsoLine.it}`,
      en: `I'd pour you ${w.name}${who}. ${w.pitch.en} Serve it at ${w.serve}.${alsoLine.en}`,
    },
  };
}

export type Fit = "match" | "sweeter" | "drier";

/** How a scanned wine compares with the guest's usual sweetness. */
export function fitFor(wine: WineId, usualSweet: number): Fit {
  const d = realSweetness(WINES[wine]) - usualSweet;
  if (d > 0.9) return "sweeter";
  if (d < -0.9) return "drier";
  return "match";
}
