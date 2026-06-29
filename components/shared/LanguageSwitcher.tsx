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
    <div className="flex items-center gap-0.5 rounded-xl bg-gray-100 p-0.5">
      {LANGS.map(({ locale: l, label, flag }) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`rounded-lg px-1.5 py-1 text-xs font-bold transition ${
            locale === l
              ? "bg-white text-violet-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>{flag}</span>
          <span className={compact ? "hidden" : "hidden sm:inline ml-0.5"}>{label}</span>
        </button>
      ))}
    </div>
  );
}
