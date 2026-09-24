export type Lang = "it" | "en";
export type L10n = Record<Lang, string>;

export const UI = {
  brandTag: { it: "Il sommelier che ti conosce", en: "The sommelier who knows you" },
  stageTitle: { it: "Un sommelier per ogni cliente", en: "A sommelier for every guest" },
  stageLead: {
    it: "Scegli un cliente. Tutto ciò che fa nell'app arriva in cantina, in tempo reale.",
    en: "Pick a guest. Everything they do in the app reaches the winery in real time.",
  },
  guests: { it: "Undici clienti, undici momenti", en: "Eleven guests, eleven moments" },
  simulation: {
    it: "Risposte simulate del modello che verrà addestrato sui dati Serena",
    en: "Simulated answers from the model to be trained on Serena's data",
  },
  tryPhone: { it: "Provalo sul tuo telefono", en: "Try it on your phone" },
  tryPhoneHint: {
    it: "Inquadra il codice: le tue risposte compaiono qui.",
    en: "Scan the code: your answers appear here.",
  },

  askSommelier: { it: "Chiedi al sommelier", en: "Ask the sommelier" },
  scanBottle: { it: "Scansiona la bottiglia", en: "Scan a bottle" },
  hello: { it: "Ciao", en: "Hello" },
  homeLead: { it: "Cosa beviamo oggi?", en: "What are we drinking today?" },
  howFeel: { it: "Come ti senti?", en: "How do you feel?" },
  withWhom: { it: "Con chi?", en: "With whom?" },
  moment: { it: "Il momento", en: "The moment" },
  tellMore: { it: "Raccontami di più…", en: "Tell me more…" },
  send: { it: "Chiedi", en: "Ask" },
  thinking: { it: "Il sommelier sta scegliendo", en: "The sommelier is choosing" },
  forYou: { it: "Per te", en: "For you" },
  alsoFor: { it: "E anche", en: "And also" },
  tasteNow: { it: "Degusta ora", en: "Taste it now" },
  order: { it: "Ordina", en: "Order" },
  orderSoon: { it: "E-shop Serena · in arrivo", en: "Serena e-shop · coming soon" },
  back: { it: "Indietro", en: "Back" },
  perGlass: { it: "a calice", en: "per glass" },
  sugar: { it: "zucchero", en: "sugar" },
  alcohol: { it: "alcol", en: "alcohol" },
  serve: { it: "Servire a", en: "Serve at" },

  scanTitle: { it: "Inquadra l'etichetta", en: "Frame the label" },
  scanHint: { it: "Tocca una bottiglia per simulare la scansione", en: "Tap a bottle to simulate the scan" },
  recognised: { it: "Riconosciuto", en: "Recognised" },
  matchYou: { it: "In linea con i tuoi gusti", en: "Right in line with your taste" },
  sweeterThanYou: { it: "Più dolce di quello che scegli di solito", en: "Sweeter than what you usually pick" },
  drierThanYou: { it: "Più secco di quello che scegli di solito", en: "Drier than what you usually pick" },

  tastingTitle: { it: "Il tuo assaggio", en: "Your tasting" },
  tastingLead: { it: "Quattro gesti, come un sommelier.", en: "Four gestures, like a sommelier." },
  qSweet: { it: "Quanto lo senti dolce?", en: "How sweet does it feel?" },
  dry: { it: "Secco", en: "Dry" },
  balanced: { it: "Equilibrato", en: "Balanced" },
  sweet: { it: "Dolce", en: "Sweet" },
  confirm: { it: "Conferma", en: "Confirm" },
  qBubbles: { it: "Com'è il perlage?", en: "How are the bubbles?" },
  bDelicate: { it: "Delicato", en: "Delicate" },
  bLively: { it: "Vivace", en: "Lively" },
  bExplosive: { it: "Esplosivo", en: "Explosive" },
  qAroma: { it: "Cosa senti al naso?", en: "What do you smell?" },
  qAgain: { it: "Lo ricompreresti?", en: "Would you buy it again?" },
  yes: { it: "Sì", en: "Yes" },
  maybe: { it: "Forse", en: "Maybe" },
  no: { it: "No", en: "No" },
  seconds: { it: "s", en: "s" },

  youAre: { it: "Il tuo profilo", en: "Your profile" },
  precision: { it: "Il sommelier ti conosce al", en: "The sommelier knows you at" },
  nextTry: { it: "Da provare la prossima volta", en: "Try next time" },
  done: { it: "Torna all'inizio", en: "Back to start" },

  ageQ: { it: "Per consigliarti meglio: quanti anni hai?", en: "To guide you better: how old are you?" },

  dashTitle: { it: "Intelligenza di cantina", en: "Winery intelligence" },
  dashLead: {
    it: "Cosa sentono davvero i vostri clienti, e cosa sceglieranno domani.",
    en: "What your guests really taste, and what they will choose tomorrow.",
  },
  live: { it: "In diretta", en: "Live" },
  illustrative: { it: "Dati illustrativi + sessione live", en: "Illustrative data + live session" },
  kTastings: { it: "Degustazioni registrate", en: "Tastings recorded" },
  kTastingsCap: { it: "ognuna con contesto e profilo sensoriale", en: "each with context and sensory profile" },
  kAgain: { it: "Lo ricomprerebbero", en: "Would buy again" },
  kAgainCap: { it: "il segnale più predittivo per i prossimi 12 mesi", en: "the most predictive signal for the next 12 months" },
  kZero: { it: "Serena 0.0 tra gli under 25", en: "Serena 0.0 among under-25s" },
  kZeroCap: { it: "quota delle loro degustazioni, ultimo mese", en: "share of their tastings, last month" },
  thisSession: { it: "in questa sessione", en: "this session" },

  gapTitle: { it: "Percepito o reale?", en: "Perceived or real?" },
  gapLead: {
    it: "Dolcezza percepita dai clienti rispetto al residuo zuccherino della scheda tecnica. Nessun altro canale vi dà questo dato.",
    en: "Sweetness your guests perceive versus the residual sugar on the technical sheet. No other channel gives you this.",
  },
  real: { it: "Reale · scheda tecnica", en: "Real · technical sheet" },
  perceived: { it: "Percepita · clienti", en: "Perceived · guests" },
  gapNote: { it: "percepito più dolce di quanto sia", en: "perceived sweeter than it is" },
  gapNoteDry: { it: "percepito più secco di quanto sia", en: "perceived drier than it is" },
  tastings: { it: "degustazioni", en: "tastings" },

  segTitle: { it: "Chi beve cosa", en: "Who drinks what" },
  segLead: { it: "Tocca un gruppo.", en: "Tap a group." },
  topWine: { it: "Vino preferito", en: "Favourite wine" },
  topAroma: { it: "Aroma dominante", en: "Dominant aroma" },
  sweetPerc: { it: "Dolcezza percepita media", en: "Average perceived sweetness" },

  outTitle: { it: "I prossimi 12 mesi", en: "The next 12 months" },
  outLead: {
    it: "Quota di Serena 0.0 nelle degustazioni degli under 25: storico e previsione.",
    en: "Serena 0.0 share of under-25 tastings: history and forecast.",
  },
  history: { it: "Storico", en: "History" },
  forecast: { it: "Previsione", en: "Forecast" },
  outNote: {
    it: "Previsione illustrativa. Il modello reale verrà addestrato sui dati della cantina.",
    en: "Illustrative forecast. The real model will be trained on the winery's own data.",
  },
  outInsight: {
    it: "Chi arriva per primo sul no-alcol decide lo scaffale.",
    en: "Whoever gets to no-alcohol first owns the shelf.",
  },

  feedTitle: { it: "Ultime degustazioni", en: "Latest tastings" },
  feedEmpty: {
    it: "Completa un assaggio nel telefono: comparirà qui.",
    en: "Finish a tasting on the phone: it will appear here.",
  },
  guest: { it: "Ospite", en: "Guest" },
} satisfies Record<string, L10n>;

export type UIKey = keyof typeof UI;

export function t(key: UIKey, lang: Lang): string {
  return UI[key][lang];
}
