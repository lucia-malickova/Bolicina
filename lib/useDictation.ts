"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "./i18n";

// Minimal typing for the browser Web Speech API (not in TypeScript's DOM lib).
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionCtor = new () => Recognition;

function ctor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Voice-to-text with the browser's built-in recogniser; `supported` is false where there is none. */
export function useDictation(lang: Lang, onText: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const rec = useRef<Recognition | null>(null);
  const cb = useRef(onText);
  cb.current = onText;

  useEffect(() => setSupported(!!ctor()), []);
  useEffect(() => () => rec.current?.stop(), []);

  const toggle = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const C = ctor();
    if (!C) return;
    const r = new C();
    r.lang = lang === "it" ? "it-IT" : "en-GB";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      cb.current(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  return { supported, listening, toggle };
}
