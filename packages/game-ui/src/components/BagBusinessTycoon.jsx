"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import HowToPlayDemo from "./HowToPlayDemo";
import SplashScreen from "./SplashScreen";
import LanguageToggle from "./LanguageToggle";
import SoundToggle from "./SoundToggle";
import { useLanguage } from "./LanguageProvider";
import { playGameSound } from "../audio/gameSounds.js";
import {
  DEMO_STORAGE_KEY,
  createInitialState,
  getSpeed,
  getSkill,
  getPriceMod,
  getCostMod,
  canParallelCraft,
  getLogColor,
} from "@luggage-tycoon/game-core";

export default function BagBusinessTycoon() {
  const { t, products, upgrades, events } = useLanguage();
  const [game, setGame] = useState(createInitialState());
  const [log, setLog] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    const pristine =
      game.day === 1 &&
      game.totalSold === 0 &&
      game.totalEarned === 0 &&
      game.money === 100 &&
      !game.crafting &&
      !game.won &&
      !game.gameOver;
    if (showSplash || pristine) {
      setLog(t.welcomeLog);
    }
  }, [t, showSplash, game.day, game.totalSold, game.totalEarned, game.money, game.crafting, game.won, game.gameOver]);

  const handleSplashContinue = useCallback(() => {
    setLog(t.welcomeLog);
    setShowSplash(false);
    if (typeof window !== "undefined" && !localStorage.getItem(DEMO_STORAGE_KEY)) {
      setShowDemo(true);
    }
  }, [t]);

  const closeDemo = useCallback(() => {
    setShowDemo(false);
    localStorage.setItem(DEMO_STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const addLog = useCallback((msg) => setLog((l) => [...l.slice(-80), msg]), []);

  const craft = (key) => {
    const p = products[key];
    const eff = getSkill(game);
    const cost = Math.round(p.cost * getCostMod(game));
    const busy = game.crafting && !canParallelCraft(game);
    const full = game.crafting && canParallelCraft(game) && game.crafting.length >= 2;
    if (eff < p.skill || game.money < cost || busy || full) {
      playGameSound("deny");
      return;
    }
    playGameSound("craft");
    setGame((g) => {
      const days = Math.max(1, p.time - getSpeed(g));
      const newG = { ...g, money: g.money - cost };
      if (!g.crafting) {
        newG.crafting = [{ key, daysLeft: days }];
      } else {
        newG.crafting = [...g.crafting, { key, daysLeft: days }];
      }
      addLog(t.log.startedCraft(p.emoji, p.name, days, cost));
      return newG;
    });
  };

  const sell = (key) => {
    if (!game.inventory[key] || game.inventory[key] <= 0) return;
    const p = products[key];
    const qualityBonus = 1 + Math.min(getSkill(game) / 200, 0.5);
    const repBonus = 1 + game.reputation / 500;
    const price = Math.round(p.basePrice * getPriceMod(game) * qualityBonus * repBonus);
    const newEarned = game.totalEarned + price;
    const newRep = game.reputation + Math.floor(price / 30);
    const won = newEarned >= 10000 && newRep >= 100;
    playGameSound("sell");
    if (won) playGameSound("win");
    setGame((g) => {
      const inv = { ...g.inventory, [key]: g.inventory[key] - 1 };
      if (inv[key] === 0) delete inv[key];
      addLog(t.log.sold(p.emoji, p.name, price));
      if (won) addLog(t.log.won);
      return {
        ...g, money: g.money + price, inventory: inv,
        totalSold: g.totalSold + 1, totalEarned: newEarned,
        reputation: newRep, skill: g.skill + 1,
        won,
      };
    });
  };

  const buyUpgrade = (key) => {
    const u = upgrades[key];
    if (game.upgrades[key] || game.money < u.cost) {
      playGameSound("deny");
      return;
    }
    playGameSound("upgrade");
    setGame((g) => {
      addLog(t.log.purchasedUpgrade(u.name, u.desc));
      return { ...g, money: g.money - u.cost, upgrades: { ...g.upgrades, [key]: true } };
    });
  };

  const nextDay = () => {
    const followUpSounds = [];
    setGame((g) => {
      let newG = { ...g, day: g.day + 1, tempPriceMod: 0, tempCostMod: 0 };
      if (newG.crafting) {
        const updated = newG.crafting.map((c) => ({ ...c, daysLeft: c.daysLeft - 1 }));
        const done = updated.filter((c) => c.daysLeft <= 0);
        const ongoing = updated.filter((c) => c.daysLeft > 0);
        const inv = { ...newG.inventory };
        done.forEach((c) => {
          inv[c.key] = (inv[c.key] || 0) + 1;
          const p = products[c.key];
          addLog(t.log.finishedCraft(p.emoji, p.name));
          newG.skill += 2;
          followUpSounds.push("complete");
        });
        newG.inventory = inv;
        newG.crafting = ongoing.length ? ongoing : null;
      }
      if (newG.upgrades.online_store && Math.random() < 0.2) {
        const keys = Object.keys(newG.inventory).filter((k) => newG.inventory[k] > 0);
        if (keys.length) {
          const rk = keys[Math.floor(Math.random() * keys.length)];
          const p = products[rk];
          const price = Math.round(p.basePrice * getPriceMod(newG) * 1.1);
          newG.inventory = { ...newG.inventory, [rk]: newG.inventory[rk] - 1 };
          if (newG.inventory[rk] === 0) delete newG.inventory[rk];
          newG.money += price;
          newG.totalEarned += price;
          newG.totalSold += 1;
          newG.reputation += Math.floor(price / 30);
          addLog(t.log.onlineOrder(p.emoji, p.name, price));
          followUpSounds.push("sell");
        }
      }
      if (newG.day % 7 === 0) {
        newG.week += 1;
        const ev = events[Math.floor(Math.random() * events.length)];
        addLog(t.log.weekEvent(newG.week, ev.text));
        if (ev.effect === "loseMoney") newG.money = Math.max(0, newG.money - ev.val);
        if (ev.effect === "rep") newG.reputation += ev.val;
        if (ev.effect === "tempPrice") newG.tempPriceMod = ev.val;
        if (ev.effect === "tempCost") newG.tempCostMod = ev.val;
        if (ev.effect === "bonus") newG.money += ev.val;
        followUpSounds.push("event");
      }
      if (newG.money <= 0 && !newG.crafting && Object.keys(newG.inventory).length === 0) {
        newG.gameOver = true;
        addLog(t.log.bankrupt);
        followUpSounds.push("lose");
      }
      return newG;
    });
    playGameSound("tick");
    followUpSounds.forEach((sound, i) => {
      setTimeout(() => playGameSound(sound), 80 + i * 90);
    });
  };

  const restart = () => {
    playGameSound("click");
    setGame(createInitialState());
    setLog(t.newGameLog);
  };

  const g = game;
  const eff = getSkill(g);
  const invKeys = Object.keys(g.inventory).filter((k) => g.inventory[k] > 0);

  return (
    <div className="game-panel">
      {showSplash && <SplashScreen onContinue={handleSplashContinue} />}
      {showDemo && <HowToPlayDemo onClose={closeDemo} />}

      <div style={{
        textAlign: "center", padding: "10px 0 6px", borderBottom: "2px solid #5a4a32",
        marginBottom: 10, letterSpacing: 2, position: "relative",
      }}>
        <button
          onClick={() => { playGameSound("click"); setShowDemo(true); }}
          style={{
            ...btnStyle("#2a2518"), position: "absolute", left: 0, top: 8,
            fontSize: 10, padding: "4px 8px", letterSpacing: 0,
          }}
        >
          {t.howToPlay}
        </button>
        <div style={{ position: "absolute", right: 0, top: 8, display: "flex", gap: 4 }}>
          <SoundToggle />
          <LanguageToggle />
        </div>
        <h1 style={{ margin: 0, fontSize: 22, color: "#c9a96e", textTransform: "uppercase" }}>
          🧳 {t.title}
        </h1>
        <div style={{ fontSize: 11, color: "#8a7a60", marginTop: 2 }}>
          {t.day} {g.day} · {t.week} {g.week} · {t.skill} {eff} · {t.rep} {g.reputation}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13,
        background: "#231e16", padding: "8px 10px", borderRadius: 4, marginBottom: 8,
        border: "1px solid #3a3020",
      }}>
        <span>💰 <b style={{ color: "#6dce6d" }}>${g.money}</b></span>
        <span>📦 {t.sold}: {g.totalSold}</span>
        <span>💵 {t.revenue}: <b style={{ color: g.totalEarned >= 10000 ? "#ffd700" : "#c9a96e" }}>${g.totalEarned}</b>/10k</span>
        <span>⭐ {t.rep}: <b style={{ color: g.reputation >= 100 ? "#ffd700" : "#c9a96e" }}>{g.reputation}</b>/100</span>
      </div>

      {g.won && (
        <div style={{ textAlign: "center", background: "#2a3a1a", border: "2px solid #6dce6d", borderRadius: 6, padding: 14, marginBottom: 8 }}>
          <div style={{ fontSize: 20 }}>{t.youWin}</div>
          <div style={{ fontSize: 12, marginTop: 4, color: "#a0d890" }}>
            {t.winMessage(g.day, g.totalEarned, g.totalSold)}
          </div>
          <button onClick={restart} style={btnStyle("#5a8a3a")}>{t.playAgain}</button>
        </div>
      )}
      {g.gameOver && !g.won && (
        <div style={{ textAlign: "center", background: "#3a1a1a", border: "2px solid #ce6d6d", borderRadius: 6, padding: 14, marginBottom: 8 }}>
          <div style={{ fontSize: 20 }}>{t.bankrupt}</div>
          <button onClick={restart} style={btnStyle("#8a3a3a")}>{t.tryAgain}</button>
        </div>
      )}

      {!g.won && !g.gameOver && (
        <>
          {g.crafting && (
            <div style={{ background: "#1e2a1e", border: "1px solid #3a5a3a", borderRadius: 4, padding: "6px 10px", marginBottom: 8, fontSize: 12 }}>
              🔨 {t.crafting}: {g.crafting.map((c) => `${products[c.key].emoji} ${products[c.key].name} (${t.daysLeft(c.daysLeft)})`).join(" · ")}
            </div>
          )}

          {invKeys.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.inventoryLabel}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {invKeys.map((k) => (
                  <button key={k} onClick={() => sell(k)} style={{
                    ...btnStyle("#3a3020"), fontSize: 11, padding: "4px 8px",
                  }}>
                    {products[k].emoji} {products[k].name} ×{g.inventory[k]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.craft}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 4 }}>
              {Object.entries(products).map(([k, p]) => {
                const cost = Math.round(p.cost * getCostMod(g));
                const locked = eff < p.skill;
                const tooExpensive = g.money < cost;
                const busy = g.crafting && !canParallelCraft(g);
                const full = g.crafting && canParallelCraft(g) && g.crafting.length >= 2;
                const disabled = locked || tooExpensive || busy || full;
                return (
                  <button key={k} onClick={() => craft(k)} disabled={disabled} style={{
                    ...btnStyle(locked ? "#2a2a2a" : "#2a2518"),
                    opacity: disabled ? 0.45 : 1, fontSize: 11, padding: "5px 8px",
                    textAlign: "left", cursor: disabled ? "not-allowed" : "pointer",
                    border: `1px solid ${locked ? "#333" : "#4a3a22"}`,
                  }}>
                    <span>{p.emoji} <b>{p.name}</b></span>
                    <span style={{ color: "#8a7a60", marginLeft: 6 }}>
                      ${cost} · {Math.max(1, p.time - getSpeed(g))}d
                      {locked ? ` · ${t.lockedSkill(p.skill)}` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.upgradesLabel}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {Object.entries(upgrades).filter(([k]) => !g.upgrades[k]).map(([k, u]) => (
                <button key={k} onClick={() => buyUpgrade(k)} disabled={g.money < u.cost}
                  style={{
                    ...btnStyle("#1e1a2a"), fontSize: 11, padding: "4px 8px",
                    opacity: g.money < u.cost ? 0.4 : 1,
                    border: "1px solid #3a2a4a",
                  }}>
                  ⬆ {u.name} — ${u.cost} <span style={{ color: "#7a7a9a" }}>({u.desc})</span>
                </button>
              ))}
              {Object.entries(upgrades).filter(([k]) => !g.upgrades[k]).length === 0 && (
                <span style={{ fontSize: 11, color: "#5a5a4a" }}>{t.allPurchased}</span>
              )}
            </div>
          </div>

          <button onClick={nextDay} style={{
            ...btnStyle("#4a3a10"), fontSize: 14, padding: "8px 0", width: "100%",
            border: "2px solid #7a6a30", letterSpacing: 1, marginBottom: 8,
          }}>
            {t.nextDay}
          </button>
        </>
      )}

      <div ref={logRef} style={{
        flex: 1, minHeight: 120, maxHeight: 200, overflowY: "auto",
        background: "#12100c", border: "1px solid #2a2418", borderRadius: 4,
        padding: "6px 10px", fontSize: 11, lineHeight: 1.6,
      }}>
        {log.map((l, i) => (
          <div key={i} style={{ color: getLogColor(l) }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    background: bg, color: "#e8dcc8", border: "1px solid #4a3a22",
    borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
  };
}