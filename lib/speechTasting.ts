import type { Again, Bubbles } from "./tasting";
import type { Aroma } from "./wines";

export interface Heard {
  sweet?: number;
  bubbles?: Bubbles;
  aroma?: Aroma;
  again?: Again;
}

const NOT = /\b(non|no|not|niente|nothing|never|mai|don'?t|wouldn'?t)\b[^.,;!?]{0,20}$/i;

/** True if `re` matches and the words just before it don't negate it. */
function said(text: string, re: RegExp) {
  const m = re.exec(text);
  return !!m && !NOT.test(text.slice(0, m.index));
}
function negated(text: string, re: RegExp) {
  const m = re.exec(text);
  return !!m && NOT.test(text.slice(0, m.index));
}

/** Reads a spoken or typed tasting note (Italian or English) into the four tasting answers. */
export function parseTastingSpeech(raw: string): Heard {
  const text = ` ${raw.toLowerCase()} `;
  const h: Heard = {};

  if (said(text, /molto dolce|very sweet/)) h.sweet = 5;
  else if (negated(text, /dolc|sweet/)) h.sweet = 2;
  else if (said(text, /molto secco|very dry|extra brut|secchissimo/)) h.sweet = 1;
  else if (said(text, /\bsecc|\bdry\b|asciutt/)) h.sweet = 1.5;
  else if (said(text, /equilibrat|balanced|giusto|just right/)) h.sweet = 3;
  else if (said(text, /morbid|\bsoft\b|abboccat|amabil/)) h.sweet = 3.5;
  else if (said(text, /dolc|sweet/)) h.sweet = 4;

  if (said(text, /esplos|explosive|tantissime bollicine|lots of bubbles|frizzantissim/)) h.bubbles = "explosive";
  else if (said(text, /delicat|gentle|fini\b|fine bubbles|poche bollicine|few bubbles|piatt|\bflat\b|sgasat/)) h.bubbles = "delicate";
  else if (said(text, /vivac|lively|frizzant|bubbly|bollicine/)) h.bubbles = "lively";

  if (said(text, /mineral|sapid|salat|saline|salty|\bmare\b|\bsea\b/)) h.aroma = "mineral";
  else if (said(text, /pesca|albicocc|banana|ananas|frutta gialla|tropical|peach|apricot|pineapple|yellow fruit/)) h.aroma = "yellowFruit";
  else if (said(text, /\bmela|\bpera\b|apple|\bpear\b|agrum|limone|lemon|citrus/)) h.aroma = "apple";
  else if (said(text, /fior|flower|floral|glicine|acacia|gelsomino|rosa\b|jasmine/)) h.aroma = "flowers";

  if (/forse|maybe|perhaps|non so|not sure/.test(text)) h.again = "maybe";
  else if (negated(text, /ricompr|riprender|buy (it )?again|comprerei|would buy|mi piace|like it/)) h.again = "no";
  else if (said(text, /ricompr|riprender|buy (it )?again|comprerei|would buy|lo compro|mi piace|love it|adoro/)) h.again = "yes";

  return h;
}
