"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import en from "@/server/services/i18n/dictionaries/en.json";
import es from "@/server/services/i18n/dictionaries/es.json";

const dictionaries = { en, es };
export type Lang = "en" | "es";

type I18nContextType = {
  lang: Lang;
  t: typeof en;
  setLang: (lang: Lang) => void;
  isPending: boolean;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    // Write cookie so server is aware on next requests
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    
    startTransition(() => {
      router.refresh();
    });
  };

  const t = dictionaries[lang];

  return (
    <I18nContext.Provider value={{ lang, t, setLang, isPending }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider initialLang={initialLang}>{children}</I18nProvider>
    </NextThemeProvider>
  );
}
