"use client";

import { useLanguage } from "@/lib/language-context";
import { Locale } from "@/lib/i18n";

const LANGS: { locale: Locale; label: string; flag: string }[] = [
  { locale: "en", label: "EN",  flag: "🇺🇸" },
  { locale: "he", label: "עב", flag: "🇮🇱" },
  { locale: "ar", label: "عر", flag: "🇸🇦" },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`flex items-center gap-1 rounded-2xl bg-gray-100 p-1 ${compact ? "text-xs" : "text-sm"}`}>
      {LANGS.map(({ locale: l, label, flag }) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`rounded-xl px-2.5 py-1.5 font-bold transition ${
            locale === l
              ? "bg-white text-violet-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {flag} {label}
        </button>
      ))}
    </div>
  );
}
