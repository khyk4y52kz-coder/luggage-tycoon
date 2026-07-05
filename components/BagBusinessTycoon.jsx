"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const PRODUCTS = {
  canvas_tote: { name: "Canvas Tote", cost: 8, basePrice: 22, skill: 0, time: 1, emoji: "👜" },
  laptop_sleeve: { name: "Laptop Sleeve", cost: 12, basePrice: 35, skill: 5, time: 1, emoji: "💼" },
  weekender: { name: "Weekender Bag", cost: 25, basePrice: 65, skill: 15, time: 2, emoji: "🧳" },
  leather_satchel: { name: "Leather Satchel", cost: 40, basePrice: 110, skill: 30, time: 3, emoji: "👝" },
  rolling_carry_on: { name: "Rolling Carry-On", cost: 60, basePrice: 180, skill: 50, time: 4, emoji: "🧳" },
  luxury_trunk: { name: "Luxury Trunk", cost: 120, basePrice: 400, skill: 75, time: 5, emoji: "📦" },
  designer_clutch: { name: "Designer Clutch", cost: 35, basePrice: 95, skill: 25, time: 2, emoji: "👛" },
  hiking_backpack: { name: "Hiking Backpack", cost: 45, basePrice: 130, skill: 40, time: 3, emoji: "🎒" },
  hardshell_set: { name: "Hardshell Set (3pc)", cost: 200, basePrice: 650, skill: 90, time: 7, emoji: "🏆" },
};

const UPGRADES = {
  sewing_machine: { name: "Sewing Machine", cost: 150, desc: "−1 day per craft", effect: "speed" },
  leather_tools: { name: "Leather Tooling Kit", cost: 300, desc: "+15 skill", effect: "skill" },
  storefront: { name: "Storefront", cost: 500, desc: "+20% sale price", effect: "price" },
  workshop: { name: "Larger Workshop", cost: 800, desc: "Craft 2 items at once", effect: "parallel" },
  brand_deal: { name: "Brand Partnership", cost: 1500, desc: "+40% sale price", effect: "price2" },
  master_class: { name: "Master Class", cost: 1000, desc: "+30 skill", effect: "skill2" },
  online_store: { name: "Online Store", cost: 2000, desc: "+25% sale price & random orders", effect: "online" },
};

const EVENTS = [
  { text: "A travel blogger featured your bags! Sales prices +15% this week.", type: "good", effect: "tempPrice", val: 0.15 },
  { text: "A batch of leather arrived with defects. You lost some materials.", type: "bad", effect: "loseMoney", val: 50 },
  { text: "A customer left a glowing review. +5 reputation!", type: "good", effect: "rep", val: 5 },
  { text: "Rent is due. −$100.", type: "bad", effect: "loseMoney", val: 100 },
  { text: "You found premium fabric at a flea market! Material costs −30% this week.", type: "good", effect: "tempCost", val: 0.3 },
  { text: "A competitor opened nearby. Prices dip slightly this week.", type: "bad", effect: "tempPrice", val: -0.1 },
  { text: "Word of mouth is spreading! +10 reputation.", type: "good", effect: "rep", val: 10 },
  { text: "Your sewing needle broke mid-project. Lost a day.", type: "bad", effect: "loseDay", val: 1 },
  { text: "An influencer wants a custom piece — big order incoming!", type: "good", effect: "bonus", val: 200 },
  { text: "Quiet week. No foot traffic.", type: "neutral", effect: "none", val: 0 },
];

const initialState = () => ({
  money: 100,
  skill: 0,
  reputation: 0,
  day: 1,
  week: 1,
  crafting: null,
  craftDaysLeft: 0,
  inventory: {},
  upgrades: {},
  totalSold: 0,
  totalEarned: 0,
  tempPriceMod: 0,
  tempCostMod: 0,
  gameOver: false,
  won: false,
});

export default function BagBusinessTycoon() {
  const [game, setGame] = useState(initialState());
  const [log, setLog] = useState(["Welcome to Bag Business Tycoon! You start with $100 and a dream.", "Craft bags, sell them, upgrade your workshop, and build a brand.", "Goal: Earn $10,000 total revenue and reach 100 reputation to win!"]);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const addLog = useCallback((msg) => setLog((l) => [...l.slice(-80), msg]), []);

  const getSpeed = (g) => (g.upgrades.sewing_machine ? 1 : 0);
  const getSkill = (g) => {
    let s = g.skill;
    if (g.upgrades.leather_tools) s += 15;
    if (g.upgrades.master_class) s += 30;
    return s;
  };
  const getPriceMod = (g) => {
    let m = 1 + g.tempPriceMod;
    if (g.upgrades.storefront) m += 0.2;
    if (g.upgrades.brand_deal) m += 0.4;
    if (g.upgrades.online_store) m += 0.25;
    return m;
  };
  const getCostMod = (g) => Math.max(0.5, 1 - g.tempCostMod);
  const canParallel = (g) => !!g.upgrades.workshop;

  const craft = (key) => {
    setGame((g) => {
      const p = PRODUCTS[key];
      const eff = getSkill(g);
      if (eff < p.skill) return g;
      const cost = Math.round(p.cost * getCostMod(g));
      if (g.money < cost) return g;
      if (g.crafting && !canParallel(g)) return g;
      if (g.crafting && canParallel(g) && g.crafting.length >= 2) return g;
      const days = Math.max(1, p.time - getSpeed(g));
      const newG = { ...g, money: g.money - cost };
      if (!g.crafting) {
        newG.crafting = [{ key, daysLeft: days }];
      } else {
        newG.crafting = [...g.crafting, { key, daysLeft: days }];
      }
      addLog(`Started crafting ${p.emoji} ${p.name} (${days} day${days > 1 ? "s" : ""}, cost $${cost})`);
      return newG;
    });
  };

  const sell = (key) => {
    setGame((g) => {
      if (!g.inventory[key] || g.inventory[key] <= 0) return g;
      const p = PRODUCTS[key];
      const qualityBonus = 1 + Math.min(getSkill(g) / 200, 0.5);
      const repBonus = 1 + g.reputation / 500;
      const price = Math.round(p.basePrice * getPriceMod(g) * qualityBonus * repBonus);
      const inv = { ...g.inventory, [key]: g.inventory[key] - 1 };
      if (inv[key] === 0) delete inv[key];
      const newEarned = g.totalEarned + price;
      const newRep = g.reputation + Math.floor(price / 30);
      const won = newEarned >= 10000 && newRep >= 100;
      addLog(`Sold ${p.emoji} ${p.name} for $${price}! 💰`);
      if (won) addLog("🎉 CONGRATULATIONS! You've built a thriving bag business!");
      return {
        ...g, money: g.money + price, inventory: inv,
        totalSold: g.totalSold + 1, totalEarned: newEarned,
        reputation: newRep, skill: g.skill + 1,
        won,
      };
    });
  };

  const buyUpgrade = (key) => {
    setGame((g) => {
      const u = UPGRADES[key];
      if (g.upgrades[key] || g.money < u.cost) return g;
      addLog(`Purchased upgrade: ${u.name}! ${u.desc}`);
      return { ...g, money: g.money - u.cost, upgrades: { ...g.upgrades, [key]: true } };
    });
  };

  const nextDay = () => {
    setGame((g) => {
      let newG = { ...g, day: g.day + 1, tempPriceMod: 0, tempCostMod: 0 };
      if (newG.crafting) {
        const updated = newG.crafting.map((c) => ({ ...c, daysLeft: c.daysLeft - 1 }));
        const done = updated.filter((c) => c.daysLeft <= 0);
        const ongoing = updated.filter((c) => c.daysLeft > 0);
        const inv = { ...newG.inventory };
        done.forEach((c) => {
          inv[c.key] = (inv[c.key] || 0) + 1;
          const p = PRODUCTS[c.key];
          addLog(`Finished crafting ${p.emoji} ${p.name}! Added to inventory.`);
          newG.skill += 2;
        });
        newG.inventory = inv;
        newG.crafting = ongoing.length ? ongoing : null;
      }
      if (newG.upgrades.online_store && Math.random() < 0.2) {
        const keys = Object.keys(newG.inventory).filter((k) => newG.inventory[k] > 0);
        if (keys.length) {
          const rk = keys[Math.floor(Math.random() * keys.length)];
          const p = PRODUCTS[rk];
          const price = Math.round(p.basePrice * getPriceMod(newG) * 1.1);
          newG.inventory = { ...newG.inventory, [rk]: newG.inventory[rk] - 1 };
          if (newG.inventory[rk] === 0) delete newG.inventory[rk];
          newG.money += price;
          newG.totalEarned += price;
          newG.totalSold += 1;
          newG.reputation += Math.floor(price / 30);
          addLog(`📦 Online order! Sold ${p.emoji} ${p.name} for $${price}`);
        }
      }
      if (newG.day % 7 === 0) {
        newG.week += 1;
        const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        addLog(`--- Week ${newG.week} Event: ${ev.text}`);
        if (ev.effect === "loseMoney") newG.money = Math.max(0, newG.money - ev.val);
        if (ev.effect === "rep") newG.reputation += ev.val;
        if (ev.effect === "tempPrice") newG.tempPriceMod = ev.val;
        if (ev.effect === "tempCost") newG.tempCostMod = ev.val;
        if (ev.effect === "bonus") newG.money += ev.val;
      }
      if (newG.money <= 0 && !newG.crafting && Object.keys(newG.inventory).length === 0) {
        newG.gameOver = true;
        addLog("💀 You've gone bankrupt with nothing to sell. Game over!");
      }
      return newG;
    });
  };

  const restart = () => { setGame(initialState()); setLog(["New game started. Good luck!"]); };

  const g = game;
  const eff = getSkill(g);
  const invKeys = Object.keys(g.inventory).filter((k) => g.inventory[k] > 0);

  return (
    <div style={{
      minHeight: "100vh", background: "#1a1410", color: "#e8dcc8",
      fontFamily: "'Courier New', Courier, monospace", padding: "12px",
      display: "flex", flexDirection: "column", maxWidth: 720, margin: "0 auto",
    }}>
      <div style={{
        textAlign: "center", padding: "10px 0 6px", borderBottom: "2px solid #5a4a32",
        marginBottom: 10, letterSpacing: 2,
      }}>
        <h1 style={{ margin: 0, fontSize: 22, color: "#c9a96e", textTransform: "uppercase" }}>
          🧳 Bag Business Tycoon
        </h1>
        <div style={{ fontSize: 11, color: "#8a7a60", marginTop: 2 }}>
          Day {g.day} · Week {g.week} · Skill {eff} · Rep {g.reputation}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13,
        background: "#231e16", padding: "8px 10px", borderRadius: 4, marginBottom: 8,
        border: "1px solid #3a3020",
      }}>
        <span>💰 <b style={{ color: "#6dce6d" }}>${g.money}</b></span>
        <span>📦 Sold: {g.totalSold}</span>
        <span>💵 Revenue: <b style={{ color: g.totalEarned >= 10000 ? "#ffd700" : "#c9a96e" }}>${g.totalEarned}</b>/10k</span>
        <span>⭐ Rep: <b style={{ color: g.reputation >= 100 ? "#ffd700" : "#c9a96e" }}>{g.reputation}</b>/100</span>
      </div>

      {g.won && (
        <div style={{ textAlign: "center", background: "#2a3a1a", border: "2px solid #6dce6d", borderRadius: 6, padding: 14, marginBottom: 8 }}>
          <div style={{ fontSize: 20 }}>🎉 You Win!</div>
          <div style={{ fontSize: 12, marginTop: 4, color: "#a0d890" }}>
            You built a thriving bag empire in {g.day} days! Revenue: ${g.totalEarned}, Bags sold: {g.totalSold}
          </div>
          <button onClick={restart} style={btnStyle("#5a8a3a")}>Play Again</button>
        </div>
      )}
      {g.gameOver && !g.won && (
        <div style={{ textAlign: "center", background: "#3a1a1a", border: "2px solid #ce6d6d", borderRadius: 6, padding: 14, marginBottom: 8 }}>
          <div style={{ fontSize: 20 }}>💀 Bankrupt!</div>
          <button onClick={restart} style={btnStyle("#8a3a3a")}>Try Again</button>
        </div>
      )}

      {!g.won && !g.gameOver && (
        <>
          {g.crafting && (
            <div style={{ background: "#1e2a1e", border: "1px solid #3a5a3a", borderRadius: 4, padding: "6px 10px", marginBottom: 8, fontSize: 12 }}>
              🔨 Crafting: {g.crafting.map((c) => `${PRODUCTS[c.key].emoji} ${PRODUCTS[c.key].name} (${c.daysLeft}d left)`).join(" · ")}
            </div>
          )}

          {invKeys.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Inventory — click to sell</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {invKeys.map((k) => (
                  <button key={k} onClick={() => sell(k)} style={{
                    ...btnStyle("#3a3020"), fontSize: 11, padding: "4px 8px",
                  }}>
                    {PRODUCTS[k].emoji} {PRODUCTS[k].name} ×{g.inventory[k]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Craft</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 4 }}>
              {Object.entries(PRODUCTS).map(([k, p]) => {
                const cost = Math.round(p.cost * getCostMod(g));
                const locked = eff < p.skill;
                const tooExpensive = g.money < cost;
                const busy = g.crafting && !canParallel(g);
                const full = g.crafting && canParallel(g) && g.crafting.length >= 2;
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
                      {locked ? ` · 🔒 skill ${p.skill}` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#8a7a60", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Upgrades</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {Object.entries(UPGRADES).filter(([k]) => !g.upgrades[k]).map(([k, u]) => (
                <button key={k} onClick={() => buyUpgrade(k)} disabled={g.money < u.cost}
                  style={{
                    ...btnStyle("#1e1a2a"), fontSize: 11, padding: "4px 8px",
                    opacity: g.money < u.cost ? 0.4 : 1,
                    border: "1px solid #3a2a4a",
                  }}>
                  ⬆ {u.name} — ${u.cost} <span style={{ color: "#7a7a9a" }}>({u.desc})</span>
                </button>
              ))}
              {Object.entries(UPGRADES).filter(([k]) => !g.upgrades[k]).length === 0 && (
                <span style={{ fontSize: 11, color: "#5a5a4a" }}>All purchased! ✓</span>
              )}
            </div>
          </div>

          <button onClick={nextDay} style={{
            ...btnStyle("#4a3a10"), fontSize: 14, padding: "8px 0", width: "100%",
            border: "2px solid #7a6a30", letterSpacing: 1, marginBottom: 8,
          }}>
            ⏭ NEXT DAY
          </button>
        </>
      )}

      <div ref={logRef} style={{
        flex: 1, minHeight: 120, maxHeight: 200, overflowY: "auto",
        background: "#12100c", border: "1px solid #2a2418", borderRadius: 4,
        padding: "6px 10px", fontSize: 11, lineHeight: 1.6,
      }}>
        {log.map((l, i) => (
          <div key={i} style={{ color: l.startsWith("---") ? "#c9a96e" : l.includes("💀") || l.includes("lost") ? "#ce8080" : l.includes("🎉") ? "#90e090" : "#a09880" }}>{l}</div>
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