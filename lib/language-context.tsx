"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, RTL_LOCALES, translations } from "./i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("hm_locale") as Locale | null;
    if (saved && ["en", "he", "ar"].includes(saved)) setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("hm_locale", l);
  };

  const isRTL = RTL_LOCALES.includes(locale);

  const t = (key: string): string =>
    translations[locale]?.[key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
