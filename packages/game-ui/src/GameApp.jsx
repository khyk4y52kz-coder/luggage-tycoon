"use client";

import { LanguageProvider } from "./components/LanguageProvider.jsx";
import BagBusinessTycoon from "./components/BagBusinessTycoon.jsx";

export default function GameApp() {
  return (
    <LanguageProvider>
      <BagBusinessTycoon />
    </LanguageProvider>
  );
}