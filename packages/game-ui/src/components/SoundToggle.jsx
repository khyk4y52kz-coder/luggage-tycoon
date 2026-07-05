"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";
import { isSoundMuted, setSoundMuted, resumeAudio, playGameSound } from "../audio/gameSounds.js";

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
  };
}

export default function SoundToggle() {
  const { t } = useLanguage();
  const [muted, setMuted] = useState(isSoundMuted);

  useEffect(() => {
    setMuted(isSoundMuted());
  }, []);

  const toggle = () => {
    resumeAudio();
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    if (!next) playGameSound("click");
  };

  return (
    <button
      onClick={toggle}
      style={btnStyle(!muted)}
      aria-label={muted ? t.soundOff : t.soundOn}
      title={muted ? t.soundOff : t.soundOn}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}