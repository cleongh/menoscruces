import { BigCoinData } from "./BigCoin";

interface TierDefinition {
  name: string;
  availableCoins: BigCoinData[];
}

export const coinDefinitions: TierDefinition[] = [
  {
    name: "Tier 1",
    availableCoins: [
      {
        texture: "big-coin",
        name: "Moneda Vital",
        passCost: 55,
        option1: {
          name: "+10 Extra Health",
          description: "Increases your maximum health by 10 points.",
          kind: "passive",
          texture: "coin",
          modifier: (state) => {
            const newMaxHealth = state.baseStats.healthBase + 10;
            return {
              ...state,
              baseStats: {
                ...state.baseStats,
                healthBase: newMaxHealth,
              },
            };
          },
        },
        option2: {
          name: "-10 Extra Health",
          description: "Decreases your maximum health by 10 points.",
          kind: "passive",
          texture: "coin",
          modifier: (state) => {
            const newMaxHealth = state.baseStats.healthBase - 10;
            return {
              ...state,
              baseStats: {
                ...state.baseStats,
                healthBase: newMaxHealth,
              },
            };
          },
        },
      },
    ],
  },
];
