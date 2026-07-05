"use client";

import { useState, useEffect, useCallback } from "react";

const STEPS = [
  {
    title: "Your Goal",
    caption: "Build a bag empire! Hit $10,000 total revenue and 100 reputation to win.",
    highlight: "stats",
    mock: {
      money: 100,
      revenue: 0,
      rep: 0,
      day: 1,
      crafting: null,
      inventory: [],
      log: ["You start with $100 and a dream."],
      pulse: null,
    },
  },
  {
    title: "Step 1 — Craft a Bag",
    caption: "Pick a product from the Craft section. Canvas Tote costs $8 and takes 1 day — perfect to start.",
    highlight: "craft",
    mock: {
      money: 92,
      revenue: 0,
      rep: 0,
      day: 1,
      crafting: [{ emoji: "👜", name: "Canvas Tote", daysLeft: 1 }],
      inventory: [],
      log: ["Started crafting 👜 Canvas Tote (1 day, cost $8)"],
      pulse: "craft-btn",
    },
  },
  {
    title: "Step 2 — Advance Time",
    caption: "Press NEXT DAY to pass time. Crafting finishes automatically when the timer hits zero.",
    highlight: "nextday",
    mock: {
      money: 92,
      revenue: 0,
      rep: 0,
      day: 2,
      crafting: null,
      inventory: [{ emoji: "👜", name: "Canvas Tote", count: 1 }],
      log: ["Finished crafting 👜 Canvas Tote! Added to inventory.", "+2 skill"],
      pulse: "nextday-btn",
    },
  },
  {
    title: "Step 3 — Sell Your Bags",
    caption: "Click items in Inventory to sell them. Higher skill and reputation boost your sale price.",
    highlight: "inventory",
    mock: {
      money: 114,
      revenue: 22,
      rep: 0,
      day: 2,
      crafting: null,
      inventory: [],
      log: ["Sold 👜 Canvas Tote for $22! 💰", "+1 skill"],
      pulse: "sell-btn",
    },
  },
  {
    title: "Step 4 — Buy Upgrades",
    caption: "Reinvest profits in upgrades — faster crafting, better prices, and passive online orders.",
    highlight: "upgrades",
    mock: {
      money: 64,
      revenue: 22,
      rep: 0,
      day: 5,
      crafting: null,
      inventory: [],
      upgrades: ["Sewing Machine"],
      log: ["Purchased upgrade: Sewing Machine! −1 day per craft"],
      pulse: "upgrade-btn",
    },
  },
  {
    title: "Step 5 — Scale Up",
    caption: "Unlock pricier bags as your skill grows. Watch for weekly events — they can help or hurt!",
    highlight: "craft",
    mock: {
      money: 340,
      revenue: 4200,
      rep: 48,
      day: 28,
      week: 4,
      crafting: [{ emoji: "🧳", name: "Weekender Bag", daysLeft: 1 }],
      inventory: [{ emoji: "💼", name: "Laptop Sleeve", count: 2 }],
      log: ["--- Week 4 Event: A travel blogger featured your bags!", "Started crafting 🧳 Weekender Bag"],
      pulse: "craft-advanced",
    },
  },
  {
    title: "Win the Game!",
    caption: "Keep crafting, selling, and upgrading until you reach $10,000 revenue and 100 reputation. Don't go bankrupt!",
    highlight: "win",
    mock: {
      money: 2840,
      revenue: 10000,
      rep: 100,
      day: 62,
      crafting: null,
      inventory: [],
      won: true,
      log: ["🎉 CONGRATULATIONS! You've built a thriving bag business!"],
      pulse: null,
    },
  },
];

const AUTO_INTERVAL_MS = 4000;

export default function HowToPlayDemo({ onClose }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const next = useCallback(() => {
    setStep((s) => (s + 1) % STEPS.length);
  }, []);

  const prev = useCallback(() => {
    setStep((s) => (s - 1 + STEPS.length) % STEPS.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [playing, next]);

  const current = STEPS[step];
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
              How to Play — Visual Demo
            </div>
            <h2 style={{ margin: "4px 0 0", fontSize: 18, color: "#c9a96e" }}>{current.title}</h2>
          </div>
          <button onClick={onClose} style={{ ...btnStyle("#3a3020"), fontSize: 11, padding: "4px 10px" }}>
            ✕ Close
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
            — Live preview —
          </div>

          <div style={{
            display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12,
            background: "#231e16", padding: "6px 10px", borderRadius: 4, marginBottom: 8,
            border: current.highlight === "stats" ? "2px solid #c9a96e" : "1px solid #3a3020",
            ...(current.highlight === "stats" ? { boxShadow: "0 0 12px rgba(201,169,110,0.3)" } : {}),
          }}>
            <span>💰 <b style={{ color: "#6dce6d" }}>${mock.money}</b></span>
            <span>💵 Revenue: <b style={{ color: mock.revenue >= 10000 ? "#ffd700" : "#c9a96e" }}>${mock.revenue}</b>/10k</span>
            <span>⭐ Rep: <b style={{ color: mock.rep >= 100 ? "#ffd700" : "#c9a96e" }}>{mock.rep}</b>/100</span>
            <span>Day {mock.day}{mock.week ? ` · Week ${mock.week}` : ""}</span>
          </div>

          {mock.won && (
            <div style={{ textAlign: "center", background: "#2a3a1a", border: "2px solid #6dce6d", borderRadius: 4, padding: 10, marginBottom: 8, fontSize: 13 }}>
              🎉 You Win! Bag empire built in {mock.day} days!
            </div>
          )}

          {mock.crafting && (
            <div style={{ background: "#1e2a1e", border: "1px solid #3a5a3a", borderRadius: 4, padding: "5px 8px", marginBottom: 8, fontSize: 11 }}>
              🔨 Crafting: {mock.crafting.map((c) => `${c.emoji} ${c.name} (${c.daysLeft}d left)`).join(" · ")}
            </div>
          )}

          {mock.inventory?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>Inventory</div>
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
            <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>Craft</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <div
                className={mock.pulse === "craft-btn" ? "demo-pulse" : ""}
                style={{
                  ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 8px",
                  border: current.highlight === "craft" ? "2px solid #c9a96e" : "1px solid #4a3a22",
                  position: "relative",
                }}
              >
                👜 <b>Canvas Tote</b> <span style={{ color: "#8a7a60" }}>$8 · 1d</span>
                {mock.pulse === "craft-btn" && <span className="demo-cursor" style={cursorStyle}>👆</span>}
              </div>
              <div style={{ ...btnStyle("#2a2a2a"), fontSize: 11, padding: "5px 8px", opacity: 0.45 }}>
                💼 <b>Laptop Sleeve</b> <span style={{ color: "#8a7a60" }}>🔒 skill 5</span>
              </div>
              {mock.pulse === "craft-advanced" && (
                <div className="demo-pulse" style={{ ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 8px", border: "2px solid #c9a96e", position: "relative" }}>
                  🧳 <b>Weekender Bag</b> <span style={{ color: "#8a7a60" }}>$25 · 1d</span>
                  <span className="demo-cursor" style={cursorStyle}>👆</span>
                </div>
              )}
            </div>
          </div>

          {mock.upgrades?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>Upgrades owned</div>
              <div style={{ fontSize: 11, color: "#90c090" }}>✓ {mock.upgrades.join(", ")}</div>
            </div>
          )}

          {current.highlight === "upgrades" && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase" }}>Upgrades</div>
              <div
                className={mock.pulse === "upgrade-btn" ? "demo-pulse" : ""}
                style={{
                  ...btnStyle("#1e1a2a"), fontSize: 11, padding: "4px 8px", display: "inline-block",
                  border: "2px solid #c9a96e", position: "relative",
                }}
              >
                ⬆ Sewing Machine — $150 <span style={{ color: "#7a7a9a" }}>(−1 day per craft)</span>
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
            ⏭ NEXT DAY
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={prev} style={{ ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 12px" }}>← Prev</button>
            <button onClick={() => setPlaying((p) => !p)} style={{ ...btnStyle("#2a2518"), fontSize: 11, padding: "5px 12px" }}>
              {playing ? "⏸ Pause" : "▶ Play"}
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
              Next →
              {!playing && <span className="demo-cursor" style={{ ...cursorStyle, right: -8, top: -12 }}>👆</span>}
            </button>
          </div>

          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: 8, height: 8, borderRadius: "50%", border: "none", padding: 0, cursor: "pointer",
                  background: i === step ? "#c9a96e" : "#3a3020",
                }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <button onClick={onClose} style={{ ...btnStyle("#5a8a3a"), fontSize: 12, padding: "6px 14px" }}>
            Start Playing →
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "#5a5040" }}>
          Step {step + 1} of {STEPS.length}
          {playing
            ? ` · Auto-advancing every ${AUTO_INTERVAL_MS / 1000}s (press Pause to stop)`
            : " · Tap Next → to continue, or press Play to auto-advance"}
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