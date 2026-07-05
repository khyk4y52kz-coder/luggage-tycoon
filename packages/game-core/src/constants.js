export const DEMO_STORAGE_KEY = "bag-tycoon-seen-demo";

export function createInitialState() {
  return {
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
  };
}