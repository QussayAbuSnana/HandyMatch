import { Locale } from "./i18n";

const HEBREW_RANGE = /[֐-׿]/;
const ARABIC_RANGE = /[؀-ۿ]/;

/** Cheap heuristic: guess the script a piece of text is written in. */
export function detectScript(text: string): Locale {
  if (HEBREW_RANGE.test(text)) return "he";
  if (ARABIC_RANGE.test(text)) return "ar";
  return "en";
}

export async function translateText(
  text: string,
  targetLocale: Locale
): Promise<{ translatedText: string; sourceLanguage: string }> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLocale }),
  });
  if (!res.ok) {
    throw new Error("Translation request failed");
  }
  return res.json();
}
