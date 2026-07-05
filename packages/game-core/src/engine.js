export function getSpeed(game) {
  return game.upgrades.sewing_machine ? 1 : 0;
}

export function getSkill(game) {
  let skill = game.skill;
  if (game.upgrades.leather_tools) skill += 15;
  if (game.upgrades.master_class) skill += 30;
  return skill;
}

export function getPriceMod(game) {
  let mod = 1 + game.tempPriceMod;
  if (game.upgrades.storefront) mod += 0.2;
  if (game.upgrades.brand_deal) mod += 0.4;
  if (game.upgrades.online_store) mod += 0.25;
  return mod;
}

export function getCostMod(game) {
  return Math.max(0.5, 1 - game.tempCostMod);
}

export function canParallelCraft(game) {
  return !!game.upgrades.workshop;
}

export function getLogColor(line) {
  if (line.startsWith("---")) return "#c9a96e";
  if (line.includes("💀")) return "#ce8080";
  if (line.includes("🎉")) return "#90e090";
  return "#a09880";
}