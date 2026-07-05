import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getSpeed,
  getSkill,
  getPriceMod,
  getCostMod,
  canParallelCraft,
  getLogColor,
} from "../src/engine.js";

const baseGame = {
  skill: 10,
  upgrades: {},
  tempPriceMod: 0,
  tempCostMod: 0,
};

describe("getSpeed", () => {
  it("returns 0 without sewing machine", () => {
    assert.equal(getSpeed(baseGame), 0);
  });

  it("returns 1 with sewing machine upgrade", () => {
    assert.equal(getSpeed({ ...baseGame, upgrades: { sewing_machine: true } }), 1);
  });
});

describe("getSkill", () => {
  it("returns base skill only", () => {
    assert.equal(getSkill({ ...baseGame, skill: 12 }), 12);
  });

  it("adds leather tools and master class bonuses", () => {
    const game = {
      ...baseGame,
      skill: 10,
      upgrades: { leather_tools: true, master_class: true },
    };
    assert.equal(getSkill(game), 55);
  });
});

describe("getPriceMod", () => {
  it("returns 1 with no modifiers", () => {
    assert.equal(getPriceMod(baseGame), 1);
  });

  it("stacks storefront, brand deal, online store, and temp mod", () => {
    const game = {
      ...baseGame,
      tempPriceMod: 0.15,
      upgrades: { storefront: true, brand_deal: true, online_store: true },
    };
    assert.equal(getPriceMod(game), 2);
  });
});

describe("getCostMod", () => {
  it("returns 1 with no discount", () => {
    assert.equal(getCostMod(baseGame), 1);
  });

  it("applies temp cost reduction floored at 0.5", () => {
    assert.equal(getCostMod({ ...baseGame, tempCostMod: 0.3 }), 0.7);
    assert.equal(getCostMod({ ...baseGame, tempCostMod: 0.8 }), 0.5);
  });
});

describe("canParallelCraft", () => {
  it("returns false without workshop", () => {
    assert.equal(canParallelCraft(baseGame), false);
  });

  it("returns true with workshop upgrade", () => {
    assert.equal(canParallelCraft({ ...baseGame, upgrades: { workshop: true } }), true);
  });
});

describe("getLogColor", () => {
  it("colors event, failure, and success lines", () => {
    assert.equal(getLogColor("--- Week 2 Event: test"), "#c9a96e");
    assert.equal(getLogColor("💀 bankrupt"), "#ce8080");
    assert.equal(getLogColor("🎉 win"), "#90e090");
    assert.equal(getLogColor("normal line"), "#a09880");
  });
});