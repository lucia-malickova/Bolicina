import type { L10n } from "./i18n";
import type { WineId } from "./wines";

export type Segment = "18-24" | "25-34" | "35-49" | "50-64" | "65+";
export const SEGMENTS: Segment[] = ["18-24", "25-34", "35-49", "50-64", "65+"];

export const MOODS = {
  tired: { it: "Giornata lunga", en: "Long day" },
  relaxed: { it: "Voglia di relax", en: "Unwinding" },
  festive: { it: "Voglia di festa", en: "Celebrating" },
  focused: { it: "Mente lucida", en: "Clear head" },
  curious: { it: "Voglia di novità", en: "Something new" },
  active: { it: "Fitness", en: "Fitness" },
  romantic: { it: "Romanticismo", en: "Romance" },
} satisfies Record<string, L10n>;

export const COMPANY = {
  alone: { it: "Da solo", en: "Alone" },
  couple: { it: "In coppia", en: "As a couple" },
  friends: { it: "Con amici", en: "With friends" },
  work: { it: "Lavoro", en: "Work" },
  family: { it: "Famiglia", en: "Family" },
} satisfies Record<string, L10n>;

export const MOMENTS = {
  evening: { it: "Serata a casa", en: "Evening in" },
  aperitivo: { it: "Aperitivo", en: "Aperitivo" },
  dinner: { it: "Cena", en: "Dinner" },
  party: { it: "Festa", en: "Party" },
  lunch: { it: "Pranzo", en: "Lunch" },
} satisfies Record<string, L10n>;

export type Mood = keyof typeof MOODS;
export type Company = keyof typeof COMPANY;
export type Moment = keyof typeof MOMENTS;

export interface Persona {
  id: string;
  name: string;
  age: number;
  segment: Segment;
  role: L10n;
  mood: Mood;
  company: Company;
  moment: Moment;
  message: L10n;
  wine: WineId;
  also?: WineId;
  reply: L10n;
  /** Usual sweetness preference on the 1–5 tasting scale. */
  usualSweet: number;
}

export const PERSONAS: Persona[] = [
  {
    id: "giulia",
    name: "Giulia",
    age: 38,
    segment: "35-49",
    role: { it: "Stanca dopo il lavoro", en: "Tired after work" },
    mood: "tired",
    company: "alone",
    moment: "evening",
    message: {
      it: "Giornata lunghissima. Sono a casa e voglio solo mettere i piedi sul divano.",
      en: "Endless day. I'm home and I just want to put my feet up.",
    },
    wine: "frizzante",
    reply: {
      it: "Allora niente di impegnativo, Giulia. Il nostro Prosecco Frizzante: bollicina gentile, solo 10,5% di alcol e un profumo di frutta fresca. Servilo a 7–9 °C, un calice, e la serata rallenta da sola.",
      en: "Then nothing demanding, Giulia. Our Prosecco Frizzante: gentle bubbles, only 10.5% alcohol and a fresh, fruity nose. Serve it at 7–9 °C, one glass, and the evening slows down on its own.",
    },
    usualSweet: 3,
  },
  {
    id: "marco",
    name: "Marco",
    age: 54,
    segment: "50-64",
    role: { it: "Vuole un vino da gustare", en: "Wants a wine to savour" },
    mood: "relaxed",
    company: "alone",
    moment: "evening",
    message: {
      it: "Stasera voglio un calice da gustare con calma. Qualcosa che abbia una storia.",
      en: "Tonight I want a glass to savour slowly. Something with a story.",
    },
    wine: "audace",
    reply: {
      it: "Audace, Marco. Solo 6.492 bottiglie, affinate per oltre quattro mesi a 20 metri di profondità nel Golfo di Trieste, al buio. Extra Brut, sapido, minerale: ogni sorso racconta il Carso. Se hai dei crudi di mare, è il suo momento.",
      en: "Audace, Marco. Only 6,492 bottles, aged over four months 20 metres deep in the Gulf of Trieste, in total darkness. Extra Brut, saline, mineral: every sip tells of the Karst. If you have raw seafood, this is its moment.",
    },
    usualSweet: 1.5,
  },
  {
    id: "luca",
    name: "Luca",
    age: 22,
    segment: "18-24",
    role: { it: "Festa con gli amici", en: "Party with friends" },
    mood: "festive",
    company: "friends",
    moment: "party",
    message: {
      it: "Festa a casa stasera, siamo in dieci. Qualcuno non beve alcol.",
      en: "House party tonight, ten of us. Some don't drink alcohol.",
    },
    wine: "ice",
    also: "zero",
    reply: {
      it: "Due bottiglie, zero compromessi. Serena ICE per chi brinda: fresco, pesca e albicocca, piace a tutti. E Serena 0.0 per chi non beve o guida: stesso perlage, zero alcol. Nessuno resta con il bicchiere vuoto.",
      en: "Two bottles, no compromise. Serena ICE for the toasts: fresh, peach and apricot, everyone likes it. And Serena 0.0 for those who don't drink or are driving: same bubbles, zero alcohol. Nobody is left with an empty glass.",
    },
    usualSweet: 4,
  },
  {
    id: "alessandra",
    name: "Alessandra",
    age: 45,
    segment: "35-49",
    role: { it: "Pranzo di lavoro", en: "Business lunch" },
    mood: "focused",
    company: "work",
    moment: "lunch",
    message: {
      it: "Pranzo con un cliente importante. Voglio fare bella figura, ma nel pomeriggio devo restare lucida.",
      en: "Lunch with an important client. I want to impress, but I need a clear head this afternoon.",
    },
    wine: "zero",
    reply: {
      it: "Serena 0.0, Alessandra. Brindi con il cliente, il perlage è fine e persistente, e alle tre del pomeriggio sei lucidissima. È pensato proprio per i pranzi di lavoro.",
      en: "Serena 0.0, Alessandra. You toast with your client, the bubbles are fine and lasting, and at three o'clock you are perfectly sharp. It was made for business lunches.",
    },
    usualSweet: 2.5,
  },
  {
    id: "chiara",
    name: "Chiara",
    age: 29,
    segment: "25-34",
    role: { it: "Aperitivo tra amiche", en: "Aperitivo with a friend" },
    mood: "relaxed",
    company: "friends",
    moment: "aperitivo",
    message: {
      it: "Aperitivo con la mia migliore amica. Due chiacchiere e qualcosa da stuzzicare.",
      en: "Aperitivo with my best friend. A long chat and a few nibbles.",
    },
    wine: "medea",
    reply: {
      it: "Medea Extra Dry, Chiara. Fiori bianchi e mela golden, morbido e vivace. Regge gli stuzzichini e le chiacchiere lunghe: il secondo calice arriva senza accorgervene.",
      en: "Medea Extra Dry, Chiara. White flowers and golden apple, soft and lively. It stands up to the nibbles and the long chat: the second glass arrives before you notice.",
    },
    usualSweet: 3,
  },
  {
    id: "giorgio",
    name: "Giorgio",
    age: 68,
    segment: "65+",
    role: { it: "Il rito del venerdì", en: "The Friday ritual" },
    mood: "relaxed",
    company: "couple",
    moment: "dinner",
    message: {
      it: "Ogni venerdì apro una bottiglia con mia moglie. Voglio sempre il meglio.",
      en: "Every Friday I open a bottle with my wife. I always want the best.",
    },
    wine: "valdobbiadene",
    reply: {
      it: "Il vostro venerdì merita la collina, Giorgio: Valdobbiadene DOCG Brut. Rosa e gelsomino, mela verde, sapido ed elegante. Servitelo a 5–7 °C. È il classico che non tradisce mai.",
      en: "Your Friday deserves the hills, Giorgio: Valdobbiadene DOCG Brut. Rose and jasmine, green apple, saline and elegant. Serve it at 5–7 °C. The classic that never lets you down.",
    },
    usualSweet: 2,
  },
  {
    id: "sofia",
    name: "Sofia",
    age: 26,
    segment: "25-34",
    role: { it: "Vuole scoprire", en: "Wants to discover" },
    mood: "curious",
    company: "couple",
    moment: "aperitivo",
    message: {
      it: "Voglio provare qualcosa di diverso. Non il solito Prosecco.",
      en: "I want to try something different. Not the usual Prosecco.",
    },
    wine: "soe",
    reply: {
      it: "Allora Soe, Sofia. Ribolla Gialla e Chardonnay, millesimato: mela golden, banana e un tocco di glicine e iris. Non è un Prosecco, ed è proprio questo il punto.",
      en: "Then Soe, Sofia. Ribolla Gialla and Chardonnay, vintage: golden apple, banana and a touch of wisteria and iris. It isn't a Prosecco, and that is exactly the point.",
    },
    usualSweet: 2,
  },
  {
    id: "francesca",
    name: "Francesca",
    age: 34,
    segment: "25-34",
    role: { it: "Sportiva, conta tutto", en: "Athlete, counts everything" },
    mood: "active",
    company: "friends",
    moment: "aperitivo",
    message: {
      it: "Mi alleno cinque volte a settimana. Conto calorie e zuccheri. Cosa posso bere?",
      en: "I train five times a week. I count calories and sugar. What can I drink?",
    },
    wine: "audace",
    also: "zero",
    reply: {
      it: "Dipende da cosa conti, Francesca. Se conti lo zucchero: Audace, 0,8 g a calice, il più secco della gamma. Se conti le calorie: Serena 0.0, circa 23 kcal contro le 80–90 di uno spumante. Attenzione però: lo 0.0 ha più zucchero.",
      en: "It depends on what you count, Francesca. If it's sugar: Audace, 0.8 g per glass, the driest in the range. If it's calories: Serena 0.0, about 23 kcal against 80–90 for a sparkling wine. Careful though: the 0.0 has more sugar.",
    },
    usualSweet: 1.3,
  },
  {
    id: "anna",
    name: "Anna",
    age: 31,
    segment: "25-34",
    role: { it: "Vegana", en: "Vegan" },
    mood: "relaxed",
    company: "friends",
    moment: "aperitivo",
    message: {
      it: "Sono vegana. Cosa posso bere all'aperitivo senza pensieri?",
      en: "I'm vegan. What can I drink at aperitivo without a second thought?",
    },
    wine: "bio",
    reply: {
      it: "Prosecco Biologico Brut, Anna: da agricoltura biologica e certificato vegan friendly. Fiori d'acacia e mela gialla, fresco e armonico. Perfetto con verdure grigliate.",
      en: "Prosecco Biologico Brut, Anna: organically farmed and certified vegan friendly. Acacia blossom and yellow apple, fresh and harmonious. Perfect with grilled vegetables.",
    },
    usualSweet: 2,
  },
  {
    id: "paolo",
    name: "Paolo",
    age: 36,
    segment: "35-49",
    role: { it: "Anniversario", en: "Anniversary" },
    mood: "romantic",
    company: "couple",
    moment: "dinner",
    message: {
      it: "Cena romantica per il nostro anniversario. Vorrei stupirla.",
      en: "Romantic dinner for our anniversary. I want to surprise her.",
    },
    wine: "audace",
    also: "ice",
    reply: {
      it: "Apri con Audace, Paolo: un Prosecco affinato sotto il mare, una storia da raccontarle a tavola. Al dessert, Serena ICE: dolce e fresco, pesca e albicocca. Due calici, due momenti.",
      en: "Open with Audace, Paolo: a Prosecco aged under the sea, a story to tell her at the table. With dessert, Serena ICE: sweet and fresh, peach and apricot. Two glasses, two moments.",
    },
    usualSweet: 2,
  },
  {
    id: "davide",
    name: "Davide",
    age: 27,
    segment: "25-34",
    role: { it: "Stasera guida lui", en: "Designated driver" },
    mood: "festive",
    company: "friends",
    moment: "party",
    message: {
      it: "Stasera guido io, ma si festeggia e voglio brindare anche io.",
      en: "I'm driving tonight, but we're celebrating and I want to toast too.",
    },
    wine: "zero",
    reply: {
      it: "Brindi con tutti, Davide: Serena 0.0. Zero alcol, perlage fine, bouquet delicato e fruttato. Il calice è pieno anche per chi guida.",
      en: "You toast with everyone, Davide: Serena 0.0. Zero alcohol, fine bubbles, a delicate, fruity bouquet. The glass is full for the driver too.",
    },
    usualSweet: 3,
  },
];
