"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "./types";
import { Locale } from "./i18n";
import { detectScript, translateText } from "./translate";

type TranslationResult = { translatedText: string; sourceLanguage: string };

export function useMessageTranslation(messages: Message[], locale: Locale) {
  const [translations, setTranslations] = useState<Record<string, TranslationResult>>({});
  const [revealedOriginal, setRevealedOriginal] = useState<Record<string, boolean>>({});
  const inFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const msg of messages) {
      if (!msg.text) continue;
      if (translations[msg.id] || inFlight.current.has(msg.id)) continue;
      if (detectScript(msg.text) === locale) continue;

      inFlight.current.add(msg.id);
      translateText(msg.text, locale)
        .then((result) => {
          setTranslations((prev) => ({ ...prev, [msg.id]: result }));
        })
        .catch(() => {
          // Leave untranslated on failure; original text still renders.
        })
        .finally(() => {
          inFlight.current.delete(msg.id);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, locale]);

  const toggleOriginal = (id: string) => {
    setRevealedOriginal((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    translations,
    isRevealed: (id: string) => !!revealedOriginal[id],
    toggleOriginal,
  };
}
