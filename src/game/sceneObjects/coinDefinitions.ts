import { GameState } from "../state/gameState";
import { BigCoinData } from "./BigCoin";

interface TierDefinition {
  name: string;
  availableCoins: BigCoinData[];
}

export const ScalingLogics = {
  linear: (coins: number) => 1 + coins / 100,
  logarithmic: (coins: number) => 1 + Math.log10(coins + 1),
  squareRoot: (coins: number) => 1 + Math.sqrt(coins) / 10,
  flat: () => 1,
};

const CURRENT_SCALING_LOGIC = ScalingLogics.logarithmic;

const getPower = (state: GameState, tier: number, fixedCoins?: number) => {
  const coinsToUse = fixedCoins !== undefined ? fixedCoins : state.localCoins;
  return tier * CURRENT_SCALING_LOGIC(coinsToUse);
};

// --- SNAKE COIN ---
export const generateSnakeCoin = (
  tier: number,
  fixed?: number,
): BigCoinData => ({
  tier,
  texture: "moneda_vida",
  name: `Snake Coin T${tier}`,
  passCost: 55 * tier,
  option1: {
    tier,
    face: "head",
    name: "Viper Vitality",
    kind: "passive",
    texture: "moneda_vida",
    description: "Multiplies Max Health.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        healthBase:
          s.baseStats.healthBase * (1 + 0.2 * getPower(s, tier, fixed)),
      },
    }),
  },
  option2: {
    tier,
    face: "tail",
    name: "Snake Bite",
    kind: "passive",
    texture: "moneda_vida_mala",
    description: "Reduces Max Health %.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        healthBase:
          s.baseStats.healthBase / (1 + 0.2 * getPower(s, tier, fixed)),
      },
    }),
  },
});

// --- ARES COIN ---
export const generateAresCoin = (
  tier: number,
  fixed?: number,
): BigCoinData => ({
  tier,
  texture: "moneda_ares",
  name: `Ares Coin T${tier}`,
  passCost: 85 * tier,
  option1: {
    tier,
    face: "head",
    name: "God of War",
    kind: "passive",
    texture: "moneda_ares",
    description: "Multiplies Attack Power.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        attackBase:
          s.baseStats.attackBase * (1 + 0.15 * getPower(s, tier, fixed)),
      },
    }),
  },
  option2: {
    tier,
    face: "tail",
    name: "Cowardice",
    kind: "passive",
    texture: "moneda_cuchillito",
    description: "Reduces Attack Power %.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        attackBase:
          s.baseStats.attackBase / (1 + 0.15 * getPower(s, tier, fixed)),
      },
    }),
  },
});

// --- SMELL COIN ---
export const generateSmellCoin = (
  tier: number,
  fixed?: number,
): BigCoinData => ({
  tier,
  texture: "moneda_peste",
  name: `Smell Coin T${tier}`,
  passCost: 100 * tier,
  option1: {
    onEffectEnd: () => {},
    onEffectTick: () => {},
    tier,
    face: "head",
    name: "Toxic Cloud",
    kind: "active",
    texture: "moneda_peste",
    description: "Deadly stench intervals.",
    onEffectStart(scene) {
      const p = getPower(scene.fatManager.getTransformedState(), tier, fixed);
      scene.time.addEvent({
        delay: 5000 / (1 + 0.5 * p),
        callback: scene.infernallSmell_Cara,
        callbackScope: scene,
        loop: true,
      });
    },
  },
  option2: {
    onEffectEnd: () => {},
    onEffectTick: () => {},
    tier,
    face: "tail",
    name: "Sweet Aroma",
    kind: "active",
    texture: "moneda_curita",
    description: "Healing smell intervals.",
    onEffectStart(scene) {
      const p = getPower(scene.fatManager.getTransformedState(), tier, fixed);
      scene.time.addEvent({
        delay: 7000 / (1 + 0.5 * p),
        callback: scene.infernallSmell_Cruz,
        callbackScope: scene,
        loop: true,
      });
    },
  },
});

// --- RUN COIN ---
export const generateRunCoin = (tier: number, fixed?: number): BigCoinData => ({
  tier,
  texture: "moneda_sonic",
  name: `Run Coin T${tier}`,
  passCost: 100 * tier,
  option1: {
    tier,
    face: "head",
    name: "Sonic Speed",
    kind: "passive",
    texture: "moneda_sonic",
    description: "Multiplies Speed.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        speedBase:
          s.baseStats.speedBase * (1 + 0.05 * getPower(s, tier, fixed)),
      },
    }),
  },
  option2: {
    tier,
    face: "tail",
    name: "Heavy Legs",
    kind: "passive",
    texture: "moneda_caracol",
    description: "Reduces Speed %.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        speedBase:
          s.baseStats.speedBase / (1 + 0.05 * getPower(s, tier, fixed)),
      },
    }),
  },
});

// --- REVIVE COIN ---
export const generateReviveCoin = (
  tier: number,
  fixed?: number,
): BigCoinData => ({
  tier,
  texture: "moneda_pulpo",
  name: `Revive Coin T${tier}`,
  passCost: 100 * tier,
  option1: {
    tier,
    face: "head",
    name: "Eternal Spirit",
    kind: "passive",
    texture: "moneda_pulpo",
    description: "Multiplies Regeneration.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        regenBase: s.baseStats.regenBase * (1 + 0.1 * getPower(s, tier, fixed)),
      },
    }),
  },
  option2: {
    tier,
    face: "tail",
    name: "Old Age",
    kind: "passive",
    texture: "moneda_pulpo",
    description: "Reduces Regeneration %.",
    modifier: (s) => ({
      ...s,
      baseStats: {
        ...s.baseStats,
        regenBase: s.baseStats.regenBase / (1 + 0.1 * getPower(s, tier, fixed)),
      },
    }),
  },
});

export const coinDefinitions: TierDefinition[] = [
  {
    name: "Tier 1",
    availableCoins: [
      generateSnakeCoin(1),
      generateAresCoin(1),
      generateSmellCoin(1),
      generateReviveCoin(1),
      generateRunCoin(1),
    ],
  },
  {
    name: "Tier 2",
    availableCoins: [
      generateSnakeCoin(2),
      generateAresCoin(2),
      generateSmellCoin(2),
      generateReviveCoin(2),
      generateRunCoin(2),
    ],
  },
  {
    name: "Tier 3",
    availableCoins: [
      generateSnakeCoin(3),
      generateAresCoin(3),
      generateSmellCoin(3),
      generateReviveCoin(3),
      generateRunCoin(3),
    ],
  },
];
