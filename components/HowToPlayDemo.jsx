"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "./LanguageProvider";
import { buildProducts } from "../lib/translations";

const AUTO_INTERVAL_MS = 4000;

export default function HowToPlayDemo({ onClose }) {
  const { t, lang, demoSteps } = useLanguage();
  const products = buildProducts(lang);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const next = useCallback(() => {
    setStep((s) => (s + 1) % demoSteps.length);
  }, [demoSteps.length]);

  const prev = useCallback(() => {
    setStep((s) => (s - 1 + demoSteps.length) % demoSteps.length);
  }, [demoSteps.length]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [playing, next]);

  const current = demoSteps[step];
  const mock = current.mock;

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes demoPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.7); }
          50% { box-shadow: 0 0 0 6px rgba(201, 169, 110, 0); }
        }
        @keyframes demoFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes demoCursor {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-2px, -2px); }
        }
        .demo-step-content { animation: demoFadeIn 0.4s ease-out; }
        .demo-pulse { animation: demoPulse 1.5s ease-in-out infinite; }
        .demo-cursor { animation: demoCursor 1s ease-in-out infinite; }
      `}</style>

      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#8a7a60", textTransform: "uppercase", letterSpacing: 1 }}>
              {t.demo.subtitle}
            </div>
            <h2 style={{ margin: "4px 0 0", fontSize: 18, color: "#c9a96e" }}>{current.title}</h2>
          </div>
          <button onClick={onClose} style={{ ...btnStyle("#3a3020"), fontSize: 11, padding: "4px 10px" }}>
            {t.demo.close}
          </button>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#a09880", lineHeight: 1.5 }}>
          {current.caption}
        </p>

        <div className="demo-step-content" style={{
          background: "#12100c", border: "2px solid #5a4a32", borderRadius: 6,
          padding: 12, marginBottom: 14, position: "relative",
        }}>
          <div style={{ fontSize: 10, color: "#6a5a40", marginBottom: 8, textAlign: "center" }}>
            {t.demo.livePreview}
          </div>

          <div style={{
            display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12,
            background: "#231e16", padding: "6px 10px", borderRadius: 4, marginBottom: 8,
            border: current.highlight === "stats" ? "2px solid #c9a96e" : "1px solid #3a3020",
            ...(current.highlight === "stats" ? { boxShadow: "0 0 12px rgba(201,169,110,0.3)" } : {}),
          }}>
            <span>💰 <b style={{ color: "#6dce6d" }}>${mock.money}</b></span>
            <span>💵 {t.revenue}: <b style={{ color: mock.revenue >= 10000 ? "#ffd700" : "#c9a96e" }}>${mock.revenue}</b>/10k</span>
            <span>⭐ {t.rep}: <b style={{ color: mock.rep >= 100 ? "#ffd700" : "#c9a96e" }}>{mock.rep}</b>/100</span>
            <span>{t.day} {mock.day}{mock.week ? ` · ${t.week} ${mock.week}` : ""}</span>
          </div>

          {mock.won && (
            <div style={{ textAlign: "center", background: "#2a3a1a", border: "2px solid #6dce6d", borderRadius: 4, padding: 10, marginBottom: 8, fontSize: 13 }}>
              {t.demo.youWinDemo(mock.day)}
            </div>
          )}

          {mock.crafting && (
            <div style={{ background: "#1e2a1e", border: "1px solid #3a5a3a", borderRadius: 4, padding: "5px 8px", marginBottom: 8, fontSize: 11 }}>
              🔨 {t.crafting}: {mock.crafting.map((c) => `${c.emoji} ${c.name} (${t.daysLeft(c.daysLeft)})`).join(" · ")}
            </div>
          )}

          {mock.inventory?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>{t.demo.inventory}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {mock.inventory.map((item) => (
                  <div
                    key={item.name}
                    className={mock.pulse === "sell-btn" ? "demo-pulse" : ""}
                    style={{
                      ...btnStyle("#3a3020"), fontSize: 11, padding: "4px 8px",
                      border: current.highlight === "inventory" ? "2px solid #c9a96e" : "1px solid #4a3a22",
                      position: "relative",
                    }}
                  >
                    {item.emoji} {item.name} ×{item.count}
                    {mock.pulse === "sell-btn" && <span className="demo-cursor" style={cursorStyle}>👆</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>{t.craft}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <div
                className={mock.pulse === "craft-btn" ? "demo-pulse" : ""}
                style={{
                  ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 8px",
                  border: current.highlight === "craft" ? "2px solid #c9a96e" : "1px solid #4a3a22",
                  position: "relative",
                }}
              >
                {products.canvas_tote.emoji} <b>{products.canvas_tote.name}</b>{" "}
                <span style={{ color: "#8a7a60" }}>$8 · 1d</span>
                {mock.pulse === "craft-btn" && <span className="demo-cursor" style={cursorStyle}>👆</span>}
              </div>
              <div style={{ ...btnStyle("#2a2a2a"), fontSize: 11, padding: "5px 8px", opacity: 0.45 }}>
                {products.laptop_sleeve.emoji} <b>{products.laptop_sleeve.name}</b>{" "}
                <span style={{ color: "#8a7a60" }}>{t.lockedSkill(5)}</span>
              </div>
              {mock.pulse === "craft-advanced" && (
                <div className="demo-pulse" style={{ ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 8px", border: "2px solid #c9a96e", position: "relative" }}>
                  {products.weekender.emoji} <b>{products.weekender.name}</b>{" "}
                  <span style={{ color: "#8a7a60" }}>$25 · 1d</span>
                  <span className="demo-cursor" style={cursorStyle}>👆</span>
                </div>
              )}
            </div>
          </div>

          {mock.upgrades?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>{t.demo.upgradesOwned}</div>
              <div style={{ fontSize: 11, color: "#90c090" }}>✓ {mock.upgrades.join(", ")}</div>
            </div>
          )}

          {current.highlight === "upgrades" && current.upgradeName && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>{t.upgradesLabel}</div>
              <div
                className={mock.pulse === "upgrade-btn" ? "demo-pulse" : ""}
                style={{
                  ...btnStyle("#1e1a2a"), fontSize: 11, padding: "4px 8px", display: "inline-block",
                  border: "2px solid #c9a96e", position: "relative",
                }}
              >
                ⬆ {current.upgradeName} — $150 <span style={{ color: "#7a7a9a" }}>({current.upgradeDesc})</span>
                {mock.pulse === "upgrade-btn" && <span className="demo-cursor" style={cursorStyle}>👆</span>}
              </div>
            </div>
          )}

          <div
            className={mock.pulse === "nextday-btn" ? "demo-pulse" : ""}
            style={{
              ...btnStyle("#4a3a10"), fontSize: 13, padding: "7px 0", width: "100%",
              textAlign: "center", border: current.highlight === "nextday" ? "2px solid #c9a96e" : "2px solid #7a6a30",
              position: "relative", marginBottom: 8,
            }}
          >
            {t.nextDay}
            {mock.pulse === "nextday-btn" && <span className="demo-cursor" style={{ ...cursorStyle, right: "30%" }}>👆</span>}
          </div>

          <div style={{
            background: "#0a0908", border: "1px solid #2a2418", borderRadius: 4,
            padding: "5px 8px", fontSize: 10, lineHeight: 1.5, maxHeight: 60, overflow: "hidden",
          }}>
            {mock.log.map((line, i) => (
              <div key={i} style={{ color: line.includes("🎉") ? "#90e090" : line.startsWith("---") ? "#c9a96e" : "#a09880" }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={prev} style={{ ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 12px" }}>{t.demo.prev}</button>
            <button onClick={() => setPlaying((p) => !p)} style={{ ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 12px" }}>
              {playing ? t.demo.pause : t.demo.play}
            </button>
            <button
              onClick={next}
              className={!playing ? "demo-pulse" : ""}
              style={{
                ...btnStyle(!playing ? "#4a3a10" : "#2a2518"),
                fontSize: 11,
                padding: "5px 12px",
                border: !playing ? "2px solid #c9a96e" : "1px solid #4a3a22",
                position: "relative",
              }}
            >
              {t.demo.next}
              {!playing && <span className="demo-cursor" style={{ ...cursorStyle, right: -8, top: -12 }}>👆</span>}
            </button>
          </div>

          <div style={{ display: "flex", gap: 5 }}>
            {demoSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: 8, height: 8, borderRadius: "50%", border: "none", padding: 0, cursor: "pointer",
                  background: i === step ? "#c9a96e" : "#3a3020",
                }}
                aria-label={t.demo.goToStep(i + 1)}
              />
            ))}
          </div>

          <button onClick={onClose} style={{ ...btnStyle("#5a8a3a"), fontSize: 12, padding: "6px 14px" }}>
            {t.demo.startPlaying}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "#5a5040" }}>
          {t.demo.stepOf(step + 1, demoSteps.length)}
          {playing ? t.demo.autoAdvancing(AUTO_INTERVAL_MS / 1000) : t.demo.tapNext}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(10, 8, 6, 0.88)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 16,
  fontFamily: "'Courier New', Courier, monospace",
  color: "#e8dcc8",
};

const modalStyle = {
  background: "#1a1410",
  border: "2px solid #5a4a32",
  borderRadius: 8,
  padding: 20,
  maxWidth: 520,
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

const cursorStyle = {
  position: "absolute",
  right: -4,
  top: -10,
  fontSize: 14,
};

function btnStyle(bg) {
  return {
    background: bg,
    color: "#e8dcc8",
    border: "1px solid #4a3a22",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}