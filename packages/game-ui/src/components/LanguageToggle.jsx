"use client";

import { useLanguage } from "./LanguageProvider";

function btnStyle(active) {
  return {
    background: active ? "#4a3a10" : "#2a2518",
    color: "#e8dcc8",
    border: active ? "2px solid #c9a96e" : "1px solid #4a3a22",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 10,
    padding: "4px 7px",
    letterSpacing: 0,
    fontWeight: active ? "bold" : "normal",
  };
}

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: "flex", gap: 2 }}>
      <button
        onClick={() => setLang("en")}
        style={btnStyle(lang === "en")}
        aria-label="English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLang("da")}
        style={btnStyle(lang === "da")}
        aria-label="Dansk"
        aria-pressed={lang === "da"}
      >
        DA
      </button>
    </div>
  );
}