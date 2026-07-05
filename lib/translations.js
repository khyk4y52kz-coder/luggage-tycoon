const PRODUCT_KEYS = [
  "canvas_tote", "laptop_sleeve", "weekender", "leather_satchel",
  "rolling_carry_on", "luxury_trunk", "designer_clutch", "hiking_backpack", "hardshell_set",
];

const UPGRADE_KEYS = [
  "sewing_machine", "leather_tools", "storefront", "workshop",
  "brand_deal", "master_class", "online_store",
];

const PRODUCT_STATS = {
  canvas_tote: { cost: 8, basePrice: 22, skill: 0, time: 1, emoji: "👜" },
  laptop_sleeve: { cost: 12, basePrice: 35, skill: 5, time: 1, emoji: "💼" },
  weekender: { cost: 25, basePrice: 65, skill: 15, time: 2, emoji: "🧳" },
  leather_satchel: { cost: 40, basePrice: 110, skill: 30, time: 3, emoji: "👝" },
  rolling_carry_on: { cost: 60, basePrice: 180, skill: 50, time: 4, emoji: "🧳" },
  luxury_trunk: { cost: 120, basePrice: 400, skill: 75, time: 5, emoji: "📦" },
  designer_clutch: { cost: 35, basePrice: 95, skill: 25, time: 2, emoji: "👛" },
  hiking_backpack: { cost: 45, basePrice: 130, skill: 40, time: 3, emoji: "🎒" },
  hardshell_set: { cost: 200, basePrice: 650, skill: 90, time: 7, emoji: "🏆" },
};

const UPGRADE_STATS = {
  sewing_machine: { cost: 150, effect: "speed" },
  leather_tools: { cost: 300, effect: "skill" },
  storefront: { cost: 500, effect: "price" },
  workshop: { cost: 800, effect: "parallel" },
  brand_deal: { cost: 1500, effect: "price2" },
  master_class: { cost: 1000, effect: "skill2" },
  online_store: { cost: 2000, effect: "online" },
};

const EVENT_EFFECTS = [
  { type: "good", effect: "tempPrice", val: 0.15 },
  { type: "bad", effect: "loseMoney", val: 50 },
  { type: "good", effect: "rep", val: 5 },
  { type: "bad", effect: "loseMoney", val: 100 },
  { type: "good", effect: "tempCost", val: 0.3 },
  { type: "bad", effect: "tempPrice", val: -0.1 },
  { type: "good", effect: "rep", val: 10 },
  { type: "bad", effect: "loseDay", val: 1 },
  { type: "good", effect: "bonus", val: 200 },
  { type: "neutral", effect: "none", val: 0 },
];

export const LANG_STORAGE_KEY = "bag-tycoon-lang";

const en = {
  pageTitle: "Bag Business Tycoon",
  pageDescription: "Craft bags, sell them, upgrade your workshop, and build a brand.",
  title: "Bag Business Tycoon",
  howToPlay: "❓ How to Play",
  day: "Day",
  week: "Week",
  skill: "Skill",
  rep: "Rep",
  sold: "Sold",
  revenue: "Revenue",
  inventoryLabel: "Inventory — click to sell",
  craft: "Craft",
  upgradesLabel: "Upgrades",
  nextDay: "⏭ NEXT DAY",
  crafting: "Crafting",
  daysLeft: (n) => `${n}d left`,
  lockedSkill: (n) => `🔒 skill ${n}`,
  allPurchased: "All purchased! ✓",
  youWin: "🎉 You Win!",
  winMessage: (day, earned, sold) =>
    `You built a thriving bag empire in ${day} days! Revenue: $${earned}, Bags sold: ${sold}`,
  playAgain: "Play Again",
  bankrupt: "💀 Bankrupt!",
  tryAgain: "Try Again",
  welcomeLog: [
    "Welcome to Bag Business Tycoon! You start with $100 and a dream.",
    "Craft bags, sell them, upgrade your workshop, and build a brand.",
    "Goal: Earn $10,000 total revenue and reach 100 reputation to win!",
  ],
  newGameLog: ["New game started. Good luck!"],
  products: {
    canvas_tote: { name: "Canvas Tote" },
    laptop_sleeve: { name: "Laptop Sleeve" },
    weekender: { name: "Weekender Bag" },
    leather_satchel: { name: "Leather Satchel" },
    rolling_carry_on: { name: "Rolling Carry-On" },
    luxury_trunk: { name: "Luxury Trunk" },
    designer_clutch: { name: "Designer Clutch" },
    hiking_backpack: { name: "Hiking Backpack" },
    hardshell_set: { name: "Hardshell Set (3pc)" },
  },
  upgrades: {
    sewing_machine: { name: "Sewing Machine", desc: "−1 day per craft" },
    leather_tools: { name: "Leather Tooling Kit", desc: "+15 skill" },
    storefront: { name: "Storefront", desc: "+20% sale price" },
    workshop: { name: "Larger Workshop", desc: "Craft 2 items at once" },
    brand_deal: { name: "Brand Partnership", desc: "+40% sale price" },
    master_class: { name: "Master Class", desc: "+30 skill" },
    online_store: { name: "Online Store", desc: "+25% sale price & random orders" },
  },
  events: [
    "A travel blogger featured your bags! Sales prices +15% this week.",
    "A batch of leather arrived with defects. You lost some materials.",
    "A customer left a glowing review. +5 reputation!",
    "Rent is due. −$100.",
    "You found premium fabric at a flea market! Material costs −30% this week.",
    "A competitor opened nearby. Prices dip slightly this week.",
    "Word of mouth is spreading! +10 reputation.",
    "Your sewing needle broke mid-project. Lost a day.",
    "An influencer wants a custom piece — big order incoming!",
    "Quiet week. No foot traffic.",
  ],
  log: {
    startedCraft: (emoji, name, days, cost) =>
      `Started crafting ${emoji} ${name} (${days} day${days > 1 ? "s" : ""}, cost $${cost})`,
    sold: (emoji, name, price) => `Sold ${emoji} ${name} for $${price}! 💰`,
    won: "🎉 CONGRATULATIONS! You've built a thriving bag business!",
    purchasedUpgrade: (name, desc) => `Purchased upgrade: ${name}! ${desc}`,
    finishedCraft: (emoji, name) => `Finished crafting ${emoji} ${name}! Added to inventory.`,
    onlineOrder: (emoji, name, price) => `📦 Online order! Sold ${emoji} ${name} for $${price}`,
    weekEvent: (week, text) => `--- Week ${week} Event: ${text}`,
    bankrupt: "💀 You've gone bankrupt with nothing to sell. Game over!",
  },
  demo: {
    subtitle: "How to Play — Visual Demo",
    close: "✕ Close",
    livePreview: "— Live preview —",
    inventory: "Inventory",
    upgradesOwned: "Upgrades owned",
    prev: "← Prev",
    pause: "⏸ Pause",
    play: "▶ Play",
    next: "Next →",
    startPlaying: "Start Playing →",
    stepOf: (step, total) => `Step ${step} of ${total}`,
    tapNext: " · Tap Next → to continue, or press Play to auto-advance",
    autoAdvancing: (sec) => ` · Auto-advancing every ${sec}s (press Pause to stop)`,
    goToStep: (n) => `Go to step ${n}`,
    youWinDemo: (day) => `🎉 You Win! Bag empire built in ${day} days!`,
    steps: [
      {
        title: "Your Goal",
        caption: "Build a bag empire! Hit $10,000 total revenue and 100 reputation to win.",
        log: ["You start with $100 and a dream."],
      },
      {
        title: "Step 1 — Craft a Bag",
        caption: "Pick a product from the Craft section. Canvas Tote costs $8 and takes 1 day — perfect to start.",
        log: ["Started crafting 👜 Canvas Tote (1 day, cost $8)"],
      },
      {
        title: "Step 2 — Advance Time",
        caption: "Press NEXT DAY to pass time. Crafting finishes automatically when the timer hits zero.",
        log: ["Finished crafting 👜 Canvas Tote! Added to inventory.", "+2 skill"],
      },
      {
        title: "Step 3 — Sell Your Bags",
        caption: "Click items in Inventory to sell them. Higher skill and reputation boost your sale price.",
        log: ["Sold 👜 Canvas Tote for $22! 💰", "+1 skill"],
      },
      {
        title: "Step 4 — Buy Upgrades",
        caption: "Reinvest profits in upgrades — faster crafting, better prices, and passive online orders.",
        log: ["Purchased upgrade: Sewing Machine! −1 day per craft"],
        upgradeName: "Sewing Machine",
      },
      {
        title: "Step 5 — Scale Up",
        caption: "Unlock pricier bags as your skill grows. Watch for weekly events — they can help or hurt!",
        log: ["--- Week 4 Event: A travel blogger featured your bags!", "Started crafting 🧳 Weekender Bag"],
      },
      {
        title: "Win the Game!",
        caption: "Keep crafting, selling, and upgrading until you reach $10,000 revenue and 100 reputation. Don't go bankrupt!",
        log: ["🎉 CONGRATULATIONS! You've built a thriving bag business!"],
      },
    ],
  },
};

const da = {
  pageTitle: "Taskeforretnings Tycoon",
  pageDescription: "Fremstil tasker, sælg dem, opgrader dit værksted og byg et brand.",
  title: "Taskeforretnings Tycoon",
  howToPlay: "❓ Sådan spiller du",
  day: "Dag",
  week: "Uge",
  skill: "Færdighed",
  rep: "Omdømme",
  sold: "Solgt",
  revenue: "Omsætning",
  inventoryLabel: "Lager — klik for at sælge",
  craft: "Fremstil",
  upgradesLabel: "Opgraderinger",
  nextDay: "⏭ NÆSTE DAG",
  crafting: "Fremstiller",
  daysLeft: (n) => `${n}d tilbage`,
  lockedSkill: (n) => `🔒 færdighed ${n}`,
  allPurchased: "Alt købt! ✓",
  youWin: "🎉 Du vandt!",
  winMessage: (day, earned, sold) =>
    `Du byggede et blomstrende taskeimperium på ${day} dage! Omsætning: $${earned}, Tasker solgt: ${sold}`,
  playAgain: "Spil igen",
  bankrupt: "💀 Bankerot!",
  tryAgain: "Prøv igen",
  welcomeLog: [
    "Velkommen til Taskeforretnings Tycoon! Du starter med $100 og en drøm.",
    "Fremstil tasker, sælg dem, opgrader dit værksted og byg et brand.",
    "Mål: Tjen $10.000 i samlet omsætning og nå 100 i omdømme for at vinde!",
  ],
  newGameLog: ["Nyt spil startet. Held og lykke!"],
  products: {
    canvas_tote: { name: "Lærredstaske" },
    laptop_sleeve: { name: "Laptopomslag" },
    weekender: { name: "Weekendtaske" },
    leather_satchel: { name: "Læderskuldertaske" },
    rolling_carry_on: { name: "Rullet håndbagage" },
    luxury_trunk: { name: "Luksuskuffert" },
    designer_clutch: { name: "Designclutch" },
    hiking_backpack: { name: "Vandretaske" },
    hardshell_set: { name: "Hardshell-sæt (3 stk.)" },
  },
  upgrades: {
    sewing_machine: { name: "Symaskine", desc: "−1 dag per fremstilling" },
    leather_tools: { name: "Læderværktøjssæt", desc: "+15 færdighed" },
    storefront: { name: "Butiksfacade", desc: "+20% salgspris" },
    workshop: { name: "Større værksted", desc: "Fremstil 2 ting ad gangen" },
    brand_deal: { name: "Brandpartnerskab", desc: "+40% salgspris" },
    master_class: { name: "Mesterklasse", desc: "+30 færdighed" },
    online_store: { name: "Netbutik", desc: "+25% salgspris & tilfældige ordrer" },
  },
  events: [
    "En rejseblogger fremhævede dine tasker! Salgspriser +15% denne uge.",
    "En portion læder ankom med fejl. Du mistede materialer.",
    "En kunde efterlod en strålende anmeldelse. +5 omdømme!",
    "Husleje forfalder. −$100.",
    "Du fandt premiumstof på et loppemarked! Materialomkostninger −30% denne uge.",
    "En konkurrent åbnede i nærheden. Priserne falder lidt denne uge.",
    "Mund-til-mund spreder sig! +10 omdømme.",
    "Din synål knækkede midt i et projekt. Mistede en dag.",
    "En influencer vil have et specialdesign — stor ordre på vej!",
    "Stille uge. Ingen kunder.",
  ],
  log: {
    startedCraft: (emoji, name, days, cost) =>
      `Begyndte fremstilling af ${emoji} ${name} (${days} dag${days > 1 ? "e" : ""}, koster $${cost})`,
    sold: (emoji, name, price) => `Solgte ${emoji} ${name} for $${price}! 💰`,
    won: "🎉 TILLYKKE! Du har bygget en blomstrende taskeforretning!",
    purchasedUpgrade: (name, desc) => `Købte opgradering: ${name}! ${desc}`,
    finishedCraft: (emoji, name) => `Færdig med ${emoji} ${name}! Tilføjet til lager.`,
    onlineOrder: (emoji, name, price) => `📦 Onlineordre! Solgte ${emoji} ${name} for $${price}`,
    weekEvent: (week, text) => `--- Uge ${week} begivenhed: ${text}`,
    bankrupt: "💀 Du er gået bankerot uden noget at sælge. Game over!",
  },
  demo: {
    subtitle: "Sådan spiller du — Visuel demo",
    close: "✕ Luk",
    livePreview: "— Live forhåndsvisning —",
    inventory: "Lager",
    upgradesOwned: "Ejede opgraderinger",
    prev: "← Forrige",
    pause: "⏸ Pause",
    play: "▶ Afspil",
    next: "Næste →",
    startPlaying: "Begynd at spille →",
    stepOf: (step, total) => `Trin ${step} af ${total}`,
    tapNext: " · Tryk Næste → for at fortsætte, eller Afspil for automatisk afspilning",
    autoAdvancing: (sec) => ` · Auto-afspilning hvert ${sec}. sekund (tryk Pause for at stoppe)`,
    goToStep: (n) => `Gå til trin ${n}`,
    youWinDemo: (day) => `🎉 Du vandt! Taskeimperium bygget på ${day} dage!`,
    steps: [
      {
        title: "Dit mål",
        caption: "Byg et taskeimperium! Nå $10.000 i samlet omsætning og 100 i omdømme for at vinde.",
        log: ["Du starter med $100 og en drøm."],
      },
      {
        title: "Trin 1 — Fremstil en taske",
        caption: "Vælg et produkt under Fremstil. Lærredstaske koster $8 og tager 1 dag — perfekt til at starte.",
        log: ["Begyndte fremstilling af 👜 Lærredstaske (1 dag, koster $8)"],
      },
      {
        title: "Trin 2 — Gå frem i tid",
        caption: "Tryk NÆSTE DAG for at lade tiden gå. Fremstilling afsluttes automatisk når timeren når nul.",
        log: ["Færdig med 👜 Lærredstaske! Tilføjet til lager.", "+2 færdighed"],
      },
      {
        title: "Trin 3 — Sælg dine tasker",
        caption: "Klik på varer i Lager for at sælge dem. Højere færdighed og omdømme øger salgsprisen.",
        log: ["Solgte 👜 Lærredstaske for $22! 💰", "+1 færdighed"],
      },
      {
        title: "Trin 4 — Køb opgraderinger",
        caption: "Geninvester overskud i opgraderinger — hurtigere fremstilling, bedre priser og passive onlineordrer.",
        log: ["Købte opgradering: Symaskine! −1 dag per fremstilling"],
        upgradeName: "Symaskine",
      },
      {
        title: "Trin 5 — Skaler op",
        caption: "Lås dyrere tasker op efterhånden som din færdighed vokser. Hold øje med ugentlige begivenheder!",
        log: ["--- Uge 4 begivenhed: En rejseblogger fremhævede dine tasker!", "Begyndte fremstilling af 🧳 Weekendtaske"],
      },
      {
        title: "Vind spillet!",
        caption: "Bliv ved med at fremstille, sælge og opgradere indtil du når $10.000 i omsætning og 100 i omdømme. Gå ikke bankerot!",
        log: ["🎉 TILLYKKE! Du har bygget en blomstrende taskeforretning!"],
      },
    ],
  },
};

export const translations = { en, da };

export function getTranslations(lang) {
  return translations[lang] || translations.en;
}

export function buildProducts(lang) {
  const t = getTranslations(lang);
  return Object.fromEntries(
    PRODUCT_KEYS.map((key) => [
      key,
      { ...PRODUCT_STATS[key], name: t.products[key].name },
    ]),
  );
}

export function buildUpgrades(lang) {
  const t = getTranslations(lang);
  return Object.fromEntries(
    UPGRADE_KEYS.map((key) => [
      key,
      { ...UPGRADE_STATS[key], name: t.upgrades[key].name, desc: t.upgrades[key].desc },
    ]),
  );
}

export function buildEvents(lang) {
  const t = getTranslations(lang);
  return EVENT_EFFECTS.map((stats, i) => ({ ...stats, text: t.events[i] }));
}

export const DEMO_STEP_META = [
  { highlight: "stats", pulse: null, mock: { money: 100, revenue: 0, rep: 0, day: 1, crafting: null, inventory: [], upgrades: [] } },
  { highlight: "craft", pulse: "craft-btn", mock: { money: 92, revenue: 0, rep: 0, day: 1, crafting: [{ key: "canvas_tote", daysLeft: 1 }], inventory: [], upgrades: [] } },
  { highlight: "nextday", pulse: "nextday-btn", mock: { money: 92, revenue: 0, rep: 0, day: 2, crafting: null, inventory: [{ key: "canvas_tote", count: 1 }], upgrades: [] } },
  { highlight: "inventory", pulse: "sell-btn", mock: { money: 114, revenue: 22, rep: 0, day: 2, crafting: null, inventory: [], upgrades: [] } },
  { highlight: "upgrades", pulse: "upgrade-btn", mock: { money: 64, revenue: 22, rep: 0, day: 5, crafting: null, inventory: [], upgrades: ["sewing_machine"] } },
  { highlight: "craft", pulse: "craft-advanced", mock: { money: 340, revenue: 4200, rep: 48, day: 28, week: 4, crafting: [{ key: "weekender", daysLeft: 1 }], inventory: [{ key: "laptop_sleeve", count: 2 }], upgrades: [] } },
  { highlight: "win", pulse: null, mock: { money: 2840, revenue: 10000, rep: 100, day: 62, crafting: null, inventory: [], upgrades: [], won: true } },
];

export function buildDemoSteps(lang) {
  const t = getTranslations(lang);
  const products = buildProducts(lang);
  const upgrades = buildUpgrades(lang);

  return DEMO_STEP_META.map((meta, i) => {
    const step = t.demo.steps[i];
    const mock = { ...meta.mock, log: step.log };

    if (meta.mock.crafting) {
      mock.crafting = meta.mock.crafting.map((c) => ({
        emoji: products[c.key].emoji,
        name: products[c.key].name,
        daysLeft: c.daysLeft,
      }));
    }
    if (meta.mock.inventory?.length) {
      mock.inventory = meta.mock.inventory.map((item) => ({
        emoji: products[item.key].emoji,
        name: products[item.key].name,
        count: item.count,
      }));
    }
    if (meta.mock.upgrades?.length) {
      mock.upgrades = meta.mock.upgrades.map((key) => upgrades[key].name);
    }

    return {
      title: step.title,
      caption: step.caption,
      highlight: meta.highlight,
      mock: { ...mock, pulse: meta.pulse },
      upgradeName: step.upgradeName ? upgrades.sewing_machine.name : null,
      upgradeDesc: step.upgradeName ? upgrades.sewing_machine.desc : null,
    };
  });
}