"use client";

import { useLanguage } from "./LanguageProvider";
import LanguageToggle from "./LanguageToggle";
import SoundToggle from "./SoundToggle";
import { resumeAudio, playGameSound } from "../audio/gameSounds.js";

export default function SplashScreen({ onContinue }) {
  const { t } = useLanguage();

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(201, 169, 110, 0.25); }
          50% { text-shadow: 0 0 32px rgba(201, 169, 110, 0.45); }
        }
        .splash-content { animation: splashFadeIn 0.7s ease-out; }
        .splash-title { animation: splashGlow 3s ease-in-out infinite; }
      `}</style>

      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 4 }}>
        <SoundToggle />
        <LanguageToggle />
      </div>

      <div className="splash-content" style={contentStyle}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🧳</div>
        <h1 className="splash-title" style={titleStyle}>{t.splash.headline}</h1>
        <p style={taglineStyle}>{t.splash.tagline}</p>
        <div style={pillStyle}>{t.splash.subline}</div>
        <button
          onClick={() => {
            resumeAudio();
            playGameSound("enter");
            onContinue();
          }}
          style={enterBtnStyle}
        >
          {t.splash.enter}
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(8, 6, 4, 0.92)",
  fontFamily: "'Courier New', Courier, monospace",
  color: "#e8dcc8",
  padding: 24,
};

const contentStyle = {
  textAlign: "center",
  maxWidth: 480,
};

const titleStyle = {
  margin: "0 0 16px",
  fontSize: 26,
  color: "#c9a96e",
  textTransform: "uppercase",
  letterSpacing: 3,
  lineHeight: 1.3,
};

const taglineStyle = {
  margin: "0 0 20px",
  fontSize: 14,
  color: "#a09880",
  lineHeight: 1.6,
};

const pillStyle = {
  display: "inline-block",
  fontSize: 11,
  color: "#8a7a60",
  letterSpacing: 2,
  textTransform: "uppercase",
  border: "1px solid #3a3020",
  borderRadius: 20,
  padding: "6px 16px",
  marginBottom: 28,
  background: "#1a1410",
};

const enterBtnStyle = {
  background: "#4a3a10",
  color: "#e8dcc8",
  border: "2px solid #c9a96e",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 15,
  padding: "12px 32px",
  letterSpacing: 1,
  textTransform: "uppercase",
};