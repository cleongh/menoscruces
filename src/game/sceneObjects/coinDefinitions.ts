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

const getLocalCoinPower = (state: GameState, tier: number) => {
  return tier * CURRENT_SCALING_LOGIC(state.localCoins);
};

// --- SNAKE COIN (Health) ---
export const generateSnakeCoin = (tier: number): BigCoinData => ({
  texture: "moneda_vida",
  name: `Snake Coin T${tier}`,
  passCost: 55 * tier,
  option1: {
    face: "head",
    name: "Viper Vitality",
    description: `Multiplies Max Health (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_vida",
    modifier: (state) => {
      const multiplier = 1 + 0.2 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          healthBase: state.baseStats.healthBase * multiplier,
        },
      };
    },
  },
  option2: {
    face: "tail",
    name: "Snake Bite",
    description: `Reduces Max Health % (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_vida_mala",
    modifier: (state) => {
      const divider = 1 + 0.2 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          healthBase: state.baseStats.healthBase / divider,
        },
      };
    },
  },
});

// --- ARES COIN (Attack) ---
export const generateAresCoin = (tier: number): BigCoinData => ({
  texture: "moneda_ares",
  name: `Ares Coin T${tier}`,
  passCost: 85 * tier,
  option1: {
    face: "head",
    name: "God of War",
    description: `Multiplies Attack Power (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_ares",
    modifier: (state) => {
      const multiplier = 1 + 0.15 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          attackBase: state.baseStats.attackBase * multiplier,
        },
      };
    },
  },
  option2: {
    face: "tail",
    name: "Cowardice",
    description: `Reduces Attack Power % (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_cuchillito",
    modifier: (state) => {
      const divider = 1 + 0.15 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          attackBase: state.baseStats.attackBase / divider,
        },
      };
    },
  },
});

// --- SMELL COIN (Active - Frequency) ---
export const generateSmellCoin = (tier: number): BigCoinData => ({
  texture: "moneda_peste",
  name: `Smell Coin T${tier}`,
  passCost: 100 * tier,
  option1: {
    face: "head",
    name: "Toxic Cloud",
    description: `Emits a deadly stench (Tier ${tier}).`,
    kind: "active",
    texture: "moneda_peste",
    onEffectEnd: () => {},
    onEffectTick: () => {},
    onEffectStart(scene) {
      const freqMultiplier =
        1 +
        0.5 * getLocalCoinPower(scene.fatManager.getTransformedState(), tier);
      scene.time.addEvent({
        delay: 5000 / freqMultiplier,
        callback: scene.infernallSmell_Cara,
        callbackScope: scene,
        loop: true,
      });
    },
  },
  option2: {
    face: "tail",
    name: "Sweet Aroma",
    description: `Emits a healing smell (Tier ${tier}).`,
    kind: "active",
    texture: "moneda_curita",
    onEffectEnd: () => {},
    onEffectTick: () => {},
    onEffectStart(scene) {
      const freqMultiplier =
        1 +
        0.5 * getLocalCoinPower(scene.fatManager.getTransformedState(), tier);
      scene.time.addEvent({
        delay: 7000 / freqMultiplier,
        callback: scene.infernallSmell_Cruz,
        callbackScope: scene,
        loop: true,
      });
    },
  },
});

// --- RUN COIN (Speed) ---
export const generateRunCoin = (tier: number): BigCoinData => ({
  texture: "moneda_sonic",
  name: `Run Coin T${tier}`,
  passCost: 100 * tier,
  option1: {
    face: "head",
    name: "Sonic Speed",
    description: `Multiplies Movement Speed (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_sonic",
    modifier: (state) => {
      const multiplier = 1 + 0.05 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          speedBase: state.baseStats.speedBase * multiplier,
        },
      };
    },
  },
  option2: {
    face: "tail",
    name: "Heavy Legs",
    description: `Reduces Movement Speed % (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_caracol",
    modifier: (state) => {
      const divider = 1 + 0.05 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          speedBase: state.baseStats.speedBase / divider,
        },
      };
    },
  },
});

// --- REVIVE COIN (Regen) ---
export const generateReviveCoin = (tier: number): BigCoinData => ({
  texture: "moneda_pulpo",
  name: `Revive Coin T${tier}`,
  passCost: 100 * tier,
  option1: {
    face: "head",
    name: "Eternal Spirit",
    description: `Multiplies Regeneration (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_pulpo",
    modifier: (state) => {
      const multiplier = 1 + 0.1 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          regenBase: state.baseStats.regenBase * multiplier,
        },
      };
    },
  },
  option2: {
    face: "tail",
    name: "Old Age",
    description: `Reduces Regeneration % (Tier ${tier}).`,
    kind: "passive",
    texture: "moneda_pulpo",
    modifier: (state) => {
      const divider = 1 + 0.1 * getLocalCoinPower(state, tier);
      return {
        ...state,
        baseStats: {
          ...state.baseStats,
          regenBase: state.baseStats.regenBase / divider,
        },
      };
    },
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
