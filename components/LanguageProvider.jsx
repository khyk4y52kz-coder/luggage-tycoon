"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  LANG_STORAGE_KEY,
  getTranslations,
  buildProducts,
  buildUpgrades,
  buildEvents,
  buildDemoSteps,
} from "../lib/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "da") setLangState(saved);
  }, []);

  const setLang = useCallback((next) => {
    setLangState(next);
    localStorage.setItem(LANG_STORAGE_KEY, next);
  }, []);

  const t = useMemo(() => getTranslations(lang), [lang]);
  const products = useMemo(() => buildProducts(lang), [lang]);
  const upgrades = useMemo(() => buildUpgrades(lang), [lang]);
  const events = useMemo(() => buildEvents(lang), [lang]);
  const demoSteps = useMemo(() => buildDemoSteps(lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.pageTitle;
  }, [lang, t.pageTitle]);

  const value = useMemo(
    () => ({ lang, setLang, t, products, upgrades, events, demoSteps }),
    [lang, setLang, t, products, upgrades, events, demoSteps],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}